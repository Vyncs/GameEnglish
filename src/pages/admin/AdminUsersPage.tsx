import { useCallback, useEffect, useState } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Trash2,
  Crown,
  Shield,
  GraduationCap,
  Pencil,
  X,
  Check,
} from 'lucide-react';
import { api, type AdminUser, type AdminUsersResponse } from '../../api/client';

type FilterStatus = '' | 'active' | 'vip' | 'free' | 'canceled';

export function AdminUsersPage() {
  const [data, setData] = useState<AdminUsersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState<FilterStatus>('');
  const [page, setPage] = useState(1);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getAdminUsers({ search: debouncedSearch, status, page, limit: 15 });
      setData(res);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, status, page]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  useEffect(() => { setPage(1); }, [debouncedSearch, status]);

  const handleDelete = async (user: AdminUser) => {
    if (!confirm(`Tem certeza que deseja excluir "${user.email}"? Todos os dados serão perdidos.`)) return;
    setDeleting(user.id);
    try {
      await api.deleteAdminUser(user.id);
      fetchUsers();
    } catch {
      alert('Erro ao excluir usuário');
    } finally {
      setDeleting(null);
    }
  };

  const statusFilters: { value: FilterStatus; label: string }[] = [
    { value: '', label: 'Todos' },
    { value: 'active', label: 'Premium' },
    { value: 'vip', label: 'VIP' },
    { value: 'free', label: 'Free' },
    { value: 'canceled', label: 'Cancelado' },
  ];

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Usuários</h1>
        <p className="text-sm text-slate-500">Gerencie todos os usuários da plataforma</p>
      </header>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/80 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-shadow"
          />
        </div>
        <div className="flex gap-2">
          {statusFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatus(f.value)}
              className={`px-3 py-2 text-xs font-medium rounded-xl border transition-all ${
                status === f.value
                  ? 'bg-cyan-50 border-cyan-200 text-cyan-700'
                  : 'bg-white/80 border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      {data && (
        <p className="text-xs text-slate-400 mb-3">
          {data.total} usuário{data.total !== 1 ? 's' : ''} encontrado{data.total !== 1 ? 's' : ''}
          {data.totalPages > 1 && ` — Página ${data.page} de ${data.totalPages}`}
        </p>
      )}

      {/* Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
          </div>
        ) : !data || data.users.length === 0 ? (
          <div className="text-center py-20 text-slate-400 text-sm">
            Nenhum usuário encontrado
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left bg-slate-50/80 border-b border-slate-100">
                  <th className="px-4 py-3 text-slate-500 font-medium">Usuário</th>
                  <th className="px-4 py-3 text-slate-500 font-medium">Role</th>
                  <th className="px-4 py-3 text-slate-500 font-medium">Plano</th>
                  <th className="px-4 py-3 text-slate-500 font-medium">Cards</th>
                  <th className="px-4 py-3 text-slate-500 font-medium">Verificado</th>
                  <th className="px-4 py-3 text-slate-500 font-medium">Cadastro</th>
                  <th className="px-4 py-3 text-slate-500 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {data.users.map((u) => (
                  <tr key={u.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800 truncate max-w-[200px]">{u.name || '—'}</p>
                      <p className="text-xs text-slate-400 truncate max-w-[200px]">{u.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      {u.role === 'ADMIN' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 text-xs font-medium rounded-full">
                          <Crown className="w-3 h-3" /> Admin
                        </span>
                      ) : u.role === 'TEACHER' ? (
                        <div>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-violet-50 text-violet-700 text-xs font-medium rounded-full">
                            <GraduationCap className="w-3 h-3" /> Professor
                          </span>
                          {u.couponCode && (
                            <p className="text-[10px] text-violet-500 font-mono mt-0.5">Cupom: {u.couponCode}</p>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-50 text-slate-500 text-xs font-medium rounded-full">
                          <Shield className="w-3 h-3" /> User
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        u.subscriptionStatus === 'active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : u.subscriptionStatus === 'vip'
                            ? 'bg-violet-50 text-violet-700'
                            : u.subscriptionStatus === 'canceled' || u.subscriptionStatus === 'past_due'
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
                    <td className="px-4 py-3 text-slate-600">
                      {u.cardsCount} <span className="text-slate-400">/ {u.groupsCount}g</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`w-2 h-2 inline-block rounded-full ${u.emailVerified ? 'bg-emerald-400' : 'bg-slate-300'}`} />
                    </td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {new Date(u.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditingUser(u)}
                          className="p-1.5 rounded-lg hover:bg-cyan-50 text-slate-400 hover:text-cyan-600 transition-colors"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(u)}
                          disabled={deleting === u.id}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors disabled:opacity-40"
                          title="Excluir"
                        >
                          {deleting === u.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page <= 1}
            className="p-2 rounded-xl bg-white/80 border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: Math.min(data.totalPages, 7) }, (_, i) => {
            let p: number;
            if (data.totalPages <= 7) {
              p = i + 1;
            } else if (page <= 4) {
              p = i + 1;
            } else if (page >= data.totalPages - 3) {
              p = data.totalPages - 6 + i;
            } else {
              p = page - 3 + i;
            }
            return (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                  page === p
                    ? 'bg-cyan-500 text-white shadow-sm'
                    : 'bg-white/80 border border-slate-200 text-slate-500 hover:bg-white'
                }`}
              >
                {p}
              </button>
            );
          })}
          <button
            onClick={() => setPage(Math.min(data.totalPages, page + 1))}
            disabled={page >= data.totalPages}
            className="p-2 rounded-xl bg-white/80 border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-40 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSaved={() => { setEditingUser(null); fetchUsers(); }}
        />
      )}
    </div>
  );
}

