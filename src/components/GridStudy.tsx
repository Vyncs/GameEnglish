import { useState } from 'react';
import {
  ChevronLeft, Check, Volume2, AlertTriangle, ListChecks, Target,
  Moon, HelpCircle, ArrowRight, CalendarDays, Sparkles, Dumbbell,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { useVerbLessonStore } from '../store/useVerbLessonStore';
import { useGridRoutineStore, todayKey, EMPTY_STEPS } from '../store/useGridRoutineStore';
import { useSpeech } from '../hooks/useSpeech';
import {
  GRID_LESSON_ID, GRID_TITLE, GRID_SUBTITLE, GRID_ROWS, GRID_COLS,
  GRID_WEEKS, WH_WORDS, DAILY_ROUTINE_STEPS, ADVANCE_RULE, BEDTIME_ROUTINE,
  TIME_WORDS, findCell, cellAt, weekIsDone, currentWeek,
  type GridCell, type RowId, type StudyWeek,
} from '../data/grid4v5t2s';
import { questionsFor } from '../data/gridTrainer';
import { GridTrainer } from './GridTrainer';

/** Células treináveis de uma semana; a de revisão treina tudo o que veio antes. */
function weekTrainerCells(week: StudyWeek): string[] {
  if (week.cellIds.length > 0) return week.cellIds;
  return GRID_WEEKS.filter((w) => w.n < week.n).flatMap((w) => w.cellIds);
}

// Cores por linha/faixa, seguindo o mapa físico: A cinza, B verde, B2 verde-escuro,
// C laranja, B3 a seta verde, D1–D3 as faixas azuis do perfect, D4 as roxas.
type Tint = { cell: string; cellDone: string; chip: string; title: string };

const TINTS: Record<string, Tint> = {
  A: { cell: 'border-slate-300 bg-slate-50 hover:border-slate-400', cellDone: 'border-slate-400 bg-slate-100', chip: 'bg-slate-200 text-slate-700', title: 'text-slate-700' },
  B: { cell: 'border-emerald-200 bg-emerald-50 hover:border-emerald-400', cellDone: 'border-emerald-400 bg-emerald-100', chip: 'bg-emerald-100 text-emerald-700', title: 'text-emerald-700' },
  B2: { cell: 'border-teal-200 bg-teal-50 hover:border-teal-400', cellDone: 'border-teal-400 bg-teal-100', chip: 'bg-teal-100 text-teal-700', title: 'text-teal-700' },
  C: { cell: 'border-orange-200 bg-orange-50 hover:border-orange-400', cellDone: 'border-orange-400 bg-orange-100', chip: 'bg-orange-100 text-orange-700', title: 'text-orange-700' },
  B3: { cell: 'border-lime-300 bg-lime-50 hover:border-lime-400', cellDone: 'border-lime-400 bg-lime-100', chip: 'bg-lime-100 text-lime-700', title: 'text-lime-700' },
  D1: { cell: 'border-blue-200 bg-blue-50 hover:border-blue-400', cellDone: 'border-blue-400 bg-blue-100', chip: 'bg-blue-100 text-blue-700', title: 'text-blue-700' },
  D2: { cell: 'border-blue-200 bg-blue-50 hover:border-blue-400', cellDone: 'border-blue-400 bg-blue-100', chip: 'bg-blue-100 text-blue-700', title: 'text-blue-700' },
  D3: { cell: 'border-blue-200 bg-blue-50 hover:border-blue-400', cellDone: 'border-blue-400 bg-blue-100', chip: 'bg-blue-100 text-blue-700', title: 'text-blue-700' },
  D4: { cell: 'border-violet-200 bg-violet-50 hover:border-violet-400', cellDone: 'border-violet-400 bg-violet-100', chip: 'bg-violet-100 text-violet-700', title: 'text-violet-700' },
};

const tintOf = (cell: GridCell): Tint => TINTS[cell.row ?? cell.band ?? 'A'];

const EMPTY_STAGES: string[] = [];

interface TrainerConfig {
  title: string;
  cellIds: string[];
  masterCellId?: string;
  max?: number;
}

export function GridStudy() {
  const goToHome = useStore((s) => s.goToHome);
  const stagesDone = useVerbLessonStore((s) => s.progress[GRID_LESSON_ID]?.stagesDone) ?? EMPTY_STAGES;
  const [cellId, setCellId] = useState<string | null>(null);
  const [trainer, setTrainer] = useState<TrainerConfig | null>(null);

  const cell = cellId ? findCell(cellId) : null;
  const week = currentWeek(stagesDone);
  const weeksDone = GRID_WEEKS.filter((w) => weekIsDone(w, stagesDone)).length;

  if (trainer) {
    return (
      <GridTrainer
        title={trainer.title}
        questions={questionsFor(trainer.cellIds)}
        max={trainer.max}
        masterCellId={trainer.masterCellId}
        onClose={() => setTrainer(null)}
      />
    );
  }

  if (cell) {
    return (
      <CellDossier
        cell={cell}
        done={stagesDone.includes(cell.id)}
        onBack={() => setCellId(null)}
        onTrain={() =>
          setTrainer({ title: cell.opener, cellIds: [cell.id], masterCellId: cell.id })
        }
      />
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <button
        type="button"
        onClick={goToHome}
        className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-tertiary hover:text-secondary"
      >
        <ChevronLeft className="h-4 w-4" />
        Início
      </button>

      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-primary">{GRID_TITLE}</h1>
          <p className="mt-0.5 text-sm text-tertiary">{GRID_SUBTITLE}</p>
        </div>
        <span className="shrink-0 rounded-full bg-accent-soft px-3 py-1 text-xs font-bold tabular-nums text-accent-text">
          {weeksDone}/12 semanas
        </span>
      </div>

      {/* A regra do jogo: S←V→O e a inversão */}
      <div className="mt-3 rounded-2xl border border-line bg-surface p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="rounded-lg bg-surface-2 px-2.5 py-1 font-mono font-bold text-primary">S ← V → O</span>
          <ArrowRight className="h-4 w-4 text-faint" />
          <span className="rounded-lg bg-surface-2 px-2.5 py-1 font-mono font-bold text-primary">V S O?</span>
          <span className="text-tertiary">
            afirmativa em ordem; na <strong className="text-secondary">pergunta</strong>, o verbo passa na frente.
          </span>
        </div>
        <p className="mt-2 text-xs text-faint">
          <strong>4V5T2S</strong> = 4 grupos de Verbos (linhas) × 5 Tempos (colunas + perfect) × 2 Sentidos (afirmar / perguntar).
          Escolha a linha e a coluna — a pergunta sai pronta.
        </p>
      </div>

      <WeekCard
        week={week}
        stagesDone={stagesDone}
        onOpenCell={setCellId}
        onTrainWeek={() =>
          setTrainer({
            title: `Semana ${week.n} · ${week.title}`,
            cellIds: weekTrainerCells(week),
            max: 16,
          })
        }
      />

      <MainGrid stagesDone={stagesDone} onOpenCell={setCellId} />

      <Bands stagesDone={stagesDone} onOpenCell={setCellId} />

      <WhReference />

      <BedtimeCard />
    </div>
  );
}

// ============================================================================
// Semana atual: o trilho de 12 + a rotina do dia

function WeekCard({ week, stagesDone, onOpenCell, onTrainWeek }: {
  week: StudyWeek;
  stagesDone: string[];
  onOpenCell: (id: string) => void;
  onTrainWeek: () => void;
}) {
  const markStageDone = useVerbLessonStore((s) => s.markStageDone);
  const routineDate = useGridRoutineStore((s) => s.date);
  const routineSteps = useGridRoutineStore((s) => s.steps);
  const toggleStep = useGridRoutineStore((s) => s.toggleStep);
  const steps = routineDate === todayKey() ? routineSteps : EMPTY_STEPS;
  const stepsDone = steps.filter(Boolean).length;

  return (
    <div className="mt-4 rounded-2xl border border-accent-line bg-accent-soft p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-sm font-bold text-accent-text">
          <CalendarDays className="h-4 w-4" />
          Semana {week.n} de 12 · {week.title}
        </p>
        <span className="text-xs text-tertiary">{week.goal}</span>
      </div>

      {/* Trilho das 12 semanas */}
      <div className="mt-3 flex gap-1">
        {GRID_WEEKS.map((w) => {
          const done = weekIsDone(w, stagesDone);
          const isCurrent = w.n === week.n;
          return (
            <div
              key={w.n}
              title={`Semana ${w.n} · ${w.title}`}
              className={`h-2 flex-1 rounded-full ${
                done ? 'bg-emerald-500' : isCurrent ? 'bg-cyan-500' : 'bg-surface-2'
              }`}
            />
          );
        })}
      </div>

      {/* Células da semana */}
      {week.cellIds.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {week.cellIds.map((id) => {
            const c = findCell(id);
            if (!c) return null;
            const done = stagesDone.includes(id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => onOpenCell(id)}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                  done
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                    : 'border-line bg-surface text-secondary hover:bg-surface-2'
                }`}
              >
                {done && <Check className="h-3.5 w-3.5" />}
                {c.opener}
              </button>
            );
          })}
        </div>
      )}

      {/* Treinar as células da semana (a de revisão treina tudo o que veio antes) */}
      <button
        type="button"
        onClick={onTrainWeek}
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all hover:from-cyan-600 hover:to-blue-600"
      >
        <Dumbbell className="h-4 w-4" />
        Treinar a semana
      </button>

      {/* Semana de revisão: concluída pelo botão */}
      {week.extraStageId && (
        <button
          type="button"
          onClick={() => markStageDone(GRID_LESSON_ID, week.extraStageId!)}
          disabled={stagesDone.includes(week.extraStageId)}
          className={`mt-3 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
            stagesDone.includes(week.extraStageId)
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-cyan-500 text-white hover:bg-cyan-600'
          }`}
        >
          <Check className="h-4 w-4" />
          {stagesDone.includes(week.extraStageId) ? 'Revisão concluída' : week.extraLabel}
        </button>
      )}

      {/* Rotina do dia (25–30 min) */}
      <div className="mt-4 rounded-xl border border-line bg-surface p-3">
        <p className="flex items-center justify-between text-xs font-bold text-secondary">
          <span className="flex items-center gap-1.5">
            <ListChecks className="h-4 w-4 text-cyan-600" />
            Rotina de hoje (25–30 min)
          </span>
          <span className="tabular-nums text-faint">{stepsDone}/{DAILY_ROUTINE_STEPS.length}</span>
        </p>
        <div className="mt-2 space-y-1.5">
          {DAILY_ROUTINE_STEPS.map((step, i) => (
            <label key={i} className="flex cursor-pointer items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={steps[i] ?? false}
                onChange={() => toggleStep(i)}
                className="mt-0.5 h-4 w-4 accent-cyan-600"
              />
              <span className={steps[i] ? 'text-faint line-through' : 'text-secondary'}>
                <strong className="tabular-nums">{step.min} min</strong> — {step.text}
              </span>
            </label>
          ))}
        </div>
        <p className="mt-2 flex items-start gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs text-amber-800">
          <Target className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {ADVANCE_RULE}
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// A grade principal 4 × 4

function MainGrid({ stagesDone, onOpenCell }: {
  stagesDone: string[];
  onOpenCell: (id: string) => void;
}) {
  return (
    <div className="mt-5 overflow-x-auto rounded-2xl border border-line bg-surface p-3 shadow-sm">
      <div className="grid min-w-[640px] grid-cols-[7.5rem_repeat(4,1fr)] gap-1.5">
        {/* Cabeçalho: colunas = tempos, com os marcadores */}
        <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-faint">
          linha × coluna
        </div>
        {GRID_COLS.map((col) => (
          <div key={col.id} className="rounded-xl bg-surface-2 px-2 py-2 text-center">
            <p className="text-sm font-extrabold text-primary">{col.name}</p>
            <p className="text-[11px] font-semibold text-tertiary">{col.sub}</p>
            <p className="mt-1 text-[10px] leading-tight text-faint">{col.markers.join(' · ')}</p>
          </div>
        ))}

        {/* Linhas = tipos de verbo */}
        {GRID_ROWS.map((row) => (
          <Row key={row.id} rowId={row.id} stagesDone={stagesDone} onOpenCell={onOpenCell} />
        ))}
      </div>
      <p className="mt-2 px-1 text-[11px] text-faint">
        last / next / every combinam com: {TIME_WORDS.join(' · ')}
      </p>
    </div>
  );
}

function Row({ rowId, stagesDone, onOpenCell }: {
  rowId: RowId;
  stagesDone: string[];
  onOpenCell: (id: string) => void;
}) {
  const row = GRID_ROWS.find((r) => r.id === rowId)!;
  const tint = TINTS[rowId];
  return (
    <>
      <div className={`flex flex-col justify-center rounded-xl px-2.5 py-2 ${tint.chip}`}>
        <p className="text-sm font-extrabold">{row.name}</p>
        <p className="text-[11px] font-semibold leading-tight">{row.pt}</p>
        <p className="mt-0.5 text-[10px] leading-tight opacity-80">{row.sub}</p>
      </div>
      {GRID_COLS.map((col) => {
        const cell = cellAt(rowId, col.id);
        if (!cell) return <div key={col.id} />;
        const done = stagesDone.includes(cell.id);
        return (
          <button
            key={col.id}
            type="button"
            onClick={() => onOpenCell(cell.id)}
            className={`relative rounded-xl border-2 px-2 py-3 text-center transition-all ${
              done ? tint.cellDone : tint.cell
            }`}
          >
            {done && (
              <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500">
                <Check className="h-3 w-3 text-white" strokeWidth={3} />
              </span>
            )}
            <span className={`text-[13px] font-bold leading-snug ${tint.title}`}>{cell.opener}</span>
          </button>
        );
      })}
    </>
  );
}

// ============================================================================
// As faixas: B3, perfect (D1–D3) e how long (D4)

function Bands({ stagesDone, onOpenCell }: {
  stagesDone: string[];
  onOpenCell: (id: string) => void;
}) {
  const band = (id: string) => {
    const cell = findCell(id)!;
    const tint = tintOf(cell);
    const done = stagesDone.includes(id);
    return (
      <button
        key={id}
        type="button"
        onClick={() => onOpenCell(id)}
        className={`relative flex-1 rounded-xl border-2 px-3 py-3 text-left transition-all ${
          done ? tint.cellDone : tint.cell
        }`}
      >
        {done && (
          <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500">
            <Check className="h-3 w-3 text-white" strokeWidth={3} />
          </span>
        )}
        <span className={`block text-[13px] font-bold ${tint.title}`}>{cell.opener}</span>
        <span className="mt-0.5 block text-[11px] text-tertiary">{cell.title}</span>
      </button>
    );
  };

  return (
    <div className="mt-4 space-y-2">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-faint">
        As faixas — os "vou", o perfect e o how long
      </p>
      {band('B3')}
      <div className="flex flex-col gap-2 sm:flex-row">
        {band('D1')}
        {band('D2')}
        {band('D3')}
      </div>
      {band('D4')}
    </div>
  );
}

// ============================================================================
// Referência: as perguntas-chave (wh-) e a rotina antes de dormir

function WhReference() {
  return (
    <details className="mt-4 rounded-2xl border border-line bg-surface p-4 shadow-sm">
      <summary className="flex cursor-pointer items-center gap-2 text-sm font-bold text-secondary">
        <HelpCircle className="h-4 w-4 text-cyan-600" />
        As perguntas-chave (a coluna esquerda do mapa)
      </summary>
      <div className="mt-3 grid gap-1.5 sm:grid-cols-2">
        {WH_WORDS.map((w) => (
          <div key={w.id} className="rounded-xl border border-line bg-surface-2/60 px-3 py-2">
            <p className="text-sm font-bold text-primary">
              {w.en} <span className="font-normal text-tertiary">— {w.pt}</span>
            </p>
            {w.note && <p className="mt-0.5 text-xs text-faint">{w.note}</p>}
          </div>
        ))}
      </div>
    </details>
  );
}

function BedtimeCard() {
  return (
    <div className="mt-4 rounded-2xl border border-indigo-200 bg-indigo-50 p-4">
      <p className="flex items-center gap-2 text-sm font-bold text-indigo-800">
        <Moon className="h-4 w-4" />
        Todo dia, 5 min antes de dormir
      </p>
      <ul className="mt-2 space-y-1">
        {BEDTIME_ROUTINE.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-indigo-900">
            <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-400" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ============================================================================
// Dossiê de uma célula

function CellDossier({ cell, done, onBack, onTrain }: {
  cell: GridCell;
  done: boolean;
  onBack: () => void;
  onTrain: () => void;
}) {
  const { speak, isSupported } = useSpeech();
  const markStageDone = useVerbLessonStore((s) => s.markStageDone);
  const setSelectedTopic = useVerbLessonStore((s) => s.setSelectedTopic);
  const setViewMode = useStore((s) => s.setViewMode);
  const tint = tintOf(cell);
  const [whIndex, setWhIndex] = useState(0);

  /** O deck que alimenta a célula: os marcadores são os gatilhos das colunas. */
  const openMarkersDeck = () => {
    setSelectedTopic('time-markers-01-25');
    setViewMode('topic');
  };
  const wh = cell.whQuestions[whIndex] ?? cell.whQuestions[0];

  const say = (text: string) => speak(text.replace(/…/g, ''), 'en-US');

  const structureRows = [
    { label: 'Pergunta', hint: 'V S O?', ex: cell.structure.q, chip: 'bg-cyan-100 text-cyan-700' },
    { label: 'Afirmativa', hint: 'S V O', ex: cell.structure.a, chip: 'bg-emerald-100 text-emerald-700' },
    { label: 'Negativa', hint: '', ex: cell.structure.n, chip: 'bg-rose-100 text-rose-700' },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <button
        type="button"
        onClick={onBack}
        className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-tertiary hover:text-secondary"
      >
        <ChevronLeft className="h-4 w-4" />
        Grade
      </button>

      <div className="flex items-start justify-between gap-3">
        <div>
          <span className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-extrabold ${tint.chip}`}>
            {cell.row ?? cell.band}
          </span>
          <h1 className="mt-1 text-lg font-bold text-primary">{cell.title}</h1>
          <p className="text-base font-semibold text-secondary">{cell.opener}</p>
        </div>
        {done && (
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
            <Check className="h-3.5 w-3.5" />
            Dominada
          </span>
        )}
      </div>

      {/* Regra de ouro */}
      <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm font-medium leading-relaxed text-amber-900">{cell.rule}</p>
      </div>

      {/* Estrutura: os 2 sentidos */}
      <div className="mt-4 rounded-2xl border border-line bg-surface p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-faint">Como se monta</p>
        <div className="mt-2 space-y-2">
          {structureRows.map((row) => (
            <div key={row.label} className="rounded-xl border border-line bg-surface-2/60 p-3">
              <div className="flex items-center gap-2">
                <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${row.chip}`}>{row.label}</span>
                {row.hint && <span className="font-mono text-[11px] text-faint">{row.hint}</span>}
              </div>
              <div className="mt-1.5 flex items-center justify-between gap-2">
                <div>
                  <p className="font-medium text-primary">{row.ex.en}</p>
                  <p className="text-sm text-tertiary">{row.ex.pt}</p>
                </div>
                {isSupported && (
                  <button
                    type="button"
                    onClick={() => say(row.ex.en)}
                    className="rounded-lg p-2 text-tertiary transition-colors hover:bg-cyan-50 hover:text-cyan-600"
                    title="Ouvir"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Marcadores */}
      {cell.markers && cell.markers.length > 0 && (
        <div className="mt-4 rounded-2xl border border-line bg-surface p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-faint">Marcadores — as palavras que pedem esta célula</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {cell.markers.map((m) => (
              <span key={m} className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${tint.chip}`}>{m}</span>
            ))}
          </div>
          <button
            type="button"
            onClick={openMarkersDeck}
            className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface-2/60 px-3 py-1.5 text-xs font-semibold text-secondary transition-colors hover:bg-cyan-50 hover:text-cyan-700"
          >
            📚 Decorar os gatilhos: deck Marcadores de tempo
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Sub-blocos (os três "vou", yet/just/already…) */}
      {cell.blocks && (
        <div className="mt-4 space-y-2">
          {cell.blocks.map((b) => (
            <div key={b.label} className="rounded-2xl border border-line bg-surface p-4 shadow-sm">
              <p className={`text-xs font-extrabold ${tint.title}`}>{b.label}</p>
              <p className="mt-0.5 text-sm font-semibold text-secondary">{b.opener}</p>
              <div className="mt-2 flex items-center justify-between gap-2 rounded-xl bg-surface-2/60 p-2.5">
                <div>
                  <p className="text-sm font-medium text-primary">{b.ex.en}</p>
                  <p className="text-xs text-tertiary">{b.ex.pt}</p>
                </div>
                {isSupported && (
                  <button
                    type="button"
                    onClick={() => say(b.ex.en)}
                    className="rounded-lg p-2 text-tertiary transition-colors hover:bg-cyan-50 hover:text-cyan-600"
                    title="Ouvir"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              <p className="mt-1.5 text-xs text-faint">{b.note}</p>
            </div>
          ))}
        </div>
      )}

      {/* Notas */}
      {cell.notes && cell.notes.length > 0 && (
        <div className="mt-4 rounded-2xl border border-line bg-surface p-4 shadow-sm">
          <ul className="space-y-1.5">
            {cell.notes.map((n, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-secondary">
                <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-500" />
                {n}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Exemplos */}
      <div className="mt-4 rounded-2xl border border-line bg-surface p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-faint">Exemplos</p>
        <div className="mt-2 space-y-2">
          {cell.examples.map((ex) => (
            <div key={ex.en} className="flex items-center justify-between gap-2 rounded-xl bg-surface-2/60 p-2.5">
              <div>
                <p className="text-sm font-medium text-primary">{ex.en}</p>
                <p className="text-xs text-tertiary">{ex.pt}</p>
              </div>
              {isSupported && (
                <button
                  type="button"
                  onClick={() => say(ex.en)}
                  className="rounded-lg p-2 text-tertiary transition-colors hover:bg-cyan-50 hover:text-cyan-600"
                  title="Ouvir"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Caça-erro */}
      <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4">
        <p className="flex items-center gap-2 text-sm font-bold text-red-800">
          <AlertTriangle className="h-4 w-4" />
          Caça-erro
        </p>
        <div className="mt-2 space-y-2">
          {cell.errors.map((e) => (
            <div key={e.wrong} className="rounded-xl bg-white/70 p-3">
              <p className="text-sm">
                <span className="font-medium text-red-600 line-through">{e.wrong}</span>
                <span className="mx-2 text-faint">→</span>
                <span className="font-semibold text-emerald-700">{e.right}</span>
              </p>
              <p className="mt-1 text-xs text-red-900/70">{e.why}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Gerador: célula × wh- */}
      {cell.whQuestions.length > 0 && (
        <div className="mt-4 rounded-2xl border border-line bg-surface p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-faint">
            Cruzando com os wh- — toque numa pergunta-chave
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {cell.whQuestions.map((q, i) => (
              <button
                key={q.en}
                type="button"
                onClick={() => setWhIndex(i)}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                  i === whIndex ? 'bg-cyan-500 text-white' : 'bg-surface-2 text-secondary hover:bg-cyan-50'
                }`}
              >
                {q.wh}
              </button>
            ))}
          </div>
          {wh && (
            <div className="mt-3 flex items-center justify-between gap-2 rounded-xl border border-cyan-200 bg-cyan-50 p-3">
              <div>
                <p className="font-semibold text-cyan-900">{wh.en}</p>
                <p className="text-sm text-cyan-800/70">{wh.pt}</p>
              </div>
              {isSupported && (
                <button
                  type="button"
                  onClick={() => say(wh.en)}
                  className="rounded-lg p-2 text-cyan-600 transition-colors hover:bg-cyan-100"
                  title="Ouvir"
                >
                  <Volume2 className="h-5 w-5" />
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Treinar a célula: abertura certa · ordenar · caça-erro */}
      <button
        type="button"
        onClick={onTrain}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 py-3.5 font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all hover:from-cyan-600 hover:to-blue-600"
      >
        <Dumbbell className="h-5 w-5" />
        Treinar esta célula ({questionsFor([cell.id]).length} questões)
      </button>

      {/* Dominar a célula */}
      <div className="mt-3 rounded-2xl border border-line bg-surface p-4 shadow-sm">
        {done ? (
          <p className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
            <Check className="h-4 w-4" />
            Célula dominada — ela conta no trilho das 12 semanas.
          </p>
        ) : (
          <>
            <p className="flex items-start gap-2 text-xs text-tertiary">
              <Target className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
              {ADVANCE_RULE}
            </p>
            <button
              type="button"
              onClick={() => markStageDone(GRID_LESSON_ID, cell.id)}
              className="mt-3 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 py-3 font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all hover:from-cyan-600 hover:to-blue-600"
            >
              Consegui — marcar como dominada
            </button>
          </>
        )}
      </div>
    </div>
  );
}
