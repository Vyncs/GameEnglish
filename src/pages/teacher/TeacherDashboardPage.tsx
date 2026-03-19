import { useEffect, useState } from 'react';
import { Users, FileText, Link2, Copy, Check, Loader2 } from 'lucide-react';
import { api, type TeacherDashboard } from '../../api/client';

export function TeacherDashboardPage() {
  const [data, setData] = useState<TeacherDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.getTeacherDashboard()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCopyCoupon = () => {
    if (!data?.couponCode) return;
    navigator.clipboard.writeText(data.couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-sm text-slate-500">Visao geral do seu painel de professor</p>
      </header>

      {/* Coupon card */}
      <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl p-6 mb-6 text-white">
        <p className="text-sm text-white/80 mb-1">Seu cupom de professor</p>
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold tracking-widest font-mono">
            {data.couponCode || '---'}
          </span>
          {data.couponCode && (
            <button
              onClick={handleCopyCoupon}
              className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
              title="Copiar cupom"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          )}
        </div>
        <p className="text-xs text-white/60 mt-2">
          Compartilhe com seus alunos para que se vinculem a voce no cadastro
        </p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <MetricCard
          icon={<Users className="w-5 h-5 text-violet-600" />}
          title="Alunos"
          value={data.totalStudents}
          color="bg-violet-50"
        />
        <MetricCard
          icon={<FileText className="w-5 h-5 text-blue-600" />}
          title="Materiais"
          value={data.totalMaterials}
          color="bg-blue-50"
        />
        <MetricCard
          icon={<Link2 className="w-5 h-5 text-emerald-600" />}
          title="Atribuicoes"
          value={data.totalAssignments}
          color="bg-emerald-50"
        />
      </div>

      {/* Recent students */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Alunos Recentes</h3>
        {data.recentStudents.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">
            Nenhum aluno vinculado ainda. Compartilhe seu cupom!
          </p>
        ) : (
          <div className="space-y-3">
            {data.recentStudents.map((student) => (
              <div key={student.id} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-semibold text-sm">
                  {(student.name || student.email).charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{student.name || '—'}</p>
                  <p className="text-xs text-slate-400 truncate">{student.email}</p>
                </div>
                <span className="text-xs text-slate-400 whitespace-nowrap">
                  {new Date(student.joinedAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({ icon, title, value, color }: { icon: React.ReactNode; title: string; value: number; color: string }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-slate-100">
      <div className={`p-2.5 rounded-xl ${color} w-fit mb-3`}>{icon}</div>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      <p className="text-sm text-slate-500 mt-0.5">{title}</p>
    </div>
  );
}
