import { useCallback, useEffect, useRef, useState } from 'react';
import { getToken } from '../api/client';
import type { Viseme } from '../types/englishCoach';

/**
 * useCoachVoice — TTS de qualidade com fallback automático.
 *
 * Estratégia (Semana 3):
 *   1. Detecta capacidades do servidor (`/voice/status`):
 *      - tts: ElevenLabs disponível
 *      - ttsWithTimestamps: ElevenLabs com timestamps por caractere
 *   2. Quando timestamps disponíveis, usa POST /voice/tts-with-timestamps
 *      (recebe áudio + alignment + visemes pré-calculados em uma chamada).
 *   3. Quando timestamps indisponíveis, cai pra POST /voice/tts (mp3 puro).
 *   4. Quando servidor indisponível, cai pra Web Speech API (sem visemas).
 *
 * Cache: armazena URLs de blob + visemes por (text+slow) durante a sessão.
 *
 * Eventos: `onPlaybackStart` recebe `{ audio, visemes }` — base do lip sync.
 * `onPlaybackEnd` é chamado quando o áudio termina (audio.onended REAL,
 * não polling). Substitui hack da Semana 2.
 */

const API_URL =
  import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? '' : 'http://localhost:3001');

interface PlayOptions {
  slow?: boolean;
  /** Chamado quando playback começa, com refs do áudio e visemes (se houver). */
  onPlaybackStart?: (info: { audio: HTMLAudioElement | null; visemes: Viseme[] | null }) => void;
  /** Chamado quando playback termina naturalmente OU é interrompido. */
  onPlaybackEnd?: (info: { aborted: boolean }) => void;
}

interface VoiceStatus {
  tts: boolean;
  stt: boolean;
  ttsWithTimestamps?: boolean;
}

interface CachedAudio {
  url: string;
  visemes: Viseme[] | null;
}

const blobCache = new Map<string, CachedAudio>();

function cacheKey(text: string, slow: boolean) {
  return `${slow ? '1' : '0'}::${text}`;
}

