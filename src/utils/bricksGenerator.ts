import type { BrickPhrase, BrickType } from '../types';

// Biblioteca de verbos comuns com conjugações e exemplos
interface VerbData {
  infinitive: string;
  thirdPerson: string;
  pastSimple: string;
  pastParticiple: string;
  gerund: string;
}

// Verbos pré-definidos com conjugações
const verbDatabase: Record<string, VerbData> = {
  work: { infinitive: 'work', thirdPerson: 'works', pastSimple: 'worked', pastParticiple: 'worked', gerund: 'working' },
  study: { infinitive: 'study', thirdPerson: 'studies', pastSimple: 'studied', pastParticiple: 'studied', gerund: 'studying' },
  eat: { infinitive: 'eat', thirdPerson: 'eats', pastSimple: 'ate', pastParticiple: 'eaten', gerund: 'eating' },
  drink: { infinitive: 'drink', thirdPerson: 'drinks', pastSimple: 'drank', pastParticiple: 'drunk', gerund: 'drinking' },
  sleep: { infinitive: 'sleep', thirdPerson: 'sleeps', pastSimple: 'slept', pastParticiple: 'slept', gerund: 'sleeping' },
  run: { infinitive: 'run', thirdPerson: 'runs', pastSimple: 'ran', pastParticiple: 'run', gerund: 'running' },
  walk: { infinitive: 'walk', thirdPerson: 'walks', pastSimple: 'walked', pastParticiple: 'walked', gerund: 'walking' },
  read: { infinitive: 'read', thirdPerson: 'reads', pastSimple: 'read', pastParticiple: 'read', gerund: 'reading' },
  write: { infinitive: 'write', thirdPerson: 'writes', pastSimple: 'wrote', pastParticiple: 'written', gerund: 'writing' },
  speak: { infinitive: 'speak', thirdPerson: 'speaks', pastSimple: 'spoke', pastParticiple: 'spoken', gerund: 'speaking' },
  listen: { infinitive: 'listen', thirdPerson: 'listens', pastSimple: 'listened', pastParticiple: 'listened', gerund: 'listening' },
  learn: { infinitive: 'learn', thirdPerson: 'learns', pastSimple: 'learned', pastParticiple: 'learned', gerund: 'learning' },
  teach: { infinitive: 'teach', thirdPerson: 'teaches', pastSimple: 'taught', pastParticiple: 'taught', gerund: 'teaching' },
  play: { infinitive: 'play', thirdPerson: 'plays', pastSimple: 'played', pastParticiple: 'played', gerund: 'playing' },
  cook: { infinitive: 'cook', thirdPerson: 'cooks', pastSimple: 'cooked', pastParticiple: 'cooked', gerund: 'cooking' },
  travel: { infinitive: 'travel', thirdPerson: 'travels', pastSimple: 'traveled', pastParticiple: 'traveled', gerund: 'traveling' },
  drive: { infinitive: 'drive', thirdPerson: 'drives', pastSimple: 'drove', pastParticiple: 'driven', gerund: 'driving' },
  swim: { infinitive: 'swim', thirdPerson: 'swims', pastSimple: 'swam', pastParticiple: 'swum', gerund: 'swimming' },
  dance: { infinitive: 'dance', thirdPerson: 'dances', pastSimple: 'danced', pastParticiple: 'danced', gerund: 'dancing' },
  sing: { infinitive: 'sing', thirdPerson: 'sings', pastSimple: 'sang', pastParticiple: 'sung', gerund: 'singing' },
  buy: { infinitive: 'buy', thirdPerson: 'buys', pastSimple: 'bought', pastParticiple: 'bought', gerund: 'buying' },
  sell: { infinitive: 'sell', thirdPerson: 'sells', pastSimple: 'sold', pastParticiple: 'sold', gerund: 'selling' },
  help: { infinitive: 'help', thirdPerson: 'helps', pastSimple: 'helped', pastParticiple: 'helped', gerund: 'helping' },
  call: { infinitive: 'call', thirdPerson: 'calls', pastSimple: 'called', pastParticiple: 'called', gerund: 'calling' },
  send: { infinitive: 'send', thirdPerson: 'sends', pastSimple: 'sent', pastParticiple: 'sent', gerund: 'sending' },
  receive: { infinitive: 'receive', thirdPerson: 'receives', pastSimple: 'received', pastParticiple: 'received', gerund: 'receiving' },
  think: { infinitive: 'think', thirdPerson: 'thinks', pastSimple: 'thought', pastParticiple: 'thought', gerund: 'thinking' },
  know: { infinitive: 'know', thirdPerson: 'knows', pastSimple: 'knew', pastParticiple: 'known', gerund: 'knowing' },
  see: { infinitive: 'see', thirdPerson: 'sees', pastSimple: 'saw', pastParticiple: 'seen', gerund: 'seeing' },
  watch: { infinitive: 'watch', thirdPerson: 'watches', pastSimple: 'watched', pastParticiple: 'watched', gerund: 'watching' },
};

