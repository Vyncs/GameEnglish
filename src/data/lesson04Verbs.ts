import type { Topic } from './topic';

// Verbos 51–75 do PDF (listen to → sit).
// Dicas conectam com o mapa de regras da Aula 01: todos aqui são Regra A
// (verbos de ação, perguntas e negativas com do/does/did).

export const TOPIC_VERBS_3: Topic = {
  id: 'verbs-51-75',
  title: 'Verbos · 51–75',
  subtitle: 'listen to → sit',
  emoji: '🏃',
  category: 'verbos',
  level: 3,
  stages: ['study', 'meaning', 'forms'],
  items: [
    { id: 51, base: 'listen to', past: 'listened to', participle: 'listened to', pt: 'escutar', example: 'I listen to music every day.', irregular: false, rule: 'A', tip: 'Anda sempre com "to": listen TO music. Sem o "to" a frase soa incompleta.' },
    { id: 52, base: 'live', past: 'lived', participle: 'lived', pt: 'morar, viver', example: 'Where do you live?', irregular: false, rule: 'A', tip: 'Regular: live → lived.' },
    { id: 53, base: 'look', past: 'looked', participle: 'looked', pt: 'olhar', example: 'Look at this photo!', irregular: false, rule: 'A', tip: 'look AT = olhar para. look FOR = procurar. Trocar a preposição muda o sentido.' },
    { id: 54, base: 'lose', past: 'lost', participle: 'lost', pt: 'perder', example: 'Don’t lose your keys.', irregular: true, rule: 'A', tip: 'Irregular: lose – lost – lost. Perder algo ou perder um jogo. Perder o ônibus é "miss".' },
    { id: 55, base: 'love', past: 'loved', participle: 'loved', pt: 'amar', example: 'I love this song.', irregular: false, rule: 'A', tip: 'Regular: love → loved.' },
    // 155: mesma linha 55 do PDF (love/hate) — separada em dois cards, pois são verbos distintos.
    { id: 155, base: 'hate', past: 'hated', participle: 'hated', pt: 'odiar', example: 'I hate waking up early.', irregular: false, rule: 'A', tip: 'O oposto de love. Regular: hate → hated.' },
    { id: 56, base: 'make', past: 'made', participle: 'made', pt: 'fazer, produzir', example: 'She made a cake.', irregular: true, rule: 'A', tip: 'Irregular: make – made – made. make = produzir/criar algo; do = executar uma tarefa.' },
    { id: 57, base: 'marry', past: 'married', participle: 'married', pt: 'casar-se', example: 'They married last year.', irregular: false, rule: 'A', tip: 'Regular com y → ied: marry → married.' },
    { id: 58, base: 'meet', past: 'met', participle: 'met', pt: 'encontrar, conhecer', example: 'Nice to meet you.', irregular: true, rule: 'A', tip: 'Irregular: meet – met – met. Serve para "conhecer alguém" e "encontrar com alguém".' },
    { id: 59, base: 'miss', past: 'missed', participle: 'missed', pt: 'sentir falta, perder', example: 'I miss you.', irregular: false, rule: 'A', tip: 'Duas caras: "I miss you" (sinto sua falta) e "I missed the bus" (perdi o ônibus).' },
    { id: 60, base: 'need', past: 'needed', participle: 'needed', pt: 'precisar', example: 'I need some help.', irregular: false, rule: 'A', tip: 'Regular: need → needed.' },
    { id: 61, base: 'open', past: 'opened', participle: 'opened', pt: 'abrir', example: 'Can you open the window?', irregular: false, rule: 'A', tip: 'Regular: open → opened. Oposto de close.' },
    { id: 62, base: 'pay', past: 'paid', participle: 'paid', pt: 'pagar', example: 'I paid for the tickets.', irregular: true, rule: 'A', tip: 'Irregular e com grafia traiçoeira: pay – paid – paid (não é "payed"). Paga-se FOR alguma coisa.' },
    { id: 63, base: 'play', past: 'played', participle: 'played', pt: 'jogar, brincar, tocar', example: 'Do you play the guitar?', irregular: false, rule: 'A', tip: 'Esporte sem artigo (play football), instrumento com "the" (play THE guitar).' },
    { id: 64, base: 'prefer', past: 'preferred', participle: 'preferred', pt: 'preferir', example: 'I prefer tea to coffee.', irregular: false, rule: 'A', tip: 'Regular, mas dobra o r: prefer → preferred.' },
    { id: 65, base: 'put', past: 'put', participle: 'put', pt: 'colocar, pôr', example: 'Put the book on the table.', irregular: true, rule: 'A', tip: 'Irregular invariável: put – put – put. As três formas são idênticas.' },
    { id: 66, base: 'read', past: 'read', participle: 'read', pt: 'ler', example: 'I read a book yesterday.', irregular: true, rule: 'A', tip: 'Escreve igual nas três formas, mas o passado se pronuncia "réd" (como red).' },
    { id: 67, base: 'receive', past: 'received', participle: 'received', pt: 'receber', example: 'I received your message.', irregular: false, rule: 'A', tip: 'Regular: receive → received. Lembre o "i antes do e, exceto depois do c".' },
    { id: 68, base: 'remember', past: 'remembered', participle: 'remembered', pt: 'lembrar', example: 'Do you remember her name?', irregular: false, rule: 'A', tip: 'Regular: remember → remembered. Oposto de forget.' },
    { id: 69, base: 'run', past: 'ran', participle: 'run', pt: 'correr, dirigir', example: 'He runs every morning.', irregular: true, rule: 'A', tip: 'Irregular: run – ran – run. "Run a business" = dirigir/administrar um negócio.' },
    { id: 70, base: 'say', past: 'said', participle: 'said', pt: 'dizer', example: 'What did you say?', irregular: true, rule: 'A', tip: 'Irregular: say – said – said (pronuncia "séd"). Say algo, tell alguém.' },
    { id: 71, base: 'see', past: 'saw', participle: 'seen', pt: 'ver', example: 'I saw him yesterday.', irregular: true, rule: 'A', tip: 'Irregular: see – saw – seen. Ver é involuntário; watch é assistir de propósito.' },
    { id: 72, base: 'sell', past: 'sold', participle: 'sold', pt: 'vender', example: 'They sold the car.', irregular: true, rule: 'A', tip: 'Irregular: sell – sold – sold. Oposto de buy (bought).' },
    { id: 73, base: 'send', past: 'sent', participle: 'sent', pt: 'enviar, mandar', example: 'I sent you an email.', irregular: true, rule: 'A', tip: 'Irregular: send – sent – sent.' },
    { id: 74, base: 'sing', past: 'sang', participle: 'sung', pt: 'cantar', example: 'She sang beautifully.', irregular: true, rule: 'A', tip: 'Irregular: sing – sang – sung. Mesmo padrão de drink – drank – drunk.' },
    { id: 75, base: 'sit', past: 'sat', participle: 'sat', pt: 'sentar', example: 'Sit down, please!', irregular: true, rule: 'A', tip: 'Irregular: sit – sat – sat. "Sit down, please!" é Imperativo (Regra I): ordem direta, sem sujeito.' },
  ],
};
