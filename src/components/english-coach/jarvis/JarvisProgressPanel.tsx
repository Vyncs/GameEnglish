import {
  Activity,
  Flame,
  Clock,
  Target,
  ChevronRight,
  BookOpen,
  Zap,
  Blocks,
  Puzzle,
  BookMarked,
  Trophy,
  Plus,
  Sparkles,
} from 'lucide-react';
import type { UserProgressResponse, MissionResponse } from '../../../api/client';

interface JarvisProgressPanelProps {
  data: UserProgressResponse | null;
  loading: boolean;
  onRevisarAgora?: () => void;
}

/**
 * Painel lateral esquerdo — versão compacta executiva.
 * 4 cards densos, paddings reduzidos, sem espaço morto.
 */
export function JarvisProgressPanel({ data, loading, onRevisarAgora }: JarvisProgressPanelProps) {
  if (loading || !data) return <PanelSkeleton />;

  const xpToday = data.missions.reduce(
    (sum, m) => sum + (m.completedAt ? m.xpReward : 0),
    0
  );
  const dailyXpGoal = 500;
  const dailyXpPct = Math.min(100, Math.round((xpToday / dailyXpGoal) * 100));

  return (
    <div className="space-y-2.5">
      <ProgressTodayCard
        xpToday={xpToday}
        dailyXpGoal={dailyXpGoal}
        dailyXpPct={dailyXpPct}
        currentLevel={data.currentLevel}
        currentStreak={data.streak.current}
      />
      <StreakCard
        current={data.streak.current}
        best={data.streak.best}
        weekActivity={data.streak.weekActivity}
        status={data.streak.status}
      />
      <UrgencyCard urgency={data.urgency} onRevisarAgora={onRevisarAgora} />
      <MissionsCard missions={data.missions} />
    </div>
  );
}

// ============================================================================
// 1. Progresso Hoje
// ============================================================================

function ProgressTodayCard({
  xpToday,
  dailyXpGoal,
  dailyXpPct,
  currentLevel,
  currentStreak,
}: {
  xpToday: number;
  dailyXpGoal: number;
  dailyXpPct: number;
  currentLevel: number;
  currentStreak: number;
}) {
  return (
    <div className="jarvis-card jarvis-bracket px-3 py-2.5">
      <CardHeader icon={<Activity className="w-3 h-3" />} title="Progresso Hoje" />

      <div className="flex items-baseline justify-between mt-2">
        <span className="text-[16px] font-bold tabular-nums text-cyan-300">
          {xpToday}
          <span className="ml-0.5 text-[10px] font-medium text-slate-500">XP</span>
        </span>
        <span className="text-[10px] tabular-nums text-slate-500">
          {xpToday}/{dailyXpGoal}
        </span>
      </div>

      <div
        className="mt-1.5 relative h-[3px] rounded-full overflow-hidden"
        style={{ background: 'rgba(34, 211, 238, 0.10)' }}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
          style={{
            width: `${dailyXpPct}%`,
            background: 'linear-gradient(90deg, #22d3ee 0%, #3b82f6 100%)',
            boxShadow: '0 0 8px rgba(34, 211, 238, 0.5)',
          }}
        />
      </div>

      {/* Mini stats — 3 inline */}
      <div className="mt-2.5 grid grid-cols-3 gap-1.5 text-center">
        <MiniStat icon={<BookOpen className="w-3 h-3" />} label="Cards" value="—" />
        <MiniStat
          icon={<Flame className="w-3 h-3" />}
          label="Streak"
          value={String(currentStreak)}
        />
        <MiniStat
          icon={<Sparkles className="w-3 h-3" />}
          label="Nível"
          value={String(currentLevel)}
        />
      </div>
    </div>
  );
}

function MiniStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      className="rounded-md px-1.5 py-1.5"
      style={{
        background: 'rgba(15, 21, 37, 0.55)',
        border: '1px solid rgba(34, 211, 238, 0.08)',
      }}
    >
      <div className="text-[9px] uppercase tracking-wider text-slate-500 leading-none">
        {label}
      </div>
      <div className="mt-1 flex items-center justify-center gap-1">
        <span className="text-cyan-400">{icon}</span>
        <span className="text-[13px] font-bold tabular-nums leading-none text-white">
          {value}
        </span>
      </div>
    </div>
  );
}

