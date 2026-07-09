import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import type {
  VoiceConversationStatus,
  VoiceConversationState,
  CoachLevel,
  CoachMode,
} from '../types/englishCoach';
import { useCoachVoice } from './useCoachVoice';
import { useAvatarState } from '../components/english-coach/avatar/AvatarStateProvider';

// ==========================================
// Web Speech API — usamos os globals já declarados em useSpeechRecognition.ts
// (SpeechRecognition, webkitSpeechRecognition, SpeechRecognitionEvent).
// Aqui replicamos apenas alias local para a interface mínima que usamos.
// ==========================================

type RecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((e: SpeechResultLikeEvent) => void) | null;
  onerror: ((e: Event) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
};

interface SpeechResultLikeEvent extends Event {
  results: ArrayLike<SpeechResultItem>;
  resultIndex: number;
}

interface SpeechResultItem {
  isFinal: boolean;
  length: number;
  [i: number]: { transcript: string; confidence: number };
}

// ==========================================
// Constantes do loop
// ==========================================

/** Tempo de silêncio (sem novo interim) que considera fala finalizada. */
const SILENCE_TIMEOUT_MS = 1500;
/** Tempo mínimo de fala antes de aceitar uma utterance. Filtra ruído. */
const MIN_UTTERANCE_MS = 600;
/** Espera após TTS terminar antes de reabrir STT (evita capturar eco). */
const POST_TTS_GUARD_MS = 350;

// ==========================================
// API
// ==========================================

export interface UseVoiceConversationOptions {
  level: CoachLevel;
  mode: CoachMode;
  conversationId: string | null;
  /** Idioma do STT. Default 'en-US'. */
  lang?: string;
  /**
   * Chamado quando o usuário terminou uma utterance. Deve enviar ao backend
   * e devolver o reply final (já consolidado pelo stream).
   *
   * Implementação típica:
   *   onTranscript: async (text) => {
   *     await sendMessageStreaming(text, runStream, avatarCallbacks);
   *     const last = store.getState().messages.slice(-1)[0];
   *     return last?.role === 'assistant' ? last.content : '';
   *   }
   */
  onTranscript: (transcript: string) => Promise<string>;
}

export interface UseVoiceConversationReturn extends VoiceConversationState {
  isSupported: boolean;
  start: () => Promise<void>;
  stop: () => void;
  isActive: boolean;
}

/**
 * useVoiceConversation — orquestra o loop:
 *
 *   start() → permission → STT.start
 *     ↓ silence detected OU final result
 *   STT.stop → coleta transcript → onTranscript(text)
 *     ↓ resolve → reply
 *   coachVoice.play(reply) → audio acaba (heurística + safety)
 *     ↓ guard
 *   STT.start (loop) ...
 *
 *   stop() interrompe em qualquer ponto.
 *
 * Anti-loop: STT é abortado durante TTS. Cleanup-safe via refs + flags.
 */
