// Os números do estudo — total de cards, o que está para revisar, nível médio
// e quantos já foram dominados.
//
// Moravam na tela inicial. Saíram de lá quando a Home virou trilha: números
// são consulta, não a pergunta "o que eu faço agora". Agora vivem na Conta.

import { BookOpen, Clock, Target, Trophy, Check } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useT } from '../i18n/useT';

export function StatsPanel() {
  const t = useT();
  const cards = useStore((s) => s.cards);
  const getTotalCardsForReview = useStore((s) => s.getTotalCardsForReview);

  const totalReviewCount = getTotalCardsForReview();
  const totalCards = cards.length;
  const avgLevelNum = totalCards > 0 ? cards.reduce((acc, c) => acc + c.level, 0) / totalCards : 0;
  const avgLevel = totalCards > 0 ? avgLevelNum.toFixed(1) : '0';
  const masteredCards = cards.filter((c) => c.level === 5).length;
  const masteredPct = totalCards > 0 ? Math.round((masteredCards / totalCards) * 100) : 0;

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      <KpiCard
        icon={<BookOpen className="h-4 w-4" strokeWidth={2.4} />}
        iconTint="bg-cyan-50 text-cyan-600 ring-line"
        label={t('home.kpi.total')}
        value={totalCards}
        visual={
          totalCards > 0 ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-cyan-600">
              <BookOpen className="h-3 w-3" /> {t('home.kpi.library')}
            </span>
          ) : (
            <span className="text-[10px] font-medium text-faint">{t('home.kpi.createGroupHint')}</span>
          )
        }
      />
      <KpiCard
        icon={<Clock className="h-4 w-4" strokeWidth={2.4} />}
        iconTint="bg-accent-soft text-accent-text ring-accent-line"
        label={t('home.kpi.toReview')}
        value={totalReviewCount}
        valueColorClass={totalReviewCount > 0 ? 'text-accent-text' : 'text-primary'}
        visual={
          totalReviewCount > 0 ? (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-accent-text">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              {t('home.kpi.readyNow')}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
              <Check className="h-3 w-3" /> {t('home.kpi.allDone')}
            </span>
          )
        }
      />
      <KpiCard
        icon={<Target className="h-4 w-4" strokeWidth={2.4} />}
        iconTint="bg-accent-soft text-accent-text ring-accent-line"
        label={t('home.kpi.avgLevel')}
        value={avgLevel}
        suffix={<span className="text-base font-medium text-faint">/ 5</span>}
        visual={<LevelDots value={avgLevelNum} />}
      />
      <KpiCard
        icon={<Trophy className="h-4 w-4" strokeWidth={2.4} />}
        iconTint="bg-emerald-50 text-emerald-600 ring-emerald-100"
        label={t('home.kpi.mastered')}
        value={masteredCards}
        valueColorClass={masteredCards > 0 ? 'text-emerald-600' : 'text-primary'}
        visual={<MasteryRatio pct={masteredPct} />}
      />
    </div>
  );
}

interface KpiCardProps {
  icon: React.ReactNode;
  iconTint: string;
  label: string;
  value: number | string;
  valueColorClass?: string;
  suffix?: React.ReactNode;
  visual?: React.ReactNode;
}

function KpiCard({
  icon,
  iconTint,
  label,
  value,
  valueColorClass = 'text-primary',
  suffix,
  visual,
}: KpiCardProps) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-line bg-surface backdrop-blur-md p-4 sm:p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300/80 hover:shadow-[0_8px_24px_-8px_rgba(15,23,42,0.10)]"
      style={{
        boxShadow:
          '0 1px 2px rgba(15, 23, 42, 0.04), 0 1px 0 rgba(255, 255, 255, 1) inset',
      }}
    >
      <div className="mb-3 flex items-center justify-between">
        <div
          className={`grid h-9 w-9 place-items-center rounded-xl ring-1 ${iconTint}`}
        >
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-1">
        <p
          className={`text-2xl sm:text-3xl font-bold tracking-tight tabular-nums ${valueColorClass}`}
        >
          {value}
        </p>
        {suffix}
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-tertiary">{label}</span>
        {visual && <div className="flex shrink-0 items-center">{visual}</div>}
      </div>
    </div>
  );
}

/** 5 dots — preenchidos proporcional ao nível médio (0..5). */
function LevelDots({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((dot) => {
        const fill = Math.max(0, Math.min(1, value - (dot - 1)));
        return (
          <div
            key={dot}
            className="relative h-2 w-2 overflow-hidden rounded-full bg-surface-2"
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-accent to-accent-strong transition-all duration-700"
              style={{ width: `${fill * 100}%` }}
            />
          </div>
        );
      })}
    </div>
  );
}

/** Mini-progress de domínio (% mastered). */
function MasteryRatio({ pct }: { pct: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="relative h-1.5 w-10 overflow-hidden rounded-full bg-surface-2">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[10px] font-semibold tabular-nums text-emerald-600">
        {pct}%
      </span>
    </div>
  );
}

