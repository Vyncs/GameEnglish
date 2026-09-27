import type { TopicSentence } from './topic';

// Frases faladas do bloco "Verbos 26-50".
//
// O aluno ouve a frase, lê o sentido em português e repete falando. Quando o
// `example` que o item já trazia servia, ele foi reaproveitado: a frase lida na
// etapa anterior é a mesma que ele repete, o que reforça em vez de apresentar
// material novo.

export const SENTENCES_VERBS_2: Record<number, TopicSentence> = {
  26: {
    en: "Be careful, don't fall down the stairs.",
    pt: 'Cuidado, não cai da escada.',
    newWords: [
      { word: 'careful', pt: 'cuidadoso', kind: 'adj' },
      { word: 'stairs', pt: 'escada', kind: 'subst' },
    ],
  },
  27: {
    en: 'Do you feel cold at night?',
    pt: 'Você sente frio de noite?',
    newWords: [
      { word: 'cold', pt: 'frio', kind: 'adj' },
      { word: 'night', pt: 'noite', kind: 'subst' },
    ],
  },
  28: {
    en: 'I need to find a better job!',
    pt: 'Eu preciso achar um emprego melhor!',
    newWords: [
      { word: 'better', pt: 'melhor', kind: 'adj' },
      { word: 'job', pt: 'emprego', kind: 'subst' },
    ],
  },
  29: {
    en: "Let's finish this report before lunch.",
    pt: 'Vamos terminar esse relatório antes do almoço.',
    newWords: [
      { word: 'report', pt: 'relatório', kind: 'subst' },
      { word: 'lunch', pt: 'almoço', kind: 'subst' },
    ],
  },
  30: {
    en: 'We fly to Recife next Friday.',
    pt: 'A gente voa pro Recife sexta que vem.',
    newWords: [
      { word: 'next', pt: 'que vem', kind: 'adj' },
      { word: 'Friday', pt: 'sexta-feira', kind: 'subst' },
    ],
  },
  31: {
    en: 'Follow me to the bus stop.',
    pt: 'Me siga até a parada de ônibus.',
    newWords: [
      { word: 'bus', pt: 'ônibus', kind: 'subst' },
      { word: 'stop', pt: 'parada', kind: 'subst' },
    ],
  },
  32: {
    en: 'I will never forget that.',
    pt: 'Eu nunca vou esquecer isso.',
    newWords: [
      { word: 'never', pt: 'nunca', kind: 'adv' },
    ],
  },
  33: {
    en: 'Did you get my message?',
    pt: 'Você recebeu minha mensagem?',
    newWords: [
      { word: 'message', pt: 'mensagem', kind: 'subst' },
    ],
  },
  34: {
    en: 'What time do you usually get up?',
    pt: 'Que hora você costuma levantar?',
    newWords: [
      { word: 'usually', pt: 'normalmente', kind: 'adv' },
      { word: 'time', pt: 'hora', kind: 'subst' },
    ],
  },
  35: {
    en: 'Give me your phone number, please.',
    pt: 'Me dá seu número de telefone, por favor.',
    newWords: [
      { word: 'phone', pt: 'telefone', kind: 'subst' },
      { word: 'number', pt: 'número', kind: 'subst' },
    ],
  },
  36: {
    en: 'Where do you want to go tonight?',
    pt: 'Onde você quer ir hoje à noite?',
    newWords: [
      { word: 'tonight', pt: 'hoje à noite', kind: 'adv' },
    ],
  },
  37: {
    en: 'My kids grow up so fast.',
    pt: 'Meus filhos crescem tão rápido.',
    newWords: [
      { word: 'kids', pt: 'filhos, crianças', kind: 'subst' },
      { word: 'fast', pt: 'rápido', kind: 'adv' },
    ],
  },
  38: {
    en: 'I have two brothers at home.',
    pt: 'Eu tenho dois irmãos em casa.',
    newWords: [
      { word: 'brothers', pt: 'irmãos', kind: 'subst' },
      { word: 'home', pt: 'casa', kind: 'subst' },
    ],
  },
  39: {
    en: "I can't hear the TV well.",
    pt: 'Eu não escuto bem a TV.',
    newWords: [
      { word: 'well', pt: 'bem', kind: 'adv' },
      { word: 'TV', pt: 'televisão', kind: 'subst' },
    ],
  },
  40: {
    en: 'Can you help me with this?',
    pt: 'Você pode me ajudar com isso?',
    newWords: [
      { word: 'with', pt: 'com', kind: 'prep' },
      { word: 'this', pt: 'isso', kind: 'pron' },
    ],
  },
  41: {
    en: "I hope it doesn't rain today.",
    pt: 'Espero que não chova hoje.',
    newWords: [
      { word: 'rain', pt: 'chover', kind: 'verbo' },
      { word: 'today', pt: 'hoje', kind: 'adv' },
    ],
  },
  42: {
    en: "Don't jump on the bed!",
    pt: 'Não pula na cama!',
    newWords: [
      { word: 'bed', pt: 'cama', kind: 'subst' },
      { word: 'on', pt: 'em cima de', kind: 'prep' },
    ],
  },
  43: {
    en: 'Keep the change, thank you.',
    pt: 'Fica com o troco, obrigado.',
    newWords: [
      { word: 'change', pt: 'troco', kind: 'subst' },
    ],
  },
  44: {
    en: "Let's just kiss and say goodbye.",
    pt: 'Vamos só nos beijar e dar tchau.',
    newWords: [
      { word: 'say goodbye', pt: 'dar tchau, se despedir', kind: 'expr' },
      { word: 'just', pt: 'só, apenas', kind: 'adv' },
    ],
  },
  45: {
    en: "I don't know his name.",
    pt: 'Eu não sei o nome dele.',
    newWords: [
      { word: 'name', pt: 'nome', kind: 'subst' },
      { word: 'his', pt: 'dele', kind: 'pron' },
    ],
  },
  46: {
    en: 'I learn new words every day.',
    pt: 'Eu aprendo palavras novas todo dia.',
    newWords: [
      { word: 'words', pt: 'palavras', kind: 'subst' },
      { word: 'every day', pt: 'todo dia', kind: 'expr' },
    ],
  },
  47: {
    en: "Don't leave me alone!",
    pt: 'Não me deixa sozinho!',
    newWords: [
      { word: 'alone', pt: 'sozinho', kind: 'adj' },
    ],
  },
  48: {
    en: 'Can you lend me some money?',
    pt: 'Você pode me emprestar um dinheiro?',
    newWords: [
      { word: 'money', pt: 'dinheiro', kind: 'subst' },
      { word: 'some', pt: 'um pouco de', kind: 'adj' },
    ],
  },
  49: {
    en: 'Let me try again.',
    pt: 'Deixa eu tentar de novo.',
    newWords: [
      { word: 'try', pt: 'tentar', kind: 'verbo' },
      { word: 'again', pt: 'de novo', kind: 'adv' },
    ],
  },
  50: {
    en: 'Do you like your work here?',
    pt: 'Você gosta do seu trabalho aqui?',
    newWords: [
      { word: 'work', pt: 'trabalho', kind: 'subst' },
      { word: 'here', pt: 'aqui', kind: 'adv' },
    ],
  },
};
