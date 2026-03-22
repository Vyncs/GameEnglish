import { Lock } from 'lucide-react';

/**
 * Camada premium: blur leve no card + cadeado centralizado (Pairs, Karaoke, etc.).
 * Use `pointer-events-none` para o clique continuar no botão/card pai.
 */
export function LockedCardOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-hidden rounded-[inherit]"
      aria-hidden
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/45 via-white/25 to-slate-100/35 backdrop-blur-[3px]" />
      <Lock
        className="relative h-9 w-9 shrink-0 text-amber-600 drop-shadow-[0_1px_2px_rgba(255,255,255,0.95),0_2px_8px_rgba(0,0,0,0.2)]"
        strokeWidth={2.25}
        aria-hidden
      />
    </div>
  );
}
