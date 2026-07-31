import { useState } from 'react';
import {
  ChevronLeft, Check, X, ArrowLeft, ArrowRight, Trophy, RotateCcw,
  Brain, Target, Lightbulb, AlertTriangle, Volume2, ListChecks,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { useLessonStore } from '../store/useLessonStore';
import { useSpeech } from '../hooks/useSpeech';
import {
  LESSON_DID_HAVE, MIND_MAP, QUICK_SUMMARY, DAILY_ROUTINE, type MapTint,
} from '../data/lessonDidHave';
import { playCorrect, playWrong } from '../utils/sfx';

const EMPTY_ANSWERS: Record<number, string> = {};

const TINT: Record<MapTint, { card: string; chip: string; bar: string; title: string }> = {
  blue: { card: 'border-blue-200 bg-blue-50', chip: 'bg-blue-100 text-blue-700', bar: 'bg-blue-500', title: 'text-blue-700' },
  green: { card: 'border-emerald-200 bg-emerald-50', chip: 'bg-emerald-100 text-emerald-700', bar: 'bg-emerald-500', title: 'text-emerald-700' },
  purple: { card: 'border-violet-200 bg-violet-50', chip: 'bg-violet-100 text-violet-700', bar: 'bg-violet-500', title: 'text-violet-700' },
  amber: { card: 'border-amber-200 bg-amber-50', chip: 'bg-amber-100 text-amber-800', bar: 'bg-amber-500', title: 'text-amber-700' },
  orange: { card: 'border-orange-200 bg-orange-50', chip: 'bg-orange-100 text-orange-800', bar: 'bg-orange-500', title: 'text-orange-700' },
  pink: { card: 'border-pink-200 bg-pink-50', chip: 'bg-pink-100 text-pink-700', bar: 'bg-pink-500', title: 'text-pink-700' },
};

export function LessonDidHave() {
  const goToHome = useStore((s) => s.goToHome);
  const lesson = LESSON_DID_HAVE;
  const [tab, setTab] = useState<'map' | 'quiz'>('map');

  const answers = useLessonStore((s) => s.progress[lesson.id]?.answers ?? EMPTY_ANSWERS);
  const total = lesson.questions.length;
  const answered = Object.keys(answers).length;
  const correct = lesson.questions.filter((q) => answers[q.id] === q.answer).length;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
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
        <span className="shrink-0 rounded-full bg-accent-soft px-3 py-1 text-xs font-bold tabular-nums text-accent-text">
          {answered}/{total}
        </span>
      </div>
      <p className="mt-0.5 text-sm text-tertiary">{lesson.subtitle}</p>

      <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-surface-2">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300"
          style={{ width: `${(answered / total) * 100}%` }}
        />
      </div>

      {/* Abas */}
      <div className="mt-4 flex gap-2">
        <TabButton active={tab === 'map'} onClick={() => setTab('map')} icon={<Brain className="h-4 w-4" />} label="Mapa mental" />
        <TabButton active={tab === 'quiz'} onClick={() => setTab('quiz')} icon={<Target className="h-4 w-4" />} label={`Treinar${answered > 0 ? ` · ${correct} acertos` : ''}`} />
      </div>

      {tab === 'map' ? <MindMap onTrain={() => setTab('quiz')} /> : <Quiz />}
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all ${
        active
          ? 'border-accent-line bg-accent-soft text-accent-text'
          : 'border-line bg-surface text-tertiary hover:bg-surface-2'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

// ============================================================================
// Mapa mental — é o que se revisa todo dia
function MindMap({ onTrain }: { onTrain: () => void }) {
  const { speak } = useSpeech();

  return (
    <div className="mt-5">
      {/* Centro do mapa */}
      <div className="rounded-2xl border border-line bg-surface p-5 text-center shadow-sm backdrop-blur-md">
        <p className="text-xs font-semibold uppercase tracking-wide text-faint">Revise · entenda · arrase</p>
        <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-primary">
          DID <span className="text-tertiary">vs</span> HAVE
        </h2>
        <p className="text-sm text-tertiary">e os 3 tipos de “já”</p>

        <div className="mt-4 grid gap-2 text-left sm:grid-cols-2">
          {QUICK_SUMMARY.map((s) => (
            <div key={s.term} className="flex items-center gap-2 rounded-xl border border-line bg-surface-2/60 px-3 py-2">
              <span className={`rounded-md px-2 py-0.5 text-[11px] font-extrabold ${TINT[s.tint].chip}`}>{s.term}</span>
              <span className="text-xs text-secondary">{s.means}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Rotina diária */}
      <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
        <p className="flex items-center gap-2 text-sm font-bold text-emerald-800">
          <ListChecks className="h-4 w-4" />
          Como revisar todo dia (1 minuto)
        </p>
        <ol className="mt-2 space-y-1.5">
          {DAILY_ROUTINE.map((step, i) => (
            <li key={step} className="flex gap-2 text-sm text-emerald-900">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-500 text-[11px] font-bold text-white">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      {/* Os 6 ramos */}
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {MIND_MAP.map((card) => {
          const tint = TINT[card.tint];
          return (
            <div key={card.id} className={`overflow-hidden rounded-2xl border ${tint.card}`}>
              <div className="flex items-center gap-2.5 px-4 pt-4">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-white/70 text-lg shadow-sm">
                  {card.emoji}
                </span>
                <div className="min-w-0">
                  <p className={`text-base font-extrabold leading-tight ${tint.title}`}>
                    {card.n}. {card.title}
                  </p>
                  <p className="truncate text-[11px] font-medium text-slate-500">{card.tag}</p>
                </div>
              </div>

              {card.structure && (
                <p className="mx-4 mt-3 rounded-xl bg-white/70 px-3 py-2 text-sm font-bold text-slate-700">
                  {card.structure}
                </p>
              )}

              <ul className="mt-3 space-y-1.5 px-4">
                {card.rules.map((r) => (
                  <li key={r} className="flex gap-2 text-sm leading-snug text-slate-700">
                    <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${tint.bar}`} />
                    {r}
                  </li>
                ))}
              </ul>

              <div className="mt-3 space-y-1.5 px-4">
                {card.examples.map((ex) => (
                  <button
                    key={ex.en}
                    type="button"
                    onClick={() => speak(ex.en, 'en-US')}
                    className="flex w-full items-start gap-2 rounded-xl bg-white/70 px-3 py-2 text-left transition-colors hover:bg-white"
                    title="Ouvir"
                  >
                    <Volume2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-slate-800">{ex.en}</span>
                      <span className="block text-xs text-slate-500">{ex.pt}</span>
                    </span>
                  </button>
                ))}
              </div>

              {card.gotcha && (
                <div className="m-4 mt-3 flex gap-2 rounded-xl bg-white/80 px-3 py-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                  <p className="text-xs leading-snug text-slate-700">{card.gotcha}</p>
                </div>
              )}
              {!card.gotcha && <div className="h-4" />}
            </div>
          );
        })}
      </div>

      {/* Dica de ouro */}
      <div className="mt-4 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <Lightbulb className="h-5 w-5 shrink-0 text-amber-500" />
        <div className="text-sm text-amber-900">
          <p className="font-bold">Dica de ouro</p>
          <p className="mt-0.5">
            “QUANDO aconteceu?” → use <b className="text-blue-700">DID</b>. “Já aconteceu na vida ou tem efeito agora?” →
            use <b className="text-emerald-700">HAVE</b>.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onTrain}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        <Target className="h-4 w-4" />
        Treinar agora
      </button>
    </div>
  );
}

// ============================================================================
// Treino
function Quiz() {
  const lesson = LESSON_DID_HAVE;
  const goToHome = useStore((s) => s.goToHome);
  const answers = useLessonStore((s) => s.progress[lesson.id]?.answers ?? EMPTY_ANSWERS);
  const answerQuestion = useLessonStore((s) => s.answerQuestion);
  const resetLesson = useLessonStore((s) => s.resetLesson);
  const { speak } = useSpeech();

  const total = lesson.questions.length;
  const firstUnanswered = lesson.questions.findIndex((q) => !answers[q.id]);
  const [index, setIndex] = useState(firstUnanswered === -1 ? 0 : firstUnanswered);
  const [showResults, setShowResults] = useState(false);

  const current = lesson.questions[index];
  const chosen = answers[current.id];
  const isAnswered = Boolean(chosen);
  const isCorrect = chosen === current.answer;
  const answeredCount = Object.keys(answers).length;
  const correctCount = lesson.questions.filter((q) => answers[q.id] === q.answer).length;
  const allAnswered = answeredCount === total;

  const choose = (opt: string) => {
    if (isAnswered) return;
    (opt === current.answer ? playCorrect : playWrong)();
    answerQuestion(lesson.id, current.id, opt);
    if (opt === current.answer && current.kind === 'did-have') speak(opt, 'en-US');
  };

  if (showResults) {
    const pct = Math.round((correctCount / total) * 100);
    return (
      <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-surface shadow-xl backdrop-blur">
        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 px-6 py-8 text-center text-white">
          <Trophy className="mx-auto mb-3 h-12 w-12" />
          <h2 className="text-2xl font-bold">Treino concluído! 🎉</h2>
          <p className="mt-1 text-white/85">
            {correctCount} de {total} certas · {pct}%
          </p>
        </div>
        <div className="p-5">
          <div className="max-h-[46vh] space-y-2 overflow-y-auto pr-1">
            {lesson.questions.map((q) => {
              const a = answers[q.id];
              const ok = a === q.answer;
              return (
                <div key={q.id} className={`rounded-xl border px-3 py-2.5 ${ok ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}`}>
                  <p className="text-sm text-secondary">
                    <span className="font-semibold tabular-nums text-faint">{q.id}.</span> {q.prompt}
                  </p>
                  <p className="mt-0.5 text-xs text-tertiary">
                    {ok ? (
                      <>Você acertou: <strong className="text-emerald-700">{q.answer}</strong></>
                    ) : (
                      <>
                        Sua resposta: <strong className="text-red-600">{a ?? '—'}</strong> · Correta:{' '}
                        <strong className="text-emerald-700">{q.answer}</strong>
                      </>
                    )}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setShowResults(false)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-line bg-surface px-4 py-3 font-medium text-secondary transition-colors hover:bg-surface-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Rever questões
            </button>
            <button
              type="button"
              onClick={() => {
                resetLesson(lesson.id);
                setIndex(0);
                setShowResults(false);
              }}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-line bg-surface px-4 py-3 font-medium text-secondary transition-colors hover:bg-surface-2"
            >
              <RotateCcw className="h-4 w-4" />
              Refazer
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
    );
  }

  return (
    <div className="mt-5">
      <div className="rounded-2xl border border-line bg-surface p-5 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-accent-text">
            Questão {index + 1} de {total}
          </span>
          <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${current.kind === 'did-have' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-800'}`}>
            {current.kind === 'did-have' ? 'DID ou HAVE' : 'ever · already · yet'}
          </span>
        </div>

        <p className="mb-1 mt-3 text-xs font-semibold uppercase tracking-wide text-faint">
          {current.kind === 'did-have' ? 'Como se diz em inglês?' : 'Complete a frase'}
        </p>
        <p className="mb-4 text-lg font-semibold leading-snug text-primary">{current.prompt}</p>

        <div className="grid gap-2.5">
          {current.options.map((opt) => {
            const isThis = chosen === opt;
            const isTheRight = opt === current.answer;
            let cls = 'flex items-center gap-2 rounded-xl border px-4 py-3 text-left text-sm transition-all ';
            if (!isAnswered) cls += 'border-line bg-surface hover:border-accent-line hover:bg-accent-soft active:scale-[0.99]';
            else if (isTheRight) cls += 'border-emerald-300 bg-emerald-50 ring-1 ring-emerald-300';
            else if (isThis) cls += 'border-red-300 bg-red-50 ring-1 ring-red-300';
            else cls += 'border-line bg-surface opacity-60';
            return (
              <button key={opt} type="button" disabled={isAnswered} onClick={() => choose(opt)} className={cls}>
                <span className="flex-1 font-medium text-secondary">{opt}</span>
                {isAnswered && isTheRight && <Check className="h-4 w-4 text-emerald-500" />}
                {isAnswered && isThis && !isTheRight && <X className="h-4 w-4 text-red-500" />}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className={`mt-4 animate-fade-in rounded-xl border p-3 text-sm ${isCorrect ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-amber-200 bg-amber-50 text-amber-800'}`}>
            <p className="font-semibold">{isCorrect ? 'Boa! ✅' : `Resposta: ${current.answer}`}</p>
            <p className="mt-0.5 text-secondary">{current.explanation}</p>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          className="flex items-center gap-1.5 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-medium text-secondary transition-colors hover:bg-surface-2 disabled:opacity-40"
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
            onClick={() => setIndex((i) => Math.min(total - 1, i + 1))}
            disabled={index === total - 1}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            Próxima
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
