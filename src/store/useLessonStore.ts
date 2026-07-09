import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ClassifyCategory } from '../data/lessonClassify';

// Progresso de uma aula: mapa questionId -> resposta escolhida pelo aluno.
export interface LessonProgress {
  answers: Record<number, ClassifyCategory>;
}

interface LessonState {
  progress: Record<string, LessonProgress>;
  answerQuestion: (lessonId: string, questionId: number, choice: ClassifyCategory) => void;
  resetLesson: (lessonId: string) => void;
}

const EMPTY: LessonProgress = { answers: {} };

export const useLessonStore = create<LessonState>()(
  persist(
    (set) => ({
      progress: {},
      answerQuestion: (lessonId, questionId, choice) =>
        set((state) => {
          const current = state.progress[lessonId] ?? EMPTY;
          // Não sobrescreve uma resposta já dada (a primeira tentativa é a que vale).
          if (current.answers[questionId]) return state;
          return {
            progress: {
              ...state.progress,
              [lessonId]: {
                ...current,
                answers: { ...current.answers, [questionId]: choice },
              },
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
    { name: 'english-lessons-progress' },
  ),
);

// Seletor auxiliar: progresso seguro (nunca undefined) de uma aula.
export function selectLessonProgress(state: LessonState, lessonId: string): LessonProgress {
  return state.progress[lessonId] ?? EMPTY;
}
