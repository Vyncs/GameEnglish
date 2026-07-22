import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Progresso de uma aula de verbos: quais etapas o aluno já concluiu.
export interface VerbLessonProgress {
  stagesDone: string[];
}

interface VerbLessonState {
  progress: Record<string, VerbLessonProgress>;
  markStageDone: (lessonId: string, stage: string) => void;
  resetLesson: (lessonId: string) => void;
}

export const useVerbLessonStore = create<VerbLessonState>()(
  persist(
    (set) => ({
      progress: {},
      markStageDone: (lessonId, stage) =>
        set((state) => {
          const current = state.progress[lessonId] ?? { stagesDone: [] };
          if (current.stagesDone.includes(stage)) return state;
          return {
            progress: {
              ...state.progress,
              [lessonId]: { stagesDone: [...current.stagesDone, stage] },
            },
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
