import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Progresso de uma aula de verbos: etapas concluídas + recordes dos jogos.
export interface VerbLessonProgress {
  stagesDone: string[];
  bestMatchMs?: number; // melhor tempo (ms) no jogo de associação
  bestBlitz?: number;   // melhor pontuação no blitz
}

interface VerbLessonState {
  progress: Record<string, VerbLessonProgress>;
  markStageDone: (lessonId: string, stage: string) => void;
  saveMatchTime: (lessonId: string, ms: number) => void;
  saveBlitzScore: (lessonId: string, score: number) => void;
  resetLesson: (lessonId: string) => void;
}

const empty = (): VerbLessonProgress => ({ stagesDone: [] });

export const useVerbLessonStore = create<VerbLessonState>()(
  persist(
    (set) => ({
      progress: {},
      markStageDone: (lessonId, stage) =>
        set((state) => {
          const current = state.progress[lessonId] ?? empty();
          if (current.stagesDone.includes(stage)) return state;
          return {
            progress: {
              ...state.progress,
              [lessonId]: { ...current, stagesDone: [...current.stagesDone, stage] },
            },
          };
        }),
      saveMatchTime: (lessonId, ms) =>
        set((state) => {
          const current = state.progress[lessonId] ?? empty();
          if (current.bestMatchMs !== undefined && current.bestMatchMs <= ms) return state;
          return {
            progress: { ...state.progress, [lessonId]: { ...current, bestMatchMs: ms } },
          };
        }),
      saveBlitzScore: (lessonId, score) =>
        set((state) => {
          const current = state.progress[lessonId] ?? empty();
          if (current.bestBlitz !== undefined && current.bestBlitz >= score) return state;
          return {
            progress: { ...state.progress, [lessonId]: { ...current, bestBlitz: score } },
          };
        }),
      resetLesson: (lessonId) =>
        set((state) => {
          const next = { ...state.progress };
          delete next[lessonId];
          return { progress: next };
        }),
    }),
    { name: 'english-verb-lessons-progress' },
  ),
);
