import { useState } from 'react';
import {
  X, Check, Volume2, ArrowRight, Trophy, RotateCcw, Target, Sparkles,
} from 'lucide-react';
import { useVerbLessonStore } from '../store/useVerbLessonStore';
import { useSpeech } from '../hooks/useSpeech';
import { GRID_LESSON_ID, ADVANCE_RULE } from '../data/grid4v5t2s';
import type { TrainerQuestion, OrderQ } from '../data/gridTrainer';
import { playCorrect, playWrong } from '../utils/sfx';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Peças embaralhadas de uma questão "order". */
const shuffledTiles = (question: OrderQ) =>
  shuffle(question.answer.split(' ').map((word, idx) => ({ word, idx })));

/** A frase certa de uma questão, para o feedback e o áudio. */
function rightSentence(q: TrainerQuestion): string {
  if (q.kind === 'opener') return q.blanked.replace('___', q.answer);
  if (q.kind === 'order') return q.answer;
  return q.right;
}

interface GridTrainerProps {
  title: string;
  questions: TrainerQuestion[];
  /** Limite de questões (treinos de semana sorteiam um subconjunto). */
  max?: number;
  /** Treino de célula única: no fim, com ≥80%, oferece marcar como dominada. */
  masterCellId?: string;
  onClose: () => void;
}

