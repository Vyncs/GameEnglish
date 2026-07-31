// Verbos 51–75 da folha "100 verbs" (listen to → sit).
// Todos aqui são Regra A (verbos de ação, perguntas e negativas com do/does/did).
//
// A linha 55 da folha traz "love/hate" junta; aqui ela vira dois cards, porque
// são verbos diferentes — hate usa o id 155 para não brigar com a numeração.

import { verbImg, type Topic } from './topic';

export const TOPIC_VERBS_3: Topic = {
  id: 'verbs-51-75',
  title: 'Verbos · 51–75',
  subtitle: 'listen to → sit',
  emoji: '🏃',
  category: 'verbos',
  level: 3,
  stages: ['study', 'meaning', 'forms'],
  imageFor: (item) => verbImg(item.id),
  items: [
    { id: 51, base: 'listen to', past: 'listened to', participle: 'listened to', pt: 'ouvir, escutar', example: 'Are you listening to me?', irregular: false, rule: 'A', tip: 'Anda sempre com "to": listen TO music. Sem o "to" a frase soa incompleta.' },
    { id: 52, base: 'live', past: 'lived', participle: 'lived', pt: 'morar', example: 'Where do you live?', irregular: false, rule: 'A', tip: 'Regular: live → lived. Morar e viver.' },
    { id: 53, base: 'look', past: 'looked', participle: 'looked', pt: 'olhar, ver', example: 'Look at me now.', irregular: false, rule: 'A', tip: 'look AT = olhar para. look FOR = procurar. Trocar a preposição muda o sentido.' },
    { id: 54, base: 'lose', past: 'lost', participle: 'lost', pt: 'perder', example: 'I lost my wallet yesterday.', irregular: true, rule: 'A', tip: 'Irregular: lose – lost – lost. Perder algo ou perder um jogo. Perder o ônibus é "miss".' },
    { id: 55, base: 'love', past: 'loved', participle: 'loved', pt: 'amar', example: 'I love you.', irregular: false, rule: 'A', tip: 'Regular: love → loved.' },
    { id: 155, base: 'hate', past: 'hated', participle: 'hated', pt: 'odiar', example: 'I hate her so much.', irregular: false, rule: 'A', tip: 'O oposto de love, e vem na mesma linha 55 da folha. Regular: hate → hated.' },
    { id: 56, base: 'make', past: 'made', participle: 'made', pt: 'fazer', example: "I can't make it all alone...", irregular: true, rule: 'A', tip: 'Irregular: make – made – made. make = produzir/criar algo; do = executar uma tarefa.' },
    { id: 57, base: 'marry', past: 'married', participle: 'married', pt: 'casar', example: 'When did you get married?', irregular: false, rule: 'A', tip: 'Regular com y → ied: marry → married. No dia a dia se usa "get married".' },
    { id: 58, base: 'meet', past: 'met', participle: 'met', pt: 'encontrar, conhecer', example: 'Nice to meet you.', irregular: true, rule: 'A', tip: 'Irregular: meet – met – met. Serve para "conhecer alguém" e "encontrar com alguém".' },
    { id: 59, base: 'miss', past: 'missed', participle: 'missed', pt: 'perder, sentir falta', example: 'Why did you miss the last class?', irregular: false, rule: 'A', tip: 'Duas caras: "I miss you" (sinto sua falta) e "I missed the bus" (perdi o ônibus).' },
    { id: 60, base: 'need', past: 'needed', participle: 'needed', pt: 'precisar', example: 'Call me if you need some help.', irregular: false, rule: 'A', tip: 'Regular: need → needed. Sublinhado na folha: não vira "needing" no sentido de precisar.' },
    { id: 61, base: 'open', past: 'opened', participle: 'opened', pt: 'abrir', example: 'What time does it open?', irregular: false, rule: 'A', tip: 'Regular: open → opened. Oposto de close.' },
    { id: 62, base: 'pay', past: 'paid', participle: 'paid', pt: 'pagar', example: 'Who is going to pay for it?', irregular: true, rule: 'A', tip: 'Irregular e com grafia traiçoeira: pay – paid – paid (não é "payed"). Paga-se FOR alguma coisa.' },
    { id: 63, base: 'play', past: 'played', participle: 'played', pt: 'jogar, tocar', example: "Let's play this afternoon again?", irregular: false, rule: 'A', tip: 'Esporte sem artigo (play football), instrumento com "the" (play THE guitar).' },
    { id: 64, base: 'prefer', past: 'preferred', participle: 'preferred', pt: 'preferir', example: 'I prefer to live on my own.', irregular: false, rule: 'A', tip: 'Regular, mas dobra o r: prefer → preferred.' },
    { id: 65, base: 'put', past: 'put', participle: 'put', pt: 'pôr, colocar', example: 'Put your hand in the hand of God.', irregular: true, rule: 'A', tip: 'Irregular invariável: put – put – put. As três formas são idênticas.' },
    { id: 66, base: 'read', past: 'read', participle: 'read', pt: 'ler', example: 'Do you like to read?', irregular: true, rule: 'A', tip: 'Escreve igual nas três formas, mas o passado se pronuncia "réd" (como red, vermelho).' },
    { id: 67, base: 'receive', past: 'received', participle: 'received', pt: 'receber', example: 'How much did you receive?', irregular: false, rule: 'A', tip: 'Regular: receive → received. Lembre o "i antes do e, exceto depois do c".' },
    { id: 68, base: 'remember', past: 'remembered', participle: 'remembered', pt: 'lembrar', example: "I can't remember his last name...", irregular: false, rule: 'A', tip: 'Regular: remember → remembered. Oposto de forget.' },
    { id: 69, base: 'run', past: 'ran', participle: 'run', pt: 'correr', example: "Let's run away!", irregular: true, rule: 'A', tip: 'Irregular: run – ran – run (o particípio volta a ser igual à base). "Run a business" = administrar um negócio.' },
    { id: 70, base: 'say', past: 'said', participle: 'said', pt: 'dizer', example: 'What did you say?', irregular: true, rule: 'A', tip: 'Irregular: say – said – said (pronuncia "séd"). Say algo, tell alguém.' },
    { id: 71, base: 'see', past: 'saw', participle: 'seen', pt: 'ver', example: "I can't see you anymore...", irregular: true, rule: 'A', tip: 'Irregular: see – saw – seen. Ver é involuntário; watch é assistir de propósito.' },
    { id: 72, base: 'sell', past: 'sold', participle: 'sold', pt: 'vender', example: 'Do you want to sell your house?', irregular: true, rule: 'A', tip: 'Irregular: sell – sold – sold. Oposto de buy (bought).' },
    { id: 73, base: 'send', past: 'sent', participle: 'sent', pt: 'mandar, enviar', example: 'Send her flowers!', irregular: true, rule: 'A', tip: 'Irregular: send – sent – sent.' },
    { id: 74, base: 'sing', past: 'sang', participle: 'sung', pt: 'cantar', example: 'Do you sing in the bathroom?', irregular: true, rule: 'A', tip: 'Irregular: sing – sang – sung. Mesmo padrão de drink – drank – drunk.' },
    { id: 75, base: 'sit', past: 'sat', participle: 'sat', pt: 'sentar (se)', example: 'Sit down, please.', irregular: true, rule: 'A', tip: 'Irregular: sit – sat – sat. "Sit down, please!" é Imperativo (Regra I): ordem direta, sem sujeito.' },
  ],
};
