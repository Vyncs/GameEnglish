import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Lang } from '../i18n/translations';

// Idioma da CASCA do app (não afeta o conteúdo de estudo). Persistido para
// que a escolha do usuário sobreviva a recarregamentos.

interface LangState {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggle: () => void;
}

const applyHtmlLang = (lang: Lang) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
  }
};

export const useLangStore = create<LangState>()(
  persist(
    (set, get) => ({
      lang: 'pt',
      setLang: (lang) => {
        applyHtmlLang(lang);
        set({ lang });
      },
      toggle: () => {
        const next: Lang = get().lang === 'pt' ? 'en' : 'pt';
        applyHtmlLang(next);
        set({ lang: next });
      },
    }),
    {
      name: 'english-app-lang',
      onRehydrateStorage: () => (state) => {
        if (state) applyHtmlLang(state.lang);
      },
    },
  ),
);

// Sincroniza o atributo lang do <html> já no carregamento do módulo.
applyHtmlLang(useLangStore.getState().lang);
