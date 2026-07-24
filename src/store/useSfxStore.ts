import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { setSfxEnabled } from '../utils/sfx';

interface SfxState {
  enabled: boolean;
  toggle: () => void;
}

export const useSfxStore = create<SfxState>()(
  persist(
    (set, get) => ({
      enabled: true,
      toggle: () => {
        const next = !get().enabled;
        setSfxEnabled(next);
        set({ enabled: next });
      },
    }),
    {
      name: 'english-app-sfx',
      onRehydrateStorage: () => (state) => {
        if (state) setSfxEnabled(state.enabled);
      },
    },
  ),
);

// Sincroniza já no carregamento do módulo.
setSfxEnabled(useSfxStore.getState().enabled);
