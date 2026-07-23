import { useEffect, useMemo, useState } from 'react';
import {
  ChevronLeft, Check, X, Volume2, RotateCcw, ArrowLeft, ArrowRight,
  Trophy, Lightbulb, Lock, CheckCircle2, Gamepad2, Puzzle, Zap, Brain, Plus, Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useStore } from '../store/useStore';
import { useVerbLessonStore } from '../store/useVerbLessonStore';
import { useSpeech } from '../hooks/useSpeech';
import { STAGE_INFO, type Topic, type TopicItem, type TopicStage } from '../data/topic';
import { MatchGame, BlitzGame, MemoryGame } from './VerbGames';

const EMPTY_STAGES: string[] = [];
/** Itens que entram no exercício de formas (irregulares com particípio). */
const formsItems = (topic: Topic) => topic.items.filter((i) => i.irregular && i.participle);

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function ruleBadge(rule: NonNullable<TopicItem['rule']>) {
  const map = {
    A: 'bg-cyan-100 text-cyan-700',
    B: 'bg-blue-100 text-blue-700',
    B2: 'bg-indigo-100 text-indigo-700',
    C: 'bg-accent-soft text-accent-text',
  } as const;
  return `inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold ${map[rule]}`;
}

// ============================================================================
export function TopicStudy({ topic }: { topic: Topic }) {
  const goToHome = useStore((s) => s.goToHome);
  const stagesDone = useVerbLessonStore((s) => s.progress[topic.id]?.stagesDone ?? EMPTY_STAGES);
  const bestMatch = useVerbLessonStore((s) => s.progress[topic.id]?.bestMatchMs);
  const bestBlitz = useVerbLessonStore((s) => s.progress[topic.id]?.bestBlitz);
  const bestMemory = useVerbLessonStore((s) => s.progress[topic.id]?.bestMemory);
  const markStageDone = useVerbLessonStore((s) => s.markStageDone);
  const resetLesson = useVerbLessonStore((s) => s.resetLesson);

  const [mode, setMode] = useState<'hub' | TopicStage | 'match' | 'blitz' | 'memory'>('hub');
  const [adding, setAdding] = useState(false);
  const [addProgress, setAddProgress] = useState(0);

  // Pré-carrega as ilustrações (se houver) para não haver atraso ao virar cartas.
  useEffect(() => {
    if (!topic.imageFor) return;
    topic.items.forEach((it) => {
      const url = topic.imageFor?.(it);
      if (url) {
        const img = new Image();
        img.src = url;
      }
    });
  }, [topic]);

  const finish = (stage: string) => {
    markStageDone(topic.id, stage);
    setMode('hub');
  };

  /** Cria um grupo com as palavras do tópico e joga no sistema de revisão espaçada. */
  const addToReview = async () => {
    const store = useStore.getState();
    if (store.groups.some((g) => g.name === topic.title)) {
      toast.info(`Você já tem o grupo "${topic.title}" na sua revisão.`);
      return;
    }
    setAdding(true);
    setAddProgress(0);
    try {
      // silent = true: não navega para a tela de cards, então o progresso
      // continua visível aqui enquanto os cards são criados.
      const groupId = await store.addGroup(topic.title, true);
      if (!groupId) return; // o store já avisou o motivo (limite do plano, erro de rede)
      for (let i = 0; i < topic.items.length; i++) {
        const it = topic.items[i];
        await (useStore
          .getState()
          .addCard(it.pt, it.base, groupId, 'pt-en', undefined, it.tip) as unknown as Promise<void>);
        setAddProgress(i + 1);
      }
      const added = useStore.getState().cards.filter((c) => c.groupId === groupId).length;
      toast.success(`${added} cards no grupo "${topic.title}" — já entram na sua revisão diária!`);
    } finally {
      setAdding(false);
    }
  };

  if (mode === 'study') return <Study topic={topic} onDone={() => finish('study')} onBack={() => setMode('hub')} />;
  if (mode === 'meaning') return <Meaning topic={topic} onDone={() => finish('meaning')} onBack={() => setMode('hub')} />;
  if (mode === 'forms') return <Forms topic={topic} onDone={() => finish('forms')} onBack={() => setMode('hub')} />;
  if (mode === 'match') return <MatchGame topic={topic} onBack={() => setMode('hub')} />;
  if (mode === 'blitz') return <BlitzGame topic={topic} onBack={() => setMode('hub')} />;
  if (mode === 'memory') return <MemoryGame topic={topic} onBack={() => setMode('hub')} />;

  const doneCount = topic.stages.filter((s) => stagesDone.includes(s)).length;
  const allDone = doneCount === topic.stages.length;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <button
        type="button"
        onClick={goToHome}
        className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-tertiary hover:text-secondary"
      >
        <ChevronLeft className="h-4 w-4" />
        Início
      </button>

      <div className="flex items-center justify-between gap-3">
        <h1 className="text-lg font-bold text-primary">
          {topic.emoji} {topic.title}
        </h1>
        <span className="shrink-0 rounded-full bg-accent-soft px-3 py-1 text-xs font-bold tabular-nums text-accent-text">
          {doneCount}/{topic.stages.length} etapas
        </span>
      </div>
      <p className="mt-0.5 text-sm text-tertiary">
        {topic.subtitle} · {topic.items.length} palavras
      </p>

      <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-surface-2">
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent to-accent-strong transition-all duration-300"
          style={{ width: `${(doneCount / topic.stages.length) * 100}%` }}
        />
      </div>

      {allDone && (
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <Trophy className="h-8 w-8 shrink-0 text-emerald-500" />
          <div>
            <p className="font-bold text-emerald-800">Tópico concluído! 🎉</p>
            <p className="text-sm text-emerald-700">Você passou por todas as etapas.</p>
          </div>
        </div>
      )}

      {/* Etapas */}
      <div className="mt-5 space-y-3">
        {topic.stages.map((stage, i) => {
          const info = STAGE_INFO[stage];
          const done = stagesDone.includes(stage);
          const locked = i > 0 && !stagesDone.includes(topic.stages[i - 1]);
          return (
            <button
              key={stage}
              type="button"
              disabled={locked}
              onClick={() => setMode(stage)}
              className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all ${
                locked
                  ? 'cursor-not-allowed border-line bg-surface-2 opacity-60'
                  : done
                    ? 'border-emerald-200 bg-emerald-50/60 hover:border-emerald-300'
                    : 'border-line bg-surface backdrop-blur-md hover:-translate-y-0.5 hover:border-accent-line hover:shadow-md'
              }`}
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${
                  done ? 'bg-emerald-100' : 'bg-accent-soft'
                }`}
              >
                {done ? <CheckCircle2 className="h-6 w-6 text-emerald-500" /> : <span>{info.emoji}</span>}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wide text-faint">Etapa {i + 1}</span>
                  {done && <span className="text-xs font-semibold text-emerald-600">✓ concluída</span>}
                </div>
                <p className="text-base font-semibold text-primary">{info.label}</p>
                <p className="text-sm text-tertiary">{info.desc}</p>
              </div>
              {locked ? (
                <Lock className="h-5 w-5 shrink-0 text-faint" />
              ) : (
                <ArrowRight className="h-5 w-5 shrink-0 text-accent" />
              )}
            </button>
          );
        })}
      </div>

      {/* Jogos */}
      <div className="mt-8">
        <div className="mb-3 flex items-center gap-2">
          <Gamepad2 className="h-5 w-5 text-accent" />
          <h2 className="text-base font-bold text-primary">Jogos</h2>
          <span className="text-xs text-faint">— fixe as palavras brincando</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <GameCard
            onClick={() => setMode('match')}
            icon={<Puzzle className="h-5 w-5" />}
            tint="from-pink-500 to-rose-500"
            title="Associação"
            desc="Pareie termo ↔ significado contra o tempo"
            best={bestMatch !== undefined ? `${(bestMatch / 1000).toFixed(1)}s` : undefined}
          />
          <GameCard
            onClick={() => setMode('memory')}
            icon={<Brain className="h-5 w-5" />}
            tint="from-accent to-accent-strong"
            title="Memória"
            desc="Vire as cartas e ache os pares"
            best={bestMemory !== undefined ? `${bestMemory} jogadas` : undefined}
          />
          <GameCard
            onClick={() => setMode('blitz')}
            icon={<Zap className="h-5 w-5" />}
            tint="from-amber-500 to-orange-500"
            title="Blitz"
            desc="60s valendo pontos"
            best={bestBlitz !== undefined ? `${bestBlitz} pts` : undefined}
          />
        </div>
      </div>

      {/* Integração com a revisão espaçada */}
      <div className="mt-8 rounded-2xl border border-accent-line bg-accent-soft p-4">
        <p className="text-sm font-semibold text-primary">Levar para a revisão diária</p>
        <p className="mt-0.5 text-xs text-secondary">
          Cria um grupo com estas {topic.items.length} palavras nos seus cards, com repetição espaçada.
        </p>
        <button
          type="button"
          onClick={addToReview}
          disabled={adding}
          className="mt-3 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-strong px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          {adding
            ? `Adicionando… ${addProgress}/${topic.items.length}`
            : 'Adicionar à minha revisão'}
        </button>

        {adding && (
          <div className="mt-3">
            <div className="h-2 w-full overflow-hidden rounded-full bg-accent-soft">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent to-accent-strong transition-all duration-200"
                style={{ width: `${(addProgress / topic.items.length) * 100}%` }}
              />
            </div>
            <p className="mt-1.5 text-xs text-tertiary">
              Criando seus cards… pode levar alguns segundos.
            </p>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => resetLesson(topic.id)}
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-faint hover:text-secondary"
      >
        <RotateCcw className="h-4 w-4" />
        Reiniciar tópico
      </button>
    </div>
  );
}

