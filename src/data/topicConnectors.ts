import type { Topic } from './topic';

// Tópico: 25 conectivos e marcadores de conversa — as palavras que ligam uma
// ideia na outra e fazem a fala soar natural em vez de traduzida.
// Sem passado/particípio → não usa a etapa "Formas".

export const TOPIC_CONNECTORS: Topic = {
  id: 'connectors-01-25',
  title: 'Conectivos e conversa',
  subtitle: 'however → I mean · 25 expressões',
  emoji: '🔗',
  category: 'conversacao',
  level: 2,
  stages: ['study', 'meaning'],
  items: [
    { id: 1, base: 'however', pt: 'porém, no entanto', example: 'I wanted to go. However, I was sick.', tip: 'Mais formal que "but", e começa frase nova, com vírgula depois.' },
    { id: 2, base: 'actually', pt: 'na verdade', example: 'Actually, I disagree.', tip: 'Falso amigo clássico: NÃO é "atualmente". Atualmente = "currently".' },
    { id: 3, base: 'by the way', pt: 'a propósito, aliás', example: 'By the way, did you call her?', tip: 'Serve para mudar de assunto. Abreviado por escrito: BTW.' },
    { id: 4, base: 'anyway', pt: 'enfim, de qualquer forma', example: 'Anyway, let us move on.', tip: 'Retoma o assunto depois de um desvio. Sem -s no final.' },
    { id: 5, base: 'besides', pt: 'além disso', example: 'It is late. Besides, I am tired.', tip: 'Com -s é "além disso". Sem -s, "beside" é "ao lado de".' },
    { id: 6, base: 'instead', pt: 'em vez disso', example: 'Let us walk instead.', tip: 'Para citar o que foi trocado, use "instead of": instead of driving.' },
    { id: 7, base: 'although', pt: 'embora, apesar de', example: 'Although it was raining, we went out.', tip: 'Liga duas orações. Para substantivo, use "despite" ou "in spite of".' },
    { id: 8, base: 'so that', pt: 'para que', example: 'I left early so that I could rest.', tip: 'Vem seguido de sujeito + verbo, diferente de "to" + verbo puro.' },
    { id: 9, base: 'because of', pt: 'por causa de', example: 'We stayed home because of the rain.', tip: '"Because" pede frase; "because of" pede substantivo.' },
    { id: 10, base: 'therefore', pt: 'portanto', example: 'He was late; therefore, we started without him.', tip: 'Formal, típico de texto escrito. Na fala usa-se "so".' },
    { id: 11, base: 'in fact', pt: 'de fato, na realidade', example: 'In fact, she already knew.', tip: 'Reforça ou corrige o que acabou de ser dito.' },
    { id: 12, base: 'for example', pt: 'por exemplo', example: 'Some fruits, for example apples, are cheap.', tip: 'Abreviado por escrito: e.g.' },
    { id: 13, base: 'as well as', pt: 'assim como, além de', example: 'She speaks French as well as English.', tip: 'Diferente de "as well" sozinho, que significa "também", no fim da frase.' },
    { id: 14, base: 'at least', pt: 'pelo menos', example: 'At least we tried.', tip: 'O oposto é "at most" (no máximo).' },
    { id: 15, base: 'of course', pt: 'claro, com certeza', example: 'Of course I will help you.', tip: 'Cuidado: em resposta a pedido pode soar impaciente. "Sure" é mais leve.' },
    { id: 16, base: 'I mean', pt: 'quer dizer, ou seja', example: 'I mean, it was not that bad.', tip: 'Usado para se corrigir ou explicar melhor o que disse.' },
    { id: 17, base: 'I guess', pt: 'eu acho, acho que sim', example: 'I guess you are right.', tip: 'Mais incerto que "I think". Muito comum na fala americana.' },
    { id: 18, base: 'kind of', pt: 'meio que, tipo assim', example: 'It is kind of cold today.', tip: 'Na fala vira "kinda". Suaviza o que vem depois.' },
    { id: 19, base: 'right now', pt: 'agora mesmo', example: 'I am busy right now.', tip: 'Puxa o contínuo: be + -ing.' },
    { id: 20, base: 'as soon as', pt: 'assim que', example: 'Call me as soon as you arrive.', tip: 'Depois dele vem presente, não futuro: "as soon as you arrive", não "will arrive".' },
    { id: 21, base: 'no wonder', pt: 'não é à toa', example: 'No wonder you are tired.', tip: 'Vem sem verbo antes: é uma expressão fixa.' },
    { id: 22, base: 'on the other hand', pt: 'por outro lado', example: 'On the other hand, it is cheaper.', tip: 'Usa-se depois de apresentar o primeiro lado.' },
    { id: 23, base: 'that is why', pt: 'é por isso que', example: 'That is why I called you.', tip: 'Na fala vira "that\'s why".' },
    { id: 24, base: 'even though', pt: 'mesmo que, ainda que', example: 'Even though it was expensive, I bought it.', tip: 'Mais enfático que "although".' },
    { id: 25, base: 'by the end of', pt: 'até o fim de', example: 'I will finish by the end of the week.', tip: '"By" é o prazo limite; "until" é a continuidade até lá.' },
  ],
};
