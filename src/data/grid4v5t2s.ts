// Grade 4V5T2S — o mapa do professor virando tela.
//
// A lógica do método: escolha a LINHA (tipo de verbo) e a COLUNA (tempo), e a
// pergunta sai pronta. S←V→O na afirmativa; na pergunta, sujeito e verbo se
// invertem. 4 grupos de Verbos × 5 Tempos × 2 Sentidos = 4V5T2S.
//
// Progresso: cada célula dominada é uma etapa no useVerbLessonStore
// (lessonId GRID_LESSON_ID), como as famílias do PastTrainer.

export const GRID_LESSON_ID = 'grid-4v5t2s';
export const GRID_TITLE = 'Grade 4V5T2S';
export const GRID_SUBTITLE = 'Linha × coluna: a pergunta sai pronta';

export type RowId = 'A' | 'B' | 'B2' | 'C';
export type ColId = 'past' | 'present' | 'would' | 'future';
export type BandId = 'B3' | 'D1' | 'D2' | 'D3' | 'D4';

export interface Example {
  en: string;
  pt: string;
}

export interface CatchError {
  wrong: string;
  right: string;
  why: string;
}

/** Pergunta gerada cruzando a célula com um wh- da coluna esquerda do mapa. */
export interface WhQuestion {
  wh: string;
  en: string;
  pt: string;
}

/** Sub-bloco de uma faixa (os três "vou" do B3, yet/already do D2…). */
export interface CellBlock {
  label: string;
  opener: string;
  ex: Example;
  note: string;
}

export interface GridCell {
  id: string;
  row?: RowId;
  col?: ColId;
  band?: BandId;
  /** O que aparece escrito na célula da grade. */
  opener: string;
  title: string;
  /** A regra de ouro da célula, em uma frase. */
  rule: string;
  /** Pergunta / afirmativa / negativa — o 2S do método. */
  structure: { q: Example; a: Example; n: Example };
  markers?: string[];
  notes?: string[];
  blocks?: CellBlock[];
  examples: Example[];
  errors: CatchError[];
  whQuestions: WhQuestion[];
}

// ============================================================================
// Linhas e colunas da grade

export const GRID_ROWS: { id: RowId; name: string; sub: string; pt: string }[] = [
  { id: 'A', name: 'A', sub: 'do · does · did', pt: 'Verbos comuns' },
  { id: 'B', name: 'B', sub: 'am · is · are · was · were', pt: 'Ser / estar (to be)' },
  { id: 'B2', name: 'B2', sub: 'there + be … any', pt: 'Haver / existir / "ter"' },
  { id: 'C', name: 'C', sub: 'can · could · must · should', pt: 'Modais' },
];

export const GRID_COLS: { id: ColId; name: string; sub: string; markers: string[] }[] = [
  { id: 'past', name: 'Passado', sub: 'did', markers: ['yesterday', 'ago', 'in 1975', 'last + …'] },
  { id: 'present', name: 'Presente', sub: 'do / does', markers: ['every + …', 'always · often'] },
  { id: 'would', name: 'V+RIA', sub: 'would', markers: ['if you had…', 'if you were…'] },
  { id: 'future', name: 'Futuro', sub: 'will', markers: ['tomorrow', 'next + …'] },
];

/** last / next / every combinam com estas palavras (canto do mapa). */
export const TIME_WORDS = ['time', 'day', 'week', 'month', 'year'];

// ============================================================================
// As 16 células da grade principal

