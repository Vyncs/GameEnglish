import { Users, CreditCard, UserPlus, TrendingUp, TrendingDown, BarChart3, Layers, FolderOpen } from 'lucide-react';
import type { AdminMetrics } from '../../api/client';

interface MetricsCardsProps {
  metrics: AdminMetrics;
}

interface CardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { value: number; label: string };
  color: string;
}

function MetricCard({ title, value, subtitle, icon, trend, color }: CardProps) {
  const isPositive = trend && trend.value >= 0;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-xl ${color}`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
            isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
          }`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      <p className="text-sm text-slate-500 mt-0.5">{title}</p>
      {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
    </div>
  );
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
  const { overview, churn, content } = metrics;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Total de Usuários"
        value={overview.totalUsers}
        subtitle={`${overview.newUsersThisMonth} novos este mês`}
        icon={<Users className="w-5 h-5 text-blue-600" />}
        trend={{ value: overview.growthRate, label: 'vs mês anterior' }}
        color="bg-blue-50"
      />
      <MetricCard
        title="Assinantes Ativos"
        value={overview.paidUsers}
        subtitle={`${overview.conversionRate}% de conversão`}
        icon={<CreditCard className="w-5 h-5 text-emerald-600" />}
        color="bg-emerald-50"
      />
      <MetricCard
        title="Churn Mensal"
        value={`${churn.churnRate}%`}
        subtitle={`${churn.canceledThisMonth} cancelamento${churn.canceledThisMonth !== 1 ? 's' : ''}`}
        icon={<TrendingDown className="w-5 h-5 text-red-500" />}
        trend={churn.churnRate > 5 ? { value: -churn.churnRate, label: 'alto' } : undefined}
        color="bg-red-50"
      />
      <MetricCard
        title="Novos Usuários"
        value={overview.newUsersThisMonth}
        icon={<UserPlus className="w-5 h-5 text-violet-600" />}
        trend={{ value: overview.growthRate, label: 'crescimento' }}
        color="bg-violet-50"
      />
      <MetricCard
        title="Total de Cards"
        value={content.totalCards.toLocaleString('pt-BR')}
        subtitle={`${content.newCardsThisMonth} novos este mês`}
        icon={<Layers className="w-5 h-5 text-amber-600" />}
        color="bg-amber-50"
      />
      <MetricCard
        title="Média Cards/Usuário"
        value={content.avgCardsPerUser}
        icon={<BarChart3 className="w-5 h-5 text-cyan-600" />}
        color="bg-cyan-50"
      />
      <MetricCard
        title="Total de Grupos"
        value={content.totalGroups}
        icon={<FolderOpen className="w-5 h-5 text-indigo-600" />}
        color="bg-indigo-50"
      />
      <MetricCard
        title="Usuários com Cards"
        value={content.usersWithCards}
        subtitle={`${overview.totalUsers > 0 ? Math.round((content.usersWithCards / overview.totalUsers) * 100) : 0}% engajados`}
        icon={<UserPlus className="w-5 h-5 text-pink-600" />}
        color="bg-pink-50"
      />
    </div>
  );
}
