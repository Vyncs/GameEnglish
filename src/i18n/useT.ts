import { useCallback } from 'react';
import { useLangStore } from '../store/useLangStore';
import { translate, type Lang, type TransKey } from './translations';

type Vars = Record<string, string | number>;

/**
 * Hook de tradução. `const t = useT()` e então `t('nav.home')`.
 * Re-renderiza os componentes quando o idioma muda, porque lê do useLangStore.
 */
export function useT() {
  const lang = useLangStore((s) => s.lang);
  return useCallback((key: TransKey, vars?: Vars) => translate(lang, key, vars), [lang]);
}

/** Só o código do idioma atual ('pt' | 'en'), quando o texto não é preciso. */
export function useLang(): Lang {
  return useLangStore((s) => s.lang);
}