const CELLS_MAIN: GridCell[] = [
  // ---------------------------------------------------------------- Linha A
  {
    id: 'A-past',
    row: 'A',
    col: 'past',
    opener: 'did you…?',
    title: 'Passado · verbos comuns',
    rule: 'DID vale para todas as pessoas — e o verbo volta para a forma base na pergunta e na negativa.',
    structure: {
      q: { en: 'Did you work yesterday?', pt: 'Você trabalhou ontem?' },
      a: { en: 'I worked yesterday.', pt: 'Eu trabalhei ontem.' },
      n: { en: "I didn't work yesterday.", pt: 'Eu não trabalhei ontem.' },
    },
    markers: ['yesterday', 'ago', 'in 1975', 'last time/day/week/month/year'],
    notes: [
      'Pronúncia do -ED: /t/ depois de P, K, F, S, SH, CH, X (worked, stopped) · terminou em T ou D? ganha sílaba extra, /id/ (wanted, needed) · /d/ no resto (played, lived).',
      'Verbo irregular? A forma do passado está na lista dos 100 verbos (coluna vermelha = did).',
    ],
    examples: [
      { en: 'What time did you arrive there?', pt: 'A que horas você chegou lá?' },
      { en: 'Why did they leave so early?', pt: 'Por que eles saíram tão cedo?' },
    ],
    errors: [
      { wrong: 'Did you went to the party?', right: 'Did you go to the party?', why: 'Depois de did, o verbo volta para a base. O passado já está no did.' },
      { wrong: "I didn't worked.", right: "I didn't work.", why: "Mesma regra na negativa: didn't + verbo base." },
    ],
    whQuestions: [
      { wh: 'what', en: 'What did you do yesterday?', pt: 'O que você fez ontem?' },
      { wh: 'where', en: 'Where did he work last year?', pt: 'Onde ele trabalhou ano passado?' },
      { wh: 'when', en: 'When did you meet her?', pt: 'Quando você a conheceu?' },
      { wh: 'why', en: 'Why did they move?', pt: 'Por que eles se mudaram?' },
      { wh: 'what time', en: 'What time did you wake up?', pt: 'A que horas você acordou?' },
      { wh: 'how many', en: 'How many books did you read?', pt: 'Quantos livros você leu?' },
    ],
  },
  {
    id: 'A-present',
    row: 'A',
    col: 'present',
    opener: 'do you…? / does he…?',
    title: 'Presente · verbos comuns',
    rule: 'DO para I/you/we/they · DOES para he/she/it. Na pergunta o -s fica no does; na afirmativa, no verbo.',
    structure: {
      q: { en: 'Do you work here? / Does he work here?', pt: 'Você trabalha aqui? / Ele trabalha aqui?' },
      a: { en: 'I work here. / He works here.', pt: 'Eu trabalho aqui. / Ele trabalha aqui.' },
      n: { en: "I don't work here. / He doesn't work here.", pt: 'Eu não trabalho aqui. / Ele não trabalha aqui.' },
    },
    markers: ['every time/day/week/month/year', 'always · usually · often'],
    notes: ['WHO como sujeito não usa do/does: "Who studies here?" — caso 2 do mapa.'],
    examples: [
      { en: 'What kind of music do you listen to?', pt: 'Que tipo de música você escuta?' },
      { en: 'How much does it cost?', pt: 'Quanto custa?' },
    ],
    errors: [
      { wrong: 'Does he works here?', right: 'Does he work here?', why: 'O -s da 3ª pessoa já está no does — nunca nos dois.' },
      { wrong: 'He work a lot.', right: 'He works a lot.', why: 'Na afirmativa da 3ª pessoa (he/she/it) o verbo leva -s.' },
    ],
    whQuestions: [
      { wh: 'what', en: 'What do you do?', pt: 'O que você faz (da vida)?' },
      { wh: 'where', en: 'Where does she live?', pt: 'Onde ela mora?' },
      { wh: 'how often', en: 'How often do you study?', pt: 'Com que frequência você estuda?' },
      { wh: 'what time', en: 'What time does he start?', pt: 'A que horas ele começa?' },
      { wh: 'what kind of', en: 'What kind of food do you like?', pt: 'Que tipo de comida você gosta?' },
      { wh: 'who', en: 'Who studies here?', pt: 'Quem estuda aqui? (sujeito → sem do!)' },
    ],
  },
  {
    id: 'A-would',
    row: 'A',
    col: 'would',
    opener: 'would you…?',
    title: 'V+RIA · verbos comuns',
    rule: 'WOULD = a terminação -RIA do português (faria, iria, compraria). Gatilho: if you had… / if you were…',
    structure: {
      q: { en: 'Would you travel more?', pt: 'Você viajaria mais?' },
      a: { en: 'If I had money, I would travel more.', pt: 'Se eu tivesse dinheiro, eu viajaria mais.' },
      n: { en: "I wouldn't travel alone.", pt: 'Eu não viajaria sozinho.' },
    },
    markers: ['if you had…', 'if you were… (2nd)'],
    examples: [
      { en: 'What would you do with a million dollars?', pt: 'O que você faria com um milhão de dólares?' },
      { en: 'If I were you, I would study every day.', pt: 'Se eu fosse você, eu estudaria todo dia.' },
    ],
    errors: [
      { wrong: 'If I would have money, I would travel.', right: 'If I had money, I would travel.', why: 'O would fica na resposta; dentro do if entra o passado (had/were).' },
    ],
    whQuestions: [
      { wh: 'what', en: 'What would you do?', pt: 'O que você faria?' },
      { wh: 'where', en: 'Where would you live?', pt: 'Onde você moraria?' },
      { wh: 'who', en: 'Who would you call first?', pt: 'Para quem você ligaria primeiro?' },
    ],
  },
  {
    id: 'A-future',
    row: 'A',
    col: 'future',
    opener: 'will you…?',
    title: 'Futuro · verbos comuns',
    rule: 'WILL vale para todas as pessoas, e o verbo vem direto — sem to.',
    structure: {
      q: { en: 'Will you work tomorrow?', pt: 'Você vai trabalhar amanhã?' },
      a: { en: "I'll work tomorrow.", pt: 'Eu vou trabalhar amanhã.' },
      n: { en: "I won't work tomorrow.", pt: 'Eu não vou trabalhar amanhã.' },
    },
    markers: ['tomorrow', 'next time/day/week/month/year'],
    examples: [
      { en: 'When will you visit us?', pt: 'Quando você vai nos visitar?' },
      { en: 'Will you help me with this?', pt: 'Você vai me ajudar com isto?' },
    ],
    errors: [
      { wrong: 'Will you to help me?', right: 'Will you help me?', why: 'Depois de will o verbo vem direto, sem to.' },
    ],
    whQuestions: [
      { wh: 'what', en: 'What will you do tomorrow?', pt: 'O que você vai fazer amanhã?' },
      { wh: 'where', en: 'Where will he live next year?', pt: 'Onde ele vai morar ano que vem?' },
      { wh: 'when', en: 'When will you finish?', pt: 'Quando você vai terminar?' },
    ],
  },

  // ---------------------------------------------------------------- Linha B
  {
    id: 'B-past',
    row: 'B',
    col: 'past',
    opener: 'were you…? / was he…?',
    title: 'Passado · ser/estar',
    rule: 'O be não usa did: ele mesmo vai para a frente na pergunta. WAS (I/he/she/it) · WERE (you/we/they).',
    structure: {
      q: { en: 'Were you tired? / Was he at home?', pt: 'Você estava cansado? / Ele estava em casa?' },
      a: { en: 'I was tired.', pt: 'Eu estava cansado.' },
      n: { en: "I wasn't tired.", pt: 'Eu não estava cansado.' },
    },
    markers: ['yesterday', 'ago', 'in 1975', 'last + …'],
    notes: ['Depois do be: +ADJ (was tired) · V+ING (was working = estava trabalhando) · V#3 (was made = passiva).'],
    examples: [
      { en: 'Where were you in 2015?', pt: 'Onde você estava em 2015?' },
      { en: 'Was she sleeping when I called?', pt: 'Ela estava dormindo quando eu liguei?' },
    ],
    errors: [
      { wrong: 'Did you be tired?', right: 'Were you tired?', why: 'O be nunca usa did — ele se inverte sozinho.' },
      { wrong: 'Where you were?', right: 'Where were you?', why: 'Na pergunta o be passa na frente do sujeito (S↔V).' },
    ],
    whQuestions: [
      { wh: 'where', en: 'Where were you last night?', pt: 'Onde você estava ontem à noite?' },
      { wh: 'why', en: 'Why was he so angry?', pt: 'Por que ele estava tão bravo?' },
      { wh: 'how', en: 'How was your day?', pt: 'Como foi o seu dia?' },
    ],
  },
  {
    id: 'B-present',
    row: 'B',
    col: 'present',
    opener: 'are you…? / is he…? (am I…?)',
    title: 'Presente · ser/estar',
    rule: 'AM (I) · IS (he/she/it) · ARE (you/we/they). Com V+ING é o agora: now · at the moment. O "anda fazendo" (lately) vai para have you been + ing.',
    structure: {
      q: { en: 'Are you ready? / Is she working now?', pt: 'Você está pronto? / Ela está trabalhando agora?' },
      a: { en: 'She is working now.', pt: 'Ela está trabalhando agora.' },
      n: { en: "She isn't working now.", pt: 'Ela não está trabalhando agora.' },
    },
    markers: ['now', 'right now', 'at the moment', 'look!'],
    notes: [
      'Os três usos depois do be: V+ING (agora) · +ADJ (are you tired?) · V#3 (passiva: is made in Brazil).',
      '"Anda fazendo…" (lately) também cai aqui: have you been + ing — veja a faixa How Long.',
    ],
    examples: [
      { en: 'Are you listening to me?', pt: 'Você está me ouvindo?' },
      { en: 'Is he getting fat again?', pt: 'Ele está engordando de novo?' },
    ],
    errors: [
      { wrong: 'Do you be ready?', right: 'Are you ready?', why: 'O be não usa do/does — ele se inverte sozinho.' },
      { wrong: 'She working now.', right: 'She is working now.', why: 'O V+ING não anda sozinho: precisa do be antes.' },
    ],
    whQuestions: [
      { wh: 'what', en: 'What are you doing right now?', pt: 'O que você está fazendo agora?' },
      { wh: 'where', en: 'Where are they going?', pt: 'Aonde eles estão indo?' },
      { wh: 'why', en: 'Why is she crying?', pt: 'Por que ela está chorando?' },
      { wh: 'how', en: 'How are you?', pt: 'Como você está?' },
    ],
  },
  {
    id: 'B-would',
    row: 'B',
    col: 'would',
    opener: 'would you be…?',
    title: 'V+RIA · ser/estar',
    rule: 'SERIA / ESTARIA = would be. O be não some depois do would.',
    structure: {
      q: { en: 'Would you be happy there?', pt: 'Você seria feliz lá?' },
      a: { en: 'I would be happy there.', pt: 'Eu seria feliz lá.' },
      n: { en: "I wouldn't be happy there.", pt: 'Eu não seria feliz lá.' },
    },
    markers: ['if you had…', 'if you were…'],
    examples: [
      { en: 'Would you be ready by 8?', pt: 'Você estaria pronto até as 8?' },
      { en: 'If I lived there, I would be happier.', pt: 'Se eu morasse lá, eu seria mais feliz.' },
    ],
    errors: [
      { wrong: 'Would you happy there?', right: 'Would you be happy there?', why: 'O adjetivo precisa do be: would BE happy.' },
    ],
    whQuestions: [
      { wh: 'where', en: 'Where would you be right now, if you could choose?', pt: 'Onde você estaria agora, se pudesse escolher?' },
      { wh: 'how', en: 'How would your life be different without music?', pt: 'Como a sua vida seria diferente sem música?' },
    ],
  },
  {
    id: 'B-future',
    row: 'B',
    col: 'future',
    opener: 'will you be…?',
    title: 'Futuro · ser/estar',
    rule: 'SERÁ / ESTARÁ = will be. Com V+ING vira o futuro contínuo: estará fazendo.',
    structure: {
      q: { en: 'Will you be home tonight?', pt: 'Você vai estar em casa hoje à noite?' },
      a: { en: "I'll be home tonight.", pt: 'Vou estar em casa hoje à noite.' },
      n: { en: "I won't be home tonight.", pt: 'Não vou estar em casa hoje à noite.' },
    },
    markers: ['tomorrow', 'next + …', 'at 8 pm'],
    examples: [
      { en: 'Will you be working at 8 pm?', pt: 'Você vai estar trabalhando às 8 da noite?' },
      { en: "She'll be here soon.", pt: 'Ela estará aqui em breve.' },
    ],
    errors: [
      { wrong: 'Will you home tonight?', right: 'Will you be home tonight?', why: 'O be não some: will BE home.' },
    ],
    whQuestions: [
      { wh: 'where', en: 'Where will you be tomorrow?', pt: 'Onde você vai estar amanhã?' },
      { wh: 'what time', en: 'What time will you be free?', pt: 'A que horas você vai estar livre?' },
    ],
  },

  // ---------------------------------------------------------------- Linha B2
  {
    id: 'B2-past',
    row: 'B2',
    col: 'past',
    opener: 'was there any…? / were there many…?',
    title: 'Passado · haver/existir',
    rule: 'O "tinha" de existir é there was/were — nunca had. Singular: was there · plural: were there.',
    structure: {
      q: { en: 'Was there any problem?', pt: 'Teve (houve) algum problema?' },
      a: { en: 'There was a problem.', pt: 'Teve um problema.' },
      n: { en: "There wasn't any problem.", pt: 'Não teve problema nenhum.' },
    },
    markers: ['any + body/one', 'any + thing', 'any + where', 'any + way'],
    examples: [
      { en: 'Were there many people at the party?', pt: 'Tinha muita gente na festa?' },
      { en: 'There was nobody home.', pt: 'Não tinha ninguém em casa.' },
    ],
    errors: [
      { wrong: 'Had any problem?', right: 'Was there any problem?', why: 'O "ter" de existência é there be — have é possuir.' },
    ],
    whQuestions: [
      { wh: 'how many', en: 'How many people were there?', pt: 'Quantas pessoas tinha lá?' },
      { wh: 'why', en: 'Why was there so much noise?', pt: 'Por que tinha tanto barulho?' },
    ],
  },
  {
    id: 'B2-present',
    row: 'B2',
    col: 'present',
    opener: 'is there any…? / are there many…?',
    title: 'Presente · haver/existir',
    rule: 'O "tem" de existir é there is/are. ANY na pergunta e na negativa · SOME na afirmativa e na oferta.',
    structure: {
      q: { en: 'Is there any coffee?', pt: 'Tem café?' },
      a: { en: 'There is some coffee.', pt: 'Tem um pouco de café.' },
      n: { en: "There isn't any coffee.", pt: 'Não tem café nenhum.' },
    },
    markers: ['anybody · anything · anywhere', 'some+ (oferta)', 'every+'],
    examples: [
      { en: 'Are there many students in your class?', pt: 'Tem muitos alunos na sua turma?' },
      { en: 'There is a place for everyone.', pt: 'Há um lugar para todos.' },
    ],
    errors: [
      { wrong: 'Have a market near here?', right: 'Is there a market near here?', why: 'O "tem" de existir é there is — não have.' },
    ],
    whQuestions: [
      { wh: 'how many', en: 'How many students are there?', pt: 'Quantos alunos tem?' },
      { wh: 'what', en: 'What is there to eat?', pt: 'O que tem para comer?' },
    ],
  },
  {
    id: 'B2-would',
    row: 'B2',
    col: 'would',
    opener: 'would there be any…?',
    title: 'V+RIA · haver/existir',
    rule: 'HAVERIA / TERIA (de existir) = would there be.',
    structure: {
      q: { en: 'Would there be any problem if I came later?', pt: 'Teria algum problema se eu viesse mais tarde?' },
      a: { en: 'There would be time for everything.', pt: 'Haveria tempo para tudo.' },
      n: { en: "There wouldn't be any problem.", pt: 'Não haveria problema nenhum.' },
    },
    examples: [
      { en: 'Would there be enough food for ten people?', pt: 'Teria comida suficiente para dez pessoas?' },
    ],
    errors: [
      { wrong: 'Would have any problem?', right: 'Would there be any problem?', why: 'Existência é there be em todos os tempos: would THERE BE.' },
    ],
    whQuestions: [
      { wh: 'how many', en: 'How many people would there be?', pt: 'Quantas pessoas haveria?' },
    ],
  },
  {
    id: 'B2-future',
    row: 'B2',
    col: 'future',
    opener: 'will there be any…?',
    title: 'Futuro · haver/existir',
    rule: 'HAVERÁ / VAI TER = will there be.',
    structure: {
      q: { en: 'Will there be any food at the party?', pt: 'Vai ter comida na festa?' },
      a: { en: 'There will be plenty of food.', pt: 'Vai ter bastante comida.' },
      n: { en: "There won't be any food.", pt: 'Não vai ter comida nenhuma.' },
    },
    markers: ['tomorrow', 'next + …'],
    examples: [
      { en: 'Will there be anybody there?', pt: 'Vai ter alguém lá?' },
    ],
    errors: [
      { wrong: 'Will have food at the party?', right: 'Will there be food at the party?', why: 'Existência: will THERE BE — o have não entra.' },
    ],
    whQuestions: [
      { wh: 'how many', en: 'How many guests will there be?', pt: 'Quantos convidados vai ter?' },
    ],
  },

  // ---------------------------------------------------------------- Linha C
  {
    id: 'C-past',
    row: 'C',
    col: 'past',
    opener: 'could you…? / did you have to…?',
    title: 'Passado · modais',
    rule: 'COULD (sem to) = podia/conseguia. Com to: were you able to · did you have to.',
    structure: {
      q: { en: 'Could you swim when you were a child?', pt: 'Você sabia nadar quando era criança?' },
      a: { en: 'I could swim. / I had to work.', pt: 'Eu sabia nadar. / Eu tive que trabalhar.' },
      n: { en: "I couldn't swim. / I didn't have to work.", pt: 'Eu não sabia nadar. / Eu não precisei trabalhar.' },
    },
    notes: ['O to riscado no mapa: could NUNCA leva to. Já be able to e have to são com to mesmo.'],
    examples: [
      { en: 'Were you able to finish on time?', pt: 'Você conseguiu terminar a tempo?' },
      { en: 'Did I have to say that?', pt: 'Eu precisava ter dito aquilo?' },
    ],
    errors: [
      { wrong: 'Could you to swim?', right: 'Could you swim?', why: 'Modal + verbo base, sem to — o to riscado do mapa.' },
    ],
    whQuestions: [
      { wh: 'why', en: 'Why did you have to leave?', pt: 'Por que você teve que ir embora?' },
      { wh: 'what', en: 'What could you do about it?', pt: 'O que você podia fazer a respeito?' },
    ],
  },
  {
    id: 'C-present',
    row: 'C',
    col: 'present',
    opener: 'can you…? / must I…? / should I…?',
    title: 'Presente · modais',
    rule: 'CAN (poder/saber/conseguir) · MUST (dever, obrigação) · SHOULD (dever, conselho) — todos + verbo base, sem to e sem -s.',
    structure: {
      q: { en: 'Can you help me?', pt: 'Você pode me ajudar?' },
      a: { en: 'I can help you.', pt: 'Eu posso te ajudar.' },
      n: { en: "I can't help you.", pt: 'Eu não posso te ajudar.' },
    },
    notes: ['Glossário do mapa: poder, saber, conseguir (can) · dever (must = obrigação / should = conselho).'],
    examples: [
      { en: 'Should I call her now?', pt: 'Eu deveria ligar para ela agora?' },
      { en: 'You must see this!', pt: 'Você tem que ver isso!' },
    ],
    errors: [
      { wrong: 'Can you to help me?', right: 'Can you help me?', why: 'Modal + verbo base, sem to.' },
      { wrong: 'He cans swim.', right: 'He can swim.', why: 'Modal não leva -s na 3ª pessoa.' },
    ],
    whQuestions: [
      { wh: 'what', en: 'What can you do?', pt: 'O que você sabe fazer?' },
      { wh: 'how', en: 'How can I get there?', pt: 'Como eu chego lá?' },
      { wh: 'why', en: 'Why should I wait?', pt: 'Por que eu deveria esperar?' },
    ],
  },
  {
    id: 'C-would',
    row: 'C',
    col: 'would',
    opener: 'could you…? / should I…?',
    title: 'V+RIA · modais',
    rule: 'PODERIA = could (pedido educado) · DEVERIA = should. Continua sem to.',
    structure: {
      q: { en: 'Could you open the window, please?', pt: 'Você poderia abrir a janela, por favor?' },
      a: { en: 'You should try again.', pt: 'Você deveria tentar de novo.' },
      n: { en: "You shouldn't say that.", pt: 'Você não deveria dizer isso.' },
    },
    examples: [
      { en: 'Could you help me with this, please?', pt: 'Você poderia me ajudar com isto, por favor?' },
      { en: 'What should I do?', pt: 'O que eu deveria fazer?' },
    ],
    errors: [
      { wrong: 'Should I to wait?', right: 'Should I wait?', why: 'O to riscado do mapa vale aqui também: should + verbo base.' },
    ],
    whQuestions: [
      { wh: 'what', en: 'What should I do?', pt: 'O que eu deveria fazer?' },
      { wh: 'where', en: 'Where could we go tonight?', pt: 'Aonde poderíamos ir hoje à noite?' },
    ],
  },
  {
    id: 'C-future',
    row: 'C',
    col: 'future',
    opener: 'will you be able to…? / will I have to…?',
    title: 'Futuro · modais',
    rule: 'CAN não tem futuro → will be able to. MUST não tem futuro → will have to. Dois modais nunca se juntam.',
    structure: {
      q: { en: 'Will you be able to come?', pt: 'Você vai conseguir vir?' },
      a: { en: "I'll be able to come.", pt: 'Eu vou conseguir vir.' },
      n: { en: "I won't be able to come.", pt: 'Eu não vou conseguir vir.' },
    },
    examples: [
      { en: 'Will I have to pay for it?', pt: 'Eu vou ter que pagar por isso?' },
    ],
    errors: [
      { wrong: 'Will you can come?', right: 'Will you be able to come?', why: 'Dois modais não se juntam: will + can não existe.' },
    ],
    whQuestions: [
      { wh: 'when', en: 'When will you be able to visit?', pt: 'Quando você vai conseguir visitar?' },
    ],
  },
];

