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
  // Dicas (opcional)
  tips?: string;           // Dicas para ajudar na resposta
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

export type ViewMode = 'home' | 'cards' | 'review' | 'play' | 'bricks' | 'bricks-challenge' | 'memory' | 'karaoke';

// Modo de jogo (direção das perguntas)
export type PlayModeDirection = 'pt-en' | 'en-pt' | 'mixed';

// ==========================================
// MEMORY GAME (Pairs Challenge)
// ==========================================

// Dificuldade do jogo
export type MemoryDifficulty = 'easy' | 'medium' | 'hard';

// Configuração de dificuldade
export const MEMORY_DIFFICULTY_CONFIG: Record<MemoryDifficulty, { pairs: number; label: string; emoji: string }> = {
  easy: { pairs: 6, label: 'Easy', emoji: '🟢' },
  medium: { pairs: 10, label: 'Medium', emoji: '🟡' },
  hard: { pairs: 15, label: 'Hard', emoji: '🔴' },
};

// Deck de memória
export interface MemoryDeck {
  id: string;
  title: string;
  category: string;
  emoji: string;
  description: string;
  pairs: MemoryPair[];
}

// Par (gera 2 cartas: imagem + palavra)
export interface MemoryPair {
  pairId: string;
  word: string;
  imageUrl: string;
}

// Carta no jogo (gerada a partir do par)
export interface MemoryGameCard {
  id: string;
  pairId: string;
  type: 'image' | 'word';
  content: string;  // URL da imagem ou palavra
  isFlipped: boolean;
  isMatched: boolean;
}

// Resultado de uma tentativa (para revisão)
export interface MemoryAttempt {
  pair: MemoryPair;
  wasCorrect: boolean;
}

// Estado do jogo
export interface MemoryGameState {
  phase: 'deck-selection' | 'difficulty-selection' | 'playing' | 'results';
  selectedDeck: MemoryDeck | null;
  difficulty: MemoryDifficulty;
  cards: MemoryGameCard[];
  selectedCardIds: string[];
  attempts: number;
  matches: number;
  mistakes: MemoryPair[];
  startTime: number | null;
  endTime: number | null;
}

// Tipos para exportação/importação
export interface ExportData {
  version: string;
  exportedAt: number;
  groups: Group[];
  cards: FlashCard[];
}

// ==========================================
// KARAOKE MODE
// ==========================================

// Dificuldade da música
export type SongDifficulty = 'easy' | 'medium' | 'hard';

// Linha da letra com timing
export interface LyricLine {
  id: string;
  startTime: number;  // em segundos
  endTime: number;    // em segundos
  textEN: string;     // texto em inglês
  textPT: string;     // tradução em português
}

// Música completa
export interface Song {
  id: string;
  title: string;
  artist: string;
  difficulty: SongDifficulty;
  coverUrl?: string;  // capa do álbum (opcional)
  audioUrl: string;   // URL do áudio
  lyrics: LyricLine[];
}

// Resultado de pronúncia de uma palavra
export interface WordResult {
  word: string;
  status: 'correct' | 'approximate' | 'missing';
}

// Resultado de um trecho
export interface LineResult {
  lineId: string;
  expectedText: string;
  spokenText: string;
  words: WordResult[];
  accuracy: number;  // 0-100
}

// Estado do Karaoke
export interface KaraokeState {
  phase: 'song-selection' | 'playing' | 'results';
  selectedSong: Song | null;
  currentLineIndex: number;
  isPlaying: boolean;
  isListening: boolean;
  lineResults: LineResult[];
  overallAccuracy: number;
}

// Configurações de dificuldade do Karaoke
export const KARAOKE_DIFFICULTY_CONFIG: Record<SongDifficulty, { label: string; emoji: string; description: string }> = {
  easy: { label: 'Easy', emoji: '🟢', description: 'Slow songs, clear pronunciation' },
  medium: { label: 'Medium', emoji: '🟡', description: 'Moderate tempo' },
  hard: { label: 'Hard', emoji: '🔴', description: 'Fast rhythm, complex words' },
};