export function useVoiceConversation({
  level,
  mode,
  conversationId,
  lang = 'en-US',
  onTranscript,
}: UseVoiceConversationOptions): UseVoiceConversationReturn {
  const [status, setStatus] = useState<VoiceConversationStatus>('idle');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognitionRef = useRef<RecognitionInstance | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const utteranceStartRef = useRef<number>(0);
  const accumulatedRef = useRef<{ final: string; interim: string }>({ final: '', interim: '' });
  const activeRef = useRef(false);
  const stoppingRef = useRef(false);
  const postTtsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Estável — onTranscript pode mudar a cada render. Usamos ref pra evitar
  // reconstruir o STT toda hora e perder o microfone.
  const onTranscriptRef = useRef(onTranscript);
  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  const { play: playVoice, stop: stopVoice } = useCoachVoice();
  const avatar = useAvatarState();

  const isSupported =
    typeof window !== 'undefined' &&
    !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  // ----- Helpers -----

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  const clearPostTtsTimer = useCallback(() => {
    if (postTtsTimerRef.current) {
      clearTimeout(postTtsTimerRef.current);
      postTtsTimerRef.current = null;
    }
  }, []);

  const safeStopRecognition = useCallback(() => {
    const rec = recognitionRef.current;
    if (!rec) return;
    try {
      rec.onresult = null;
      rec.onerror = null;
      rec.onend = null;
      rec.onstart = null;
      rec.abort();
    } catch {
      /* noop */
    }
    recognitionRef.current = null;
  }, []);

  // ----- Forward declarations via ref pra evitar circular deps -----
  const startListeningRef = useRef<() => void>(() => {});
  const processTranscriptRef = useRef<(t: string) => Promise<void>>(async () => {});

  // ----- Pipeline pós-transcrição -----
  // Agora usa audio.onended REAL via callback do useCoachVoice, em vez do
  // polling de speechSynthesis.speaking da Semana 2. Loop fica determinístico.

  const processTranscript = useCallback(
    async (transcript: string) => {
      if (!activeRef.current) return;
      setStatus('processing');
      avatar.setThinking();
      setInterimTranscript('');

      let reply = '';
      try {
        reply = await onTranscriptRef.current(transcript);
      } catch (err) {
        if (!activeRef.current) return;
        const msg = err instanceof Error ? err.message : 'Erro ao processar fala';
        toast.error(msg);
        if (activeRef.current) startListeningRef.current();
        return;
      }

      if (!activeRef.current) return;

      if (!reply) {
        startListeningRef.current();
        return;
      }

      setStatus('speaking');

      // Toca a resposta. Aguarda o callback `onPlaybackEnd` (audio.onended
      // real) antes de reabrir listening. Cobre o caso Web Speech também.
      try {
        await playVoice(reply, {
          onPlaybackStart: ({ audio, visemes }) => {
            // Injeta audio + visemes no avatar para o lip sync.
            avatar.setSpeaking({
              startedAt: Date.now(),
              audioElement: audio,
              visemes: visemes ?? undefined,
            });
          },
          onPlaybackEnd: ({ aborted }) => {
            // Stop manual já é tratado no stop(). Aqui reagimos ao fim natural.
            if (!activeRef.current) return;
            if (aborted) {
              // Stop / erro — não reabre listening (stop() já cuida).
              return;
            }
            // Pequena guarda pra evitar capturar eco residual.
            clearPostTtsTimer();
            postTtsTimerRef.current = setTimeout(() => {
              if (activeRef.current) startListeningRef.current();
            }, POST_TTS_GUARD_MS);
          },
        });
      } catch (err) {
        console.warn('[voice-conversation] playVoice failed:', err);
        // Se o playVoice nem chegou a iniciar, reabre listening.
        if (activeRef.current) startListeningRef.current();
      }
    },
    [avatar, playVoice, clearPostTtsTimer]
  );

  useEffect(() => {
    processTranscriptRef.current = processTranscript;
  }, [processTranscript]);

  // ----- STT setup -----

  const startListening = useCallback(() => {
    if (!isSupported) {
      setStatus('error');
      setErrorMessage('Reconhecimento de voz não suportado neste navegador');
      activeRef.current = false;
      return;
    }
    if (!activeRef.current) return;

    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition!;
    safeStopRecognition();

    // Cast: o tipo global é SpeechRecognition (W3C); usamos um subset
    // tipado localmente como RecognitionInstance para o handlers.
    const rec = new Ctor() as unknown as RecognitionInstance;
    rec.lang = lang;
    rec.continuous = true;
    rec.interimResults = true;

    accumulatedRef.current = { final: '', interim: '' };
    utteranceStartRef.current = Date.now();

    rec.onstart = () => {
      setStatus('listening');
      avatar.setListening('voice');
    };

    rec.onresult = (event) => {
      let finalChunk = '';
      let interimChunk = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const r = event.results[i];
        const t = r[0]?.transcript ?? '';
        if (r.isFinal) finalChunk += t;
        else interimChunk += t;
      }
      if (finalChunk) {
        const sep = accumulatedRef.current.final ? ' ' : '';
        accumulatedRef.current.final += sep + finalChunk;
      }
      accumulatedRef.current.interim = interimChunk;
      const full =
        accumulatedRef.current.final +
        (accumulatedRef.current.interim ? ' ' + accumulatedRef.current.interim : '');
      setInterimTranscript(full.trim());

      // Reset silence timer.
      clearSilenceTimer();
      silenceTimerRef.current = setTimeout(() => {
        try {
          rec.stop();
        } catch {
          /* noop */
        }
      }, SILENCE_TIMEOUT_MS);
    };

    rec.onerror = (e) => {
      const errorEvent = e as Event & { error?: string };
      // 'no-speech' e 'aborted' são esperados — ignorados.
      if (errorEvent.error && !['no-speech', 'aborted'].includes(errorEvent.error)) {
        setStatus('error');
        setErrorMessage(`Erro de microfone: ${errorEvent.error}`);
        activeRef.current = false;
      }
    };

    rec.onend = () => {
      clearSilenceTimer();
      if (!activeRef.current || stoppingRef.current) return;

      const transcript = accumulatedRef.current.final.trim();
      const elapsed = Date.now() - utteranceStartRef.current;

      if (!transcript || elapsed < MIN_UTTERANCE_MS) {
        // Sem fala suficiente — reabrir listening.
        startListening();
        return;
      }
      processTranscriptRef.current(transcript);
    };

    recognitionRef.current = rec;
    try {
      rec.start();
    } catch (err) {
      console.warn('[voice-conversation] failed to start STT', err);
    }
  }, [isSupported, lang, avatar, clearSilenceTimer, safeStopRecognition]);

  useEffect(() => {
    startListeningRef.current = startListening;
  }, [startListening]);

  // ----- Public API -----

  const start = useCallback(async () => {
    if (activeRef.current) return;
    if (!isSupported) {
      toast.error('Reconhecimento de voz não suportado neste navegador');
      return;
    }
    setStatus('starting');
    setErrorMessage(null);
    setInterimTranscript('');

    // ----- Pré-checks (antes de chamar getUserMedia) -----
    // Contexto inseguro: getUserMedia só funciona em HTTPS ou localhost.
    // Em http://192.168.x.x ou ip externo o `navigator.mediaDevices` fica
    // undefined em Chrome/Edge — daí a mensagem genérica anterior.
    if (typeof window !== 'undefined' && window.isSecureContext === false) {
      const msg =
        'O microfone só funciona em HTTPS (ou localhost). Acesse o site via uma URL https:// para ativar a voz.';
      setStatus('error');
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      const msg =
        'Este navegador não expõe o microfone. Tente Chrome ou Edge atualizados.';
      setStatus('error');
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    // ----- Tenta getUserMedia com diagnóstico fino -----
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop());
    } catch (err) {
      const name = (err as { name?: string })?.name || '';
      const msg = friendlyMicErrorMessage(name);
      setStatus('error');
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    activeRef.current = true;
    stoppingRef.current = false;
    startListening();
  }, [isSupported, startListening]);

  const stop = useCallback(() => {
    stoppingRef.current = true;
    activeRef.current = false;
    clearSilenceTimer();
    clearPostTtsTimer();
    safeStopRecognition();
    stopVoice();
    setStatus('idle');
    setInterimTranscript('');
    setErrorMessage(null);
    avatar.setIdle();
  }, [avatar, clearPostTtsTimer, clearSilenceTimer, safeStopRecognition, stopVoice]);

  // Cleanup completo no unmount.
  useEffect(() => {
    return () => {
      stoppingRef.current = true;
      activeRef.current = false;
      clearSilenceTimer();
      clearPostTtsTimer();
      safeStopRecognition();
      stopVoice();
    };
  }, [clearSilenceTimer, clearPostTtsTimer, safeStopRecognition, stopVoice]);

  // level/mode/conversationId não exigem reset do STT — cada utterance é
  // processada com config atualizada via fechura no caller.
  void level;
  void mode;
  void conversationId;

  return {
    status,
    interimTranscript,
    errorMessage,
    isSupported,
    start,
    stop,
    isActive: status !== 'idle' && status !== 'error',
  };
}

