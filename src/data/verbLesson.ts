// Tipos e etapas compartilhados pelas aulas de verbos (Aula 02, 03, …).
// Cada aula fornece seus 25 verbos; as telas e jogos são genéricos.

export type VerbRule = 'A' | 'B' | 'B2' | 'C';

export interface Verb {
  id: number;
  base: string;
  past: string;
  participle?: string; // ausente para modais (can)
  pt: string;
  example: string;
  irregular: boolean;
  rule: VerbRule;
  tip: string;
}

export interface VerbLesson {
  id: string;
  title: string;
  subtitle: string;
  verbs: Verb[];
}

// Etapas do passo a passo (mesma ideia do Cram/Learn).
export const VERB_STAGES: { id: string; label: string; desc: string; emoji: string }[] = [
  { id: 'study', label: 'Estudar', desc: 'Conheça os verbos (flashcards + áudio)', emoji: '📖' },
  { id: 'meaning', label: 'Significado', desc: 'Verbo em inglês → escolha o significado', emoji: '🎯' },
  { id: 'forms', label: 'Formas', desc: 'Passado e particípio dos irregulares', emoji: '🔁' },
];
