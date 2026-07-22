import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, Trophy, RotateCcw, Timer, Zap } from 'lucide-react';
import type { Topic, TopicItem } from '../data/topic';
import { useVerbLessonStore } from '../store/useVerbLessonStore';

const MATCH_PAIRS = 6;
const MEMORY_PAIRS = 6;
const BLITZ_SECONDS = 60;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const firstMeaning = (pt: string) => pt.split(',')[0].trim();
const randomItem = (topic: Topic): TopicItem =>
  topic.items[Math.floor(Math.random() * topic.items.length)];

function fmtTime(ms: number): string {
  const s = ms / 1000;
  if (s < 60) return `${s.toFixed(1)}s`;
  const m = Math.floor(s / 60);
  const rest = Math.round(s % 60);
  return `${m}:${String(rest).padStart(2, '0')}`;
}

function GameHeader({ onBack, title, best }: { onBack: () => void; title: string; best?: string }) {
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
        {best && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700">
            <Trophy className="h-3 w-3" />
            {best}
          </span>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Jogo 1 — Associação (parear termo ↔ português)
interface Tile {
  key: string;
  itemId: number;
  kind: 'en' | 'pt';
  label: string;
  matched: boolean;
}

function buildTiles(topic: Topic): Tile[] {
  const picked = shuffle(topic.items).slice(0, MATCH_PAIRS);
  const tiles: Tile[] = [];
  picked.forEach((it) => {
    tiles.push({ key: `en-${it.id}`, itemId: it.id, kind: 'en', label: it.base, matched: false });
    tiles.push({ key: `pt-${it.id}`, itemId: it.id, kind: 'pt', label: firstMeaning(it.pt), matched: false });
  });
  return shuffle(tiles);
}

export function MatchGame({ topic, onBack }: { topic: Topic; onBack: () => void }) {
  const [gameId, setGameId] = useState(0);
  const best = useVerbLessonStore((s) => s.progress[topic.id]?.bestMatchMs);
  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <GameHeader onBack={onBack} title="Jogo · Associação" best={best ? fmtTime(best) : undefined} />
      <p className="mb-3 text-sm text-slate-500">
        Toque em um termo e depois no seu significado. Pareie os {MATCH_PAIRS} o mais rápido que conseguir!
      </p>
      <MatchRound key={gameId} topic={topic} onReplay={() => setGameId((g) => g + 1)} />
    </div>
  );
}

function MatchRound({ topic, onReplay }: { topic: Topic; onReplay: () => void }) {
  const saveMatchTime = useVerbLessonStore((s) => s.saveMatchTime);
  const [tiles, setTiles] = useState<Tile[]>(() => buildTiles(topic));
  const [selected, setSelected] = useState<string | null>(null);
  const [wrong, setWrong] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(0);
  const doneRef = useRef(false);

  useEffect(() => {
    startRef.current = performance.now();
    const iv = setInterval(() => {
      if (!doneRef.current) setElapsed(performance.now() - startRef.current);
    }, 100);
    return () => clearInterval(iv);
  }, []);

  const handleTap = (t: Tile) => {
    if (done || t.matched || wrong.length) return;
    if (!selected) {
      setSelected(t.key);
      return;
    }
    if (selected === t.key) {
      setSelected(null);
      return;
    }
    const a = tiles.find((x) => x.key === selected)!;
    if (a.itemId === t.itemId && a.kind !== t.kind) {
      const next = tiles.map((x) => (x.key === a.key || x.key === t.key ? { ...x, matched: true } : x));
      setTiles(next);
      setSelected(null);
      if (next.every((x) => x.matched)) {
        doneRef.current = true;
        setDone(true);
        saveMatchTime(topic.id, Math.round(elapsed));
      }
    } else {
      setWrong([a.key, t.key]);
      setSelected(null);
      setTimeout(() => setWrong([]), 600);
    }
  };

  if (done) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <Trophy className="mx-auto h-12 w-12 text-emerald-500" />
        <p className="mt-2 text-lg font-bold text-emerald-800">Pareado! ⚡</p>
        <p className="text-sm text-emerald-700">
          Seu tempo: <strong>{fmtTime(elapsed)}</strong>
        </p>
        <button
          type="button"
          onClick={onReplay}
          className="mx-auto mt-4 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          <RotateCcw className="h-4 w-4" />
          Jogar de novo
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold tabular-nums text-slate-600">
        <Timer className="h-4 w-4 text-violet-500" />
        {(elapsed / 1000).toFixed(1)}s
      </div>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {tiles.map((t) => {
          const isSel = selected === t.key;
          const isWrong = wrong.includes(t.key);
          let cls =
            'flex min-h-[64px] items-center justify-center rounded-xl border px-2 py-3 text-center text-sm font-medium transition-all ';
          if (t.matched) cls += 'border-emerald-200 bg-emerald-50 text-emerald-300 opacity-40';
          else if (isWrong) cls += 'border-red-400 bg-red-50 text-red-600 animate-shake';
          else if (isSel) cls += 'border-violet-400 bg-violet-50 text-violet-700 ring-2 ring-violet-300';
          else cls += 'border-slate-200 bg-white text-slate-700 hover:border-violet-300 hover:bg-violet-50/40';
          return (
            <button key={t.key} type="button" disabled={t.matched} onClick={() => handleTap(t)} className={cls}>
              {t.label}
            </button>
          );
        })}
      </div>
    </>
  );
}

