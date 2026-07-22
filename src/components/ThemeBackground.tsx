import type { CSSProperties } from 'react';
import { useThemeStore } from '../store/useThemeStore';
import { findTheme } from '../data/themes';

// Partículas com posição e tempo FIXOS (determinístico de propósito: nada de
// Math.random durante o render). A variedade vem dos valores escolhidos à mão.
const PARTICLES = [
  { left: 3, size: 4, delay: 0, dur: 22, drift: 26 },
  { left: 9, size: 6, delay: 6, dur: 17, drift: -18 },
  { left: 15, size: 3, delay: 11, dur: 26, drift: 14 },
  { left: 21, size: 5, delay: 2, dur: 20, drift: -24 },
  { left: 27, size: 4, delay: 14, dur: 24, drift: 20 },
  { left: 33, size: 7, delay: 8, dur: 16, drift: -12 },
  { left: 39, size: 3, delay: 18, dur: 28, drift: 28 },
  { left: 45, size: 5, delay: 4, dur: 19, drift: -20 },
  { left: 51, size: 4, delay: 12, dur: 23, drift: 16 },
  { left: 57, size: 6, delay: 1, dur: 21, drift: -26 },
  { left: 63, size: 3, delay: 16, dur: 27, drift: 22 },
  { left: 69, size: 5, delay: 7, dur: 18, drift: -16 },
  { left: 75, size: 4, delay: 20, dur: 25, drift: 24 },
  { left: 81, size: 6, delay: 3, dur: 20, drift: -22 },
  { left: 87, size: 3, delay: 10, dur: 29, drift: 18 },
  { left: 93, size: 5, delay: 15, dur: 22, drift: -14 },
  { left: 97, size: 4, delay: 5, dur: 26, drift: 20 },
];

/**
 * Wallpaper animado do tema: camadas de gradiente + brilho pulsante +
 * partículas (fagulhas, brasas, neve…). Fica atrás de tudo e não recebe clique.
 */
export function ThemeBackground() {
  const themeId = useThemeStore((s) => s.themeId);
  const { scene } = findTheme(themeId);
  const animation = scene.motion === 'rise' ? 'rpg-rise' : 'rpg-fall';

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ background: scene.background }}
    >
      {/* Brilho superior que "respira" */}
      <div
        className="rpg-glow absolute -top-1/3 left-1/2 h-[80vh] w-[130vw] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(closest-side, ${scene.glow}, transparent)`,
          animation: 'rpg-breathe 9s ease-in-out infinite',
        }}
      />

      {/* Partículas */}
      {PARTICLES.map((p, i) => {
        const style = {
          left: `${p.left}%`,
          top: 0,
          width: p.size,
          height: p.size,
          background: scene.particle,
          boxShadow: `0 0 ${p.size * 2.5}px ${scene.particle}`,
          animation: `${animation} ${p.dur}s linear ${p.delay}s infinite`,
          '--drift': `${p.drift}px`,
        } as CSSProperties;
        return <span key={i} className="rpg-particle" style={style} />;
      })}
    </div>
  );
}
