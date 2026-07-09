import { useEffect, useRef, useState } from 'react';
import type { Viseme, VisemeShape } from '../types/englishCoach';

/**
 * useCurrentViseme — driver puro de lip sync.
 *
 * Lê `audio.currentTime` em cada frame (requestAnimationFrame) e devolve o
 * viseme ativo no instante. Independente de renderer — quem consome (Rive,
 * Lottie, CSS, SVG) escolhe como mapear shape→visual.
 *
 * Performance: rAF roda só enquanto o áudio está tocando. Quando audio é
 * `null` ou pausado, retorna {shape:'silent', weight:0} e não agenda frames.
 *
 * Algoritmo:
 *   Mantém um índice cursor que avança monotonicamente (visemes vêm em ordem
 *   crescente de time). Em cada tick, avança o cursor enquanto
 *   `visemes[cursor+1].time <= currentTime`. O atual é `visemes[cursor]`.
 *   Suaviza weight com decay exponencial pra evitar mudanças bruscas.
 */

interface UseCurrentVisemeArgs {
  /** Áudio em playback. null/undefined = silent. */
  audio: HTMLAudioElement | null | undefined;
  /** Array de visemes com timestamps. null = sem lip sync. */
  visemes: Viseme[] | null | undefined;
  /** Default 'silent' quando sem dados. */
  defaultShape?: VisemeShape;
}

export interface CurrentViseme {
  shape: VisemeShape;
  /** 0–1, suavizado via easing. */
  weight: number;
}

const SILENT: CurrentViseme = { shape: 'silent', weight: 0 };

/** Fator de suavização (lerp por frame). 1 = sem suavização, 0 = imutável. */
const SMOOTH_FACTOR = 0.35;

export function useCurrentViseme({
  audio,
  visemes,
  defaultShape = 'silent',
}: UseCurrentVisemeArgs): CurrentViseme {
  const [current, setCurrent] = useState<CurrentViseme>({ shape: defaultShape, weight: 0 });
  const cursorRef = useRef(0);
  const smoothedWeightRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Reset quando o array muda (nova fala).
    cursorRef.current = 0;
    smoothedWeightRef.current = 0;

    if (!audio || !visemes || visemes.length === 0) {
      setCurrent(SILENT);
      return;
    }

    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      // Se áudio acabou ou pausou, pára.
      if (audio.paused || audio.ended) {
        // Decay até silent
        smoothedWeightRef.current = smoothedWeightRef.current * (1 - SMOOTH_FACTOR);
        if (smoothedWeightRef.current < 0.02) {
          setCurrent(SILENT);
          rafRef.current = null;
          return;
        }
        setCurrent((prev) => ({ shape: prev.shape, weight: smoothedWeightRef.current }));
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const t = audio.currentTime;

      // Avança cursor até `visemes[cursor]` ser o ativo.
      let cursor = cursorRef.current;
      while (
        cursor + 1 < visemes.length &&
        visemes[cursor + 1].time <= t
      ) {
        cursor++;
      }
      cursorRef.current = cursor;

      const target = visemes[cursor] ?? SILENT;
      // Suavização: lerp do weight atual em direção ao target.
      smoothedWeightRef.current =
        smoothedWeightRef.current + (target.weight - smoothedWeightRef.current) * SMOOTH_FACTOR;

      setCurrent({
        shape: target.shape as VisemeShape,
        weight: Math.max(0, Math.min(1, smoothedWeightRef.current)),
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    // Inicia o loop quando o áudio começa a tocar.
    const onPlay = () => {
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    const onEndOrPause = () => {
      // Deixa o tick decair naturalmente até silent (não cancela imediatamente).
      // Isso evita "fechamento brusco" da boca.
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('ended', onEndOrPause);
    audio.addEventListener('pause', onEndOrPause);

    // Se já está tocando quando hook ativa (caso do callback onPlaybackStart),
    // dispara imediatamente.
    if (!audio.paused && !audio.ended) {
      rafRef.current = requestAnimationFrame(tick);
    }

    return () => {
      cancelled = true;
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('ended', onEndOrPause);
      audio.removeEventListener('pause', onEndOrPause);
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [audio, visemes]);

  return current;
}