export function GridTrainer({ title, questions, max, masterCellId, onClose }: GridTrainerProps) {
  const { speak, isSupported } = useSpeech();
  const markStageDone = useVerbLessonStore((s) => s.markStageDone);
  const stagesDone = useVerbLessonStore((s) => s.progress[GRID_LESSON_ID]?.stagesDone);
  const alreadyMastered = masterCellId ? (stagesDone ?? []).includes(masterCellId) : false;

  // Sorteia a ordem uma vez; nos "opener", embaralha também as alternativas.
  const [qs, setQs] = useState<TrainerQuestion[]>(() =>
    shuffle(questions)
      .slice(0, max ?? questions.length)
      .map((q) => (q.kind === 'opener' ? { ...q, options: shuffle(q.options) } : q)),
  );
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [wasRight, setWasRight] = useState(false);
  // order: índices das peças já usadas, na ordem em que foram tocadas
  const [picked, setPicked] = useState<number[]>([]);
  // opener/error: o que o aluno tocou (para pintar certo/errado)
  const [choice, setChoice] = useState<string | number | null>(null);

  const q = qs[index];
  const total = qs.length;
  const isDone = index >= total;

  // Peças embaralhadas da questão "order" atual (estável por questão).
  const [tiles, setTiles] = useState<{ word: string; idx: number }[]>(() =>
    q?.kind === 'order' ? shuffledTiles(q) : [],
  );

  const finish = (right: boolean) => {
    setWasRight(right);
    setAnswered(true);
    setCorrectCount((n) => n + (right ? 1 : 0));
    (right ? playCorrect : playWrong)();
    if (isSupported && q) speak(rightSentence(q), 'en-US');
  };

  const next = () => {
    const ni = index + 1;
    setIndex(ni);
    setAnswered(false);
    setWasRight(false);
    setChoice(null);
    setPicked([]);
    const nq = qs[ni];
    setTiles(nq?.kind === 'order' ? shuffledTiles(nq) : []);
  };

  const restart = () => {
    const fresh = shuffle(questions)
      .slice(0, max ?? questions.length)
      .map((qq) => (qq.kind === 'opener' ? { ...qq, options: shuffle(qq.options) } : qq));
    setQs(fresh);
    setIndex(0);
    setCorrectCount(0);
    setAnswered(false);
    setWasRight(false);
    setChoice(null);
    setPicked([]);
    setTiles(fresh[0]?.kind === 'order' ? shuffledTiles(fresh[0] as OrderQ) : []);
  };

  // ---------------------------------------------------------------- fim
  if (isDone || !q) {
    const pct = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const canMaster = masterCellId && !alreadyMastered && pct >= 80;
    return (
      <div className="mx-auto max-w-xl px-4 py-10 text-center">
        <div className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl shadow-lg ${
          pct >= 80 ? 'bg-gradient-to-br from-emerald-400 to-green-500' : pct >= 50 ? 'bg-gradient-to-br from-amber-400 to-orange-500' : 'bg-gradient-to-br from-red-400 to-rose-500'
        }`}>
          <Trophy className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-primary">{correctCount}/{total} — {pct}%</h2>
        <p className="mt-1 text-sm text-tertiary">{title}</p>

        {canMaster && (
          <button
            type="button"
            onClick={() => { markStageDone(GRID_LESSON_ID, masterCellId); onClose(); }}
            className="mt-5 w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3 font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:opacity-90"
          >
            ≥ 80% — marcar a célula como dominada
          </button>
        )}
        {masterCellId && !alreadyMastered && pct < 80 && (
          <p className="mx-auto mt-4 flex max-w-sm items-start gap-1.5 text-left text-xs text-tertiary">
            <Target className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
            {ADVANCE_RULE}
          </p>
        )}

        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={restart}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-surface-2 py-3 font-semibold text-secondary transition-colors hover:bg-surface"
          >
            <RotateCcw className="h-4 w-4" />
            De novo
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3 font-semibold text-white transition-colors hover:bg-cyan-600"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------- questão
  const orderComplete = q.kind === 'order' && picked.length === tiles.length && tiles.length > 0;

  const handleTile = (tileIdx: number) => {
    if (answered || q.kind !== 'order') return;
    const nextPicked = [...picked, tileIdx];
    setPicked(nextPicked);
    if (nextPicked.length === tiles.length) {
      // Compara pela FRASE montada, não pelos índices — peças repetidas
      // ("If I… I would") podem ser usadas em qualquer ordem entre si.
      const built = nextPicked
        .map((i) => tiles.find((t) => t.idx === i)?.word ?? '')
        .join(' ');
      finish(built === q.answer);
    }
  };

  const kindLabel =
    q.kind === 'opener' ? 'Escolha a abertura' : q.kind === 'order' ? 'Monte a pergunta' : 'Toque na palavra errada';

  return (
    <div className="mx-auto max-w-xl px-4 py-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl p-2 text-tertiary transition-colors hover:bg-surface-2 hover:text-secondary"
          title="Sair do treino"
        >
          <X className="h-5 w-5" />
        </button>
        <p className="text-sm font-semibold text-secondary">{title}</p>
        <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-bold tabular-nums text-accent-text">
          {index + 1}/{total}
        </span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-2">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300"
          style={{ width: `${((index + (answered ? 1 : 0)) / total) * 100}%` }}
        />
      </div>

      {/* Enunciado */}
      <div className="mt-5 rounded-2xl border border-line bg-surface p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-faint">{kindLabel}</p>

        {(q.kind === 'opener' || q.kind === 'order') && (
          <p className="mt-2 text-base font-medium text-primary">
            🇧🇷 {q.pt}
          </p>
        )}

        {/* opener: frase com lacuna + alternativas */}
        {q.kind === 'opener' && (
          <>
            <p className="mt-3 rounded-xl bg-surface-2/60 px-4 py-3 text-lg font-semibold text-secondary">
              {q.blanked.split('___').map((part, i, parts) => (
                <span key={i}>
                  {part}
                  {i < parts.length - 1 && (
                    <span className={`mx-1 inline-block min-w-16 rounded-lg border-b-2 px-2 text-center ${
                      answered ? 'border-emerald-500 text-emerald-600' : 'border-cyan-400 text-cyan-600'
                    }`}>
                      {answered ? q.answer : choice ?? ' '}
                    </span>
                  )}
                </span>
              ))}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {q.options.map((opt) => {
                const isAnswer = opt === q.answer;
                const isChoice = opt === choice;
                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={answered}
                    onClick={() => { setChoice(opt); finish(isAnswer); }}
                    className={`rounded-xl border-2 px-3 py-3 text-sm font-bold transition-all ${
                      answered && isAnswer
                        ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                        : answered && isChoice
                          ? 'border-red-400 bg-red-50 text-red-600'
                          : answered
                            ? 'border-line bg-surface-2/40 text-faint'
                            : 'border-line bg-surface-2/60 text-secondary hover:border-cyan-300 hover:bg-cyan-50'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* order: peças para montar */}
        {q.kind === 'order' && (
          <>
            {/* linha montada */}
            <div className="mt-3 flex min-h-14 flex-wrap items-center gap-1.5 rounded-xl border-2 border-dashed border-line bg-surface-2/40 p-2.5">
              {picked.length === 0 && <span className="text-sm text-faint">Toque nas peças, na ordem…</span>}
              {picked.map((idx, pos) => {
                const tile = tiles.find((t) => t.idx === idx);
                const rightPos = answered && tile?.word === q.answer.split(' ')[pos];
                return (
                  <button
                    key={`${idx}-${pos}`}
                    type="button"
                    disabled={answered}
                    onClick={() => setPicked(picked.filter((p) => p !== idx))}
                    className={`rounded-lg px-2.5 py-1.5 text-sm font-semibold transition-all ${
                      answered
                        ? rightPos
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-600'
                        : 'bg-cyan-500 text-white hover:bg-cyan-600'
                    }`}
                  >
                    {tile?.word}
                  </button>
                );
              })}
            </div>
            {/* peças disponíveis */}
            {!orderComplete && !answered && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {tiles.map((tile) => {
                  const used = picked.includes(tile.idx);
                  return (
                    <button
                      key={tile.idx}
                      type="button"
                      disabled={used}
                      onClick={() => handleTile(tile.idx)}
                      className={`rounded-lg border px-2.5 py-1.5 text-sm font-semibold transition-all ${
                        used
                          ? 'border-line bg-surface-2/40 text-faint opacity-40'
                          : 'border-line bg-surface-2/70 text-secondary hover:border-cyan-300 hover:bg-cyan-50'
                      }`}
                    >
                      {tile.word}
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* error: frase com palavras clicáveis */}
        {q.kind === 'error' && (
          <div className="mt-3 flex flex-wrap gap-1.5 rounded-xl bg-surface-2/60 p-3">
            {q.wrong.split(' ').map((word, idx) => {
              const isWrongWord = idx === q.wrongIndex;
              const isChoice = idx === choice;
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={answered}
                  onClick={() => { setChoice(idx); finish(isWrongWord); }}
                  className={`rounded-lg px-2 py-1.5 text-base font-semibold transition-all ${
                    answered && isWrongWord
                      ? 'bg-red-100 text-red-600 line-through'
                      : answered && isChoice
                        ? 'bg-amber-100 text-amber-700'
                        : answered
                          ? 'text-secondary'
                          : 'text-secondary hover:bg-cyan-50 hover:text-cyan-700'
                  }`}
                >
                  {word}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Feedback */}
      {answered && (
        <div className="mt-4 animate-fade-in space-y-3">
          <div className={`flex items-center gap-3 rounded-2xl border-2 p-4 ${
            wasRight ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'
          }`}>
            {wasRight ? (
              <Check className="h-7 w-7 shrink-0 text-emerald-500" />
            ) : (
              <X className="h-7 w-7 shrink-0 text-red-500" />
            )}
            <div className="min-w-0">
              <p className={`font-bold ${wasRight ? 'text-emerald-700' : 'text-red-700'}`}>
                {wasRight ? 'Isso!' : 'Quase…'}
              </p>
              <p className="flex items-center gap-2 text-sm text-secondary">
                <span className="font-semibold">{rightSentence(q)}</span>
                {isSupported && (
                  <button
                    type="button"
                    onClick={() => speak(rightSentence(q), 'en-US')}
                    className="rounded p-1 text-tertiary hover:text-cyan-600"
                    title="Ouvir"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                )}
              </p>
            </div>
          </div>

          {q.why && (
            <p className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-900">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              {q.why}
            </p>
          )}

          <button
            type="button"
            onClick={next}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 py-3.5 font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all hover:from-cyan-600 hover:to-blue-600"
          >
            {index + 1 < total ? 'Próxima' : 'Ver resultado'}
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
