import type { TopicSentence } from './topic';

// Frases faladas do bloco "Trabalho e escritório".
// Reaproveitam o `example` de cada item: a frase lida na etapa anterior é a
// mesma que o aluno repete falando.

export const SENTENCES_WORK: Record<number, TopicSentence> = {
  1: {
    en: 'She got a new job.',
    pt: 'Ela conseguiu um emprego novo.',
    newWords: [{ word: 'got', pt: 'conseguiu (passado de get)', kind: 'verbo' }],
  },
  2: {
    en: 'I have a lot of work today.',
    pt: 'Eu tenho muito trabalho hoje.',
    newWords: [{ word: 'a lot of', pt: 'muito', kind: 'expr' }],
  },
  3: {
    en: 'My boss is on vacation.',
    pt: 'Meu chefe está de férias.',
    newWords: [{ word: 'vacation', pt: 'férias', kind: 'subst' }],
  },
  4: {
    en: 'The company has fifty employees.',
    pt: 'A empresa tem cinquenta funcionários.',
    newWords: [{ word: 'fifty', pt: 'cinquenta', kind: 'adj' }],
  },
  5: {
    en: 'He works for a big company.',
    pt: 'Ele trabalha para uma empresa grande.',
    newWords: [{ word: 'for', pt: 'para (empregador)', kind: 'prep' }],
  },
  6: {
    en: 'I am at the office.',
    pt: 'Eu estou no escritório.',
    newWords: [{ word: 'at', pt: 'em (lugar exato)', kind: 'prep' }],
  },
  7: {
    en: 'The meeting starts at ten.',
    pt: 'A reunião começa às dez.',
    newWords: [{ word: 'starts', pt: 'começa', kind: 'verbo' }],
  },
  8: {
    en: 'We work as a team.',
    pt: 'Nós trabalhamos em equipe.',
    newWords: [{ word: 'as', pt: 'como, em (função)', kind: 'prep' }],
  },
  9: {
    en: 'The salary is good.',
    pt: 'O salário é bom.',
    newWords: [{ word: 'good', pt: 'bom', kind: 'adj' }],
  },
  10: {
    en: 'They hired three people.',
    pt: 'Eles contrataram três pessoas.',
    newWords: [{ word: 'people', pt: 'pessoas', kind: 'subst' }],
  },
  11: {
    en: 'He was fired last month.',
    pt: 'Ele foi demitido mês passado.',
    newWords: [{ word: 'last month', pt: 'mês passado', kind: 'expr' }],
  },
  12: {
    en: 'She quit her job.',
    pt: 'Ela pediu demissão.',
    newWords: [{ word: 'her', pt: 'dela', kind: 'pron' }],
  },
  13: {
    en: 'I applied for the job.',
    pt: 'Eu me candidatei à vaga.',
    newWords: [{ word: 'for', pt: 'para, a (preso a apply)', kind: 'prep' }],
  },
  14: {
    en: 'I have an interview tomorrow.',
    pt: 'Eu tenho uma entrevista amanhã.',
    newWords: [{ word: 'tomorrow', pt: 'amanhã', kind: 'adv' }],
  },
  15: {
    en: 'Send me your resume.',
    pt: 'Me mande seu currículo.',
    newWords: [{ word: 'send', pt: 'enviar', kind: 'verbo' }],
  },
  16: {
    en: 'He has good communication skills.',
    pt: 'Ele tem boa comunicação.',
    newWords: [{ word: 'communication', pt: 'comunicação', kind: 'subst' }],
  },
  17: {
    en: 'I finished all my tasks.',
    pt: 'Eu terminei todas as minhas tarefas.',
    newWords: [{ word: 'all', pt: 'todas', kind: 'adj' }],
  },
  18: {
    en: 'We started a new project.',
    pt: 'Nós começamos um projeto novo.',
    newWords: [{ word: 'started', pt: 'começamos', kind: 'verbo' }],
  },
  19: {
    en: 'I sent the report yesterday.',
    pt: 'Eu enviei o relatório ontem.',
    newWords: [{ word: 'yesterday', pt: 'ontem', kind: 'adv' }],
  },
  20: {
    en: 'The client is waiting.',
    pt: 'O cliente está esperando.',
    newWords: [{ word: 'waiting', pt: 'esperando', kind: 'verbo' }],
  },
  21: {
    en: 'I am busy right now.',
    pt: 'Eu estou ocupado agora.',
    newWords: [{ word: 'right now', pt: 'agora mesmo', kind: 'expr' }],
  },
  22: {
    en: 'She asked for a raise.',
    pt: 'Ela pediu um aumento.',
    newWords: [{ word: 'asked', pt: 'pediu', kind: 'verbo' }],
  },
  23: {
    en: 'I worked overtime last week.',
    pt: 'Eu fiz hora extra semana passada.',
    newWords: [{ word: 'last week', pt: 'semana passada', kind: 'expr' }],
  },
  24: {
    en: 'My schedule is full.',
    pt: 'Minha agenda está cheia.',
    newWords: [{ word: 'full', pt: 'cheio', kind: 'adj' }],
  },
  25: {
    en: 'The deadline is Friday.',
    pt: 'O prazo é sexta-feira.',
    newWords: [{ word: 'Friday', pt: 'sexta-feira', kind: 'subst' }],
  },
};