// ============================================================================
// As faixas — B3 (os três "vou"), perfect (D1–D3) e how long (D4)

const CELLS_BANDS: GridCell[] = [
  {
    id: 'B3',
    band: 'B3',
    opener: 'os três "vou"',
    title: 'B3 · Vai / Vou — as 3 perguntas',
    rule: 'O "vou" do português vira três coisas diferentes em inglês. Pergunte-se: é plano, rotina ou dúvida?',
    structure: {
      q: { en: 'Are you going to travel tomorrow?', pt: 'Você vai viajar amanhã? (plano)' },
      a: { en: "I'm going to travel tomorrow.", pt: 'Eu vou viajar amanhã.' },
      n: { en: "I'm not going to travel.", pt: 'Eu não vou viajar.' },
    },
    blocks: [
      {
        label: 'IMEDIATO — plano, intenção',
        opener: 'are you going to…? / is she going to…?',
        ex: { en: 'Is she going to study tonight?', pt: 'Ela vai estudar hoje à noite?' },
        note: 'be + going to (gonna): já está decidido.',
      },
      {
        label: 'FREQUÊNCIA — rotina',
        opener: 'do you… every…?',
        ex: { en: 'Do you go to the gym every week?', pt: 'Você vai à academia toda semana?' },
        note: '"Vou sempre" é rotina → presente simples, não futuro!',
      },
      {
        label: 'DÚVIDA — será que…',
        opener: 'do you think you will…?',
        ex: { en: 'Do you think you will move abroad?', pt: 'Você acha que vai se mudar para fora?' },
        note: 'Opinião sobre o futuro: do you think + will.',
      },
    ],
    examples: [
      { en: 'What are you going to do this weekend?', pt: 'O que você vai fazer neste fim de semana?' },
    ],
    errors: [
      { wrong: 'I go to travel tomorrow.', right: "I'm going to travel tomorrow.", why: 'O "vou viajar" de plano usa be + going to.' },
    ],
    whQuestions: [
      { wh: 'what', en: 'What are you going to do?', pt: 'O que você vai fazer?' },
      { wh: 'where', en: 'Where is she going to stay?', pt: 'Onde ela vai ficar?' },
    ],
  },
  {
    id: 'D1',
    band: 'D1',
    opener: 'have you… (v3)?',
    title: 'Perfect · a base',
    rule: 'HAVE + V3 (particípio). Sem tempo definido na frase — o resultado importa, não o quando.',
    structure: {
      q: { en: 'Have you eaten today?', pt: 'Você já comeu hoje?' },
      a: { en: "Yes, I've eaten.", pt: 'Sim, já comi.' },
      n: { en: "No, I haven't eaten.", pt: 'Não, não comi (ainda).' },
    },
    markers: ['recently', 'today', 'this morning', 'all my life', 'once', 'several times', 'many times', 'look! (olha o resultado)'],
    notes: [
      'Regular: V3 = +ED — /t/ depois de P, K, F, S, SH, CH, X · /id/ depois de T e D (wanted) · /d/ no resto.',
      'Irregular: consulte a lista dos 100 verbos (coluna azul = have).',
      'Se a frase tem tempo definido (yesterday, last week), NÃO é perfect — é did.',
    ],
    examples: [
      { en: 'Has he called this morning?', pt: 'Ele ligou hoje de manhã? (a manhã ainda não acabou)' },
      { en: 'How many times have you watched it?', pt: 'Quantas vezes você assistiu?' },
    ],
    errors: [
      { wrong: 'Did you have eaten?', right: 'Have you eaten?', why: 'O perfect se monta só com have + V3 — did não entra.' },
      { wrong: 'Have you saw the news?', right: 'Have you seen the news?', why: 'Depois de have entra o particípio (V3): seen, não saw.' },
    ],
    whQuestions: [
      { wh: 'what', en: 'What have you done today?', pt: 'O que você fez hoje?' },
      { wh: 'how many', en: 'How many countries have you visited?', pt: 'Quantos países você visitou?' },
    ],
  },
  {
    id: 'D2',
    band: 'D2',
    opener: 'have you… + yet / already?',
    title: 'Perfect · yet, just, already',
    rule: 'JÁ (pergunta) e AINDA NÃO (negativa) = YET, no fim da frase. JÁ (afirmação) = ALREADY, entre o have e o verbo.',
    structure: {
      q: { en: 'Have you finished yet?', pt: 'Você já terminou?' },
      a: { en: "I've already finished.", pt: 'Eu já terminei.' },
      n: { en: "No, I haven't finished yet.", pt: 'Não, ainda não terminei.' },
    },
    blocks: [
      {
        label: 'YET — já? / ainda não',
        opener: '…yet? / not…yet',
        ex: { en: "Haven't you eaten yet?", pt: 'Você ainda não comeu?' },
        note: 'Perguntas e negativas, sempre no FIM da frase.',
      },
      {
        label: 'JUST — acabou de',
        opener: "I've just…",
        ex: { en: "I've just arrived.", pt: 'Acabei de chegar.' },
        note: 'Entre o have e o V3.',
      },
      {
        label: 'ALREADY — já (afirmação)',
        opener: "I've already…",
        ex: { en: "She's already left.", pt: 'Ela já foi embora.' },
        note: 'Entre o have e o V3.',
      },
    ],
    examples: [
      { en: 'Has the movie started yet?', pt: 'O filme já começou?' },
    ],
    errors: [
      { wrong: "I haven't finished already.", right: "I haven't finished yet.", why: 'Na negativa o "ainda não" é yet — already só em afirmação.' },
    ],
    whQuestions: [
      { wh: 'what', en: 'What have you already done today?', pt: 'O que você já fez hoje?' },
    ],
  },
  {
    id: 'D3',
    band: 'D3',
    opener: 'have you ever…? / been to…?',
    title: 'Perfect · ever, never, been to',
    rule: 'JÁ, alguma vez na vida = EVER. Nunca = NEVER (+before). Visitou um lugar = have you ever BEEN to.',
    structure: {
      q: { en: 'Have you ever been to Japan?', pt: 'Você já foi ao Japão (alguma vez)?' },
      a: { en: "Yes, I've been there once.", pt: 'Sim, fui lá uma vez.' },
      n: { en: "No, I've never been there before.", pt: 'Não, nunca fui lá.' },
    },
    markers: ['ever', 'never (before)', 'once', 'twice', 'many times'],
    examples: [
      { en: 'Have you ever tried sushi?', pt: 'Você já experimentou sushi?' },
      { en: "I've never seen snow before.", pt: 'Eu nunca vi neve (antes).' },
    ],
    errors: [
      { wrong: 'Have you ever went to Paris?', right: 'Have you ever been to Paris?', why: 'Depois de have entra V3 — e "visitar um lugar" no perfect é been to.' },
      { wrong: "I haven't never seen it.", right: "I've never seen it.", why: 'Never já carrega a negação — o have fica na forma positiva.' },
    ],
    whQuestions: [
      { wh: 'where', en: 'Where have you been?', pt: 'Por onde você andou?' },
      { wh: 'how many', en: 'How many times have you moved?', pt: 'Quantas vezes você já se mudou?' },
    ],
  },
  {
    id: 'D4',
    band: 'D4',
    opener: 'how long have you…?',
    title: 'How long · for e since',
    rule: 'Duas perguntas quase iguais: ação contínua = have been + ING · verbos de estado (know, have, be, like) = have + V3, sem -ing.',
    structure: {
      q: { en: 'How long have you been living here?', pt: 'Há quanto tempo você mora aqui?' },
      a: { en: 'I have been living here since 2004.', pt: 'Moro aqui desde 2004.' },
      n: { en: "I haven't been sleeping well lately.", pt: 'Não ando dormindo bem ultimamente.' },
    },
    markers: ['FOR = duração (for 5 years)', 'SINCE = ponto de partida (since 2004)'],
    blocks: [
      {
        label: 'AÇÃO CONTÍNUA — been + ing',
        opener: 'how long have you been v+ing?',
        ex: { en: 'How long have you been studying English?', pt: 'Há quanto tempo você estuda inglês?' },
        note: 'A ação começou no passado e continua agora.',
      },
      {
        label: 'VERBO DE ESTADO — sem -ing',
        opener: 'how long have you known…?',
        ex: { en: 'How long have you known her?', pt: 'Há quanto tempo você a conhece?' },
        note: 'know, have, be, like não usam -ing: I have known her for 10 years.',
      },
    ],
    examples: [
      { en: 'I have known him for 10 years.', pt: 'Eu o conheço há 10 anos.' },
    ],
    errors: [
      { wrong: 'How long have you been knowing her?', right: 'How long have you known her?', why: 'Know é verbo de estado — não usa -ing.' },
      { wrong: 'I live here since 2004.', right: 'I have lived here since 2004.', why: 'Com since/for a ponte passado→presente pede o perfect.' },
    ],
    whQuestions: [
      { wh: 'how long', en: 'How long have you worked there?', pt: 'Há quanto tempo você trabalha lá?' },
    ],
  },
];

