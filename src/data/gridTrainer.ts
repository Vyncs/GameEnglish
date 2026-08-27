// Treinos da Grade 4V5T2S — três tipos de exercício por célula:
//
//   opener — escolher a abertura certa (treina linha × coluna, o coração do método)
//   order  — montar a pergunta na ordem certa (treina a inversão S↔V)
//   error  — tocar na palavra errada (os erros riscados do mapa)
//
// Nos "error", wrongIndex aponta a palavra errada em wrong.split(' ') e
// wrongWord repete o token — o script de sanidade confere que os dois batem.

export interface OpenerQ {
  kind: 'opener';
  id: string;
  cellId: string;
  /** O que você quer dizer. */
  pt: string;
  /** A frase com a lacuna: '___ you work yesterday?' */
  blanked: string;
  options: string[];
  answer: string;
  why: string;
}

export interface OrderQ {
  kind: 'order';
  id: string;
  cellId: string;
  pt: string;
  /** A frase certa; as peças vêm de answer.split(' '). */
  answer: string;
  why?: string;
}

export interface ErrorQ {
  kind: 'error';
  id: string;
  cellId: string;
  wrong: string;
  wrongIndex: number;
  wrongWord: string;
  right: string;
  why: string;
}

export type TrainerQuestion = OpenerQ | OrderQ | ErrorQ;

