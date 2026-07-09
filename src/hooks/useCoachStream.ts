import { useCallback, useRef, useState } from 'react';
import { getToken } from '../api/client';
import type {
  CoachLevel,
  CoachMode,
  CoachStreamCallbacks,
  CoachStreamEvent,
} from '../types/englishCoach';

const API_URL =
  import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? '' : 'http://localhost:3001');

/**
 * useCoachStream — consome SSE do endpoint POST /api/english-coach/chat/stream.
 *
 * EventSource nativo só faz GET sem headers customizados, então usamos
 * `fetch` + ReadableStream e parseamos os blocos `event: foo\ndata: {...}\n\n`
 * manualmente. Custo: ~50 linhas. Benefício: header Authorization e POST body.
 *
 * Ciclo de vida:
 *   - `start(payload, callbacks)` → abre conexão; resolve quando done|error
 *   - `abort()` → cancela conexão e devolve store ao estado limpo
 *   - `isStreaming` → true entre o primeiro byte e o evento done/error
 *   - `accumulated` → conteúdo acumulado do reply (pode ser usado pra render)
 */

export interface CoachStreamPayload {
  message: string;
  level: CoachLevel;
  mode: CoachMode;
  conversationId?: string;
}

interface UseCoachStreamReturn {
  start: (payload: CoachStreamPayload, callbacks?: CoachStreamCallbacks) => Promise<void>;
  abort: () => void;
  isStreaming: boolean;
  accumulated: string;
  error: string | null;
}

export function useCoachStream(): UseCoachStreamReturn {
  const [isStreaming, setIsStreaming] = useState(false);
  const [accumulated, setAccumulated] = useState('');
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const abort = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  const start = useCallback(
    async (payload: CoachStreamPayload, callbacks?: CoachStreamCallbacks) => {
      // Cancela qualquer stream anterior
      if (abortRef.current) {
        abortRef.current.abort();
      }
      const ctrl = new AbortController();
      abortRef.current = ctrl;

      setError(null);
      setAccumulated('');
      setIsStreaming(true);

      const token = getToken();
      let res: Response;
      try {
        res = await fetch(`${API_URL}/api/english-coach/chat/stream`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'text/event-stream',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
          signal: ctrl.signal,
        });
      } catch (err) {
        if (ctrl.signal.aborted) {
          setIsStreaming(false);
          return;
        }
        const message = err instanceof Error ? err.message : 'Falha de rede';
        setError(message);
        setIsStreaming(false);
        callbacks?.onError?.(message);
        return;
      }

      if (!res.ok || !res.body) {
        // Erro HTTP antes do stream — corpo é JSON normal.
        let message = `Erro ${res.status}`;
        try {
          const data = await res.json();
          if (data?.error) message = data.error;
        } catch {
          /* noop */
        }
        setError(message);
        setIsStreaming(false);
        callbacks?.onError?.(message);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let acc = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          // Eventos SSE são separados por linha em branco (\n\n).
          const events = buffer.split('\n\n');
          buffer = events.pop() ?? '';

          for (const raw of events) {
            const trimmed = raw.trim();
            if (!trimmed) continue;
            // Ignora heartbeats (`:heartbeat`)
            if (trimmed.startsWith(':')) continue;

            const parsed = parseSseBlock(trimmed);
            if (!parsed) continue;
            const { event, data } = parsed;
            let payload: unknown;
            try {
              payload = JSON.parse(data);
            } catch {
              continue;
            }

            const evt = { type: event, ...(payload as object) } as CoachStreamEvent;

            if (evt.type === 'start') {
              callbacks?.onStart?.(evt);
            } else if (evt.type === 'token') {
              acc += evt.delta;
              setAccumulated(acc);
              callbacks?.onToken?.(evt.delta, acc);
            } else if (evt.type === 'meta') {
              callbacks?.onMeta?.(evt);
            } else if (evt.type === 'done') {
              callbacks?.onDone?.(evt.reply);
            } else if (evt.type === 'error') {
              setError(evt.message);
              callbacks?.onError?.(evt.message);
            }
          }
        }
      } catch (err) {
        if (!ctrl.signal.aborted) {
          const message = err instanceof Error ? err.message : 'Erro no stream';
          setError(message);
          callbacks?.onError?.(message);
        }
      } finally {
        setIsStreaming(false);
        if (abortRef.current === ctrl) abortRef.current = null;
      }
    },
    []
  );

  return { start, abort, isStreaming, accumulated, error };
}

/** Parse de um bloco SSE: lida com possíveis múltiplas linhas `data:`. */
function parseSseBlock(block: string): { event: string; data: string } | null {
  let event = 'message';
  let data = '';
  for (const line of block.split('\n')) {
    if (line.startsWith('event:')) {
      event = line.slice(6).trim();
    } else if (line.startsWith('data:')) {
      data += (data ? '\n' : '') + line.slice(5).trim();
    }
  }
  if (!data) return null;
  return { event, data };
}