/** Decodifica base64 → Blob mp3. */
function base64ToBlob(b64: string, mime = 'audio/mpeg'): Blob {
  const byteChars = atob(b64);
  const len = byteChars.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = byteChars.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

interface TtsWithTimestampsResponse {
  audioBase64: string;
  alignment: unknown;
  visemes: Viseme[] | null;
}

export function useCoachVoice() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [serverAvailable, setServerAvailable] = useState<boolean | null>(null);
  const [timestampsSupported, setTimestampsSupported] = useState<boolean | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isMountedRef = useRef(true);
  /** Callback do playback corrente — usado pra disparar onPlaybackEnd. */
  const playbackEndRef = useRef<((info: { aborted: boolean }) => void) | null>(null);

  // Detecta capacidades do servidor.
  useEffect(() => {
    isMountedRef.current = true;
    const token = getToken();
    if (!token) {
      setServerAvailable(false);
      setTimestampsSupported(false);
      return;
    }
    fetch(`${API_URL}/api/english-coach/voice/status`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: VoiceStatus | null) => {
        if (!isMountedRef.current) return;
        setServerAvailable(!!data?.tts);
        setTimestampsSupported(!!data?.ttsWithTimestamps);
      })
      .catch(() => {
        if (isMountedRef.current) {
          setServerAvailable(false);
          setTimestampsSupported(false);
        }
      });
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (playbackEndRef.current) {
      const cb = playbackEndRef.current;
      playbackEndRef.current = null;
      cb({ aborted: true });
    }
    setIsPlaying(false);
  }, []);

  const playWithWebSpeech = useCallback(
    (text: string, slow: boolean, opts: PlayOptions): boolean => {
      if (!('speechSynthesis' in window)) {
        opts.onPlaybackEnd?.({ aborted: true });
        return false;
      }
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(text);
      utt.lang = 'en-US';
      utt.rate = slow ? 0.7 : 0.95;
      utt.pitch = 1;
      const voices = window.speechSynthesis.getVoices();
      const en = voices.find((v) => v.lang.startsWith('en'));
      if (en) utt.voice = en;

      const finish = (aborted: boolean) => {
        setIsPlaying(false);
        if (playbackEndRef.current) {
          const cb = playbackEndRef.current;
          playbackEndRef.current = null;
          cb({ aborted });
        }
      };

      utt.onstart = () => {
        setIsPlaying(true);
        // Web Speech não fornece referência ao audio — onPlaybackStart com visemes:null.
        opts.onPlaybackStart?.({ audio: null, visemes: null });
      };
      utt.onend = () => finish(false);
      utt.onerror = () => finish(true);

      playbackEndRef.current = opts.onPlaybackEnd || null;
      window.speechSynthesis.speak(utt);
      return true;
    },
    []
  );

  const playWithServerTimestamps = useCallback(
    async (text: string, slow: boolean, opts: PlayOptions): Promise<boolean> => {
      const token = getToken();
      if (!token) return false;

      try {
        const key = cacheKey(text, slow);
        let cached = blobCache.get(key) || null;

        if (!cached) {
          const res = await fetch(
            `${API_URL}/api/english-coach/voice/tts-with-timestamps`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ text, slow }),
            }
          );
          if (!res.ok) {
            if (res.status === 501) setTimestampsSupported(false);
            return false;
          }
          const data = (await res.json()) as TtsWithTimestampsResponse;
          if (!data?.audioBase64) return false;
          const blob = base64ToBlob(data.audioBase64);
          const url = URL.createObjectURL(blob);
          cached = { url, visemes: data.visemes ?? null };
          blobCache.set(key, cached);
        }

        return playAudioElement(text, cached.url, cached.visemes, slow, opts);
      } catch (err) {
        console.warn('[useCoachVoice] tts-with-timestamps failed, falling back', err);
        return false;
      }
    },
    []
  );

  const playWithServerSimple = useCallback(
    async (text: string, slow: boolean, opts: PlayOptions): Promise<boolean> => {
      const token = getToken();
      if (!token) return false;

      try {
        const key = cacheKey(text, slow);
        let cached = blobCache.get(key) || null;

        if (!cached) {
          const res = await fetch(`${API_URL}/api/english-coach/voice/tts`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ text, slow }),
          });
          if (!res.ok) {
            if (res.status === 501) setServerAvailable(false);
            return false;
          }
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          cached = { url, visemes: null };
          blobCache.set(key, cached);
        }

        return playAudioElement(text, cached.url, cached.visemes, slow, opts);
      } catch (err) {
        console.warn('[useCoachVoice] server TTS failed, falling back', err);
        return false;
      }
    },
    []
  );

  /**
   * Toca um <audio> a partir de blob URL com visemes opcionais.
   * Anexa onended REAL (substitui o hack de polling da Semana 2).
   */
  const playAudioElement = useCallback(
    (
      _text: string,
      url: string,
      visemes: Viseme[] | null,
      slow: boolean,
      opts: PlayOptions
    ): boolean => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.playbackRate = slow ? 0.85 : 1;

      const finish = (aborted: boolean) => {
        setIsPlaying(false);
        if (playbackEndRef.current) {
          const cb = playbackEndRef.current;
          playbackEndRef.current = null;
          cb({ aborted });
        }
      };

      audio.onplay = () => {
        setIsPlaying(true);
        opts.onPlaybackStart?.({ audio, visemes });
      };
      audio.onended = () => finish(false);
      audio.onerror = () => finish(true);
      audio.onpause = () => {
        // Pause sem ended — só dispara end se foi um stop intencional
        // (audioRef.current já zerado por stop()). Caso contrário, ignora.
        if (audioRef.current === null && playbackEndRef.current) {
          finish(true);
        }
      };

      playbackEndRef.current = opts.onPlaybackEnd || null;

      audio.play().catch((err) => {
        console.warn('[useCoachVoice] audio.play() failed:', err);
        finish(true);
      });

      return true;
    },
    []
  );

  /**
   * Toca o texto. Cascata:
   *   1. ElevenLabs com timestamps (lip sync real)
   *   2. ElevenLabs sem timestamps (sem lip sync)
   *   3. Web Speech API (sem lip sync)
   *
   * Resolve com:
   *   - `true` quando playback começou
   *   - `false` quando todos os caminhos falharam
   *
   * Resolve assim que playback INICIA (não espera terminar). Use
   * `opts.onPlaybackEnd` para reagir ao fim real.
   */
  const play = useCallback(
    async (text: string, opts: PlayOptions = {}): Promise<boolean> => {
      if (!text || !text.trim()) {
        opts.onPlaybackEnd?.({ aborted: true });
        return false;
      }
      stop();
      const slow = !!opts.slow;

      // 1. Tenta com timestamps se sabemos que está disponível
      if (timestampsSupported === true) {
        const ok = await playWithServerTimestamps(text, slow, opts);
        if (ok) return true;
        // Se falhou aqui, segue cascata.
      }

      // 2. Tenta sem timestamps se servidor disponível
      if (serverAvailable !== false) {
        const ok = await playWithServerSimple(text, slow, opts);
        if (ok) return true;
      }

      // 3. Fallback Web Speech
      return playWithWebSpeech(text, slow, opts);
    },
    [
      timestampsSupported,
      serverAvailable,
      stop,
      playWithServerTimestamps,
      playWithServerSimple,
      playWithWebSpeech,
    ]
  );

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      stop();
    };
  }, [stop]);

  return {
    play,
    stop,
    isPlaying,
    /**
     * `null` = ainda checando, `true` = ElevenLabs disponível, `false` = só Web Speech.
     */
    serverAvailable,
    /**
     * `null` = ainda checando, `true` = lip sync viseme-based disponível,
     * `false` = sem timestamps (orb fica em modo amplitude-fake).
     */
    timestampsSupported,
  };
}