// Frases modelo para cada tipo de Brick
interface PhraseTemplate {
  portuguese: string;
  english: string;
}

const getVerbData = (verb: string): VerbData => {
  const lowerVerb = verb.toLowerCase();
  if (verbDatabase[lowerVerb]) {
    return verbDatabase[lowerVerb];
  }
  
  // Para verbos não cadastrados, usar regras padrão de conjugação
  const endsWithE = lowerVerb.endsWith('e');
  const endsWithY = lowerVerb.endsWith('y');
  const endsWithConsonantY = endsWithY && !/[aeiou]y$/.test(lowerVerb);
  
  return {
    infinitive: lowerVerb,
    thirdPerson: endsWithConsonantY ? lowerVerb.slice(0, -1) + 'ies' : lowerVerb + 's',
    pastSimple: endsWithE ? lowerVerb + 'd' : endsWithConsonantY ? lowerVerb.slice(0, -1) + 'ied' : lowerVerb + 'ed',
    pastParticiple: endsWithE ? lowerVerb + 'd' : endsWithConsonantY ? lowerVerb.slice(0, -1) + 'ied' : lowerVerb + 'ed',
    gerund: endsWithE ? lowerVerb.slice(0, -1) + 'ing' : lowerVerb + 'ing',
  };
};

const phraseTemplates: Record<BrickType, (verb: VerbData) => PhraseTemplate> = {
  infinitive: (v) => ({
    portuguese: `Eu preciso ${getPortugueseInfinitive(v.infinitive)} todos os dias.`,
    english: `I need to ${v.infinitive} every day.`,
  }),
  
  imperative: (v) => ({
    portuguese: `${capitalize(getPortugueseImperative(v.infinitive))} agora, por favor!`,
    english: `${capitalize(v.infinitive)} now, please!`,
  }),
  
  do_does: (v) => ({
    portuguese: `Você ${getPortuguesePresent(v.infinitive)} regularmente?`,
    english: `Do you ${v.infinitive} regularly?`,
  }),
  
  are_you: (v) => ({
    portuguese: `Você está ${getPortugueseGerund(v.infinitive)} agora?`,
    english: `Are you ${v.gerund} now?`,
  }),
  
  have_been: (v) => ({
    portuguese: `Eu tenho ${getPortuguesePastParticiple(v.infinitive)} muito ultimamente.`,
    english: `I have been ${v.gerund} a lot lately.`,
  }),
  
  can: (v) => ({
    portuguese: `Você pode ${getPortugueseInfinitive(v.infinitive)} amanhã?`,
    english: `Can you ${v.infinitive} tomorrow?`,
  }),
  
  must_should: (v) => ({
    portuguese: `Você deveria ${getPortugueseInfinitive(v.infinitive)} mais frequentemente.`,
    english: `You should ${v.infinitive} more often.`,
  }),
  
  is_there_any: (v) => ({
    portuguese: `Existe alguém que possa ${getPortugueseInfinitive(v.infinitive)} comigo?`,
    english: `Is there anybody who can ${v.infinitive} with me?`,
  }),
  
  did_you: (v) => ({
    portuguese: `Você ${getPortuguesePast(v.infinitive)} ontem?`,
    english: `Did you ${v.infinitive} yesterday?`,
  }),
  
  have_you: (v) => ({
    portuguese: `Você já ${getPortuguesePastParticiple(v.infinitive)} antes?`,
    english: `Have you ever ${v.pastParticiple} before?`,
  }),
};

// Funções auxiliares para tradução aproximada (português simplificado)
function getPortugueseInfinitive(verb: string): string {
  const translations: Record<string, string> = {
    work: 'trabalhar', study: 'estudar', eat: 'comer', drink: 'beber',
    sleep: 'dormir', run: 'correr', walk: 'caminhar', read: 'ler',
    write: 'escrever', speak: 'falar', listen: 'ouvir', learn: 'aprender',
    teach: 'ensinar', play: 'jogar', cook: 'cozinhar', travel: 'viajar',
    drive: 'dirigir', swim: 'nadar', dance: 'dançar', sing: 'cantar',
    buy: 'comprar', sell: 'vender', help: 'ajudar', call: 'ligar',
    send: 'enviar', receive: 'receber', think: 'pensar', know: 'saber',
    see: 'ver', watch: 'assistir',
  };
  return translations[verb] || verb;
}

