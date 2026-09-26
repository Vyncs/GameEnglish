import type { TopicSentence } from './topic';

// Frases faladas do bloco "Casa e móveis".
// Reaproveitam o `example` de cada item: a frase lida na etapa anterior é a
// mesma que o aluno repete falando.

export const SENTENCES_HOME: Record<number, TopicSentence> = {
  1: {
    en: 'They bought a new house.',
    pt: 'Eles compraram uma casa nova.',
    newWords: [{ word: 'new', pt: 'novo', kind: 'adj' }],
  },
  2: {
    en: 'I am going home.',
    pt: 'Eu estou indo para casa.',
    newWords: [{ word: 'going', pt: 'indo', kind: 'verbo' }],
  },
  3: {
    en: 'She lives in a small apartment.',
    pt: 'Ela mora num apartamento pequeno.',
    newWords: [
      { word: 'small', pt: 'pequeno', kind: 'adj' },
      { word: 'in', pt: 'em (dentro de)', kind: 'prep' },
    ],
  },
  4: {
    en: 'This room is very big.',
    pt: 'Este cômodo é muito grande.',
    newWords: [{ word: 'big', pt: 'grande', kind: 'adj' }],
  },
  5: {
    en: 'The house has three bedrooms.',
    pt: 'A casa tem três quartos.',
    newWords: [{ word: 'three', pt: 'três', kind: 'adj' }],
  },
  6: {
    en: 'He is cooking in the kitchen.',
    pt: 'Ele está cozinhando na cozinha.',
    newWords: [{ word: 'cooking', pt: 'cozinhando', kind: 'verbo' }],
  },
  7: {
    en: 'Where is the bathroom?',
    pt: 'Onde fica o banheiro?',
    newWords: [{ word: 'where', pt: 'onde', kind: 'pron' }],
  },
  8: {
    en: 'We watch TV in the living room.',
    pt: 'Nós assistimos TV na sala.',
    newWords: [{ word: 'watch', pt: 'assistir', kind: 'verbo' }],
  },
  9: {
    en: 'I live on the third floor.',
    pt: 'Eu moro no terceiro andar.',
    newWords: [{ word: 'third', pt: 'terceiro', kind: 'adj' }],
  },
  10: {
    en: 'The picture is on the wall.',
    pt: 'O quadro está na parede.',
    newWords: [{ word: 'picture', pt: 'quadro, foto', kind: 'subst' }],
  },
  11: {
    en: 'Please close the door.',
    pt: 'Por favor, feche a porta.',
    newWords: [{ word: 'close', pt: 'fechar', kind: 'verbo' }],
  },
  12: {
    en: 'Open the window, please.',
    pt: 'Abra a janela, por favor.',
    newWords: [{ word: 'open', pt: 'abrir', kind: 'verbo' }],
  },
  13: {
    en: 'I lost my keys.',
    pt: 'Eu perdi minhas chaves.',
    newWords: [{ word: 'lost', pt: 'perdi (passado de lose)', kind: 'verbo' }],
  },
  14: {
    en: 'Put it on the table.',
    pt: 'Coloque isso na mesa.',
    newWords: [{ word: 'put', pt: 'colocar', kind: 'verbo' }],
  },
  15: {
    en: 'Take a chair.',
    pt: 'Pegue uma cadeira.',
    newWords: [{ word: 'take', pt: 'pegar', kind: 'verbo' }],
  },
  16: {
    en: 'I go to bed at eleven.',
    pt: 'Eu vou dormir às onze.',
    newWords: [{ word: 'eleven', pt: 'onze', kind: 'adj' }],
  },
  17: {
    en: 'The milk is in the fridge.',
    pt: 'O leite está na geladeira.',
    newWords: [{ word: 'milk', pt: 'leite', kind: 'subst' }],
  },
  18: {
    en: 'Turn off the stove.',
    pt: 'Desligue o fogão.',
    newWords: [{ word: 'turn off', pt: 'desligar', kind: 'expr' }],
  },
  19: {
    en: 'The dishes are in the sink.',
    pt: 'A louça está na pia.',
    newWords: [{ word: 'dishes', pt: 'louça, pratos', kind: 'subst' }],
  },
  20: {
    en: 'I need a clean towel.',
    pt: 'Eu preciso de uma toalha limpa.',
    newWords: [{ word: 'need', pt: 'precisar', kind: 'verbo' }],
  },
  21: {
    en: 'The kitchen is clean.',
    pt: 'A cozinha está limpa.',
    newWords: [{ word: 'is', pt: 'está (be)', kind: 'verbo' }],
  },
  22: {
    en: 'My shoes are dirty.',
    pt: 'Meus sapatos estão sujos.',
    newWords: [{ word: 'shoes', pt: 'sapatos', kind: 'subst' }],
  },
  23: {
    en: 'Take out the garbage.',
    pt: 'Leve o lixo para fora.',
    newWords: [{ word: 'take out', pt: 'levar para fora', kind: 'expr' }],
  },
  24: {
    en: 'My neighbor is very nice.',
    pt: 'Meu vizinho é muito gentil.',
    newWords: [{ word: 'nice', pt: 'gentil, legal', kind: 'adj' }],
  },
  25: {
    en: 'The rent is too high.',
    pt: 'O aluguel está caro demais.',
    newWords: [
      { word: 'too', pt: 'demais', kind: 'adv' },
      { word: 'high', pt: 'alto', kind: 'adj' },
    ],
  },
};
