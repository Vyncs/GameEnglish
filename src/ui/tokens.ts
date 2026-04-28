/**
 * Design tokens — "Caderno do aluno"
 *
 * Cores, espaçamentos e tipografia vindos do mundo físico do estudo de
 * inglês na escola brasileira: papel pautado, caneta Bic, correção
 * vermelha, highlighter, lousa, manila.
 *
 * Cada token rastreia até uma origem real. Se for adicionar algo novo,
 * pergunte: "isso existe no mundo do aluno?"
 */

// ============================================================================
// CORES — extraídas do mundo do estudo (não da paleta Tailwind)
// ============================================================================

export const ink = {
  /** Marfim do papel pautado (background da página). */
  paper: '#FAF7F2',
  /** Folha mais clara, recém-tirada do bloco (cards elevados). */
  paperBright: '#FFFFFF',
  /** Sépia leve, papel "envelhecido" (zonas menos enfáticas). */
  paperAged: '#F4EDDF',

  /** Azul royal da Bic — a tinta do aluno. Cor primária. */
  bic: '#0F3FAA',
  /** Bic ligeiramente mais escura (hover/pressed). */
  bicDark: '#0A2E80',
  /** Bic muito clara (background tingido sutil). */
  bicTint: '#E6ECFA',

  /** Vermelho da caneta de correção do professor. */
  correction: '#D52B1E',
  /** Vermelho mais escuro (hover destrutivo). */
  correctionDark: '#A21D14',
  /** Tinta vermelha tingindo papel (background de erro suave). */
  correctionTint: '#FBE8E6',

  /** Amarelo de marcador fluorescente (highlighter). */
  highlighter: '#F4E22B',
  /** Variação suave para uso em fundos (sem ofender o olho). */
  highlighterSoft: '#FFF59D',
  /** Tinta tingindo o papel embaixo (warning subtil). */
  highlighterTint: '#FFF8C5',

  /** Verde da lousa (sucesso, acerto). */
  chalkboard: '#2D5A3D',
  /** Verde mais escuro. */
  chalkboardDark: '#1F4029',
  /** Tinta verde tingindo papel (success bg suave). */
  chalkboardTint: '#E2EFE6',

  /** Grafite do lápis — cor neutra escura para texto e ícones. */
  graphite: '#2A2A28',
  /** Grafite médio (secondary text). */
  graphiteMid: '#5C5B57',
  /** Grafite claro (tertiary, metadata). */
  graphiteSoft: '#8C8A84',
  /** Grafite muito claro (placeholder, disabled). */
  graphiteFaint: '#B8B5AE',

  /** Manila / kraft — borders e separadores. */
  manila: '#C7A87A',
  /** Manila mais clara (hairline borders quase invisíveis). */
  manilaSoft: '#E6DCC4',
  /** Manila escura (emphasis borders). */
  manilaDeep: '#9A7C50',
} as const;

// ============================================================================
// FOREGROUND — texto em 4 níveis (princípio do skill)
// ============================================================================

export const text = {
  primary: ink.graphite,
  secondary: ink.graphiteMid,
  tertiary: ink.graphiteSoft,
  muted: ink.graphiteFaint,
  /** Em superfícies tingidas de azul/correção. */
  onInk: '#FFFFFF',
} as const;

// ============================================================================
// BACKGROUND — superfícies em escala de elevação (whisper-quiet shifts)
// ============================================================================

export const surface = {
  /** Page canvas (papel base). */
  page: ink.paper,
  /** Card padrão — 1 nível acima da página. */
  card: ink.paperBright,
  /** Popover, dropdown — 2 níveis acima. */
  popover: '#FFFFFF',
  /** Modal — 3 níveis acima (lift mais alto). */
  modal: '#FFFFFF',
  /** Inset (input, área que recebe conteúdo) — mais escura, não mais clara. */
  inset: ink.paperAged,
} as const;

// ============================================================================
// BORDER — progressão de intensidade
// ============================================================================

export const border = {
  /** Borda padrão — quase invisível, só dá estrutura. */
  hairline: 'rgba(154, 124, 80, 0.18)', // manila a 18%
  /** Separador suave de seção. */
  soft: 'rgba(154, 124, 80, 0.28)',
  /** Ênfase (cards selecionados, focused inputs). */
  emphasis: 'rgba(15, 63, 170, 0.4)', // bic a 40%
  /** Foco máximo (focus ring). */
  focus: ink.bic,
} as const;

// ============================================================================
// SEMANTIC — significado, não decoração
// ============================================================================

export const semantic = {
  brand: ink.bic,
  brandHover: ink.bicDark,
  success: ink.chalkboard,
  warning: ink.highlighter,
  danger: ink.correction,
  dangerHover: ink.correctionDark,
} as const;

// ============================================================================
// TIPOGRAFIA — duas vozes (UI vs voz do aluno)
// ============================================================================

