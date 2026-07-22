import type { Topic } from './topic';

// Verbos 26–50 (fall → like).
// Dicas conectam com o mapa de regras da Aula 01:
//   have -> Regra B2 (ter/haver)
//   demais -> Regra A (verbos de ação com do/does/did)

// id mantido ('verbs-26-50') para preservar o progresso já salvo do usuário.
export const TOPIC_VERBS_2: Topic = {
  id: 'verbs-26-50',
  title: 'Verbos · 26–50',
  subtitle: 'fall → like',
  emoji: '🏃',
  level: 2,
  stages: ['study', 'meaning', 'forms'],
  items: [
    { id: 26, base: 'fall', past: 'fell', participle: 'fallen', pt: 'cair', example: 'Be careful, don’t fall!', irregular: true, rule: 'A', tip: 'Irregular: fall – fell – fallen.' },
    { id: 27, base: 'find', past: 'found', participle: 'found', pt: 'encontrar, achar', example: 'Did you find your keys?', irregular: true, rule: 'A', tip: 'Irregular: passado = particípio (found).' },
    { id: 28, base: 'finish', past: 'finished', participle: 'finished', pt: 'terminar, acabar, concluir', example: 'What time do you finish work?', irregular: false, rule: 'A', tip: 'Regular: finish → finished.' },
    { id: 29, base: 'fly', past: 'flew', participle: 'flown', pt: 'voar', example: 'I want to fly to Paris.', irregular: true, rule: 'A', tip: 'Irregular: fly – flew – flown.' },
    { id: 30, base: 'follow', past: 'followed', participle: 'followed', pt: 'seguir, acompanhar', example: 'Follow me, please.', irregular: false, rule: 'A', tip: 'Regular: follow → followed.' },
    { id: 31, base: 'feel', past: 'felt', participle: 'felt', pt: 'sentir', example: 'How do you feel today?', irregular: true, rule: 'A', tip: 'Irregular: feel – felt – felt.' },
    { id: 32, base: 'forget', past: 'forgot', participle: 'forgotten', pt: 'esquecer', example: 'Don’t forget the keys.', irregular: true, rule: 'A', tip: 'Irregular: forget – forgot – forgotten.' },
    { id: 33, base: 'get', past: 'got', participle: 'got', pt: 'conseguir, obter', example: 'Where did you get that?', irregular: true, rule: 'A', tip: 'Irregular: get – got – got (gotten no inglês americano).' },
    { id: 34, base: 'get up', past: 'got up', participle: 'got up', pt: 'levantar', example: 'What time do you get up?', irregular: true, rule: 'A', tip: 'Phrasal (get + up). Passado: got up.' },
    { id: 35, base: 'give', past: 'gave', participle: 'given', pt: 'dar, doar', example: 'Give me a hand.', irregular: true, rule: 'A', tip: 'Irregular: give – gave – given.' },
    { id: 36, base: 'go', past: 'went', participle: 'gone', pt: 'ir', example: 'Where do you want to go?', irregular: true, rule: 'A', tip: 'Irregular (bem irregular): go – went – gone.' },
    { id: 37, base: 'grow', past: 'grew', participle: 'grown', pt: 'crescer, cultivar', example: 'Kids grow up so fast.', irregular: true, rule: 'A', tip: 'Irregular: grow – grew – grown.' },
    { id: 38, base: 'have', past: 'had', participle: 'had', pt: 'ter', example: 'Do you have a car?', irregular: true, rule: 'B2', tip: 'Regra B2 (ter/haver). Irregular: have – had – had.' },
    { id: 39, base: 'hear', past: 'heard', participle: 'heard', pt: 'ouvir', example: 'Can you hear me?', irregular: true, rule: 'A', tip: 'Irregular: hear – heard – heard (som de "erd").' },
    { id: 40, base: 'help', past: 'helped', participle: 'helped', pt: 'ajudar', example: 'Can you help me?', irregular: false, rule: 'A', tip: 'Regular: help → helped.' },
    { id: 41, base: 'hope', past: 'hoped', participle: 'hoped', pt: 'esperar (ter esperança)', example: 'I hope you’re well.', irregular: false, rule: 'A', tip: 'Regular: hope → hoped. "Esperar" de esperança (≠ wait).' },
    { id: 42, base: 'jump', past: 'jumped', participle: 'jumped', pt: 'pular', example: 'The cat jumped over the wall.', irregular: false, rule: 'A', tip: 'Regular: jump → jumped.' },
    { id: 43, base: 'keep', past: 'kept', participle: 'kept', pt: 'manter, guardar', example: 'Keep the change.', irregular: true, rule: 'A', tip: 'Irregular: keep – kept – kept.' },
    { id: 44, base: 'kiss', past: 'kissed', participle: 'kissed', pt: 'beijar', example: 'She kissed the baby.', irregular: false, rule: 'A', tip: 'Regular: kiss → kissed.' },
    { id: 45, base: 'know', past: 'knew', participle: 'known', pt: 'saber, conhecer', example: 'Do you know him?', irregular: true, rule: 'A', tip: 'Irregular: know – knew – known. O "k" é mudo.' },
    { id: 46, base: 'learn', past: 'learnt', participle: 'learnt', pt: 'aprender', example: 'I want to learn English.', irregular: false, rule: 'A', tip: 'Regular: learnt (britânico) ou learned (americano).' },
    { id: 47, base: 'leave', past: 'left', participle: 'left', pt: 'sair, partir, deixar', example: 'What time do you leave?', irregular: true, rule: 'A', tip: 'Irregular: leave – left – left.' },
    { id: 48, base: 'lend', past: 'lent', participle: 'lent', pt: 'emprestar', example: 'Can you lend me a pen?', irregular: true, rule: 'A', tip: 'Irregular: lend – lent – lent. (lend = emprestar PARA alguém)' },
    { id: 49, base: 'let', past: 'let', participle: 'let', pt: 'deixar, permitir', example: 'Let me help you.', irregular: true, rule: 'A', tip: 'Irregular invariável: let – let – let.' },
    { id: 50, base: 'like', past: 'liked', participle: 'liked', pt: 'gostar', example: 'Do you like coffee?', irregular: false, rule: 'A', tip: 'Regular: like → liked.' },
  ],
};
