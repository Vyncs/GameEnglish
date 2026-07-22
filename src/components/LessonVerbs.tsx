import { useMemo, useState } from 'react';
import {
  ChevronLeft, Check, X, Volume2, RotateCcw, ArrowLeft, ArrowRight,
  Trophy, Lightbulb, Lock, CheckCircle2, Gamepad2, Puzzle, Zap, Brain,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { useVerbLessonStore } from '../store/useVerbLessonStore';
import { useSpeech } from '../hooks/useSpeech';
import { LESSON_02, VERB_STAGES, verbImg, type Verb } from '../data/lesson02Verbs';
import { MatchGame, BlitzGame, MemoryGame } from './VerbGames';

const EMPTY_STAGES: string[] = [];
// Verbos que entram no exercício de formas (irregulares com particípio; exclui "can").
const FORMS_VERBS = LESSON_02.verbs.filter((v) => v.irregular && v.participle);

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function ruleBadge(rule: Verb['rule']) {
  const map = {
    A: 'bg-cyan-100 text-cyan-700',
    B: 'bg-blue-100 text-blue-700',
    C: 'bg-violet-100 text-violet-700',
  } as const;
  return `inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold ${map[rule]}`;
}

// ============================================================================
export function LessonVerbs() {
  const goToHome = useStore((s) => s.goToHome);
  const lesson = LESSON_02;
  const stagesDone = useVerbLessonStore((s) => s.progress[lesson.id]?.stagesDone ?? EMPTY_STAGES);
  const bestMatch = useVerbLessonStore((s) => s.progress[lesson.id]?.bestMatchMs);
  const bestBlitz = useVerbLessonStore((s) => s.progress[lesson.id]?.bestBlitz);
  const bestMemory = useVerbLessonStore((s) => s.progress[lesson.id]?.bestMemory);
  const markStageDone = useVerbLessonStore((s) => s.markStageDone);
  const resetLesson = useVerbLessonStore((s) => s.resetLesson);

  const [mode, setMode] = useState<'hub' | 'study' | 'meaning' | 'forms' | 'match' | 'blitz' | 'memory'>('hub');

  const finish = (stage: string) => {
    markStageDone(lesson.id, stage);
    setMode('hub');
  };

  if (mode === 'study') return <Study onDone={() => finish('study')} onBack={() => setMode('hub')} />;
  if (mode === 'meaning') return <Meaning onDone={() => finish('meaning')} onBack={() => setMode('hub')} />;
  if (mode === 'forms') return <Forms onDone={() => finish('forms')} onBack={() => setMode('hub')} />;
  if (mode === 'match') return <MatchGame onBack={() => setMode('hub')} />;
  if (mode === 'blitz') return <BlitzGame onBack={() => setMode('hub')} />;
  if (mode === 'memory') return <MemoryGame onBack={() => setMode('hub')} />;

  const doneCount = stagesDone.length;
  const allDone = doneCount === VERB_STAGES.length;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <button
        type="button"
        onClick={goToHome}
        className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-700"
      >
        <ChevronLeft className="h-4 w-4" />
        Início
      </button>

      <div className="flex items-center justify-between gap-3">
        <h1 className="text-lg font-bold text-slate-800">{lesson.title}</h1>
        <span className="shrink-0 rounded-full bg-violet-100 px-3 py-1 text-xs font-bold tabular-nums text-violet-700">
          {doneCount}/{VERB_STAGES.length} etapas
        </span>
      </div>
      <p className="mt-0.5 text-sm text-slate-500">{lesson.subtitle}</p>

      <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-600 transition-all duration-300"
          style={{ width: `${(doneCount / VERB_STAGES.length) * 100}%` }}
        />
      </div>

      {allDone && (
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <Trophy className="h-8 w-8 shrink-0 text-emerald-500" />
          <div>
            <p className="font-bold text-emerald-800">Aula concluída! 🎉</p>
            <p className="text-sm text-emerald-700">Você passou por todas as etapas dos 25 verbos.</p>
          </div>
        </div>
      )}

      {/* Etapas */}
      <div className="mt-5 space-y-3">
        {VERB_STAGES.map((stage, i) => {
          const done = stagesDone.includes(stage.id);
          const locked = i > 0 && !stagesDone.includes(VERB_STAGES[i - 1].id);
          return (
            <button
              key={stage.id}
              type="button"
              disabled={locked}
              onClick={() => setMode(stage.id as 'study' | 'meaning' | 'forms')}
              className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all ${
                locked
                  ? 'cursor-not-allowed border-slate-200 bg-slate-50 opacity-60'
                  : done
                    ? 'border-emerald-200 bg-emerald-50/60 hover:border-emerald-300'
                    : 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md'
              }`}
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${
                  done ? 'bg-emerald-100' : 'bg-violet-50'
                }`}
              >
                {done ? <CheckCircle2 className="h-6 w-6 text-emerald-500" /> : <span>{stage.emoji}</span>}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Etapa {i + 1}
                  </span>
                  {done && <span className="text-xs font-semibold text-emerald-600">✓ concluída</span>}
                </div>
                <p className="text-base font-semibold text-slate-800">{stage.label}</p>
                <p className="text-sm text-slate-500">{stage.desc}</p>
              </div>
              {locked ? (
                <Lock className="h-5 w-5 shrink-0 text-slate-400" />
              ) : (
                <ArrowRight className="h-5 w-5 shrink-0 text-violet-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Jogos */}
      <div className="mt-8">
        <div className="mb-3 flex items-center gap-2">
          <Gamepad2 className="h-5 w-5 text-violet-500" />
          <h2 className="text-base font-bold text-slate-800">Jogos</h2>
          <span className="text-xs text-slate-400">— fixe os verbos brincando</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => setMode('match')}
            className="group flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-center transition-all hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md"
          >
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 text-white">
              <Puzzle className="h-5 w-5" />
            </div>
            <p className="font-semibold text-slate-800">Associação</p>
            <p className="text-xs text-slate-500">Pareie verbo ↔ significado contra o tempo</p>
            {bestMatch !== undefined && (
              <p className="text-xs font-semibold text-amber-600">🏆 {(bestMatch / 1000).toFixed(1)}s</p>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMode('memory')}
            className="group flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-center transition-all hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md"
          >
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
              <Brain className="h-5 w-5" />
            </div>
            <p className="font-semibold text-slate-800">Memória</p>
            <p className="text-xs text-slate-500">Vire as cartas e ache os pares</p>
            {bestMemory !== undefined && (
              <p className="text-xs font-semibold text-amber-600">🏆 {bestMemory} jogadas</p>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMode('blitz')}
            className="group flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-center transition-all hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md"
          >
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white">
              <Zap className="h-5 w-5" />
            </div>
            <p className="font-semibold text-slate-800">Blitz</p>
            <p className="text-xs text-slate-500">60s valendo pontos: acerte o significado</p>
            {bestBlitz !== undefined && (
              <p className="text-xs font-semibold text-amber-600">🏆 {bestBlitz} pts</p>
            )}
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => resetLesson(lesson.id)}
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-slate-600"
      >
        <RotateCcw className="h-4 w-4" />
        Reiniciar aula
      </button>
    </div>
  );
}

// ============================================================================
// Etapa 1 — Estudar (flashcards)
function Study({ onDone, onBack }: { onDone: () => void; onBack: () => void }) {
  const verbs = LESSON_02.verbs;
  const total = verbs.length;
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [seen, setSeen] = useState<Set<number>>(() => new Set([0]));
  const { speak } = useSpeech();

  const v = verbs[index];
  const audioText = v.participle && v.participle !== v.past
    ? `${v.base}, ${v.past}, ${v.participle}`
    : `${v.base}, ${v.past}`;

  const go = (next: number) => {
    const clamped = Math.max(0, Math.min(total - 1, next));
    setIndex(clamped);
    setFlipped(false);
    setSeen((s) => new Set(s).add(clamped));
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <StageHeader onBack={onBack} title="Etapa 1 · Estudar" progress={`${seen.size}/${total} vistos`} />

      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className="relative flex min-h-[15rem] w-full flex-col items-center justify-center rounded-2xl border border-slate-200/60 bg-white p-6 text-center shadow-xl transition-all active:scale-[0.99]"
      >
        <span className="absolute left-4 top-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          {flipped ? 'Significado' : 'Inglês'} · {index + 1}/{total}
        </span>
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            speak(audioText, 'en-US');
          }}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50"
          title="Ouvir pronúncia"
        >
          <Volume2 className="h-4 w-4" />
        </span>

        {!flipped ? (
          <>
            <img
              src={verbImg(v.id)}
              alt=""
              className="mb-2 h-24 w-auto max-w-[220px] object-contain"
              draggable={false}
            />
            <p className="text-3xl font-extrabold tracking-tight text-slate-900">{v.base}</p>
            <p className="mt-2 text-base text-slate-500">
              <span className="font-semibold text-red-500">{v.past}</span>
              {v.participle && (
                <>
                  {' · '}
                  <span className="font-semibold text-blue-600">{v.participle}</span>
                </>
              )}
            </p>
            <span className={`mt-4 ${ruleBadge(v.rule)}`}>Regra {v.rule}</span>
            <p className="mt-4 text-xs text-slate-400">Toque para ver o significado</p>
          </>
        ) : (
          <>
            <p className="text-2xl font-bold text-slate-900">{v.pt}</p>
            <p className="mt-3 text-base italic text-slate-500">"{v.example}"</p>
            <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2 text-left">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              <p className="text-sm text-slate-700">{v.tip}</p>
            </div>
          </>
        )}
      </button>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => go(index - 1)}
          disabled={index === 0}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4" />
          Anterior
        </button>
        {index < total - 1 ? (
          <button
            type="button"
            onClick={() => go(index + 1)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            Próximo
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onDone}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            <Check className="h-4 w-4" />
            Concluir etapa
          </button>
        )}
      </div>
      <p className="mt-2 text-center text-xs text-slate-400">
        Passe por todos os verbos e conclua quando se sentir pronto.
      </p>
    </div>
  );
}

// ============================================================================
// Etapa 2 — Significado (inglês → PT), estilo Cram (repete errados)
function Meaning({ onDone, onBack }: { onDone: () => void; onBack: () => void }) {
  const verbs = LESSON_02.verbs;
  const total = verbs.length;
  const [queue, setQueue] = useState<number[]>(() => shuffle(verbs.map((v) => v.id)));
  const [chosen, setChosen] = useState<string | null>(null);

  const currentId = queue[0];
  const v = verbs.find((x) => x.id === currentId)!;
  const options = useMemo(() => {
    const others = verbs.filter((x) => x.id !== v.id).map((x) => x.pt);
    return shuffle([v.pt, ...shuffle(others).slice(0, 3)]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId]);

  const mastered = total - queue.length;
  const isRight = chosen === v.pt;

  const advance = () => {
    const rest = queue.slice(1);
    const nextQueue = isRight ? rest : [...rest, currentId];
    setChosen(null);
    if (nextQueue.length === 0) {
      onDone();
      return;
    }
    setQueue(nextQueue);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <StageHeader onBack={onBack} title="Etapa 2 · Significado" progress={`${mastered}/${total}`} />
      <Bar value={mastered} total={total} />

      <div className="mt-4 rounded-2xl border border-slate-200/60 bg-white p-5 shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">Qual o significado?</p>
        <p className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">{v.base}</p>
        <p className="mb-4 text-sm text-slate-400">
          <span className="text-red-500">{v.past}</span>
          {v.participle && <> · <span className="text-blue-600">{v.participle}</span></>}
        </p>

        <div className="grid gap-2.5 sm:grid-cols-2">
          {options.map((opt) => {
            const isThis = chosen === opt;
            const isCorrect = opt === v.pt;
            let cls = 'flex items-center gap-2 rounded-xl border px-4 py-3 text-left text-sm transition-all ';
            if (!chosen) cls += 'border-slate-200 bg-white hover:border-violet-300 hover:bg-violet-50/50 active:scale-[0.99]';
            else if (isCorrect) cls += 'border-emerald-300 bg-emerald-50 ring-1 ring-emerald-300';
            else if (isThis) cls += 'border-red-300 bg-red-50 ring-1 ring-red-300';
            else cls += 'border-slate-200 bg-white opacity-60';
            return (
              <button key={opt} type="button" disabled={!!chosen} onClick={() => setChosen(opt)} className={cls}>
                <span className="flex-1 font-medium text-slate-700">{opt}</span>
                {chosen && isCorrect && <Check className="h-4 w-4 text-emerald-500" />}
                {chosen && isThis && !isCorrect && <X className="h-4 w-4 text-red-500" />}
              </button>
            );
          })}
        </div>

        {chosen && (
          <div className={`mt-4 rounded-xl border p-3 text-sm animate-fade-in ${isRight ? 'border-emerald-200 bg-emerald-50/80 text-emerald-800' : 'border-amber-200 bg-amber-50/80 text-amber-800'}`}>
            <p className="font-semibold">{isRight ? 'Boa! ✅' : `Resposta: ${v.pt}`}</p>
            <p className="mt-0.5 text-slate-600">{v.tip}</p>
            {!isRight && <p className="mt-1 text-xs text-slate-500">Este verbo volta no fim para você fixar.</p>}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={advance}
        disabled={!chosen}
        className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        Continuar
        <ArrowRight className="h-4 w-4" />
      </button>
      <p className="mt-2 text-center text-xs text-slate-400">Faltam {queue.length} verbo(s) para dominar.</p>
    </div>
  );
}

// ============================================================================
// Etapa 3 — Formas (irregulares): passado – particípio
function Forms({ onDone, onBack }: { onDone: () => void; onBack: () => void }) {
  const pairLabel = (x: Verb) => `${x.past} – ${x.participle}`;
  const total = FORMS_VERBS.length;
  const [queue, setQueue] = useState<number[]>(() => shuffle(FORMS_VERBS.map((v) => v.id)));
  const [chosen, setChosen] = useState<string | null>(null);

  const currentId = queue[0];
  const v = FORMS_VERBS.find((x) => x.id === currentId)!;
  const correct = pairLabel(v);
  const options = useMemo(() => {
    const others = FORMS_VERBS.filter((x) => x.id !== v.id).map(pairLabel);
    return shuffle([correct, ...shuffle([...new Set(others)]).slice(0, 3)]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId]);

  const mastered = total - queue.length;
  const isRight = chosen === correct;

  const advance = () => {
    const rest = queue.slice(1);
    const nextQueue = isRight ? rest : [...rest, currentId];
    setChosen(null);
    if (nextQueue.length === 0) {
      onDone();
      return;
    }
    setQueue(nextQueue);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <StageHeader onBack={onBack} title="Etapa 3 · Formas" progress={`${mastered}/${total}`} />
      <Bar value={mastered} total={total} />

      <div className="mt-4 rounded-2xl border border-slate-200/60 bg-white p-5 shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">
          Passado e particípio de:
        </p>
        <div className="mt-1 flex items-baseline gap-2">
          <p className="text-2xl font-extrabold tracking-tight text-slate-900">{v.base}</p>
          <span className="text-sm text-slate-400">({v.pt})</span>
        </div>

        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {options.map((opt) => {
            const isThis = chosen === opt;
            const isCorrect = opt === correct;
            let cls = 'flex items-center gap-2 rounded-xl border px-4 py-3 text-left text-sm transition-all ';
            if (!chosen) cls += 'border-slate-200 bg-white hover:border-violet-300 hover:bg-violet-50/50 active:scale-[0.99]';
            else if (isCorrect) cls += 'border-emerald-300 bg-emerald-50 ring-1 ring-emerald-300';
            else if (isThis) cls += 'border-red-300 bg-red-50 ring-1 ring-red-300';
            else cls += 'border-slate-200 bg-white opacity-60';
            return (
              <button key={opt} type="button" disabled={!!chosen} onClick={() => setChosen(opt)} className={cls}>
                <span className="flex-1 font-semibold text-slate-700">{opt}</span>
                {chosen && isCorrect && <Check className="h-4 w-4 text-emerald-500" />}
                {chosen && isThis && !isCorrect && <X className="h-4 w-4 text-red-500" />}
              </button>
            );
          })}
        </div>

        {chosen && (
          <div className={`mt-4 rounded-xl border p-3 text-sm animate-fade-in ${isRight ? 'border-emerald-200 bg-emerald-50/80 text-emerald-800' : 'border-amber-200 bg-amber-50/80 text-amber-800'}`}>
            <p className="font-semibold">
              {isRight ? 'Boa! ✅' : `Correto: ${v.base} – ${v.past} – ${v.participle}`}
            </p>
            <p className="mt-0.5 text-slate-600">{v.tip}</p>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={advance}
        disabled={!chosen}
        className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        Continuar
        <ArrowRight className="h-4 w-4" />
      </button>
      <p className="mt-2 text-center text-xs text-slate-400">Faltam {queue.length} verbo(s) para dominar.</p>
    </div>
  );
}

// ============================================================================
function StageHeader({ onBack, title, progress }: { onBack: () => void; title: string; progress: string }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-700"
      >
        <ChevronLeft className="h-4 w-4" />
        Etapas
      </button>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-slate-700">{title}</span>
        <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-bold tabular-nums text-violet-700">
          {progress}
        </span>
      </div>
    </div>
  );
}

function Bar({ value, total }: { value: number; total: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
      <div
        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-600 transition-all duration-300"
        style={{ width: `${total > 0 ? (value / total) * 100 : 0}%` }}
      />
    </div>
  );
}
