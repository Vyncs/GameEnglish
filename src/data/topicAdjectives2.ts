import type { Topic } from './topic';

// Tópico: mais 25 adjetivos, cada tip já com o comparativo e o superlativo —
// a regra do canto do mapa: curto → +er / the +est · longo → more / the most.
// Continua o "Adjetivos · essenciais" (good → busy).

export const TOPIC_ADJECTIVES_2: Topic = {
  id: 'adjectives-26-50',
  title: 'Adjetivos · comparações',
  subtitle: 'rich → late · 25 com -er e the most',
  emoji: '⚖️',
  category: 'adjetivos',
  level: 2,
  stages: ['study', 'meaning'],
  items: [
    { id: 1, base: 'rich', pt: 'rico', example: 'He wants to be rich.', tip: 'Curto: richer → the richest. (Irregulares: good→better→the best, bad→worse→the worst.)' },
    { id: 2, base: 'poor', pt: 'pobre', example: 'They were very poor.', tip: 'poorer → the poorest. Também é "coitado": Poor thing!' },
    { id: 3, base: 'clean', pt: 'limpo', example: 'The kitchen is clean.', tip: 'cleaner → the cleanest. Também é o verbo limpar (verbo 11 da lista).' },
    { id: 4, base: 'dirty', pt: 'sujo', example: 'My shoes are dirty.', tip: 'Termina em -y: dirtier → the dirtiest.' },
    { id: 5, base: 'full', pt: 'cheio', example: 'The bus was full.', tip: 'fuller → the fullest. "Estou satisfeito" = I\'m full.' },
    { id: 6, base: 'empty', pt: 'vazio', example: 'The house is empty.', tip: '-y → emptier → the emptiest.' },
    { id: 7, base: 'heavy', pt: 'pesado', example: 'This box is too heavy.', tip: '-y → heavier → the heaviest.' },
    { id: 8, base: 'light', pt: 'leve; claro', example: 'My new laptop is very light.', tip: 'lighter → the lightest. Serve para peso e para cor (light blue).' },
    { id: 9, base: 'dark', pt: 'escuro', example: 'It gets dark early in winter.', tip: 'darker → the darkest.' },
    { id: 10, base: 'quiet', pt: 'quieto, silencioso', example: 'The street is quiet at night.', tip: 'quieter → the quietest. Não confunda com quite (bastante).' },
    { id: 11, base: 'loud', pt: 'alto (som)', example: 'The music is too loud.', tip: 'louder → the loudest. Som alto = loud, nunca "high music".' },
    { id: 12, base: 'safe', pt: 'seguro', example: 'This neighborhood is safe.', tip: 'safer → the safest. Oposto de dangerous.' },
    { id: 13, base: 'dangerous', pt: 'perigoso', example: 'That road is dangerous.', tip: 'Longo: more dangerous → the most dangerous.' },
    { id: 14, base: 'important', pt: 'importante', example: 'This is very important to me.', tip: 'Longo (3 sílabas): more important → the most important.' },
    { id: 15, base: 'interesting', pt: 'interessante', example: 'The book is really interesting.', tip: 'more interesting → the most interesting. -ING descreve a coisa; -ED, a pessoa (interested).' },
    { id: 16, base: 'boring', pt: 'chato, entediante', example: 'The movie was so boring.', tip: 'more boring → the most boring. I\'m bored = estou entediado; I\'m boring = eu sou chato!' },
    { id: 17, base: 'difficult', pt: 'difícil', example: 'The test was difficult.', tip: 'more difficult → the most difficult — o exemplo do próprio mapa. Sinônimo curto: hard → harder.' },
    { id: 18, base: 'funny', pt: 'engraçado', example: 'He tells funny stories.', tip: '-y → funnier → the funniest. Funny = engraçado; fun = divertido.' },
    { id: 19, base: 'smart', pt: 'inteligente', example: 'She is a smart student.', tip: 'smarter → the smartest. Sinônimo: intelligent (longo → more intelligent).' },
    { id: 20, base: 'weak', pt: 'fraco', example: 'I feel weak today.', tip: 'weaker → the weakest. Oposto de strong → stronger.' },
    { id: 21, base: 'hungry', pt: 'com fome', example: 'I am hungry. Let\'s eat!', tip: '-y → hungrier → the hungriest. E você ESTÁ com fome: I am hungry, nunca "I have hunger".' },
    { id: 22, base: 'thirsty', pt: 'com sede', example: 'Are you thirsty?', tip: '-y → thirstier → the thirstiest. Mesmo padrão: I am thirsty, nunca "I have thirst".' },
    { id: 23, base: 'angry', pt: 'bravo, com raiva', example: 'Why is she angry with me?', tip: '-y → angrier → the angriest. angry WITH somebody.' },
    { id: 24, base: 'early', pt: 'cedo', example: 'I wake up early every day.', tip: 'earlier → the earliest. Could you come earlier? = Você poderia vir mais cedo?' },
    { id: 25, base: 'late', pt: 'tarde, atrasado', example: 'Sorry, I am late.', tip: 'later → the latest. See you later = até mais tarde.' },
  ],
};
