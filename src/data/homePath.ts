// A trilha da tela inicial — as unidades em círculo, no formato do Duolingo.
//
// Cada unidade é um círculo. Duas naturezas:
//
//   topics — junta um ou mais blocos de vocabulário. O círculo abre o
//            primeiro bloco ainda não concluído do grupo, e o progresso é
//            quantos blocos do grupo já fecharam.
//   cell   — abre uma célula da Grade 4V5T2S direto no dossiê, sem passar
//            pela grade inteira. É como a gramática entra na trilha.
//
// A ordem daqui é a ordem da trilha na tela.

export type PathKind = 'today' | 'topics' | 'cell' | 'grid' | 'lesson' | 'trainer';

export interface PathUnit {
  id: string;
  label: string;
  /** Linha de apoio, abaixo do nome. */
  hint: string;
  emoji: string;
  kind: PathKind;
  /** kind 'topics': os blocos que formam a unidade, na ordem de estudo. */
  topicIds?: string[];
  /** kind 'cell': a célula da Grade que o círculo abre. */
  cellId?: string;
  /** kind 'lesson': a aula, e quantas perguntas ela tem ao todo. */
  lessonId?: string;
  totalQuestions?: number;
  /** kind 'trainer': a tela e quantas etapas ela tem. */
  trainerId?: string;
  totalStages?: number;
  /** kind 'lesson' | 'trainer': a view que o círculo abre. */
  viewMode?: string;
}

export const HOME_PATH: PathUnit[] = [
  {
    id: 'hoje',
    label: 'Hoje',
    hint: 'Sua sessão do dia',
    emoji: '⭐',
    kind: 'today',
  },
  {
    id: 'aula-classificar',
    label: 'Aula 01 · Classificar',
    hint: 'A · B · B2 · C — de que tipo é cada frase',
    emoji: '🧩',
    kind: 'lesson',
    lessonId: 'classify-01',
    totalQuestions: 50,
    viewMode: 'lesson-classify',
  },
  {
    id: 'aula-did-have',
    label: 'Aula 02 · did × have',
    hint: 'Quando é passado seco e quando é perfect',
    emoji: '🧭',
    kind: 'lesson',
    lessonId: 'did-have-01',
    totalQuestions: 24,
    viewMode: 'lesson-did-have',
  },
  {
    id: 'verbos',
    label: 'Verbos',
    hint: 'Os 100 mais usados, em blocos de 25',
    emoji: '🏃',
    kind: 'topics',
    topicIds: ['verbs-01-25', 'verbs-26-50', 'verbs-51-75', 'verbs-76-100'],
  },
  {
    id: 'passado-irregulares',
    label: 'Verbos no passado',
    hint: 'Os irregulares agrupados por família de som',
    emoji: '🔁',
    kind: 'trainer',
    trainerId: 'past-trainer',
    totalStages: 9,
    viewMode: 'past-trainer',
  },
  {
    id: 'substantivos',
    label: 'Substantivos',
    hint: 'Comida, casa, trabalho, viagem, saúde, compras e clima',
    emoji: '🧱',
    kind: 'topics',
    topicIds: [
      'food-01-25',
      'home-01-25',
      'work-01-25',
      'travel-01-25',
      'health-01-25',
      'shopping-01-25',
      'weather-01-25',
    ],
  },
  {
    id: 'adjetivos',
    label: 'Adjetivos',
    hint: 'Como descrever coisas e pessoas',
    emoji: '✨',
    kind: 'topics',
    topicIds: ['adjectives-01-25', 'adjectives-26-50'],
  },
  {
    id: 'preposicoes',
    label: 'Preposições',
    hint: 'in · on · at e as que grudam no verbo',
    emoji: '🧭',
    kind: 'topics',
    topicIds: ['prepositions-01-25'],
  },
  {
    id: 'passado-did',
    label: 'Passado · did',
    hint: 'did you…? — e o verbo volta à base',
    emoji: '⏪',
    kind: 'cell',
    cellId: 'A-past',
  },
  {
    id: 'passado-have',
    label: 'Passado · have/has been',
    hint: 'have you…? — sem tempo marcado',
    emoji: '🔗',
    kind: 'cell',
    cellId: 'D1',
  },
  {
    id: 'presente',
    label: 'Presente',
    hint: 'do / does — e o -s da 3ª pessoa',
    emoji: '⏺️',
    kind: 'cell',
    cellId: 'A-present',
  },
  {
    id: 'futuro-will',
    label: 'Futuro · will',
    hint: 'will you…? — amanhã, next…',
    emoji: '⏩',
    kind: 'cell',
    cellId: 'A-future',
  },
  {
    id: 'futuro-would',
    label: 'Futuro · would',
    hint: 'would you…? — o -ria do português',
    emoji: '🌀',
    kind: 'cell',
    cellId: 'A-would',
  },
  {
    id: 'grade',
    label: 'A Grade inteira',
    hint: 'O mapa 4×5 com as 24 células e o cronograma',
    emoji: '🗺️',
    kind: 'grid',
  },
];
