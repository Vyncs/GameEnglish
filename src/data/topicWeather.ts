import type { Topic } from './topic';

// Tópico: 25 palavras de clima e tempo, incluindo as 4 estações.
// Sem passado/particípio → não usa a etapa "Formas".

export const TOPIC_WEATHER: Topic = {
  id: 'weather-01-25',
  title: 'Clima e tempo',
  subtitle: 'weather → autumn · 25 palavras',
  emoji: '🌤️',
  category: 'outros',
  level: 1,
  stages: ['study', 'meaning'],
  items: [
    { id: 1, base: 'weather', pt: 'tempo (clima)', example: 'How is the weather today?', tip: 'Pegadinha clássica: weather = tempo do clima. "Time" = tempo de relógio.' },
    { id: 2, base: 'sun', pt: 'sol', example: 'The sun is shining.', tip: 'Substantivo. O adjetivo é "sunny".' },
    { id: 3, base: 'sunny', pt: 'ensolarado', example: 'It is sunny today.', tip: 'sun + ny. O mesmo padrão vale para rain→rainy, wind→windy, cloud→cloudy.' },
    { id: 4, base: 'rain', pt: 'chuva; chover', example: 'The rain stopped.', tip: 'Serve como substantivo e verbo: "It rains a lot here."' },
    { id: 5, base: 'rainy', pt: 'chuvoso', example: 'It was a rainy day.', tip: 'rain + y.' },
    { id: 6, base: 'cloud', pt: 'nuvem', example: 'There is not a cloud in the sky.', tip: 'Adjetivo: cloudy.' },
    { id: 7, base: 'cloudy', pt: 'nublado', example: 'The sky is cloudy.', tip: 'cloud + y.' },
    { id: 8, base: 'wind', pt: 'vento', example: 'The wind is strong today.', tip: 'Pronuncia-se "uind". Adjetivo: windy.' },
    { id: 9, base: 'windy', pt: 'ventoso', example: 'It is very windy outside.', tip: 'wind + y.' },
    { id: 10, base: 'snow', pt: 'neve; nevar', example: 'The snow is falling.', tip: 'Também é verbo: "It snows in winter."' },
    { id: 11, base: 'storm', pt: 'tempestade', example: 'A storm is coming.', tip: 'Adjetivo: stormy.' },
    { id: 12, base: 'thunder', pt: 'trovão', example: 'I heard thunder last night.', tip: 'É o som. O clarão é "lightning".' },
    { id: 13, base: 'lightning', pt: 'relâmpago, raio', example: 'Lightning struck the tree.', tip: 'Não confunda com "lighting" (iluminação).' },
    { id: 14, base: 'fog', pt: 'neblina, nevoeiro', example: 'The fog is thick this morning.', tip: 'Adjetivo: foggy.' },
    { id: 15, base: 'sky', pt: 'céu', example: 'The sky is blue.', tip: 'Plural: skies.' },
    { id: 16, base: 'wet', pt: 'molhado', example: 'My shoes are wet.', tip: 'Oposto de dry.' },
    { id: 17, base: 'dry', pt: 'seco', example: 'The weather is dry here.', tip: 'Oposto de wet. Como verbo: secar.' },
    { id: 18, base: 'warm', pt: 'morno, quente agradável', example: 'It is warm today.', tip: 'warm é o quente gostoso; "hot" é quente demais.' },
    { id: 19, base: 'cool', pt: 'fresco', example: 'The evening is cool.', tip: 'Também significa "legal" na gíria.' },
    { id: 20, base: 'umbrella', pt: 'guarda-chuva', example: 'Take an umbrella, it is raining.', tip: 'Pronuncia-se "âm-BRÉ-la".' },
    { id: 21, base: 'temperature', pt: 'temperatura', example: 'The temperature is 30 degrees.', tip: 'Graus = degrees.' },
    { id: 22, base: 'forecast', pt: 'previsão do tempo', example: 'The forecast says rain tomorrow.', tip: 'fore (antes) + cast (lançar) = previsão.' },
    { id: 23, base: 'summer', pt: 'verão', example: 'I love summer.', tip: 'As estações não levam artigo: "in summer".' },
    { id: 24, base: 'winter', pt: 'inverno', example: 'Winter is very cold here.', tip: 'Oposto de summer.' },
    { id: 25, base: 'autumn', pt: 'outono', example: 'Autumn is beautiful.', tip: 'No inglês americano se diz "fall". Primavera = spring.' },
  ],
};
