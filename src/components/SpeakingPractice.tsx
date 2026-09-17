// Prática falada — o app pergunta em voz, o aluno responde falando.
//
// Reusa o motor de fala do Karaokê (useSpeechRecognition + compareTexts) e a
// voz do navegador (useSpeech). Custo zero: tudo roda na Web Speech API.
//
// O que muda em relação ao Karaokê: lá o aluno REPETE uma linha que já existe
// escrita; aqui ele PRODUZ a frase a partir do sentido em português. Por isso
// cada item aceita variantes (`accepts`) — comparamos com todas e vale a melhor.
//
// Quando erra, a dica não é genérica: é a `rule` da célula da Grade 4V5T2S que
// aquele item treina.

import { useCallback, useEffect, useState } from 'react';
import {
  ChevronLeft, Mic, Square, Volume2, RotateCcw, ArrowRight,
  Trophy, Lightbulb, AlertTriangle,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { useSpeech } from '../hooks/useSpeech';
import { useSpeechRecognition, compareTexts, type WordCompareResult } from '../hooks/useSpeechRecognition';
import {
  SPEAKING_PROMPTS, promptsFor, promptCountByCell, acceptedAnswers,
  type SpeakingPrompt,
} from '../data/speakingPrompts';
import { findCell, GRID_ROWS } from '../data/grid4v5t2s';

/** Acerto a partir do qual a resposta conta como certa. */
const PASS_MARK = 70;

interface Attempt {
  prompt: SpeakingPrompt;
  spoken: string;
  accuracy: number;
  words: WordCompareResult[];
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Compara a fala com todas as formas aceitas e devolve a de melhor acerto. */
function bestMatch(prompt: SpeakingPrompt, spoken: string) {
  let best = { accuracy: -1, words: [] as WordCompareResult[], target: prompt.answer };
  for (const target of acceptedAnswers(prompt)) {
    const r = compareTexts(target, spoken);
    if (r.accuracy > best.accuracy) best = { accuracy: r.accuracy, words: r.words, target };
  }
  return best;
}

export function SpeakingPractice() {
  const goToHome = useStore((s) => s.goToHome);
  const { speak, isSupported: canSpeak } = useSpeech();
  const {
    isListening, transcript, error, isSupported: canListen,
    startListening, stopListening, resetTranscript,
  } = useSpeechRecognition();

  const [phase, setPhase] = useState<'setup' | 'practice' | 'done'>('setup');
  const [picked, setPicked] = useState<string[]>([]);
  const [items, setItems] = useState<SpeakingPrompt[]>([]);
  const [index, setIndex] = useState(0);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [result, setResult] = useState<Attempt | null>(null);

  const current = items[index];

  const sayQuestion = useCallback((text: string) => {
    speak(text.replace(/…/g, ''), 'en-US');
  }, [speak]);

  // Único efeito: falar a pergunta ao abrir o item. Sincroniza com a síntese de
  // voz do navegador e não toca em estado — quem zera é o handler que avançou.
  useEffect(() => {
    if (phase !== 'practice' || !current) return;
    sayQuestion(current.question);
  }, [phase, current, sayQuestion]);

  /** Fecha o microfone e avalia o turno de fala. */
  const stopAndGrade = () => {
    stopListening();
    if (!current) return;
    const spoken = transcript.trim();
    if (!spoken) return;
    const { accuracy, words } = bestMatch(current, spoken);
    const attempt: Attempt = { prompt: current, spoken, accuracy, words };
    setResult(attempt);
    setAttempts((prev) => [...prev, attempt]);
  };

  const start = () => {
    const chosen = shuffle(promptsFor(picked));
    if (chosen.length === 0) return;
    setItems(chosen);
    setIndex(0);
    setAttempts([]);
    setResult(null);
    setPhase('practice');
  };

  const next = () => {
    setResult(null);
    resetTranscript();
    if (index < items.length - 1) {
      setIndex(index + 1);
    } else {
      setPhase('done');
    }
  };

  const retry = () => {
    // A tentativa descartada sai do placar — senão a mesma pergunta contaria duas vezes.
    setAttempts((prev) => prev.slice(0, -1));
    setResult(null);
    resetTranscript();
  };

  const restart = () => {
    setPhase('setup');
    setItems([]);
    setAttempts([]);
    setResult(null);
    setIndex(0);
  };

  // ------------------------------------------------------------------ navegador sem suporte
  if (!canListen) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <button type="button" onClick={goToHome} className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-tertiary hover:text-secondary">
          <ChevronLeft className="h-4 w-4" /> Início
        </button>
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div>
              <h1 className="text-lg font-bold text-amber-900">Este navegador não escuta</h1>
              <p className="mt-1 text-sm text-amber-800">
                A prática falada usa o reconhecimento de voz do navegador, que hoje só funciona
                bem no <b>Chrome</b> e no <b>Edge</b> (no computador ou no Android). No iPhone,
                o Safari ainda não suporta.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------ escolha do que treinar
  if (phase === 'setup') {
    const counts = promptCountByCell();
    const cellIds = Object.keys(counts);
    const toggle = (id: string) =>
      setPicked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    const total = picked.length === 0 ? SPEAKING_PROMPTS.length : promptsFor(picked).length;

    return (
      <div className="mx-auto max-w-3xl px-4 py-6">
        <button type="button" onClick={goToHome} className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-tertiary hover:text-secondary">
          <ChevronLeft className="h-4 w-4" /> Início
        </button>

        <h1 className="text-2xl font-bold text-primary">Prática falada</h1>
        <p className="mt-1 max-w-prose text-[15px] text-tertiary">
          O app faz a pergunta em voz alta. Você lê o sentido em português e responde
          <b className="text-secondary"> falando em inglês</b> — sem escrever, sem copiar.
          Cada pergunta vem de uma célula da Grade, e a dica do erro é a regra daquela célula.
        </p>

        <div className="mt-5 rounded-2xl border border-line bg-surface p-4 shadow-sm">
          <p className="text-sm font-semibold text-secondary">O que treinar</p>
          <p className="mt-0.5 text-xs text-faint">
            Sem escolher nada, entram as {SPEAKING_PROMPTS.length} perguntas, embaralhadas.
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {cellIds.map((id) => {
              const cell = findCell(id);
              const on = picked.includes(id);
              const row = GRID_ROWS.find((r) => r.id === cell?.row);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggle(id)}
                  aria-pressed={on}
                  className={`rounded-xl border-2 px-3 py-2 text-left transition-all ${
                    on ? 'border-cyan-500 bg-cyan-50' : 'border-line bg-surface-2 hover:border-cyan-300'
                  }`}
                >
                  <span className="block text-[13px] font-bold text-primary">
                    {cell?.opener ?? id}
                  </span>
                  <span className="block text-[11px] text-tertiary">
                    {row?.pt ?? cell?.title ?? ''} · {counts[id]}
                  </span>
                </button>
              );
            })}
          </div>

          {picked.length > 0 && (
            <button type="button" onClick={() => setPicked([])} className="mt-3 text-xs font-medium text-tertiary underline hover:text-secondary">
              limpar seleção
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={start}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 py-4 text-lg font-semibold text-white transition-colors hover:bg-cyan-700"
        >
          <Mic className="h-5 w-5" />
          Começar · {total} {total === 1 ? 'pergunta' : 'perguntas'}
        </button>

        {!canSpeak && (
          <p className="mt-3 text-xs text-faint">
            Seu navegador não tem voz sintetizada: as perguntas aparecem escritas, mas não são faladas.
          </p>
        )}
      </div>
    );
  }

  // ------------------------------------------------------------------ placar final
  if (phase === 'done') {
    const passed = attempts.filter((a) => a.accuracy >= PASS_MARK).length;
    const avg = attempts.length
      ? Math.round(attempts.reduce((s, a) => s + a.accuracy, 0) / attempts.length)
      : 0;
    const weak = attempts.filter((a) => a.accuracy < PASS_MARK);

    return (
      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="rounded-2xl border border-line bg-surface p-6 text-center shadow-sm">
          <Trophy className={`mx-auto h-10 w-10 ${avg >= PASS_MARK ? 'text-emerald-500' : 'text-amber-500'}`} />
          <h1 className="mt-2 text-2xl font-bold text-primary">
            {passed} de {attempts.length}
          </h1>
          <p className="text-sm text-tertiary">acerto médio de {avg}%</p>
        </div>

        {weak.length > 0 && (
          <div className="mt-4 rounded-2xl border border-line bg-surface p-5 shadow-sm">
            <p className="text-sm font-bold text-primary">Para refazer amanhã</p>
            <div className="mt-3 flex flex-col gap-3">
              {weak.map((a, i) => {
                const cell = findCell(a.prompt.cellId);
                return (
                  <div key={i} className="border-l-2 border-rose-300 pl-3">
                    <p className="text-sm font-semibold text-primary">{a.prompt.answer}</p>
                    <p className="text-xs text-tertiary">{a.prompt.cuePt}</p>
                    {cell && (
                      <p className="mt-0.5 text-[11px] font-medium text-faint">
                        {cell.opener} — {cell.title}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-4 flex gap-2">
          <button type="button" onClick={restart} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-600 py-3 font-semibold text-white hover:bg-cyan-700">
            <RotateCcw className="h-4 w-4" /> Praticar de novo
          </button>
          <button type="button" onClick={goToHome} className="rounded-xl border border-line px-4 py-3 font-medium text-secondary hover:bg-surface-2">
            Início
          </button>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------ a prática
  if (!current) return null;
  const cell = findCell(current.cellId);
  const good = result ? result.accuracy >= PASS_MARK : false;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <button type="button" onClick={restart} className="inline-flex items-center gap-1 text-sm font-medium text-tertiary hover:text-secondary">
          <ChevronLeft className="h-4 w-4" /> Sair
        </button>
        <span className="text-sm font-medium text-tertiary">
          {index + 1} / {items.length}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-surface-2">
        <div className="h-full bg-cyan-500 transition-all duration-300" style={{ width: `${((index + (result ? 1 : 0)) / items.length) * 100}%` }} />
      </div>

      {/* A pergunta */}
      <div className="mt-5 rounded-2xl border border-line bg-surface p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-faint">
              {cell ? `${cell.opener} · ${cell.title}` : 'pergunta'}
            </p>
            <p className="mt-1 text-xl font-bold leading-snug text-primary">{current.question}</p>
            <p className="mt-0.5 text-sm text-tertiary">{current.questionPt}</p>
          </div>
          <button
            type="button"
            onClick={() => sayQuestion(current.question)}
            aria-label="Ouvir a pergunta de novo"
            className="shrink-0 rounded-xl border border-line p-3 text-tertiary transition-colors hover:bg-cyan-50 hover:text-cyan-600"
          >
            <Volume2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* O que dizer */}
      <div className="mt-3 rounded-2xl border-2 border-dashed border-line bg-surface-2/60 p-5">
        <p className="text-[11px] font-bold uppercase tracking-wide text-faint">Responda em inglês</p>
        <p className="mt-1 text-lg font-semibold leading-snug text-primary">{current.cuePt}</p>
      </div>

      {/* Microfone */}
      {!result && (
        <div className="mt-4 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={isListening ? stopAndGrade : startListening}
            className={`flex h-20 w-20 items-center justify-center rounded-full text-white shadow-lg transition-all ${
              isListening ? 'animate-pulse bg-rose-600 hover:bg-rose-700' : 'bg-cyan-600 hover:bg-cyan-700'
            }`}
            aria-label={isListening ? 'Parar e avaliar' : 'Falar a resposta'}
          >
            {isListening ? <Square className="h-7 w-7" /> : <Mic className="h-8 w-8" />}
          </button>
          <p className="text-sm text-tertiary">
            {isListening ? 'Ouvindo… toque para avaliar' : 'Toque e diga a resposta'}
          </p>
          {isListening && transcript && (
            <p className="max-w-full px-4 text-center text-sm italic text-secondary">"{transcript}"</p>
          )}
          {error && <p className="text-xs text-rose-600">Erro no microfone: {error}</p>}
        </div>
      )}

      {/* Correção */}
      {result && (
        <div className="mt-4 flex flex-col gap-3">
          <div className={`rounded-2xl border-2 p-4 ${good ? 'border-emerald-300 bg-emerald-50' : 'border-amber-300 bg-amber-50'}`}>
            <div className="flex items-baseline justify-between">
              <p className={`text-sm font-bold ${good ? 'text-emerald-700' : 'text-amber-800'}`}>
                {good ? 'Boa — deu para entender' : 'Quase lá'}
              </p>
              <p className={`text-2xl font-extrabold tabular-nums ${good ? 'text-emerald-600' : 'text-amber-600'}`}>
                {result.accuracy}%
              </p>
            </div>

            {/* Palavra a palavra */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {result.words.map((w, i) => (
                <span
                  key={i}
                  title={w.spokenWord ? `você disse: ${w.spokenWord}` : 'não ouvi esta palavra'}
                  className={`rounded-md px-2 py-0.5 text-sm font-semibold ${
                    w.status === 'correct'
                      ? 'bg-emerald-200 text-emerald-900'
                      : w.status === 'approximate'
                      ? 'bg-amber-200 text-amber-900'
                      : 'bg-rose-200 text-rose-900 line-through'
                  }`}
                >
                  {w.word}
                </span>
              ))}
            </div>

            <p className="mt-3 text-xs text-tertiary">
              Você disse: <span className="italic">"{result.spoken}"</span>
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-4">
            <p className="text-[11px] font-bold uppercase tracking-wide text-faint">Resposta modelo</p>
            <div className="mt-1 flex items-center justify-between gap-3">
              <p className="text-base font-semibold text-primary">{current.answer}</p>
              <button
                type="button"
                onClick={() => sayQuestion(current.answer)}
                aria-label="Ouvir a resposta modelo"
                className="shrink-0 rounded-lg border border-line p-2 text-tertiary hover:bg-cyan-50 hover:text-cyan-600"
              >
                <Volume2 className="h-4 w-4" />
              </button>
            </div>
            {current.accepts && current.accepts.length > 0 && (
              <p className="mt-1 text-xs text-faint">
                Também vale: {current.accepts.join(' · ')}
              </p>
            )}
          </div>

          {/* A dica é a regra da célula — não um conselho genérico */}
          {!good && cell && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
              <div className="flex items-start gap-2">
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-amber-700">
                    {cell.opener}
                  </p>
                  <p className="mt-0.5 text-sm text-amber-900">{cell.rule}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button type="button" onClick={retry} className="flex items-center justify-center gap-2 rounded-xl border border-line px-4 py-3 font-medium text-secondary hover:bg-surface-2">
              <RotateCcw className="h-4 w-4" /> Tentar de novo
            </button>
            <button type="button" onClick={next} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-600 py-3 font-semibold text-white hover:bg-cyan-700">
              {index < items.length - 1 ? 'Próxima' : 'Ver resultado'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
