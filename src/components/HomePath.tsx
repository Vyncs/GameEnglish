// A tela inicial como trilha: círculos descendo em zigue-zague, no formato
// do Duolingo.
//
// Tudo o que era prateleira, KPI e painel saiu daqui — os números foram para
// a Conta. O que sobra é uma pergunta só: o que eu faço agora?
//
// As partículas ao redor do círculo ativo usam a cor de partícula do TEMA
// escolhido (ThemeScene.particle), a mesma do cenário de fundo. Assim a
// trilha brilha de laranja na Masmorra, de azul no Reino de Gelo, e assim
// por diante, sem cor fixa no código.

import { Check, Star } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useThemeStore } from '../store/useThemeStore';
import { useVerbLessonStore } from '../store/useVerbLessonStore';
import { THEMES } from '../data/themes';
import { HOME_PATH, type PathUnit } from '../data/homePath';
import { findTopic } from '../data/topics';
import { findCell } from '../data/grid4v5t2s';

/** Serpentina: o desvio lateral alterna a cada círculo. */
const offsetOf = (i: number) => Math.round(Math.sin((i * Math.PI) / 2) * 56);

/** Faíscas ao redor do círculo ativo — posição fixa para não dançar. */
const SPARKS = [
  { left: '12%', size: 5, drift: 9, dur: '2.1s', delay: '0s' },
  { left: '30%', size: 3, drift: -7, dur: '2.6s', delay: '.5s' },
  { left: '52%', size: 4, drift: 6, dur: '2.3s', delay: '1s' },
  { left: '70%', size: 3, drift: -10, dur: '2.8s', delay: '1.4s' },
  { left: '88%', size: 4, drift: 8, dur: '2.2s', delay: '.25s' },
];

/** Quantos blocos da unidade já foram concluídos. */
function unitProgress(
  unit: PathUnit,
  progress: Record<string, { stagesDone: string[] } | undefined>,
): { done: number; total: number; nextTopicId?: string } {
  if (unit.kind === 'cell') {
    const done = progress['grid-4v5t2s']?.stagesDone.includes(unit.cellId!) ? 1 : 0;
    return { done, total: 1 };
  }
  const ids = unit.topicIds ?? [];
  let done = 0;
  let nextTopicId: string | undefined;
  for (const id of ids) {
    const topic = findTopic(id);
    if (!topic) continue;
    const doneStages = progress[id]?.stagesDone ?? [];
    const complete = topic.stages.every((s) => doneStages.includes(s));
    if (complete) done += 1;
    else if (!nextTopicId) nextTopicId = id;
  }
  return { done, total: ids.length, nextTopicId };
}

export function HomePath() {
  const setViewMode = useStore((s) => s.setViewMode);
  const themeId = useThemeStore((s) => s.themeId);
  const progress = useVerbLessonStore((s) => s.progress);
  const setSelectedTopic = useVerbLessonStore((s) => s.setSelectedTopic);
  const setSelectedGridCell = useVerbLessonStore((s) => s.setSelectedGridCell);

  const theme = THEMES.find((t) => t.id === themeId) ?? THEMES[0];
  const spark = theme.scene.particle;

  const units = HOME_PATH.map((u) => ({ unit: u, ...unitProgress(u, progress) }));
  // O círculo ativo é o primeiro que ainda não fechou (o "Hoje" nunca fecha).
  const activeIndex = units.findIndex((u, i) => i > 0 && u.done < u.total);

  const open = (unit: PathUnit, nextTopicId?: string) => {
    if (unit.kind === 'today') {
      setViewMode('review-hub');
      return;
    }
    if (unit.kind === 'cell') {
      setSelectedGridCell(unit.cellId!);
      setViewMode('grid-4v5t2s');
      return;
    }
    const target = nextTopicId ?? unit.topicIds?.[0];
    if (target) {
      setSelectedTopic(target);
      setViewMode('topic');
    }
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 overflow-x-clip px-4 pb-24 pt-6">
      {units.map(({ unit, done, total, nextTopicId }, i) => {
        const isToday = unit.kind === 'today';
        const complete = !isToday && done >= total;
        const active = isToday || i === activeIndex;
        // Nada fica trancado: a trilha sugere a ordem, não impõe.
        const label =
          unit.kind === 'cell'
            ? findCell(unit.cellId!)?.opener ?? unit.hint
            : total > 1
              ? `${done}/${total} blocos`
              : unit.hint;

        return (
          <div
            key={unit.id}
            className="relative flex flex-col items-center"
            style={{ transform: `translateX(${offsetOf(i)}px)` }}
          >
            {active && !complete && (
              <div className="stage-float relative mb-2">
                <span className="block rounded-xl border-2 border-accent-line bg-surface px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-accent-text shadow-sm">
                  {isToday ? 'Comece aqui' : 'Continuar'}
                </span>
                <span className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 border-b-2 border-r-2 border-accent-line bg-surface" />
              </div>
            )}

            <div className="relative">
              {active && (
                <span
                  aria-hidden
                  className="stage-ring absolute inset-0 rounded-full"
                  style={{ background: 'var(--accent)' }}
                />
              )}

              {/* Faíscas na cor do tema, só no círculo ativo */}
              {active && (
                <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1">
                  {SPARKS.map((s, k) => (
                    <span
                      key={k}
                      className="stage-ember"
                      style={{
                        left: s.left,
                        width: s.size,
                        height: s.size,
                        background: spark,
                        boxShadow: `0 0 8px ${spark}`,
                        ['--ember-drift' as string]: `${s.drift}px`,
                        ['--ember-dur' as string]: s.dur,
                        ['--ember-delay' as string]: s.delay,
                      }}
                    />
                  ))}
                </span>
              )}

              <button
                type="button"
                onClick={() => open(unit, nextTopicId)}
                aria-label={`${unit.label} — ${unit.hint}`}
                className="relative grid h-[84px] w-[84px] place-items-center rounded-full text-3xl transition-all hover:brightness-110 active:translate-y-[3px]"
                style={{
                  background: complete
                    ? 'var(--accent-strong)'
                    : 'linear-gradient(180deg, var(--accent), var(--accent-strong))',
                  boxShadow: active
                    ? `0 6px 0 rgba(0,0,0,.3), 0 0 26px ${theme.scene.glow}`
                    : '0 6px 0 rgba(0,0,0,.28)',
                  opacity: active || complete ? 1 : 0.82,
                }}
              >
                {complete ? (
                  <Check className="h-9 w-9 text-white" strokeWidth={3} />
                ) : isToday ? (
                  <Star className="h-9 w-9 text-white" fill="currentColor" />
                ) : (
                  <span>{unit.emoji}</span>
                )}
              </button>
            </div>

            <p className="mt-2 text-center text-[15px] font-extrabold leading-tight text-primary">
              {unit.label}
            </p>
            <p className="max-w-[210px] text-center text-[11px] leading-tight text-tertiary">
              {label}
            </p>

            {/* Barra de blocos, quando a unidade tem mais de um */}
            {total > 1 && (
              <div className="mt-1 h-1.5 w-24 overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full rounded-full bg-accent transition-all"
                  style={{ width: `${(done / total) * 100}%` }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
