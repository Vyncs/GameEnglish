import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  FlashCard, 
  Group, 
  BricksChallenge, 
  ViewMode, 
  ExportData, 
  NormalizedImportData,
  TranslationDirection,
  MemoryDeck,
  MemoryDifficulty,
  MemoryGameCard,
  MemoryGameState,
  MemoryPair,
  Song,
  LineResult,
  ReaderLevel,
  ReaderTheme,
  ReaderSubTab,
  GradedBook
} from '../types';
import { LEITNER_INTERVALS, MEMORY_DIFFICULTY_CONFIG } from '../types';
import { generateBricksPhrases } from '../utils/bricksGenerator';
import { fuzzyCompare } from '../utils/fuzzyMatch';
import { api } from '../api/client';

/** Mesmo critério do PlayMode e FlashCard para respostas aproximadas */
const FUZZY_THRESHOLD = 85;

// Função para gerar IDs únicos
const generateId = () => Math.random().toString(36).substring(2, 15);

// Função para calcular a próxima data de revisão baseada no nível
const calculateNextReview = (level: number): number => {
  const days = LEITNER_INTERVALS[level] || 0;
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Início do dia
  return now.getTime() + days * 24 * 60 * 60 * 1000;
};

// Função para verificar se um card deve ser revisado hoje
const isDueForReview = (card: FlashCard): boolean => {
  const today = new Date();
  today.setHours(23, 59, 59, 999); // Fim do dia
  return card.nextReview <= today.getTime();
};

interface AppState {
  // Grupos
  groups: Group[];
  selectedGroupId: string | null;
  
  // Flash Cards
  cards: FlashCard[];
  
  // Bricks Challenge
  bricksChallenge: BricksChallenge | null;
  
  // Memory Game
  memoryGame: MemoryGameState;
  memoryDecks: MemoryDeck[];
  hiddenDefaultDeckIds: string[];
  
  // Karaoke
  karaokePhase: 'song-selection' | 'playing' | 'results';
  karaokeSong: Song | null;
  karaokeLineIndex: number;
  karaokeResults: LineResult[];
  
  // Graded Readers
  readerLevel: ReaderLevel;
  readerTheme: ReaderTheme;
  readerSubTab: ReaderSubTab;
  selectedBook: GradedBook | null;
  isReading: boolean;
  currentParagraphIndex: number;
  customBooks: GradedBook[];
  
  // UI
  viewMode: ViewMode;
  sidebarOpen: boolean;
  
  // Ações - Grupos
  addGroup: (name: string) => void;
  renameGroup: (id: string, newName: string) => void;
  deleteGroup: (id: string) => void;
  selectGroup: (id: string | null) => void;
  
  // Ações - Cards
  addCard: (portuguesePhrase: string, englishPhrase: string, groupId: string, direction?: TranslationDirection, imageUrl?: string, tips?: string) => void;
  updateCard: (id: string, portuguesePhrase: string, englishPhrase: string, direction?: TranslationDirection, imageUrl?: string, tips?: string) => void;
  deleteCard: (id: string) => void;
  getCardsByGroup: (groupId: string) => FlashCard[];
  
  // Ações - Spaced Repetition
  reviewCard: (cardId: string, isCorrect: boolean) => void;
  getCardsForReview: (groupId?: string) => FlashCard[];
  getCardsForReviewCount: (groupId: string) => number;
  getTotalCardsForReview: () => number;
  getGroupsWithReviewCount: () => { group: Group; reviewCount: number; totalCards: number }[];
  
  // Ações - Import/Export
  exportProgress: () => ExportData;
  importProgress: (data: NormalizedImportData, mergeMode: boolean) => { success: boolean; message: string };
  validateImportData: (data: unknown) => { valid: boolean; message: string };
  normalizeImportData: (data: unknown) => NormalizedImportData;
  
  // Ações - Bricks Challenge
  startBricksChallenge: (verb: string) => void;
  submitBrickAnswer: (answer: string) => void;
  nextBrickPhrase: () => void;
  resetBricksChallenge: () => void;
  
