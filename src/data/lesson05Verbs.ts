import type { Topic } from './topic';

// Verbos 76–92 do PDF (speak → write) — a lista termina em "write", que é o
// último em ordem alfabética. São 17 itens, não 25.
// Dicas conectam com o mapa de regras da Aula 01:
//   there is/there are -> Regra B2 (haver/existir)
//   demais -> Regra A

export const TOPIC_VERBS_4: Topic = {
  id: 'verbs-76-92',
  title: 'Verbos · 76–92',
  subtitle: 'speak → write',
  emoji: '🏃',
  category: 'verbos',
  level: 3,
  stages: ['study', 'meaning', 'forms'],
  items: [
    { id: 76, base: 'speak', past: 'spoke', participle: 'spoken', pt: 'falar', example: 'Do you speak English?', irregular: true, rule: 'A', tip: 'Irregular: speak – spoke – spoken. speak = falar um idioma; talk = conversar.' },
    { id: 77, base: 'spend', past: 'spent', participle: 'spent', pt: 'gastar', example: 'I spent all my money.', irregular: true, rule: 'A', tip: 'Irregular: spend – spent – spent. Vale para dinheiro e para tempo: "spend time".' },
    { id: 78, base: 'stay', past: 'stayed', participle: 'stayed', pt: 'ficar, permanecer', example: 'I stayed at home.', irregular: false, rule: 'A', tip: 'Regular: stay → stayed. Ficar num lugar. "Ficar" de tornar-se é "get/become".' },
    { id: 79, base: 'stop', past: 'stopped', participle: 'stopped', pt: 'parar', example: 'The bus stopped here.', irregular: false, rule: 'A', tip: 'Regular, mas dobra o p: stop → stopped.' },
    { id: 80, base: 'study', past: 'studied', participle: 'studied', pt: 'estudar', example: 'I study English every night.', irregular: false, rule: 'A', tip: 'Regular com y → ied: study → studied.' },
    { id: 81, base: 'take', past: 'took', participle: 'taken', pt: 'pegar, levar', example: 'Take an umbrella.', irregular: true, rule: 'A', tip: 'Irregular: take – took – taken. take = levar daqui; bring = trazer para cá.' },
    { id: 82, base: 'there is', past: 'there was', participle: 'there has been', pt: 'haver, existir', example: 'There is a problem.', irregular: true, rule: 'B2', tip: 'Regra B2: estrutura de existência, não é verbo de ação. Singular: there is / there was / there has been. Plural: there are / there were / there have been.' },
    { id: 83, base: 'turn', past: 'turned', participle: 'turned', pt: 'virar', example: 'Turn left at the corner.', irregular: false, rule: 'A', tip: 'Regular: turn → turned. turn on/off = ligar/desligar aparelhos.' },
    { id: 84, base: 'visit', past: 'visited', participle: 'visited', pt: 'visitar', example: 'We visited my grandmother.', irregular: false, rule: 'A', tip: 'Regular: visit → visited.' },
    { id: 85, base: 'wait', past: 'waited', participle: 'waited', pt: 'esperar, aguardar', example: 'I am waiting for the bus.', irregular: false, rule: 'A', tip: 'Espera-se FOR alguém: wait FOR me. Não confunda com hope (esperar de esperança).' },
    { id: 86, base: 'wake up', past: 'woke up', participle: 'woken up', pt: 'acordar, despertar', example: 'I wake up at six.', irregular: true, rule: 'A', tip: 'Irregular: wake up – woke up – woken up. Existe também awake – awoke – awoken, mais formal.' },
    { id: 87, base: 'walk', past: 'walked', participle: 'walked', pt: 'andar', example: 'I walk to work.', irregular: false, rule: 'A', tip: 'Regular: walk → walked. O l é mudo: "uók".' },
    { id: 88, base: 'want', past: 'wanted', participle: 'wanted', pt: 'querer', example: 'What do you want?', irregular: false, rule: 'A', tip: 'Regular: want → wanted.' },
    { id: 89, base: 'wash', past: 'washed', participle: 'washed', pt: 'lavar', example: 'Wash your hands.', irregular: false, rule: 'A', tip: 'Regular: wash → washed.' },
    { id: 90, base: 'watch', past: 'watched', participle: 'watched', pt: 'assistir, observar', example: 'We watched a movie.', irregular: false, rule: 'A', tip: 'watch TV, mas see a movie (no cinema) e look at a photo. Três verbos para "ver".' },
    { id: 91, base: 'work', past: 'worked', participle: 'worked', pt: 'trabalhar, funcionar', example: 'It doesn’t work.', irregular: false, rule: 'A', tip: 'Também serve para máquinas: "It doesn’t work" = não está funcionando.' },
    { id: 92, base: 'write', past: 'wrote', participle: 'written', pt: 'escrever', example: 'She wrote a letter.', irregular: true, rule: 'A', tip: 'Irregular: write – wrote – written. O w inicial é mudo: "ráit".' },
  ],
};
