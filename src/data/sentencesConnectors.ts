import type { TopicSentence } from './topic';

// Frases faladas do bloco "Conectivos".
//
// O aluno ouve a frase, lê o sentido em português e repete falando. Quando o
// `example` que o item já trazia servia, ele foi reaproveitado: a frase lida na
// etapa anterior é a mesma que ele repete, o que reforça em vez de apresentar
// material novo.

export const SENTENCES_CONNECTORS: Record<number, TopicSentence> = {
  1: {
    en: 'I wanted to go. However, I was sick.',
    pt: 'Eu queria ir. Porém, eu estava doente.',
    newWords: [
      { word: 'sick', pt: 'doente', kind: 'adj' },
    ],
  },
  2: {
    en: 'Actually, I disagree with the plan.',
    pt: 'Na verdade, eu não concordo com o plano.',
    newWords: [
      { word: 'disagree', pt: 'discordar', kind: 'verbo' },
      { word: 'plan', pt: 'plano', kind: 'subst' },
    ],
  },
  3: {
    en: 'By the way, did you call her?',
    pt: 'A propósito, você ligou pra ela?',
    newWords: [
      { word: 'call', pt: 'ligar para', kind: 'verbo' },
    ],
  },
  4: {
    en: "Anyway, let's move on to the next topic.",
    pt: 'Enfim, vamos seguir para o próximo assunto.',
    newWords: [
      { word: 'move on', pt: 'seguir adiante', kind: 'expr' },
      { word: 'topic', pt: 'assunto, tópico', kind: 'subst' },
    ],
  },
  5: {
    en: "It's late. Besides, I'm tired.",
    pt: 'Está tarde. Além disso, estou cansado.',
    newWords: [
      { word: 'late', pt: 'tarde', kind: 'adj' },
      { word: 'tired', pt: 'cansado', kind: 'adj' },
    ],
  },
  6: {
    en: "The bus is full. Let's walk instead.",
    pt: 'O ônibus está cheio. Vamos andar em vez disso.',
    newWords: [
      { word: 'bus', pt: 'ônibus', kind: 'subst' },
      { word: 'full', pt: 'cheio', kind: 'adj' },
    ],
  },
  7: {
    en: 'Although it was raining, we went out.',
    pt: 'Embora estivesse chovendo, nós saímos.',
    newWords: [
      { word: 'raining', pt: 'chovendo', kind: 'verbo' },
      { word: 'went out', pt: 'saímos', kind: 'expr' },
    ],
  },
  8: {
    en: 'I left early so that I could rest.',
    pt: 'Saí cedo para que eu pudesse descansar.',
    newWords: [
      { word: 'early', pt: 'cedo', kind: 'adv' },
      { word: 'rest', pt: 'descansar', kind: 'verbo' },
    ],
  },
  9: {
    en: 'We stayed home because of the rain.',
    pt: 'Ficamos em casa por causa da chuva.',
    newWords: [
      { word: 'stayed', pt: 'ficamos', kind: 'verbo' },
      { word: 'home', pt: 'em casa', kind: 'adv' },
    ],
  },
  10: {
    en: 'The store was closed; therefore, we ordered pizza.',
    pt: 'A loja estava fechada; portanto, pedimos pizza.',
    newWords: [
      { word: 'closed', pt: 'fechado', kind: 'adj' },
      { word: 'ordered', pt: 'pedimos', kind: 'verbo' },
    ],
  },
  11: {
    en: 'In fact, she already knew.',
    pt: 'De fato, ela já sabia.',
    newWords: [
      { word: 'already', pt: 'já', kind: 'adv' },
      { word: 'knew', pt: 'sabia', kind: 'verbo' },
    ],
  },
  12: {
    en: 'We need snacks, for example, chips.',
    pt: 'A gente precisa de petiscos, por exemplo, salgadinhos.',
    newWords: [
      { word: 'snacks', pt: 'petiscos', kind: 'subst' },
      { word: 'chips', pt: 'salgadinhos', kind: 'subst' },
    ],
  },
  13: {
    en: 'She speaks French as well as English.',
    pt: 'Ela fala francês assim como inglês.',
    newWords: [
      { word: 'speaks', pt: 'fala', kind: 'verbo' },
      { word: 'French', pt: 'francês', kind: 'subst' },
    ],
  },
  14: {
    en: 'At least we tried.',
    pt: 'Pelo menos nós tentamos.',
    newWords: [
      { word: 'tried', pt: 'tentamos', kind: 'verbo' },
    ],
  },
  15: {
    en: "Of course I'll help you.",
    pt: 'Claro que eu vou te ajudar.',
    newWords: [
      { word: 'help', pt: 'ajudar', kind: 'verbo' },
    ],
  },
  16: {
    en: "I mean, it wasn't that bad.",
    pt: 'Quer dizer, não foi tão ruim assim.',
    newWords: [
      { word: 'bad', pt: 'ruim', kind: 'adj' },
    ],
  },
  17: {
    en: "I guess you're right.",
    pt: 'Eu acho que você está certo.',
    newWords: [
      { word: 'right', pt: 'certo, correto', kind: 'adj' },
    ],
  },
  18: {
    en: "It's kind of cold today.",
    pt: 'Está meio frio hoje.',
    newWords: [
      { word: 'cold', pt: 'frio', kind: 'adj' },
      { word: 'today', pt: 'hoje', kind: 'adv' },
    ],
  },
  19: {
    en: "I'm busy right now.",
    pt: 'Estou ocupado agora mesmo.',
    newWords: [
      { word: 'busy', pt: 'ocupado', kind: 'adj' },
    ],
  },
  20: {
    en: 'Call me as soon as you arrive.',
    pt: 'Me liga assim que você chegar.',
    newWords: [
      { word: 'arrive', pt: 'chegar', kind: 'verbo' },
    ],
  },
  21: {
    en: 'No wonder the kitchen smells so good.',
    pt: 'Não é à toa que a cozinha cheira tão bem.',
    newWords: [
      { word: 'kitchen', pt: 'cozinha', kind: 'subst' },
      { word: 'smells', pt: 'cheira', kind: 'verbo' },
    ],
  },
  22: {
    en: "On the other hand, it's cheaper.",
    pt: 'Por outro lado, é mais barato.',
    newWords: [
      { word: 'cheaper', pt: 'mais barato', kind: 'adj' },
    ],
  },
  23: {
    en: 'That is why I bought two tickets.',
    pt: 'É por isso que eu comprei dois ingressos.',
    newWords: [
      { word: 'bought', pt: 'comprei', kind: 'verbo' },
      { word: 'tickets', pt: 'ingressos, passagens', kind: 'subst' },
    ],
  },
  24: {
    en: 'Even though it was expensive, she loved it.',
    pt: 'Mesmo sendo caro, ela adorou.',
    newWords: [
      { word: 'expensive', pt: 'caro', kind: 'adj' },
      { word: 'loved', pt: 'adorou', kind: 'verbo' },
    ],
  },
  25: {
    en: "I'll finish by the end of the week.",
    pt: 'Vou terminar até o fim da semana.',
    newWords: [
      { word: 'finish', pt: 'terminar', kind: 'verbo' },
      { word: 'week', pt: 'semana', kind: 'subst' },
    ],
  },
};
