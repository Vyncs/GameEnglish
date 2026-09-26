// Etapa "Frases" — o aluno decora a palavra dentro de uma frase, não solta.
//
// O ciclo de cada card: o áudio toca sozinho quando o card abre, o aluno lê o
// sentido em português e REPETE falando. A correção é palavra a palavra, pelo
// mesmo motor do Karaokê e da Prática falada (compareTexts).
//
// A voz é ligada por padrão e se desliga uma única vez no perfil
// (useVoicePrefStore) — não card a card, senão a exigência vira um botão fácil
// de ignorar no meio do exercício. Desligada, a etapa vira leitura silenciosa.

import { useCallback, useEffect, useState } from 'react';
import {
  Volume2, Mic, Square, ArrowRight, RotateCcw, CheckCircle2, VolumeX,
} from 'lucide-react';
import { useSpeech } from '../hooks/useSpeech';
import { useSpeechRecognition, compareTexts, type WordCompareResult } from '../hooks/useSpeechRecognition';
import { useVoicePrefStore } from '../store/useVoicePrefStore';
import { WORD_KIND_LABEL, type Topic, type TopicItem } from '../data/topic';

interface Said {
  spoken: string;
  accuracy: number;
  words: WordCompareResult[];
}

/** Cor do chip pela classe da palavra — cada classe sempre na mesma cor. */
const KIND_STYLE: Record<string, string> = {
  adj: 'bg-purple-100 text-purple-700 border-purple-200',
  prep: 'bg-sky-100 text-sky-700 border-sky-200',
  subst: 'bg-amber-100 text-amber-700 border-amber-200',
  adv: 'bg-teal-100 text-teal-700 border-teal-200',
  verbo: 'bg-rose-100 text-rose-700 border-rose-200',
  pron: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  conj: 'bg-lime-100 text-lime-700 border-lime-200',
  expr: 'bg-orange-100 text-orange-700 border-orange-200',
};

