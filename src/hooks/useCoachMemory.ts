import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { api, getToken } from '../api/client';
import type { CoachMemory } from '../types/englishCoach';

/**
 * useCoachMemory — leitura e atualização da memória pedagógica do user.
 *
 * Auto-fetch on mount (apenas se houver token). Re-fetch on demand via `refresh()`.
 * `analyze()` força execução do analyzer no backend (rate-limited a 3/5min).
 * `reset()` zera a memória — usado em "Recomeçar do zero".
 *
 * Estados expostos:
 *   - memory: CoachMemory | null
 *   - loading: boolean (fetch inicial ou refresh)
 *   - analyzing: boolean (análise em curso)
 *   - error: string | null
 */
export interface UseCoachMemoryReturn {
  memory: CoachMemory | null;
  loading: boolean;
  analyzing: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  analyze: () => Promise<void>;
  reset: () => Promise<void>;
}

export function useCoachMemory(): UseCoachMemoryReturn {
  const [memory, setMemory] = useState<CoachMemory | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const refresh = useCallback(async () => {
    if (!getToken()) {
      setMemory(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const m = await api.getCoachMemory();
      if (mountedRef.current) setMemory(m);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erro ao carregar memória';
      if (mountedRef.current) setError(msg);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  const analyze = useCallback(async () => {
    if (!getToken()) return;
    setAnalyzing(true);
    setError(null);
    try {
      const result = await api.analyzeCoachMemory();
      if (!mountedRef.current) return;
      setMemory(result);
      if (result.analyzed) {
        toast.success('Coach atualizou seu perfil de aprendizado');
      } else if (result.reason === 'no_api_key') {
        toast.info('Análise indisponível (servidor sem chave de IA configurada)');
      } else if (result.reason === 'threshold_not_met') {
        toast.info('Ainda não há mensagens suficientes para uma nova análise');
      } else if (result.reason === 'no_messages') {
        toast.info('Converse um pouco antes de pedir uma análise');
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erro ao analisar memória';
      if (mountedRef.current) {
        setError(msg);
        toast.error(msg);
      }
    } finally {
      if (mountedRef.current) setAnalyzing(false);
    }
  }, []);

  const reset = useCallback(async () => {
    if (!getToken()) return;
    setLoading(true);
    setError(null);
    try {
      const fresh = await api.resetCoachMemory();
      if (mountedRef.current) setMemory(fresh);
      toast.success('Memória do coach resetada');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erro ao resetar memória';
      if (mountedRef.current) {
        setError(msg);
        toast.error(msg);
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  // Auto-fetch on mount.
  useEffect(() => {
    refresh();
  }, [refresh]);

  return { memory, loading, analyzing, error, refresh, analyze, reset };
}
