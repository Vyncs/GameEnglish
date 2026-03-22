import { useCallback, useEffect, useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  RefreshCw,
  Loader2,
  CreditCard,
  Target,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { api, type AdminFinancial } from '../../api/client';

export function AdminFinancialPage() {
  const [data, setData] = useState<AdminFinancial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getAdminFinancial();
      setData(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
        <p className="text-slate-500 text-sm">Carregando dados financeiros...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-red-100 max-w-md text-center">
          <p className="text-red-600 font-medium mb-2">Erro ao carregar</p>
          <p className="text-slate-500 text-sm mb-4">{error}</p>
          <button onClick={fetch} className="px-4 py-2 bg-cyan-500 text-white rounded-xl text-sm hover:bg-cyan-600 transition-colors">
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const cards = [
    {
      title: 'MRR',
      value: fmt(data.mrr),
      subtitle: 'Só assinantes Premium (pagantes). VIP não entra.',
      icon: <DollarSign className="w-5 h-5 text-emerald-600" />,
      color: 'bg-emerald-50',
      trend: data.revenueGrowth,
    },
    {
      title: 'ARR',
      value: fmt(data.arr),
      subtitle: 'Receita Anual Recorrente',
      icon: <TrendingUp className="w-5 h-5 text-blue-600" />,
      color: 'bg-blue-50',
    },
    {
      title: 'Receita do Mês',
      value: fmt(data.revenueThisMonth),
      subtitle: `${data.revenueGrowth >= 0 ? '+' : ''}${data.revenueGrowth}% vs mês anterior`,
      icon: <CreditCard className="w-5 h-5 text-violet-600" />,
      color: 'bg-violet-50',
      trend: data.revenueGrowth,
    },
    {
      title: 'Assinantes pagantes',
      value: data.activeSubscriptions,
      subtitle: `${data.newPaidThisMonth} novo${data.newPaidThisMonth !== 1 ? 's' : ''} este mês`,
      icon: <Users className="w-5 h-5 text-cyan-600" />,
      color: 'bg-cyan-50',
    },
    {
      title: 'Usuários VIP',
      value: data.vipUsers,
      subtitle: 'Acesso cortesia (cupom). Fora da receita.',
      icon: <Sparkles className="w-5 h-5 text-violet-600" />,
      color: 'bg-violet-50',
    },
    {
      title: 'Taxa de Conversão',
      value: `${data.conversionRate}%`,
      subtitle: 'Free → Premium',
      icon: <Target className="w-5 h-5 text-amber-600" />,
      color: 'bg-amber-50',
    },
    {
      title: 'Churn Rate',
      value: `${data.churnRate}%`,
      subtitle: `${data.canceledThisMonth} cancelamento${data.canceledThisMonth !== 1 ? 's' : ''} este mês`,
      icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
      color: 'bg-red-50',
      trend: data.churnRate > 0 ? -data.churnRate : undefined,
    },
  ];

  return (
    <div>
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Financeiro</h1>
          <p className="text-sm text-slate-500">
            Receita e assinaturas pagantes; usuários VIP (cupom) aparecem à parte e não entram no MRR.
            <span className="ml-2 text-xs text-slate-400">(Preço base: {fmt(data.monthlyPrice)}/mês)</span>
          </p>
        </div>
        <button
          onClick={fetch}
          className="flex items-center gap-2 px-4 py-2.5 bg-white/80 shadow-sm border border-slate-100 rounded-xl hover:bg-white transition-colors text-sm text-slate-600"
        >
          <RefreshCw className="w-4 h-4" />
          Atualizar
        </button>
      </header>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {cards.map((c) => (
          <div key={c.title} className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2.5 rounded-xl ${c.color}`}>{c.icon}</div>
              {c.trend !== undefined && (
                <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                  c.trend >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                }`}>
                  {c.trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(c.trend)}%
                </div>
              )}
            </div>
            <p className="text-2xl font-bold text-slate-800">{c.value}</p>
            <p className="text-sm text-slate-500 mt-0.5">{c.title}</p>
            {c.subtitle && <p className="text-xs text-slate-400 mt-1">{c.subtitle}</p>}
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Receita ao Longo do Tempo</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data.revenueOverTime}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={(v) => `R$${v}`} />
              <Tooltip
                formatter={(value) => [fmt(Number(value ?? 0)), 'Receita']}
                contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
              />
              <Area type="monotone" dataKey="revenue" name="Receita" stroke="#10b981" fill="url(#colorRevenue)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Assinantes por Mês</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.revenueOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip
                contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
              />
              <Legend />
              <Bar dataKey="subscribers" name="Assinantes" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