// ============================================================================
// 2. Streak — compact horizontal
// ============================================================================

function StreakCard({
  current,
  best,
  weekActivity,
  status,
}: {
  current: number;
  best: number;
  weekActivity: boolean[];
  status: string;
}) {
  const today = new Date();
  const dayLabels = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    return ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'][d.getDay()];
  });
  const todayIdx = 6;

  return (
    <div className="jarvis-card jarvis-bracket px-3 py-2.5">
      <CardHeader icon={<Flame className="w-3 h-3" />} title="Streak" />

      <div className="mt-1.5 flex items-baseline gap-2">
        <span className="text-[24px] font-bold leading-none tabular-nums text-white">
          {current}
        </span>
        <span className="text-[11px] text-slate-400">dias</span>
        {best > 0 && (
          <span className="ml-auto text-[10px] text-slate-500">
            Recorde <span className="font-semibold text-slate-300 tabular-nums">{best}</span>
          </span>
        )}
      </div>

      {/* Week dots — inline tight */}
      <div className="mt-2.5 flex items-center justify-between">
        {weekActivity.map((active, i) => (
          <div key={i} className="flex flex-col items-center gap-0.5">
            <span className="text-[8px] text-slate-600 leading-none">{dayLabels[i]}</span>
            <span
              className="block w-2 h-2 rounded-full"
              style={{
                background: active
                  ? 'linear-gradient(135deg, #22d3ee 0%, #3b82f6 100%)'
                  : 'rgba(34, 211, 238, 0.12)',
                boxShadow: active ? '0 0 6px rgba(34, 211, 238, 0.6)' : 'none',
                border:
                  i === todayIdx && !active ? '1px solid rgba(34, 211, 238, 0.45)' : 'none',
              }}
            />
          </div>
        ))}
      </div>

      {(status === 'broken' || status === 'none') && current === 0 && (
        <div className="mt-2 text-[10px] text-slate-500 leading-snug">
          Comece sua sequência hoje — qualquer revisão de 5+ cards conta.
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 3. Revisões Urgentes — compact
// ============================================================================

function UrgencyCard({
  urgency,
  onRevisarAgora,
}: {
  urgency: { dueToday: number; critical: number };
  onRevisarAgora?: () => void;
}) {
  if (urgency.dueToday === 0 && urgency.critical === 0) {
    return (
      <div className="jarvis-card jarvis-bracket px-3 py-2.5">
        <CardHeader icon={<Clock className="w-3 h-3" />} title="Revisões Urgentes" />
        <div className="mt-1.5 text-[12px] text-slate-400">Tudo em dia.</div>
      </div>
    );
  }

  return (
    <div className="jarvis-card jarvis-bracket px-3 py-2.5">
      <div className="flex items-center justify-between mb-1.5">
        <CardHeader icon={<Clock className="w-3 h-3" />} title="Revisões Urgentes" />
        <ChevronRight className="w-3 h-3 text-slate-600" />
      </div>

      <div className="flex items-baseline gap-2 leading-tight">
        <span className="text-[20px] font-bold tabular-nums text-cyan-300">
          {urgency.dueToday}
        </span>
        <span className="text-[11px] text-slate-400">vencendo hoje</span>
        {urgency.critical > 0 && (
          <span className="ml-auto inline-flex items-center gap-1">
            <span className="block w-1.5 h-1.5 rounded-full bg-rose-500 jv-dot-pulse" />
            <span className="text-[11px] font-semibold tabular-nums text-rose-400">
              {urgency.critical}
            </span>
            <span className="text-[10px] text-slate-500">críticos</span>
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={onRevisarAgora}
        className="jarvis-btn-ghost mt-2 w-full py-1.5 text-[11px] font-semibold tracking-wide"
      >
        Revisar agora
      </button>
    </div>
  );
}

// ============================================================================
// 4. Missões — compact rows
// ============================================================================

const MISSION_ICONS: Record<string, React.ReactNode> = {
  review_cards: <BookOpen className="w-3 h-3" />,
  correct_streak: <Zap className="w-3 h-3" />,
  complete_bricks: <Blocks className="w-3 h-3" />,
  complete_memory: <Puzzle className="w-3 h-3" />,
  read_chapter: <BookMarked className="w-3 h-3" />,
  master_card: <Trophy className="w-3 h-3" />,
  create_cards: <Plus className="w-3 h-3" />,
  study_minutes: <Clock className="w-3 h-3" />,
};

const MISSION_TITLES: Record<string, (target: number) => string> = {
  review_cards: (t) => `Revisar ${t} cards`,
  correct_streak: (t) => `Acertar ${t} em sequência`,
  complete_bricks: (t) => `Completar ${t} Bricks`,
  complete_memory: (t) => `Completar ${t} Memory`,
  read_chapter: (t) => `Ler ${t} capítulo`,
  master_card: (t) => `Dominar ${t} card`,
  create_cards: (t) => `Criar ${t} cards`,
  study_minutes: (t) => `Estudar ${t} min`,
};

function MissionsCard({ missions }: { missions: MissionResponse[] }) {
  const completed = missions.filter((m) => m.completedAt).length;
  return (
    <div className="jarvis-card jarvis-bracket px-3 py-2.5">
      <div className="flex items-center justify-between">
        <CardHeader icon={<Target className="w-3 h-3" />} title="Missões Diárias" />
        <span className="text-[10px] tabular-nums text-slate-500">
          {completed}/{missions.length}
        </span>
      </div>
      <div className="mt-2 space-y-2">
        {missions.map((m) => (
          <MissionRow key={m.id} mission={m} />
        ))}
      </div>
    </div>
  );
}

function MissionRow({ mission }: { mission: MissionResponse }) {
  const completed = !!mission.completedAt;
  const pct = Math.min(100, (mission.progress / mission.target) * 100);
  const icon = MISSION_ICONS[mission.type] ?? <Sparkles className="w-3 h-3" />;
  const title = MISSION_TITLES[mission.type]?.(mission.target) ?? mission.type;

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <span
          className="grid place-items-center w-5 h-5 rounded-md shrink-0"
          style={{
            color: completed ? '#10b981' : '#22d3ee',
            background: completed
              ? 'rgba(16, 185, 129, 0.10)'
              : 'rgba(34, 211, 238, 0.08)',
            border: completed
              ? '1px solid rgba(16, 185, 129, 0.28)'
              : '1px solid rgba(34, 211, 238, 0.18)',
          }}
        >
          {icon}
        </span>
        <span
          className={`text-[11px] flex-1 truncate ${
            completed ? 'text-slate-500 line-through' : 'text-slate-200'
          }`}
        >
          {title}
        </span>
        <span className="text-[10px] tabular-nums text-slate-400 shrink-0">
          {mission.progress}/{mission.target}
          {completed && <span className="ml-0.5 text-emerald-400">✓</span>}
        </span>
      </div>
      <div
        className="relative h-[2px] rounded-full overflow-hidden"
        style={{ background: 'rgba(34, 211, 238, 0.08)' }}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: completed
              ? 'linear-gradient(90deg, #10b981 0%, #34d399 100%)'
              : 'linear-gradient(90deg, #22d3ee 0%, #3b82f6 100%)',
          }}
        />
      </div>
    </div>
  );
}

// ============================================================================
// Helpers
// ============================================================================

function CardHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-cyan-400">{icon}</span>
      <span
        className="text-[10px] font-bold uppercase tracking-[0.16em]"
        style={{ color: '#22d3ee', textShadow: '0 0 8px rgba(34, 211, 238, 0.30)' }}
      >
        {title}
      </span>
    </div>
  );
}

function PanelSkeleton() {
  return (
    <div className="space-y-2.5">
      {[78, 110, 80, 140].map((h, i) => (
        <div
          key={i}
          className="jarvis-card animate-pulse"
          style={{ height: h, background: 'rgba(15, 21, 37, 0.5)' }}
        />
      ))}
    </div>
  );
}
