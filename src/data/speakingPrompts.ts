// Prática falada — perguntas e respostas ancoradas na Grade 4V5T2S.
//
// A mecânica: o app FALA a pergunta em inglês, o aluno lê o sentido em
// português e PRODUZ a resposta falando em inglês. Não é repetição — ele
// monta a frase. Por isso cada item tem uma resposta modelo (`answer`) e
// variantes igualmente corretas (`accepts`), todas comparadas pelo
// compareTexts; vale a de maior acerto.
//
// `cellId` amarra o item a uma célula de grid4v5t2s.ts: quando o aluno erra,
// a dica que aparece é a `rule` daquela célula. É o que liga o speaking às
// regras que o sistema já ensina.

export interface SpeakingPrompt {
  id: string;
  /** Célula da Grade que este par treina (ver grid4v5t2s.ts). */
  cellId: string;
  /** A pergunta, falada pelo app e mostrada na tela. */
  question: string;
  /** A pergunta em português — só de apoio, some depois da primeira escuta. */
  questionPt: string;
  /** O que o aluno deve dizer, em português. É o enunciado do exercício. */
  cuePt: string;
  /** Resposta modelo em inglês. */
  answer: string;
  /** Outras formas igualmente corretas de dizer o mesmo. */
  accepts?: string[];
}

