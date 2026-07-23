import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_THEME_ID, applyTheme, findTheme } from '../data/themes';

interface ThemeState {
  themeId: string;
  /** Último tema claro usado — para o botão de modo noturno voltar nele. */
  lastLightId: string;
  /** Último tema escuro usado. */
  lastDarkId: string;
  setTheme: (id: string) => void;
  /** Alterna claro ⇄ escuro, lembrando o último tema de cada modo. */
  toggleMode: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      themeId: DEFAULT_THEME_ID,
      lastLightId: 'classico',
      lastDarkId: 'masmorra',
      setTheme: (id) => {
        const theme = findTheme(id);
        applyTheme(theme);
        set(
          theme.mode === 'dark'
            ? { themeId: theme.id, lastDarkId: theme.id }
            : { themeId: theme.id, lastLightId: theme.id },
        );
      },
      toggleMode: () => {
        const { themeId, lastLightId, lastDarkId } = get();
        const isDark = findTheme(themeId).mode === 'dark';
        get().setTheme(isDark ? lastLightId : lastDarkId);
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
