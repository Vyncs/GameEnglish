import type { TopicSentence } from './topic';

// Frases da etapa "Frases" do bloco Verbos 1–25.
//
// Critério de escrita: curtas (5 a 8 palavras), do dia a dia, e com uma ou
// duas palavras novas por frase — o vocabulário que o aluno leva de carona
// enquanto decora o verbo. As palavras novas vêm marcadas com a classe
// gramatical, que é o que a tela mostra em chips coloridos.
//
// A chave é o id do verbo no bloco (ver lesson02Verbs.ts).

export const SENTENCES_VERBS_1: Record<number, TopicSentence> = {
  1: {
    en: 'The train arrives at eight.',
    pt: 'O trem chega às oito.',
    newWords: [
      { word: 'train', pt: 'trem', kind: 'subst' },
      { word: 'at', pt: 'às (com horário)', kind: 'prep' },
    ],
  },
  2: {
    en: 'Ask her for help.',
    pt: 'Peça ajuda a ela.',
    newWords: [
      { word: 'help', pt: 'ajuda', kind: 'subst' },
      { word: 'for', pt: 'por, para', kind: 'prep' },
    ],
  },
  3: {
    en: 'I am very tired today.',
    pt: 'Eu estou muito cansado hoje.',
    newWords: [
      { word: 'tired', pt: 'cansado', kind: 'adj' },
      { word: 'today', pt: 'hoje', kind: 'adv' },
    ],
  },
  4: {
    en: 'The movie begins now.',
    pt: 'O filme começa agora.',
    newWords: [
      { word: 'movie', pt: 'filme', kind: 'subst' },
      { word: 'now', pt: 'agora', kind: 'adv' },
    ],
  },
  5: {
    en: "Don't break the glass.",
    pt: 'Não quebre o copo.',
    newWords: [{ word: 'glass', pt: 'copo, vidro', kind: 'subst' }],
  },
  6: {
    en: 'Bring me a cold drink.',
    pt: 'Traga-me uma bebida gelada.',
    newWords: [
      { word: 'cold', pt: 'gelado, frio', kind: 'adj' },
      { word: 'drink', pt: 'bebida', kind: 'subst' },
    ],
  },
  7: {
    en: 'I buy bread every morning.',
    pt: 'Eu compro pão toda manhã.',
    newWords: [
      { word: 'bread', pt: 'pão', kind: 'subst' },
      { word: 'every', pt: 'todo, cada', kind: 'adj' },
    ],
  },
  8: {
    en: 'Call me after lunch.',
    pt: 'Me ligue depois do almoço.',
    newWords: [
      { word: 'after', pt: 'depois de', kind: 'prep' },
      { word: 'lunch', pt: 'almoço', kind: 'subst' },
    ],
  },
  9: {
    en: 'She can drive very well.',
    pt: 'Ela sabe dirigir muito bem.',
    newWords: [
      { word: 'very', pt: 'muito', kind: 'adv' },
      { word: 'well', pt: 'bem', kind: 'adv' },
    ],
  },
  10: {
    en: 'Choose the cheaper one.',
    pt: 'Escolha o mais barato.',
    newWords: [{ word: 'cheaper', pt: 'mais barato', kind: 'adj' }],
  },
  11: {
    en: 'I clean the kitchen on Sundays.',
    pt: 'Eu limpo a cozinha aos domingos.',
    newWords: [
      { word: 'kitchen', pt: 'cozinha', kind: 'subst' },
      { word: 'on', pt: 'em, aos (com dias)', kind: 'prep' },
    ],
  },
  12: {
    en: 'Please close the window.',
    pt: 'Por favor, feche a janela.',
    newWords: [
      { word: 'window', pt: 'janela', kind: 'subst' },
      { word: 'please', pt: 'por favor', kind: 'expr' },
    ],
  },
  13: {
    en: 'Come to my house tonight.',
    pt: 'Venha à minha casa hoje à noite.',
    newWords: [
      { word: 'house', pt: 'casa', kind: 'subst' },
      { word: 'tonight', pt: 'hoje à noite', kind: 'adv' },
    ],
  },
  14: {
    en: 'My mother cooks really well.',
    pt: 'Minha mãe cozinha muito bem.',
    newWords: [
      { word: 'mother', pt: 'mãe', kind: 'subst' },
      { word: 'really', pt: 'realmente, muito', kind: 'adv' },
    ],
  },
  15: {
    en: 'The baby cries at night.',
    pt: 'O bebê chora à noite.',
    newWords: [
      { word: 'baby', pt: 'bebê', kind: 'subst' },
      { word: 'night', pt: 'noite', kind: 'subst' },
    ],
  },
  16: {
    en: 'He cut his finger yesterday.',
    pt: 'Ele cortou o dedo ontem.',
    newWords: [
      { word: 'finger', pt: 'dedo (da mão)', kind: 'subst' },
      { word: 'yesterday', pt: 'ontem', kind: 'adv' },
    ],
  },
  17: {
    en: 'They dance every weekend.',
    pt: 'Eles dançam todo fim de semana.',
    newWords: [{ word: 'weekend', pt: 'fim de semana', kind: 'subst' }],
  },
  18: {
    en: 'We dated for two years.',
    pt: 'Nós namoramos por dois anos.',
    newWords: [
      { word: 'for', pt: 'por, durante', kind: 'prep' },
      { word: 'years', pt: 'anos', kind: 'subst' },
    ],
  },
  19: {
    en: 'It depends on the weather.',
    pt: 'Depende do tempo.',
    newWords: [
      { word: 'on', pt: 'de (preso ao verbo depend)', kind: 'prep' },
      { word: 'weather', pt: 'tempo, clima', kind: 'subst' },
    ],
  },
  20: {
    en: 'My old dog died last year.',
    pt: 'Meu cachorro velho morreu ano passado.',
    newWords: [
      { word: 'old', pt: 'velho', kind: 'adj' },
      { word: 'dog', pt: 'cachorro', kind: 'subst' },
    ],
  },
  21: {
    en: 'I do my homework at night.',
    pt: 'Eu faço minha lição à noite.',
    newWords: [{ word: 'homework', pt: 'lição de casa', kind: 'subst' }],
  },
  22: {
    en: 'I dream about you.',
    pt: 'Eu sonho com você.',
    newWords: [{ word: 'about', pt: 'sobre, com', kind: 'prep' }],
  },
  23: {
    en: 'Drink more water every day.',
    pt: 'Beba mais água todo dia.',
    newWords: [
      { word: 'water', pt: 'água', kind: 'subst' },
      { word: 'more', pt: 'mais', kind: 'adv' },
    ],
  },
  24: {
    en: 'She drives to work early.',
    pt: 'Ela dirige para o trabalho cedo.',
    newWords: [
      { word: 'work', pt: 'trabalho', kind: 'subst' },
      { word: 'early', pt: 'cedo', kind: 'adv' },
    ],
  },
  25: {
    en: 'We eat rice and beans.',
    pt: 'Nós comemos arroz e feijão.',
    newWords: [
      { word: 'rice', pt: 'arroz', kind: 'subst' },
      { word: 'beans', pt: 'feijão', kind: 'subst' },
    ],
  },
};
