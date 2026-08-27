import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Checklist da rotina diária da Grade 4V5T2S (25–30 min, página 1 do cronograma).
// Guarda o dia junto dos passos: quando a data muda, a lista volta zerada.

export const EMPTY_STEPS: boolean[] = [false, false, false, false];

// Data LOCAL (não UTC): no fuso do Brasil, toISOString viraria o dia às 21h.
export const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

interface GridRoutineState {
  date: string;
  steps: boolean[];
  toggleStep: (i: number) => void;
}

export const useGridRoutineStore = create<GridRoutineState>()(
  persist(
    (set) => ({
      date: todayKey(),
      steps: EMPTY_STEPS,
      toggleStep: (i) =>
        set((state) => {
          const base = state.date === todayKey() ? state.steps : EMPTY_STEPS;
          return { date: todayKey(), steps: base.map((v, idx) => (idx === i ? !v : v)) };
        }),
    }),
    { name: 'english-grid-routine' },
  ),
);
