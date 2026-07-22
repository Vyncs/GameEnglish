import { useState } from 'react';
import {
  ArrowLeft, ArrowRight, Check, X, RotateCcw, Trophy,
  ChevronLeft, Sparkles, ListChecks, Lightbulb,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { useLessonStore } from '../store/useLessonStore';
import {
  LESSON_01, CLASSIFY_CATEGORIES, CATEGORY_LABEL, type ClassifyCategory,
} from '../data/lessonClassify';

const EMPTY_ANSWERS: Record<number, ClassifyCategory> = {};

export function LessonClassify() {
  const goToHome = useStore((s) => s.goToHome);
  const lesson = LESSON_01;

  const answers = useLessonStore((s) => s.progress[lesson.id]?.answers ?? EMPTY_ANSWERS);
  const answerQuestion = useLessonStore((s) => s.answerQuestion);
  const resetLesson = useLessonStore((s) => s.resetLesson);

  const total = lesson.questions.length;
  const answeredCount = Object.keys(answers).length;
  const correctCount = lesson.questions.filter((q) => answers[q.id] === q.answer).length;
  const wrongCount = answeredCount - correctCount;
  const allAnswered = answeredCount === total;

  const firstUnanswered = lesson.questions.findIndex((q) => !answers[q.id]);
  const [index, setIndex] = useState(firstUnanswered === -1 ? 0 : firstUnanswered);
  const [showResults, setShowResults] = useState(false);
  const [showHints, setShowHints] = useState(false);

  const current = lesson.questions[index];
  const chosen = answers[current.id];
  const isAnswered = Boolean(chosen);
  const isCorrect = chosen === current.answer;

  const handleAnswer = (cat: ClassifyCategory) => {
    if (isAnswered) return;
    answerQuestion(lesson.id, current.id, cat);
  };

  const goNext = () => setIndex((i) => Math.min(i + 1, total - 1));
  const goPrev = () => setIndex((i) => Math.max(i - 1, 0));

  const handleReset = () => {
    resetLesson(lesson.id);
    setIndex(0);
    setShowResults(false);
  };

  // ---------------- Tela de resultados ----------------
  if (showResults) {
    const pct = Math.round((correctCount / total) * 100);
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-surface backdrop-blur rounded-2xl shadow-xl border border-line overflow-hidden">
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 px-6 py-8 text-center text-white">
            <Trophy className="mx-auto mb-3 h-12 w-12" />
            <h2 className="text-2xl font-bold">Aula concluída! 🎉</h2>
            <p className="mt-1 text-white/85">Você classificou todas as {total} frases.</p>
            <div className="mt-5 inline-flex items-center gap-6 rounded-2xl bg-white/15 px-6 py-3 backdrop-blur">
              <div className="text-center">
                <p className="text-3xl font-bold tabular-nums">{correctCount}</p>
                <p className="text-xs text-white/85">acertos</p>
              </div>
              <div className="h-8 w-px bg-white/25" />
              <div className="text-center">
                <p className="text-3xl font-bold tabular-nums">{wrongCount}</p>
                <p className="text-xs text-white/85">erros</p>
              </div>
              <div className="h-8 w-px bg-white/25" />
              <div className="text-center">
                <p className="text-3xl font-bold tabular-nums">{pct}%</p>
                <p className="text-xs text-white/85">aproveitamento</p>
              </div>
            </div>
          </div>

          <div className="p-5">
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-secondary">
              <ListChecks className="h-4 w-4 text-cyan-600" />
              Revisão das respostas
            </p>
            <div className="max-h-[46vh] space-y-2 overflow-y-auto pr-1">
              {lesson.questions.map((q) => {
                const a = answers[q.id];
                const ok = a === q.answer;
                return (
                  <div
                    key={q.id}
                    className={`rounded-xl border px-3 py-2.5 ${
                      ok ? 'border-emerald-200 bg-emerald-50/70' : 'border-red-200 bg-red-50/70'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white ${
                          ok ? 'bg-emerald-500' : 'bg-red-500'
                        }`}
                      >
                        {ok ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm text-secondary">
                          <span className="font-semibold tabular-nums text-faint">{q.id}.</span> {q.pt}
                        </p>
                        <p className="mt-0.5 text-xs text-tertiary">
                          {ok ? (
                            <>Você acertou: <strong className="text-emerald-700">{CATEGORY_LABEL[q.answer]}</strong></>
                          ) : (
                            <>
                              Sua resposta: <strong className="text-red-600">{a ? CATEGORY_LABEL[a] : '—'}</strong> · Correta:{' '}
                              <strong className="text-emerald-700">{CATEGORY_LABEL[q.answer]}</strong>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setShowResults(false)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-line bg-surface backdrop-blur-md px-4 py-3 font-medium text-secondary transition-colors hover:bg-surface-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Rever frases
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-line bg-surface backdrop-blur-md px-4 py-3 font-medium text-secondary transition-colors hover:bg-surface-2"
              >
                <RotateCcw className="h-4 w-4" />
                Refazer aula
              </button>
              <button
                type="button"
                onClick={goToHome}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 font-semibold text-white transition-opacity hover:opacity-90"
              >
                Voltar ao início
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- Tela do quiz ----------------
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Topo: voltar + progresso */}
      <div className="mb-4">
        <button
          type="button"
          onClick={goToHome}
          className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-tertiary hover:text-secondary"
        >
          <ChevronLeft className="h-4 w-4" />
          Início
        </button>

        <div className="flex items-center justify-between gap-3">
          <h1 className="text-lg font-bold text-primary">{lesson.title}</h1>
          <span className="shrink-0 rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold tabular-nums text-cyan-700">
            {answeredCount}/{total}
          </span>
        </div>

        {/* Barra de progresso */}
        <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300"
            style={{ width: `${(answeredCount / total) * 100}%` }}
          />
        </div>
        <div className="mt-1.5 flex items-center justify-between text-xs text-tertiary">
          <span className="inline-flex items-center gap-1 text-emerald-600">
            <Check className="h-3.5 w-3.5" /> {correctCount} acertos
          </span>
          <span className="inline-flex items-center gap-1 text-red-500">
            <X className="h-3.5 w-3.5" /> {wrongCount} erros
          </span>
        </div>
      </div>

      {/* Card da pergunta */}
      <div className="rounded-2xl border border-line bg-surface backdrop-blur-md p-5 shadow-xl backdrop-blur">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-cyan-600">
            Frase {index + 1} de {total}
          </span>
        </div>
        <p className="mb-5 text-lg font-semibold leading-snug text-primary">{current.pt}</p>

        {/* Cabeçalho das opções + botão de dica */}
        <div className="mb-2.5 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-faint">
            Classifique a frase
          </span>
          <button
            type="button"
            onClick={() => setShowHints((v) => !v)}
            aria-pressed={showHints}
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors ${
              showHints
                ? 'border-amber-300 bg-amber-50 text-amber-700'
                : 'border-line bg-surface backdrop-blur-md text-tertiary hover:bg-surface-2'
            }`}
          >
            <Lightbulb className="h-3.5 w-3.5" />
            Dica
          </button>
        </div>

        {/* Legenda das regras (revelada pela dica) */}
        {showHints && (
          <div className="mb-3 space-y-1.5 rounded-xl border border-amber-200 bg-amber-50/70 p-3 animate-fade-in">
            {CLASSIFY_CATEGORIES.map((cat) => (
              <div key={cat.id} className="flex items-start gap-2 text-xs">
                <span className="flex h-5 min-w-[1.75rem] shrink-0 items-center justify-center rounded-md bg-surface px-1 font-bold text-secondary ring-1 ring-slate-200">
                  {cat.label}
                </span>
                <span className="pt-0.5 text-secondary">{cat.hint}</span>
              </div>
            ))}
          </div>
        )}

        {/* Opções compactas: A · B · B2 · C · I */}
        <div className="grid grid-cols-5 gap-2">
          {CLASSIFY_CATEGORIES.map((cat) => {
            const isThisChosen = chosen === cat.id;
            const isTheCorrect = current.answer === cat.id;

            let cls =
              'relative flex flex-col items-center justify-center gap-1 rounded-xl border py-3.5 text-center transition-all ';
            if (!isAnswered) {
              cls += 'border-line bg-surface backdrop-blur-md hover:border-cyan-300 hover:bg-cyan-50/50 active:scale-[0.97]';
            } else if (isTheCorrect) {
              cls += 'border-emerald-300 bg-emerald-50 ring-1 ring-emerald-300';
            } else if (isThisChosen) {
              cls += 'border-red-300 bg-red-50 ring-1 ring-red-300';
            } else {
              cls += 'border-line bg-surface backdrop-blur-md opacity-50';
            }

            return (
              <button
                key={cat.id}
                type="button"
                disabled={isAnswered}
                onClick={() => handleAnswer(cat.id)}
                className={cls}
                title={cat.hint}
              >
                <span
                  className={`text-lg font-extrabold leading-none ${
                    isAnswered && isTheCorrect
                      ? 'text-emerald-600'
                      : isAnswered && isThisChosen
                        ? 'text-red-600'
                        : 'text-secondary'
                  }`}
                >
                  {cat.label}
                </span>
                {isAnswered && isTheCorrect && <Check className="h-4 w-4 text-emerald-500" />}
                {isAnswered && isThisChosen && !isTheCorrect && <X className="h-4 w-4 text-red-500" />}
              </button>
            );
          })}
        </div>

        {/* Explicação (aparece após responder) */}
        {isAnswered && (
          <div
            className={`mt-4 rounded-xl border p-4 animate-fade-in ${
              isCorrect ? 'border-emerald-200 bg-emerald-50/80' : 'border-amber-200 bg-amber-50/80'
            }`}
          >
            <p className={`mb-1 flex items-center gap-2 text-sm font-bold ${isCorrect ? 'text-emerald-700' : 'text-amber-700'}`}>
              {isCorrect ? <Check className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
              {isCorrect ? 'Correto!' : `Resposta correta: ${CATEGORY_LABEL[current.answer]}`}
            </p>
            <p className="text-sm italic text-tertiary">{current.en}</p>
            <p className="mt-1.5 text-sm text-secondary">{current.explanation}</p>
          </div>
        )}
      </div>

      {/* Navegação */}
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={goPrev}
          disabled={index === 0}
          className="flex items-center gap-1.5 rounded-xl border border-line bg-surface backdrop-blur-md px-4 py-2.5 text-sm font-medium text-secondary transition-colors hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4" />
          Anterior
        </button>

        {allAnswered ? (
          <button
            type="button"
            onClick={() => setShowResults(true)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            <Trophy className="h-4 w-4" />
            Ver resultado
          </button>
        ) : (
          <button
            type="button"
            onClick={goNext}
            disabled={index === total - 1}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Próxima
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {!allAnswered && index === total - 1 && (
        <p className="mt-2 text-center text-xs text-faint">
          Ainda faltam {total - answeredCount} frase(s). Volte e responda para ver o resultado.
        </p>
      )}
    </div>
  );
}
