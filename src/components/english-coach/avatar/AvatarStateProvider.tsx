import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { AvatarState, Viseme } from '../../../types/englishCoach';

/**
 * AvatarStateProvider — fonte única de verdade do tutor.
 *
 * Padrão: discriminated union via `state.kind`. Componentes consumidores
 * chamam transitions (`setListening`, `setThinking`, etc) e o avatar visual
 * (TutorAvatar / RiveTutor futuramente) reage. Não acoplar este provider
 * ao Rive ou a qualquer renderer — ele é puramente lógica de estado.
 *
 * Auto-revert:
 *   - `celebrating` → idle automaticamente após 2.5s
 *   - `correcting` → idle após 6s (a UI mostra a correção persistente, mas
 *     a expressão do avatar não fica "explicando" pra sempre)
 *   - demais estados são manuais
 *
 * Ordem de transições típica de um turno:
 *   idle → listening (texto/voz) → thinking (after submit)
 *        → speaking (first token + audio) → correcting (if applicable)
 *        → idle (or celebrating)
 */

interface AvatarContextValue {
  state: AvatarState;
  setIdle: () => void;
  setListening: (mode: 'voice' | 'text') => void;
  setThinking: () => void;
  setSpeaking: (opts?: {
    visemes?: Viseme[];
    audioElement?: HTMLAudioElement | null;
    startedAt?: number;
  }) => void;
  setCorrecting: (severity?: 'minor' | 'major') => void;
  setCelebrating: (reason?: 'streak' | 'milestone' | 'perfect') => void;
}

const AvatarContext = createContext<AvatarContextValue | null>(null);

interface AvatarStateProviderProps {
  children: ReactNode;
  /** Override inicial — útil para testes / Storybook. */
  initialState?: AvatarState;
}

const IDLE: AvatarState = { kind: 'idle' };

const AUTO_REVERT_MS: Partial<Record<AvatarState['kind'], number>> = {
  celebrating: 2500,
  correcting: 6000,
};

export function AvatarStateProvider({
  children,
  initialState = IDLE,
}: AvatarStateProviderProps) {
  const [state, setState] = useState<AvatarState>(initialState);
  const revertTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Limpa timer pendente sempre que estado muda
  const transition = useCallback((next: AvatarState) => {
    if (revertTimerRef.current) {
      clearTimeout(revertTimerRef.current);
      revertTimerRef.current = null;
    }
    setState(next);
    const ttl = AUTO_REVERT_MS[next.kind];
    if (ttl) {
      revertTimerRef.current = setTimeout(() => {
        setState((current) => (current.kind === next.kind ? IDLE : current));
        revertTimerRef.current = null;
      }, ttl);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (revertTimerRef.current) clearTimeout(revertTimerRef.current);
    };
  }, []);

  const value = useMemo<AvatarContextValue>(
    () => ({
      state,
      setIdle: () => transition({ kind: 'idle' }),
      setListening: (mode) =>
        transition({ kind: 'listening', mode, since: Date.now() }),
      setThinking: () => transition({ kind: 'thinking', since: Date.now() }),
      setSpeaking: (opts) =>
        transition({
          kind: 'speaking',
          startedAt: opts?.startedAt ?? Date.now(),
          visemes: opts?.visemes,
          audioElement: opts?.audioElement ?? null,
        }),
      setCorrecting: (severity = 'minor') =>
        transition({ kind: 'correcting', severity, since: Date.now() }),
      setCelebrating: (reason = 'streak') =>
        transition({ kind: 'celebrating', reason, since: Date.now() }),
    }),
    [state, transition]
  );

  return <AvatarContext.Provider value={value}>{children}</AvatarContext.Provider>;
}

/**
 * Hook para ler/atualizar o estado do avatar. Lança erro fora do provider —
 * isso é proposital, evita bugs silenciosos onde o setX não tem efeito.
 */
export function useAvatarState(): AvatarContextValue {
  const ctx = useContext(AvatarContext);
  if (!ctx) {
    throw new Error('useAvatarState deve ser usado dentro de <AvatarStateProvider>');
  }
  return ctx;
}

/** Variante segura: não lança erro, retorna `null` quando fora do provider.
 *  Útil para componentes que podem ser usados em mais de um contexto. */
export function useAvatarStateOptional(): AvatarContextValue | null {
  return useContext(AvatarContext);
}
