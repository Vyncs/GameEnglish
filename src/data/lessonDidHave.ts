// Aula 02 — DID vs HAVE e os 3 tipos de "já" (ever · already · yet)
//
// Duas partes:
//   1. MIND_MAP  -> o mapa mental, para a revisão de 1 minuto por dia
//   2. LESSON_DID_HAVE.questions -> o treino (escolher a frase certa / o "já" certo)
//
// Ideia central da aula:
//   DID  = passado FECHADO, com hora marcada (yesterday, last week, in 2020)
//   HAVE = passado que ainda toca o presente (experiência ou resultado), sem hora marcada

export type MapTint = 'blue' | 'green' | 'purple' | 'amber' | 'orange' | 'pink';

export interface MindMapCard {
  id: string;
  n: number;
  title: string;
  tag: string;
  emoji: string;
  tint: MapTint;
  /** Estrutura da frase, do jeito que se escreve no caderno. */
  structure?: string;
  rules: string[];
  examples: { en: string; pt: string }[];
  /** Erro clássico de brasileiro. */
  gotcha?: string;
}

export const MIND_MAP: MindMapCard[] = [
  {
    id: 'did',
    n: 1,
    title: 'DID',
    tag: 'past simple · passado fechado',
    emoji: '📅',
    tint: 'blue',
    structure: 'Did + sujeito + verbo na FORMA BASE',
    rules: [
      'A ação aconteceu num momento específico e já terminou.',
      'O tempo costuma aparecer na frase: yesterday, last week, in 2020, two days ago.',
      'Depois de did o verbo volta para a forma base — sem -ed e sem passado.',
      'Na afirmativa não existe "did": o passado vai no próprio verbo (I went, I ate).',
      'O foco é QUANDO aconteceu. Não conecta com o presente.',
    ],
    examples: [
      { en: 'I did my homework yesterday.', pt: 'Eu fiz minha lição ontem.' },
      { en: 'Did you eat pizza last night?', pt: 'Você comeu pizza ontem à noite?' },
      { en: "I didn't go to the party.", pt: 'Eu não fui à festa.' },
    ],
    gotcha: '❌ Did you ate? / Did you went? → ✅ Did you eat? / Did you go? Depois de did, verbo na base.',
  },
  {
    id: 'have',
    n: 2,
    title: 'HAVE / HAS',
    tag: 'present perfect · passado + presente',
    emoji: '🎯',
    tint: 'green',
    structure: 'Have / Has + particípio (V3)',
    rules: [
      'A ação aconteceu no passado, mas ainda tem ligação com o agora.',
      'NÃO se diz quando aconteceu — nada de yesterday, last week, in 2020.',
      'O foco é o resultado ou a experiência de vida.',
      'he / she / it usam has; o resto usa have.',
      'Negativa: haven\'t / hasn\'t + particípio.',
    ],
    examples: [
      { en: 'I have traveled to the USA.', pt: 'Eu já viajei para os EUA. (experiência)' },
      { en: 'She has finished the work.', pt: 'Ela terminou o trabalho. (e está pronto agora)' },
      { en: "He hasn't arrived.", pt: 'Ele não chegou. (e continua não estando aqui)' },
    ],
    gotcha: '❌ I have traveled yesterday. → ✅ I traveled yesterday. Com hora marcada, use did/passado simples.',
  },
  {
    id: 'diff',
    n: 3,
    title: 'A diferença',
    tag: 'como escolher em 2 segundos',
    emoji: '⚖️',
    tint: 'purple',
    rules: [
      'Pergunte-se: "QUANDO aconteceu?" — se a frase responde isso, é DID.',
      'Pergunte-se: "já aconteceu na vida ou tem efeito agora?" — então é HAVE.',
      'DID fecha o assunto. HAVE deixa a porta aberta para o presente.',
    ],
    examples: [
      { en: 'Did you eat?', pt: 'Você comeu? (quando? naquele momento)' },
      { en: 'Have you eaten?', pt: 'Você já comeu? (está com fome agora ou não?)' },
      { en: 'I lost my keys yesterday. / I have lost my keys.', pt: 'Perdi ontem (fato) / Perdi as chaves (e estou sem elas agora).' },
    ],
  },
  {
    id: 'ever',
    n: 4,
    title: 'EVER',
    tag: '"já" = alguma vez na vida',
    emoji: '⭐',
    tint: 'amber',
    structure: 'Have + sujeito + ever + particípio',
    rules: [
      'Usado em PERGUNTAS sobre experiência de vida.',
      'Vem entre o sujeito e o particípio.',
      'A resposta negativa usa never (que já é negativo — não leva not).',
      'Também aparece em superlativos: the best movie I have ever seen.',
    ],
    examples: [
      { en: 'Have you ever traveled abroad?', pt: 'Você já viajou para fora alguma vez?' },
      { en: 'Have you ever eaten sushi?', pt: 'Você já comeu sushi alguma vez?' },
      { en: 'I have never been to Japan.', pt: 'Eu nunca fui ao Japão.' },
    ],
    gotcha: "❌ I haven't never been. → ✅ I have never been. Never já carrega a negação.",
  },
  {
    id: 'already',
    n: 5,
    title: 'ALREADY',
    tag: '"já" = antes do esperado',
    emoji: '✔️',
    tint: 'orange',
    structure: 'Have / Has + already + particípio',
    rules: [
      'Usado em frases AFIRMATIVAS.',
      'Posição: entre have/has e o verbo.',
      'Passa a ideia de "mais cedo do que se esperava".',
      'Em pergunta, só quando é surpresa: Have you already finished?',
    ],
    examples: [
      { en: 'I have already finished my work.', pt: 'Eu já terminei meu trabalho.' },
      { en: 'She has already left.', pt: 'Ela já saiu.' },
      { en: 'They have already eaten.', pt: 'Eles já comeram.' },
    ],
    gotcha: 'Primo do already: just = "acabei de". I have just arrived = acabei de chegar.',
  },
  {
    id: 'yet',
    n: 6,
    title: 'YET',
    tag: '"já?" / "ainda não"',
    emoji: '❓',
    tint: 'pink',
    structure: '… + particípio + yet (no FIM da frase)',
    rules: [
      'Só entra em PERGUNTA ou NEGATIVA.',
      'Posição: sempre no fim da frase.',
      'Na pergunta significa "já?"; na negativa, "ainda não".',
      'Nunca aparece em frase afirmativa — aí o certo é already.',
    ],
    examples: [
      { en: 'Have you finished yet?', pt: 'Você já terminou?' },
      { en: "I haven't finished yet.", pt: 'Eu ainda não terminei.' },
      { en: "He hasn't woken up yet.", pt: 'Ele ainda não acordou.' },
    ],
    gotcha: '❌ I have yet finished. → ✅ I have already finished. Yet só em pergunta e negativa, e no fim.',
  },
];

