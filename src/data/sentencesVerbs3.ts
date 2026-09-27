import type { TopicSentence } from './topic';

// Frases faladas do bloco "Verbos 51-75".
//
// O aluno ouve a frase, lê o sentido em português e repete falando. Quando o
// `example` que o item já trazia servia, ele foi reaproveitado: a frase lida na
// etapa anterior é a mesma que ele repete, o que reforça em vez de apresentar
// material novo.

export const SENTENCES_VERBS_3: Record<number, TopicSentence> = {
  51: {
    en: 'I listen to music on the bus.',
    pt: 'Eu escuto música no ônibus.',
    newWords: [
      { word: 'bus', pt: 'ônibus', kind: 'subst' },
    ],
  },
  52: {
    en: 'Where do you live?',
    pt: 'Onde você mora?',
    newWords: [
      { word: 'Where', pt: 'onde', kind: 'adv' },
    ],
  },
  53: {
    en: 'Look at my new shoes.',
    pt: 'Olha meus sapatos novos.',
    newWords: [
      { word: 'shoes', pt: 'sapatos', kind: 'subst' },
    ],
  },
  54: {
    en: "Don't lose your keys.",
    pt: 'Não perca suas chaves.',
    newWords: [
      { word: 'keys', pt: 'chaves', kind: 'subst' },
    ],
  },
  55: {
    en: 'I love coffee in the morning.',
    pt: 'Eu amo café de manhã.',
    newWords: [
      { word: 'morning', pt: 'manhã', kind: 'subst' },
    ],
  },
  56: {
    en: 'I make dinner every night.',
    pt: 'Eu faço o jantar toda noite.',
    newWords: [
      { word: 'dinner', pt: 'jantar', kind: 'subst' },
    ],
  },
  57: {
    en: 'She wants to marry him soon.',
    pt: 'Ela quer casar com ele logo.',
    newWords: [
      { word: 'soon', pt: 'logo, em breve', kind: 'adv' },
    ],
  },
  58: {
    en: 'Nice to meet you.',
    pt: 'Prazer em te conhecer.',
    newWords: [
      { word: 'Nice', pt: 'legal, bom', kind: 'adj' },
    ],
  },
  59: {
    en: 'Why did you miss the last class?',
    pt: 'Por que você faltou na última aula?',
    newWords: [
      { word: 'class', pt: 'aula', kind: 'subst' },
    ],
  },
  60: {
    en: 'Call me if you need some help.',
    pt: 'Me liga se você precisar de ajuda.',
    newWords: [
      { word: 'help', pt: 'ajuda', kind: 'subst' },
    ],
  },
  61: {
    en: 'What time does it open?',
    pt: 'A que horas abre?',
    newWords: [
      { word: 'What time', pt: 'a que horas', kind: 'expr' },
    ],
  },
  62: {
    en: 'Who is going to pay for it?',
    pt: 'Quem vai pagar por isso?',
    newWords: [
      { word: 'Who', pt: 'quem', kind: 'pron' },
    ],
  },
  63: {
    en: "Let's play soccer this afternoon.",
    pt: 'Vamos jogar futebol hoje à tarde.',
    newWords: [
      { word: 'soccer', pt: 'futebol', kind: 'subst' },
      { word: 'afternoon', pt: 'tarde', kind: 'subst' },
    ],
  },
  64: {
    en: 'I prefer the window seat.',
    pt: 'Eu prefiro o assento da janela.',
    newWords: [
      { word: 'seat', pt: 'assento', kind: 'subst' },
    ],
  },
  65: {
    en: 'Put the milk in the fridge.',
    pt: 'Põe o leite na geladeira.',
    newWords: [
      { word: 'fridge', pt: 'geladeira', kind: 'subst' },
    ],
  },
  66: {
    en: 'I read the news on my phone.',
    pt: 'Eu leio as notícias no celular.',
    newWords: [
      { word: 'news', pt: 'notícias', kind: 'subst' },
    ],
  },
  67: {
    en: 'How much did you receive?',
    pt: 'Quanto você recebeu?',
    newWords: [
      { word: 'How much', pt: 'quanto', kind: 'expr' },
    ],
  },
  68: {
    en: "I can't remember his last name.",
    pt: 'Não consigo lembrar o sobrenome dele.',
    newWords: [
      { word: 'last name', pt: 'sobrenome', kind: 'subst' },
    ],
  },
  69: {
    en: 'I run in the park on Sundays.',
    pt: 'Eu corro no parque nos domingos.',
    newWords: [
      { word: 'Sundays', pt: 'domingos', kind: 'subst' },
    ],
  },
  70: {
    en: 'Say that again, please.',
    pt: 'Fala de novo, por favor.',
    newWords: [
      { word: 'again', pt: 'de novo', kind: 'adv' },
    ],
  },
  71: {
    en: 'Can you see my screen?',
    pt: 'Você consegue ver minha tela?',
    newWords: [
      { word: 'screen', pt: 'tela', kind: 'subst' },
    ],
  },
  72: {
    en: 'Do you want to sell your house?',
    pt: 'Você quer vender sua casa?',
    newWords: [
      { word: 'house', pt: 'casa', kind: 'subst' },
    ],
  },
  73: {
    en: 'Send me the file by email.',
    pt: 'Me manda o arquivo por email.',
    newWords: [
      { word: 'file', pt: 'arquivo', kind: 'subst' },
    ],
  },
  74: {
    en: 'Do you sing in the bathroom?',
    pt: 'Você canta no banheiro?',
    newWords: [
      { word: 'bathroom', pt: 'banheiro', kind: 'subst' },
    ],
  },
  75: {
    en: 'Sit here next to me.',
    pt: 'Senta aqui do meu lado.',
    newWords: [
      { word: 'next to', pt: 'ao lado de', kind: 'prep' },
    ],
  },
  155: {
    en: 'I hate waking up early.',
    pt: 'Eu odeio acordar cedo.',
    newWords: [
      { word: 'early', pt: 'cedo', kind: 'adv' },
    ],
  },
};
