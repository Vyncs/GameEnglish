// Aula 01 — Classificação de frases em A, B, B2, C e Imperative
// Baseado no método "raciocinar": o verbo é o coração da frase e determina a regra.
//   A          -> verbos de ação (usam do/does/did). A maioria dos verbos.
//   B          -> to be (ser/estar) — is/are/was/were.
//   B2         -> there is/there are e have (haver, existir, ter).
//   C          -> modais (can/could, should/must, will/would…) — poder, saber, conseguir, dever.
//   Imperative -> ordem/comando (sem sujeito): Cite, Conte, Fale, Descreva…

export type ClassifyCategory = 'A' | 'B' | 'B2' | 'C' | 'Imperative';

export interface ClassifyQuestion {
  id: number;
  pt: string;
  answer: ClassifyCategory;
  en: string;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  questions: ClassifyQuestion[];
}

export const CLASSIFY_CATEGORIES: { id: ClassifyCategory; label: string; hint: string }[] = [
  { id: 'A', label: 'A', hint: 'Verbo de ação — usa do / does / did' },
  { id: 'B', label: 'B', hint: 'Ser / estar (to be)' },
  { id: 'B2', label: 'B2', hint: 'Haver / existir / ter (there is · have)' },
  { id: 'C', label: 'C', hint: 'Modais — poder, saber, conseguir, dever (can, know, should…)' },
  { id: 'Imperative', label: 'I', hint: 'Imperativo — ordem / comando' },
];

// Rótulo curto por categoria (usado nos botões, explicação e revisão).
export const CATEGORY_LABEL: Record<ClassifyCategory, string> = {
  A: 'A',
  B: 'B',
  B2: 'B2',
  C: 'C',
  Imperative: 'I',
};