export const fonts = {
  /** UI controles, navegação, body de leitura: Inter. */
  ui: '"Inter", system-ui, -apple-system, sans-serif',
  /** Frases em inglês nos cards (SIGNATURE): Caveat (cursivo de aluno). */
  hand: '"Caveat", "Patrick Hand", cursive',
  /** Números tabulares (badges, contadores). */
  mono: '"Inter", system-ui, sans-serif', // Inter já tem tabular-nums
} as const;

export const fontSize = {
  xs: '0.75rem', // 12 — caption
  sm: '0.875rem', // 14 — secondary
  base: '1rem', // 16 — body
  md: '1.125rem', // 18 — emphasis
  lg: '1.375rem', // 22 — section title
  xl: '1.75rem', // 28 — page title
  '2xl': '2.25rem', // 36 — hero
  /** Para texto em Caveat (cursiva), aumenta porque o eixo-x é menor. */
  hand: '1.5rem', // 24
  handLg: '2rem', // 32
} as const;

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

// ============================================================================
// SPACING — base 4
// ============================================================================

export const space = {
  '0': '0',
  '1': '0.25rem', // 4
  '2': '0.5rem', // 8
  '3': '0.75rem', // 12
  '4': '1rem', // 16
  '5': '1.25rem', // 20
  '6': '1.5rem', // 24
  '8': '2rem', // 32
  '10': '2.5rem', // 40
  '12': '3rem', // 48
  '16': '4rem', // 64
} as const;

// ============================================================================
// RADIUS — papel não é redondo, mas tem cantos vivos
// ============================================================================

export const radius = {
  /** Inputs, chips. */
  sm: '6px',
  /** Botões, cards de papel. */
  md: '8px',
  /** Cards grandes, popovers. */
  lg: '12px',
  /** Modais. */
  xl: '16px',
  /** Pílulas, avatars. */
  full: '9999px',
} as const;

// ============================================================================
// SHADOWS — sombras de PAPEL (offset baixo, blur curto, sem cor)
// ============================================================================

export const shadow = {
  /** Folha apoiada na mesa. */
  paper: '0 1px 2px rgba(40, 40, 38, 0.06), 0 1px 1px rgba(40, 40, 38, 0.04)',
  /** Folha levantada um dedo. */
  paperLifted:
    '0 2px 4px rgba(40, 40, 38, 0.08), 0 4px 8px rgba(40, 40, 38, 0.06)',
  /** Pilha de algumas folhas (popover). */
  stack:
    '0 4px 8px rgba(40, 40, 38, 0.08), 0 12px 24px rgba(40, 40, 38, 0.10)',
  /** Modal — papel claramente flutuando. */
  float:
    '0 8px 16px rgba(40, 40, 38, 0.10), 0 24px 48px rgba(40, 40, 38, 0.12)',
  /** Inset — reentrância (input). */
  inset: 'inset 0 1px 2px rgba(40, 40, 38, 0.06)',
} as const;

// ============================================================================
// MOTION — micro, com deceleração (sem bounce)
// ============================================================================

export const motion = {
  /** Hover/focus instantâneo. */
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  /** Mudança de estado padrão. */
  base: '220ms cubic-bezier(0.4, 0, 0.2, 1)',
  /** Cards mudando de compartimento na Leitner box. */
  card: '420ms cubic-bezier(0.2, 0.8, 0.2, 1)',
  /** Modais, painéis grandes. */
  panel: '320ms cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

// ============================================================================
// LEITNER — específico do produto (signature)
// ============================================================================

/** Os 5 compartimentos da caixa, do iniciante ao dominado. */
export const leitnerStages = [
  { level: 1, label: 'Iniciante', tint: ink.correctionTint, accent: ink.correction },
  { level: 2, label: 'Praticando', tint: ink.highlighterTint, accent: ink.highlighter },
  { level: 3, label: 'Familiar', tint: ink.bicTint, accent: ink.bic },
  { level: 4, label: 'Confiante', tint: ink.chalkboardTint, accent: ink.chalkboard },
  { level: 5, label: 'Dominado', tint: ink.paperAged, accent: ink.manilaDeep },
] as const;

export type LeitnerLevel = (typeof leitnerStages)[number]['level'];

// ============================================================================
// FOCUS RING — acessível, com a cor da marca
// ============================================================================

/** Aplique em todo elemento interativo. */
export const focusRing = `outline: none; box-shadow: 0 0 0 2px ${ink.paper}, 0 0 0 4px ${ink.bic};`;

/** Versão Tailwind-friendly (use em className). */
export const focusRingClass =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF7F2]';

// ============================================================================
// HELPERS
// ============================================================================

export type Ink = keyof typeof ink;
export type Surface = keyof typeof surface;
export type Semantic = keyof typeof semantic;
