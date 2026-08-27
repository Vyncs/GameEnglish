import type { Topic } from './topic';

// Tópico: os pronomes do bloco lateral do mapa, nas três colunas —
// sujeito (I) → possessivo (my) → objeto (me) — mais os reflexivos (-self).
// O hexágono do mapa: com he/she/it o verbo leva -s.

export const TOPIC_PRONOUNS: Topic = {
  id: 'pronouns-01-24',
  title: 'Pronomes',
  subtitle: 'I → themselves · sujeito, posse e objeto',
  emoji: '👥',
  category: 'outros',
  level: 1,
  stages: ['study', 'meaning'],
  items: [
    { id: 1, base: 'I', pt: 'eu (sujeito)', example: 'I love you.', tip: 'Sempre maiúsculo. Trio: I – my – me.' },
    { id: 2, base: 'you', pt: 'você, vocês', example: 'You are my friend.', tip: 'Serve para singular E plural. Trio: you – your – you.' },
    { id: 3, base: 'he', pt: 'ele (sujeito)', example: 'He works a lot.', tip: 'Hexágono do mapa: com he/she/it o verbo leva -s (works).' },
    { id: 4, base: 'she', pt: 'ela (sujeito)', example: 'She is a teacher.', tip: 'Trio: she – her – her.' },
    { id: 5, base: 'it', pt: 'ele/ela (coisa, animal)', example: 'It is cold today.', tip: 'Coisas, animais, clima e horas: It is 8 o\'clock.' },
    { id: 6, base: 'we', pt: 'nós (sujeito)', example: 'We study together.', tip: 'Trio: we – our – us.' },
    { id: 7, base: 'they', pt: 'eles, elas (sujeito)', example: 'They live in Brazil.', tip: 'Vale para pessoas e coisas. Trio: they – their – them.' },
    { id: 8, base: 'my', pt: 'meu, minha', example: 'This is my house.', tip: 'Posse SEMPRE antes do substantivo: my house, nunca "the my house".' },
    { id: 9, base: 'your', pt: 'seu, sua (de você)', example: 'Is this your car?', tip: 'Não confunda com you\'re (= you are).' },
    { id: 10, base: 'his', pt: 'dele', example: 'His name is John.', tip: 'his = dele · her = dela. Combina com o DONO, não com a coisa.' },
    { id: 11, base: 'her', pt: 'dela; ela (objeto)', example: 'I know her sister.', tip: 'Dupla função: her sister (posse) e I love her (objeto).' },
    { id: 12, base: 'its', pt: 'dele/dela (coisa)', example: 'The dog wags its tail.', tip: 'SEM apóstrofo. It\'s = it is.' },
    { id: 13, base: 'our', pt: 'nosso, nossa', example: 'This is our house.', tip: 'Pronuncia-se como "áuer".' },
    { id: 14, base: 'their', pt: 'deles, delas', example: 'Their children are smart.', tip: 'Não confunda: their (posse), there (lá), they\'re (they are).' },
    { id: 15, base: 'me', pt: 'me, mim', example: 'Call me later, please.', tip: 'Depois do verbo ou preposição: call ME, with ME.' },
    { id: 16, base: 'him', pt: 'ele (objeto)', example: 'I saw him yesterday.', tip: 'he vira him depois do verbo: I saw HIM.' },
    { id: 17, base: 'us', pt: 'nos, a gente (objeto)', example: 'When will you visit us?', tip: 'we vira us depois do verbo: visit US.' },
    { id: 18, base: 'them', pt: 'eles, elas (objeto)', example: 'I like them a lot.', tip: 'they vira them depois do verbo: I like THEM.' },
    { id: 19, base: 'myself', pt: 'eu mesmo', example: 'I did it myself.', tip: 'A coluna -self/-selves do mapa: eu fiz sozinho/eu mesmo.' },
    { id: 20, base: 'yourself', pt: 'você mesmo', example: 'Do it yourself.', tip: 'Plural: yourselves.' },
    { id: 21, base: 'himself', pt: 'ele mesmo', example: 'He lives by himself.', tip: 'by himself = sozinho.' },
    { id: 22, base: 'herself', pt: 'ela mesma', example: 'She made the dress herself.', tip: 'Feito por ela mesma.' },
    { id: 23, base: 'ourselves', pt: 'nós mesmos', example: 'We painted the house ourselves.', tip: 'No plural o self vira selves.' },
    { id: 24, base: 'themselves', pt: 'eles mesmos', example: 'They organized everything themselves.', tip: 'Plural de himself/herself.' },
  ],
};
