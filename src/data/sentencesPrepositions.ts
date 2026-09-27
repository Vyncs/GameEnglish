import type { TopicSentence } from './topic';

// Frases faladas do bloco "Preposicoes".
//
// O aluno ouve a frase, lê o sentido em português e repete falando. Quando o
// `example` que o item já trazia servia, ele foi reaproveitado: a frase lida na
// etapa anterior é a mesma que ele repete, o que reforça em vez de apresentar
// material novo.

export const SENTENCES_PREPOSITIONS: Record<number, TopicSentence> = {
  1: {
    en: 'The keys are in the drawer.',
    pt: 'As chaves estão na gaveta.',
    newWords: [
      { word: 'keys', pt: 'chaves', kind: 'subst' },
      { word: 'drawer', pt: 'gaveta', kind: 'subst' },
    ],
  },
  2: {
    en: 'My laptop is on the bed.',
    pt: 'Meu notebook está na cama.',
    newWords: [
      { word: 'laptop', pt: 'notebook', kind: 'subst' },
      { word: 'bed', pt: 'cama', kind: 'subst' },
    ],
  },
  3: {
    en: "I'm at the office right now.",
    pt: 'Estou no escritório agora.',
    newWords: [
      { word: 'office', pt: 'escritório', kind: 'subst' },
      { word: 'right now', pt: 'agora mesmo', kind: 'expr' },
    ],
  },
  4: {
    en: 'I go to work every day.',
    pt: 'Eu vou pro trabalho todo dia.',
    newWords: [
      { word: 'every day', pt: 'todo dia', kind: 'expr' },
    ],
  },
  5: {
    en: 'This letter is from my boss.',
    pt: 'Esta carta é do meu chefe.',
    newWords: [
      { word: 'letter', pt: 'carta', kind: 'subst' },
      { word: 'boss', pt: 'chefe', kind: 'subst' },
    ],
  },
  6: {
    en: 'This gift is for you.',
    pt: 'Este presente é pra você.',
    newWords: [
      { word: 'gift', pt: 'presente', kind: 'subst' },
    ],
  },
  7: {
    en: "I've worked here since January.",
    pt: 'Eu trabalho aqui desde janeiro.',
    newWords: [
      { word: 'January', pt: 'janeiro', kind: 'subst' },
    ],
  },
  8: {
    en: 'I live with my brother.',
    pt: 'Eu moro com meu irmão.',
    newWords: [
      { word: 'brother', pt: 'irmão', kind: 'subst' },
    ],
  },
  9: {
    en: 'I drink coffee without sugar.',
    pt: 'Eu tomo café sem açúcar.',
    newWords: [
      { word: 'sugar', pt: 'açúcar', kind: 'subst' },
    ],
  },
  10: {
    en: 'We talked about the new job.',
    pt: 'A gente conversou sobre o emprego novo.',
    newWords: [
      { word: 'talked', pt: 'conversou, falou', kind: 'verbo' },
      { word: 'job', pt: 'emprego', kind: 'subst' },
    ],
  },
  11: {
    en: 'I forgot the name of the street.',
    pt: 'Esqueci o nome da rua.',
    newWords: [
      { word: 'forgot', pt: 'esqueci', kind: 'verbo' },
      { word: 'street', pt: 'rua', kind: 'subst' },
    ],
  },
  12: {
    en: 'I always pay by card.',
    pt: 'Eu sempre pago com cartão.',
    newWords: [
      { word: 'pay', pt: 'pagar', kind: 'verbo' },
      { word: 'always', pt: 'sempre', kind: 'adv' },
    ],
  },
  13: {
    en: 'The bank is between the shops.',
    pt: 'O banco fica entre as lojas.',
    newWords: [
      { word: 'bank', pt: 'banco', kind: 'subst' },
      { word: 'shops', pt: 'lojas', kind: 'subst' },
    ],
  },
  14: {
    en: 'I found it among my clothes.',
    pt: 'Achei no meio das minhas roupas.',
    newWords: [
      { word: 'found', pt: 'achei', kind: 'verbo' },
      { word: 'clothes', pt: 'roupas', kind: 'subst' },
    ],
  },
  15: {
    en: 'The cat is under the table.',
    pt: 'O gato está embaixo da mesa.',
    newWords: [
      { word: 'cat', pt: 'gato', kind: 'subst' },
    ],
  },
  16: {
    en: "There's a mirror over the sink.",
    pt: 'Tem um espelho acima da pia.',
    newWords: [
      { word: 'mirror', pt: 'espelho', kind: 'subst' },
      { word: 'sink', pt: 'pia', kind: 'subst' },
    ],
  },
  17: {
    en: 'My bag is behind the door.',
    pt: 'Minha bolsa está atrás da porta.',
    newWords: [
      { word: 'bag', pt: 'bolsa, sacola', kind: 'subst' },
      { word: 'door', pt: 'porta', kind: 'subst' },
    ],
  },
  18: {
    en: "I'll wait in front of the school.",
    pt: 'Vou esperar na frente da escola.',
    newWords: [
      { word: 'wait', pt: 'esperar', kind: 'verbo' },
      { word: 'school', pt: 'escola', kind: 'subst' },
    ],
  },
  19: {
    en: 'She sat next to me.',
    pt: 'Ela sentou do meu lado.',
    newWords: [
      { word: 'sat', pt: 'sentou', kind: 'verbo' },
    ],
  },
  20: {
    en: 'The hotel is near the beach.',
    pt: 'O hotel fica perto da praia.',
    newWords: [
      { word: 'beach', pt: 'praia', kind: 'subst' },
    ],
  },
  21: {
    en: 'He went into the room.',
    pt: 'Ele entrou no quarto.',
    newWords: [
      { word: 'went', pt: 'foi (passado de go)', kind: 'verbo' },
      { word: 'room', pt: 'quarto, sala', kind: 'subst' },
    ],
  },
  22: {
    en: 'She came out of the house.',
    pt: 'Ela saiu de casa.',
    newWords: [
      { word: 'came', pt: 'veio (passado de come)', kind: 'verbo' },
      { word: 'house', pt: 'casa', kind: 'subst' },
    ],
  },
  23: {
    en: 'I slept during the movie.',
    pt: 'Eu dormi durante o filme.',
    newWords: [
      { word: 'slept', pt: 'dormi', kind: 'verbo' },
      { word: 'movie', pt: 'filme', kind: 'subst' },
    ],
  },
  24: {
    en: 'Please call me before lunch.',
    pt: 'Me liga antes do almoço, por favor.',
    newWords: [
      { word: 'call', pt: 'ligar', kind: 'verbo' },
      { word: 'lunch', pt: 'almoço', kind: 'subst' },
    ],
  },
  25: {
    en: 'We can talk after the meeting.',
    pt: 'A gente pode conversar depois da reunião.',
    newWords: [
      { word: 'meeting', pt: 'reunião', kind: 'subst' },
    ],
  },
};
