import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronLeft, Check, X, ArrowRight, Volume2, Keyboard, Layers,
  Trophy, RotateCcw, CheckCircle2, Lightbulb,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { useVerbLessonStore } from '../store/useVerbLessonStore';
import { useSpeech } from '../hooks/useSpeech';
import { verbImg, type TopicItem } from '../data/topic';
import { VERB_FAMILIES, IRREGULAR_VERBS, familyItems, type VerbFamily } from '../data/verbFamilies';
import { calculateSimilarity } from '../utils/fuzzyMatch';
import { playCorrect, playWrong } from '../utils/sfx';

/** Progresso do treino fica todo sob esta "aula"; cada família é uma etapa. */
const TRAINER_ID = 'past-trainer';
const EMPTY_STAGES: string[] = [];

type Which = 'past' | 'participle';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** "there was/were" -> ["was", "were", "was/were", "there was", …] */
function accepted(answer: string): string[] {
  const clean = answer.toLowerCase().trim();
  const noThere = clean.replace(/^there\s+/, '');
  const variants = new Set([clean, noThere]);
  for (const part of noThere.split('/')) {
    variants.add(part.trim());
    variants.add(`there ${part.trim()}`);
  }
  return [...variants].filter(Boolean);
}

function check(input: string, answer: string) {
  const typed = input.toLowerCase().trim().replace(/\s+/g, ' ');
  const options = accepted(answer);
  if (options.includes(typed)) return 'right' as const;
  const best = Math.max(...options.map((o) => calculateSimilarity(typed, o)));
  return best >= 0.8 ? ('close' as const) : ('wrong' as const);
}

