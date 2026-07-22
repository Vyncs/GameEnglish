// Aula 02 — Decorar os 25 primeiros verbos (1–25 da lista "1-100 verbs").
// Cores da folha original: base (preto), passado (vermelho), particípio (azul),
// significado (PT) e exemplo (verde). Aqui guardamos tudo de forma estruturada.
//
// Dicas conectam com o mapa de regras da Aula 01:
//   be  -> Regra B (ser/estar)
//   can -> Regra C (modal: poder/saber/conseguir/dever)
//   demais -> Regra A (verbos de ação com do/does/did)

import type { VerbLesson } from './verbLesson';
export type { VerbRule, Verb, VerbLesson } from './verbLesson';
export { VERB_STAGES } from './verbLesson';

// Ilustração de cada verbo (recortada da folha "Irregular Verbs – Actions").
// Servida como asset estático em public/verbs/.
export const verbImg = (id: number) => `/verbs/verb-${String(id).padStart(2, '0')}.png`;

export const LESSON_02: VerbLesson = {
  id: 'verbs-01-25',
  title: 'Aula 02 — 25 verbos',
  subtitle: 'Decore os verbos 1–25 (arrive → eat) passo a passo',
  verbs: [
    { id: 1, base: 'arrive', past: 'arrived', participle: 'arrived', pt: 'chegar', example: 'What time did you arrive there?', irregular: false, rule: 'A', tip: 'Regular: passado e particípio com -ed (arrive → arrived).' },
    { id: 2, base: 'ask', past: 'asked', participle: 'asked', pt: 'pedir, perguntar, chamar', example: "Why don't you ask your father?", irregular: false, rule: 'A', tip: 'Regular: ask → asked.' },
    { id: 3, base: 'be', past: 'was/were', participle: 'been', pt: 'ser, estar', example: 'I want to be your friend.', irregular: true, rule: 'B', tip: 'Regra B (ser/estar). Irregular: was/were – been.' },
    { id: 4, base: 'begin', past: 'began', participle: 'begun', pt: 'começar, iniciar', example: 'When did it all begin?', irregular: true, rule: 'A', tip: 'Irregular: begin – began – begun (i → a → u).' },
    { id: 5, base: 'break', past: 'broke', participle: 'broken', pt: 'quebrar', example: "Don't break my heart.", irregular: true, rule: 'A', tip: 'Irregular: break – broke – broken.' },
    { id: 6, base: 'bring', past: 'brought', participle: 'brought', pt: 'trazer', example: 'Can you please bring me a glass?', irregular: true, rule: 'A', tip: 'Irregular: passado = particípio (brought).' },
    { id: 7, base: 'buy', past: 'bought', participle: 'bought', pt: 'comprar', example: 'Where did you buy your car?', irregular: true, rule: 'A', tip: 'Irregular: passado = particípio (bought). Rima com brought.' },
    { id: 8, base: 'call', past: 'called', participle: 'called', pt: 'chamar, telefonar', example: 'Call me later, please.', irregular: false, rule: 'A', tip: 'Regular: call → called.' },
    { id: 9, base: 'can', past: 'could', pt: 'poder', example: 'Can I help you?', irregular: true, rule: 'C', tip: 'Regra C (modal: poder/saber/conseguir/dever). Passado: could. Não tem particípio.' },
    { id: 10, base: 'choose', past: 'chose', participle: 'chosen', pt: 'escolher', example: 'Choose the right.', irregular: true, rule: 'A', tip: 'Irregular: choose – chose – chosen.' },
    { id: 11, base: 'clean', past: 'cleaned', participle: 'cleaned', pt: 'limpar', example: "It's not very clean.", irregular: false, rule: 'A', tip: 'Regular: clean → cleaned.' },
    { id: 12, base: 'close', past: 'closed', participle: 'closed', pt: 'fechar', example: 'Close the door, please.', irregular: false, rule: 'A', tip: 'Regular: close → closed.' },
    { id: 13, base: 'come', past: 'came', participle: 'come', pt: 'vir', example: 'Could you come earlier?', irregular: true, rule: 'A', tip: 'Irregular: come – came – come (particípio = base).' },
    { id: 14, base: 'cook', past: 'cooked', participle: 'cooked', pt: 'cozinhar', example: 'Do you know how to cook?', irregular: false, rule: 'A', tip: 'Regular: cook → cooked.' },
    { id: 15, base: 'cry', past: 'cried', participle: 'cried', pt: 'chorar, gritar', example: 'Why was she crying again?', irregular: false, rule: 'A', tip: 'Regular com y → ied: cry → cried.' },
    { id: 16, base: 'cut', past: 'cut', participle: 'cut', pt: 'cortar', example: 'How did he cut his hand?', irregular: true, rule: 'A', tip: 'Irregular invariável: cut – cut – cut.' },
    { id: 17, base: 'dance', past: 'danced', participle: 'danced', pt: 'dançar', example: 'Do you know how to dance?', irregular: false, rule: 'A', tip: 'Regular: dance → danced.' },
    { id: 18, base: 'date', past: 'dated', participle: 'dated', pt: 'namorar', example: 'Are you dating him?', irregular: false, rule: 'A', tip: 'Regular: date → dated.' },
    { id: 19, base: 'depend on', past: 'depended on', participle: 'depended on', pt: 'depender', example: 'Do you depend on your parents?', irregular: false, rule: 'A', tip: 'Regular + preposição "on": depend on.' },
    { id: 20, base: 'die', past: 'died', participle: 'died', pt: 'morrer', example: 'When did your grandfather die?', irregular: false, rule: 'A', tip: 'Regular: die → died.' },
    { id: 21, base: 'do', past: 'did', participle: 'done', pt: 'fazer', example: 'What do you do?', irregular: true, rule: 'A', tip: 'Irregular: do – did – done. Também é o auxiliar da Regra A.' },
    { id: 22, base: 'dream', past: 'dreamed', participle: 'dreamed', pt: 'sonhar', example: 'Did you dream last night?', irregular: false, rule: 'A', tip: 'Regular (ou dreamt no inglês britânico): dream → dreamed/dreamt.' },
    { id: 23, base: 'drink', past: 'drank', participle: 'drunk', pt: 'tomar, beber', example: 'Do you drink beer?', irregular: true, rule: 'A', tip: 'Irregular: drink – drank – drunk (i → a → u).' },
    { id: 24, base: 'drive', past: 'drove', participle: 'driven', pt: 'dirigir', example: 'Do you know how to drive?', irregular: true, rule: 'A', tip: 'Irregular: drive – drove – driven.' },
    { id: 25, base: 'eat', past: 'ate', participle: 'eaten', pt: 'comer', example: "Let's eat!", irregular: true, rule: 'A', tip: 'Irregular: eat – ate – eaten.' },
  ],
};