function getPortugueseImperative(verb: string): string {
  const translations: Record<string, string> = {
    work: 'trabalhe', study: 'estude', eat: 'coma', drink: 'beba',
    sleep: 'durma', run: 'corra', walk: 'caminhe', read: 'leia',
    write: 'escreva', speak: 'fale', listen: 'ouça', learn: 'aprenda',
    teach: 'ensine', play: 'jogue', cook: 'cozinhe', travel: 'viaje',
    drive: 'dirija', swim: 'nade', dance: 'dance', sing: 'cante',
    buy: 'compre', sell: 'venda', help: 'ajude', call: 'ligue',
    send: 'envie', receive: 'receba', think: 'pense', know: 'saiba',
    see: 'veja', watch: 'assista',
  };
  return translations[verb] || verb;
}

function getPortuguesePresent(verb: string): string {
  const translations: Record<string, string> = {
    work: 'trabalha', study: 'estuda', eat: 'come', drink: 'bebe',
    sleep: 'dorme', run: 'corre', walk: 'caminha', read: 'lê',
    write: 'escreve', speak: 'fala', listen: 'ouve', learn: 'aprende',
    teach: 'ensina', play: 'joga', cook: 'cozinha', travel: 'viaja',
    drive: 'dirige', swim: 'nada', dance: 'dança', sing: 'canta',
    buy: 'compra', sell: 'vende', help: 'ajuda', call: 'liga',
    send: 'envia', receive: 'recebe', think: 'pensa', know: 'sabe',
    see: 'vê', watch: 'assiste',
  };
  return translations[verb] || verb;
}

function getPortugueseGerund(verb: string): string {
  const translations: Record<string, string> = {
    work: 'trabalhando', study: 'estudando', eat: 'comendo', drink: 'bebendo',
    sleep: 'dormindo', run: 'correndo', walk: 'caminhando', read: 'lendo',
    write: 'escrevendo', speak: 'falando', listen: 'ouvindo', learn: 'aprendendo',
    teach: 'ensinando', play: 'jogando', cook: 'cozinhando', travel: 'viajando',
    drive: 'dirigindo', swim: 'nadando', dance: 'dançando', sing: 'cantando',
    buy: 'comprando', sell: 'vendendo', help: 'ajudando', call: 'ligando',
    send: 'enviando', receive: 'recebendo', think: 'pensando', know: 'sabendo',
    see: 'vendo', watch: 'assistindo',
  };
  return translations[verb] || verb + 'ndo';
}

function getPortuguesePast(verb: string): string {
  const translations: Record<string, string> = {
    work: 'trabalhou', study: 'estudou', eat: 'comeu', drink: 'bebeu',
    sleep: 'dormiu', run: 'correu', walk: 'caminhou', read: 'leu',
    write: 'escreveu', speak: 'falou', listen: 'ouviu', learn: 'aprendeu',
    teach: 'ensinou', play: 'jogou', cook: 'cozinhou', travel: 'viajou',
    drive: 'dirigiu', swim: 'nadou', dance: 'dançou', sing: 'cantou',
    buy: 'comprou', sell: 'vendeu', help: 'ajudou', call: 'ligou',
    send: 'enviou', receive: 'recebeu', think: 'pensou', know: 'soube',
    see: 'viu', watch: 'assistiu',
  };
  return translations[verb] || verb;
}

function getPortuguesePastParticiple(verb: string): string {
  const translations: Record<string, string> = {
    work: 'trabalhado', study: 'estudado', eat: 'comido', drink: 'bebido',
    sleep: 'dormido', run: 'corrido', walk: 'caminhado', read: 'lido',
    write: 'escrito', speak: 'falado', listen: 'ouvido', learn: 'aprendido',
    teach: 'ensinado', play: 'jogado', cook: 'cozinhado', travel: 'viajado',
    drive: 'dirigido', swim: 'nadado', dance: 'dançado', sing: 'cantado',
    buy: 'comprado', sell: 'vendido', help: 'ajudado', call: 'ligado',
    send: 'enviado', receive: 'recebido', think: 'pensado', know: 'sabido',
    see: 'visto', watch: 'assistido',
  };
  return translations[verb] || verb;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Função principal para gerar as 10 frases do Bricks Challenge
export function generateBricksPhrases(verb: string): BrickPhrase[] {
  const verbData = getVerbData(verb);
  const brickTypes: BrickType[] = [
    'infinitive',
    'imperative',
    'do_does',
    'are_you',
    'have_been',
    'can',
    'must_should',
    'is_there_any',
    'did_you',
    'have_you',
  ];
  
  return brickTypes.map((type) => {
    const template = phraseTemplates[type](verbData);
    return {
      type,
      portuguese: template.portuguese,
      english: template.english,
    };
  });
}

// Lista de verbos disponíveis para o Bricks Challenge
export const availableVerbs = Object.keys(verbDatabase);
