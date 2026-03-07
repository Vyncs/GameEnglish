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

export type ViewMode = 'home' | 'cards' | 'review' | 'play' | 'bricks' | 'bricks-challenge' | 'memory' | 'karaoke' | 'readers' | 'account';

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

// Formato simples de import/export (user-friendly)
export interface ExportCard {
  pt: string;
  en: string;
  dica?: string;
  direcao?: TranslationDirection;
}

export interface ExportGroup {
  name: string;
  cards: ExportCard[];
}

export interface ExportData {
  groups: ExportGroup[];
}

// Formato legado (retrocompatibilidade com backups antigos)
export interface LegacyExportData {
  version: string;
  exportedAt: number;
  groups: Group[];
  cards: FlashCard[];
}

// Dados normalizados para processamento interno
export interface NormalizedImportData {
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
  /** O que o reconhecimento de voz ouviu para esta palavra (para correção) */
  spokenWord?: string;
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

// ==========================================
// GRADED READERS (Mario Vergara Style)
// ==========================================

// Níveis CEFR
export type ReaderLevel = 'A1' | 'A2' | 'B1' | 'B2';

// Tema de leitura (visual)
export type ReaderTheme = 'light' | 'dark' | 'sepia';

// Sub-abas
export type ReaderSubTab = 'library' | 'create' | 'plagiarism';

// Tags/categorias dos livros
export type BookTag = 'daily-life' | 'travel' | 'romance' | 'work' | 'adventure' | 'mystery' | 'fantasy' | 'science' | 'rpg-fantasy' | 'horror';

// Chunk = palavra OU frase (phrasal verb, expressão, contexto)
// Ex: "give" | "give up" | "take a shower" — cada um com sua tradução
export interface ReaderWord {
  word: string;         // texto exibido (pode ser "give up" = frase)
  translation: string;  // tradução em português (do chunk inteiro)
  isClickable: boolean;
}

// Parágrafo do livro (cada "word" pode ser uma palavra ou frase)
export interface ReaderParagraph {
  id: string;
  words: ReaderWord[];
}

// Pergunta de compreensão
export interface ComprehensionQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

// Livro
export interface GradedBook {
  id: string;
  title: string;
  author: string;
  level: ReaderLevel;
  tags: BookTag[];
  coverUrl?: string;
  totalWords: number;
  estimatedMinutes: number;
  description: string;
  paragraphs: ReaderParagraph[];
  questions?: ComprehensionQuestion[];
  progress: number;  // 0-100
  createdAt: number;
  isCustom: boolean; // criado pelo usuário ou padrão
}

// Configuração por nível
export interface LevelConfig {
  level: ReaderLevel;
  label: string;
  vocabularyRange: string;
  sentenceLength: string;
  grammarFocus: string;
  color: string;
}

// Configurações dos níveis
export const READER_LEVEL_CONFIG: Record<ReaderLevel, LevelConfig> = {
  A1: {
    level: 'A1',
    label: 'Beginner',
    vocabularyRange: '500-800 words',
    sentenceLength: 'Short sentences',
    grammarFocus: 'Present Simple, basic vocabulary',
    color: 'emerald',
  },
  A2: {
    level: 'A2',
    label: 'Elementary',
    vocabularyRange: '1000-1500 words',
    sentenceLength: 'Medium sentences',
    grammarFocus: 'Past Simple, common phrasal verbs',
    color: 'blue',
  },
  B1: {
    level: 'B1',
    label: 'Intermediate',
    vocabularyRange: '2000-2500 words',
    sentenceLength: 'Longer sentences',
    grammarFocus: 'Present Perfect, conditionals',
    color: 'amber',
  },
  B2: {
    level: 'B2',
    label: 'Upper-Intermediate',
    vocabularyRange: '3000+ words',
    sentenceLength: 'Complex sentences',
    grammarFocus: 'All tenses, passive voice, reported speech',
    color: 'purple',
  },
};

// Tags disponíveis
export const BOOK_TAGS: { tag: BookTag; label: string; emoji: string }[] = [
  { tag: 'daily-life', label: 'Daily Life', emoji: '🏠' },
  { tag: 'travel', label: 'Travel', emoji: '✈️' },
  { tag: 'romance', label: 'Romance', emoji: '💕' },
  { tag: 'work', label: 'Work', emoji: '💼' },
  { tag: 'adventure', label: 'Adventure', emoji: '🗺️' },
  { tag: 'mystery', label: 'Mystery', emoji: '🔍' },
  { tag: 'fantasy', label: 'Fantasy', emoji: '🧙' },
  { tag: 'science', label: 'Science', emoji: '🔬' },
  { tag: 'rpg-fantasy', label: 'RPG (Fantasy)', emoji: '⚔️' },
  { tag: 'horror', label: 'Terror', emoji: '👻' },
];

// Estado do Graded Readers
export interface GradedReadersState {
  level: ReaderLevel;
  theme: ReaderTheme;
  subTab: ReaderSubTab;
  selectedBook: GradedBook | null;
  isReading: boolean;
  currentParagraphIndex: number;
}
