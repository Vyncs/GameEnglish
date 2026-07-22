// Temas de acento do app (estilo RPG).
//
// A cor de ACENTO é a "cor da marca": aparece em botões principais, barras de
// progresso, destaques e na Sessão de hoje. As cores de SEÇÃO (Início ciano,
// Bricks âmbar, Pairs rosa, Readers índigo) NÃO mudam — elas identificam cada
// área do app e continuam iguais em todos os temas.

/** Cenário de fundo animado de cada tema. */
export interface ThemeScene {
  /** Camadas de gradiente que formam o "wallpaper" (claro, para o texto seguir legível). */
  background: string;
  /** Direção das partículas: sobem (brasa, fagulha) ou caem (neve, folha). */
  motion: 'rise' | 'fall';
  /** Cor das partículas. */
  particle: string;
  /** Brilho decorativo no topo da tela. */
  glow: string;
}

export interface AppTheme {
  id: string;
  name: string;
  emoji: string;
  description: string;
  scene: ThemeScene;
  colors: {
    /** Cor principal do acento. */
    accent: string;
    /** Tom mais fechado — usado no fim dos gradientes e em hover. */
    accentStrong: string;
    /** Fundo suave (tint) para blocos e selos. */
    accentSoft: string;
    /** Borda suave. */
    accentBorder: string;
    /** Texto de acento sobre fundo claro (precisa de contraste). */
    accentText: string;
  };
}

export const THEMES: AppTheme[] = [
  {
    id: 'arcano',
    name: 'Arcano',
    emoji: '🔮',
    description: 'Violeta místico — o tema clássico',
    scene: {
      background:
        'radial-gradient(1100px 620px at 12% -12%, #ede9fe 0%, transparent 62%),' +
        'radial-gradient(900px 520px at 96% -4%, #e0e7ff 0%, transparent 58%),' +
        'radial-gradient(700px 480px at 50% 108%, #f3e8ff 0%, transparent 60%),' +
        'linear-gradient(180deg, #fbfaff 0%, #f4f1fe 100%)',
      motion: 'rise',
      particle: 'rgba(139, 92, 246, 0.55)',
      glow: 'rgba(139, 92, 246, 0.18)',
    },
    colors: {
      accent: '#8b5cf6',
      accentStrong: '#4f46e5',
      accentSoft: '#f5f3ff',
      accentBorder: '#ddd6fe',
      accentText: '#6d28d9',
    },
  },
  {
    id: 'floresta',
    name: 'Floresta Élfica',
    emoji: '🌿',
    description: 'Verde esmeralda da mata antiga',
    scene: {
      background:
        'radial-gradient(1100px 620px at 10% -12%, #d1fae5 0%, transparent 62%),' +
        'radial-gradient(900px 520px at 98% 2%, #ccfbf1 0%, transparent 58%),' +
        'radial-gradient(760px 500px at 45% 110%, #ecfccb 0%, transparent 62%),' +
        'linear-gradient(180deg, #f7fdfa 0%, #eefaf3 100%)',
      motion: 'rise',
      particle: 'rgba(16, 185, 129, 0.5)',
      glow: 'rgba(16, 185, 129, 0.16)',
    },
    colors: {
      accent: '#10b981',
      accentStrong: '#0f766e',
      accentSoft: '#ecfdf5',
      accentBorder: '#a7f3d0',
      accentText: '#047857',
    },
  },
  {
    id: 'gelo',
    name: 'Reino de Gelo',
    emoji: '❄️',
    description: 'Azul glacial das terras do norte',
    scene: {
      background:
        'radial-gradient(1100px 620px at 14% -12%, #cffafe 0%, transparent 62%),' +
        'radial-gradient(900px 520px at 96% 0%, #dbeafe 0%, transparent 58%),' +
        'radial-gradient(720px 480px at 55% 108%, #e0f2fe 0%, transparent 60%),' +
        'linear-gradient(180deg, #f8fdff 0%, #eef7fd 100%)',
      motion: 'fall',
      particle: 'rgba(255, 255, 255, 0.95)',
      glow: 'rgba(6, 182, 212, 0.16)',
    },
    colors: {
      accent: '#06b6d4',
      accentStrong: '#1d4ed8',
      accentSoft: '#ecfeff',
      accentBorder: '#a5f3fc',
      accentText: '#0e7490',
    },
  },
  {
    id: 'masmorra',
    name: 'Masmorra',
    emoji: '🔥',
    description: 'Brasa e ferro das profundezas',
    scene: {
      background:
        'radial-gradient(1000px 600px at 50% -14%, #fee2e2 0%, transparent 60%),' +
        'radial-gradient(880px 520px at 6% 4%, #ffedd5 0%, transparent 58%),' +
        'radial-gradient(760px 500px at 96% 106%, #fef3c7 0%, transparent 62%),' +
        'linear-gradient(180deg, #fdf9f7 0%, #f7efec 100%)',
      motion: 'rise',
      particle: 'rgba(239, 68, 68, 0.5)',
      glow: 'rgba(239, 68, 68, 0.16)',
    },
    colors: {
      accent: '#ef4444',
      accentStrong: '#991b1b',
      accentSoft: '#fef2f2',
      accentBorder: '#fecaca',
      accentText: '#b91c1c',
    },
  },
  {
    id: 'pergaminho',
    name: 'Pergaminho',
    emoji: '📜',
    description: 'Ouro velho dos grimórios',
    scene: {
      background:
        'radial-gradient(1000px 600px at 16% -10%, #fef3c7 0%, transparent 60%),' +
        'radial-gradient(880px 520px at 98% 6%, #fde68a 0%, transparent 52%),' +
        'radial-gradient(760px 500px at 48% 110%, #fef9c3 0%, transparent 60%),' +
        'linear-gradient(180deg, #fdfaf1 0%, #f8f1de 100%)',
      motion: 'rise',
      particle: 'rgba(180, 83, 9, 0.35)',
      glow: 'rgba(217, 119, 6, 0.16)',
    },
    colors: {
      accent: '#d97706',
      accentStrong: '#92400e',
      accentSoft: '#fffbeb',
      accentBorder: '#fde68a',
      accentText: '#b45309',
    },
  },
];

export const DEFAULT_THEME_ID = 'arcano';

export const findTheme = (id: string | null | undefined): AppTheme =>
  THEMES.find((t) => t.id === id) ?? THEMES[0];

/** Aplica as variáveis CSS do tema no elemento raiz. */
export function applyTheme(theme: AppTheme) {
  const root = document.documentElement;
  root.style.setProperty('--accent', theme.colors.accent);
  root.style.setProperty('--accent-strong', theme.colors.accentStrong);
  root.style.setProperty('--accent-soft', theme.colors.accentSoft);
  root.style.setProperty('--accent-border', theme.colors.accentBorder);
  root.style.setProperty('--accent-text', theme.colors.accentText);
}
