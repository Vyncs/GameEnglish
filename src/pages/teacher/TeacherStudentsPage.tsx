import { useCallback, useEffect, useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { api, type TeacherStudentsResponse } from '../../api/client';

export function TeacherStudentsPage() {
  const [data, setData] = useState<TeacherStudentsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getTeacherStudents({ search: debouncedSearch, page, limit: 15 });
      setData(res);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, page]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);
  useEffect(() => { setPage(1); }, [debouncedSearch]);

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Meus Alunos</h1>
        <p className="text-sm text-slate-500">Alunos vinculados ao seu cupom de professor</p>
      </header>

      {/* Search */}
      <div className="relative max-w-md mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar por nome ou email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white/80 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-shadow"
        />
      </div>

      {data && (
        <p className="text-xs text-slate-400 mb-3">
          {data.total} aluno{data.total !== 1 ? 's' : ''}
          {data.totalPages > 1 && ` — Pagina ${data.page} de ${data.totalPages}`}
        </p>
      )}

      {/* Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
          </div>
        ) : !data || data.students.length === 0 ? (
          <div className="text-center py-20 text-slate-400 text-sm">
            {debouncedSearch ? 'Nenhum aluno encontrado' : 'Nenhum aluno vinculado ainda. Compartilhe seu cupom!'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left bg-slate-50/80 border-b border-slate-100">
                  <th className="px-4 py-3 text-slate-500 font-medium">Aluno</th>
                  <th className="px-4 py-3 text-slate-500 font-medium">Cards</th>
                  <th className="px-4 py-3 text-slate-500 font-medium">Grupos</th>
                  <th className="px-4 py-3 text-slate-500 font-medium">Vinculado em</th>
                </tr>
              </thead>
              <tbody>
                {data.students.map((s) => (
                  <tr key={s.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-semibold text-xs shrink-0">
                          {(s.name || s.email).charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-slate-800 truncate max-w-[200px]">{s.name || '—'}</p>
                          <p className="text-xs text-slate-400 truncate max-w-[200px]">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{s.cardsCount}</td>
                    <td className="px-4 py-3 text-slate-600">{s.groupsCount}</td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {new Date(s.joinedAt).toLocaleDateString('pt-BR')}
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
            if (data.totalPages <= 7) p = i + 1;
            else if (page <= 4) p = i + 1;
            else if (page >= data.totalPages - 3) p = data.totalPages - 6 + i;
            else p = page - 3 + i;
            return (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                  page === p
                    ? 'bg-violet-500 text-white shadow-sm'
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
    </div>
  );
}
