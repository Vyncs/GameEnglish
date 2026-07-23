// Temas do app (estilo RPG), com modo claro e escuro.
//
// Cada tema define TRÊS coisas:
//   1. scene    — o wallpaper animado (gradientes + partículas)
//   2. colors   — a cor de acento (botões, progresso, destaques)
//   3. surfaces — cards, textos e bordas (é o que permite o modo escuro)
//
// As cores de SEÇÃO (Início ciano, Bricks âmbar, Pairs rosa, Readers índigo)
// e as semânticas (acerto verde, erro vermelho) NÃO mudam com o tema.

export type ThemeMode = 'light' | 'dark';

export interface ThemeScene {
  background: string;
  motion: 'rise' | 'fall';
  particle: string;
  glow: string;
  /**
   * Imagem de wallpaper (opcional), servida de /themes/.
   * Fica ATRÁS dos gradientes, que funcionam como vinheta/escurecimento
   * para o texto continuar legível.
   */
  image?: string;
}

/** Superfícies e textos — trocá-las é o que faz o modo escuro funcionar. */
export interface ThemeSurfaces {
  /** Fundo dos cards. */
  surface: string;
  /** Fundo de blocos internos / insets. */
  surface2: string;
  /** Bordas. */
  border: string;
  /** Texto principal (títulos). */
  text1: string;
  /** Texto secundário (corpo). */
  text2: string;
  /** Texto terciário (legendas). */
  text3: string;
  /** Texto apagado (placeholders). */
  text4: string;
}

export interface AppTheme {
  id: string;
  name: string;
  emoji: string;
  description: string;
  mode: ThemeMode;
  scene: ThemeScene;
  colors: {
    accent: string;
    accentStrong: string;
    accentSoft: string;
    accentBorder: string;
    accentText: string;
  };
  surfaces: ThemeSurfaces;
}

/** Superfícies claras — o visual "caderno" original. */
const LIGHT_SURFACES: ThemeSurfaces = {
  surface: 'rgba(255, 255, 255, 0.88)',
  surface2: 'rgba(248, 250, 252, 0.9)',
  border: 'rgba(226, 232, 240, 0.9)',
  text1: '#0f172a',
  text2: '#334155',
  text3: '#64748b',
  text4: '#94a3b8',
};

/** Superfícies escuras — vidro fosco sobre o cenário. */
const DARK_SURFACES: ThemeSurfaces = {
  surface: 'rgba(15, 23, 42, 0.62)',
  surface2: 'rgba(15, 23, 42, 0.42)',
  border: 'rgba(148, 163, 184, 0.20)',
  text1: '#f1f5f9',
  text2: '#cbd5e1',
  text3: '#94a3b8',
  text4: '#64748b',
};

