import type { Topic } from './topic';

// Tópico: advérbios de frequência — as respostas de "How often…?".
// Regra de posição: ANTES do verbo principal (I always work), DEPOIS do be
// (I am always late).

export const TOPIC_FREQUENCY: Topic = {
  id: 'freq-adverbs-01-16',
  title: 'Advérbios de frequência',
  subtitle: 'always → how often · 16 palavras',
  emoji: '🔁',
  category: 'tempos',
  level: 1,
  stages: ['study', 'meaning'],
  items: [
    { id: 1, base: 'always', pt: 'sempre (100%)', example: 'I always drink coffee in the morning.', tip: 'Antes do verbo: I always drink. Depois do be: I am always late.' },
    { id: 2, base: 'usually', pt: 'geralmente (90%)', example: 'I usually wake up at 6.', tip: 'O mais usado para rotina. Mesma posição do always.' },
    { id: 3, base: 'normally', pt: 'normalmente', example: 'I normally have lunch at noon.', tip: 'Sinônimo de usually.' },
    { id: 4, base: 'often', pt: 'frequentemente (70%)', example: 'Do you often eat out?', tip: 'O t costuma ser mudo: "ófen".' },
    { id: 5, base: 'sometimes', pt: 'às vezes (50%)', example: 'Sometimes I work on Saturdays.', tip: 'Pode abrir a frase: Sometimes I… (usually e normally também podem; always/never/rarely, não).' },
    { id: 6, base: 'rarely', pt: 'raramente (10%)', example: 'She rarely watches TV.', tip: 'Sinônimo: seldom (mais formal).' },
    { id: 7, base: 'hardly ever', pt: 'quase nunca (5%)', example: 'I hardly ever drink soda.', tip: 'hardly ever = quase nunca. Não confunda hardly com hard.' },
    { id: 8, base: 'never', pt: 'nunca (0%)', example: 'He never arrives on time.', tip: 'Já é negativo — o verbo fica positivo: He never arrives (não "doesn\'t never").' },
    { id: 9, base: 'once', pt: 'uma vez', example: 'I travel once a year.', tip: 'once = 1x. once a week/month/year = uma vez por semana/mês/ano.' },
    { id: 10, base: 'twice', pt: 'duas vezes', example: 'I go to the gym twice a week.', tip: 'twice = 2x. De 3 em diante: three times, four times…' },
    { id: 11, base: 'three times', pt: 'três vezes', example: 'I called you three times!', tip: 'número + times: three times a day = 3x por dia.' },
    { id: 12, base: 'once a week', pt: 'uma vez por semana', example: 'We have class once a week.', tip: 'O "por" é o artigo a: once A week, twice A month.' },
    { id: 13, base: 'on weekends', pt: 'nos fins de semana', example: 'I play soccer on weekends.', tip: 'on + dia: on Sundays, on weekends. Sempre on, não in.' },
    { id: 14, base: 'every other day', pt: 'dia sim, dia não', example: 'She runs every other day.', tip: 'every other = alternado: every other week = semana sim, semana não.' },
    { id: 15, base: 'all the time', pt: 'o tempo todo', example: 'He complains all the time.', tip: 'Informal, no fim da frase.' },
    { id: 16, base: 'how often', pt: 'com que frequência?', example: 'How often do you read a book?', tip: 'A pergunta que todos estes respondem — coluna esquerda do mapa.' },
  ],
};
