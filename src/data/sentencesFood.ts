import type { TopicSentence } from './topic';

// Frases faladas do bloco "Comida e bebida".
//
// Aproveitam o `example` que cada item já tinha — a frase que o aluno viu na
// etapa de leitura é a mesma que ele repete falando, o que reforça em vez de
// apresentar material novo. A tradução e as palavras novas são daqui.

export const SENTENCES_FOOD: Record<number, TopicSentence> = {
  1: {
    en: 'I have breakfast at seven.',
    pt: 'Eu tomo café da manhã às sete.',
    newWords: [{ word: 'at', pt: 'às (com horário)', kind: 'prep' }],
  },
  2: {
    en: 'What did you have for lunch?',
    pt: 'O que você almoçou?',
    newWords: [{ word: 'for', pt: 'para, no (refeição)', kind: 'prep' }],
  },
  3: {
    en: 'Dinner is ready.',
    pt: 'O jantar está pronto.',
    newWords: [{ word: 'ready', pt: 'pronto', kind: 'adj' }],
  },
  4: {
    en: 'This is my favorite meal.',
    pt: 'Esta é minha refeição favorita.',
    newWords: [{ word: 'favorite', pt: 'favorito', kind: 'adj' }],
  },
  5: {
    en: "I don't eat meat.",
    pt: 'Eu não como carne.',
    newWords: [{ word: 'eat', pt: 'comer', kind: 'verbo' }],
  },
  6: {
    en: 'I ordered grilled chicken.',
    pt: 'Eu pedi frango grelhado.',
    newWords: [{ word: 'grilled', pt: 'grelhado', kind: 'adj' }],
  },
  7: {
    en: 'We had fish for dinner.',
    pt: 'Nós comemos peixe no jantar.',
    newWords: [{ word: 'had', pt: 'comemos (passado de have)', kind: 'verbo' }],
  },
  8: {
    en: 'I eat rice every day.',
    pt: 'Eu como arroz todo dia.',
    newWords: [{ word: 'every', pt: 'todo, cada', kind: 'adj' }],
  },
  9: {
    en: 'Rice and beans is a classic.',
    pt: 'Arroz e feijão é um clássico.',
    newWords: [{ word: 'classic', pt: 'clássico', kind: 'subst' }],
  },
  10: {
    en: 'I bought fresh bread.',
    pt: 'Eu comprei pão fresco.',
    newWords: [{ word: 'fresh', pt: 'fresco', kind: 'adj' }],
  },
  11: {
    en: 'Do you want cheese on it?',
    pt: 'Você quer queijo nele?',
    newWords: [{ word: 'on', pt: 'em cima de', kind: 'prep' }],
  },
  12: {
    en: 'I want two eggs, please.',
    pt: 'Eu quero dois ovos, por favor.',
    newWords: [{ word: 'please', pt: 'por favor', kind: 'expr' }],
  },
  13: {
    en: 'You should eat more fruit.',
    pt: 'Você deveria comer mais fruta.',
    newWords: [{ word: 'should', pt: 'deveria', kind: 'verbo' }],
  },
  14: {
    en: 'She only eats vegetables.',
    pt: 'Ela só come legumes.',
    newWords: [{ word: 'only', pt: 'só, apenas', kind: 'adv' }],
  },
  15: {
    en: 'This needs more salt.',
    pt: 'Isto precisa de mais sal.',
    newWords: [{ word: 'needs', pt: 'precisa', kind: 'verbo' }],
  },
  16: {
    en: 'I drink coffee without sugar.',
    pt: 'Eu tomo café sem açúcar.',
    newWords: [{ word: 'without', pt: 'sem', kind: 'prep' }],
  },
  17: {
    en: 'Can I have some water?',
    pt: 'Pode me trazer água?',
    newWords: [{ word: 'some', pt: 'um pouco de', kind: 'adj' }],
  },
  18: {
    en: 'Orange juice, please.',
    pt: 'Suco de laranja, por favor.',
    newWords: [{ word: 'orange', pt: 'laranja', kind: 'subst' }],
  },
  19: {
    en: 'What would you like to drink?',
    pt: 'O que você gostaria de beber?',
    newWords: [{ word: 'would like', pt: 'gostaria (pedido educado)', kind: 'expr' }],
  },
  20: {
    en: 'This tastes really good.',
    pt: 'Isto está muito gostoso.',
    newWords: [{ word: 'really', pt: 'muito, realmente', kind: 'adv' }],
  },
  21: {
    en: 'I am hungry.',
    pt: 'Eu estou com fome.',
    newWords: [{ word: 'am', pt: 'estou (be)', kind: 'verbo' }],
  },
  22: {
    en: 'Are you thirsty?',
    pt: 'Você está com sede?',
    newWords: [{ word: 'are', pt: 'está (be)', kind: 'verbo' }],
  },
  23: {
    en: 'I would like to order now.',
    pt: 'Eu gostaria de pedir agora.',
    newWords: [{ word: 'now', pt: 'agora', kind: 'adv' }],
  },
  24: {
    en: 'The waiter brought the menu.',
    pt: 'O garçom trouxe o cardápio.',
    newWords: [{ word: 'menu', pt: 'cardápio', kind: 'subst' }],
  },
  25: {
    en: 'Can we have the bill, please?',
    pt: 'Pode trazer a conta, por favor?',
    newWords: [{ word: 'can we', pt: 'podemos / pode nos', kind: 'expr' }],
  },
};