  // Ações - Memory Game
  startMemoryGame: () => void;
  selectMemoryDeck: (deck: MemoryDeck) => void;
  selectMemoryDifficulty: (difficulty: MemoryDifficulty) => void;
  startMemoryPlaying: () => void;
  flipMemoryCard: (cardId: string) => void;
  resetMemoryGame: () => void;
  addMemoryDeck: (deck: MemoryDeck) => void;
  updateMemoryDeck: (deckId: string, updates: Partial<Omit<MemoryDeck, 'id'>>) => void;
  deleteMemoryDeck: (deckId: string) => void;
  hideDefaultDeck: (deckId: string) => void;
  restoreDefaultDecks: () => void;
  exportMemoryDecks: () => { version: string; decks: MemoryDeck[] };
  importMemoryDecks: (data: unknown) => { success: boolean; message: string };
  updateMemoryPair: (deckId: string, pairId: string, updates: Partial<MemoryPair>) => void;
  deleteMemoryPair: (deckId: string, pairId: string) => void;
  addMemoryPair: (deckId: string, pair: MemoryPair) => void;
  
  // Ações - Karaoke
  startKaraoke: () => void;
  selectKaraokeSong: (song: Song) => void;
  nextKaraokeLine: () => void;
  addKaraokeResult: (result: LineResult) => void;
  finishKaraoke: () => void;
  resetKaraoke: () => void;
  
  // Ações - Graded Readers
  startReaders: () => void;
  setReaderLevel: (level: ReaderLevel) => void;
  setReaderTheme: (theme: ReaderTheme) => void;
  setReaderSubTab: (tab: ReaderSubTab) => void;
  openBook: (book: GradedBook) => void;
  closeBook: () => void;
  updateBookProgress: (bookId: string, progress: number) => void;
  nextParagraph: () => void;
  prevParagraph: () => void;
  addCustomBook: (book: GradedBook) => void;
  deleteCustomBook: (bookId: string) => void;
  
  // Ações - UI
  setViewMode: (mode: ViewMode) => void;
  toggleSidebar: () => void;
  goToHome: () => void;
  startReviewSession: (groupId?: string) => void;
  startPlayMode: (groupId?: string) => void;

  // Sincronização com backend (quando logado)
  hydrateFromSync: (data: import('../api/client').SyncData) => void;
}

// Estado inicial do Memory Game
const initialMemoryGameState: MemoryGameState = {
  phase: 'deck-selection',
  selectedDeck: null,
  difficulty: 'easy',
  cards: [],
  selectedCardIds: [],
  attempts: 0,
  matches: 0,
  mistakes: [],
  startTime: null,
  endTime: null,
};

