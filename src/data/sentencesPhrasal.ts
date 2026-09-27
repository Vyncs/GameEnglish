import type { TopicSentence } from './topic';

// Frases faladas do bloco "Phrasal verbs".
//
// O aluno ouve a frase, lê o sentido em português e repete falando. Quando o
// `example` que o item já trazia servia, ele foi reaproveitado: a frase lida na
// etapa anterior é a mesma que ele repete, o que reforça em vez de apresentar
// material novo.

export const SENTENCES_PHRASAL: Record<number, TopicSentence> = {
  1: {
    en: 'I look for my keys every morning.',
    pt: 'Eu procuro minhas chaves toda manhã.',
    newWords: [
      { word: 'keys', pt: 'chaves', kind: 'subst' },
      { word: 'morning', pt: 'manhã', kind: 'subst' },
    ],
  },
  2: {
    en: 'Look at me now.',
    pt: 'Olha pra mim agora.',
    newWords: [
      { word: 'now', pt: 'agora', kind: 'adv' },
      { word: 'me', pt: 'mim', kind: 'pron' },
    ],
  },
  3: {
    en: 'I look after my little sister.',
    pt: 'Eu cuido da minha irmã mais nova.',
    newWords: [
      { word: 'little', pt: 'pequena; mais nova', kind: 'adj' },
      { word: 'sister', pt: 'irmã', kind: 'subst' },
    ],
  },
  4: {
    en: 'Can you turn on the light?',
    pt: 'Você pode ligar a luz?',
    newWords: [
      { word: 'light', pt: 'luz', kind: 'subst' },
    ],
  },
  5: {
    en: 'Turn off your phone, please.',
    pt: 'Desliga o celular, por favor.',
    newWords: [
      { word: 'phone', pt: 'celular', kind: 'subst' },
      { word: 'please', pt: 'por favor', kind: 'expr' },
    ],
  },
  6: {
    en: "Put on your jacket, it's cold.",
    pt: 'Veste sua jaqueta, está frio.',
    newWords: [
      { word: 'jacket', pt: 'jaqueta', kind: 'subst' },
      { word: 'cold', pt: 'frio', kind: 'adj' },
    ],
  },
  7: {
    en: 'Take off your shoes before dinner.',
    pt: 'Tira os sapatos antes do jantar.',
    newWords: [
      { word: 'shoes', pt: 'sapatos', kind: 'subst' },
      { word: 'dinner', pt: 'jantar', kind: 'subst' },
    ],
  },
  8: {
    en: 'Do you want to go out tonight?',
    pt: 'Você quer sair hoje à noite?',
    newWords: [
      { word: 'want', pt: 'querer', kind: 'verbo' },
      { word: 'tonight', pt: 'hoje à noite', kind: 'adv' },
    ],
  },
  9: {
    en: 'Come in, the door is open.',
    pt: 'Entra, a porta está aberta.',
    newWords: [
      { word: 'door', pt: 'porta', kind: 'subst' },
      { word: 'open', pt: 'aberta', kind: 'adj' },
    ],
  },
  10: {
    en: 'When will you come back?',
    pt: 'Quando você vai voltar?',
    newWords: [
      { word: 'when', pt: 'quando', kind: 'adv' },
      { word: 'will', pt: 'vai (futuro)', kind: 'verbo' },
    ],
  },
  11: {
    en: 'Never give up your dreams!',
    pt: 'Nunca desista dos seus sonhos!',
    newWords: [
      { word: 'never', pt: 'nunca', kind: 'adv' },
      { word: 'dreams', pt: 'sonhos', kind: 'subst' },
    ],
  },
  12: {
    en: 'I need to find out the truth.',
    pt: 'Eu preciso descobrir a verdade.',
    newWords: [
      { word: 'need', pt: 'precisar', kind: 'verbo' },
      { word: 'truth', pt: 'verdade', kind: 'subst' },
    ],
  },
  13: {
    en: "I'll pick up the kids later.",
    pt: 'Eu vou buscar as crianças mais tarde.',
    newWords: [
      { word: 'kids', pt: 'crianças, filhos', kind: 'subst' },
      { word: 'later', pt: 'mais tarde', kind: 'adv' },
    ],
  },
  14: {
    en: 'Sit down and have some coffee.',
    pt: 'Senta e toma um café.',
    newWords: [
      { word: 'coffee', pt: 'café', kind: 'subst' },
      { word: 'some', pt: 'um pouco de', kind: 'adj' },
    ],
  },
  15: {
    en: 'Everybody stand up for the photo.',
    pt: 'Todo mundo levanta para a foto.',
    newWords: [
      { word: 'Everybody', pt: 'todo mundo', kind: 'pron' },
      { word: 'photo', pt: 'foto', kind: 'subst' },
    ],
  },
  16: {
    en: 'Write down my new address.',
    pt: 'Anota meu endereço novo.',
    newWords: [
      { word: 'new', pt: 'novo', kind: 'adj' },
      { word: 'address', pt: 'endereço', kind: 'subst' },
    ],
  },
  17: {
    en: "Go on, I'm listening carefully.",
    pt: 'Continua, eu estou escutando com atenção.',
    newWords: [
      { word: 'listening', pt: 'escutando', kind: 'verbo' },
      { word: 'carefully', pt: 'com atenção', kind: 'adv' },
    ],
  },
  18: {
    en: "Get in the car, we're late.",
    pt: 'Entra no carro, estamos atrasados.',
    newWords: [
      { word: 'car', pt: 'carro', kind: 'subst' },
      { word: 'late', pt: 'atrasado', kind: 'adj' },
    ],
  },
  19: {
    en: 'Get out of the taxi here.',
    pt: 'Desce do táxi aqui.',
    newWords: [
      { word: 'taxi', pt: 'táxi', kind: 'subst' },
      { word: 'here', pt: 'aqui', kind: 'adv' },
    ],
  },
  20: {
    en: 'I get on the bus downtown.',
    pt: 'Eu pego o ônibus no centro.',
    newWords: [
      { word: 'bus', pt: 'ônibus', kind: 'subst' },
      { word: 'downtown', pt: 'no centro', kind: 'adv' },
    ],
  },
  21: {
    en: 'We get off at the next stop.',
    pt: 'Nós descemos na próxima parada.',
    newWords: [
      { word: 'next', pt: 'próximo', kind: 'adj' },
      { word: 'stop', pt: 'parada', kind: 'subst' },
    ],
  },
  22: {
    en: "I'll call back during my break.",
    pt: 'Eu ligo de volta durante o meu intervalo.',
    newWords: [
      { word: 'during', pt: 'durante', kind: 'prep' },
      { word: 'break', pt: 'intervalo, pausa', kind: 'subst' },
    ],
  },
  23: {
    en: "Let's hang out this weekend.",
    pt: 'Vamos sair neste fim de semana.',
    newWords: [
      { word: "Let's", pt: 'vamos', kind: 'expr' },
      { word: 'weekend', pt: 'fim de semana', kind: 'subst' },
    ],
  },
  24: {
    en: 'I work out at the gym early.',
    pt: 'Eu treino na academia cedo.',
    newWords: [
      { word: 'gym', pt: 'academia', kind: 'subst' },
      { word: 'early', pt: 'cedo', kind: 'adv' },
    ],
  },
  25: {
    en: 'The dog tried to run away.',
    pt: 'O cachorro tentou fugir.',
    newWords: [
      { word: 'dog', pt: 'cachorro', kind: 'subst' },
      { word: 'tried', pt: 'tentou', kind: 'verbo' },
    ],
  },
};
