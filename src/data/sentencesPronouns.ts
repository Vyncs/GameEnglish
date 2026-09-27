import type { TopicSentence } from './topic';

// Frases faladas do bloco "Pronomes".
//
// O aluno ouve a frase, lê o sentido em português e repete falando. Quando o
// `example` que o item já trazia servia, ele foi reaproveitado: a frase lida na
// etapa anterior é a mesma que ele repete, o que reforça em vez de apresentar
// material novo.

export const SENTENCES_PRONOUNS: Record<number, TopicSentence> = {
  1: {
    en: 'I love you so much.',
    pt: 'Eu te amo tanto.',
    newWords: [
      { word: 'so much', pt: 'tanto, muito', kind: 'expr' },
    ],
  },
  2: {
    en: 'You are my friend.',
    pt: 'Você é meu amigo.',
    newWords: [
      { word: 'friend', pt: 'amigo', kind: 'subst' },
    ],
  },
  3: {
    en: 'He works a lot.',
    pt: 'Ele trabalha muito.',
    newWords: [
      { word: 'a lot', pt: 'muito', kind: 'expr' },
      { word: 'works', pt: 'trabalha', kind: 'verbo' },
    ],
  },
  4: {
    en: 'She is a teacher.',
    pt: 'Ela é professora.',
    newWords: [
      { word: 'teacher', pt: 'professora', kind: 'subst' },
    ],
  },
  5: {
    en: 'It is cold today.',
    pt: 'Está frio hoje.',
    newWords: [
      { word: 'cold', pt: 'frio', kind: 'adj' },
      { word: 'today', pt: 'hoje', kind: 'adv' },
    ],
  },
  6: {
    en: 'We study together every night.',
    pt: 'Nós estudamos juntos toda noite.',
    newWords: [
      { word: 'together', pt: 'juntos', kind: 'adv' },
      { word: 'night', pt: 'noite', kind: 'subst' },
    ],
  },
  7: {
    en: 'They live in Brazil.',
    pt: 'Eles moram no Brasil.',
    newWords: [
      { word: 'live', pt: 'morar, viver', kind: 'verbo' },
    ],
  },
  8: {
    en: 'This is my house.',
    pt: 'Esta é a minha casa.',
    newWords: [
      { word: 'house', pt: 'casa', kind: 'subst' },
    ],
  },
  9: {
    en: 'Is this your car?',
    pt: 'Este carro é seu?',
    newWords: [
      { word: 'car', pt: 'carro', kind: 'subst' },
    ],
  },
  10: {
    en: 'His name is John.',
    pt: 'O nome dele é John.',
    newWords: [
      { word: 'name', pt: 'nome', kind: 'subst' },
    ],
  },
  11: {
    en: 'I know her sister.',
    pt: 'Eu conheço a irmã dela.',
    newWords: [
      { word: 'sister', pt: 'irmã', kind: 'subst' },
      { word: 'know', pt: 'conhecer, saber', kind: 'verbo' },
    ],
  },
  12: {
    en: 'The dog is wagging its tail.',
    pt: 'O cachorro está abanando o rabo.',
    newWords: [
      { word: 'tail', pt: 'rabo, cauda', kind: 'subst' },
      { word: 'tail', pt: 'rabo, cauda', kind: 'subst' },
    ],
  },
  13: {
    en: 'Our apartment is really small.',
    pt: 'Nosso apartamento é bem pequeno.',
    newWords: [
      { word: 'apartment', pt: 'apartamento', kind: 'subst' },
      { word: 'small', pt: 'pequeno', kind: 'adj' },
    ],
  },
  14: {
    en: 'Their children are smart.',
    pt: 'Os filhos deles são inteligentes.',
    newWords: [
      { word: 'children', pt: 'filhos, crianças', kind: 'subst' },
      { word: 'smart', pt: 'inteligente', kind: 'adj' },
    ],
  },
  15: {
    en: 'Call me later, please.',
    pt: 'Me liga depois, por favor.',
    newWords: [
      { word: 'later', pt: 'mais tarde', kind: 'adv' },
    ],
  },
  16: {
    en: 'I saw him yesterday.',
    pt: 'Eu vi ele ontem.',
    newWords: [
      { word: 'yesterday', pt: 'ontem', kind: 'adv' },
      { word: 'saw', pt: 'vi (passado de see)', kind: 'verbo' },
    ],
  },
  17: {
    en: 'When will you visit us?',
    pt: 'Quando você vai nos visitar?',
    newWords: [
      { word: 'visit', pt: 'visitar', kind: 'verbo' },
    ],
  },
  18: {
    en: 'I sent them an email.',
    pt: 'Eu mandei um e-mail pra eles.',
    newWords: [
      { word: 'sent', pt: 'mandei, enviei', kind: 'verbo' },
      { word: 'email', pt: 'e-mail', kind: 'subst' },
    ],
  },
  19: {
    en: 'I did it myself.',
    pt: 'Eu fiz isso sozinho.',
    newWords: [
      { word: 'did', pt: 'fiz', kind: 'verbo' },
    ],
  },
  20: {
    en: "Do it yourself, it's easy.",
    pt: 'Faz você mesmo, é fácil.',
    newWords: [
      { word: 'easy', pt: 'fácil', kind: 'adj' },
    ],
  },
  21: {
    en: 'He cooks dinner by himself.',
    pt: 'Ele faz o jantar sozinho.',
    newWords: [
      { word: 'cooks', pt: 'cozinha, faz (comida)', kind: 'verbo' },
      { word: 'dinner', pt: 'jantar', kind: 'subst' },
    ],
  },
  22: {
    en: 'She made the dress herself.',
    pt: 'Ela mesma fez o vestido.',
    newWords: [
      { word: 'made', pt: 'fez (passado de make)', kind: 'verbo' },
      { word: 'dress', pt: 'vestido', kind: 'subst' },
    ],
  },
  23: {
    en: 'We painted the house ourselves.',
    pt: 'Nós mesmos pintamos a casa.',
    newWords: [
      { word: 'painted', pt: 'pintamos', kind: 'verbo' },
    ],
  },
  24: {
    en: 'They organized everything themselves.',
    pt: 'Eles organizaram tudo sozinhos.',
    newWords: [
      { word: 'organized', pt: 'organizaram', kind: 'verbo' },
      { word: 'everything', pt: 'tudo', kind: 'pron' },
    ],
  },
};
