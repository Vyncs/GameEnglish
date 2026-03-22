import { Shield, Crown } from 'lucide-react';
import type { AdminMetrics } from '../../api/client';

interface RecentUsersTableProps {
  users: AdminMetrics['recentUsers'];
}

export function RecentUsersTable({ users }: RecentUsersTableProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-100">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Últimos Usuários Cadastrados</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-slate-100">
              <th className="pb-3 text-slate-500 font-medium">Usuário</th>
              <th className="pb-3 text-slate-500 font-medium">Role</th>
              <th className="pb-3 text-slate-500 font-medium">Plano</th>
              <th className="pb-3 text-slate-500 font-medium">Data</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-slate-50 last:border-0">
                <td className="py-3">
                  <div>
                    <p className="font-medium text-slate-800">{u.name || '—'}</p>
                    <p className="text-xs text-slate-400">{u.email}</p>
                  </div>
                </td>
                <td className="py-3">
                  {u.role === 'ADMIN' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 text-xs font-medium rounded-full">
                      <Crown className="w-3 h-3" /> Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-50 text-slate-500 text-xs font-medium rounded-full">
                      <Shield className="w-3 h-3" /> User
                    </span>
                  )}
                </td>
                <td className="py-3">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                    u.subscriptionStatus === 'active'
                      ? 'bg-emerald-50 text-emerald-700'
                      : u.subscriptionStatus === 'vip'
                        ? 'bg-violet-50 text-violet-700'
                        : u.subscriptionStatus === 'canceled'
                          ? 'bg-red-50 text-red-600'
                          : 'bg-slate-50 text-slate-500'
                  }`}>
                    {u.subscriptionStatus === 'active'
                      ? 'Premium'
                      : u.subscriptionStatus === 'vip'
                        ? 'VIP'
                        : u.subscriptionStatus === 'canceled'
                          ? 'Cancelado'
                          : 'Free'}
                  </span>
                </td>
                <td className="py-3 text-slate-500">
                  {new Date(u.createdAt).toLocaleDateString('pt-BR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
