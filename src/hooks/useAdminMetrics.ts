import { useEffect, useState } from 'react';
import { api, type AdminMetrics, type AdminChartData } from '../api/client';

interface AdminData {
  metrics: AdminMetrics | null;
  charts: AdminChartData[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAdminMetrics(): AdminData {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [charts, setCharts] = useState<AdminChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [m, c] = await Promise.all([
        api.getAdminMetrics(),
        api.getAdminCharts(),
      ]);
      setMetrics(m);
      setCharts(c);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar métricas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return { metrics, charts, loading, error, refetch: fetchAll };
}
