import { useCallback, useEffect, useState } from 'react';
import {
  Plus, Trash2, Pencil, X, Check, Loader2,
  Link as LinkIcon, FileText, Video, File, Users, UserPlus, UserMinus,
} from 'lucide-react';
import { toast } from 'sonner';
import { api, type TeacherMaterialItem, type TeacherStudent } from '../../api/client';

const TYPE_META: Record<string, { label: string; icon: typeof LinkIcon; color: string }> = {
  link: { label: 'Link', icon: LinkIcon, color: 'text-blue-600 bg-blue-50' },
  text: { label: 'Texto', icon: FileText, color: 'text-emerald-600 bg-emerald-50' },
  video: { label: 'Video', icon: Video, color: 'text-red-600 bg-red-50' },
  file: { label: 'Arquivo', icon: File, color: 'text-amber-600 bg-amber-50' },
};

export function TeacherMaterialsPage() {
  const [materials, setMaterials] = useState<TeacherMaterialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<TeacherMaterialItem | null>(null);
  const [assigning, setAssigning] = useState<TeacherMaterialItem | null>(null);

  const fetchMaterials = useCallback(async () => {
    try {
      const res = await api.getTeacherMaterials();
      setMaterials(res);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchMaterials(); }, [fetchMaterials]);

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este material?')) return;
    try {
      await api.deleteTeacherMaterial(id);
      fetchMaterials();
    } catch { toast.error('Erro ao excluir'); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Materiais</h1>
          <p className="text-sm text-slate-500">Crie e atribua materiais aos seus alunos</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white text-sm font-medium rounded-xl hover:bg-violet-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Material
        </button>
      </header>

      {materials.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-sm border border-slate-100 text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 mb-1">Nenhum material criado</p>
          <p className="text-xs text-slate-400">Clique em "Novo Material" para comecar</p>
        </div>
      ) : (
        <div className="space-y-3">
          {materials.map((m) => {
            const meta = TYPE_META[m.type] || TYPE_META.text;
            const Icon = meta.icon;
            return (
              <div key={m.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-xl ${meta.color} shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-800">{m.title}</h3>
                    {m.description && <p className="text-sm text-slate-500 mt-0.5">{m.description}</p>}
                    {m.url && (
                      <a href={m.url} target="_blank" rel="noopener noreferrer" className="text-xs text-violet-600 hover:underline mt-1 inline-block truncate max-w-[400px]">
                        {m.url}
                      </a>
                    )}
                    <div className="flex items-center gap-3 mt-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${meta.color}`}>
                        {meta.label}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                        <Users className="w-3 h-3" />
                        {m.assignedStudents.length} aluno{m.assignedStudents.length !== 1 ? 's' : ''}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(m.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => setAssigning(m)}
                      className="p-2 rounded-lg hover:bg-violet-50 text-slate-400 hover:text-violet-600 transition-colors"
                      title="Atribuir a alunos"
                    >
                      <UserPlus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditing(m)}
                      className="p-2 rounded-lg hover:bg-cyan-50 text-slate-400 hover:text-cyan-600 transition-colors"
                      title="Editar"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showCreate && (
        <MaterialFormModal
          onClose={() => setShowCreate(false)}
          onSaved={() => { setShowCreate(false); fetchMaterials(); }}
        />
      )}

      {editing && (
        <MaterialFormModal
          material={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); fetchMaterials(); }}
        />
      )}

      {assigning && (
        <AssignModal
          material={assigning}
          onClose={() => setAssigning(null)}
          onChanged={() => { setAssigning(null); fetchMaterials(); }}
        />
      )}
    </div>
  );
}

function MaterialFormModal({
  material,
  onClose,
  onSaved,
}: {
  material?: TeacherMaterialItem;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(material?.title || '');
  const [description, setDescription] = useState(material?.description || '');
  const [type, setType] = useState(material?.type || 'link');
  const [url, setUrl] = useState(material?.url || '');
  const [content, setContent] = useState(material?.content || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!title.trim()) { setError('Titulo e obrigatorio'); return; }
    setSaving(true);
    setError('');
    try {
      const data = { title: title.trim(), description: description.trim() || undefined, type, url: url.trim() || undefined, content: content.trim() || undefined };
      if (material) {
        await api.updateTeacherMaterial(material.id, data);
      } else {
        await api.createTeacherMaterial(data as Parameters<typeof api.createTeacherMaterial>[0]);
      }
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
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-slate-100 transition-colors">
          <X className="w-5 h-5 text-slate-400" />
        </button>

        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          {material ? 'Editar Material' : 'Novo Material'}
        </h3>

        {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-xl mb-4">{error}</p>}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Titulo</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40"
              placeholder="Ex: Vocabulario - Semana 1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descricao (opcional)</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 resize-none"
              placeholder="Breve descricao do material..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
            <select value={type} onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40">
              <option value="link">Link</option>
              <option value="text">Texto</option>
              <option value="video">Video</option>
              <option value="file">Arquivo</option>
            </select>
          </div>
          {(type === 'link' || type === 'video' || type === 'file') && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">URL</label>
              <input type="url" value={url} onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                placeholder="https://..." />
            </div>
          )}
          {type === 'text' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Conteudo</label>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 resize-none"
                placeholder="Digite o conteudo do material..." />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">
            Cancelar
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-xl hover:bg-violet-700 disabled:opacity-50 transition-colors">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

function AssignModal({
  material,
  onClose,
  onChanged,
}: {
  material: TeacherMaterialItem;
  onClose: () => void;
  onChanged: () => void;
}) {
  const [students, setStudents] = useState<TeacherStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const assignedIds = new Set(material.assignedStudents.map((s) => s.id));

  useEffect(() => {
    api.getTeacherStudents({ limit: 100 })
      .then((res) => setStudents(res.students))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAssign = async (studentId: string) => {
    setSaving(true);
    try {
      await api.assignTeacherMaterial(material.id, [studentId]);
      onChanged();
    } catch { toast.error('Erro ao atribuir'); }
    finally { setSaving(false); }
  };

  const handleUnassign = async (studentId: string) => {
    setSaving(true);
    try {
      await api.unassignTeacherMaterial(material.id, studentId);
      onChanged();
    } catch { toast.error('Erro ao remover'); }
    finally { setSaving(false); }
  };

  const handleAssignAll = async () => {
    const unassigned = students.filter((s) => !assignedIds.has(s.id)).map((s) => s.id);
    if (unassigned.length === 0) return;
    setSaving(true);
    try {
      await api.assignTeacherMaterial(material.id, unassigned);
      onChanged();
    } catch { toast.error('Erro ao atribuir'); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 max-h-[80vh] flex flex-col">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-slate-100 transition-colors">
          <X className="w-5 h-5 text-slate-400" />
        </button>

        <h3 className="text-lg font-semibold text-slate-800 mb-1">Atribuir Material</h3>
        <p className="text-xs text-slate-400 mb-4 truncate">{material.title}</p>

        {!loading && students.length > 0 && (
          <button onClick={handleAssignAll} disabled={saving}
            className="mb-3 text-xs text-violet-600 hover:underline self-start disabled:opacity-50">
            Atribuir a todos os alunos
          </button>
        )}

        <div className="flex-1 overflow-y-auto space-y-2">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 text-violet-500 animate-spin" />
            </div>
          ) : students.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">Nenhum aluno vinculado</p>
          ) : (
            students.map((s) => {
              const isAssigned = assignedIds.has(s.id);
              return (
                <div key={s.id} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-semibold text-xs shrink-0">
                    {(s.name || s.email).charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{s.name || '—'}</p>
                    <p className="text-xs text-slate-400 truncate">{s.email}</p>
                  </div>
                  {isAssigned ? (
                    <button onClick={() => handleUnassign(s.id)} disabled={saving}
                      className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors disabled:opacity-50"
                      title="Remover atribuicao">
                      <UserMinus className="w-4 h-4" />
                    </button>
                  ) : (
                    <button onClick={() => handleAssign(s.id)} disabled={saving}
                      className="p-1.5 rounded-lg bg-violet-50 text-violet-600 hover:bg-violet-100 transition-colors disabled:opacity-50"
                      title="Atribuir">
                      <UserPlus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="flex justify-end pt-4 mt-2 border-t border-slate-100">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
