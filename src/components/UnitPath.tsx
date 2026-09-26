// Os blocos de uma unidade, em fileira horizontal.
//
// É o degrau que faltava entre a trilha da Home e as etapas. Antes, tocar em
// "Substantivos" caía direto no primeiro bloco não concluído — o aluno não via
// que existem sete, nem podia escolher outro. Agora a unidade se abre numa
// fileira de círculos, um por bloco, e só então ele entra nas etapas.
//
// Horizontal de propósito: a trilha da Home desce, a unidade atravessa. São
// eixos diferentes para níveis diferentes, o que ajuda a saber onde se está.

import { ChevronLeft, Check } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useThemeStore } from '../store/useThemeStore';
import { useVerbLessonStore } from '../store/useVerbLessonStore';
import { THEMES } from '../data/themes';
import { HOME_PATH } from '../data/homePath';
import { findTopic } from '../data/topics';

export function UnitPath() {
  const goToHome = useStore((s) => s.goToHome);
  const setViewMode = useStore((s) => s.setViewMode);
  const themeId = useThemeStore((s) => s.themeId);
  const unitId = useVerbLessonStore((s) => s.selectedUnitId);
  const progress = useVerbLessonStore((s) => s.progress);
  const setSelectedTopic = useVerbLessonStore((s) => s.setSelectedTopic);

  const unit = HOME_PATH.find((u) => u.id === unitId);
  const theme = THEMES.find((t) => t.id === themeId) ?? THEMES[0];

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
    <div className="mx-auto max-w-4xl px-4 py-6">
      <button
        type="button"
        onClick={goToHome}
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-tertiary hover:text-secondary"
      >
        <ChevronLeft className="h-4 w-4" />
        Início
      </button>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl">{unit.emoji}</span>
        <h1 className="text-xl font-extrabold text-primary">{unit.label}</h1>
      </div>
      <p className="mt-0.5 text-sm text-tertiary">{unit.hint}</p>

      {/* A fileira: rola de lado quando não cabe */}
      <div className="-mx-4 mt-6 overflow-x-auto px-4 pb-3">
        <div className="flex min-w-max items-start gap-5">
          {blocks.map(({ topic, doneCount, total, complete }, i) => {
            const active = i === currentIndex;
            return (
              <div key={topic.id} className="flex w-[124px] flex-col items-center">
                {active && (
                  <div className="stage-float mb-2">
                    <span className="block rounded-lg border-2 border-accent-line bg-surface px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-accent-text">
                      Continuar
                    </span>
                  </div>
                )}
                {!active && <div className="mb-2 h-[22px]" aria-hidden />}

                <div className="relative">
                  {active && (
                    <span
                      aria-hidden
                      className="stage-ring absolute inset-0 rounded-full"
                      style={{ background: 'var(--accent)' }}
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => open(topic.id)}
                    aria-label={`${topic.title} — ${doneCount} de ${total} etapas`}
                    className="relative grid h-[76px] w-[76px] place-items-center rounded-full text-3xl transition-all hover:brightness-110 active:translate-y-[3px]"
                    style={{
                      background: complete
                        ? 'var(--accent-strong)'
                        : 'linear-gradient(180deg, var(--accent), var(--accent-strong))',
                      boxShadow: active
                        ? `0 5px 0 rgba(0,0,0,.3), 0 0 22px ${theme.scene.glow}`
                        : '0 5px 0 rgba(0,0,0,.28)',
                      opacity: active || complete ? 1 : 0.85,
                    }}
                  >
                    {complete ? (
                      <Check className="h-8 w-8 text-white" strokeWidth={3} />
                    ) : (
                      <span>{topic.emoji}</span>
                    )}
                  </button>
                </div>

                <p className="mt-2 text-center text-[13px] font-bold leading-tight text-primary">
                  {topic.title}
                </p>
                <p className="text-center text-[11px] text-tertiary tabular-nums">
                  {doneCount}/{total} etapas
                </p>

                <div className="mt-1 h-1.5 w-16 overflow-hidden rounded-full bg-surface-2">
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
    </div>
  );
}