export const SPEAKING_PROMPTS: SpeakingPrompt[] = [
  // ------------------------------------------------------------ A · passado
  { id: 'sp-A-past-1', cellId: 'A-past', question: 'Did you work yesterday?', questionPt: 'Você trabalhou ontem?', cuePt: 'Sim, eu trabalhei o dia todo.', answer: 'Yes, I worked all day.', accepts: ['I worked all day'] },
  { id: 'sp-A-past-2', cellId: 'A-past', question: 'What time did you get home?', questionPt: 'A que horas você chegou em casa?', cuePt: 'Eu cheguei em casa às sete.', answer: 'I got home at seven.', accepts: ['I arrived home at seven'] },
  { id: 'sp-A-past-3', cellId: 'A-past', question: 'Where did you go last weekend?', questionPt: 'Aonde você foi no fim de semana passado?', cuePt: 'Eu fui à praia com a minha família.', answer: 'I went to the beach with my family.' },

  // ------------------------------------------------------------ A · presente
  { id: 'sp-A-present-1', cellId: 'A-present', question: 'Do you work on Saturdays?', questionPt: 'Você trabalha aos sábados?', cuePt: 'Não, eu não trabalho nos fins de semana.', answer: "No, I don't work on weekends.", accepts: ["I don't work on weekends"] },
  { id: 'sp-A-present-2', cellId: 'A-present', question: 'What does your brother do?', questionPt: 'O que seu irmão faz?', cuePt: 'Ele trabalha num restaurante.', answer: 'He works at a restaurant.' },
  { id: 'sp-A-present-3', cellId: 'A-present', question: 'How often do you study English?', questionPt: 'Com que frequência você estuda inglês?', cuePt: 'Eu estudo inglês todos os dias.', answer: 'I study English every day.' },

  // ------------------------------------------------------------ A · perfect (D1)
  { id: 'sp-D1-1', cellId: 'D1', question: 'Have you eaten today?', questionPt: 'Você já comeu hoje?', cuePt: 'Ainda não, eu não comi nada.', answer: "Not yet, I haven't eaten anything.", accepts: ["I haven't eaten anything yet"] },
  { id: 'sp-D1-2', cellId: 'D1', question: 'Has your sister called you?', questionPt: 'Sua irmã te ligou?', cuePt: 'Sim, ela ligou hoje de manhã.', answer: 'Yes, she has called this morning.', accepts: ['She has called this morning'] },
  { id: 'sp-D1-3', cellId: 'D1', question: 'How many countries have you visited?', questionPt: 'Quantos países você visitou?', cuePt: 'Eu visitei três países.', answer: 'I have visited three countries.', accepts: ["I've visited three countries"] },

  // ------------------------------------------------------------ A · would
  { id: 'sp-A-would-1', cellId: 'A-would', question: 'What would you do with a million dollars?', questionPt: 'O que você faria com um milhão de dólares?', cuePt: 'Eu compraria uma casa.', answer: 'I would buy a house.', accepts: ["I'd buy a house"] },
  { id: 'sp-A-would-2', cellId: 'A-would', question: 'Would you move to another country?', questionPt: 'Você se mudaria para outro país?', cuePt: 'Sim, eu me mudaria se eu tivesse a chance.', answer: 'Yes, I would move if I had the chance.' },

  // ------------------------------------------------------------ A · futuro
  { id: 'sp-A-future-1', cellId: 'A-future', question: 'Will you travel next month?', questionPt: 'Você vai viajar mês que vem?', cuePt: 'Não, eu não vou viajar mês que vem.', answer: "No, I won't travel next month.", accepts: ["I won't travel next month"] },
  { id: 'sp-A-future-2', cellId: 'A-future', question: 'When will you finish the project?', questionPt: 'Quando você vai terminar o projeto?', cuePt: 'Eu vou terminar na sexta.', answer: 'I will finish it on Friday.', accepts: ["I'll finish it on Friday"] },

  // ------------------------------------------------------------ B · passado
  { id: 'sp-B-past-1', cellId: 'B-past', question: 'Were you tired last night?', questionPt: 'Você estava cansado ontem à noite?', cuePt: 'Sim, eu estava muito cansado.', answer: 'Yes, I was very tired.', accepts: ['I was very tired'] },
  { id: 'sp-B-past-2', cellId: 'B-past', question: 'Where were you this morning?', questionPt: 'Onde você estava hoje de manhã?', cuePt: 'Eu estava no trabalho.', answer: 'I was at work.' },

  // ------------------------------------------------------------ B · presente
  { id: 'sp-B-present-1', cellId: 'B-present', question: 'Are you busy right now?', questionPt: 'Você está ocupado agora?', cuePt: 'Sim, eu estou trabalhando.', answer: 'Yes, I am working.', accepts: ["I'm working"] },
  { id: 'sp-B-present-2', cellId: 'B-present', question: 'What are you doing this weekend?', questionPt: 'O que você está fazendo neste fim de semana?', cuePt: 'Eu estou visitando a minha mãe.', answer: 'I am visiting my mother.', accepts: ["I'm visiting my mother"] },
  { id: 'sp-B-present-3', cellId: 'B-present', question: 'Is your coffee cold?', questionPt: 'Seu café está frio?', cuePt: 'Não, ele não está frio.', answer: "No, it isn't cold.", accepts: ["It's not cold"] },

  // ------------------------------------------------------------ B · perfect
  { id: 'sp-B-perfect-1', cellId: 'B-perfect', question: 'How have you been lately?', questionPt: 'Como você tem passado ultimamente?', cuePt: 'Eu tenho estado muito ocupado.', answer: 'I have been very busy.', accepts: ["I've been very busy"] },
  { id: 'sp-B-perfect-2', cellId: 'B-perfect', question: 'How long have you been here?', questionPt: 'Há quanto tempo você está aqui?', cuePt: 'Eu estou aqui desde maio.', answer: 'I have been here since May.', accepts: ["I've been here since May"] },
  { id: 'sp-B-perfect-3', cellId: 'B-perfect', question: 'Have you been sick this week?', questionPt: 'Você esteve doente esta semana?', cuePt: 'Não, eu não estive doente.', answer: "No, I haven't been sick.", accepts: ["I haven't been sick"] },

  // ------------------------------------------------------------ B · would
  { id: 'sp-B-would-1', cellId: 'B-would', question: 'Would you be free tomorrow?', questionPt: 'Você estaria livre amanhã?', cuePt: 'Sim, eu estaria livre de manhã.', answer: 'Yes, I would be free in the morning.' },

  // ------------------------------------------------------------ B · futuro
  { id: 'sp-B-future-1', cellId: 'B-future', question: 'Will you be at home tonight?', questionPt: 'Você vai estar em casa hoje à noite?', cuePt: 'Sim, eu vou estar em casa depois das oito.', answer: 'Yes, I will be at home after eight.', accepts: ["I'll be at home after eight"] },
  { id: 'sp-B-future-2', cellId: 'B-future', question: 'Where will you be next week?', questionPt: 'Onde você vai estar semana que vem?', cuePt: 'Eu vou estar viajando a trabalho.', answer: 'I will be traveling for work.', accepts: ["I'll be travelling for work", "I'll be traveling for work"] },

  // ------------------------------------------------------------ B2 · passado
  { id: 'sp-B2-past-1', cellId: 'B2-past', question: 'Was there any problem at work?', questionPt: 'Teve algum problema no trabalho?', cuePt: 'Não, não teve problema nenhum.', answer: "No, there wasn't any problem.", accepts: ["There wasn't any problem"] },
  { id: 'sp-B2-past-2', cellId: 'B2-past', question: 'How many people were there at the party?', questionPt: 'Quantas pessoas tinha na festa?', cuePt: 'Tinha umas vinte pessoas.', answer: 'There were about twenty people.' },

  // ------------------------------------------------------------ B2 · presente
  { id: 'sp-B2-present-1', cellId: 'B2-present', question: 'Is there any coffee left?', questionPt: 'Ainda tem café?', cuePt: 'Sim, tem um pouco na cozinha.', answer: 'Yes, there is some in the kitchen.', accepts: ["There's some in the kitchen"] },
  { id: 'sp-B2-present-2', cellId: 'B2-present', question: 'Are there any good restaurants near here?', questionPt: 'Tem algum restaurante bom aqui perto?', cuePt: 'Sim, tem dois na próxima rua.', answer: 'Yes, there are two on the next street.' },

  // ------------------------------------------------------------ B2 · perfect
  { id: 'sp-B2-perfect-1', cellId: 'B2-perfect', question: 'Has there been any news?', questionPt: 'Teve alguma novidade?', cuePt: 'Não, não teve novidade nenhuma.', answer: "No, there hasn't been any news.", accepts: ["There hasn't been any news"] },
  { id: 'sp-B2-perfect-2', cellId: 'B2-perfect', question: 'Have there been many changes at work?', questionPt: 'Houve muitas mudanças no trabalho?', cuePt: 'Sim, houve muitas mudanças este ano.', answer: 'Yes, there have been many changes this year.' },

  // ------------------------------------------------------------ B2 · would / futuro
  { id: 'sp-B2-would-1', cellId: 'B2-would', question: 'Would there be any problem if I arrived late?', questionPt: 'Teria algum problema se eu chegasse tarde?', cuePt: 'Não, não teria problema nenhum.', answer: "No, there wouldn't be any problem." },
  { id: 'sp-B2-future-1', cellId: 'B2-future', question: 'Will there be any food at the meeting?', questionPt: 'Vai ter comida na reunião?', cuePt: 'Sim, vai ter café e lanche.', answer: 'Yes, there will be coffee and snacks.' },

  // ------------------------------------------------------------ C · passado
  { id: 'sp-C-past-1', cellId: 'C-past', question: 'Could you swim when you were a child?', questionPt: 'Você sabia nadar quando era criança?', cuePt: 'Não, eu não sabia nadar.', answer: "No, I couldn't swim.", accepts: ["I couldn't swim"] },
  { id: 'sp-C-past-2', cellId: 'C-past', question: 'Did you have to work last Saturday?', questionPt: 'Você teve que trabalhar sábado passado?', cuePt: 'Sim, eu tive que trabalhar o dia todo.', answer: 'Yes, I had to work all day.', accepts: ['I had to work all day'] },

  // ------------------------------------------------------------ C · presente
  { id: 'sp-C-present-1', cellId: 'C-present', question: 'Can you help me with this?', questionPt: 'Você pode me ajudar com isto?', cuePt: 'Sim, eu posso te ajudar agora.', answer: 'Yes, I can help you now.', accepts: ['I can help you now'] },
  { id: 'sp-C-present-2', cellId: 'C-present', question: 'Can your brother drive?', questionPt: 'Seu irmão sabe dirigir?', cuePt: 'Não, ele não sabe dirigir.', answer: "No, he can't drive.", accepts: ["He can't drive"] },

  // ------------------------------------------------------------ C · perfect
  { id: 'sp-C-perfect-1', cellId: 'C-perfect', question: 'Have you been able to sleep well?', questionPt: 'Você tem conseguido dormir bem?', cuePt: 'Não, eu não tenho conseguido dormir.', answer: "No, I haven't been able to sleep.", accepts: ["I haven't been able to sleep"] },
  { id: 'sp-C-perfect-2', cellId: 'C-perfect', question: 'Have you been able to talk to her?', questionPt: 'Você conseguiu falar com ela?', cuePt: 'Sim, eu consegui falar com ela ontem.', answer: 'Yes, I have been able to talk to her.', accepts: ["I've been able to talk to her"] },

  // ------------------------------------------------------------ C · would / futuro
  { id: 'sp-C-would-1', cellId: 'C-would', question: 'Could you open the window, please?', questionPt: 'Você poderia abrir a janela, por favor?', cuePt: 'Claro, eu abro agora.', answer: 'Sure, I will open it now.', accepts: ["Sure, I'll open it now"] },
  { id: 'sp-C-would-2', cellId: 'C-would', question: 'What should I do?', questionPt: 'O que eu deveria fazer?', cuePt: 'Você deveria falar com o seu chefe.', answer: 'You should talk to your boss.' },
  { id: 'sp-C-future-1', cellId: 'C-future', question: 'Will you be able to come to the party?', questionPt: 'Você vai conseguir vir à festa?', cuePt: 'Não, eu não vou conseguir vir.', answer: "No, I won't be able to come.", accepts: ["I won't be able to come"] },

  // ------------------------------------------------------------ B3 · os três "vou"
  { id: 'sp-B3-1', cellId: 'B3', question: 'What are you going to do tonight?', questionPt: 'O que você vai fazer hoje à noite?', cuePt: 'Eu vou cozinhar para a minha família.', answer: 'I am going to cook for my family.', accepts: ["I'm going to cook for my family"] },
  { id: 'sp-B3-2', cellId: 'B3', question: 'Do you go to the gym every week?', questionPt: 'Você vai à academia toda semana?', cuePt: 'Sim, eu vou três vezes por semana.', answer: 'Yes, I go three times a week.' },
  { id: 'sp-B3-3', cellId: 'B3', question: 'Do you think it will rain tomorrow?', questionPt: 'Você acha que vai chover amanhã?', cuePt: 'Eu acho que vai chover à tarde.', answer: 'I think it will rain in the afternoon.' },

  // ------------------------------------------------------------ D2 · yet / already
  { id: 'sp-D2-1', cellId: 'D2', question: 'Have you finished your work yet?', questionPt: 'Você já terminou o seu trabalho?', cuePt: 'Sim, eu já terminei.', answer: 'Yes, I have already finished.', accepts: ["I've already finished"] },
  { id: 'sp-D2-2', cellId: 'D2', question: 'Has the movie started yet?', questionPt: 'O filme já começou?', cuePt: 'Não, ainda não começou.', answer: "No, it hasn't started yet.", accepts: ["It hasn't started yet"] },

  // ------------------------------------------------------------ D3 · ever / been to
  { id: 'sp-D3-1', cellId: 'D3', question: 'Have you ever been to the United States?', questionPt: 'Você já foi aos Estados Unidos?', cuePt: 'Não, eu nunca fui lá.', answer: "No, I have never been there.", accepts: ["I've never been there"] },
  { id: 'sp-D3-2', cellId: 'D3', question: 'Have you ever tried Japanese food?', questionPt: 'Você já experimentou comida japonesa?', cuePt: 'Sim, eu já experimentei algumas vezes.', answer: 'Yes, I have tried it a few times.', accepts: ["I've tried it a few times"] },

  // ------------------------------------------------------------ D4 · how long
  { id: 'sp-D4-1', cellId: 'D4', question: 'How long have you been studying English?', questionPt: 'Há quanto tempo você estuda inglês?', cuePt: 'Eu estudo inglês há dois anos.', answer: 'I have been studying English for two years.', accepts: ["I've been studying English for two years"] },
  { id: 'sp-D4-2', cellId: 'D4', question: 'How long have you known your best friend?', questionPt: 'Há quanto tempo você conhece o seu melhor amigo?', cuePt: 'Eu o conheço desde a escola.', answer: 'I have known him since school.', accepts: ["I've known him since school"] },
];

/** Quantidade de itens por célula — usado na tela de seleção. */
export function promptCountByCell(): Record<string, number> {
  const out: Record<string, number> = {};
  for (const p of SPEAKING_PROMPTS) out[p.cellId] = (out[p.cellId] ?? 0) + 1;
  return out;
}

/** Itens de um conjunto de células (vazio = todos). */
export function promptsFor(cellIds: string[]): SpeakingPrompt[] {
  if (cellIds.length === 0) return SPEAKING_PROMPTS;
  return SPEAKING_PROMPTS.filter((p) => cellIds.includes(p.cellId));
}

/** Todas as formas aceitas de um item, da modelo para as variantes. */
export const acceptedAnswers = (p: SpeakingPrompt): string[] => [p.answer, ...(p.accepts ?? [])];
