import type { Topic } from './topic';

// Tópico: os 25 marcadores de tempo — as palavras que escolhem a coluna da
// Grade 4V5T2S. Cada tip diz qual abertura o marcador dispara.

export const TOPIC_TIME_MARKERS: Topic = {
  id: 'time-markers-01-25',
  title: 'Marcadores de tempo',
  subtitle: 'yesterday → for · 25 gatilhos da Grade',
  emoji: '🧭',
  category: 'tempos',
  level: 1,
  stages: ['study', 'meaning'],
  items: [
    { id: 1, base: 'yesterday', pt: 'ontem', example: 'What did you do yesterday?', tip: '→ DID (passado). O gatilho mais comum da coluna vermelha.' },
    { id: 2, base: 'ago', pt: 'atrás (tempo)', example: 'She left two hours ago.', tip: '→ DID. Vem DEPOIS do tempo: two hours ago, nunca "ago two hours".' },
    { id: 3, base: 'last night', pt: 'ontem à noite', example: 'Did you sleep well last night?', tip: '→ DID. last + night/week/month/year, sempre sem "the".' },
    { id: 4, base: 'last week', pt: 'semana passada', example: 'I saw her last week.', tip: '→ DID. Sem preposição: "last week", não "in the last week".' },
    { id: 5, base: 'last month', pt: 'mês passado', example: 'They moved last month.', tip: '→ DID.' },
    { id: 6, base: 'last year', pt: 'ano passado', example: 'Did you travel last year?', tip: '→ DID.' },
    { id: 7, base: 'in 2020', pt: 'em 2020 (in + ano)', example: 'Where were you in 2020?', tip: '→ DID / was-were. Ano fechado no passado pede a coluna vermelha.' },
    { id: 8, base: 'today', pt: 'hoje', example: 'Have you eaten today?', tip: '→ HAVE + V3 se o dia ainda não acabou (o resultado importa); → did se o momento já fechou.' },
    { id: 9, base: 'tonight', pt: 'hoje à noite', example: 'Will you be home tonight?', tip: '→ WILL. A noite ainda vai acontecer.' },
    { id: 10, base: 'this morning', pt: 'hoje de manhã', example: 'Has he called this morning?', tip: '→ HAVE enquanto a manhã não acabou; depois dela, did.' },
    { id: 11, base: 'tomorrow', pt: 'amanhã', example: 'What will you do tomorrow?', tip: '→ WILL (futuro). O gatilho mais comum da coluna do futuro.' },
    { id: 12, base: 'next week', pt: 'semana que vem', example: 'Will you travel next week?', tip: '→ WILL. next + week/month/year, sem "the".' },
    { id: 13, base: 'next month', pt: 'mês que vem', example: 'The course will start next month.', tip: '→ WILL (programação fixa de horário aceita presente: The course starts…).' },
    { id: 14, base: 'next year', pt: 'ano que vem', example: 'Where will he live next year?', tip: '→ WILL.' },
    { id: 15, base: 'every day', pt: 'todo dia', example: 'How often do you study? Every day.', tip: '→ DO/DOES (presente, rotina). every + day/week/month/year. Cuidado: everyday junto é adjetivo.' },
    { id: 16, base: 'now', pt: 'agora', example: 'What are you doing now?', tip: '→ be + V-ING (presente contínuo).' },
    { id: 17, base: 'right now', pt: 'agora mesmo', example: 'She is working right now.', tip: '→ be + V-ING. O "right" só reforça.' },
    { id: 18, base: 'at the moment', pt: 'no momento', example: 'He is busy at the moment.', tip: '→ be + V-ING. Nunca "in the moment" nem "moment" sozinho.' },
    { id: 19, base: 'recently', pt: 'recentemente', example: 'Have you seen her recently?', tip: '→ HAVE + V3 (perfect). Sem data marcada = coluna azul.' },
    { id: 20, base: 'just', pt: 'acabou de', example: 'I have just arrived.', tip: '→ HAVE + V3, com o just entre o have e o verbo.' },
    { id: 21, base: 'already', pt: 'já (afirmação)', example: 'I have already finished.', tip: '→ HAVE + V3. Entre o have e o verbo. O "já" de pergunta é yet.' },
    { id: 22, base: 'yet', pt: 'já? / ainda não', example: "Have you finished yet? — Not yet.", tip: '→ HAVE + V3, no FIM de perguntas e negativas.' },
    { id: 23, base: 'ever', pt: 'alguma vez (na vida)', example: 'Have you ever been to Japan?', tip: '→ HAVE + V3. "Já alguma vez…?" = ever, entre o have e o V3.' },
    { id: 24, base: 'since', pt: 'desde', example: 'I have lived here since 2004.', tip: '→ HAVE + V3. Ponto de partida: since 2004, since Monday.' },
    { id: 25, base: 'for', pt: 'há / por (duração)', example: 'I have known him for 10 years.', tip: '→ HAVE + V3. Duração: for 10 years, for a long time.' },
  ],
};
