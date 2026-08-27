import type { Topic } from './topic';

// Tópico: 25 phrasal verbs essenciais — a faixa preta do mapa em ação:
// verbos de base (get, take, look, go, come, turn, put…) × partículas
// (in-out, on-off, up-down, back, away…).
// get up e wake up ficam de fora: já estão na lista dos 100 verbos.

export const TOPIC_PHRASAL: Topic = {
  id: 'phrasal-01-25',
  title: 'Phrasal verbs',
  subtitle: 'look for → run away · 25 essenciais',
  emoji: '🧩',
  category: 'verbos',
  level: 2,
  stages: ['study', 'meaning'],
  items: [
    { id: 1, base: 'look for', pt: 'procurar', example: 'I am looking for my keys.', tip: 'look muda com a partícula: for = procurar, at = olhar para, after = cuidar.' },
    { id: 2, base: 'look at', pt: 'olhar para', example: 'Look at me now.', tip: 'Sempre com at antes do alvo: look AT the sky.' },
    { id: 3, base: 'look after', pt: 'cuidar de', example: 'She looks after her little brother.', tip: 'Sinônimo de take care of.' },
    { id: 4, base: 'turn on', pt: 'ligar (aparelho)', example: 'Can you turn on the light?', tip: 'on-off do mapa: turn on = ligar, turn off = desligar.' },
    { id: 5, base: 'turn off', pt: 'desligar', example: 'Turn off your phone, please.', tip: 'Oposto de turn on.' },
    { id: 6, base: 'put on', pt: 'vestir, colocar', example: 'Put on your jacket. It is cold.', tip: 'Vestir a roupa = put on. Tirar = take off.' },
    { id: 7, base: 'take off', pt: 'tirar (roupa); decolar', example: 'Take off your shoes, please.', tip: 'Dois sentidos: tirar a roupa e o avião decolar (The plane takes off at 9).' },
    { id: 8, base: 'go out', pt: 'sair (de casa, passear)', example: 'Do you want to go out tonight?', tip: 'Sair para se divertir. "go out with" = namorar/sair com alguém.' },
    { id: 9, base: 'come in', pt: 'entrar', example: 'Come in! The door is open.', tip: 'O convite clássico na porta.' },
    { id: 10, base: 'come back', pt: 'voltar', example: 'When will you come back?', tip: 'back = de volta. come back (para cá) · go back (para lá).' },
    { id: 11, base: 'give up', pt: 'desistir', example: 'Never give up your dreams!', tip: 'Desistir DE algo: give up + coisa (give up smoking = parar de fumar).' },
    { id: 12, base: 'find out', pt: 'descobrir', example: 'I need to find out the truth.', tip: 'find = achar (objeto) · find out = descobrir (informação).' },
    { id: 13, base: 'pick up', pt: 'pegar, buscar', example: 'I will pick you up at 8.', tip: 'Pegar do chão ou buscar alguém de carro: pick you up.' },
    { id: 14, base: 'sit down', pt: 'sentar-se', example: 'Sit down, please.', tip: 'up-down do mapa: sit down ↔ stand up.' },
    { id: 15, base: 'stand up', pt: 'levantar-se', example: 'Please stand up.', tip: 'Oposto de sit down.' },
    { id: 16, base: 'write down', pt: 'anotar', example: 'Write down my number.', tip: 'down = para o papel: anotar.' },
    { id: 17, base: 'go on', pt: 'continuar', example: 'Go on, I am listening.', tip: 'Sinônimo de continue. "What is going on?" = O que está acontecendo?' },
    { id: 18, base: 'get in', pt: 'entrar (carro)', example: 'Get in the car!', tip: 'Carro = get in / get out. Ônibus, avião, trem = get on / get off.' },
    { id: 19, base: 'get out', pt: 'sair (carro); fora!', example: 'Get out of here!', tip: 'get out OF: sempre com of antes do lugar.' },
    { id: 20, base: 'get on', pt: 'subir (ônibus, avião)', example: 'She got on the wrong bus.', tip: 'Transporte grande = on/off; carro = in/out.' },
    { id: 21, base: 'get off', pt: 'descer (ônibus, avião)', example: 'We get off at the next stop.', tip: 'Oposto de get on.' },
    { id: 22, base: 'call back', pt: 'retornar (ligação)', example: 'Can you call me back later?', tip: 'call you back = te ligo de volta.' },
    { id: 23, base: 'hang out', pt: 'sair, passar tempo juntos', example: 'Let\'s hang out this weekend.', tip: 'Informal: passar um tempo com amigos.' },
    { id: 24, base: 'work out', pt: 'malhar; dar certo', example: 'I work out three times a week.', tip: 'Dois sentidos: malhar na academia e dar certo (It worked out!).' },
    { id: 25, base: 'run away', pt: 'fugir', example: 'Let\'s run away together!', tip: 'away = para longe: run away, go away (vá embora).' },
  ],
};
