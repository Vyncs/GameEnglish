import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FlashCard, Group, BricksChallenge, ViewMode, ExportData, TranslationDirection } from '../types';
import { LEITNER_INTERVALS } from '../types';
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
  
  // UI
  viewMode: ViewMode;
  sidebarOpen: boolean;
  
  // Ações - Grupos
  addGroup: (name: string) => void;
  renameGroup: (id: string, newName: string) => void;
  deleteGroup: (id: string) => void;
  selectGroup: (id: string | null) => void;
  
  // Ações - Cards
  addCard: (portuguesePhrase: string, englishPhrase: string, groupId: string, direction?: TranslationDirection, imageUrl?: string) => void;
  updateCard: (id: string, portuguesePhrase: string, englishPhrase: string, direction?: TranslationDirection, imageUrl?: string) => void;
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
  
  // Ações - UI
  setViewMode: (mode: ViewMode) => void;
  toggleSidebar: () => void;
  goToHome: () => void;
  startReviewSession: (groupId?: string) => void;
  startPlayMode: (groupId?: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      groups: [],
      selectedGroupId: null,
      cards: [],
      bricksChallenge: null,
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
      addCard: (portuguesePhrase, englishPhrase, groupId, direction = 'pt-en', imageUrl) => {
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
        };
        set((state) => ({
          cards: [...state.cards, newCard],
        }));
      },
      
      updateCard: (id, portuguesePhrase, englishPhrase, direction, imageUrl) => {
        set((state) => ({
          cards: state.cards.map((c) =>
            c.id === id 
              ? { 
                  ...c, 
                  portuguesePhrase, 
                  englishPhrase,
                  direction: direction || c.direction || 'pt-en',
                  imageUrl: imageUrl || undefined,
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
      }),
    }
  )
);
