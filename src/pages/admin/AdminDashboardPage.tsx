import { RefreshCw, Loader2 } from 'lucide-react';
import { useAdminMetrics } from '../../hooks/useAdminMetrics';
import { MetricsCards } from '../../components/admin/MetricsCards';
import { Charts } from '../../components/admin/Charts';
import { RecentUsersTable } from '../../components/admin/RecentUsersTable';

export function AdminDashboardPage() {
  const { metrics, charts, loading, error, refetch } = useAdminMetrics();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
        <p className="text-slate-500 text-sm">Carregando métricas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-red-100 max-w-md text-center">
          <p className="text-red-600 font-medium mb-2">Erro ao carregar</p>
          <p className="text-slate-500 text-sm mb-4">{error}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 transition-colors text-sm"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div>
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-sm text-slate-500">Visão geral da plataforma</p>
        </div>
        <button
          onClick={refetch}
          className="flex items-center gap-2 px-4 py-2.5 bg-white/80 shadow-sm border border-slate-100 rounded-xl hover:bg-white transition-colors text-sm text-slate-600"
        >
          <RefreshCw className="w-4 h-4" />
          Atualizar
        </button>
      </header>

      <div className="space-y-6">
        <MetricsCards metrics={metrics} />
        <Charts data={charts} />
        <RecentUsersTable users={metrics.recentUsers} />
      </div>
    </div>
  );
}
