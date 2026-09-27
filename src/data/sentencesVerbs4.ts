import type { TopicSentence } from './topic';

// Frases faladas do bloco "Verbos 76-100".
//
// O aluno ouve a frase, lê o sentido em português e repete falando. Quando o
// `example` que o item já trazia servia, ele foi reaproveitado: a frase lida na
// etapa anterior é a mesma que ele repete, o que reforça em vez de apresentar
// material novo.

export const SENTENCES_VERBS_4: Record<number, TopicSentence> = {
  76: {
    en: 'Did you sleep well last night?',
    pt: 'Você dormiu bem ontem à noite?',
    newWords: [
      { word: 'well', pt: 'bem', kind: 'adv' },
    ],
  },
  77: {
    en: 'Do you speak English?',
    pt: 'Você fala inglês?',
    newWords: [
      { word: 'English', pt: 'inglês', kind: 'subst' },
    ],
  },
  78: {
    en: 'How do you spell your name?',
    pt: 'Como se soletra seu nome?',
    newWords: [
      { word: 'name', pt: 'nome', kind: 'subst' },
    ],
  },
  79: {
    en: 'How much can you spend?',
    pt: 'Quanto você pode gastar?',
    newWords: [
      { word: 'how much', pt: 'quanto', kind: 'expr' },
    ],
  },
  80: {
    en: 'What time did the show start?',
    pt: 'A que horas o show começou?',
    newWords: [
      { word: 'show', pt: 'show, espetáculo', kind: 'subst' },
    ],
  },
  81: {
    en: 'I want to stay home tonight.',
    pt: 'Quero ficar em casa hoje à noite.',
    newWords: [
      { word: 'tonight', pt: 'hoje à noite', kind: 'adv' },
    ],
  },
  82: {
    en: "Why didn't you stop them?",
    pt: 'Por que você não parou eles?',
    newWords: [
      { word: 'them', pt: 'eles, elas', kind: 'pron' },
    ],
  },
  83: {
    en: 'When did you study there?',
    pt: 'Quando você estudou lá?',
    newWords: [
      { word: 'there', pt: 'lá, ali', kind: 'adv' },
    ],
  },
  84: {
    en: "Let's take the next bus!",
    pt: 'Vamos pegar o próximo ônibus!',
    newWords: [
      { word: 'next', pt: 'próximo', kind: 'adj' },
      { word: 'bus', pt: 'ônibus', kind: 'subst' },
    ],
  },
  85: {
    en: 'I need to talk to my boss.',
    pt: 'Preciso falar com meu chefe.',
    newWords: [
      { word: 'boss', pt: 'chefe', kind: 'subst' },
    ],
  },
  86: {
    en: "Why don't you tell your mother?",
    pt: 'Por que você não conta pra sua mãe?',
    newWords: [
      { word: 'mother', pt: 'mãe', kind: 'subst' },
    ],
  },
  87: {
    en: 'There is no milk in the fridge.',
    pt: 'Não tem leite na geladeira.',
    newWords: [
      { word: 'milk', pt: 'leite', kind: 'subst' },
      { word: 'fridge', pt: 'geladeira', kind: 'subst' },
    ],
  },
  88: {
    en: 'What do you think about it?',
    pt: 'O que você acha disso?',
    newWords: [
      { word: 'about', pt: 'sobre, a respeito de', kind: 'prep' },
    ],
  },
  89: {
    en: 'Did you travel last year?',
    pt: 'Você viajou ano passado?',
    newWords: [
      { word: 'last year', pt: 'ano passado', kind: 'expr' },
    ],
  },
  90: {
    en: 'Turn right after the bakery.',
    pt: 'Vire à direita depois da padaria.',
    newWords: [
      { word: 'right', pt: 'à direita', kind: 'adv' },
      { word: 'bakery', pt: 'padaria', kind: 'subst' },
    ],
  },
  91: {
    en: "Sorry, I don't understand your question.",
    pt: 'Desculpa, não entendi sua pergunta.',
    newWords: [
      { word: 'sorry', pt: 'desculpa', kind: 'expr' },
      { word: 'question', pt: 'pergunta', kind: 'subst' },
    ],
  },
  92: {
    en: 'Would you like to visit her today?',
    pt: 'Você gostaria de visitar ela hoje?',
    newWords: [
      { word: 'today', pt: 'hoje', kind: 'adv' },
      { word: 'her', pt: 'ela, dela', kind: 'pron' },
    ],
  },
  93: {
    en: 'Wait a moment, please.',
    pt: 'Espera um momento, por favor.',
    newWords: [
      { word: 'moment', pt: 'momento', kind: 'subst' },
      { word: 'please', pt: 'por favor', kind: 'expr' },
    ],
  },
  94: {
    en: 'What time did you wake up?',
    pt: 'Que horas você acordou?',
    newWords: [
      { word: 'what time', pt: 'a que horas', kind: 'expr' },
    ],
  },
  95: {
    en: 'You need to walk daily.',
    pt: 'Você precisa caminhar todos os dias.',
    newWords: [
      { word: 'need', pt: 'precisar', kind: 'verbo' },
      { word: 'daily', pt: 'diariamente', kind: 'adv' },
    ],
  },
  96: {
    en: "I don't want it anymore.",
    pt: 'Eu não quero mais isso.',
    newWords: [
      { word: 'anymore', pt: 'mais (não mais)', kind: 'adv' },
    ],
  },
  97: {
    en: 'Wash your hands before eating.',
    pt: 'Lave as mãos antes de comer.',
    newWords: [
      { word: 'hands', pt: 'mãos', kind: 'subst' },
      { word: 'before', pt: 'antes de', kind: 'prep' },
    ],
  },
  98: {
    en: 'Did you watch TV last night?',
    pt: 'Você assistiu TV ontem à noite?',
    newWords: [
      { word: 'TV', pt: 'televisão', kind: 'subst' },
    ],
  },
  99: {
    en: 'I work from home on Fridays.',
    pt: 'Eu trabalho de casa nas sextas.',
    newWords: [
      { word: 'home', pt: 'casa', kind: 'subst' },
      { word: 'Fridays', pt: 'sextas-feiras', kind: 'subst' },
    ],
  },
  100: {
    en: 'Do you prefer to write or to read?',
    pt: 'Você prefere escrever ou ler?',
    newWords: [
      { word: 'prefer', pt: 'preferir', kind: 'verbo' },
      { word: 'read', pt: 'ler', kind: 'verbo' },
    ],
  },
};
