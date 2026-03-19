import { useEffect, useState } from 'react';
import {
  Loader2, ExternalLink,
  Link as LinkIcon, FileText, Video, File, GraduationCap,
} from 'lucide-react';
import { api, type StudentMaterial } from '../api/client';

const TYPE_META: Record<string, { label: string; icon: typeof LinkIcon; color: string }> = {
  link: { label: 'Link', icon: LinkIcon, color: 'text-blue-600 bg-blue-50' },
  text: { label: 'Texto', icon: FileText, color: 'text-emerald-600 bg-emerald-50' },
  video: { label: 'Video', icon: Video, color: 'text-red-600 bg-red-50' },
  file: { label: 'Arquivo', icon: File, color: 'text-amber-600 bg-amber-50' },
};

export function StudentMaterials() {
  const [materials, setMaterials] = useState<StudentMaterial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getStudentMaterials()
      .then(setMaterials)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 flex justify-center">
        <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-violet-100">
          <GraduationCap className="w-6 h-6 text-violet-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Materiais do Professor</h2>
          <p className="text-sm text-slate-500">Conteudo disponibilizado pelo seu professor</p>
        </div>
      </div>

      {materials.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-sm border border-slate-100 text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 mb-1">Nenhum material disponivel</p>
          <p className="text-xs text-slate-400">Seu professor ainda nao atribuiu materiais para voce</p>
        </div>
      ) : (
        <div className="space-y-3">
          {materials.map((m) => {
            const meta = TYPE_META[m.type] || TYPE_META.text;
            const Icon = meta.icon;
            return (
              <div key={`${m.id}-${m.assignedAt}`} className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-xl ${meta.color} shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-800">{m.title}</h3>
                    {m.description && <p className="text-sm text-slate-500 mt-0.5">{m.description}</p>}
                    {m.content && (
                      <div className="mt-2 p-3 bg-slate-50 rounded-xl text-sm text-slate-700 whitespace-pre-wrap">
                        {m.content}
                      </div>
                    )}
                    {m.url && (
                      <a
                        href={m.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-2 text-sm text-violet-600 hover:text-violet-700 hover:underline"
                      >
                        Abrir link <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <div className="flex items-center gap-3 mt-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${meta.color}`}>
                        {meta.label}
                      </span>
                      {m.teacher.name && (
                        <span className="text-xs text-slate-400">
                          Prof. {m.teacher.name}
                        </span>
                      )}
                      <span className="text-xs text-slate-400">
                        {new Date(m.assignedAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