export const GRID_CELLS: GridCell[] = [...CELLS_MAIN, ...CELLS_BANDS];

export const findCell = (id: string) => GRID_CELLS.find((c) => c.id === id);

export const cellAt = (row: RowId, col: ColId) =>
  GRID_CELLS.find((c) => c.row === row && c.col === col);

// ============================================================================
// A coluna esquerda do mapa: as perguntas-chave (wh-)

export interface WhWord {
  id: string;
  en: string;
  pt: string;
  note?: string;
}

export const WH_WORDS: WhWord[] = [
  { id: 'what', en: 'What / Which', pt: 'o quê / qual', note: 'What do you do? = o que você faz da vida' },
  { id: 'what time', en: 'What time', pt: 'a que horas', note: 'What time is it?' },
  { id: 'what kind of', en: 'What kind of', pt: 'que tipo de', note: 'What kind of music do you listen to?' },
  { id: 'where', en: 'Where', pt: 'onde', note: 'Where does she live?' },
  { id: 'when', en: 'When', pt: 'quando', note: 'When will you travel?' },
  { id: 'why', en: 'Why', pt: 'por quê', note: 'A resposta chama because.' },
  { id: 'who', en: 'Who', pt: 'quem', note: 'Caso 2: quem como SUJEITO não usa do — Who studies here?' },
  { id: 'how', en: 'How', pt: 'como', note: 'How have you been lately?' },
  { id: 'how old', en: 'How old', pt: 'quantos anos', note: 'Usa BE, não have: How old is your brother?' },
  { id: 'how many', en: 'How much / many', pt: 'quanto(s)', note: 'much = incontável (money) · many = contável (brothers)' },
  { id: 'how far', en: 'How far', pt: 'a que distância', note: 'How far is it? / How far do you live from here?' },
  { id: 'how often', en: 'How often', pt: 'com que frequência', note: 'How often do you read a book?' },
];

