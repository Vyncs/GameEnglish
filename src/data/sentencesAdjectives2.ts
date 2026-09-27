import type { TopicSentence } from './topic';

// Frases faladas do bloco "Adjetivos comparacoes".
//
// O aluno ouve a frase, lê o sentido em português e repete falando. Quando o
// `example` que o item já trazia servia, ele foi reaproveitado: a frase lida na
// etapa anterior é a mesma que ele repete, o que reforça em vez de apresentar
// material novo.

export const SENTENCES_ADJECTIVES_2: Record<number, TopicSentence> = {
  1: {
    en: 'He wants to be rich.',
    pt: 'Ele quer ser rico.',
    newWords: [
      { word: 'wants', pt: 'quer', kind: 'verbo' },
    ],
  },
  2: {
    en: 'My grandparents were very poor.',
    pt: 'Meus avós eram muito pobres.',
    newWords: [
      { word: 'grandparents', pt: 'avós', kind: 'subst' },
    ],
  },
  3: {
    en: 'The kitchen is clean.',
    pt: 'A cozinha está limpa.',
    newWords: [
      { word: 'kitchen', pt: 'cozinha', kind: 'subst' },
    ],
  },
  4: {
    en: 'My shoes are dirty.',
    pt: 'Meus sapatos estão sujos.',
    newWords: [
      { word: 'shoes', pt: 'sapatos', kind: 'subst' },
    ],
  },
  5: {
    en: 'The bus was full.',
    pt: 'O ônibus estava cheio.',
    newWords: [
      { word: 'bus', pt: 'ônibus', kind: 'subst' },
    ],
  },
  6: {
    en: 'My glass is already empty.',
    pt: 'Meu copo já está vazio.',
    newWords: [
      { word: 'glass', pt: 'copo', kind: 'subst' },
      { word: 'already', pt: 'já', kind: 'adv' },
    ],
  },
  7: {
    en: 'This box is too heavy.',
    pt: 'Essa caixa é pesada demais.',
    newWords: [
      { word: 'box', pt: 'caixa', kind: 'subst' },
      { word: 'too', pt: 'demais', kind: 'adv' },
    ],
  },
  8: {
    en: 'My new laptop is very light.',
    pt: 'Meu notebook novo é bem leve.',
    newWords: [
      { word: 'laptop', pt: 'notebook', kind: 'subst' },
    ],
  },
  9: {
    en: 'It gets dark early in winter.',
    pt: 'Escurece cedo no inverno.',
    newWords: [
      { word: 'winter', pt: 'inverno', kind: 'subst' },
    ],
  },
  10: {
    en: 'The street is quiet at night.',
    pt: 'A rua fica silenciosa a noite.',
    newWords: [
      { word: 'street', pt: 'rua', kind: 'subst' },
      { word: 'night', pt: 'noite', kind: 'subst' },
    ],
  },
  11: {
    en: 'The music is too loud.',
    pt: 'A música está alta demais.',
    newWords: [
      { word: 'music', pt: 'música', kind: 'subst' },
    ],
  },
  12: {
    en: 'This neighborhood is safe.',
    pt: 'Esse bairro é seguro.',
    newWords: [
      { word: 'neighborhood', pt: 'bairro', kind: 'subst' },
    ],
  },
  13: {
    en: 'That road is dangerous.',
    pt: 'Aquela estrada é perigosa.',
    newWords: [
      { word: 'road', pt: 'estrada', kind: 'subst' },
    ],
  },
  14: {
    en: "Tomorrow's meeting is very important.",
    pt: 'A reunião de amanhã é muito importante.',
    newWords: [
      { word: 'meeting', pt: 'reunião', kind: 'subst' },
    ],
  },
  15: {
    en: 'The book is really interesting.',
    pt: 'O livro é bem interessante.',
    newWords: [
      { word: 'book', pt: 'livro', kind: 'subst' },
      { word: 'really', pt: 'bem, muito', kind: 'adv' },
    ],
  },
  16: {
    en: 'The movie was so boring.',
    pt: 'O filme foi tão chato.',
    newWords: [
      { word: 'movie', pt: 'filme', kind: 'subst' },
      { word: 'so', pt: 'tão', kind: 'adv' },
    ],
  },
  17: {
    en: 'The test was difficult.',
    pt: 'A prova foi difícil.',
    newWords: [
      { word: 'test', pt: 'prova', kind: 'subst' },
    ],
  },
  18: {
    en: 'He tells funny stories.',
    pt: 'Ele conta histórias engraçadas.',
    newWords: [
      { word: 'tells', pt: 'conta', kind: 'verbo' },
      { word: 'stories', pt: 'histórias', kind: 'subst' },
    ],
  },
  19: {
    en: "She's a smart student.",
    pt: 'Ela é uma aluna inteligente.',
    newWords: [
      { word: 'student', pt: 'aluno, aluna', kind: 'subst' },
    ],
  },
  20: {
    en: 'I feel weak today.',
    pt: 'Estou me sentindo fraco hoje.',
    newWords: [
      { word: 'feel', pt: 'sentir', kind: 'verbo' },
      { word: 'today', pt: 'hoje', kind: 'adv' },
    ],
  },
  21: {
    en: "I'm hungry, let's eat something.",
    pt: 'Estou com fome, vamos comer alguma coisa.',
    newWords: [
      { word: 'eat', pt: 'comer', kind: 'verbo' },
      { word: 'something', pt: 'alguma coisa', kind: 'pron' },
    ],
  },
  22: {
    en: "I'm thirsty after the gym.",
    pt: 'Estou com sede depois da academia.',
    newWords: [
      { word: 'gym', pt: 'academia', kind: 'subst' },
      { word: 'after', pt: 'depois de', kind: 'prep' },
    ],
  },
  23: {
    en: 'Why is she angry with me?',
    pt: 'Por que ela está com raiva de mim?',
    newWords: [
      { word: 'with', pt: 'com', kind: 'prep' },
    ],
  },
  24: {
    en: 'I wake up early every day.',
    pt: 'Eu acordo cedo todo dia.',
    newWords: [
      { word: 'wake up', pt: 'acordar', kind: 'verbo' },
      { word: 'every', pt: 'todo, cada', kind: 'adj' },
    ],
  },
  25: {
    en: "Sorry, I'm late for work.",
    pt: 'Desculpa, estou atrasado pro trabalho.',
    newWords: [
      { word: 'work', pt: 'trabalho', kind: 'subst' },
    ],
  },
};
