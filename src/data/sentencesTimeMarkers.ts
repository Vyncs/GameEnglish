import type { TopicSentence } from './topic';

// Frases faladas do bloco "Marcadores de tempo".
//
// O aluno ouve a frase, lê o sentido em português e repete falando. Quando o
// `example` que o item já trazia servia, ele foi reaproveitado: a frase lida na
// etapa anterior é a mesma que ele repete, o que reforça em vez de apresentar
// material novo.

export const SENTENCES_TIME_MARKERS: Record<number, TopicSentence> = {
  1: {
    en: 'What did you do yesterday?',
    pt: 'O que você fez ontem?',
    newWords: [
      { word: 'did', pt: 'fez (auxiliar de passado)', kind: 'verbo' },
    ],
  },
  2: {
    en: 'She left two hours ago.',
    pt: 'Ela saiu duas horas atrás.',
    newWords: [
      { word: 'left', pt: 'saiu', kind: 'verbo' },
      { word: 'hours', pt: 'horas', kind: 'subst' },
    ],
  },
  3: {
    en: 'Did you sleep well last night?',
    pt: 'Você dormiu bem ontem à noite?',
    newWords: [
      { word: 'sleep', pt: 'dormir', kind: 'verbo' },
      { word: 'well', pt: 'bem', kind: 'adv' },
    ],
  },
  4: {
    en: 'I saw her last week.',
    pt: 'Eu a vi semana passada.',
    newWords: [
      { word: 'saw', pt: 'vi', kind: 'verbo' },
    ],
  },
  5: {
    en: 'They moved last month.',
    pt: 'Eles se mudaram mês passado.',
    newWords: [
      { word: 'moved', pt: 'se mudaram', kind: 'verbo' },
    ],
  },
  6: {
    en: 'Did you travel last year?',
    pt: 'Você viajou ano passado?',
    newWords: [
      { word: 'travel', pt: 'viajar', kind: 'verbo' },
    ],
  },
  7: {
    en: 'Where were you in 2020?',
    pt: 'Onde você estava em 2020?',
    newWords: [
      { word: 'were', pt: 'estava, estavam (passado de are)', kind: 'verbo' },
    ],
  },
  8: {
    en: 'Have you eaten today?',
    pt: 'Você já comeu hoje?',
    newWords: [
      { word: 'eaten', pt: 'comido (particípio)', kind: 'verbo' },
    ],
  },
  9: {
    en: 'Will you be home tonight?',
    pt: 'Você vai estar em casa hoje à noite?',
    newWords: [
      { word: 'home', pt: 'em casa', kind: 'adv' },
    ],
  },
  10: {
    en: 'Has he called this morning?',
    pt: 'Ele ligou hoje de manhã?',
    newWords: [
      { word: 'called', pt: 'ligou, ligado', kind: 'verbo' },
    ],
  },
  11: {
    en: 'What will you do tomorrow?',
    pt: 'O que você vai fazer amanhã?',
    newWords: [
      { word: 'will', pt: 'vai (futuro)', kind: 'verbo' },
    ],
  },
  12: {
    en: "I'll start my new job next week.",
    pt: 'Vou começar meu emprego novo semana que vem.',
    newWords: [
      { word: 'job', pt: 'emprego', kind: 'subst' },
      { word: 'new', pt: 'novo', kind: 'adj' },
    ],
  },
  13: {
    en: 'The course will start next month.',
    pt: 'O curso vai começar mês que vem.',
    newWords: [
      { word: 'course', pt: 'curso', kind: 'subst' },
    ],
  },
  14: {
    en: 'Where will he live next year?',
    pt: 'Onde ele vai morar ano que vem?',
    newWords: [
      { word: 'live', pt: 'morar', kind: 'verbo' },
    ],
  },
  15: {
    en: 'I take the bus every day.',
    pt: 'Eu pego o ônibus todo dia.',
    newWords: [
      { word: 'bus', pt: 'ônibus', kind: 'subst' },
      { word: 'take', pt: 'pegar', kind: 'verbo' },
    ],
  },
  16: {
    en: 'What are you doing now?',
    pt: 'O que você está fazendo agora?',
    newWords: [
      { word: 'doing', pt: 'fazendo', kind: 'verbo' },
    ],
  },
  17: {
    en: 'She is working right now.',
    pt: 'Ela está trabalhando agora mesmo.',
    newWords: [
      { word: 'working', pt: 'trabalhando', kind: 'verbo' },
    ],
  },
  18: {
    en: 'He is busy at the moment.',
    pt: 'Ele está ocupado no momento.',
    newWords: [
      { word: 'busy', pt: 'ocupado', kind: 'adj' },
    ],
  },
  19: {
    en: 'Have you seen her recently?',
    pt: 'Você a viu recentemente?',
    newWords: [
      { word: 'seen', pt: 'visto (particípio)', kind: 'verbo' },
    ],
  },
  20: {
    en: 'I have just arrived.',
    pt: 'Eu acabei de chegar.',
    newWords: [
      { word: 'arrived', pt: 'chegado (particípio)', kind: 'verbo' },
    ],
  },
  21: {
    en: 'I have already finished.',
    pt: 'Eu já terminei.',
    newWords: [
      { word: 'finished', pt: 'terminado (particípio)', kind: 'verbo' },
    ],
  },
  22: {
    en: 'Have you finished your homework yet?',
    pt: 'Você já terminou a lição de casa?',
    newWords: [
      { word: 'homework', pt: 'lição de casa', kind: 'subst' },
    ],
  },
  23: {
    en: 'Have you ever been to Japan?',
    pt: 'Você já foi ao Japão alguma vez?',
    newWords: [
      { word: 'been', pt: 'ido (particípio)', kind: 'verbo' },
      { word: 'Japan', pt: 'Japão', kind: 'subst' },
    ],
  },
  24: {
    en: 'I have lived here since 2004.',
    pt: 'Eu moro aqui desde 2004.',
    newWords: [
      { word: 'here', pt: 'aqui', kind: 'adv' },
    ],
  },
  25: {
    en: 'I have known him for 10 years.',
    pt: 'Eu o conheço há 10 anos.',
    newWords: [
      { word: 'known', pt: 'conhecido (particípio)', kind: 'verbo' },
      { word: 'years', pt: 'anos', kind: 'subst' },
    ],
  },
};