export function SentenceStage({ topic, onDone, onBack }: {
  topic: Topic;
  onDone: () => void;
  onBack: () => void;
}) {
  // Só entram itens que têm frase escrita.
  const [items] = useState<TopicItem[]>(() => topic.items.filter((i) => i.sentence));
  const [index, setIndex] = useState(0);
  const [said, setSaid] = useState<Said | null>(null);

  const voiceEnabled = useVoicePrefStore((s) => s.voiceEnabled);
  const { speak, isSupported: canSpeak } = useSpeech();
  const {
    isListening, transcript, isSupported: canListen,
    startListening, stopListening, resetTranscript,
  } = useSpeechRecognition();

  const item = items[index];
  const sentence = item?.sentence;

  const say = useCallback((text: string) => {
    speak(text.replace(/…/g, ''), 'en-US');
  }, [speak]);

  // O áudio toca sozinho ao abrir o card. Só conversa com a síntese de voz:
  // quem zera o estado é o handler que avançou.
  useEffect(() => {
    if (!voiceEnabled || !sentence) return;
    say(sentence.en);
  }, [voiceEnabled, sentence, say]);

  if (!item || !sentence) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-center">
        <p className="text-tertiary">Este bloco ainda não tem frases cadastradas.</p>
        <button type="button" onClick={onBack} className="mt-3 text-sm font-medium text-accent underline">
          Voltar
        </button>
      </div>
    );
  }

  /** Fecha o microfone e compara o que foi dito com a frase. */
  const stopAndGrade = () => {
    stopListening();
    const spoken = transcript.trim();
    if (!spoken) return;
    const { accuracy, words } = compareTexts(sentence.en, spoken);
    setSaid({ spoken, accuracy, words });
  };

  const next = () => {
    setSaid(null);
    resetTranscript();
    if (index < items.length - 1) setIndex(index + 1);
    else onDone();
  };

  const retry = () => {
    setSaid(null);
    resetTranscript();
  };

  // Com voz ligada, avançar exige ter falado. Sem voz, segue livre.
  const mustSpeak = voiceEnabled && canListen;
  const canAdvance = !mustSpeak || said !== null;
  const last = index === items.length - 1;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-3 flex items-center justify-between">
        <button type="button" onClick={onBack} className="text-sm font-medium text-tertiary hover:text-secondary">
          ← Voltar
        </button>
        <span className="text-sm font-medium text-tertiary tabular-nums">
          {index + 1} / {items.length}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-surface-2">
        <div
          className="h-full bg-accent transition-all duration-300"
          style={{ width: `${((index + (said ? 1 : 0)) / items.length) * 100}%` }}
        />
      </div>

      {/* A palavra do bloco */}
      <div className="mt-5 flex items-baseline gap-2">
        <span className="text-xs font-bold uppercase tracking-wide text-faint">a palavra</span>
        <span className="text-lg font-extrabold text-primary">{item.base}</span>
        <span className="text-sm text-tertiary">— {item.pt}</span>
      </div>

      {/* A frase */}
      <div className="mt-2 rounded-2xl border border-line bg-surface p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <p className="text-xl font-bold leading-snug text-primary">{sentence.en}</p>
          <button
            type="button"
            onClick={() => say(sentence.en)}
            disabled={!canSpeak}
            aria-label="Ouvir a frase de novo"
            className="shrink-0 rounded-xl border border-line p-3 text-tertiary transition-colors hover:bg-accent-soft hover:text-accent disabled:opacity-40"
          >
            <Volume2 className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-1 text-[15px] text-tertiary">{sentence.pt}</p>

        {/* Palavras novas, por classe */}
        {sentence.newWords && sentence.newWords.length > 0 && (
          <div className="mt-4 border-t border-line pt-3">
            <p className="text-[11px] font-bold uppercase tracking-wide text-faint">Palavras novas nesta frase</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {sentence.newWords.map((w) => (
                <span
                  key={w.word}
                  className={`rounded-lg border px-2.5 py-1 text-xs ${KIND_STYLE[w.kind] ?? 'bg-surface-2 text-secondary border-line'}`}
                >
                  <b className="font-bold">{w.word}</b>
                  <span className="opacity-80"> · {w.pt}</span>
                  <span className="ml-1 opacity-60">({WORD_KIND_LABEL[w.kind]})</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Repetir falando */}
      {mustSpeak && !said && (
        <div className="mt-5 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={isListening ? stopAndGrade : startListening}
            className={`flex h-20 w-20 items-center justify-center rounded-full text-white shadow-lg transition-all ${
              isListening ? 'animate-pulse bg-rose-600 hover:bg-rose-700' : 'bg-accent hover:opacity-90'
            }`}
            aria-label={isListening ? 'Parar e avaliar' : 'Repetir a frase falando'}
          >
            {isListening ? <Square className="h-7 w-7" /> : <Mic className="h-8 w-8" />}
          </button>
          <p className="text-sm text-tertiary">
            {isListening ? 'Ouvindo… toque para avaliar' : 'Toque e repita a frase em voz alta'}
          </p>
          {isListening && transcript && (
            <p className="px-4 text-center text-sm italic text-secondary">"{transcript}"</p>
          )}
        </div>
      )}

      {/* Sem voz: a etapa vira leitura, e o aviso diz onde religar */}
      {!voiceEnabled && (
        <div className="mt-5 flex items-center gap-2 rounded-xl border border-line bg-surface-2 px-4 py-3">
          <VolumeX className="h-4 w-4 shrink-0 text-tertiary" />
          <p className="text-sm text-tertiary">
            Voz desligada. Religue em <b className="text-secondary">Conta → Voz nas frases</b> para ouvir e repetir.
          </p>
        </div>
      )}

      {voiceEnabled && !canListen && (
        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-sm text-amber-800">
            Este navegador não escuta o microfone — use Chrome ou Edge para repetir falando.
            O áudio da frase continua funcionando.
          </p>
        </div>
      )}

      {/* Correção */}
      {said && (
        <div className={`mt-5 rounded-2xl border-2 p-4 ${said.accuracy >= 70 ? 'border-emerald-300 bg-emerald-50' : 'border-amber-300 bg-amber-50'}`}>
          <div className="flex items-baseline justify-between">
            <p className={`text-sm font-bold ${said.accuracy >= 70 ? 'text-emerald-700' : 'text-amber-800'}`}>
              {said.accuracy >= 70 ? 'Boa pronúncia' : 'Quase — tente de novo'}
            </p>
            <p className={`text-2xl font-extrabold tabular-nums ${said.accuracy >= 70 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {said.accuracy}%
            </p>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {said.words.map((w, i) => (
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
        </div>
      )}

      {/* Avançar */}
      <div className="mt-5 flex gap-2">
        {said && (
          <button
            type="button"
            onClick={retry}
            className="flex items-center justify-center gap-2 rounded-xl border border-line px-4 py-3 font-medium text-secondary hover:bg-surface-2"
          >
            <RotateCcw className="h-4 w-4" /> Repetir
          </button>
        )}
        <button
          type="button"
          onClick={next}
          disabled={!canAdvance}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {last ? (
            <>Concluir etapa <CheckCircle2 className="h-5 w-5" /></>
          ) : (
            <>Próxima <ArrowRight className="h-5 w-5" /></>
          )}
        </button>
      </div>

      {mustSpeak && !said && (
        <p className="mt-2 text-center text-xs text-faint">
          Repita a frase em voz alta para liberar o avanço.
        </p>
      )}
    </div>
  );
}
