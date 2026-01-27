import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  FlashCard, 
  Group, 
  BricksChallenge, 
  ViewMode, 
  ExportData, 
  TranslationDirection,
  MemoryDeck,
  MemoryDifficulty,
  MemoryGameCard,
  MemoryGameState,
  MemoryPair,
  Song,
  LineResult
} from '../types';
import { LEITNER_INTERVALS, MEMORY_DIFFICULTY_CONFIG } from '../types';
import { generateBricksPhrases } from '../utils/bricksGenerator';

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
  importProgress: (data: ExportData, mergeMode: boolean) => { success: boolean; message: string };
  validateImportData: (data: unknown) => { valid: boolean; message: string };
  
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
  
  // Ações - UI
  setViewMode: (mode: ViewMode) => void;
  toggleSidebar: () => void;
  goToHome: () => void;
  startReviewSession: (groupId?: string) => void;
  startPlayMode: (groupId?: string) => void;
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
      viewMode: 'home',
      sidebarOpen: true,
      
      // Implementação - Grupos
      addGroup: (name) => {
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
      
      renameGroup: (id, newName) => {
        set((state) => ({
          groups: state.groups.map((g) =>
            g.id === id ? { ...g, name: newName } : g
          ),
        }));
      },
      
      deleteGroup: (id) => {
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
      
      // Implementação - Cards
      addCard: (portuguesePhrase, englishPhrase, groupId, direction = 'pt-en', imageUrl, tips) => {
        const now = Date.now();
        const newCard: FlashCard = {
          id: generateId(),
          portuguesePhrase,
          englishPhrase,
          groupId,
          createdAt: now,
          // Direção da tradução
          direction,
          // Spaced Repetition - inicia no nível 1
          level: 1,
          lastReviewed: null,
          nextReview: calculateNextReview(1), // Revisão imediata (mesmo dia)
          errorCount: 0,
          // Imagem
          imageUrl: imageUrl || undefined,
          // Dicas
          tips: tips || undefined,
        };
        set((state) => ({
          cards: [...state.cards, newCard],
        }));
      },
      
      updateCard: (id, portuguesePhrase, englishPhrase, direction, imageUrl, tips) => {
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
      
      deleteCard: (id) => {
        set((state) => ({
          cards: state.cards.filter((c) => c.id !== id),
        }));
      },
      
      getCardsByGroup: (groupId) => {
        return get().cards.filter((c) => c.groupId === groupId);
      },
      
      // Implementação - Spaced Repetition
      reviewCard: (cardId, isCorrect) => {
        set((state) => ({
          cards: state.cards.map((card) => {
            if (card.id !== cardId) return card;
            
            const now = Date.now();
            let newLevel = card.level;
            let newErrorCount = card.errorCount;
            
            if (isCorrect) {
              // Acertou: sobe 1 nível (máximo 5)
              newLevel = Math.min(card.level + 1, 5);
            } else {
              // Errou: volta para nível 1
              newLevel = 1;
              newErrorCount = card.errorCount + 1;
            }
            
            return {
              ...card,
              level: newLevel,
              lastReviewed: now,
              nextReview: calculateNextReview(newLevel),
              errorCount: newErrorCount,
            };
          }),
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
          version: '1.0',
          exportedAt: Date.now(),
          groups,
          cards,
        };
      },
      
      validateImportData: (data: unknown) => {
        if (!data || typeof data !== 'object') {
          return { valid: false, message: 'Arquivo inválido: dados não encontrados' };
        }
        
        const obj = data as Record<string, unknown>;
        
        if (!obj.version || typeof obj.version !== 'string') {
          return { valid: false, message: 'Arquivo inválido: versão não encontrada' };
        }
        
        if (!Array.isArray(obj.groups)) {
          return { valid: false, message: 'Arquivo inválido: grupos não encontrados' };
        }
        
        if (!Array.isArray(obj.cards)) {
          return { valid: false, message: 'Arquivo inválido: cards não encontrados' };
        }
        
        // Validar estrutura dos grupos
        for (const group of obj.groups) {
          if (!group.id || !group.name) {
            return { valid: false, message: 'Arquivo inválido: grupo com estrutura incorreta' };
          }
        }
        
        // Validar estrutura dos cards
        for (const card of obj.cards) {
          if (!card.id || !card.portuguesePhrase || !card.englishPhrase || !card.groupId) {
            return { valid: false, message: 'Arquivo inválido: card com estrutura incorreta' };
          }
        }
        
        return { valid: true, message: 'Arquivo válido' };
      },
      
      importProgress: (data: ExportData, mergeMode: boolean) => {
        const validation = get().validateImportData(data);
        if (!validation.valid) {
          return { success: false, message: validation.message };
        }
        
        try {
          if (mergeMode) {
            // Modo mesclar: adiciona dados sem substituir existentes
            set((state) => {
              const existingGroupIds = new Set(state.groups.map((g) => g.id));
              const existingCardIds = new Set(state.cards.map((c) => c.id));
              
              const newGroups = data.groups.filter((g) => !existingGroupIds.has(g.id));
              const newCards = data.cards
                .filter((c) => !existingCardIds.has(c.id))
                .map((card) => ({
                  ...card,
                  // Garantir campos de spaced repetition
                  level: card.level || 1,
                  lastReviewed: card.lastReviewed || null,
                  nextReview: card.nextReview || calculateNextReview(1),
                  errorCount: card.errorCount || 0,
                  // Garantir direção padrão
                  direction: card.direction || 'pt-en',
                  // Preservar campos opcionais
                  imageUrl: card.imageUrl || undefined,
                  tips: card.tips || undefined,
                }));
              
              return {
                groups: [...state.groups, ...newGroups],
                cards: [...state.cards, ...newCards],
              };
            });
            
            return { 
              success: true, 
              message: `Importação concluída! Dados mesclados com sucesso.` 
            };
          } else {
            // Modo substituir: substitui todos os dados
            const processedCards = data.cards.map((card) => ({
              ...card,
              level: card.level || 1,
              lastReviewed: card.lastReviewed || null,
              nextReview: card.nextReview || calculateNextReview(1),
              errorCount: card.errorCount || 0,
              direction: card.direction || 'pt-en',
              // Preservar campos opcionais
              imageUrl: card.imageUrl || undefined,
              tips: card.tips || undefined,
            }));
            
            set({
              groups: data.groups,
              cards: processedCards,
              selectedGroupId: null,
              viewMode: 'home',
            });
            
            return { 
              success: true, 
              message: `Importação concluída! ${data.groups.length} grupos e ${data.cards.length} cards importados.` 
            };
          }
        } catch (error) {
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
        const normalizedAnswer = answer.trim().toLowerCase();
        const normalizedCorrect = currentPhrase.english.trim().toLowerCase();
        const isCorrect = normalizedAnswer === normalizedCorrect;
        
        const newResult = {
          phrase: currentPhrase,
          userAnswer: answer,
          isCorrect,
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
    }),
    {
      name: 'english-flashcards-storage',
      partialize: (state) => ({
        groups: state.groups,
        cards: state.cards,
        selectedGroupId: state.selectedGroupId,
        memoryDecks: state.memoryDecks,
        hiddenDefaultDeckIds: state.hiddenDefaultDeckIds,
      }),
    }
  )
);