export const LESSON_01: Lesson = {
  id: 'classify-01',
  title: 'Aula 01 — Classificar frases',
  subtitle: 'A · B · B2 · C · Imperative — 50 perguntas de entrevista',
  questions: [
    { id: 1, pt: 'Quais são os seus pontos fortes?', answer: 'B', en: 'What are your strengths?', explanation: 'O verbo é "são" (to be → are). Perguntas com ser/estar são regra B.' },
    { id: 2, pt: 'Quais são os seus pontos fracos?', answer: 'B', en: 'What are your weaknesses?', explanation: 'Verbo "são" (to be → are). Ser/estar = regra B.' },
    { id: 3, pt: 'Por que você está interessado em trabalhar para esta empresa?', answer: 'B', en: 'Why are you interested in working for this company?', explanation: 'O verbo principal é "está" (to be → are you interested). To be = regra B.' },
    { id: 4, pt: 'Onde você se vê em cinco anos? E em 10?', answer: 'A', en: 'Where do you see yourself in five years? And in ten?', explanation: 'O verbo é "ver" (see), um verbo de ação: "Where do you see…". Usa do → regra A.' },
    { id: 5, pt: 'Por que você quer deixar o seu emprego atual?', answer: 'A', en: 'Why do you want to leave your current job?', explanation: 'Verbo "querer" (want), de ação: "Why do you want…". Regra A.' },
    { id: 6, pt: 'Por que há uma lacuna na sua trajetória profissional entre (data) e (data)?', answer: 'B2', en: 'Why is there a gap in your career between (date) and (date)?', explanation: '"Há" = haver/existir → "there is". Haver/existir = regra B2.' },
    { id: 7, pt: 'O que só você pode nos oferecer?', answer: 'C', en: 'What can only you offer us?', explanation: 'Verbo "poder" (can), um modal: "What can you offer". Modais = regra C.' },
    { id: 8, pt: 'Cite três pontos em que seu ex-chefe gostaria que você melhorasse.', answer: 'Imperative', en: 'List three points your former boss would want you to improve.', explanation: '"Cite" é uma ordem/comando, sem sujeito. Regra Imperative.' },
    { id: 9, pt: 'Você busca uma recolocação no mercado?', answer: 'A', en: 'Do you seek a job replacement?', explanation: 'Verbo "buscar/procurar" (seek/look for), de ação: "Do you seek…". Regra A.' },
    { id: 10, pt: 'Você tem planos de viajar?', answer: 'B2', en: 'Do you have plans to travel?', explanation: 'Verbo "ter" (have). No método, ter/have = regra B2.' },
    { id: 11, pt: 'Conte sobre a realização de carreira da qual mais se orgulha.', answer: 'Imperative', en: 'Tell me about the career achievement you are most proud of.', explanation: '"Conte" é comando (Tell me…). Regra Imperative.' },
    { id: 12, pt: 'Conte sobre alguma vez em que você tenha cometido um erro.', answer: 'Imperative', en: 'Tell me about a time you made a mistake.', explanation: '"Conte" = ordem (Tell me…). Regra Imperative.' },
    { id: 13, pt: 'Qual o seu emprego dos sonhos?', answer: 'B', en: 'What is your dream job?', explanation: 'Há um "é" implícito (What is…). To be = regra B.' },
    { id: 14, pt: 'Como você ficou sabendo desta vaga?', answer: 'A', en: 'How did you hear about this position?', explanation: '"Ficar sabendo" (hear/find out) é ação: "How did you hear…". Regra A.' },
    { id: 15, pt: 'O que você espera realizar nos primeiros 30 dias, 60 dias e 90 dias de trabalho?', answer: 'A', en: 'What do you expect to accomplish in your first 30, 60 and 90 days?', explanation: 'Verbo "esperar" (expect), de ação: "What do you expect…". Regra A.' },
    { id: 16, pt: 'Fale um pouco sobre o seu currículo.', answer: 'Imperative', en: 'Tell me a bit about your resume.', explanation: '"Fale" é comando (Tell me…). Regra Imperative.' },
    { id: 17, pt: 'Fale um pouco sobre sua formação acadêmica.', answer: 'Imperative', en: 'Tell me a bit about your academic background.', explanation: '"Fale" = ordem (Tell me…). Regra Imperative.' },
    { id: 18, pt: 'Descreva-se.', answer: 'Imperative', en: 'Describe yourself.', explanation: '"Descreva" é comando direto. Regra Imperative.' },
    { id: 19, pt: 'Conte-me como lidou com uma situação difícil.', answer: 'Imperative', en: 'Tell me how you handled a difficult situation.', explanation: '"Conte-me" é ordem (Tell me…). Regra Imperative.' },
    { id: 20, pt: 'Por que deveríamos contratá-lo?', answer: 'C', en: 'Why should we hire you?', explanation: 'Verbo "dever" (should), um modal: "Why should we…". Regra C.' },
    { id: 21, pt: 'Por que você está procurando um novo emprego?', answer: 'B', en: 'Why are you looking for a new job?', explanation: '"Está procurando" = estar + gerúndio → "are you looking" (to be). Regra B.' },
    { id: 22, pt: 'Você trabalharia em fins de semana e feriados?', answer: 'C', en: 'Would you work on weekends and holidays?', explanation: '"Trabalharia" é condicional → "would work". Would é modal. Regra C.' },
    { id: 23, pt: 'Como você lidaria com um cliente bravo?', answer: 'C', en: 'How would you handle an angry customer?', explanation: '"Lidaria" é condicional → "would handle". Modal would. Regra C.' },
    { id: 24, pt: 'Qual a sua pretensão salarial?', answer: 'B', en: 'What is your salary expectation?', explanation: '"É" implícito (What is…). To be = regra B.' },
    { id: 25, pt: 'Conte-me sobre alguma vez em que foi além e também abaixo do que era esperado para um projeto.', answer: 'Imperative', en: 'Tell me about a time you went above and below what was expected on a project.', explanation: '"Conte-me" é comando (Tell me…). Regra Imperative.' },
    { id: 26, pt: 'Quem são seus concorrentes?', answer: 'B', en: 'Who are your competitors?', explanation: 'Verbo "são" (to be → are). Regra B.' },
    { id: 27, pt: 'Qual o seu maior fracasso?', answer: 'B', en: 'What is your biggest failure?', explanation: '"É" implícito (What is…). To be = regra B.' },
    { id: 28, pt: 'O que te motiva?', answer: 'A', en: 'What motivates you?', explanation: 'Verbo "motivar" (motivate), de ação: "What motivates you". Regra A.' },
    { id: 29, pt: 'Qual a sua disponibilidade?', answer: 'B', en: 'What is your availability?', explanation: '"É" implícito (What is…). To be = regra B.' },
    { id: 30, pt: 'Quem é o seu mentor?', answer: 'B', en: 'Who is your mentor?', explanation: 'Verbo "é" (to be → is). Regra B.' },
    { id: 31, pt: 'Conte-me sobre alguma vez em que discordou do seu chefe.', answer: 'Imperative', en: 'Tell me about a time you disagreed with your boss.', explanation: '"Conte-me" é ordem (Tell me…). Regra Imperative.' },
    { id: 32, pt: 'Como você lida com a pressão?', answer: 'A', en: 'How do you handle pressure?', explanation: 'Verbo "lidar" (handle/deal), de ação: "How do you handle…". Regra A.' },
    { id: 33, pt: 'Qual o nome do seu CEO?', answer: 'B', en: "What is your CEO's name?", explanation: '"É" implícito (What is…). To be = regra B.' },
    { id: 34, pt: 'Quais as suas metas de carreira?', answer: 'B', en: 'What are your career goals?', explanation: '"São" implícito (What are…). To be = regra B.' },
    { id: 35, pt: 'O que o motiva para se levantar todos os dias?', answer: 'A', en: 'What motivates you to get up every day?', explanation: 'Verbo "motivar" (motivate), de ação: "What motivates you". Regra A.' },
    { id: 36, pt: 'Quais eram os pontos fortes e fracos dos seus chefes?', answer: 'B', en: "What were your bosses' strengths and weaknesses?", explanation: '"Eram" = to be no passado (were). Regra B.' },
    { id: 37, pt: 'O que as pessoas que se reportam diretamente a você diriam sobre você?', answer: 'C', en: 'What would the people who report directly to you say about you?', explanation: '"Diriam" é condicional → "would say". Modal would. Regra C.' },
    { id: 38, pt: 'Se eu ligasse agora para o seu chefe e perguntasse em quais pontos você precisa melhorar o que ele diria?', answer: 'C', en: 'If I called your boss now and asked where you need to improve, what would he say?', explanation: 'A pergunta é "o que ele diria" → "what would he say". Modal would. Regra C.' },
    { id: 39, pt: 'Você é um líder ou um seguidor?', answer: 'B', en: 'Are you a leader or a follower?', explanation: 'Verbo "é/ser" (to be → are you). Regra B.' },
    { id: 40, pt: 'Qual o último livro que você leu por diversão?', answer: 'B', en: 'What was the last book you read for fun?', explanation: 'A pergunta em si é "Qual [foi] o último livro" → "What was…" (to be). O "leu/read" está na oração relativa. Regra B.' },
    { id: 41, pt: 'Quais são os hábitos irritantes dos seus colegas?', answer: 'B', en: "What are your colleagues' annoying habits?", explanation: 'Verbo "são" (to be → are). Regra B.' },
    { id: 42, pt: 'Quais são os seus hobbies?', answer: 'B', en: 'What are your hobbies?', explanation: 'Verbo "são" (to be → are). Regra B.' },
    { id: 43, pt: 'Qual o seu site favorito?', answer: 'B', en: 'What is your favorite website?', explanation: '"É" implícito (What is…). To be = regra B.' },
    { id: 44, pt: 'O que o deixa desconfortável?', answer: 'A', en: 'What makes you uncomfortable?', explanation: 'Verbo "deixar" (make), de ação: "What makes you…". Regra A.' },
    { id: 45, pt: 'Quais foram as suas experiências de liderança?', answer: 'B', en: 'What were your leadership experiences?', explanation: '"Foram" = to be no passado (were). Regra B.' },
    { id: 46, pt: 'Como você demitiria alguém?', answer: 'C', en: 'How would you fire someone?', explanation: '"Demitiria" é condicional → "would fire". Modal would. Regra C.' },
    { id: 47, pt: 'O que você mais gosta e o que menos gosta de trabalhar neste setor?', answer: 'A', en: 'What do you like most and least about working in this sector?', explanation: 'Verbo "gostar" (like), de ação: "What do you like…". Regra A.' },
    { id: 48, pt: 'Você trabalharia 40 horas ou mais por semana?', answer: 'C', en: 'Would you work 40 hours or more a week?', explanation: '"Trabalharia" é condicional → "would work". Modal would. Regra C.' },
    { id: 49, pt: 'Quais perguntas eu não fiz para você?', answer: 'A', en: 'What questions did I not ask you?', explanation: 'Verbo "fazer/perguntar" (ask), de ação: "What questions did I not ask". Regra A.' },
    { id: 50, pt: 'Quais perguntas você quer fazer para mim?', answer: 'A', en: 'What questions do you want to ask me?', explanation: 'Verbo "querer/fazer" (want/ask), de ação: "What do you want to ask". Regra A.' },
  ],
};