// ============================================================================
// O trilho: as 12 semanas do cronograma

export interface StudyWeek {
  n: number;
  title: string;
  goal: string;
  cellIds: string[];
  /** Semana de revisão/extras: etapa própria, concluída pelo botão. */
  extraStageId?: string;
  extraLabel?: string;
}

export const GRID_WEEKS: StudyWeek[] = [
  { n: 1, title: 'Presente · linha A', goal: 'do you / does he', cellIds: ['A-present'] },
  { n: 2, title: 'Presente · linha B', goal: 'are you / is he + V-ING', cellIds: ['B-present'] },
  { n: 3, title: 'Presente · B2 e C', goal: 'is there any / can-must-should', cellIds: ['B2-present', 'C-present'] },
  { n: 4, title: 'Passado · linha A', goal: 'did you + pronúncia do -ED', cellIds: ['A-past'] },
  { n: 5, title: 'Passado · B, B2 e C', goal: 'was-were / was there / could', cellIds: ['B-past', 'B2-past', 'C-past'] },
  {
    n: 6,
    title: 'Revisão',
    goal: 'presente × passado embaralhado',
    cellIds: [],
    extraStageId: 'review-mix',
    extraLabel: 'Revisei presente × passado embaralhado (+ comparativo, may-might-could, some/every)',
  },
  { n: 7, title: 'Futuro · todas as linhas', goal: 'will', cellIds: ['A-future', 'B-future', 'B2-future', 'C-future'] },
  { n: 8, title: 'B3 · os três "vou"', goal: 'going to / every / think you will', cellIds: ['B3'] },
  { n: 9, title: 'Perfect · a base', goal: 'have you + v3 / yet / already', cellIds: ['D1', 'D2'] },
  { n: 10, title: 'Perfect · ever', goal: 'have you EVER / been to / never', cellIds: ['D3'] },
  { n: 11, title: 'How long', goal: 'for × since', cellIds: ['D4'] },
  {
    n: 12,
    title: 'Would · V+RIA',
    goal: 'todas as linhas',
    cellIds: ['A-would', 'B-would', 'B2-would', 'C-would'],
    extraStageId: 'extras-12',
    extraLabel: 'Revisei os blocos soltos: comparativo/superlativo · may-might-could · some/every',
  },
];

