import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_THEME_ID, applyTheme, findTheme } from '../data/themes';

interface ThemeState {
  themeId: string;
  setTheme: (id: string) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      themeId: DEFAULT_THEME_ID,
      setTheme: (id) => {
        applyTheme(findTheme(id));
        set({ themeId: id });
      },
    }),
    {
      name: 'english-app-theme',
      // Ao reidratar do localStorage, reaplica as variáveis CSS.
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(findTheme(state.themeId));
      },
    },
  ),
);

// Aplica o tema salvo já no carregamento do módulo, evitando um flash
// da cor padrão antes da reidratação.
applyTheme(findTheme(useThemeStore.getState().themeId));
