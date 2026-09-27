import type { TopicSentence } from './topic';

// Frases faladas do bloco "Corpo e saude".
//
// O aluno ouve a frase, lê o sentido em português e repete falando. Quando o
// `example` que o item já trazia servia, ele foi reaproveitado: a frase lida na
// etapa anterior é a mesma que ele repete, o que reforça em vez de apresentar
// material novo.

export const SENTENCES_HEALTH: Record<number, TopicSentence> = {
  1: {
    en: 'My head hurts this morning.',
    pt: 'Minha cabeça está doendo hoje de manhã.',
    newWords: [
      { word: 'morning', pt: 'manhã', kind: 'subst' },
    ],
  },
  2: {
    en: 'Wash your face before breakfast.',
    pt: 'Lave o rosto antes do café da manhã.',
    newWords: [
      { word: 'Wash', pt: 'lavar', kind: 'verbo' },
      { word: 'breakfast', pt: 'café da manhã', kind: 'subst' },
    ],
  },
  3: {
    en: 'I have something in my eye.',
    pt: 'Tem alguma coisa no meu olho.',
    newWords: [
      { word: 'something', pt: 'alguma coisa', kind: 'pron' },
    ],
  },
  4: {
    en: 'My ear hurt a lot yesterday.',
    pt: 'Meu ouvido doeu muito ontem.',
    newWords: [
      { word: 'yesterday', pt: 'ontem', kind: 'adv' },
      { word: 'a lot', pt: 'muito', kind: 'expr' },
    ],
  },
  5: {
    en: 'Open your mouth, please.',
    pt: 'Abra a boca, por favor.',
    newWords: [
      { word: 'Open', pt: 'abrir', kind: 'verbo' },
      { word: 'please', pt: 'por favor', kind: 'adv' },
    ],
  },
  6: {
    en: 'I broke a tooth eating candy.',
    pt: 'Quebrei um dente comendo doce.',
    newWords: [
      { word: 'candy', pt: 'doce, bala', kind: 'subst' },
    ],
  },
  7: {
    en: 'Her hair is long and curly.',
    pt: 'O cabelo dela é comprido e cacheado.',
    newWords: [
      { word: 'long', pt: 'comprido', kind: 'adj' },
      { word: 'curly', pt: 'cacheado', kind: 'adj' },
    ],
  },
  8: {
    en: 'Can you give me your hand?',
    pt: 'Você pode me dar a mão?',
    newWords: [
      { word: 'give', pt: 'dar', kind: 'verbo' },
    ],
  },
  9: {
    en: 'I broke my arm last year.',
    pt: 'Quebrei o braço no ano passado.',
    newWords: [
      { word: 'last', pt: 'passado, último', kind: 'adj' },
    ],
  },
  10: {
    en: 'My left leg is really tired.',
    pt: 'Minha perna esquerda está bem cansada.',
    newWords: [
      { word: 'left', pt: 'esquerda', kind: 'adj' },
      { word: 'tired', pt: 'cansado', kind: 'adj' },
    ],
  },
  11: {
    en: 'These new shoes hurt my foot.',
    pt: 'Esses sapatos novos machucam meu pé.',
    newWords: [
      { word: 'shoes', pt: 'sapatos', kind: 'subst' },
      { word: 'new', pt: 'novo', kind: 'adj' },
    ],
  },
  12: {
    en: 'My back hurts at the office.',
    pt: 'Minhas costas doem no escritório.',
    newWords: [
      { word: 'office', pt: 'escritório', kind: 'subst' },
    ],
  },
  13: {
    en: 'I have a stomach ache again.',
    pt: 'Estou com dor de barriga de novo.',
    newWords: [
      { word: 'ache', pt: 'dor', kind: 'subst' },
      { word: 'again', pt: 'de novo', kind: 'adv' },
    ],
  },
  14: {
    en: 'My heart is beating very fast.',
    pt: 'Meu coração está batendo muito rápido.',
    newWords: [
      { word: 'beating', pt: 'batendo', kind: 'verbo' },
      { word: 'fast', pt: 'rápido', kind: 'adv' },
    ],
  },
  15: {
    en: "I'm sick today, so I'll stay home.",
    pt: 'Estou doente hoje, então vou ficar em casa.',
    newWords: [
      { word: 'stay', pt: 'ficar', kind: 'verbo' },
      { word: 'home', pt: 'em casa', kind: 'adv' },
    ],
  },
  16: {
    en: 'I feel pain in my knee.',
    pt: 'Sinto dor no meu joelho.',
    newWords: [
      { word: 'feel', pt: 'sentir', kind: 'verbo' },
      { word: 'knee', pt: 'joelho', kind: 'subst' },
    ],
  },
  17: {
    en: 'My legs hurt after running.',
    pt: 'Minhas pernas doem depois de correr.',
    newWords: [
      { word: 'after', pt: 'depois de', kind: 'prep' },
      { word: 'running', pt: 'correr, correndo', kind: 'verbo' },
    ],
  },
  18: {
    en: 'The baby has a fever tonight.',
    pt: 'O bebê está com febre hoje à noite.',
    newWords: [
      { word: 'baby', pt: 'bebê', kind: 'subst' },
      { word: 'tonight', pt: 'hoje à noite', kind: 'adv' },
    ],
  },
  19: {
    en: 'I have a bad cough today.',
    pt: 'Estou com uma tosse forte hoje.',
    newWords: [
      { word: 'bad', pt: 'forte, ruim', kind: 'adj' },
    ],
  },
  20: {
    en: 'I caught a cold at the beach.',
    pt: 'Peguei um resfriado na praia.',
    newWords: [
      { word: 'caught', pt: 'peguei', kind: 'verbo' },
      { word: 'beach', pt: 'praia', kind: 'subst' },
    ],
  },
  21: {
    en: 'Take this medicine twice a day.',
    pt: 'Tome esse remédio duas vezes por dia.',
    newWords: [
      { word: 'Take', pt: 'tomar, pegar', kind: 'verbo' },
      { word: 'twice', pt: 'duas vezes', kind: 'adv' },
    ],
  },
  22: {
    en: 'You should see a doctor soon.',
    pt: 'Você deveria ir ao médico logo.',
    newWords: [
      { word: 'should', pt: 'deveria', kind: 'verbo' },
      { word: 'soon', pt: 'logo, em breve', kind: 'adv' },
    ],
  },
  23: {
    en: 'My uncle is in the hospital.',
    pt: 'Meu tio está no hospital.',
    newWords: [
      { word: 'uncle', pt: 'tio', kind: 'subst' },
    ],
  },
  24: {
    en: 'He eats healthy food every day.',
    pt: 'Ele come comida saudável todos os dias.',
    newWords: [
      { word: 'food', pt: 'comida', kind: 'subst' },
      { word: 'every', pt: 'todo, cada', kind: 'adj' },
    ],
  },
  25: {
    en: 'I have an appointment tomorrow.',
    pt: 'Tenho uma consulta amanhã.',
    newWords: [
      { word: 'tomorrow', pt: 'amanhã', kind: 'adv' },
    ],
  },
};
