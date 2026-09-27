import type { TopicSentence } from './topic';

// Frases faladas do bloco "Clima e tempo".
//
// O aluno ouve a frase, lê o sentido em português e repete falando. Quando o
// `example` que o item já trazia servia, ele foi reaproveitado: a frase lida na
// etapa anterior é a mesma que ele repete, o que reforça em vez de apresentar
// material novo.

export const SENTENCES_WEATHER: Record<number, TopicSentence> = {
  1: {
    en: 'How is the weather today?',
    pt: 'Como está o tempo hoje?',
    newWords: [
      { word: 'today', pt: 'hoje', kind: 'adv' },
    ],
  },
  2: {
    en: 'The sun is shining.',
    pt: 'O sol está brilhando.',
    newWords: [
      { word: 'shining', pt: 'brilhando', kind: 'verbo' },
    ],
  },
  3: {
    en: "It's a sunny Saturday morning.",
    pt: 'É uma manhã ensolarada de sábado.',
    newWords: [
      { word: 'Saturday', pt: 'sábado', kind: 'subst' },
      { word: 'morning', pt: 'manhã', kind: 'subst' },
    ],
  },
  4: {
    en: 'The rain stopped an hour ago.',
    pt: 'A chuva parou uma hora atrás.',
    newWords: [
      { word: 'hour', pt: 'hora', kind: 'subst' },
      { word: 'ago', pt: 'atrás (no tempo)', kind: 'adv' },
    ],
  },
  5: {
    en: 'Traffic is awful on rainy days.',
    pt: 'O trânsito fica horrível em dias chuvosos.',
    newWords: [
      { word: 'Traffic', pt: 'trânsito', kind: 'subst' },
      { word: 'awful', pt: 'horrível', kind: 'adj' },
    ],
  },
  6: {
    en: 'I see a huge cloud over there.',
    pt: 'Estou vendo uma nuvem enorme lá.',
    newWords: [
      { word: 'huge', pt: 'enorme', kind: 'adj' },
      { word: 'over there', pt: 'lá, ali', kind: 'expr' },
    ],
  },
  7: {
    en: "It's cloudy, maybe take your jacket.",
    pt: 'Está nublado, é melhor levar uma jaqueta.',
    newWords: [
      { word: 'maybe', pt: 'talvez', kind: 'adv' },
      { word: 'jacket', pt: 'jaqueta', kind: 'subst' },
    ],
  },
  8: {
    en: 'The wind is really strong.',
    pt: 'O vento está bem forte.',
    newWords: [
      { word: 'really', pt: 'bem, muito', kind: 'adv' },
      { word: 'strong', pt: 'forte', kind: 'adj' },
    ],
  },
  9: {
    en: "It's very windy outside.",
    pt: 'Está ventando muito lá fora.',
    newWords: [
      { word: 'very', pt: 'muito', kind: 'adv' },
      { word: 'outside', pt: 'lá fora', kind: 'adv' },
    ],
  },
  10: {
    en: 'The kids are playing in the snow.',
    pt: 'As crianças estão brincando na neve.',
    newWords: [
      { word: 'kids', pt: 'crianças', kind: 'subst' },
      { word: 'playing', pt: 'brincando', kind: 'verbo' },
    ],
  },
  11: {
    en: 'A storm is coming tonight.',
    pt: 'Uma tempestade está chegando hoje à noite.',
    newWords: [
      { word: 'coming', pt: 'chegando, vindo', kind: 'verbo' },
      { word: 'tonight', pt: 'hoje à noite', kind: 'adv' },
    ],
  },
  12: {
    en: 'I heard thunder last night.',
    pt: 'Ouvi trovões ontem à noite.',
    newWords: [
      { word: 'heard', pt: 'ouvi', kind: 'verbo' },
      { word: 'last night', pt: 'ontem à noite', kind: 'expr' },
    ],
  },
  13: {
    en: 'Lightning struck the tree.',
    pt: 'Um raio atingiu a árvore.',
    newWords: [
      { word: 'struck', pt: 'atingiu', kind: 'verbo' },
      { word: 'tree', pt: 'árvore', kind: 'subst' },
    ],
  },
  14: {
    en: "I can't drive in this fog.",
    pt: 'Não consigo dirigir nessa neblina.',
    newWords: [
      { word: 'drive', pt: 'dirigir', kind: 'verbo' },
    ],
  },
  15: {
    en: 'The sky is blue and clear.',
    pt: 'O céu está azul e limpo.',
    newWords: [
      { word: 'blue', pt: 'azul', kind: 'adj' },
      { word: 'clear', pt: 'limpo, claro', kind: 'adj' },
    ],
  },
  16: {
    en: 'My shoes are wet.',
    pt: 'Meus sapatos estão molhados.',
    newWords: [
      { word: 'shoes', pt: 'sapatos', kind: 'subst' },
    ],
  },
  17: {
    en: 'My clothes are not dry yet.',
    pt: 'Minhas roupas ainda não estão secas.',
    newWords: [
      { word: 'clothes', pt: 'roupas', kind: 'subst' },
      { word: 'yet', pt: 'ainda', kind: 'adv' },
    ],
  },
  18: {
    en: 'I want something warm to drink.',
    pt: 'Quero algo quente para beber.',
    newWords: [
      { word: 'something', pt: 'algo, alguma coisa', kind: 'pron' },
      { word: 'drink', pt: 'beber', kind: 'verbo' },
    ],
  },
  19: {
    en: 'The evening is cool and quiet.',
    pt: 'A noitinha está fresca e tranquila.',
    newWords: [
      { word: 'evening', pt: 'noitinha, fim do dia', kind: 'subst' },
      { word: 'quiet', pt: 'silencioso, tranquilo', kind: 'adj' },
    ],
  },
  20: {
    en: "Take an umbrella, it's raining.",
    pt: 'Leve um guarda-chuva, está chovendo.',
    newWords: [
      { word: 'Take', pt: 'levar, pegar', kind: 'verbo' },
    ],
  },
  21: {
    en: 'The temperature is thirty degrees.',
    pt: 'A temperatura está em trinta graus.',
    newWords: [
      { word: 'degrees', pt: 'graus', kind: 'subst' },
    ],
  },
  22: {
    en: 'The forecast says rain tomorrow.',
    pt: 'A previsão diz que vai chover amanhã.',
    newWords: [
      { word: 'says', pt: 'diz', kind: 'verbo' },
      { word: 'tomorrow', pt: 'amanhã', kind: 'adv' },
    ],
  },
  23: {
    en: 'I love summer at the beach.',
    pt: 'Eu amo o verão na praia.',
    newWords: [
      { word: 'love', pt: 'amar, adorar', kind: 'verbo' },
      { word: 'beach', pt: 'praia', kind: 'subst' },
    ],
  },
  24: {
    en: 'Winter is long and cold here.',
    pt: 'O inverno aqui é longo e frio.',
    newWords: [
      { word: 'long', pt: 'longo, comprido', kind: 'adj' },
      { word: 'cold', pt: 'frio', kind: 'adj' },
    ],
  },
  25: {
    en: 'Autumn is my favorite season.',
    pt: 'O outono é minha estação favorita.',
    newWords: [
      { word: 'favorite', pt: 'favorito', kind: 'adj' },
      { word: 'season', pt: 'estação (do ano)', kind: 'subst' },
    ],
  },
};
