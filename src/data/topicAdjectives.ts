import type { Topic } from './topic';

// Tópico: 25 adjetivos essenciais, em pares de opostos (facilita decorar).
// Não tem passado/particípio, então NÃO usa a etapa "Formas" — só Estudar
// e Significado, mais os 3 jogos.

export const TOPIC_ADJECTIVES: Topic = {
  id: 'adjectives-01-25',
  title: 'Adjetivos · essenciais',
  subtitle: 'good → busy · 25 mais usados',
  emoji: '✨',
  category: 'adjetivos',
  level: 1,
  stages: ['study', 'meaning'],
  items: [
    { id: 1, base: 'good', pt: 'bom', example: 'That is a good idea.', tip: 'Oposto de bad. Cuidado: "well" é advérbio (I speak well).' },
    { id: 2, base: 'bad', pt: 'ruim, mau', example: 'The weather is bad today.', tip: 'Oposto de good.' },
    { id: 3, base: 'big', pt: 'grande', example: 'They live in a big house.', tip: 'Oposto de small. Sinônimo comum: large.' },
    { id: 4, base: 'small', pt: 'pequeno', example: 'I have a small car.', tip: 'Oposto de big. Para pessoas jovens use "young", não "small".' },
    { id: 5, base: 'new', pt: 'novo', example: 'I bought a new phone.', tip: 'Oposto de old.' },
    { id: 6, base: 'old', pt: 'velho, antigo', example: 'This is a very old building.', tip: 'Também é idade: "How old are you?" = Quantos anos você tem?' },
    { id: 7, base: 'happy', pt: 'feliz', example: 'She looks very happy.', tip: 'Oposto de sad.' },
    { id: 8, base: 'sad', pt: 'triste', example: 'Why are you sad?', tip: 'Oposto de happy.' },
    { id: 9, base: 'easy', pt: 'fácil', example: 'This exercise is easy.', tip: 'Oposto de hard/difficult.' },
    { id: 10, base: 'hard', pt: 'difícil, duro', example: 'English is not hard.', tip: 'Serve para "difícil" e para "duro" (hard rock). Sinônimo: difficult.' },
    { id: 11, base: 'hot', pt: 'quente', example: 'The coffee is too hot.', tip: 'Oposto de cold. "warm" = morno/agradável.' },
    { id: 12, base: 'cold', pt: 'frio', example: 'It is cold outside.', tip: 'Oposto de hot. "cool" = fresquinho (ou "legal").' },
    { id: 13, base: 'fast', pt: 'rápido', example: 'He is a fast runner.', tip: 'Oposto de slow. Também vira advérbio: "He runs fast".' },
    { id: 14, base: 'slow', pt: 'lento, devagar', example: 'The internet is slow today.', tip: 'Oposto de fast. Advérbio: slowly.' },
    { id: 15, base: 'long', pt: 'longo, comprido', example: 'She has long hair.', tip: 'Oposto de short. Tempo: "a long time" = muito tempo.' },
    { id: 16, base: 'short', pt: 'curto, baixo', example: 'The movie is short.', tip: 'Curto (coisas) e baixo (altura de pessoa). Oposto de long/tall.' },
    { id: 17, base: 'tall', pt: 'alto (de altura)', example: 'My brother is very tall.', tip: 'Use tall para pessoas e prédios; "high" para coisas altas do chão.' },
    { id: 18, base: 'beautiful', pt: 'bonito, lindo', example: 'What a beautiful day!', tip: 'Sinônimos: pretty (mulher/coisa), handsome (homem).' },
    { id: 19, base: 'ugly', pt: 'feio', example: 'That is an ugly sweater.', tip: 'Oposto de beautiful.' },
    { id: 20, base: 'expensive', pt: 'caro', example: 'This restaurant is expensive.', tip: 'Oposto de cheap. "dear" quase não é usado nesse sentido hoje.' },
    { id: 21, base: 'cheap', pt: 'barato', example: 'I found a cheap ticket.', tip: 'Oposto de expensive. Cuidado: cheap também pode significar "de má qualidade".' },
    { id: 22, base: 'young', pt: 'jovem', example: 'She is too young to drive.', tip: 'Oposto de old (para pessoas).' },
    { id: 23, base: 'strong', pt: 'forte', example: 'He is very strong.', tip: 'Oposto de weak. Também para sabor: "strong coffee".' },
    { id: 24, base: 'tired', pt: 'cansado', example: 'I am tired today.', tip: 'Cuidado: "tired of" = cansado DE algo (I am tired of waiting).' },
    { id: 25, base: 'busy', pt: 'ocupado', example: 'Sorry, I am busy right now.', tip: 'Também para lugar cheio/movimentado: "a busy street".' },
  ],
};