function GameCard({
  onClick, icon, tint, title, desc, best,
}: {
  onClick: () => void; icon: React.ReactNode; tint: string; title: string; desc: string; best?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col items-center gap-2 rounded-2xl border border-line bg-surface backdrop-blur-md p-4 text-center transition-all hover:-translate-y-0.5 hover:border-accent-line hover:shadow-md"
    >
      <div className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${tint} text-white`}>
        {icon}
      </div>
      <p className="font-semibold text-primary">{title}</p>
      <p className="text-xs text-tertiary">{desc}</p>
      {best && <p className="text-xs font-semibold text-amber-600">🏆 {best}</p>}
    </button>
  );
}

// ============================================================================
// Etapa 1 — Estudar (flashcards)
function Study({ topic, onDone, onBack }: { topic: Topic; onDone: () => void; onBack: () => void }) {
  const items = topic.items;
  const total = items.length;
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [seen, setSeen] = useState<Set<number>>(() => new Set([0]));
  const { speak } = useSpeech();

  const v = items[index];
  const img = topic.imageFor?.(v);
  const audioText = v.past
    ? v.participle && v.participle !== v.past
      ? `${v.base}, ${v.past}, ${v.participle}`
      : `${v.base}, ${v.past}`
    : v.base;

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
        className="relative flex min-h-[15rem] w-full flex-col items-center justify-center rounded-2xl border border-line bg-surface backdrop-blur-md p-6 text-center shadow-xl transition-all active:scale-[0.99]"
      >
        <span className="absolute left-4 top-3 text-xs font-semibold uppercase tracking-wide text-faint">
          {flipped ? 'Significado' : 'Inglês'} · {index + 1}/{total}
        </span>
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            speak(audioText, 'en-US');
          }}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-line text-tertiary transition-colors hover:bg-surface-2"
          title="Ouvir pronúncia"
        >
          <Volume2 className="h-4 w-4" />
        </span>

        {!flipped ? (
          <>
            {img && (
              <img src={img} alt="" className="mb-2 h-24 w-auto max-w-[220px] object-contain" draggable={false} />
            )}
            <p className="text-3xl font-extrabold tracking-tight text-primary">{v.base}</p>
            {v.past && (
              <p className="mt-2 text-base text-tertiary">
                <span className="font-semibold text-red-500">{v.past}</span>
                {v.participle && (
                  <>
                    {' · '}
                    <span className="font-semibold text-blue-600">{v.participle}</span>
                  </>
                )}
              </p>
            )}
            {v.rule && <span className={`mt-4 ${ruleBadge(v.rule)}`}>Regra {v.rule}</span>}
            <p className="mt-4 text-xs text-faint">Toque para ver o significado</p>
          </>
        ) : (
          <>
            <p className="text-2xl font-bold text-primary">{v.pt}</p>
            <p className="mt-3 text-base italic text-tertiary">"{v.example}"</p>
            <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2 text-left">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              <p className="text-sm text-secondary">{v.tip}</p>
            </div>
          </>
        )}
      </button>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => go(index - 1)}
          disabled={index === 0}
          className="flex items-center gap-1.5 rounded-xl border border-line bg-surface backdrop-blur-md px-4 py-2.5 text-sm font-medium text-secondary transition-colors hover:bg-surface-2 disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4" />
          Anterior
        </button>
        {index < total - 1 ? (
          <button
            type="button"
            onClick={() => go(index + 1)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-accent to-accent-strong px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
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
    </div>
  );
}

// ============================================================================
// Etapa 2 — Significado (inglês → PT), estilo Cram
function Meaning({ topic, onDone, onBack }: { topic: Topic; onDone: () => void; onBack: () => void }) {
  const items = topic.items;
  const total = items.length;
  const [queue, setQueue] = useState<number[]>(() => shuffle(items.map((i) => i.id)));
  const [chosen, setChosen] = useState<string | null>(null);

  const currentId = queue[0];
  const v = items.find((x) => x.id === currentId)!;
  const options = useMemo(() => {
    const others = items.filter((x) => x.id !== v.id).map((x) => x.pt);
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

      <div className="mt-4 rounded-2xl border border-line bg-surface backdrop-blur-md p-5 shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent-text">Qual o significado?</p>
        <p className="mt-1 text-2xl font-extrabold tracking-tight text-primary">{v.base}</p>
        {v.past && (
          <p className="mb-4 text-sm text-faint">
            <span className="text-red-500">{v.past}</span>
            {v.participle && <> · <span className="text-blue-600">{v.participle}</span></>}
          </p>
        )}

        <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
          {options.map((opt) => {
            const isThis = chosen === opt;
            const isCorrect = opt === v.pt;
            let cls = 'flex items-center gap-2 rounded-xl border px-4 py-3 text-left text-sm transition-all ';
            if (!chosen) cls += 'border-line bg-surface backdrop-blur-md hover:border-accent-line hover:bg-accent-soft active:scale-[0.99]';
            else if (isCorrect) cls += 'border-emerald-300 bg-emerald-50 ring-1 ring-emerald-300';
            else if (isThis) cls += 'border-red-300 bg-red-50 ring-1 ring-red-300';
            else cls += 'border-line bg-surface backdrop-blur-md opacity-60';
            return (
              <button key={opt} type="button" disabled={!!chosen} onClick={() => setChosen(opt)} className={cls}>
                <span className="flex-1 font-medium text-secondary">{opt}</span>
                {chosen && isCorrect && <Check className="h-4 w-4 text-emerald-500" />}
                {chosen && isThis && !isCorrect && <X className="h-4 w-4 text-red-500" />}
              </button>
            );
          })}
        </div>

        {chosen && (
          <div className={`mt-4 rounded-xl border p-3 text-sm animate-fade-in ${isRight ? 'border-emerald-200 bg-emerald-50/80 text-emerald-800' : 'border-amber-200 bg-amber-50/80 text-amber-800'}`}>
            <p className="font-semibold">{isRight ? 'Boa! ✅' : `Resposta: ${v.pt}`}</p>
            <p className="mt-0.5 text-secondary">{v.tip}</p>
            {!isRight && <p className="mt-1 text-xs text-tertiary">Esta palavra volta no fim para você fixar.</p>}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={advance}
        disabled={!chosen}
        className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-accent to-accent-strong px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        Continuar
        <ArrowRight className="h-4 w-4" />
      </button>
      <p className="mt-2 text-center text-xs text-faint">Faltam {queue.length} palavra(s) para dominar.</p>
    </div>
  );
}

// ============================================================================
// Etapa 3 — Formas (irregulares): passado – particípio
function Forms({ topic, onDone, onBack }: { topic: Topic; onDone: () => void; onBack: () => void }) {
  const pairLabel = (x: TopicItem) => `${x.past ?? ''} – ${x.participle ?? ''}`;
  const items = useMemo(() => formsItems(topic), [topic]);
  const total = items.length;
  const [queue, setQueue] = useState<number[]>(() => shuffle(items.map((i) => i.id)));
  const [chosen, setChosen] = useState<string | null>(null);

  const currentId = queue[0];
  const v = items.find((x) => x.id === currentId)!;
  const correct = pairLabel(v);
  const options = useMemo(() => {
    const others = items.filter((x) => x.id !== v.id).map(pairLabel);
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

      <div className="mt-4 rounded-2xl border border-line bg-surface backdrop-blur-md p-5 shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent-text">Passado e particípio de:</p>
        <div className="mt-1 flex items-baseline gap-2">
          <p className="text-2xl font-extrabold tracking-tight text-primary">{v.base}</p>
          <span className="text-sm text-faint">({v.pt})</span>
        </div>

        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {options.map((opt) => {
            const isThis = chosen === opt;
            const isCorrect = opt === correct;
            let cls = 'flex items-center gap-2 rounded-xl border px-4 py-3 text-left text-sm transition-all ';
            if (!chosen) cls += 'border-line bg-surface backdrop-blur-md hover:border-accent-line hover:bg-accent-soft active:scale-[0.99]';
            else if (isCorrect) cls += 'border-emerald-300 bg-emerald-50 ring-1 ring-emerald-300';
            else if (isThis) cls += 'border-red-300 bg-red-50 ring-1 ring-red-300';
            else cls += 'border-line bg-surface backdrop-blur-md opacity-60';
            return (
              <button key={opt} type="button" disabled={!!chosen} onClick={() => setChosen(opt)} className={cls}>
                <span className="flex-1 font-semibold text-secondary">{opt}</span>
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
            <p className="mt-0.5 text-secondary">{v.tip}</p>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={advance}
        disabled={!chosen}
        className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-accent to-accent-strong px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        Continuar
        <ArrowRight className="h-4 w-4" />
      </button>
      <p className="mt-2 text-center text-xs text-faint">Faltam {queue.length} verbo(s) para dominar.</p>
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
        className="inline-flex items-center gap-1 text-sm font-medium text-tertiary hover:text-secondary"
      >
        <ChevronLeft className="h-4 w-4" />
        Etapas
      </button>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-secondary">{title}</span>
        <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-bold tabular-nums text-accent-text">
          {progress}
        </span>
      </div>
    </div>
  );
}

function Bar({ value, total }: { value: number; total: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
      <div
        className="h-full rounded-full bg-gradient-to-r from-accent to-accent-strong transition-all duration-300"
        style={{ width: `${total > 0 ? (value / total) * 100 : 0}%` }}
      />
    </div>
  );
}