/** Etapas que contam no progresso geral (células + semanas de revisão). */
export const GRID_TOTAL_STAGES =
  GRID_CELLS.length + GRID_WEEKS.filter((w) => w.extraStageId).length;

export function weekIsDone(week: StudyWeek, stagesDone: string[] | undefined): boolean {
  const done = stagesDone ?? [];
  const cellsOk = week.cellIds.every((id) => done.includes(id));
  const extraOk = !week.extraStageId || done.includes(week.extraStageId);
  return cellsOk && extraOk;
}

/** A semana sugerida: a primeira ainda não concluída (ou a 12ª). */
export function currentWeek(stagesDone: string[] | undefined): StudyWeek {
  return GRID_WEEKS.find((w) => !weekIsDone(w, stagesDone)) ?? GRID_WEEKS[GRID_WEEKS.length - 1];
}

// ============================================================================
// A rotina diária (página 1 do cronograma)

export const DAILY_ROUTINE_STEPS = [
  { min: 5, text: 'Ler a célula em voz alta: pergunta / afirmativa / negativa' },
  { min: 10, text: 'Escrever 10 perguntas (cruzar a célula com os wh- da esquerda)' },
  { min: 5, text: 'Responder em voz alta, sobre a MINHA vida real' },
  { min: 5, text: 'Revisar a célula da semana passada, sem olhar o mapa' },
];

export const ADVANCE_RULE =
  'Só avanço quando: 15 perguntas em 2 min, em voz alta, sem olhar — pelo menos 5 na 3ª pessoa (he/she/it).';

export const BEDTIME_ROUTINE = [
  '5 verbos irregulares (go – went – gone)',
  '1 phrasal verb (look at / look for / look after)',
  'Pronomes: I – my – me',
];
