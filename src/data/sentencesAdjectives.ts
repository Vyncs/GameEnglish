import type { TopicSentence } from './topic';

// Frases faladas do bloco "Adjetivos essenciais".
//
// O aluno ouve a frase, lê o sentido em português e repete falando. Quando o
// `example` que o item já trazia servia, ele foi reaproveitado: a frase lida na
// etapa anterior é a mesma que ele repete, o que reforça em vez de apresentar
// material novo.

export const SENTENCES_ADJECTIVES: Record<number, TopicSentence> = {
  1: {
    en: 'That is a good idea.',
    pt: 'Essa é uma boa ideia.',
    newWords: [
      { word: 'idea', pt: 'ideia', kind: 'subst' },
    ],
  },
  2: {
    en: 'The weather is bad today.',
    pt: 'O tempo está ruim hoje.',
    newWords: [
      { word: 'weather', pt: 'tempo, clima', kind: 'subst' },
    ],
  },
  3: {
    en: 'They live in a big house.',
    pt: 'Eles moram numa casa grande.',
    newWords: [
      { word: 'live', pt: 'morar', kind: 'verbo' },
    ],
  },
  4: {
    en: 'I drive a small car to work.',
    pt: 'Eu dirijo um carro pequeno para o trabalho.',
    newWords: [
      { word: 'drive', pt: 'dirigir', kind: 'verbo' },
    ],
  },
  5: {
    en: 'I bought a new phone.',
    pt: 'Comprei um celular novo.',
    newWords: [
      { word: 'bought', pt: 'comprei (passado de buy)', kind: 'verbo' },
    ],
  },
  6: {
    en: 'This is a very old building.',
    pt: 'Esse prédio é bem antigo.',
    newWords: [
      { word: 'building', pt: 'prédio', kind: 'subst' },
    ],
  },
  7: {
    en: 'She looks very happy.',
    pt: 'Ela parece muito feliz.',
    newWords: [
      { word: 'looks', pt: 'parece', kind: 'verbo' },
    ],
  },
  8: {
    en: 'She feels sad about the news.',
    pt: 'Ela se sente triste com a notícia.',
    newWords: [
      { word: 'feels', pt: 'sente', kind: 'verbo' },
      { word: 'news', pt: 'notícia', kind: 'subst' },
    ],
  },
  9: {
    en: 'This exercise is easy.',
    pt: 'Esse exercício é fácil.',
    newWords: [
      { word: 'exercise', pt: 'exercício', kind: 'subst' },
    ],
  },
  10: {
    en: 'My job is hard but fun.',
    pt: 'Meu trabalho é difícil, mas divertido.',
    newWords: [
      { word: 'job', pt: 'trabalho, emprego', kind: 'subst' },
      { word: 'fun', pt: 'divertido', kind: 'adj' },
    ],
  },
  11: {
    en: 'The coffee is too hot.',
    pt: 'O café está quente demais.',
    newWords: [
      { word: 'too', pt: 'demais', kind: 'adv' },
    ],
  },
  12: {
    en: "It's cold outside today.",
    pt: 'Está frio lá fora hoje.',
    newWords: [
      { word: 'outside', pt: 'lá fora', kind: 'adv' },
    ],
  },
  13: {
    en: 'He is a fast runner.',
    pt: 'Ele é um corredor rápido.',
    newWords: [
      { word: 'runner', pt: 'corredor', kind: 'subst' },
    ],
  },
  14: {
    en: 'The traffic is slow every morning.',
    pt: 'O transito fica lento toda manha.',
    newWords: [
      { word: 'traffic', pt: 'trânsito', kind: 'subst' },
      { word: 'morning', pt: 'manhã', kind: 'subst' },
    ],
  },
  15: {
    en: 'She has long hair.',
    pt: 'Ela tem cabelo comprido.',
    newWords: [
      { word: 'hair', pt: 'cabelo', kind: 'subst' },
    ],
  },
  16: {
    en: 'The movie is short.',
    pt: 'O filme é curto.',
    newWords: [
      { word: 'movie', pt: 'filme', kind: 'subst' },
    ],
  },
  17: {
    en: 'My brother is very tall.',
    pt: 'Meu irmão é muito alto.',
    newWords: [
      { word: 'brother', pt: 'irmão', kind: 'subst' },
    ],
  },
  18: {
    en: 'Her new dress is beautiful.',
    pt: 'O vestido novo dela é lindo.',
    newWords: [
      { word: 'dress', pt: 'vestido', kind: 'subst' },
    ],
  },
  19: {
    en: 'That is an ugly sweater.',
    pt: 'Esse suéter é feio.',
    newWords: [
      { word: 'sweater', pt: 'suéter, blusa de frio', kind: 'subst' },
    ],
  },
  20: {
    en: 'The flights to Europe are expensive.',
    pt: 'Os voos para a Europa são caros.',
    newWords: [
      { word: 'flights', pt: 'voos', kind: 'subst' },
    ],
  },
  21: {
    en: 'I found a cheap ticket.',
    pt: 'Achei uma passagem barata.',
    newWords: [
      { word: 'found', pt: 'achei (passado de find)', kind: 'verbo' },
      { word: 'ticket', pt: 'passagem', kind: 'subst' },
    ],
  },
  22: {
    en: 'My boss is young and smart.',
    pt: 'Meu chefe é jovem e inteligente.',
    newWords: [
      { word: 'boss', pt: 'chefe', kind: 'subst' },
      { word: 'smart', pt: 'inteligente', kind: 'adj' },
    ],
  },
  23: {
    en: 'My father is strong and healthy.',
    pt: 'Meu pai é forte e saudável.',
    newWords: [
      { word: 'father', pt: 'pai', kind: 'subst' },
      { word: 'healthy', pt: 'saudável', kind: 'adj' },
    ],
  },
  24: {
    en: "I'm tired after work.",
    pt: 'Estou cansado depois do trabalho.',
    newWords: [
      { word: 'after', pt: 'depois de', kind: 'prep' },
    ],
  },
  25: {
    en: "Sorry, I'm busy right now.",
    pt: 'Desculpa, estou ocupado agora.',
    newWords: [
      { word: 'right now', pt: 'agora mesmo', kind: 'expr' },
    ],
  },
};
