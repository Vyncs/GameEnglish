// Famílias de verbos irregulares — a base da seção "Verbos no passado".
//
// Decorar 53 irregulares em ordem alfabética é força bruta. Em família é padrão:
// quem aprende "bring – brought" já sente que "buy – bought" e "think – thought"
// seguem o mesmo caminho. Cada verbo aparece em UMA família só.
//
// Os dados dos verbos continuam vivendo nos tópicos (lesson02..05Verbs) — aqui só
// listamos as bases, e o helper resolve para o TopicItem correspondente.

import { TOPICS } from './topics';
import type { TopicItem } from './topic';

export interface VerbFamily {
  id: string;
  title: string;
  /** A regra em uma frase — é o que a pessoa precisa levar na cabeça. */
  rule: string;
  emoji: string;
  /** Exemplo-âncora, o verbo que "puxa" os outros da família. */
  anchor: string;
  bases: string[];
}

export const VERB_FAMILIES: VerbFamily[] = [
  {
    id: 'same',
    title: 'As três formas iguais',
    rule: 'Não muda nada: a forma base serve para o did e para o have.',
    emoji: '🧊',
    anchor: 'cut – cut – cut',
    bases: ['cut', 'let', 'put', 'read'],
  },
  {
    id: 'back-to-base',
    title: 'O particípio volta à base',
    rule: 'O passado muda, mas o particípio é igual à forma base de novo.',
    emoji: '🔄',
    anchor: 'come – came – come',
    bases: ['come', 'run'],
  },
  {
    id: 'i-a-u',
    title: 'i → a → u',
    rule: 'Só a vogal do meio muda, sempre na mesma ordem: i, a, u.',
    emoji: '🎵',
    anchor: 'drink – drank – drunk',
    bases: ['begin', 'drink', 'sing'],
  },
  {
    id: 'ought',
    title: 'Família do -ought',
    rule: 'O verbo se desmonta e vira "-ought". Passado e particípio iguais.',
    emoji: '🌀',
    anchor: 'bring – brought – brought',
    bases: ['bring', 'buy', 'think'],
  },
  {
    id: 'ends-t',
    title: 'Passado = particípio, terminando em -t',
    rule: 'Uma forma só para did e have, quase sempre encurtando o verbo.',
    emoji: '✂️',
    anchor: 'sleep – slept – slept',
    bases: ['feel', 'keep', 'sleep', 'spend', 'lend', 'send', 'leave', 'lose', 'spell', 'meet'],
  },
  {
    id: 'ends-d',
    title: 'Passado = particípio, terminando em -d / -oo',
    rule: 'Também tem uma forma só, mas a mudança é na vogal ou num -d final.',
    emoji: '🔗',
    anchor: 'tell – told – told',
    bases: ['tell', 'sell', 'find', 'have', 'hear', 'make', 'pay', 'say', 'get', 'get up', 'sit', 'understand'],
  },
  {
    id: 'ew-own',
    title: '-ew no did, -own no have',
    rule: 'O passado termina em -ew e o particípio em -own.',
    emoji: '🍃',
    anchor: 'grow – grew – grown',
    bases: ['grow', 'know', 'fly'],
  },
  {
    id: 'en',
    title: 'Particípio terminando em -en',
    rule: 'O passado é livre, mas o particípio quase sempre ganha -en/-n.',
    emoji: '📌',
    anchor: 'eat – ate – eaten',
    bases: ['break', 'choose', 'drive', 'eat', 'fall', 'forget', 'give', 'speak', 'take', 'wake up', 'write', 'see'],
  },
  {
    id: 'wild',
    title: 'Os teimosos',
    rule: 'Fogem de qualquer padrão — estes são na base da repetição.',
    emoji: '🐉',
    anchor: 'go – went – gone',
    bases: ['be', 'do', 'go', 'can', 'there be'],
  },
];

/** Todos os verbos irregulares dos 4 blocos, em ordem de número na folha. */
export const IRREGULAR_VERBS: TopicItem[] = TOPICS.filter((t) => t.category === 'verbos')
  .flatMap((t) => t.items)
  .filter((i) => i.irregular && i.past)
  .sort((a, b) => a.id - b.id);

const byBase = new Map(IRREGULAR_VERBS.map((i) => [i.base, i]));

/** Os itens completos de uma família (na ordem em que foram listados). */
export const familyItems = (family: VerbFamily): TopicItem[] =>
  family.bases.map((b) => byBase.get(b)).filter((i): i is TopicItem => Boolean(i));

/**
 * Irregulares que não entraram em nenhuma família — deve ser sempre vazio.
 * Serve de rede de segurança quando novos verbos forem adicionados aos blocos.
 */
export const unassignedIrregulars = (): TopicItem[] => {
  const assigned = new Set(VERB_FAMILIES.flatMap((f) => f.bases));
  return IRREGULAR_VERBS.filter((i) => !assigned.has(i.base));
};