function EditUserModal({ user, onClose, onSaved }: { user: AdminUser; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState(user.name || '');
  const [role, setRole] = useState(user.role);
  const [sub, setSub] = useState(user.subscriptionStatus || '');
  const [verified, setVerified] = useState(user.emailVerified);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await api.patchAdminUser(user.id, {
        name: name.trim(),
        role,
        subscriptionStatus: sub,
        emailVerified: verified,
      });
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-slate-100 transition-colors">
          <X className="w-5 h-5 text-slate-400" />
        </button>

        <h3 className="text-lg font-semibold text-slate-800 mb-1">Editar Usuario</h3>
        <p className="text-xs text-slate-400 mb-5">{user.email}</p>

        {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-xl mb-4">{error}</p>}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            >
              <option value="USER">User</option>
              <option value="TEACHER">Professor</option>
              <option value="ADMIN">Admin</option>
            </select>
            {role === 'TEACHER' && user.couponCode && (
              <p className="text-xs text-violet-600 mt-1">
                Cupom atual: <code className="px-1.5 py-0.5 bg-violet-50 rounded font-mono">{user.couponCode}</code>
              </p>
            )}
            {role === 'TEACHER' && !user.couponCode && user.role !== 'TEACHER' && (
              <p className="text-xs text-slate-400 mt-1">Um cupom sera gerado automaticamente ao salvar</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Plano</label>
            <select
              value={sub}
              onChange={(e) => setSub(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            >
              <option value="">Free</option>
              <option value="active">Premium (pagante)</option>
              <option value="vip">VIP (acesso cortesia)</option>
              <option value="canceled">Cancelado</option>
              <option value="past_due">Past Due</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-slate-700">Email verificado</label>
            <button
              type="button"
              onClick={() => setVerified(!verified)}
              className={`relative w-10 h-6 rounded-full transition-colors ${verified ? 'bg-emerald-400' : 'bg-slate-300'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${verified ? 'translate-x-4' : ''}`} />
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white text-sm font-medium rounded-xl hover:bg-cyan-600 disabled:opacity-50 transition-colors"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
