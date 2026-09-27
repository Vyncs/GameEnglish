import type { TopicSentence } from './topic';

// Frases faladas do bloco "Adverbios de frequencia".
//
// O aluno ouve a frase, lê o sentido em português e repete falando. Quando o
// `example` que o item já trazia servia, ele foi reaproveitado: a frase lida na
// etapa anterior é a mesma que ele repete, o que reforça em vez de apresentar
// material novo.

export const SENTENCES_FREQUENCY: Record<number, TopicSentence> = {
  1: {
    en: 'I always drink coffee in the morning.',
    pt: 'Eu sempre tomo café de manhã.',
    newWords: [
      { word: 'drink', pt: 'beber, tomar', kind: 'verbo' },
      { word: 'morning', pt: 'manhã', kind: 'subst' },
    ],
  },
  2: {
    en: 'I usually wake up at 6.',
    pt: 'Eu geralmente acordo às 6.',
    newWords: [
      { word: 'wake up', pt: 'acordar', kind: 'expr' },
    ],
  },
  3: {
    en: 'I normally have lunch at noon.',
    pt: 'Normalmente eu almoço ao meio-dia.',
    newWords: [
      { word: 'lunch', pt: 'almoço', kind: 'subst' },
      { word: 'noon', pt: 'meio-dia', kind: 'subst' },
    ],
  },
  4: {
    en: 'Do you often eat out?',
    pt: 'Você come fora com frequência?',
    newWords: [
      { word: 'eat out', pt: 'comer fora', kind: 'expr' },
    ],
  },
  5: {
    en: 'Sometimes I work on Saturdays.',
    pt: 'Às vezes eu trabalho aos sábados.',
    newWords: [
      { word: 'Saturdays', pt: 'sábados', kind: 'subst' },
    ],
  },
  6: {
    en: 'She rarely watches TV.',
    pt: 'Ela raramente assiste TV.',
    newWords: [
      { word: 'watches', pt: 'assiste (watch + es)', kind: 'verbo' },
    ],
  },
  7: {
    en: 'I hardly ever drink soda.',
    pt: 'Eu quase nunca tomo refrigerante.',
    newWords: [
      { word: 'soda', pt: 'refrigerante', kind: 'subst' },
    ],
  },
  8: {
    en: 'He never arrives on time.',
    pt: 'Ele nunca chega na hora.',
    newWords: [
      { word: 'on time', pt: 'na hora', kind: 'expr' },
    ],
  },
  9: {
    en: 'I travel once a year.',
    pt: 'Eu viajo uma vez por ano.',
    newWords: [
      { word: 'travel', pt: 'viajar', kind: 'verbo' },
    ],
  },
  10: {
    en: 'I go to the gym twice a week.',
    pt: 'Eu vou à academia duas vezes por semana.',
    newWords: [
      { word: 'gym', pt: 'academia', kind: 'subst' },
      { word: 'week', pt: 'semana', kind: 'subst' },
    ],
  },
  11: {
    en: 'I called you three times!',
    pt: 'Eu te liguei três vezes!',
    newWords: [
      { word: 'called', pt: 'liguei (passado de call)', kind: 'verbo' },
    ],
  },
  12: {
    en: 'We have class once a week.',
    pt: 'A gente tem aula uma vez por semana.',
    newWords: [
      { word: 'class', pt: 'aula', kind: 'subst' },
    ],
  },
  13: {
    en: 'I play soccer on weekends.',
    pt: 'Eu jogo futebol nos fins de semana.',
    newWords: [
      { word: 'play', pt: 'jogar', kind: 'verbo' },
      { word: 'soccer', pt: 'futebol', kind: 'subst' },
    ],
  },
  14: {
    en: 'She runs every other day.',
    pt: 'Ela corre dia sim, dia não.',
    newWords: [
      { word: 'runs', pt: 'corre', kind: 'verbo' },
    ],
  },
  15: {
    en: 'He complains all the time.',
    pt: 'Ele reclama o tempo todo.',
    newWords: [
      { word: 'complains', pt: 'reclama', kind: 'verbo' },
    ],
  },
  16: {
    en: 'How often do you read a book?',
    pt: 'Com que frequência você lê um livro?',
    newWords: [
      { word: 'read', pt: 'ler', kind: 'verbo' },
      { word: 'book', pt: 'livro', kind: 'subst' },
    ],
  },
};