/**
 * Mapeia error.name de getUserMedia em mensagem útil em português.
 * Cada caso traz a AÇÃO concreta — usuário sabe o que fazer.
 */
function friendlyMicErrorMessage(errorName: string): string {
  switch (errorName) {
    case 'NotAllowedError':
    case 'PermissionDeniedError': // Safari antigo
      return 'Permissão do microfone negada. Clique no cadeado da barra de endereço e permita o microfone, depois recarregue.';
    case 'NotFoundError':
    case 'DevicesNotFoundError':
      return 'Nenhum microfone detectado. Conecte um microfone e tente de novo.';
    case 'NotReadableError':
    case 'TrackStartError':
      return 'O microfone está em uso por outro aplicativo. Feche-o e tente novamente.';
    case 'OverconstrainedError':
    case 'ConstraintNotSatisfiedError':
      return 'O microfone disponível não atende aos requisitos. Tente outro dispositivo.';
    case 'SecurityError':
      return 'Bloqueado por política de segurança. Verifique se o site está em HTTPS.';
    case 'AbortError':
      return 'Acesso ao microfone foi interrompido. Tente novamente.';
    case 'TypeError':
      return 'API de microfone indisponível. Use Chrome ou Edge atualizados.';
    default:
      return errorName
        ? `Não foi possível acessar o microfone (${errorName}).`
        : 'Não foi possível acessar o microfone.';
  }
}
