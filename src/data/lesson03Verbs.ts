// Verbos 26–50 da folha "100 verbs" (fall → like).
// A numeração segue exatamente a folha: 26 fall, 27 feel, 28 find, 29 finish, 30 fly…
//
// Dicas conectam com o mapa de regras da Aula 01:
//   have -> Regra B2 (ter/haver)
//   demais -> Regra A (verbos de ação com do/does/did)

import { verbImg, type Topic } from './topic';

// id mantido ('verbs-26-50') para preservar o progresso já salvo do usuário.
export const TOPIC_VERBS_2: Topic = {
  id: 'verbs-26-50',
  title: 'Verbos · 26–50',
  subtitle: 'fall → like',
  emoji: '🏃',
  category: 'verbos',
  level: 2,
  stages: ['study', 'meaning', 'forms'],
  imageFor: (item) => verbImg(item.id),
  items: [
    { id: 26, base: 'fall', past: 'fell', participle: 'fallen', pt: 'cair', example: 'How could he fall?', irregular: true, rule: 'A', tip: 'Irregular: fall – fell – fallen. "Fall in love" = se apaixonar.' },
    { id: 27, base: 'feel', past: 'felt', participle: 'felt', pt: 'sentir', example: 'Are you feeling better now?', irregular: true, rule: 'A', tip: 'Irregular: feel – felt – felt. Mesma forma para did e para have.' },
    { id: 28, base: 'find', past: 'found', participle: 'found', pt: 'achar, encontrar', example: 'I need to find a better job!', irregular: true, rule: 'A', tip: 'Irregular: passado = particípio (found). Não confunda com "found" de fundar.' },
    { id: 29, base: 'finish', past: 'finished', participle: 'finished', pt: 'acabar, terminar', example: "Let's finish it now?", irregular: false, rule: 'A', tip: 'Regular: finish → finished. Muito usado com already/yet: "I have already finished".' },
    { id: 30, base: 'fly', past: 'flew', participle: 'flown', pt: 'voar', example: 'She is always flying.', irregular: true, rule: 'A', tip: 'Irregular: fly – flew – flown.' },
    { id: 31, base: 'follow', past: 'followed', participle: 'followed', pt: 'seguir', example: 'Follow me as I follow Him.', irregular: false, rule: 'A', tip: 'Regular: follow → followed.' },
    { id: 32, base: 'forget', past: 'forgot', participle: 'forgotten', pt: 'esquecer', example: 'I will never forget that.', irregular: true, rule: 'A', tip: 'Irregular: forget – forgot – forgotten. Sublinhado na folha: NÃO vira "forgeting" (é forgetting).' },
    { id: 33, base: 'get', past: 'got', participle: 'got', pt: 'conseguir, obter', example: 'Is he getting fat again?', irregular: true, rule: 'A', tip: 'Irregular: get – got – got (gotten no inglês americano).' },
    { id: 34, base: 'get up', past: 'got up', participle: 'got up', pt: 'levantar', example: 'What time do you usually get up?', irregular: true, rule: 'A', tip: 'Phrasal verb (get + up). Passado: got up.' },
    { id: 35, base: 'give', past: 'gave', participle: 'given', pt: 'dar, doar', example: 'Give me your hand.', irregular: true, rule: 'A', tip: 'Irregular: give – gave – given.' },
    { id: 36, base: 'go', past: 'went', participle: 'gone', pt: 'ir', example: 'Where do you want to go tonight?', irregular: true, rule: 'A', tip: 'O mais irregular de todos: go – went – gone. "I have gone" (fui e não voltei) ≠ "I have been" (fui e já voltei).' },
    { id: 37, base: 'grow', past: 'grew', participle: 'grown', pt: 'crescer, cultivar', example: 'Everybody needs to grow.', irregular: true, rule: 'A', tip: 'Irregular: grow – grew – grown.' },
    { id: 38, base: 'have', past: 'had', participle: 'had', pt: 'ter', example: 'Once I had a dream.', irregular: true, rule: 'B2', tip: 'Regra B2 (ter/haver). Irregular: have – had – had. É também o auxiliar do present perfect: I have eaten.' },
    { id: 39, base: 'hear', past: 'heard', participle: 'heard', pt: 'escutar, ouvir', example: 'Can you hear me?', irregular: true, rule: 'A', tip: 'Irregular: hear – heard – heard (som de "rrerd"). Ouvir sem querer; listen é escutar de propósito.' },
    { id: 40, base: 'help', past: 'helped', participle: 'helped', pt: 'ajudar, socorrer', example: 'Help me, please!', irregular: false, rule: 'A', tip: 'Regular: help → helped.' },
    { id: 41, base: 'hope', past: 'hoped', participle: 'hoped', pt: 'esperar', example: 'I hope you get this job.', irregular: false, rule: 'A', tip: 'Regular: hope → hoped. "Esperar" de ter esperança (≠ wait, de aguardar).' },
    { id: 42, base: 'jump', past: 'jumped', participle: 'jumped', pt: 'pular, saltar', example: "Let's jump together!", irregular: false, rule: 'A', tip: 'Regular: jump → jumped.' },
    { id: 43, base: 'keep', past: 'kept', participle: 'kept', pt: 'guardar, manter', example: 'Keep the change.', irregular: true, rule: 'A', tip: 'Irregular: keep – kept – kept.' },
    { id: 44, base: 'kiss', past: 'kissed', participle: 'kissed', pt: 'beijar', example: "Let's just kiss and say goodbye.", irregular: false, rule: 'A', tip: 'Regular: kiss → kissed.' },
    { id: 45, base: 'know', past: 'knew', participle: 'known', pt: 'conhecer, saber', example: 'Did you know my father?', irregular: true, rule: 'A', tip: 'Irregular: know – knew – known. O "k" é mudo: "nou".' },
    { id: 46, base: 'learn', past: 'learned', participle: 'learned', pt: 'aprender', example: 'I want to learn Portuguese!', irregular: false, rule: 'A', tip: 'Regular: learned (americano) ou learnt (britânico) — os dois estão certos.' },
    { id: 47, base: 'leave', past: 'left', participle: 'left', pt: 'sair, deixar, partir', example: "Don't leave me alone!", irregular: true, rule: 'A', tip: 'Irregular: leave – left – left. É o mesmo "left" de esquerda.' },
    { id: 48, base: 'lend', past: 'lent', participle: 'lent', pt: 'emprestar', example: 'Can you lend me some money?', irregular: true, rule: 'A', tip: 'Irregular: lend – lent – lent. lend = emprestar PARA alguém; borrow = pegar emprestado.' },
    { id: 49, base: 'let', past: 'let', participle: 'let', pt: 'deixar, permitir', example: 'Let me try again.', irregular: true, rule: 'A', tip: 'Irregular invariável: let – let – let.' },
    { id: 50, base: 'like', past: 'liked', participle: 'liked', pt: 'gostar', example: 'Do you like your work?', irregular: false, rule: 'A', tip: 'Regular: like → liked. Sublinhado na folha: gostar de algo é like + ing (I like reading).' },
  ],
};
