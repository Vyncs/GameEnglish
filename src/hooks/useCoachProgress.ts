import { useEffect, useState, useCallback } from 'react';
import { api, type UserProgressResponse } from '../api/client';

/**
 * Hook leve para hidratar dados de progresso (XP, level, streak, missões,
 * urgência) na interface do English Coach.
 *
 * Estratégia: fetch único na montagem + refetch sob demanda. Não usa
 * Zustand pra não inflar store global por enquanto. Sprint B vai promover
 * isso pra useProgressStore quando outros lugares (Home) precisarem.
 */
export function useCoachProgress() {
  const [data, setData] = useState<UserProgressResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const next = await api.getProgress();
      setData(next);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar progresso');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancel = false;
    api
      .getProgress()
      .then((next) => {
        if (!cancel) {
          setData(next);
          setError(null);
        }
      })
      .catch((e) => {
        if (!cancel) {
          setError(e instanceof Error ? e.message : 'Erro ao carregar progresso');
        }
      })
      .finally(() => {
        if (!cancel) setLoading(false);
      });
    return () => {
      cancel = true;
    };
  }, []);

  return { data, loading, error, refresh };
}