export const THEMES: AppTheme[] = [
  {
    id: 'classico',
    name: 'Clássico',
    emoji: '📓',
    description: 'Claro e limpo — o visual de caderno',
    mode: 'light',
    scene: {
      background:
        'radial-gradient(1100px 620px at 12% -12%, #ede9fe 0%, transparent 62%),' +
        'radial-gradient(900px 520px at 96% -4%, #e0e7ff 0%, transparent 58%),' +
        'linear-gradient(180deg, #fbfaff 0%, #f4f1fe 100%)',
      motion: 'rise',
      particle: 'rgba(139, 92, 246, 0.45)',
      glow: 'rgba(139, 92, 246, 0.16)',
    },
    colors: {
      accent: '#8b5cf6',
      accentStrong: '#4f46e5',
      accentSoft: '#f5f3ff',
      accentBorder: '#ddd6fe',
      accentText: '#6d28d9',
    },
    surfaces: LIGHT_SURFACES,
  },
  {
    id: 'arcano',
    name: 'Arcano',
    emoji: '🔮',
    description: 'Noite mística e fagulhas de magia',
    mode: 'dark',
    scene: {
      background:
        'radial-gradient(1100px 620px at 15% -10%, rgba(139, 92, 246, 0.28) 0%, transparent 62%),' +
        'radial-gradient(900px 520px at 92% 4%, rgba(79, 70, 229, 0.22) 0%, transparent 58%),' +
        'radial-gradient(760px 520px at 50% 108%, rgba(168, 85, 247, 0.18) 0%, transparent 62%),' +
        'linear-gradient(180deg, #0e0b1a 0%, #080611 100%)',
      motion: 'rise',
      particle: 'rgba(196, 181, 253, 0.9)',
      glow: 'rgba(139, 92, 246, 0.30)',
    },
    colors: {
      accent: '#a78bfa',
      accentStrong: '#6d28d9',
      accentSoft: 'rgba(139, 92, 246, 0.16)',
      accentBorder: 'rgba(167, 139, 250, 0.38)',
      accentText: '#c4b5fd',
    },
    surfaces: DARK_SURFACES,
  },
  {
    id: 'floresta',
    name: 'Floresta Élfica',
    emoji: '🌿',
    description: 'Mata noturna com vaga-lumes',
    mode: 'dark',
    scene: {
      background:
        'radial-gradient(1200px 700px at 50% 0%, rgba(16, 185, 129, 0.14) 0%, transparent 60%),' +
        'linear-gradient(180deg, rgba(5, 14, 11, 0.68) 0%, rgba(4, 10, 8, 0.90) 100%)',
      image: '/themes/floresta.jpg',
      motion: 'rise',
      particle: 'rgba(190, 242, 100, 0.95)',
      glow: 'rgba(16, 185, 129, 0.28)',
    },
    colors: {
      accent: '#34d399',
      accentStrong: '#047857',
      accentSoft: 'rgba(16, 185, 129, 0.16)',
      accentBorder: 'rgba(52, 211, 153, 0.38)',
      accentText: '#6ee7b7',
    },
    surfaces: DARK_SURFACES,
  },
  {
    id: 'gelo',
    name: 'Reino de Gelo',
    emoji: '❄️',
    description: 'Noite glacial e nevasca',
    mode: 'dark',
    scene: {
      background:
        'radial-gradient(1200px 700px at 50% 0%, rgba(56, 189, 248, 0.14) 0%, transparent 60%),' +
        'linear-gradient(180deg, rgba(6, 15, 28, 0.55) 0%, rgba(4, 10, 20, 0.88) 100%)',
      image: '/themes/gelo.jpg',
      motion: 'fall',
      particle: 'rgba(255, 255, 255, 0.95)',
      glow: 'rgba(56, 189, 248, 0.30)',
    },
    colors: {
      accent: '#38bdf8',
      accentStrong: '#1d4ed8',
      accentSoft: 'rgba(56, 189, 248, 0.16)',
      accentBorder: 'rgba(56, 189, 248, 0.38)',
      accentText: '#7dd3fc',
    },
    surfaces: DARK_SURFACES,
  },
  {
    id: 'masmorra',
    name: 'Masmorra',
    emoji: '🔥',
    description: 'Pedra, tocha e brasa',
    mode: 'dark',
    scene: {
      background:
        'radial-gradient(1200px 700px at 50% 0%, rgba(249, 115, 22, 0.16) 0%, transparent 60%),' +
        'linear-gradient(180deg, rgba(14, 8, 6, 0.52) 0%, rgba(10, 6, 4, 0.86) 100%)',
      image: '/themes/masmorra.jpg',
      motion: 'rise',
      particle: 'rgba(253, 186, 116, 0.95)',
      glow: 'rgba(249, 115, 22, 0.30)',
    },
    colors: {
      accent: '#fb923c',
      accentStrong: '#b91c1c',
      accentSoft: 'rgba(249, 115, 22, 0.16)',
      accentBorder: 'rgba(251, 146, 60, 0.38)',
      accentText: '#fdba74',
    },
    surfaces: DARK_SURFACES,
  },
  {
    id: 'pergaminho',
    name: 'Pergaminho',
    emoji: '📜',
    description: 'Ouro velho dos grimórios (claro)',
    mode: 'light',
    scene: {
      background:
        'radial-gradient(1000px 600px at 16% -10%, #fef3c7 0%, transparent 60%),' +
        'radial-gradient(880px 520px at 98% 6%, #fde68a 0%, transparent 52%),' +
        'linear-gradient(180deg, #fdfaf1 0%, #f4e9d0 100%)',
      motion: 'rise',
      particle: 'rgba(180, 83, 9, 0.4)',
      glow: 'rgba(217, 119, 6, 0.18)',
    },
    colors: {
      accent: '#d97706',
      accentStrong: '#92400e',
      accentSoft: '#fffbeb',
      accentBorder: '#fde68a',
      accentText: '#b45309',
    },
    surfaces: {
      ...LIGHT_SURFACES,
      surface: 'rgba(255, 253, 246, 0.9)',
      surface2: 'rgba(253, 246, 227, 0.9)',
      border: 'rgba(217, 180, 120, 0.35)',
    },
  },
];

export const DEFAULT_THEME_ID = 'classico';

export const findTheme = (id: string | null | undefined): AppTheme =>
  THEMES.find((t) => t.id === id) ?? THEMES[0];

/** Aplica as variáveis CSS do tema no elemento raiz. */
export function applyTheme(theme: AppTheme) {
  const root = document.documentElement;
  const { colors: c, surfaces: s } = theme;

  root.style.setProperty('--accent', c.accent);
  root.style.setProperty('--accent-strong', c.accentStrong);
  root.style.setProperty('--accent-soft', c.accentSoft);
  root.style.setProperty('--accent-border', c.accentBorder);
  root.style.setProperty('--accent-text', c.accentText);

  root.style.setProperty('--surface', s.surface);
  root.style.setProperty('--surface-2', s.surface2);
  root.style.setProperty('--surface-border', s.border);
  root.style.setProperty('--text-1', s.text1);
  root.style.setProperty('--text-2', s.text2);
  root.style.setProperty('--text-3', s.text3);
  root.style.setProperty('--text-4', s.text4);

  // Cenário aplicado no <body> (e não num elemento com z-index negativo, que
  // era pintado atrás do fundo do body e não aparecia).
  const layers = theme.scene.image
    ? `${theme.scene.background}, url("${theme.scene.image}")`
    : theme.scene.background;
  root.style.setProperty('--scene-bg', layers);
  root.style.setProperty('--scene-base', theme.mode === 'dark' ? '#07060a' : '#faf7f2');

  // Permite ajustes finos em CSS (ex.: barra de rolagem, contraste no escuro).
  root.dataset.mode = theme.mode;
}