/** O resumo de bolso — é o que se lê nos 60 segundos da revisão diária. */
export const QUICK_SUMMARY: { term: string; means: string; tint: MapTint }[] = [
  { term: 'DID', means: 'passado com tempo definido (yesterday, last week)', tint: 'blue' },
  { term: 'HAVE', means: 'experiência ou resultado, sem tempo definido', tint: 'green' },
  { term: 'EVER', means: '"já" na vida — em perguntas', tint: 'amber' },
  { term: 'ALREADY', means: '"já", antes do esperado — em afirmativas', tint: 'orange' },
  { term: 'YET', means: '"já?" / "ainda não" — pergunta e negativa, no fim', tint: 'pink' },
];

/** Os 3 passos da revisão de 1 minuto por dia. */
export const DAILY_ROUTINE = [
  'Leia o mapa mental de cima a baixo (30s).',
  'Crie 3 frases suas: uma com DID, uma com HAVE e uma com EVER/ALREADY/YET.',
  'Fale as três em voz alta.',
];

// ---------------------------------------------------------------------------
// Treino
// ---------------------------------------------------------------------------

export interface DidHaveQuestion {
  id: number;
  /** 'did-have' = escolher a versão certa da frase; 'ja' = completar com ever/already/yet. */
  kind: 'did-have' | 'ja';
  /** O que se quer dizer (em português) ou a frase com lacuna (no caso do "já"). */
  prompt: string;
  options: string[];
  answer: string;
  explanation: string;
}