// Função para criar cartas do jogo a partir dos pares
const createMemoryCards = (pairs: MemoryPair[], difficulty: MemoryDifficulty): MemoryGameCard[] => {
  // Embaralhar os pares primeiro para ter aleatoriedade a cada jogo
  const shuffledPairs = [...pairs].sort(() => Math.random() - 0.5);
  // Selecionar a quantidade de pares baseada na dificuldade
  const pairsToUse = shuffledPairs.slice(0, MEMORY_DIFFICULTY_CONFIG[difficulty].pairs);
  const cards: MemoryGameCard[] = [];
  
  pairsToUse.forEach((pair) => {
    // Carta com imagem
    cards.push({
      id: `${pair.pairId}-image`,
      pairId: pair.pairId,
      type: 'image',
      content: pair.imageUrl,
      isFlipped: false,
      isMatched: false,
    });
    // Carta com palavra
    cards.push({
      id: `${pair.pairId}-word`,
      pairId: pair.pairId,
      type: 'word',
      content: pair.word,
      isFlipped: false,
      isMatched: false,
    });
  });
  
  // Embaralhar as cartas
  return cards.sort(() => Math.random() - 0.5);
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      groups: [],
      selectedGroupId: null,
      cards: [],
      bricksChallenge: null,
      memoryGame: initialMemoryGameState,
      memoryDecks: [],
      hiddenDefaultDeckIds: [],
      karaokePhase: 'song-selection',
      karaokeSong: null,
      karaokeLineIndex: 0,
      karaokeResults: [],
      readerLevel: 'A1',
      readerTheme: 'light',
      readerSubTab: 'library',
      selectedBook: null,
      isReading: false,
      currentParagraphIndex: 0,
      customBooks: [],
      viewMode: 'home',
      sidebarOpen: true,
      
      // Implementação - Grupos (com sync para backend quando logado)
      addGroup: async (name) => {
        if (api.getToken()) {
          try {
            const g = await api.postGroup(name);
            set((state) => ({
              groups: [...state.groups, g as Group],
              selectedGroupId: g.id,
              viewMode: 'cards',
            }));
            return;
          } catch (_) { /* fallback local */ }
        }
        const newGroup: Group = {
          id: generateId(),
          name,
          createdAt: Date.now(),
        };
        set((state) => ({
          groups: [...state.groups, newGroup],
          selectedGroupId: newGroup.id,
          viewMode: 'cards',
        }));
      },
      
      renameGroup: async (id, newName) => {
        if (api.getToken()) {
          try {
            await api.patchGroup(id, newName);
          } catch (_) {}
        }
        set((state) => ({
          groups: state.groups.map((g) =>
            g.id === id ? { ...g, name: newName } : g
          ),
        }));
      },
      
      deleteGroup: async (id) => {
        if (api.getToken()) {
          try {
            await api.deleteGroup(id);
          } catch (_) {}
        }
        set((state) => ({
          groups: state.groups.filter((g) => g.id !== id),
          cards: state.cards.filter((c) => c.groupId !== id),
          selectedGroupId: state.selectedGroupId === id ? null : state.selectedGroupId,
          viewMode: state.selectedGroupId === id ? 'home' : state.viewMode,
        }));
      },
      
      selectGroup: (id) => {
        set({ selectedGroupId: id, viewMode: 'cards' });
      },
      
      // Implementação - Cards (com sync para backend quando logado)
      addCard: async (portuguesePhrase, englishPhrase, groupId, direction = 'pt-en', imageUrl, tips) => {
        if (api.getToken()) {
          try {
            const c = await api.postCard({
              groupId,
              portuguesePhrase,
              englishPhrase,
              direction,
              imageUrl,
              tips,
            });
            const newCard: FlashCard = {
              ...c,
              direction: c.direction as TranslationDirection,
              lastReviewed: c.lastReviewed ?? null,
              nextReview: c.nextReview,
            };
            set((state) => ({ cards: [...state.cards, newCard] }));
            return;
          } catch (_) {}
        }
        const now = Date.now();
        const newCard: FlashCard = {
          id: generateId(),
          portuguesePhrase,
          englishPhrase,
          groupId,
          createdAt: now,
          direction,
          level: 1,
          lastReviewed: null,
          nextReview: calculateNextReview(1),
          errorCount: 0,
          imageUrl: imageUrl || undefined,
          tips: tips || undefined,
        };
        set((state) => ({ cards: [...state.cards, newCard] }));
      },
      
      updateCard: async (id, portuguesePhrase, englishPhrase, direction, imageUrl, tips) => {
        if (api.getToken()) {
          try {
            await api.patchCard(id, {
              portuguesePhrase,
              englishPhrase,
              direction: direction || undefined,
              imageUrl,
              tips,
            });
          } catch (_) {}
        }
        set((state) => ({
          cards: state.cards.map((c) =>
            c.id === id
              ? {
                  ...c,
                  portuguesePhrase,
                  englishPhrase,
                  direction: direction || c.direction || 'pt-en',
                  imageUrl: imageUrl || undefined,
                  tips: tips || undefined,
                }
              : c
          ),
        }));
      },
      
      deleteCard: async (id) => {
        if (api.getToken()) {
          try {
            await api.deleteCard(id);
          } catch (_) {}
        }
        set((state) => ({
          cards: state.cards.filter((c) => c.id !== id),
        }));
      },
      
      getCardsByGroup: (groupId) => {
        return get().cards.filter((c) => c.groupId === groupId);
      },
      
      // Implementação - Spaced Repetition (com sync quando logado)
      reviewCard: async (cardId, isCorrect) => {
        const card = get().cards.find((c) => c.id === cardId);
        if (!card) return;
        const now = Date.now();
        const newLevel = isCorrect ? Math.min(card.level + 1, 5) : 1;
        const newErrorCount = isCorrect ? card.errorCount : card.errorCount + 1;
        const nextReview = calculateNextReview(newLevel);
        if (api.getToken()) {
          try {
            await api.patchCard(cardId, {
              level: newLevel,
              lastReviewed: now,
              nextReview,
              errorCount: newErrorCount,
            });
          } catch (_) {}
        }
        set((state) => ({
          cards: state.cards.map((c) =>
            c.id !== cardId
              ? c
              : {
                  ...c,
                  level: newLevel,
                  lastReviewed: now,
                  nextReview,
                  errorCount: newErrorCount,
                }
          ),
        }));
      },
      
      getCardsForReview: (groupId?) => {
        const cards = get().cards;
        const filtered = groupId 
          ? cards.filter((c) => c.groupId === groupId)
          : cards;
        return filtered.filter(isDueForReview);
      },
      
      getCardsForReviewCount: (groupId) => {
        return get().cards
          .filter((c) => c.groupId === groupId)
          .filter(isDueForReview).length;
      },
      
      getTotalCardsForReview: () => {
        return get().cards.filter(isDueForReview).length;
      },
      
      getGroupsWithReviewCount: () => {
        const { groups, cards } = get();
        return groups.map((group) => {
          const groupCards = cards.filter((c) => c.groupId === group.id);
          const reviewCount = groupCards.filter(isDueForReview).length;
          return {
            group,
            reviewCount,
            totalCards: groupCards.length,
          };
        });
      },
      
      // Implementação - Import/Export
      exportProgress: () => {
        const { groups, cards } = get();
        return {
          groups: groups.map((g) => ({
            name: g.name,
            cards: cards
              .filter((c) => c.groupId === g.id)
              .map((c) => ({
                pt: c.portuguesePhrase,
                en: c.englishPhrase,
                ...(c.tips ? { dica: c.tips } : {}),
                ...(c.direction !== 'pt-en' ? { direcao: c.direction as 'pt-en' | 'en-pt' } : {}),
              })),
          })),
        };
      },

      validateImportData: (data: unknown) => {
        if (!data || typeof data !== 'object') {
          return { valid: false, message: 'Arquivo inválido: dados não encontrados' };
        }

        const obj = data as Record<string, unknown>;

        // Formato simples: { groups: [{ name, cards: [{ pt, en }] }] }
        if (Array.isArray(obj.groups) && !Array.isArray(obj.cards)) {
          for (const group of obj.groups as Record<string, unknown>[]) {
            if (!group.name || typeof group.name !== 'string') {
              return { valid: false, message: 'Arquivo inválido: grupo sem campo "name"' };
            }
            if (!Array.isArray(group.cards)) {
              return { valid: false, message: `Arquivo inválido: grupo "${group.name}" sem campo "cards"` };
            }
            for (const card of group.cards as Record<string, unknown>[]) {
              if (!card.pt || !card.en) {
                return { valid: false, message: `Arquivo inválido: card sem campos "pt" e "en" no grupo "${group.name}"` };
              }
            }
          }
          const totalCards = (obj.groups as { cards: unknown[] }[]).reduce((sum, g) => sum + g.cards.length, 0);
          return { valid: true, message: `Arquivo válido — ${(obj.groups as unknown[]).length} grupo(s), ${totalCards} card(s)` };
        }

        // Formato legado: { version, groups: [{ id, name }], cards: [{ id, portuguesePhrase, englishPhrase, groupId }] }
        if (Array.isArray(obj.groups) && Array.isArray(obj.cards)) {
          for (const group of obj.groups as Record<string, unknown>[]) {
            if (!group.id || !group.name) {
              return { valid: false, message: 'Arquivo inválido: grupo com estrutura incorreta' };
            }
          }
          for (const card of obj.cards as Record<string, unknown>[]) {
            if (!card.id || !card.portuguesePhrase || !card.englishPhrase || !card.groupId) {
              return { valid: false, message: 'Arquivo inválido: card com estrutura incorreta' };
            }
          }
          return { valid: true, message: `Arquivo válido — ${(obj.groups as unknown[]).length} grupo(s), ${(obj.cards as unknown[]).length} card(s)` };
        }

        return { valid: false, message: 'Arquivo inválido: estrutura não reconhecida' };
      },

      normalizeImportData: (data: unknown) => {
        const obj = data as Record<string, unknown>;

        // Formato simples → normalizar
        if (Array.isArray(obj.groups) && !Array.isArray(obj.cards)) {
          const groups: Group[] = [];
          const cards: FlashCard[] = [];

          for (const g of obj.groups as { name: string; cards: { pt: string; en: string; dica?: string; direcao?: string }[] }[]) {
            const groupId = generateId();
            groups.push({ id: groupId, name: g.name, createdAt: Date.now() });

            for (const c of g.cards) {
              cards.push({
                id: generateId(),
                groupId,
                portuguesePhrase: c.pt,
                englishPhrase: c.en,
                direction: (c.direcao as TranslationDirection) || 'pt-en',
                tips: c.dica,
                level: 1,
                lastReviewed: null,
                nextReview: calculateNextReview(1),
                errorCount: 0,
                createdAt: Date.now(),
              });
            }
          }

          return { groups, cards };
        }

        // Formato legado → já está normalizado
        const legacy = obj as { groups: Group[]; cards: FlashCard[] };
        return {
          groups: legacy.groups,
          cards: legacy.cards.map((card) => ({
            ...card,
            level: card.level || 1,
            lastReviewed: card.lastReviewed || null,
            nextReview: card.nextReview || calculateNextReview(1),
            errorCount: card.errorCount || 0,
            direction: card.direction || 'pt-en',
            imageUrl: card.imageUrl || undefined,
            tips: card.tips || undefined,
          })),
        };
      },

      importProgress: (data: NormalizedImportData, mergeMode: boolean) => {
        try {
          if (mergeMode) {
            set((state) => {
              const existingGroupNames = new Set(state.groups.map((g) => g.name.toLowerCase()));
              const newGroups = data.groups.filter((g) => !existingGroupNames.has(g.name.toLowerCase()));
              const newGroupIds = new Set(newGroups.map((g) => g.id));
              const newCards = data.cards.filter((c) => newGroupIds.has(c.groupId));

              return {
                groups: [...state.groups, ...newGroups],
                cards: [...state.cards, ...newCards],
              };
            });

            return {
              success: true,
              message: 'Importação concluída! Dados mesclados com sucesso.',
            };
          } else {
            set({
              groups: data.groups,
              cards: data.cards,
              selectedGroupId: null,
              viewMode: 'home',
            });

            return {
              success: true,
              message: `Importação concluída! ${data.groups.length} grupo(s) e ${data.cards.length} card(s) importados.`,
            };
          }
        } catch {
          return { success: false, message: 'Erro ao importar dados' };
        }
      },
      
      // Implementação - Bricks Challenge
      startBricksChallenge: (verb) => {
        const phrases = generateBricksPhrases(verb);
        set({
          bricksChallenge: {
            verb,
            phrases,
            currentIndex: 0,
            isComplete: false,
            results: [],
          },
          viewMode: 'bricks-challenge',
        });
      },
      
      submitBrickAnswer: (answer) => {
        const challenge = get().bricksChallenge;
        if (!challenge) return;
        
        const currentPhrase = challenge.phrases[challenge.currentIndex];
        const result = fuzzyCompare(answer, currentPhrase.english, FUZZY_THRESHOLD);
        const isCorrect = result.isAcceptable;
        const isExactMatch = result.isExactMatch;
        
        const newResult = {
          phrase: currentPhrase,
          userAnswer: answer,
          isCorrect,
          isExactMatch,
        };
        
        set((state) => ({
          bricksChallenge: state.bricksChallenge ? {
            ...state.bricksChallenge,
            results: [...state.bricksChallenge.results, newResult],
          } : null,
        }));
      },
      
      nextBrickPhrase: () => {
        const challenge = get().bricksChallenge;
        if (!challenge) return;
        
        const nextIndex = challenge.currentIndex + 1;
        const isComplete = nextIndex >= challenge.phrases.length;
        
        set((state) => ({
          bricksChallenge: state.bricksChallenge ? {
            ...state.bricksChallenge,
            currentIndex: isComplete ? challenge.currentIndex : nextIndex,
            isComplete,
          } : null,
        }));
      },
      
      resetBricksChallenge: () => {
        set({
          bricksChallenge: null,
          viewMode: 'bricks',
        });
      },
      
      // Implementação - Memory Game
      startMemoryGame: () => {
        set({
          memoryGame: initialMemoryGameState,
          viewMode: 'memory',
        });
      },
      
      selectMemoryDeck: (deck) => {
        set((state) => ({
          memoryGame: {
            ...state.memoryGame,
            selectedDeck: deck,
            phase: 'difficulty-selection',
          },
        }));
      },
      
      selectMemoryDifficulty: (difficulty) => {
        set((state) => ({
          memoryGame: {
            ...state.memoryGame,
            difficulty,
          },
        }));
      },
      
      startMemoryPlaying: () => {
        const { memoryGame } = get();
        if (!memoryGame.selectedDeck) return;
        
        const cards = createMemoryCards(memoryGame.selectedDeck.pairs, memoryGame.difficulty);
        
        set((state) => ({
          memoryGame: {
            ...state.memoryGame,
            phase: 'playing',
            cards,
            selectedCardIds: [],
            attempts: 0,
            matches: 0,
            mistakes: [],
            startTime: Date.now(),
            endTime: null,
          },
        }));
      },
      
      flipMemoryCard: (cardId) => {
        const { memoryGame } = get();
        
        // Não permitir mais de 2 cartas selecionadas
        if (memoryGame.selectedCardIds.length >= 2) return;
        
        // Não permitir clicar na mesma carta ou em carta já combinada
        const card = memoryGame.cards.find((c) => c.id === cardId);
        if (!card || card.isFlipped || card.isMatched) return;
        
        // Virar a carta
        const newSelectedIds = [...memoryGame.selectedCardIds, cardId];
        const newCards = memoryGame.cards.map((c) =>
          c.id === cardId ? { ...c, isFlipped: true } : c
        );
        
        set((state) => ({
          memoryGame: {
            ...state.memoryGame,
            cards: newCards,
            selectedCardIds: newSelectedIds,
          },
        }));
        
        // Se 2 cartas foram selecionadas, verificar match
        if (newSelectedIds.length === 2) {
          const [firstId, secondId] = newSelectedIds;
          const firstCard = newCards.find((c) => c.id === firstId)!;
          const secondCard = newCards.find((c) => c.id === secondId)!;
          
          const isMatch = firstCard.pairId === secondCard.pairId;
          
          setTimeout(() => {
            set((state) => {
              const updatedCards = state.memoryGame.cards.map((c) => {
                if (c.id === firstId || c.id === secondId) {
                  return isMatch
                    ? { ...c, isMatched: true }
                    : { ...c, isFlipped: false };
                }
                return c;
              });
              
              const newMatches = isMatch ? state.memoryGame.matches + 1 : state.memoryGame.matches;
              const totalPairs = state.memoryGame.cards.length / 2;
              const isComplete = newMatches === totalPairs;
              
              // Registrar erro se não foi match
              let newMistakes = state.memoryGame.mistakes;
              if (!isMatch && state.memoryGame.selectedDeck) {
                const mistakePair = state.memoryGame.selectedDeck.pairs.find(
                  (p) => p.pairId === firstCard.pairId
                );
                if (mistakePair && !newMistakes.some((m) => m.pairId === mistakePair.pairId)) {
                  newMistakes = [...newMistakes, mistakePair];
                }
              }
              
              return {
                memoryGame: {
                  ...state.memoryGame,
                  cards: updatedCards,
                  selectedCardIds: [],
                  attempts: state.memoryGame.attempts + 1,
                  matches: newMatches,
                  mistakes: newMistakes,
                  phase: isComplete ? 'results' : 'playing',
                  endTime: isComplete ? Date.now() : null,
                },
              };
            });
          }, 800); // Delay para mostrar as cartas antes de virar
        }
      },
      
      resetMemoryGame: () => {
        set({
          memoryGame: initialMemoryGameState,
        });
      },
      
      addMemoryDeck: (deck) => {
        set((state) => ({
          memoryDecks: [...state.memoryDecks, deck],
        }));
      },
      
      updateMemoryDeck: (deckId, updates) => {
        set((state) => ({
          memoryDecks: state.memoryDecks.map((deck) =>
            deck.id === deckId ? { ...deck, ...updates } : deck
          ),
        }));
      },
      
      deleteMemoryDeck: (deckId) => {
        set((state) => ({
          memoryDecks: state.memoryDecks.filter((deck) => deck.id !== deckId),
        }));
      },
      
      hideDefaultDeck: (deckId) => {
        set((state) => ({
          hiddenDefaultDeckIds: [...state.hiddenDefaultDeckIds, deckId],
        }));
      },
      
      restoreDefaultDecks: () => {
        set({ hiddenDefaultDeckIds: [] });
      },
      
      exportMemoryDecks: () => {
        const { memoryDecks } = get();
        return {
          version: '1.0',
          decks: memoryDecks,
        };
      },
      
      importMemoryDecks: (data) => {
        try {
          const parsed = data as { version?: string; decks?: MemoryDeck[] };
          
          if (!parsed.version) {
            return { success: false, message: 'Arquivo inválido: versão não encontrada' };
          }
          
          if (!Array.isArray(parsed.decks)) {
            return { success: false, message: 'Arquivo inválido: decks não encontrados' };
          }
          
          // Validar estrutura dos decks
          for (const deck of parsed.decks) {
            if (!deck.id || !deck.title || !Array.isArray(deck.pairs)) {
              return { success: false, message: 'Arquivo inválido: estrutura de deck incorreta' };
            }
            for (const pair of deck.pairs) {
              if (!pair.pairId || !pair.word || !pair.imageUrl) {
                return { success: false, message: 'Arquivo inválido: estrutura de par incorreta' };
              }
            }
          }
          
          // Adicionar decks (mesclando com existentes)
          set((state) => {
            const existingIds = new Set(state.memoryDecks.map((d) => d.id));
            const newDecks = parsed.decks!.filter((d) => !existingIds.has(d.id));
            return {
              memoryDecks: [...state.memoryDecks, ...newDecks],
            };
          });
          
          return { 
            success: true, 
            message: `${parsed.decks.length} deck(s) importado(s) com sucesso!` 
          };
        } catch {
          return { success: false, message: 'Erro ao processar arquivo' };
        }
      },
      
      updateMemoryPair: (deckId, pairId, updates) => {
        set((state) => ({
          memoryDecks: state.memoryDecks.map((deck) =>
            deck.id === deckId
              ? {
                  ...deck,
                  pairs: deck.pairs.map((pair) =>
                    pair.pairId === pairId ? { ...pair, ...updates } : pair
                  ),
                }
              : deck
          ),
        }));
      },
      
      deleteMemoryPair: (deckId, pairId) => {
        set((state) => ({
          memoryDecks: state.memoryDecks.map((deck) =>
            deck.id === deckId
              ? { ...deck, pairs: deck.pairs.filter((p) => p.pairId !== pairId) }
              : deck
          ),
        }));
      },
      
      addMemoryPair: (deckId, pair) => {
        set((state) => ({
          memoryDecks: state.memoryDecks.map((deck) =>
            deck.id === deckId
              ? { ...deck, pairs: [...deck.pairs, pair] }
              : deck
          ),
        }));
      },
      
      // Implementação - Karaoke
      startKaraoke: () => {
        set({
          karaokePhase: 'song-selection',
          karaokeSong: null,
          karaokeLineIndex: 0,
          karaokeResults: [],
          viewMode: 'karaoke',
        });
      },
      
      selectKaraokeSong: (song) => {
        set({
          karaokeSong: song,
          karaokePhase: 'playing',
          karaokeLineIndex: 0,
          karaokeResults: [],
        });
      },
      
      nextKaraokeLine: () => {
        const { karaokeSong, karaokeLineIndex } = get();
        if (!karaokeSong) return;
        
        const nextIndex = karaokeLineIndex + 1;
        if (nextIndex >= karaokeSong.lyrics.length) {
          set({ karaokePhase: 'results' });
        } else {
          set({ karaokeLineIndex: nextIndex });
        }
      },
      
      addKaraokeResult: (result) => {
        set((state) => ({
          karaokeResults: [...state.karaokeResults, result],
        }));
      },
      
      finishKaraoke: () => {
        set({ karaokePhase: 'results' });
      },
      
      resetKaraoke: () => {
        set({
          karaokePhase: 'song-selection',
          karaokeSong: null,
          karaokeLineIndex: 0,
          karaokeResults: [],
        });
      },
      
      // Implementação - Graded Readers
      startReaders: () => {
        set({
          viewMode: 'readers',
          selectedBook: null,
          isReading: false,
          currentParagraphIndex: 0,
        });
      },
      
      setReaderLevel: (level) => {
        set({ readerLevel: level });
      },
      
      setReaderTheme: (theme) => {
        set({ readerTheme: theme });
      },
      
      setReaderSubTab: (tab) => {
        set({ readerSubTab: tab });
      },
      
      openBook: (book) => {
        set({
          selectedBook: book,
          isReading: true,
          currentParagraphIndex: 0,
        });
      },
      
      closeBook: () => {
        set({
          selectedBook: null,
          isReading: false,
          currentParagraphIndex: 0,
        });
      },
      
      updateBookProgress: (bookId, progress) => {
        set((state) => ({
          customBooks: state.customBooks.map((book) =>
            book.id === bookId ? { ...book, progress } : book
          ),
        }));
      },
      
      nextParagraph: () => {
        const { selectedBook, currentParagraphIndex } = get();
        if (!selectedBook) return;
        
        const nextIndex = currentParagraphIndex + 1;
        if (nextIndex < selectedBook.paragraphs.length) {
          set({ currentParagraphIndex: nextIndex });
        }
      },
      
      prevParagraph: () => {
        const { currentParagraphIndex } = get();
        if (currentParagraphIndex > 0) {
          set({ currentParagraphIndex: currentParagraphIndex - 1 });
        }
      },
      
      addCustomBook: (book) => {
        set((state) => ({
          customBooks: [...state.customBooks, book],
        }));
      },
      
      deleteCustomBook: (bookId) => {
        set((state) => ({
          customBooks: state.customBooks.filter((book) => book.id !== bookId),
        }));
      },
      
      // Implementação - UI
      setViewMode: (mode) => {
        set({ viewMode: mode });
      },
      
      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },
      
      goToHome: () => {
        set({ viewMode: 'home', selectedGroupId: null });
      },
      
      startReviewSession: (groupId?) => {
        set({ 
          viewMode: 'review',
          selectedGroupId: groupId || null,
        });
      },
      
      startPlayMode: (groupId?) => {
        set({ 
          viewMode: 'play',
          selectedGroupId: groupId || null,
        });
      },

      hydrateFromSync: (data) => {
        set({
          groups: data.groups as Group[],
          cards: data.cards as FlashCard[],
          selectedGroupId: data.selectedGroupId,
          memoryDecks: data.memoryDecks as MemoryDeck[],
          hiddenDefaultDeckIds: data.hiddenDefaultDeckIds,
          customBooks: data.customBooks as GradedBook[],
          readerTheme: (data.readerTheme as ReaderTheme) || 'light',
        });
      },
    }),
    {
      name: 'english-flashcards-storage',
      partialize: (state) => ({
        groups: state.groups,
        cards: state.cards,
        selectedGroupId: state.selectedGroupId,
        memoryDecks: state.memoryDecks,
        hiddenDefaultDeckIds: state.hiddenDefaultDeckIds,
        customBooks: state.customBooks,
        readerTheme: state.readerTheme,
      }),
    }
  )
);
