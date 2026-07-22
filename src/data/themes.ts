// Temas de acento do app (estilo RPG).
//
// A cor de ACENTO é a "cor da marca": aparece em botões principais, barras de
// progresso, destaques e na Sessão de hoje. As cores de SEÇÃO (Início ciano,
// Bricks âmbar, Pairs rosa, Readers índigo) NÃO mudam — elas identificam cada
// área do app e continuam iguais em todos os temas.

export interface AppTheme {
  id: string;
  name: string;
  emoji: string;
  description: string;
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
