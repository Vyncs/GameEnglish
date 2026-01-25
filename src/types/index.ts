// Tipos principais da aplicação

// Níveis do sistema Leitner e seus intervalos em dias
export const LEITNER_INTERVALS: Record<number, number> = {
  1: 0,   // mesmo dia
  2: 1,   // 1 dia
  3: 3,   // 3 dias
  4: 7,   // 7 dias
  5: 15,  // 15 dias
};

// Direção da tradução do card
export type TranslationDirection = 'pt-en' | 'en-pt';

export interface FlashCard {
  id: string;
  portuguesePhrase: string;
  englishPhrase: string;
  groupId: string;
  createdAt: number;
  // Direção da tradução
  direction: TranslationDirection;  // 'pt-en' = PT→EN, 'en-pt' = EN→PT
  // Spaced Repetition (Leitner)
  level: number;           // 1-5
  lastReviewed: number | null;  // timestamp da última revisão
  nextReview: number;      // timestamp da próxima revisão
  errorCount: number;      // contador de erros
  // Imagem associada
  imageUrl?: string;       // URL da imagem (opcional)
}

export interface Group {
  id: string;
  name: string;
  createdAt: number;
}

export type BrickType = 
  | 'infinitive'
  | 'imperative'
  | 'do_does'
  | 'are_you'
  | 'have_been'
  | 'can'
  | 'must_should'
  | 'is_there_any'
  | 'did_you'
  | 'have_you';

export interface BrickPhrase {
  type: BrickType;
  portuguese: string;
  english: string;
}

export interface BrickResult {
  phrase: BrickPhrase;
  userAnswer: string;
  isCorrect: boolean;
}

export interface BricksChallenge {
  verb: string;
  phrases: BrickPhrase[];
  currentIndex: number;
  isComplete: boolean;
  results: BrickResult[];
}

export const BRICK_TYPES: { type: BrickType; label: string }[] = [
  { type: 'infinitive', label: 'Infinitive' },
  { type: 'imperative', label: 'Imperative' },
  { type: 'do_does', label: 'Do / Does' },
  { type: 'are_you', label: 'Are you' },
  { type: 'have_been', label: 'Have been' },
  { type: 'can', label: 'Can' },
  { type: 'must_should', label: 'Must / Should' },
  { type: 'is_there_any', label: 'Is there any + (body/thing/way/where)' },
  { type: 'did_you', label: 'Did you' },
  { type: 'have_you', label: 'Have you' },
];

export type ViewMode = 'home' | 'cards' | 'review' | 'play' | 'bricks' | 'bricks-challenge';

// Modo de jogo (direção das perguntas)
export type PlayModeDirection = 'pt-en' | 'en-pt' | 'mixed';

// Tipos para exportação/importação
export interface ExportData {
  version: string;
  exportedAt: number;
  groups: Group[];
  cards: FlashCard[];
}
