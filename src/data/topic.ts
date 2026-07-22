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

export type TopicStage = 'study' | 'meaning' | 'forms';

export interface Topic {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
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
