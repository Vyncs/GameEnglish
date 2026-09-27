import type { TopicSentence } from './topic';

// Frases faladas do bloco "Viagem e transporte".
// Reaproveitam o `example` de cada item: a frase lida na etapa anterior é a
// mesma que o aluno repete falando.

export const SENTENCES_TRAVEL: Record<number, TopicSentence> = {
  1: {
    en: 'We took a trip to Chile.',
    pt: 'Nós fizemos uma viagem ao Chile.',
    newWords: [{ word: 'took', pt: 'fizemos (passado de take)', kind: 'verbo' }],
  },
  2: {
    en: 'I travel for work.',
    pt: 'Eu viajo a trabalho.',
    newWords: [{ word: 'for', pt: 'a, por (motivo)', kind: 'prep' }],
  },
  3: {
    en: 'My flight is at six.',
    pt: 'Meu voo é às seis.',
    newWords: [{ word: 'at', pt: 'às (horário)', kind: 'prep' }],
  },
  4: {
    en: 'I will meet you at the airport.',
    pt: 'Eu te encontro no aeroporto.',
    newWords: [{ word: 'meet', pt: 'encontrar', kind: 'verbo' }],
  },
  5: {
    en: 'I bought two tickets.',
    pt: 'Eu comprei duas passagens.',
    newWords: [{ word: 'bought', pt: 'comprei (passado de buy)', kind: 'verbo' }],
  },
  6: {
    en: 'Where is my luggage?',
    pt: 'Onde está minha bagagem?',
    newWords: [{ word: 'where', pt: 'onde', kind: 'pron' }],
  },
  7: {
    en: 'My suitcase is heavy.',
    pt: 'Minha mala está pesada.',
    newWords: [{ word: 'heavy', pt: 'pesado', kind: 'adj' }],
  },
  8: {
    en: 'Show me your passport, please.',
    pt: 'Me mostre seu passaporte, por favor.',
    newWords: [{ word: 'show', pt: 'mostrar', kind: 'verbo' }],
  },
  9: {
    en: 'We stayed at a nice hotel.',
    pt: 'Nós ficamos num hotel bom.',
    newWords: [{ word: 'stayed', pt: 'ficamos (hospedados)', kind: 'verbo' }],
  },
  10: {
    en: 'I booked a room for two nights.',
    pt: 'Eu reservei um quarto por duas noites.',
    newWords: [{ word: 'nights', pt: 'noites', kind: 'subst' }],
  },
  11: {
    en: 'We check in at three.',
    pt: 'Nós fazemos check-in às três.',
    newWords: [{ word: 'three', pt: 'três', kind: 'adj' }],
  },
  12: {
    en: 'She lives abroad.',
    pt: 'Ela mora no exterior.',
    newWords: [{ word: 'lives', pt: 'mora', kind: 'verbo' }],
  },
  13: {
    en: 'There was a long delay.',
    pt: 'Houve um atraso longo.',
    newWords: [
      { word: 'there was', pt: 'houve', kind: 'expr' },
      { word: 'long', pt: 'longo', kind: 'adj' },
    ],
  },
  14: {
    en: 'We arrived at midnight.',
    pt: 'Nós chegamos à meia-noite.',
    newWords: [{ word: 'midnight', pt: 'meia-noite', kind: 'subst' }],
  },
  15: {
    en: 'The bus leaves at eight.',
    pt: 'O ônibus sai às oito.',
    newWords: [{ word: 'eight', pt: 'oito', kind: 'adj' }],
  },
  16: {
    en: 'I take the train every day.',
    pt: 'Eu pego o trem todo dia.',
    newWords: [{ word: 'take', pt: 'pegar (transporte)', kind: 'verbo' }],
  },
  17: {
    en: 'The bus is late.',
    pt: 'O ônibus está atrasado.',
    newWords: [{ word: 'late', pt: 'atrasado', kind: 'adj' }],
  },
  18: {
    en: 'The subway is faster.',
    pt: 'O metrô é mais rápido.',
    newWords: [{ word: 'faster', pt: 'mais rápido', kind: 'adj' }],
  },
  19: {
    en: 'I drive to work.',
    pt: 'Eu dirijo para o trabalho.',
    newWords: [{ word: 'to', pt: 'para (direção)', kind: 'prep' }],
  },
  20: {
    en: 'The road is closed.',
    pt: 'A estrada está fechada.',
    newWords: [{ word: 'closed', pt: 'fechada', kind: 'adj' }],
  },
  21: {
    en: 'Look at the map.',
    pt: 'Olhe o mapa.',
    newWords: [{ word: 'look at', pt: 'olhar para', kind: 'expr' }],
  },
  22: {
    en: 'Is it far from here?',
    pt: 'É longe daqui?',
    newWords: [{ word: 'from', pt: 'de (origem)', kind: 'prep' }],
  },
  23: {
    en: 'The bank is near my house.',
    pt: 'O banco fica perto da minha casa.',
    newWords: [{ word: 'bank', pt: 'banco', kind: 'subst' }],
  },
  24: {
    en: 'I think we are lost.',
    pt: 'Eu acho que estamos perdidos.',
    newWords: [{ word: 'think', pt: 'achar, pensar', kind: 'verbo' }],
  },
  25: {
    en: 'We went to the beach.',
    pt: 'Nós fomos à praia.',
    newWords: [{ word: 'went', pt: 'fomos (passado de go)', kind: 'verbo' }],
  },
};
