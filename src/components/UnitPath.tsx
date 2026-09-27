// Os blocos de uma unidade, na mesma trilha vertical da Home.
//
// É o degrau entre a trilha da Home e as etapas: tocar em "Substantivos"
// mostra os sete blocos, em vez de cair direto no primeiro não concluído.
//
// Já foi horizontal, com setas. No celular ficava ruim — sete círculos grandes
// numa fileira obrigam a arrastar de lado, e o que está fora da tela não
// aparenta existir. Vertical é a rolagem que o polegar já faz, e repete o
// gesto que o aluno acabou de usar na Home.

import { ChevronLeft, Check } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useThemeStore } from '../store/useThemeStore';
import { useVerbLessonStore } from '../store/useVerbLessonStore';
import { THEMES } from '../data/themes';
import { HOME_PATH } from '../data/homePath';
import { findTopic } from '../data/topics';

/** Serpentina: o desvio lateral alterna a cada círculo, como na Home. */
const offsetOf = (i: number) => Math.round(Math.sin((i * Math.PI) / 2) * 52);

/** Faíscas ao redor do bloco atual — posição fixa para não dançar. */
const SPARKS = [
  { left: '14%', size: 5, drift: 8, dur: '2.1s', delay: '0s' },
  { left: '36%', size: 3, drift: -7, dur: '2.6s', delay: '.5s' },
  { left: '58%', size: 4, drift: 6, dur: '2.3s', delay: '1s' },
  { left: '82%', size: 3, drift: -9, dur: '2.8s', delay: '1.4s' },
];

export function UnitPath() {
  const goToHome = useStore((s) => s.goToHome);
  const setViewMode = useStore((s) => s.setViewMode);
  const themeId = useThemeStore((s) => s.themeId);
  const unitId = useVerbLessonStore((s) => s.selectedUnitId);
  const progress = useVerbLessonStore((s) => s.progress);
  const setSelectedTopic = useVerbLessonStore((s) => s.setSelectedTopic);

  const unit = HOME_PATH.find((u) => u.id === unitId);
  const theme = THEMES.find((t) => t.id === themeId) ?? THEMES[0];
  const spark = theme.scene.particle;

  if (!unit || !unit.topicIds) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-center">
        <p className="text-tertiary">Unidade não encontrada.</p>
        <button type="button" onClick={goToHome} className="mt-3 text-sm font-medium text-accent underline">
          Voltar ao início
        </button>
      </div>
    );
  }

  const blocks = unit.topicIds
    .map((id) => findTopic(id))
    .filter((t): t is NonNullable<typeof t> => Boolean(t))
    .map((topic) => {
      const doneStages = progress[topic.id]?.stagesDone ?? [];
      const doneCount = topic.stages.filter((s) => doneStages.includes(s)).length;
      return {
        topic,
        doneCount,
        total: topic.stages.length,
        complete: doneCount >= topic.stages.length,
      };
    });

  // O bloco atual é o primeiro que ainda não fechou.
  const currentIndex = blocks.findIndex((b) => !b.complete);

  const open = (topicId: string) => {
    setSelectedTopic(topicId);
    setViewMode('topic');
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <button
        type="button"
        onClick={goToHome}
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-tertiary hover:text-secondary"
      >
        <ChevronLeft className="h-4 w-4" />
        Início
      </button>

      <div className="flex items-baseline gap-2.5">
        <span className="text-3xl">{unit.emoji}</span>
        <h1 className="text-2xl font-extrabold tracking-tight text-primary">{unit.label}</h1>
      </div>
      <p className="mt-1 text-sm text-tertiary">{unit.hint}</p>

      <div className="mt-8 flex flex-col items-center gap-4 overflow-x-clip pb-20">
        {blocks.map(({ topic, doneCount, total, complete }, i) => {
          const active = i === currentIndex;
          return (
            <div
              key={topic.id}
              className="relative flex flex-col items-center"
              style={{ transform: `translateX(${offsetOf(i)}px)` }}
            >
              {active && (
                <div className="stage-float mb-2">
                  <span className="block rounded-xl border-2 border-accent-line bg-surface px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-accent-text shadow-sm">
                    Continuar
                  </span>
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

                {/* Faíscas na cor do tema, só no bloco atual */}
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
                  onClick={() => open(topic.id)}
                  aria-label={`${topic.title} — ${doneCount} de ${total} etapas`}
                  className="relative grid h-[84px] w-[84px] place-items-center rounded-full text-[36px] transition-all hover:brightness-110 active:translate-y-[3px]"
                  style={{
                    background: complete
                      ? 'var(--accent-strong)'
                      : 'linear-gradient(180deg, var(--accent), var(--accent-strong))',
                    boxShadow: active
                      ? `0 6px 0 rgba(0,0,0,.3), 0 0 26px ${theme.scene.glow}`
                      : '0 6px 0 rgba(0,0,0,.28)',
                    opacity: active || complete ? 1 : 0.85,
                  }}
                >
                  {complete ? (
                    <Check className="h-10 w-10 text-white" strokeWidth={3} />
                  ) : (
                    <span>{topic.emoji}</span>
                  )}
                </button>
              </div>

              <p className="mt-2 text-center text-[15px] font-extrabold leading-tight text-primary">
                {topic.title}
              </p>
              <p className="text-center text-xs text-tertiary tabular-nums">
                {doneCount}/{total} etapas
              </p>

              <div className="mt-1 h-2 w-24 overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full rounded-full bg-accent transition-all"
                  style={{ width: `${(doneCount / total) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
