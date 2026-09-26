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
  /** Frase para decorar (etapa "sentences"). Sem ela o item é pulado nessa etapa. */
  sentence?: TopicSentence;
  /** As duas frases da etapa "Formas" — did na 1ª pessoa, have na 3ª. */
  formSentences?: FormSentences;
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

/** Classe gramatical das palavras novas destacadas numa frase. */
export type WordKind = 'adj' | 'prep' | 'subst' | 'adv' | 'verbo' | 'pron' | 'conj' | 'expr';

export const WORD_KIND_LABEL: Record<WordKind, string> = {
  adj: 'adjetivo',
  prep: 'preposição',
  subst: 'substantivo',
  adv: 'advérbio',
  verbo: 'verbo',
  pron: 'pronome',
  conj: 'conjunção',
  expr: 'expressão',
};

/** Palavra nova que aparece na frase e ainda não foi estudada. */
export interface NewWord {
  word: string;
  pt: string;
  kind: WordKind;
}

/**
 * Frase curta para decorar o item — a etapa "sentences" mostra esta frase,
 * não a palavra solta. O aluno ouve, lê o sentido e repete falando.
 */
export interface TopicSentence {
  en: string;
  pt: string;
  /** Palavras da frase que valem uma nota à parte (adjetivo, preposição…). */
  newWords?: NewWord[];
}

/**
 * As duas frases da etapa "Formas": uma com did (1ª pessoa) e outra com
 * have (3ª pessoa) — onde o particípio mais aparece e onde o -s do has
 * costuma escapar.
 */
export interface FormSentences {
  did: { en: string; pt: string };
  have: { en: string; pt: string };
}

/** Casa as frases das formas com os itens, pelo id. */
export const withFormSentences = (
  items: TopicItem[],
  map: Record<number, FormSentences>,
): TopicItem[] => items.map((it) => (map[it.id] ? { ...it, formSentences: map[it.id] } : it));

/** Casa as frases da etapa "Frases" com os itens do tópico, pelo id. */
export const withSentences = (
  items: TopicItem[],
  map: Record<number, TopicSentence>,
): TopicItem[] => items.map((it) => (map[it.id] ? { ...it, sentence: map[it.id] } : it));

export type TopicStage = 'memory' | 'sentences' | 'study' | 'meaning' | 'forms';

/**
 * Categorias exibidas na Home, cada uma como uma "prateleira" com scroll
 * lateral. A ordem daqui é a ordem das seções na tela.
 */
export const TOPIC_CATEGORIES: { id: string; label: string; emoji: string; desc: string }[] = [
  { id: 'verbos', label: 'Verbos', emoji: '🏃', desc: 'Os verbos mais usados, em blocos de 25' },
  { id: 'adjetivos', label: 'Adjetivos', emoji: '✨', desc: 'Como descrever coisas, pessoas e situações' },
  { id: 'tempos', label: 'Tempos verbais', emoji: '⏳', desc: 'Passado, presente e futuro na prática' },
  { id: 'cotidiano', label: 'Dia a dia', emoji: '🧭', desc: 'Comida, casa, trabalho, viagem, saúde e compras' },
  { id: 'conversacao', label: 'Conversação', emoji: '💬', desc: 'As palavras que ligam as ideias e soam naturais' },
  { id: 'gramatica', label: 'Gramática', emoji: '🧭', desc: 'Preposições e as peças que montam a frase' },
  { id: 'outros', label: 'Outros temas', emoji: '🗂️', desc: 'Clima e temas avulsos' },
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
  memory: { label: 'Memória', desc: 'Ache os pares e fixe o vocabulário do bloco', emoji: '🧠' },
  sentences: { label: 'Frases', desc: 'Ouça, entenda e repita falando — uma frase por palavra', emoji: '🗣️' },
  study: { label: 'Estudar', desc: 'Conheça as palavras (flashcards + áudio)', emoji: '📖' },
  meaning: { label: 'Significado', desc: 'Termo em inglês → escolha o significado', emoji: '🎯' },
  forms: { label: 'Formas', desc: 'Passado e particípio dos irregulares', emoji: '🔁' },
};
