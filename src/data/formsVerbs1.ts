import type { FormSentences } from './topic';

// Frases das FORMAS do bloco Verbos 1–25.
//
// Cada verbo ganha duas frases para falar junto, uma por coluna da folha:
//   did  — passado simples, sempre na 1ª pessoa (I ...)
//   have — particípio, sempre na 3ª pessoa (he/she/it has ...)
//
// A 3ª pessoa é de propósito: é onde o brasileiro tropeça (has, não have) e
// onde o particípio aparece com mais frequência na fala real.
//
// Caso especial: "can" não tem particípio. No perfect ele troca de pele e
// vira "been able to" — a frase do have registra isso.

export const FORMS_VERBS_1: Record<number, FormSentences> = {
  1: {
    did: { en: 'I arrived early yesterday.', pt: 'Eu cheguei cedo ontem.' },
    have: { en: 'He has arrived already.', pt: 'Ele já chegou.' },
  },
  2: {
    did: { en: 'I asked for help.', pt: 'Eu pedi ajuda.' },
    have: { en: 'She has asked twice.', pt: 'Ela já perguntou duas vezes.' },
  },
  3: {
    did: { en: 'I was at home all day.', pt: 'Eu estive em casa o dia todo.' },
    have: { en: 'He has been sick this week.', pt: 'Ele esteve doente esta semana.' },
  },
  4: {
    did: { en: 'I began the course last month.', pt: 'Eu comecei o curso mês passado.' },
    have: { en: 'The class has begun already.', pt: 'A aula já começou.' },
  },
  5: {
    did: { en: 'I broke my phone yesterday.', pt: 'Eu quebrei meu celular ontem.' },
    have: { en: 'She has broken two glasses.', pt: 'Ela quebrou dois copos.' },
  },
  6: {
    did: { en: 'I brought lunch today.', pt: 'Eu trouxe almoço hoje.' },
    have: { en: 'He has brought the papers.', pt: 'Ele trouxe os documentos.' },
  },
  7: {
    did: { en: 'I bought a new shirt.', pt: 'Eu comprei uma camisa nova.' },
    have: { en: 'She has bought a car.', pt: 'Ela comprou um carro.' },
  },
  8: {
    did: { en: 'I called you last night.', pt: 'Eu te liguei ontem à noite.' },
    have: { en: 'He has called three times.', pt: 'Ele ligou três vezes.' },
  },
  9: {
    did: { en: 'I could swim as a child.', pt: 'Eu sabia nadar quando criança.' },
    have: { en: 'She has been able to sleep.', pt: 'Ela tem conseguido dormir.' },
  },
  10: {
    did: { en: 'I chose the blue one.', pt: 'Eu escolhi o azul.' },
    have: { en: 'He has chosen already.', pt: 'Ele já escolheu.' },
  },
  11: {
    did: { en: 'I cleaned the kitchen.', pt: 'Eu limpei a cozinha.' },
    have: { en: 'She has cleaned the car.', pt: 'Ela lavou o carro.' },
  },
  12: {
    did: { en: 'I closed the window.', pt: 'Eu fechei a janela.' },
    have: { en: 'He has closed the shop.', pt: 'Ele fechou a loja.' },
  },
  13: {
    did: { en: 'I came by bus.', pt: 'Eu vim de ônibus.' },
    have: { en: 'She has come back.', pt: 'Ela voltou.' },
  },
  14: {
    did: { en: 'I cooked dinner last night.', pt: 'Eu cozinhei o jantar ontem.' },
    have: { en: 'He has cooked for us before.', pt: 'Ele já cozinhou para nós.' },
  },
  15: {
    did: { en: 'I cried at the end.', pt: 'Eu chorei no final.' },
    have: { en: 'The baby has cried all night.', pt: 'O bebê chorou a noite toda.' },
  },
  16: {
    did: { en: 'I cut my finger.', pt: 'Eu cortei meu dedo.' },
    have: { en: 'She has cut the bread.', pt: 'Ela cortou o pão.' },
  },
  17: {
    did: { en: 'I danced all night.', pt: 'Eu dancei a noite toda.' },
    have: { en: 'He has danced before.', pt: 'Ele já dançou antes.' },
  },
  18: {
    did: { en: 'I dated her for a year.', pt: 'Eu namorei ela por um ano.' },
    have: { en: 'She has dated him since May.', pt: 'Ela namora ele desde maio.' },
  },
  19: {
    did: { en: 'I depended on my parents.', pt: 'Eu dependia dos meus pais.' },
    have: { en: 'It has depended on the weather.', pt: 'Tem dependido do tempo.' },
  },
  20: {
    did: { en: 'My dog died last year.', pt: 'Meu cachorro morreu ano passado.' },
    have: { en: 'The plant has died.', pt: 'A planta morreu.' },
  },
  21: {
    did: { en: 'I did my homework.', pt: 'Eu fiz minha lição.' },
    have: { en: 'He has done it already.', pt: 'Ele já fez isso.' },
  },
  22: {
    did: { en: 'I dreamed about you.', pt: 'Eu sonhei com você.' },
    have: { en: 'She has dreamed of this.', pt: 'Ela sonhou com isso.' },
  },
  23: {
    did: { en: 'I drank two coffees.', pt: 'Eu bebi dois cafés.' },
    have: { en: 'He has drunk all the juice.', pt: 'Ele bebeu todo o suco.' },
  },
  24: {
    did: { en: 'I drove to work today.', pt: 'Eu dirigi para o trabalho hoje.' },
    have: { en: 'She has driven that car.', pt: 'Ela já dirigiu aquele carro.' },
  },
  25: {
    did: { en: 'I ate rice and beans.', pt: 'Eu comi arroz e feijão.' },
    have: { en: 'He has eaten already.', pt: 'Ele já comeu.' },
  },
};
