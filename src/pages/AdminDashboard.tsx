import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, LayoutDashboard, Loader2 } from 'lucide-react';
import { useAdminMetrics } from '../hooks/useAdminMetrics';
import { MetricsCards } from '../components/admin/MetricsCards';
import { Charts } from '../components/admin/Charts';
import { RecentUsersTable } from '../components/admin/RecentUsersTable';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { metrics, charts, loading, error, refetch } = useAdminMetrics();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-blue-50/50 flex items-center justify-center">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-200/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
        </div>
        <div className="flex flex-col items-center gap-3 relative z-10">
          <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
          <p className="text-slate-500 text-sm">Carregando métricas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-blue-50/50 flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-blue-50/50">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 w-72 h-72 bg-indigo-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/app')}
              className="p-2 rounded-xl bg-white/80 shadow-sm border border-slate-100 hover:bg-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
                <p className="text-sm text-slate-500">Visão geral da plataforma</p>
              </div>
            </div>
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
    </div>
  );
}
