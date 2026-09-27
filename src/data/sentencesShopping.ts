import type { TopicSentence } from './topic';

// Frases faladas do bloco "Compras e dinheiro".
//
// O aluno ouve a frase, lê o sentido em português e repete falando. Quando o
// `example` que o item já trazia servia, ele foi reaproveitado: a frase lida na
// etapa anterior é a mesma que ele repete, o que reforça em vez de apresentar
// material novo.

export const SENTENCES_SHOPPING: Record<number, TopicSentence> = {
  1: {
    en: 'I shop online every Friday night.',
    pt: 'Eu faço compras pela internet toda sexta à noite.',
    newWords: [
      { word: 'online', pt: 'pela internet', kind: 'adv' },
    ],
  },
  2: {
    en: 'The store opens at nine.',
    pt: 'A loja abre às nove.',
    newWords: [
      { word: 'opens', pt: 'abre', kind: 'verbo' },
    ],
  },
  3: {
    en: 'I want to buy a new phone.',
    pt: 'Quero comprar um celular novo.',
    newWords: [
      { word: 'phone', pt: 'celular', kind: 'subst' },
    ],
  },
  4: {
    en: 'They sell fresh bread here.',
    pt: 'Eles vendem pão fresco aqui.',
    newWords: [
      { word: 'bread', pt: 'pão', kind: 'subst' },
      { word: 'fresh', pt: 'fresco', kind: 'adj' },
    ],
  },
  5: {
    en: 'I need to pay the bill.',
    pt: 'Preciso pagar a conta.',
    newWords: [
      { word: 'bill', pt: 'conta', kind: 'subst' },
    ],
  },
  6: {
    en: "What's the price of this shirt?",
    pt: 'Qual é o preço desta camisa?',
    newWords: [
      { word: 'shirt', pt: 'camisa', kind: 'subst' },
    ],
  },
  7: {
    en: 'The bus is cheap and fast.',
    pt: 'O ônibus é barato e rápido.',
    newWords: [
      { word: 'bus', pt: 'ônibus', kind: 'subst' },
      { word: 'fast', pt: 'rápido', kind: 'adj' },
    ],
  },
  8: {
    en: 'That car is too expensive.',
    pt: 'Aquele carro é caro demais.',
    newWords: [
      { word: 'car', pt: 'carro', kind: 'subst' },
    ],
  },
  9: {
    en: "I don't have money right now.",
    pt: 'Não tenho dinheiro agora.',
    newWords: [
      { word: 'right now', pt: 'agora', kind: 'expr' },
    ],
  },
  10: {
    en: 'The taxi driver wants cash.',
    pt: 'O motorista de táxi quer dinheiro vivo.',
    newWords: [
      { word: 'driver', pt: 'motorista', kind: 'subst' },
      { word: 'taxi', pt: 'táxi', kind: 'subst' },
    ],
  },
  11: {
    en: 'Here is your change, sir.',
    pt: 'Aqui está o seu troco, senhor.',
    newWords: [
      { word: 'sir', pt: 'senhor', kind: 'subst' },
    ],
  },
  12: {
    en: 'I lost my credit card.',
    pt: 'Perdi meu cartão de crédito.',
    newWords: [
      { word: 'lost', pt: 'perdi', kind: 'verbo' },
      { word: 'credit', pt: 'crédito', kind: 'subst' },
    ],
  },
  13: {
    en: 'Please keep the receipt.',
    pt: 'Guarde o recibo, por favor.',
    newWords: [
      { word: 'keep', pt: 'guardar', kind: 'verbo' },
    ],
  },
  14: {
    en: 'They gave me a discount.',
    pt: 'Eles me deram um desconto.',
    newWords: [
      { word: 'gave', pt: 'deram', kind: 'verbo' },
    ],
  },
  15: {
    en: 'The jeans are on sale this week.',
    pt: 'A calça jeans está em promoção esta semana.',
    newWords: [
      { word: 'jeans', pt: 'calça jeans', kind: 'subst' },
      { word: 'week', pt: 'semana', kind: 'subst' },
    ],
  },
  16: {
    en: 'The delivery is free today.',
    pt: 'A entrega é grátis hoje.',
    newWords: [
      { word: 'delivery', pt: 'entrega', kind: 'subst' },
    ],
  },
  17: {
    en: 'Do you have a bigger size?',
    pt: 'Você tem um tamanho maior?',
    newWords: [
      { word: 'bigger', pt: 'maior', kind: 'adj' },
    ],
  },
  18: {
    en: 'I need new clothes for work.',
    pt: 'Preciso de roupas novas para o trabalho.',
    newWords: [
      { word: 'work', pt: 'trabalho', kind: 'subst' },
    ],
  },
  19: {
    en: 'These shoes are really small.',
    pt: 'Estes sapatos são bem pequenos.',
    newWords: [
      { word: 'small', pt: 'pequeno', kind: 'adj' },
      { word: 'really', pt: 'bem, realmente', kind: 'adv' },
    ],
  },
  20: {
    en: 'The customer is waiting outside.',
    pt: 'O cliente está esperando lá fora.',
    newWords: [
      { word: 'waiting', pt: 'esperando', kind: 'verbo' },
      { word: 'outside', pt: 'lá fora', kind: 'adv' },
    ],
  },
  21: {
    en: 'The cashier is very slow today.',
    pt: 'O caixa está muito lento hoje.',
    newWords: [
      { word: 'slow', pt: 'lento', kind: 'adj' },
    ],
  },
  22: {
    en: 'I want a full refund.',
    pt: 'Quero um reembolso total.',
    newWords: [
      { word: 'full', pt: 'total, cheio', kind: 'adj' },
    ],
  },
  23: {
    en: 'I spend too much on food.',
    pt: 'Eu gasto muito com comida.',
    newWords: [
      { word: 'food', pt: 'comida', kind: 'subst' },
      { word: 'too much', pt: 'muito, demais', kind: 'expr' },
    ],
  },
  24: {
    en: 'I want to save money this year.',
    pt: 'Quero economizar dinheiro este ano.',
    newWords: [
      { word: 'year', pt: 'ano', kind: 'subst' },
    ],
  },
  25: {
    en: "I can't afford that jacket.",
    pt: 'Não tenho como pagar aquela jaqueta.',
    newWords: [
      { word: 'jacket', pt: 'jaqueta', kind: 'subst' },
    ],
  },
};