// ============================================================================
// Jogo 2 — Blitz (quiz cronometrado de 60s)
function buildBlitzOptions(topic: Topic, item: TopicItem): string[] {
  const others = topic.items.filter((x) => x.id !== item.id).map((x) => x.pt);
  return shuffle([item.pt, ...shuffle(others).slice(0, 3)]);
}

export function BlitzGame({ topic, onBack }: { topic: Topic; onBack: () => void }) {
  const [gameId, setGameId] = useState(0);
  const best = useVerbLessonStore((s) => s.progress[topic.id]?.bestBlitz);
  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <GameHeader onBack={onBack} title="Jogo · Blitz" best={best !== undefined ? `${best} pts` : undefined} />
      <p className="mb-3 text-sm text-slate-500">
        Acerte o máximo de significados em {BLITZ_SECONDS} segundos. Cada acerto = 1 ponto.
      </p>
      <BlitzRound key={gameId} topic={topic} onReplay={() => setGameId((g) => g + 1)} />
    </div>
  );
}

function BlitzRound({ topic, onReplay }: { topic: Topic; onReplay: () => void }) {
  const saveBlitzScore = useVerbLessonStore((s) => s.saveBlitzScore);
  const [timeLeft, setTimeLeft] = useState(BLITZ_SECONDS);
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(0);
  const [item, setItem] = useState<TopicItem>(() => randomItem(topic));
  const [flash, setFlash] = useState<'ok' | 'no' | null>(null);
  const options = useMemo(() => buildBlitzOptions(topic, item), [topic, item]);

  useEffect(() => {
    if (done) return;
    if (timeLeft <= 0) {
      setDone(true);
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, done]);

  useEffect(() => {
    if (done) saveBlitzScore(topic.id, score);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const pick = (pt: string) => {
    if (done) return;
    const ok = pt === item.pt;
    if (ok) setScore((s) => s + 1);
    setFlash(ok ? 'ok' : 'no');
    setTimeout(() => setFlash(null), 250);
    setItem(randomItem(topic));
  };

  if (done) {
    return (
      <div className="rounded-2xl border border-violet-200 bg-violet-50 p-6 text-center">
        <Zap className="mx-auto h-12 w-12 text-violet-500" />
        <p className="mt-2 text-lg font-bold text-violet-800">Tempo!</p>
        <p className="text-3xl font-extrabold tabular-nums text-slate-900">{score} pts</p>
        <button
          type="button"
          onClick={onReplay}
          className="mx-auto mt-4 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          <RotateCcw className="h-4 w-4" />
          Jogar de novo
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold tabular-nums ${
            timeLeft <= 10 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'
          }`}
        >
          <Timer className="h-4 w-4" />
          {timeLeft}s
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1 text-sm font-bold tabular-nums text-violet-700">
          <Zap className="h-4 w-4" />
          {score}
        </span>
      </div>

      <div
        className={`rounded-2xl border bg-white p-5 shadow-xl transition-colors ${
          flash === 'ok' ? 'border-emerald-300' : flash === 'no' ? 'border-red-300' : 'border-slate-200/60'
        }`}
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">Significado de:</p>
        <p className="mt-1 mb-4 text-2xl font-extrabold tracking-tight text-slate-900">{item.base}</p>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => pick(opt)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-700 transition-all hover:border-violet-300 hover:bg-violet-50/50 active:scale-[0.99]"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
      {flash === 'ok' && <p className="mt-2 text-center text-sm font-semibold text-emerald-600">+1 ✅</p>}
      {flash === 'no' && <p className="mt-2 text-center text-sm font-semibold text-red-500">errou</p>}
    </>
  );
}

// ============================================================================
// Jogo 3 — Memória (concentração)
interface MemCard {
  key: string;
  itemId: number;
  kind: 'term' | 'pt';
  label: string;
  img?: string;
}

function buildMemCards(topic: Topic): MemCard[] {
  const picked = shuffle(topic.items).slice(0, MEMORY_PAIRS);
  const cards: MemCard[] = [];
  picked.forEach((it) => {
    cards.push({ key: `term-${it.id}`, itemId: it.id, kind: 'term', label: it.base, img: topic.imageFor?.(it) });
    cards.push({ key: `pt-${it.id}`, itemId: it.id, kind: 'pt', label: firstMeaning(it.pt) });
  });
  return shuffle(cards);
}

export function MemoryGame({ topic, onBack }: { topic: Topic; onBack: () => void }) {
  const [gameId, setGameId] = useState(0);
  const best = useVerbLessonStore((s) => s.progress[topic.id]?.bestMemory);
  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <GameHeader
        onBack={onBack}
        title="Jogo · Memória"
        best={best !== undefined ? `${best} jogadas` : undefined}
      />
      <p className="mb-3 text-sm text-slate-500">
        Vire as cartas e ache os pares termo ↔ significado. Quanto menos jogadas, melhor!
      </p>
      <MemoryRound key={gameId} topic={topic} onReplay={() => setGameId((g) => g + 1)} />
    </div>
  );
}

function MemoryRound({ topic, onReplay }: { topic: Topic; onReplay: () => void }) {
  const saveMemoryMoves = useVerbLessonStore((s) => s.saveMemoryMoves);
  const [cards] = useState<MemCard[]>(() => buildMemCards(topic));
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [busy, setBusy] = useState(false);

  const done = matched.length === cards.length;

  useEffect(() => {
    if (done) saveMemoryMoves(topic.id, moves);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const handleFlip = (c: MemCard) => {
    if (busy || done || flipped.includes(c.key) || matched.includes(c.key)) return;
    if (flipped.length === 0) {
      setFlipped([c.key]);
      return;
    }
    const first = cards.find((x) => x.key === flipped[0])!;
    setMoves((m) => m + 1);
    if (first.itemId === c.itemId && first.kind !== c.kind) {
      setMatched((m) => [...m, first.key, c.key]);
      setFlipped([]);
    } else {
      setFlipped([first.key, c.key]);
      setBusy(true);
      setTimeout(() => {
        setFlipped([]);
        setBusy(false);
      }, 850);
    }
  };

  if (done) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <Trophy className="mx-auto h-12 w-12 text-emerald-500" />
        <p className="mt-2 text-lg font-bold text-emerald-800">Todos os pares! 🧠</p>
        <p className="text-sm text-emerald-700">
          Você terminou em <strong>{moves} jogadas</strong>.
        </p>
        <button
          type="button"
          onClick={onReplay}
          className="mx-auto mt-4 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          <RotateCcw className="h-4 w-4" />
          Jogar de novo
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold tabular-nums text-slate-600">
        <Timer className="h-4 w-4 text-violet-500" />
        {moves} jogadas
      </div>
      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
        {cards.map((c) => {
          const isUp = flipped.includes(c.key) || matched.includes(c.key);
          const isMatched = matched.includes(c.key);
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => handleFlip(c)}
              disabled={isUp}
              className={`flex min-h-[84px] items-center justify-center overflow-hidden rounded-xl border p-1 text-center text-sm font-medium transition-all ${
                isMatched
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                  : isUp
                    ? 'border-violet-300 bg-white text-slate-800 ring-2 ring-violet-200'
                    : 'border-transparent bg-gradient-to-br from-violet-500 to-indigo-600 text-lg text-white hover:opacity-90'
              }`}
            >
              {!isUp ? (
                '?'
              ) : c.kind === 'term' && c.img ? (
                <img src={c.img} alt="" className="max-h-[76px] w-full object-contain" draggable={false} />
              ) : (
                <span className="px-1">{c.label}</span>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}