export const LESSON_DID_HAVE = {
  id: 'did-have-01',
  title: 'Aula 02 — DID vs HAVE',
  subtitle: 'Passado fechado, present perfect e os 3 tipos de "já"',
  questions: [
    // ---- DID vs HAVE ----
    { id: 1, kind: 'did-have', prompt: 'Eu fiz minha lição ontem.', options: ['I did my homework yesterday.', 'I have done my homework yesterday.'], answer: 'I did my homework yesterday.', explanation: '"Yesterday" marca a hora → passado simples. Com tempo definido não se usa have.' },
    { id: 2, kind: 'did-have', prompt: 'Você já comeu? (está com fome agora?)', options: ['Have you eaten?', 'Did you eat?'], answer: 'Have you eaten?', explanation: 'Interessa o resultado agora (fome ou não), não quando comeu → present perfect.' },
    { id: 3, kind: 'did-have', prompt: 'Ela terminou o trabalho. (está pronto)', options: ['She has finished the work.', 'She did finish the work.'], answer: 'She has finished the work.', explanation: 'O foco é o resultado que continua valendo → has + particípio.' },
    { id: 4, kind: 'did-have', prompt: 'Você comeu pizza ontem à noite?', options: ['Did you eat pizza last night?', 'Have you eaten pizza last night?'], answer: 'Did you eat pizza last night?', explanation: '"Last night" é tempo específico → did + verbo na forma base.' },
    { id: 5, kind: 'did-have', prompt: 'Eu já viajei para os Estados Unidos. (experiência de vida)', options: ['I have traveled to the USA.', 'I traveled to the USA in 2019.'], answer: 'I have traveled to the USA.', explanation: 'Experiência de vida, sem dizer quando → present perfect.' },
    { id: 6, kind: 'did-have', prompt: 'Ele não chegou ainda.', options: ["He hasn't arrived yet.", "He didn't arrive yet."], answer: "He hasn't arrived yet.", explanation: 'A ausência dele continua valendo agora → hasn\'t + particípio, com yet no fim.' },
    { id: 7, kind: 'did-have', prompt: 'Quando você comprou esse carro?', options: ['When did you buy this car?', 'When have you bought this car?'], answer: 'When did you buy this car?', explanation: 'Perguntas com WHEN pedem tempo definido — sempre passado simples.' },
    { id: 8, kind: 'did-have', prompt: 'Eu perdi minha carteira. (estou sem ela agora)', options: ['I have lost my wallet.', 'I lost my wallet in 2020.'], answer: 'I have lost my wallet.', explanation: 'O efeito continua: estou sem carteira → present perfect.' },
    { id: 9, kind: 'did-have', prompt: 'Você foi ao show semana passada?', options: ['Did you go to the concert last week?', 'Have you gone to the concert last week?'], answer: 'Did you go to the concert last week?', explanation: '"Last week" fecha o tempo → did + go (forma base).' },
    { id: 10, kind: 'did-have', prompt: 'Ela nunca dirigiu um caminhão.', options: ['She has never driven a truck.', 'She never drove a truck yesterday.'], answer: 'She has never driven a truck.', explanation: 'Experiência de vida com never → has + particípio (driven).' },
    { id: 11, kind: 'did-have', prompt: 'Eu não fui à festa.', options: ["I didn't go to the party.", "I haven't went to the party."], answer: "I didn't go to the party.", explanation: 'Depois de didn\'t o verbo fica na forma base: go. E "went" nunca vem depois de have.' },
    { id: 12, kind: 'did-have', prompt: 'Nós moramos aqui desde 2020.', options: ['We have lived here since 2020.', 'We lived here since 2020.'], answer: 'We have lived here since 2020.', explanation: 'Começou no passado e continua até hoje → present perfect. Since e for combinam com have.' },
    { id: 13, kind: 'did-have', prompt: 'O que você disse?', options: ['What did you say?', 'What have you said?'], answer: 'What did you say?', explanation: 'Pergunta sobre algo que acabou de ser dito, num momento definido → passado simples.' },
    { id: 14, kind: 'did-have', prompt: 'Eles já leram esse livro. (em algum momento da vida)', options: ['They have read this book.', 'They did read this book.'], answer: 'They have read this book.', explanation: 'Experiência, sem tempo marcado → have + particípio (read, pronunciado "réd").' },

    // ---- os 3 tipos de "já" ----
    { id: 15, kind: 'ja', prompt: 'Have you ______ been to Japan?', options: ['ever', 'already', 'yet'], answer: 'ever', explanation: 'Pergunta sobre experiência de vida → ever, entre o sujeito e o particípio.' },
    { id: 16, kind: 'ja', prompt: 'I have ______ finished my work.', options: ['already', 'yet', 'ever'], answer: 'already', explanation: 'Frase afirmativa, "já" antes do esperado → already, entre have e o verbo.' },
    { id: 17, kind: 'ja', prompt: "I haven't finished ______.", options: ['yet', 'already', 'ever'], answer: 'yet', explanation: 'Negativa = "ainda não" → yet, sempre no fim da frase.' },
    { id: 18, kind: 'ja', prompt: 'Has she woken up ______?', options: ['yet', 'ever', 'already'], answer: 'yet', explanation: 'Pergunta do tipo "já?" → yet no fim da frase.' },
    { id: 19, kind: 'ja', prompt: 'They have ______ eaten — the plates are empty.', options: ['already', 'yet', 'ever'], answer: 'already', explanation: 'Afirmativa com resultado visível → already.' },
    { id: 20, kind: 'ja', prompt: 'Have you ______ eaten sushi?', options: ['ever', 'yet', 'already'], answer: 'ever', explanation: '"Alguma vez na vida" → ever.' },
    { id: 21, kind: 'ja', prompt: "He hasn't called me ______.", options: ['yet', 'ever', 'already'], answer: 'yet', explanation: 'Negativa → yet no fim: ele ainda não ligou.' },
    { id: 22, kind: 'ja', prompt: 'This is the best film I have ______ seen.', options: ['ever', 'already', 'yet'], answer: 'ever', explanation: 'Superlativo (the best… I have ever seen) sempre pede ever.' },
    { id: 23, kind: 'ja', prompt: 'She has ______ left the office.', options: ['already', 'yet', 'ever'], answer: 'already', explanation: 'Afirmativa → already entre has e o particípio.' },
    { id: 24, kind: 'ja', prompt: 'Have they arrived ______?', options: ['yet', 'already', 'ever'], answer: 'yet', explanation: 'Pergunta "já chegaram?" → yet no fim.' },
  ] as DidHaveQuestion[],
};
