import { useState } from 'react';
import { Brain, RefreshCw, Trash2, ChevronDown, ChevronUp, Trophy, Target, BookOpen } from 'lucide-react';
import type { CoachMemory } from '../../types/englishCoach';

interface MemoryInsightsCardProps {
  memory: CoachMemory | null;
  loading: boolean;
  analyzing: boolean;
  onAnalyze: () => void;
  onReset: () => void;
}

const CEFR_COLOR: Record<string, string> = {
  A1: 'bg-rose-50 text-rose-700 border-rose-200',
  A2: 'bg-orange-50 text-orange-700 border-orange-200',
  B1: 'bg-amber-50 text-amber-700 border-amber-200',
  B2: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  C1: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  C2: 'bg-violet-50 text-violet-700 border-violet-200',
};

/**
 * Card "O Coach lembra de você" — mostra o perfil pedagógico agregado.
 *
 * UX premium: faz o aluno SENTIR que o tutor evolui com ele. Métricas claras,
 * sem sobrecarregar — só os 3-5 itens mais relevantes de cada categoria.
 */
export function MemoryInsightsCard({
  memory,
  loading,
  analyzing,
  onAnalyze,
  onReset,
}: MemoryInsightsCardProps) {
  const [expanded, setExpanded] = useState(false);

  if (loading && !memory) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white/70 p-4 shadow-sm">
        <div className="text-xs text-slate-500">Carregando memória pedagógica…</div>
      </div>
    );
  }

  if (!memory) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white/70 p-4 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Brain className="w-4 h-4 text-emerald-600" />
          O Coach ainda não tem dados sobre você. Comece uma conversa.
        </div>
      </div>
    );
  }

  const cefrCls = CEFR_COLOR[memory.cefrEstimate] || CEFR_COLOR.A1;
  const hasInsights =
    memory.weakPoints.length ||
    memory.strongPoints.length ||
    memory.topicsOfInterest.length ||
    memory.lastSessionInsights;

  return (
    <div className="rounded-3xl border border-violet-200/70 bg-gradient-to-br from-violet-50/60 via-fuchsia-50/30 to-violet-50/40 p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-violet-700" />
          <span className="text-xs font-semibold uppercase tracking-wider text-violet-900">
            Coach lembra de você
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onAnalyze}
            disabled={analyzing}
            className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-md bg-white/80 text-violet-700 border border-violet-200 hover:bg-white transition-colors disabled:opacity-60"
            title="Atualizar perfil agora"
          >
            <RefreshCw className={`w-3 h-3 ${analyzing ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-md bg-white/80 text-slate-500 border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
            title="Resetar memória"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Métricas principais */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        <Metric
          label="Nível"
          value={memory.cefrEstimate}
          className={cefrCls}
        />
        <Metric
          label="Progresso"
          value={`${memory.progressionScore}/100`}
          className="bg-emerald-50 text-emerald-700 border-emerald-200"
        />
        <Metric
          label="Confiança"
          value={`${memory.confidenceLevel}%`}
          className="bg-cyan-50 text-cyan-700 border-cyan-200"
        />
      </div>

      {/* Insight da última sessão (sempre visível se houver) */}
      {memory.lastSessionInsights && (
        <div className="mt-3 rounded-2xl bg-white/80 border border-violet-200/60 px-3 py-2">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-violet-700 mb-0.5">
            Próximo passo
          </div>
          <p className="m-0 text-xs text-slate-700 leading-relaxed">
            {memory.lastSessionInsights}
          </p>
        </div>
      )}

      {/* Expandable */}
      {hasInsights && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-violet-700 hover:text-violet-900 transition-colors"
        >
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {expanded ? 'Esconder detalhes' : 'Ver detalhes'}
        </button>
      )}

      {expanded && (
        <div className="mt-3 space-y-2.5">
          {memory.strongPoints.length > 0 && (
            <Section
              icon={<Trophy className="w-3 h-3 text-emerald-600" />}
              label="Pontos fortes"
              items={memory.strongPoints}
              chipClass="bg-emerald-50 text-emerald-800 border-emerald-200"
            />
          )}
          {memory.weakPoints.length > 0 && (
            <Section
              icon={<Target className="w-3 h-3 text-amber-600" />}
              label="Em desenvolvimento"
              items={memory.weakPoints}
              chipClass="bg-amber-50 text-amber-800 border-amber-200"
            />
          )}
          {memory.topicsOfInterest.length > 0 && (
            <Section
              icon={<BookOpen className="w-3 h-3 text-cyan-600" />}
              label="Tópicos preferidos"
              items={memory.topicsOfInterest}
              chipClass="bg-cyan-50 text-cyan-800 border-cyan-200"
            />
          )}
          {memory.studyGoals.length > 0 && (
            <Section
              icon={<Target className="w-3 h-3 text-violet-600" />}
              label="Objetivos"
              items={memory.studyGoals}
              chipClass="bg-violet-50 text-violet-800 border-violet-200"
            />
          )}
          {memory.conversationHistorySummary && (
            <div className="rounded-xl bg-white/70 border border-slate-200 px-2.5 py-1.5">
              <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-0.5">
                Onde paramos
              </div>
              <p className="m-0 text-[11px] text-slate-700 leading-relaxed">
                {memory.conversationHistorySummary}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Metric({
  label,
  value,
  className,
}: {
  label: string;
  value: string | number;
  className: string;
}) {
  return (
    <div className={`text-center px-2 py-1.5 rounded-xl border ${className}`}>
      <div className="text-[9px] uppercase tracking-wider font-semibold opacity-70">{label}</div>
      <div className="text-sm font-bold mt-0.5">{value}</div>
    </div>
  );
}

function Section({
  icon,
  label,
  items,
  chipClass,
}: {
  icon: React.ReactNode;
  label: string;
  items: string[];
  chipClass: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-slate-600 mb-1">
        {icon}
        {label}
      </div>
      <div className="flex flex-wrap gap-1">
        {items.slice(0, 5).map((item, i) => (
          <span
            key={i}
            className={`inline-flex text-[11px] px-2 py-0.5 rounded-full border ${chipClass}`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
