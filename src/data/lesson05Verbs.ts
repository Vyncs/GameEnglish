// Verbos 76–100 da folha "100 verbs" (sleep → write) — o último bloco.
//
// ATENÇÃO: este bloco tinha 17 verbos e a numeração fora de sincronia com a folha
// (faltavam sleep, spell, start, talk to, tell, think, travel e understand).
// Corrigido em 2026-07-30; o id mudou para 'verbs-76-100', então o progresso antigo
// deste bloco recomeça do zero.
//
// Dicas conectam com o mapa de regras da Aula 01:
//   there be -> Regra B2 (haver/existir)
//   demais   -> Regra A

import { verbImg, type Topic } from './topic';

export const TOPIC_VERBS_4: Topic = {
  id: 'verbs-76-100',
  title: 'Verbos · 76–100',
  subtitle: 'sleep → write',
  emoji: '🏃',
  category: 'verbos',
  level: 3,
  stages: ['study', 'meaning', 'forms'],
  imageFor: (item) => verbImg(item.id),
  items: [
    { id: 76, base: 'sleep', past: 'slept', participle: 'slept', pt: 'dormir', example: 'Did you sleep well last night?', irregular: true, rule: 'A', tip: 'Irregular: sleep – slept – slept. "Estou com sono" é "I am sleepy", não "I have sleep".' },
    { id: 77, base: 'speak', past: 'spoke', participle: 'spoken', pt: 'falar', example: 'Do you speak English?', irregular: true, rule: 'A', tip: 'Irregular: speak – spoke – spoken. speak = falar um idioma; talk = conversar.' },
    { id: 78, base: 'spell', past: 'spelt', participle: 'spelt', pt: 'soletrar', example: 'How do you spell your name?', irregular: true, rule: 'A', tip: 'spelt (britânico) ou spelled (americano) — os dois valem.' },
    { id: 79, base: 'spend', past: 'spent', participle: 'spent', pt: 'gastar, despender', example: 'How much can you spend?', irregular: true, rule: 'A', tip: 'Irregular: spend – spent – spent. Vale para dinheiro e para tempo: "spend time".' },
    { id: 80, base: 'start', past: 'started', participle: 'started', pt: 'começar, iniciar', example: 'What time did the show start?', irregular: false, rule: 'A', tip: 'Regular: start → started. Irmão de begin (que é irregular: began – begun).' },
    { id: 81, base: 'stay', past: 'stayed', participle: 'stayed', pt: 'ficar, permanecer', example: 'Where are you staying?', irregular: false, rule: 'A', tip: 'Regular: stay → stayed. Ficar num lugar. "Ficar" de tornar-se é get/become.' },
    { id: 82, base: 'stop', past: 'stopped', participle: 'stopped', pt: 'parar', example: "Why didn't you stop them?", irregular: false, rule: 'A', tip: 'Regular, mas dobra o p: stop → stopped (sublinhado na folha justamente por isso).' },
    { id: 83, base: 'study', past: 'studied', participle: 'studied', pt: 'estudar', example: 'When did you study there?', irregular: false, rule: 'A', tip: 'Regular com y → ied: study → studied.' },
    { id: 84, base: 'take', past: 'took', participle: 'taken', pt: 'pegar, levar', example: "Let's take the next bus!", irregular: true, rule: 'A', tip: 'Irregular: take – took – taken. take = levar daqui; bring = trazer para cá.' },
    { id: 85, base: 'talk to', past: 'talked to', participle: 'talked to', pt: 'falar, conversar', example: "I don't want to talk about it.", irregular: false, rule: 'A', tip: 'Regular. Conversa-se TO alguém e ABOUT algum assunto: talk to me about it.' },
    { id: 86, base: 'tell', past: 'told', participle: 'told', pt: 'contar, dizer', example: "Why don't you tell your mother?", irregular: true, rule: 'A', tip: 'Irregular: tell – told – told. Tell precisa de pessoa (tell me), say não (say something).' },
    { id: 87, base: 'there be', past: 'there was/were', participle: 'there has/have been', pt: 'haver, existir, ter', example: 'There is a place for everyone...', irregular: true, rule: 'B2', tip: 'Regra B2: estrutura de existência, não é verbo de ação. Singular: there is / there was. Plural: there are / there were.' },
    { id: 88, base: 'think', past: 'thought', participle: 'thought', pt: 'pensar, achar', example: 'What do you think about it?', irregular: true, rule: 'A', tip: 'Irregular: passado = particípio (thought). Mesma família de bring → brought e buy → bought.' },
    { id: 89, base: 'travel', past: 'traveled', participle: 'traveled', pt: 'viajar', example: 'Did you travel last year?', irregular: false, rule: 'A', tip: 'Regular: traveled (americano) ou travelled com dois L (britânico).' },
    { id: 90, base: 'turn', past: 'turned', participle: 'turned', pt: 'virar', example: 'Turn right, please.', irregular: false, rule: 'A', tip: 'Regular: turn → turned. turn on/off = ligar/desligar aparelhos.' },
    { id: 91, base: 'understand', past: 'understood', participle: 'understood', pt: 'entender', example: "I don't understand.", irregular: true, rule: 'A', tip: 'Irregular: understand – understood – understood. É "stand" com under na frente, e stand faz stood.' },
    { id: 92, base: 'visit', past: 'visited', participle: 'visited', pt: 'visitar', example: 'Would you like to visit her today?', irregular: false, rule: 'A', tip: 'Regular: visit → visited.' },
    { id: 93, base: 'wait', past: 'waited', participle: 'waited', pt: 'esperar', example: 'Wait a moment, please.', irregular: false, rule: 'A', tip: 'Espera-se FOR alguém: wait FOR me. Não confunda com hope (esperar de esperança).' },
    { id: 94, base: 'wake up', past: 'woke up', participle: 'woken up', pt: 'acordar', example: 'What time did you wake up?', irregular: true, rule: 'A', tip: 'Irregular: wake up – woke up – woken up. Acordar sozinho; "get up" é sair da cama.' },
    { id: 95, base: 'walk', past: 'walked', participle: 'walked', pt: 'andar, caminhar', example: 'You need to walk daily.', irregular: false, rule: 'A', tip: 'Regular: walk → walked. O l é mudo: "uók".' },
    { id: 96, base: 'want', past: 'wanted', participle: 'wanted', pt: 'querer', example: "I don't want it anymore.", irregular: false, rule: 'A', tip: 'Regular: want → wanted. Sublinhado na folha: não se usa "wanting" para querer.' },
    { id: 97, base: 'wash', past: 'washed', participle: 'washed', pt: 'lavar', example: 'Wash your hands before eating.', irregular: false, rule: 'A', tip: 'Regular: wash → washed.' },
    { id: 98, base: 'watch', past: 'watched', participle: 'watched', pt: 'assistir', example: 'Did you watch TV last night?', irregular: false, rule: 'A', tip: 'watch TV, mas see a movie (no cinema) e look at a photo. Três verbos para "ver".' },
    { id: 99, base: 'work', past: 'worked', participle: 'worked', pt: 'trabalhar, funcionar', example: 'Are you working there yet?', irregular: false, rule: 'A', tip: 'Também serve para máquinas: "It doesn’t work" = não está funcionando.' },
    { id: 100, base: 'write', past: 'wrote', participle: 'written', pt: 'escrever', example: 'Do you prefer to write or to read?', irregular: true, rule: 'A', tip: 'Irregular: write – wrote – written. O w inicial é mudo: "ráit".' },
  ],
};