// ============================================================================
export function PastTrainer() {
  const goToHome = useStore((s) => s.goToHome);
  const [session, setSession] = useState<{ items: TopicItem[]; label: string; stage: string } | null>(null);
  const done = useVerbLessonStore((s) => s.progress[TRAINER_ID]?.stagesDone ?? EMPTY_STAGES);

  if (session) {
    return <Drill {...session} onBack={() => setSession(null)} />;
  }

  const start = (family: VerbFamily) =>
    setSession({ items: familyItems(family), label: family.title, stage: family.id });

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
        <h1 className="text-lg font-bold text-primary">🧠 Verbos no passado</h1>
        <span className="shrink-0 rounded-full bg-accent-soft px-3 py-1 text-xs font-bold tabular-nums text-accent-text">
          {done.length}/{VERB_FAMILIES.length} famílias
        </span>
      </div>
      <p className="mt-0.5 text-sm text-tertiary">
        {IRREGULAR_VERBS.length} irregulares dos 100 verbos, agrupados por padrão — e você digita a forma.
      </p>

      <div className="mt-4 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <Lightbulb className="h-5 w-5 shrink-0 text-amber-500" />
        <p className="text-sm text-amber-900">
          Decorar em ordem alfabética é força bruta. Aqui os verbos vêm por <b>família de som</b>: quando você pega
          “bring – brought”, o “buy – bought” e o “think – thought” vêm de brinde.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setSession({ items: IRREGULAR_VERBS, label: 'Todos os irregulares', stage: 'all' })}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-strong px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        <Keyboard className="h-4 w-4" />
        Treinar os {IRREGULAR_VERBS.length} de uma vez
      </button>

      <div className="mt-6 space-y-4">
        {VERB_FAMILIES.map((family) => {
          const items = familyItems(family);
          const isDone = done.includes(family.id);
          return (
            <div
              key={family.id}
              className={`overflow-hidden rounded-2xl border ${isDone ? 'border-emerald-200 bg-emerald-50/60' : 'border-line bg-surface'} backdrop-blur-md`}
            >
              <div className="flex items-start gap-3 p-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-xl">
                  {family.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-primary">{family.title}</h2>
                    {isDone && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        <CheckCircle2 className="h-3 w-3" /> dominada
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-tertiary">{family.rule}</p>
                  <p className="mt-1 text-xs font-semibold text-accent-text">{family.anchor}</p>
                </div>
                <span className="shrink-0 rounded-full bg-surface-2 px-2.5 py-1 text-[11px] font-bold tabular-nums text-tertiary">
                  {items.length}
                </span>
              </div>

              <div className="grid gap-1.5 px-4 sm:grid-cols-2">
                {items.map((v) => (
                  <div key={v.id} className="flex items-center gap-2 rounded-xl bg-surface-2/60 px-2.5 py-1.5">
                    <img src={verbImg(v.id)} alt="" className="h-7 w-7 shrink-0 object-contain" draggable={false} />
                    <span className="min-w-0 flex-1 truncate text-sm font-semibold text-primary">{v.base}</span>
                    <span className="shrink-0 text-xs font-bold text-red-500">{v.past}</span>
                    {v.participle && v.participle !== v.past && (
                      <span className="shrink-0 text-xs font-bold text-blue-600">{v.participle}</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-4">
                <button
                  type="button"
                  onClick={() => start(family)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-surface-2 px-4 py-2.5 text-sm font-semibold text-secondary transition-colors hover:bg-surface"
                >
                  <Keyboard className="h-4 w-4" />
                  Treinar esta família
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// A sessão de digitação
function Drill({
  items, label, stage, onBack,
}: { items: TopicItem[]; label: string; stage: string; onBack: () => void }) {
  const markStageDone = useVerbLessonStore((s) => s.markStageDone);
  const { speak } = useSpeech();
  const inputRef = useRef<HTMLInputElement>(null);

  /** Cada verbo vira 1 rodada de passado + 1 de particípio (quando difere). */
  const rounds = useMemo(() => {
    const list: { item: TopicItem; which: Which }[] = [];
    for (const item of items) {
      if (item.past) list.push({ item, which: 'past' });
      if (item.participle && item.participle !== item.past) list.push({ item, which: 'participle' });
    }
    return shuffle(list);
  }, [items]);

  const [queue, setQueue] = useState(rounds);
  const [typed, setTyped] = useState('');
  const [result, setResult] = useState<'right' | 'close' | 'wrong' | null>(null);
  const [firstTry, setFirstTry] = useState(0);
  const [misses, setMisses] = useState(0);
  const [finished, setFinished] = useState(false);
  const total = rounds.length;

  const round = queue[0];
  const answer = round ? (round.which === 'past' ? round.item.past! : round.item.participle!) : '';

  useEffect(() => {
    inputRef.current?.focus();
  }, [queue.length, result]);

  const confirm = () => {
    if (!typed.trim() || result) return;
    const r = check(typed, answer);
    setResult(r);
    if (r === 'right') {
      playCorrect();
      speak(`${round.item.base}, ${answer}`, 'en-US');
      setFirstTry((n) => n + 1);
    } else {
      playWrong();
      setMisses((n) => n + 1);
    }
  };

  const next = () => {
    const rest = queue.slice(1);
    // Errou ou quase acertou: o verbo volta para o fim da fila.
    const nextQueue = result === 'right' ? rest : [...rest, queue[0]];
    setTyped('');
    setResult(null);
    if (nextQueue.length === 0) {
      markStageDone(TRAINER_ID, stage);
      setFinished(true);
      return;
    }
    setQueue(nextQueue);
  };

  const restart = () => {
    setQueue(shuffle(rounds));
    setTyped('');
    setResult(null);
    setFirstTry(0);
    setMisses(0);
    setFinished(false);
  };

  if (finished) {
    const score = total > 0 ? Math.round((firstTry / total) * 100) : 0;
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-xl backdrop-blur-md">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 px-6 py-8 text-center text-white">
            <Trophy className="mx-auto mb-3 h-12 w-12" />
            <h2 className="text-2xl font-bold">
              {stage === 'all' ? 'Treino concluído! 🎉' : 'Família dominada! 🎉'}
            </h2>
            <p className="mt-1 text-white/85">{label}</p>
            <div className="mt-5 inline-flex items-center gap-6 rounded-2xl bg-white/15 px-6 py-3 backdrop-blur">
              <div className="text-center">
                <p className="text-3xl font-bold tabular-nums">{firstTry}</p>
                <p className="text-xs text-white/85">de primeira</p>
              </div>
              <div className="h-8 w-px bg-white/25" />
              <div className="text-center">
                <p className="text-3xl font-bold tabular-nums">{misses}</p>
                <p className="text-xs text-white/85">tentativas erradas</p>
              </div>
              <div className="h-8 w-px bg-white/25" />
              <div className="text-center">
                <p className="text-3xl font-bold tabular-nums">{score}%</p>
                <p className="text-xs text-white/85">aproveitamento</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 p-5 sm:flex-row">
            <button
              type="button"
              onClick={restart}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-line bg-surface px-4 py-3 font-medium text-secondary transition-colors hover:bg-surface-2"
            >
              <RotateCcw className="h-4 w-4" />
              Treinar de novo
            </button>
            <button
              type="button"
              onClick={onBack}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-strong px-4 py-3 font-semibold text-white transition-opacity hover:opacity-90"
            >
              <Layers className="h-4 w-4" />
              Ver as famílias
            </button>
          </div>
        </div>
      </div>
    );
  }

  const remaining = queue.length;
  const mastered = total - remaining;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-3 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 text-sm font-medium text-tertiary hover:text-secondary"
        >
          <ChevronLeft className="h-4 w-4" />
          Famílias
        </button>
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-semibold text-secondary">{label}</span>
          <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-bold tabular-nums text-accent-text">
            {mastered}/{total}
          </span>
        </div>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent to-accent-strong transition-all duration-300"
          style={{ width: `${total > 0 ? (mastered / total) * 100 : 0}%` }}
        />
      </div>

      <div className="mt-4 rounded-2xl border border-line bg-surface p-5 text-center shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-center gap-3">
          <img src={verbImg(round.item.id)} alt="" className="h-16 w-auto object-contain" draggable={false} />
          <div className="text-left">
            <p className="text-2xl font-extrabold tracking-tight text-primary">{round.item.base}</p>
            <p className="text-sm text-tertiary">{round.item.pt}</p>
          </div>
          <button
            type="button"
            onClick={() => speak(round.item.base, 'en-US')}
            className="grid h-9 w-9 place-items-center rounded-full border border-line text-tertiary transition-colors hover:bg-surface-2"
            title="Ouvir"
          >
            <Volume2 className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-faint">Escreva a forma que anda com</p>
        <p
          className={`text-2xl font-extrabold uppercase tracking-tight ${
            round.which === 'past' ? 'text-red-500' : 'text-blue-600'
          }`}
        >
          {round.which === 'past' ? 'did' : 'have'}
        </p>

        <input
          ref={inputRef}
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== 'Enter') return;
            if (result) next();
            else confirm();
          }}
          disabled={Boolean(result)}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder={round.item.base.includes(' ') ? 'duas palavras…' : 'digite aqui…'}
          className={`mt-4 w-full rounded-xl border-2 bg-surface-2 px-4 py-3 text-center text-xl font-bold text-primary outline-none transition-colors placeholder:text-sm placeholder:font-normal placeholder:text-faint ${
            result === 'right'
              ? 'border-emerald-400 bg-emerald-50'
              : result === 'close'
                ? 'border-amber-400 bg-amber-50'
                : result === 'wrong'
                  ? 'border-red-400 bg-red-50'
                  : 'border-line focus:border-[var(--accent)]'
          }`}
        />

        {result && (
          <div
            className={`mt-3 animate-fade-in rounded-xl border p-3 text-left text-sm ${
              result === 'right'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-amber-200 bg-amber-50 text-amber-900'
            }`}
          >
            <p className="font-bold">
              {result === 'right' && 'Isso! ✅'}
              {result === 'close' && `Quase! O certo é "${answer}".`}
              {result === 'wrong' && `Era "${answer}".`}
            </p>
            <p className="mt-0.5 text-secondary">
              {round.item.base} – {round.item.past}
              {round.item.participle && round.item.participle !== round.item.past && ` – ${round.item.participle}`}
            </p>
            {result !== 'right' && (
              <p className="mt-1 text-xs text-tertiary">Este verbo volta no fim da fila para você fixar.</p>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={() => (result ? next() : confirm())}
          disabled={!typed.trim() && !result}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-strong px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {result ? (
            <>
              Continuar
              <ArrowRight className="h-4 w-4" />
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              Conferir
            </>
          )}
        </button>
      </div>

      <div className="mt-3 flex items-center justify-center gap-4 text-xs text-tertiary">
        <span className="inline-flex items-center gap-1 text-emerald-600">
          <Check className="h-3.5 w-3.5" /> {firstTry} de primeira
        </span>
        <span className="inline-flex items-center gap-1 text-red-500">
          <X className="h-3.5 w-3.5" /> {misses} erros
        </span>
        <span>faltam {remaining}</span>
      </div>
    </div>
  );
}
