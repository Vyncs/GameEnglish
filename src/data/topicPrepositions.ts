import type { Topic } from './topic';

// Tópico: 25 preposições — as que mais mudam de sentido entre português e
// inglês, e as que vêm grudadas em verbo ("depend ON", "listen TO").
// Sem passado/particípio → não usa a etapa "Formas".

export const TOPIC_PREPOSITIONS: Topic = {
  id: 'prepositions-01-25',
  title: 'Preposições',
  subtitle: 'in → without · 25 palavras',
  emoji: '🧭',
  category: 'gramatica',
  level: 2,
  stages: ['study', 'meaning'],
  items: [
    { id: 1, base: 'in', pt: 'em (dentro de)', example: 'The keys are in the drawer.', tip: 'Espaço fechado, cidade, país, mês e ano: in Brazil, in May, in 2026.' },
    { id: 2, base: 'on', pt: 'em (sobre), em (dias)', example: 'The book is on the table.', tip: 'Superfície e dias: on Monday, on the wall. Também "ligado": the TV is on.' },
    { id: 3, base: 'at', pt: 'em (ponto exato), às', example: 'I am at home.', tip: 'Ponto exato e horário: at home, at work, at 8 o\'clock.' },
    { id: 4, base: 'to', pt: 'para, a', example: 'I go to work every day.', tip: 'Direção. Exceção famosa: "go home", sem to.' },
    { id: 5, base: 'from', pt: 'de (origem)', example: 'I am from Brazil.', tip: 'Origem. Par clássico: from… to… (de… até…).' },
    { id: 6, base: 'for', pt: 'por, para, durante', example: 'This gift is for you.', tip: 'Com duração: "for two years" (por dois anos), diferente de since.' },
    { id: 7, base: 'since', pt: 'desde', example: 'I have lived here since 2020.', tip: 'Ponto de partida no tempo. Puxa o perfect: have lived since…' },
    { id: 8, base: 'with', pt: 'com', example: 'I live with my brother.', tip: 'Companhia e instrumento: cut it with a knife.' },
    { id: 9, base: 'without', pt: 'sem', example: 'I drink coffee without sugar.', tip: 'O verbo depois vem com -ing: without saying a word.' },
    { id: 10, base: 'about', pt: 'sobre, a respeito de', example: 'We talked about you.', tip: 'Também significa "mais ou menos": about twenty people.' },
    { id: 11, base: 'of', pt: 'de (posse, parte)', example: 'The color of the car is red.', tip: 'Em inglês a posse costuma ser com \'s: "my brother\'s car", não "car of my brother".' },
    { id: 12, base: 'by', pt: 'por, de (meio)', example: 'I go to work by bus.', tip: 'Meio de transporte e autoria. Também prazo: by Friday (até sexta).' },
    { id: 13, base: 'between', pt: 'entre (dois)', example: 'The bank is between the shops.', tip: 'Entre DOIS. Para mais de dois, use among.' },
    { id: 14, base: 'among', pt: 'entre (vários)', example: 'She was among friends.', tip: 'Grupo de três ou mais.' },
    { id: 15, base: 'under', pt: 'embaixo de', example: 'The cat is under the table.', tip: 'Oposto de over/above.' },
    { id: 16, base: 'over', pt: 'sobre, acima de, mais de', example: 'There is a light over the table.', tip: 'Também "mais de": over fifty people. E "acabado": the game is over.' },
    { id: 17, base: 'behind', pt: 'atrás de', example: 'The car is behind the house.', tip: 'Oposto de "in front of".' },
    { id: 18, base: 'in front of', pt: 'na frente de', example: 'I parked in front of the bank.', tip: 'Três palavras. Não confunda com "in the front" (na parte da frente).' },
    { id: 19, base: 'next to', pt: 'ao lado de', example: 'She sat next to me.', tip: 'Sinônimos: beside, by.' },
    { id: 20, base: 'near', pt: 'perto de', example: 'The hotel is near the beach.', tip: 'Não precisa de "to": near the beach.' },
    { id: 21, base: 'into', pt: 'para dentro de', example: 'He went into the room.', tip: 'in = onde está; into = movimento para dentro.' },
    { id: 22, base: 'out of', pt: 'para fora de', example: 'She came out of the house.', tip: 'Também "sem": out of money, out of time.' },
    { id: 23, base: 'during', pt: 'durante', example: 'I slept during the movie.', tip: 'Vem antes de substantivo, não de frase: during the trip, não "during I traveled".' },
    { id: 24, base: 'before', pt: 'antes de', example: 'Call me before lunch.', tip: 'Oposto de after. Serve para tempo e ordem.' },
    { id: 25, base: 'after', pt: 'depois de', example: 'We can talk after the meeting.', tip: 'Cuidado: "after" e "later" não são iguais — later é advérbio, sozinho.' },
  ],
};