export const GRID_TRAINER_QUESTIONS: TrainerQuestion[] = [
  // ---------------------------------------------------------------- A-past
  { kind: 'opener', id: 'A-past-o1', cellId: 'A-past', pt: 'Você trabalhou ontem?', blanked: '___ you work yesterday?', options: ['Did', 'Do', 'Were', 'Will'], answer: 'Did', why: 'yesterday → passado → did. E o verbo fica na base: work.' },
  { kind: 'opener', id: 'A-past-o2', cellId: 'A-past', pt: 'Ele viajou semana passada?', blanked: '___ he travel last week?', options: ['Did', 'Does', 'Was', 'Will'], answer: 'Did', why: 'last week → did — que vale para todas as pessoas, até para he.' },
  { kind: 'order', id: 'A-past-r1', cellId: 'A-past', pt: 'A que horas você chegou?', answer: 'What time did you arrive?', why: 'wh + did + sujeito + verbo base.' },
  { kind: 'order', id: 'A-past-r2', cellId: 'A-past', pt: 'Por que eles saíram tão cedo?', answer: 'Why did they leave so early?' },
  { kind: 'error', id: 'A-past-e1', cellId: 'A-past', wrong: 'Did you went to the party?', wrongIndex: 2, wrongWord: 'went', right: 'Did you go to the party?', why: 'Depois de did o verbo volta para a base: go. O passado já está no did.' },
  { kind: 'error', id: 'A-past-e2', cellId: 'A-past', wrong: "I didn't worked yesterday.", wrongIndex: 2, wrongWord: 'worked', right: "I didn't work yesterday.", why: "Na negativa é igual: didn't + verbo base." },

  // ---------------------------------------------------------------- A-present
  { kind: 'opener', id: 'A-present-o1', cellId: 'A-present', pt: 'Ele trabalha aqui?', blanked: '___ he work here?', options: ['Does', 'Do', 'Is', 'Did'], answer: 'Does', why: 'he/she/it → does. E o verbo fica sem -s: work.' },
  { kind: 'opener', id: 'A-present-o2', cellId: 'A-present', pt: 'Quem estuda aqui?', blanked: 'Who ___ here?', options: ['studies', 'study', 'does study', 'do studies'], answer: 'studies', why: 'Who como SUJEITO não usa do/does — e a 3ª pessoa leva -s: studies. Caso 2 do mapa.' },
  { kind: 'order', id: 'A-present-r1', cellId: 'A-present', pt: 'Que tipo de música você escuta?', answer: 'What kind of music do you listen to?' },
  { kind: 'order', id: 'A-present-r2', cellId: 'A-present', pt: 'Quanto custa?', answer: 'How much does it cost?' },
  { kind: 'error', id: 'A-present-e1', cellId: 'A-present', wrong: 'Does he works here?', wrongIndex: 2, wrongWord: 'works', right: 'Does he work here?', why: 'O -s da 3ª pessoa já está no does — nunca nos dois.' },
  { kind: 'error', id: 'A-present-e2', cellId: 'A-present', wrong: 'He work a lot.', wrongIndex: 1, wrongWord: 'work', right: 'He works a lot.', why: 'Na afirmativa, he/she/it leva -s no verbo: works.' },

  // ---------------------------------------------------------------- A-would
  { kind: 'opener', id: 'A-would-o1', cellId: 'A-would', pt: 'O que você faria?', blanked: 'What ___ you do?', options: ['would', 'will', 'did', 'do'], answer: 'would', why: '"faria" termina em -RIA → would.' },
  { kind: 'opener', id: 'A-would-o2', cellId: 'A-would', pt: 'Se eu tivesse dinheiro, eu viajaria.', blanked: 'If I ___ money, I would travel.', options: ['had', 'would have', 'have', 'will have'], answer: 'had', why: 'Dentro do if entra o passado (had/were); o would fica na resposta.' },
  { kind: 'opener', id: 'A-would-o3', cellId: 'A-would', pt: 'Você viajaria mais?', blanked: '___ you travel more?', options: ['Would', 'Will', 'Do', 'Did'], answer: 'Would', why: '"viajaria" = -RIA → would.' },
  { kind: 'order', id: 'A-would-r1', cellId: 'A-would', pt: 'O que você faria com um milhão de dólares?', answer: 'What would you do with a million dollars?' },
  { kind: 'error', id: 'A-would-e1', cellId: 'A-would', wrong: 'If I would have money, I would travel.', wrongIndex: 2, wrongWord: 'would', right: 'If I had money, I would travel.', why: 'O would não entra no if — ali vai o passado: If I had money.' },

  // ---------------------------------------------------------------- A-future
  { kind: 'opener', id: 'A-future-o1', cellId: 'A-future', pt: 'Você vai trabalhar amanhã?', blanked: '___ you work tomorrow?', options: ['Will', 'Does', 'Did', 'Would'], answer: 'Will', why: 'tomorrow → will. Did é passado, does não vai com you, would seria "trabalharia".' },
  { kind: 'opener', id: 'A-future-o2', cellId: 'A-future', pt: 'Você vai me ajudar com isto?', blanked: 'Will you ___ me with this?', options: ['help', 'to help', 'helping', 'helps'], answer: 'help', why: 'Depois de will o verbo vem direto, sem to e sem -s.' },
  { kind: 'order', id: 'A-future-r1', cellId: 'A-future', pt: 'Quando você vai nos visitar?', answer: 'When will you visit us?' },
  { kind: 'order', id: 'A-future-r2', cellId: 'A-future', pt: 'Onde ele vai morar ano que vem?', answer: 'Where will he live next year?' },
  { kind: 'error', id: 'A-future-e1', cellId: 'A-future', wrong: 'Will you to help me?', wrongIndex: 2, wrongWord: 'to', right: 'Will you help me?', why: 'Depois de will não entra to: will help.' },

  // ---------------------------------------------------------------- B-past
  { kind: 'opener', id: 'B-past-o1', cellId: 'B-past', pt: 'Você estava cansado?', blanked: '___ you tired?', options: ['Were', 'Did', 'Was', 'Are'], answer: 'Were', why: 'O be não usa did — e you pede were.' },
  { kind: 'opener', id: 'B-past-o2', cellId: 'B-past', pt: 'Ele estava em casa?', blanked: '___ he at home?', options: ['Was', 'Were', 'Did', 'Is'], answer: 'Was', why: 'he/she/it no passado → was.' },
  { kind: 'order', id: 'B-past-r1', cellId: 'B-past', pt: 'Onde você estava em 2015?', answer: 'Where were you in 2015?', why: 'O be se inverte sozinho: were antes de you.' },
  { kind: 'order', id: 'B-past-r2', cellId: 'B-past', pt: 'Ela estava dormindo quando eu liguei?', answer: 'Was she sleeping when I called?' },
  { kind: 'error', id: 'B-past-e1', cellId: 'B-past', wrong: 'Did you be tired yesterday?', wrongIndex: 0, wrongWord: 'Did', right: 'Were you tired yesterday?', why: 'O be nunca usa did — ele mesmo vai para a frente: Were you…?' },

  // ---------------------------------------------------------------- B-present
  { kind: 'opener', id: 'B-present-o1', cellId: 'B-present', pt: 'Ela está trabalhando agora?', blanked: '___ she working now?', options: ['Is', 'Does', 'Are', 'Was'], answer: 'Is', why: 'V+ING (agora) pede o be: is she working.' },
  { kind: 'opener', id: 'B-present-o2', cellId: 'B-present', pt: 'Ela está trabalhando agora.', blanked: 'She ___ working now.', options: ['is', 'does', 'do', 'be'], answer: 'is', why: 'O V+ING não anda sozinho — precisa do be conjugado: is.' },
  { kind: 'order', id: 'B-present-r1', cellId: 'B-present', pt: 'O que você está fazendo agora?', answer: 'What are you doing right now?' },
  { kind: 'order', id: 'B-present-r2', cellId: 'B-present', pt: 'Por que ela está chorando?', answer: 'Why is she crying?' },
  { kind: 'error', id: 'B-present-e1', cellId: 'B-present', wrong: 'Do you be ready?', wrongIndex: 0, wrongWord: 'Do', right: 'Are you ready?', why: 'O be não usa do/does — Are you ready?' },

  // ---------------------------------------------------------------- B-would
  { kind: 'opener', id: 'B-would-o1', cellId: 'B-would', pt: 'Você seria feliz lá?', blanked: '___ you be happy there?', options: ['Would', 'Will', 'Were', 'Are'], answer: 'Would', why: '"seria" = -RIA → would… be.' },
  { kind: 'opener', id: 'B-would-o2', cellId: 'B-would', pt: 'Você seria feliz lá?', blanked: 'Would you ___ happy there?', options: ['be', 'being', 'are', 'to be'], answer: 'be', why: 'O be não some depois do would: would BE happy.' },
  { kind: 'order', id: 'B-would-r1', cellId: 'B-would', pt: 'Você estaria pronto até as 8?', answer: 'Would you be ready by 8?' },
  { kind: 'error', id: 'B-would-e1', cellId: 'B-would', wrong: 'Would you are happy there?', wrongIndex: 2, wrongWord: 'are', right: 'Would you be happy there?', why: 'Depois do would o be fica na base: would BE happy.' },
  { kind: 'order', id: 'B-would-r2', cellId: 'B-would', pt: 'Se eu morasse lá, eu seria mais feliz.', answer: 'If I lived there, I would be happier.' },

  // ---------------------------------------------------------------- B-future
  { kind: 'opener', id: 'B-future-o1', cellId: 'B-future', pt: 'Você vai estar em casa hoje à noite?', blanked: 'Will you ___ home tonight?', options: ['be', 'being', 'are', 'to be'], answer: 'be', why: 'SERÁ/ESTARÁ = will be — o be não some.' },
  { kind: 'opener', id: 'B-future-o2', cellId: 'B-future', pt: 'Você vai estar trabalhando às 8 da noite?', blanked: '___ you be working at 8 pm?', options: ['Will', 'Are', 'Do', 'Would'], answer: 'Will', why: 'Futuro contínuo: will + be + ing.' },
  { kind: 'order', id: 'B-future-r1', cellId: 'B-future', pt: 'Onde você vai estar amanhã?', answer: 'Where will you be tomorrow?' },
  { kind: 'error', id: 'B-future-e1', cellId: 'B-future', wrong: 'Will you are home tonight?', wrongIndex: 2, wrongWord: 'are', right: 'Will you be home tonight?', why: 'Depois do will o be fica na base: will BE home.' },
  { kind: 'order', id: 'B-future-r2', cellId: 'B-future', pt: 'A que horas você vai estar livre?', answer: 'What time will you be free?' },

  // ---------------------------------------------------------------- B2-past
  { kind: 'opener', id: 'B2-past-o1', cellId: 'B2-past', pt: 'Teve (houve) algum problema?', blanked: '___ any problem?', options: ['Was there', 'Had', 'Were there', 'Did have'], answer: 'Was there', why: 'O "teve" de existir é there be: was there. Singular → was.' },
  { kind: 'opener', id: 'B2-past-o2', cellId: 'B2-past', pt: 'Tinha muita gente na festa?', blanked: '___ many people at the party?', options: ['Were there', 'Was there', 'Had', 'Did there'], answer: 'Were there', why: 'many people = plural → were there.' },
  { kind: 'order', id: 'B2-past-r1', cellId: 'B2-past', pt: 'Quantas pessoas tinha lá?', answer: 'How many people were there?' },
  { kind: 'error', id: 'B2-past-e1', cellId: 'B2-past', wrong: 'Had any problem yesterday?', wrongIndex: 0, wrongWord: 'Had', right: 'Was there any problem yesterday?', why: 'O "ter" de existência é there be — have é possuir.' },

  // ---------------------------------------------------------------- B2-present
  { kind: 'opener', id: 'B2-present-o1', cellId: 'B2-present', pt: 'Tem café?', blanked: '___ any coffee?', options: ['Is there', 'Are there', 'Has', 'Have'], answer: 'Is there', why: 'O "tem" de existir é there is — não have.' },
  { kind: 'opener', id: 'B2-present-o2', cellId: 'B2-present', pt: 'Tem um pouco de café.', blanked: 'There is ___ coffee.', options: ['some', 'any', 'every', 'no one'], answer: 'some', why: 'Afirmativa → some. Any fica para pergunta e negativa.' },
  { kind: 'order', id: 'B2-present-r1', cellId: 'B2-present', pt: 'Quantos alunos tem?', answer: 'How many students are there?' },
  { kind: 'error', id: 'B2-present-e1', cellId: 'B2-present', wrong: 'Have a market near here?', wrongIndex: 0, wrongWord: 'Have', right: 'Is there a market near here?', why: 'Existência: is there. O have não pergunta se algo existe.' },

  // ---------------------------------------------------------------- B2-would
  { kind: 'opener', id: 'B2-would-o1', cellId: 'B2-would', pt: 'Teria algum problema?', blanked: '___ any problem?', options: ['Would there be', 'Would have', 'Will there be', 'Was there'], answer: 'Would there be', why: '"teria" (de existir) = would there be.' },
  { kind: 'opener', id: 'B2-would-o2', cellId: 'B2-would', pt: 'Haveria tempo para tudo.', blanked: 'There ___ time for everything.', options: ['would be', 'would have', 'will be', 'was'], answer: 'would be', why: '"haveria" = there would be — o have não entra na existência.' },
  { kind: 'order', id: 'B2-would-r1', cellId: 'B2-would', pt: 'Quantas pessoas haveria?', answer: 'How many people would there be?' },
  { kind: 'error', id: 'B2-would-e1', cellId: 'B2-would', wrong: 'Would have any problem if I came later?', wrongIndex: 1, wrongWord: 'have', right: 'Would there be any problem if I came later?', why: 'Existência em qualquer tempo é there be: would THERE BE.' },

  // ---------------------------------------------------------------- B2-future
  { kind: 'opener', id: 'B2-future-o1', cellId: 'B2-future', pt: 'Vai ter comida na festa?', blanked: '___ any food at the party?', options: ['Will there be', 'Will have', 'Is there', 'Would there be'], answer: 'Will there be', why: '"vai ter" (de existir) = will there be.' },
  { kind: 'opener', id: 'B2-future-o2', cellId: 'B2-future', pt: 'Vai ter alguém lá?', blanked: 'Will there ___ anybody there?', options: ['be', 'have', 'being', 'is'], answer: 'be', why: 'A cadeia não muda: will + there + be.' },
  { kind: 'order', id: 'B2-future-r1', cellId: 'B2-future', pt: 'Quantos convidados vai ter?', answer: 'How many guests will there be?' },
  { kind: 'error', id: 'B2-future-e1', cellId: 'B2-future', wrong: 'Will have food at the party?', wrongIndex: 1, wrongWord: 'have', right: 'Will there be food at the party?', why: 'Faltou o there be: will THERE BE food.' },

  // ---------------------------------------------------------------- C-past
  { kind: 'opener', id: 'C-past-o1', cellId: 'C-past', pt: 'Você sabia nadar quando era criança?', blanked: '___ you swim when you were a child?', options: ['Could', 'Can', 'Did', 'Would'], answer: 'Could', why: '"sabia/podia" = could — sem to depois.' },
  { kind: 'opener', id: 'C-past-o2', cellId: 'C-past', pt: 'Você teve que trabalhar?', blanked: '___ you have to work?', options: ['Did', 'Could', 'Must', 'Were'], answer: 'Did', why: '"ter que" no passado: did you have to — o have to mantém o to.' },
  { kind: 'order', id: 'C-past-r1', cellId: 'C-past', pt: 'Você conseguiu terminar no prazo?', answer: 'Were you able to finish on time?' },
  { kind: 'error', id: 'C-past-e1', cellId: 'C-past', wrong: 'Could you to swim when you were a child?', wrongIndex: 2, wrongWord: 'to', right: 'Could you swim when you were a child?', why: 'O to riscado do mapa: modal + verbo base, sem to.' },

  // ---------------------------------------------------------------- C-present
  { kind: 'opener', id: 'C-present-o1', cellId: 'C-present', pt: 'Você pode me ajudar?', blanked: '___ you help me?', options: ['Can', 'Do', 'Are', 'Must'], answer: 'Can', why: '"poder" → can, e o verbo vem direto: can you help.' },
  { kind: 'opener', id: 'C-present-o2', cellId: 'C-present', pt: 'Você pode me ajudar?', blanked: 'Can you ___ me?', options: ['help', 'to help', 'helping', 'helps'], answer: 'help', why: 'Modal + verbo base — sem to, sem -ing, sem -s.' },
  { kind: 'order', id: 'C-present-r1', cellId: 'C-present', pt: 'Como eu chego lá?', answer: 'How can I get there?' },
  { kind: 'error', id: 'C-present-e1', cellId: 'C-present', wrong: 'He cans swim very well.', wrongIndex: 1, wrongWord: 'cans', right: 'He can swim very well.', why: 'Modal não leva -s na 3ª pessoa: he can.' },
  { kind: 'error', id: 'C-present-e2', cellId: 'C-present', wrong: 'Can you to help me?', wrongIndex: 2, wrongWord: 'to', right: 'Can you help me?', why: 'O to riscado do mapa: can + verbo base.' },

  // ---------------------------------------------------------------- C-would
  { kind: 'opener', id: 'C-would-o1', cellId: 'C-would', pt: 'Você poderia abrir a janela, por favor?', blanked: '___ you open the window, please?', options: ['Could', 'Can', 'Must', 'Did'], answer: 'Could', why: '"poderia" (pedido educado) → could.' },
  { kind: 'opener', id: 'C-would-o2', cellId: 'C-would', pt: 'O que eu deveria fazer?', blanked: 'What ___ I do?', options: ['should', 'would', 'must', 'can'], answer: 'should', why: '"deveria" (conselho) → should.' },
  { kind: 'order', id: 'C-would-r1', cellId: 'C-would', pt: 'Aonde poderíamos ir hoje à noite?', answer: 'Where could we go tonight?' },
  { kind: 'error', id: 'C-would-e1', cellId: 'C-would', wrong: 'Should I to wait here?', wrongIndex: 2, wrongWord: 'to', right: 'Should I wait here?', why: 'should + verbo base, sem to.' },

  // ---------------------------------------------------------------- C-future
  { kind: 'opener', id: 'C-future-o1', cellId: 'C-future', pt: 'Você vai conseguir vir?', blanked: '___ come?', options: ['Will you be able to', 'Will you can', 'Can you will', 'Will you able to'], answer: 'Will you be able to', why: 'Can não tem futuro → will be able to. Dois modais nunca se juntam.' },
  { kind: 'opener', id: 'C-future-o2', cellId: 'C-future', pt: 'Eu vou ter que pagar por isso?', blanked: '___ pay for it?', options: ['Will I have to', 'Will I must', 'Must I will', 'I will have to'], answer: 'Will I have to', why: 'Must não tem futuro → will have to. E na pergunta o will vem antes do I.' },
  { kind: 'order', id: 'C-future-r1', cellId: 'C-future', pt: 'Quando você vai conseguir visitar?', answer: 'When will you be able to visit?' },
  { kind: 'error', id: 'C-future-e1', cellId: 'C-future', wrong: 'Will you can come to the party?', wrongIndex: 2, wrongWord: 'can', right: 'Will you be able to come to the party?', why: 'will + can não existe — o futuro do can é will be able to.' },

  // ---------------------------------------------------------------- B3
  { kind: 'opener', id: 'B3-o1', cellId: 'B3', pt: 'Você vai viajar amanhã? (já está decidido)', blanked: '___ to travel tomorrow?', options: ['Are you going', 'Do you go', 'Will you going', 'You are going'], answer: 'Are you going', why: 'Plano/intenção → be + going to.' },
  { kind: 'opener', id: 'B3-o2', cellId: 'B3', pt: 'Você vai à academia toda semana?', blanked: '___ to the gym every week?', options: ['Do you go', 'Are you going', 'Will you go', 'Would you go'], answer: 'Do you go', why: '"Vou sempre" é rotina (every week) → presente simples, não futuro!' },
  { kind: 'opener', id: 'B3-o3', cellId: 'B3', pt: 'Será que você vai se mudar para fora?', blanked: '___ you will move abroad?', options: ['Do you think', 'Are you think', 'Will you think', 'Does you think'], answer: 'Do you think', why: 'Dúvida sobre o futuro: do you think + will.' },
  { kind: 'order', id: 'B3-r1', cellId: 'B3', pt: 'O que você vai fazer neste fim de semana?', answer: 'What are you going to do this weekend?' },
  { kind: 'error', id: 'B3-e1', cellId: 'B3', wrong: 'I go to travel tomorrow.', wrongIndex: 1, wrongWord: 'go', right: "I'm going to travel tomorrow.", why: 'O "vou viajar" de plano usa be + going to: I\'m going to travel.' },

  // ---------------------------------------------------------------- D1
  { kind: 'opener', id: 'D1-o1', cellId: 'D1', pt: 'Você já comeu hoje?', blanked: '___ you eaten today?', options: ['Have', 'Did', 'Do', 'Has'], answer: 'Have', why: 'Perfect: have + V3 (eaten). Has é só para he/she/it.' },
  { kind: 'opener', id: 'D1-o2', cellId: 'D1', pt: 'Você viu as notícias?', blanked: 'Have you ___ the news?', options: ['seen', 'saw', 'see', 'sees'], answer: 'seen', why: 'Depois de have entra o particípio (V3): seen — coluna azul da lista.' },
  { kind: 'order', id: 'D1-r1', cellId: 'D1', pt: 'Quantos países você visitou?', answer: 'How many countries have you visited?' },
  { kind: 'error', id: 'D1-e1', cellId: 'D1', wrong: 'Did you have eaten today?', wrongIndex: 0, wrongWord: 'Did', right: 'Have you eaten today?', why: 'O perfect se monta só com have + V3 — did não entra.' },
  { kind: 'error', id: 'D1-e2', cellId: 'D1', wrong: 'Have you saw the news?', wrongIndex: 2, wrongWord: 'saw', right: 'Have you seen the news?', why: 'saw é a forma do did; com have entra seen (V3).' },

  // ---------------------------------------------------------------- D2
  { kind: 'opener', id: 'D2-o1', cellId: 'D2', pt: 'Você já terminou? (pergunta neutra)', blanked: 'Have you finished ___?', options: ['yet', 'already', 'ever', 'never'], answer: 'yet', why: 'JÁ na pergunta neutra = yet, no fim. Already numa pergunta soa surpresa: "Já?! Tão rápido?"' },
  { kind: 'opener', id: 'D2-o2', cellId: 'D2', pt: 'Eu já terminei.', blanked: "I've ___ finished.", options: ['already', 'yet', 'never', 'ever'], answer: 'already', why: 'JÁ na afirmação = already, entre o have e o verbo.' },
  { kind: 'opener', id: 'D2-o3', cellId: 'D2', pt: 'Ainda não terminei.', blanked: "I haven't finished ___.", options: ['yet', 'already', 'just', 'ever'], answer: 'yet', why: 'AINDA NÃO = yet no fim da negativa.' },
  { kind: 'order', id: 'D2-r1', cellId: 'D2', pt: 'O filme já começou?', answer: 'Has the movie started yet?' },
  { kind: 'error', id: 'D2-e1', cellId: 'D2', wrong: "I haven't finished already.", wrongIndex: 3, wrongWord: 'already.', right: "I haven't finished yet.", why: 'Na negativa o "ainda não" é yet — already só em afirmação.' },

  // ---------------------------------------------------------------- D3
  { kind: 'opener', id: 'D3-o1', cellId: 'D3', pt: 'Você já foi ao Japão (alguma vez na vida)?', blanked: 'Have you ___ been to Japan?', options: ['ever', 'yet', 'already', 'never'], answer: 'ever', why: '"JÁ alguma vez" = ever.' },
  { kind: 'opener', id: 'D3-o2', cellId: 'D3', pt: 'Eu nunca vi neve antes.', blanked: "I've ___ seen snow before.", options: ['never', 'ever', 'yet', 'already'], answer: 'never', why: 'Nunca = never (+before).' },
  { kind: 'order', id: 'D3-r1', cellId: 'D3', pt: 'Você já experimentou sushi?', answer: 'Have you ever tried sushi?' },
  { kind: 'error', id: 'D3-e1', cellId: 'D3', wrong: 'Have you ever went to Paris?', wrongIndex: 3, wrongWord: 'went', right: 'Have you ever been to Paris?', why: 'Com have entra V3 — e "visitar um lugar" no perfect é been to.' },
  { kind: 'opener', id: 'D3-o3', cellId: 'D3', pt: 'Eu nunca vi isso.', blanked: '___ never seen it.', options: ["I've", "I haven't", "I don't", "I didn't"], answer: "I've", why: 'Never já carrega a negação — o have fica positivo: I\'ve never seen.' },

  // ---------------------------------------------------------------- D4
  { kind: 'opener', id: 'D4-o1', cellId: 'D4', pt: 'Há quanto tempo você mora aqui?', blanked: 'How long have you been ___ here?', options: ['living', 'live', 'lived', 'lives'], answer: 'living', why: 'Ação contínua: have been + ING.' },
  { kind: 'opener', id: 'D4-o2', cellId: 'D4', pt: 'Há quanto tempo você a conhece?', blanked: 'How long have you ___ her?', options: ['known', 'been knowing', 'knowing', 'know'], answer: 'known', why: 'Know é verbo de estado — sem -ing: have known.' },
  { kind: 'opener', id: 'D4-o3', cellId: 'D4', pt: 'Moro aqui desde 2004.', blanked: 'I have lived here ___ 2004.', options: ['since', 'for', 'ago', 'from'], answer: 'since', why: 'Ponto de partida → since. Duração → for.' },
  { kind: 'opener', id: 'D4-o4', cellId: 'D4', pt: 'Eu o conheço há 10 anos.', blanked: 'I have known him ___ 10 years.', options: ['for', 'since', 'ago', 'during'], answer: 'for', why: 'Duração (10 anos) → for. Since marca o ponto de partida.' },
  { kind: 'order', id: 'D4-r1', cellId: 'D4', pt: 'Há quanto tempo você estuda inglês?', answer: 'How long have you been studying English?' },
  { kind: 'error', id: 'D4-e1', cellId: 'D4', wrong: 'How long have you been knowing her?', wrongIndex: 5, wrongWord: 'knowing', right: 'How long have you known her?', why: 'Know é verbo de estado — não usa -ing.' },
  { kind: 'error', id: 'D4-e2', cellId: 'D4', wrong: 'I live here since 2004.', wrongIndex: 1, wrongWord: 'live', right: 'I have lived here since 2004.', why: 'Com since/for a ponte passado→presente pede o perfect: have lived.' },
];

/** Questões de um conjunto de células, na ordem do banco. */
export function questionsFor(cellIds: string[]): TrainerQuestion[] {
  return GRID_TRAINER_QUESTIONS.filter((q) => cellIds.includes(q.cellId));
}
