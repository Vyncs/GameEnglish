import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Como o aluno responde na Sessão de Revisão:
 *   flip = vira a carta, vê a resposta e marca sozinho se acertou (padrão)
 *   type = digita a tradução, como era antes
 * O modo Jogar continua sempre na digitação, para não perder o treino de escrita.
 */
export type ReviewMode = 'flip' | 'type';

interface ReviewModeState {
  mode: ReviewMode;
  setMode: (mode: ReviewMode) => void;
}

export const useReviewModeStore = create<ReviewModeState>()(
  persist(
    (set) => ({
      mode: 'flip',
      setMode: (mode) => set({ mode }),
    }),
    { name: 'english-review-mode' },
  ),
);
