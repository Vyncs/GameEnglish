// Trilha de etapas no formato do Duolingo: nós redondos serpenteando para
// baixo, em vez da lista vertical de cartões.
//
// As cores saem inteiras do tema ativo (--accent, --accent-strong, --surface…),
// então a trilha muda junto quando o aluno troca de cenário. No tema Masmorra
// os nós ganham brasas subindo, para combinar com a tocha do fundo.
//
// Regra de destrave: igual à de antes — uma etapa abre quando a anterior foi
// concluída. Aqui isso só mudou de aparência.

import { Brain, Mic, BookOpen, Target, Repeat, Lock, Check } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';
import { STAGE_INFO, type TopicStage } from '../data/topic';

const STAGE_ICON: Record<TopicStage, typeof Brain> = {
  memory: Brain,
  sentences: Mic,
  study: BookOpen,
  meaning: Target,
  forms: Repeat,
};

/** Serpentina: zero no começo, desviando para os lados a cada nó. */
const offsetOf = (i: number) => Math.round(Math.sin((i * Math.PI) / 2) * 52);

/** Brasas do tema Masmorra — posições fixas para não dançar a cada render. */
const EMBERS = [
  { left: '18%', size: 5, drift: 8, dur: '1.9s', delay: '0s' },
  { left: '34%', size: 3, drift: -6, dur: '2.4s', delay: '.45s' },
  { left: '56%', size: 4, drift: 5, dur: '2.1s', delay: '.9s' },
  { left: '72%', size: 3, drift: -9, dur: '2.6s', delay: '1.3s' },
  { left: '86%', size: 4, drift: 7, dur: '2.0s', delay: '.2s' },
];

export function StagePath({ stages, stagesDone, onOpen }: {
  stages: TopicStage[];
  stagesDone: string[];
  onOpen: (stage: TopicStage) => void;
}) {
  const themeId = useThemeStore((s) => s.themeId);
  const onFire = themeId === 'masmorra';

  // A primeira etapa ainda não concluída é a "atual" — a que ganha o balão.
  const currentIndex = stages.findIndex((s) => !stagesDone.includes(s));

  return (
    <div className="mt-6 flex flex-col items-center gap-3 overflow-x-clip px-2 pb-2">
      {stages.map((stage, i) => {
        const info = STAGE_INFO[stage];
        const Icon = STAGE_ICON[stage];
        const done = stagesDone.includes(stage);
        const locked = i > 0 && !stagesDone.includes(stages[i - 1]);
        const current = i === currentIndex;

        return (
          <div
            key={stage}
            className="relative flex flex-col items-center"
            style={{ transform: `translateX(${offsetOf(i)}px)` }}
          >
            {/* Balão de chamada, só no nó atual */}
            {current && !locked && (
              <div className="stage-float relative mb-2">
                <span className="block rounded-xl border-2 border-accent-line bg-surface px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-accent-text shadow-sm">
                  Começar
                </span>
                <span className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 border-b-2 border-r-2 border-accent-line bg-surface" />
              </div>
            )}

            <div className="relative">
              {/* Anel pulsante atrás do nó atual */}
              {current && !locked && (
                <span
                  aria-hidden
                  className="stage-ring absolute inset-0 rounded-full"
                  style={{ background: 'var(--accent)' }}
                />
              )}

              {/* Brasas da Masmorra, subindo do pé do nó */}
              {onFire && !locked && (
                <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1">
                  {EMBERS.map((e, k) => (
                    <span
                      key={k}
                      className="stage-ember"
                      style={{
                        left: e.left,
                        width: e.size,
                        height: e.size,
                        background: 'rgba(253, 186, 116, 0.95)',
                        boxShadow: '0 0 6px rgba(249, 115, 22, 0.9)',
                        ['--ember-drift' as string]: `${e.drift}px`,
                        ['--ember-dur' as string]: e.dur,
                        ['--ember-delay' as string]: e.delay,
                      }}
                    />
                  ))}
                </span>
              )}

              <button
                type="button"
                disabled={locked}
                onClick={() => onOpen(stage)}
                aria-label={`${info.label} — ${locked ? 'trancada' : done ? 'concluída' : 'disponível'}`}
                className={`relative grid h-[72px] w-[72px] place-items-center rounded-full transition-all active:translate-y-[3px] ${
                  locked
                    ? 'cursor-not-allowed bg-surface-2 ring-2 ring-line'
                    : 'hover:brightness-110'
                }`}
                style={
                  locked
                    ? { boxShadow: '0 4px 0 var(--surface-border)' }
                    : {
                        background: done
                          ? 'var(--accent-strong)'
                          : 'linear-gradient(180deg, var(--accent), var(--accent-strong))',
                        // A sombra sólida embaixo é o que dá o "botão com profundidade".
                        boxShadow: onFire
                          ? '0 5px 0 rgba(0,0,0,.45), 0 0 22px rgba(249,115,22,.55)'
                          : '0 5px 0 rgba(0,0,0,.28)',
                      }
                }
              >
                {locked ? (
                  <Lock className="h-6 w-6 text-faint" />
                ) : done ? (
                  <Check className="h-8 w-8 text-white" strokeWidth={3} />
                ) : (
                  <Icon className="h-8 w-8 text-white" />
                )}
              </button>
            </div>

            {/* Nome da etapa, embaixo do nó */}
            <p
              className={`mt-1.5 text-center text-[13px] font-bold ${
                locked ? 'text-faint' : 'text-primary'
              }`}
            >
              {info.label}
            </p>
            {!locked && (
              <p className="max-w-[190px] text-center text-[11px] leading-tight text-tertiary">
                {info.desc}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
