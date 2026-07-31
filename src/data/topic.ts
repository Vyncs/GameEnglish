// Modelo genérico de TÓPICO de vocabulário (verbos, adjetivos, clima, comida…).
//
// Separação de conceitos do app:
//   AULAS   = regras/gramática (ex.: Aula 01 — classificar em A/B/B2/C)
//   TÓPICOS = vocabulário em blocos, do mais fácil para o mais difícil
//
// Os campos de verbo (past/participle/irregular/rule) são OPCIONAIS: tópicos
// como "Adjetivos" ou "Clima" simplesmente não os usam, e a etapa "Formas"
// não entra em `stages` nesses casos.

export type VerbRule = 'A' | 'B' | 'B2' | 'C';

/**
 * Ilustração de cada verbo, recortada da folha "100 verbs" (public/100 verbs.png).
 * Os arquivos são gerados por `scripts/crop-verbs.py` e servidos de public/verbs/.
 * O número do arquivo é o mesmo número do verbo na folha (1–100).
 */
export const verbImg = (id: number) => {
  // hate usa o id 155 e divide a célula 55 da folha com love.
  const n = id > 100 ? id - 100 : id;
  return `/verbs/verb-${String(n).padStart(2, '0')}.png`;
};

export interface TopicItem {
  id: number;
  /** Termo em inglês (forma base, no caso de verbos). */
  base: string;
  /** Significado em português. */
  pt: string;
  example: string;
  tip: string;
  // ---- específico de verbos ----
  past?: string;
  participle?: string;
  irregular?: boolean;
  rule?: VerbRule;
}

/**
 * As duas formas que a folha original destaca com cor:
 *   vermelho = forma que anda com DID  (passado simples — I ate)
 *   azul     = forma que anda com HAVE (particípio — I have eaten)
 * Quando as duas são iguais (brought, bought, found…) a folha mostra só a vermelha.
 */
export function verbForms(item: TopicItem) {
  if (!item.past) return null;
  return {
    did: item.past,
    have: item.participle,
    same: Boolean(item.participle && item.participle === item.past),
  };
}

export type TopicStage = 'study' | 'meaning' | 'forms';

/**
 * Categorias exibidas na Home, cada uma como uma "prateleira" com scroll
 * lateral. A ordem daqui é a ordem das seções na tela.
 */
export const TOPIC_CATEGORIES: { id: string; label: string; emoji: string; desc: string }[] = [
  { id: 'verbos', label: 'Verbos', emoji: '🏃', desc: 'Os verbos mais usados, em blocos de 25' },
  { id: 'adjetivos', label: 'Adjetivos', emoji: '✨', desc: 'Como descrever coisas, pessoas e situações' },
  { id: 'tempos', label: 'Tempos verbais', emoji: '⏳', desc: 'Passado, presente e futuro na prática' },
  { id: 'outros', label: 'Outros temas', emoji: '🗂️', desc: 'Clima, comida, casa e mais' },
];

export interface Topic {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  /** Categoria (prateleira) onde o tópico aparece — ver TOPIC_CATEGORIES. */
  category: string;
  /** Dificuldade: 1 = mais fácil. Usado para ordenar os tópicos. */
  level: 1 | 2 | 3;
  /** Etapas do passo a passo. "forms" só faz sentido para verbos. */
  stages: TopicStage[];
  items: TopicItem[];
  /** Ilustração por item (opcional) — ex.: os recortes dos verbos 1–25. */
  imageFor?: (item: TopicItem) => string | undefined;
}

export const STAGE_INFO: Record<TopicStage, { label: string; desc: string; emoji: string }> = {
  study: { label: 'Estudar', desc: 'Conheça as palavras (flashcards + áudio)', emoji: '📖' },
  meaning: { label: 'Significado', desc: 'Termo em inglês → escolha o significado', emoji: '🎯' },
  forms: { label: 'Formas', desc: 'Passado e particípio dos irregulares', emoji: '🔁' },
};
