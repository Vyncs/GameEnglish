import type { GradedBook, ReaderWord, ReaderParagraph, BookTag } from '../types';
import { BOOK_TAGS } from '../types';

/**
 * Livros de exemplo para o Graded Readers
 * Tradução por CHUNKS: phrasal verbs e expressões como unidade (não palavra por palavra)
 */

// Frases: phrasal verbs e expressões comuns (chave = texto em minúsculo, valor = tradução)
const PHRASE_DICTIONARY: Record<string, string> = {
  // Phrasal verbs
  'wake up': 'acordar',
  'give up': 'desistir de',
  'look for': 'procurar',
  'look at': 'olhar para',
  'look after': 'cuidar de',
  'look up': 'olhar para cima / pesquisar',
  'find out': 'descobrir',
  'take care': 'cuidar (de si)',
  'take off': 'decolar / tirar',
  'take on': 'assumir',
  'get up': 'levantar-se',
  'get in': 'entrar',
  'get out': 'sair',
  'get on': 'embarcar / continuar',
  'go on': 'continuar',
  'go back': 'voltar',
  'go out': 'sair',
  'come back': 'voltar',
  'come in': 'entrar',
  'come from': 'vir de',
  'turn on': 'ligar',
  'turn off': 'desligar',
  'turn out': 'acabar (sendo)',
  'put on': 'vestir / colocar',
  'put away': 'guardar',
  'pick up': 'pegar / buscar',
  'work out': 'dar certo / malhar',
  'figure out': 'descobrir / entender',
  'run out': 'acabar (estoque)',
  'run into': 'encontrar por acaso',
  'deal with': 'lidar com',
  'talk about': 'falar sobre',
  'think about': 'pensar em',
  'wait for': 'esperar por',
  'listen to': 'ouvir / escutar',
  'depend on': 'depender de',
  'interested in': 'interessado em',
  'good at': 'bom em',
  'afraid of': 'com medo de',
  'proud of': 'orgulhoso de',
  'ready for': 'pronto para',
  // Expressões / colocações
  'every day': 'todo dia',
  'every morning': 'toda manhã',
  'every night': 'toda noite',
  'a little': 'um pouco',
  'a lot': 'muito',
  'a lot of': 'muito(s)/muita(s)',
  'lots of': 'muito(s)/muita(s)',
  'kind of': 'meio que',
  'of course': 'claro',
  'at first': 'no início',
  'at last': 'finalmente',
  'at least': 'pelo menos',
  'at all': 'de jeito nenhum',
  'in fact': 'na verdade',
  'as well': 'também',
  'as well as': 'assim como',
  'such as': 'como por exemplo',
  'for example': 'por exemplo',
  'for instance': 'por exemplo',
  'as soon as': 'assim que',
  'as long as': 'desde que',
  'even though': 'mesmo que',
  'as if': 'como se',
  'used to': 'costumava',
  'have to': 'ter que',
  'has to': 'tem que',
  'had to': 'tinha que',
  'want to': 'querer',
  'need to': 'precisar',
  'try to': 'tentar',
  'able to': 'capaz de',
  'going to': 'ir (futuro)',
  'would like': 'gostaria',
  'could not': 'não podia',
  'did not': 'não (passado)',
  'do not': 'não (presente)',
  'does not': 'não (3ª pess.)',
  'is not': 'não é',
  'are not': 'não são',
  'was not': 'não era',
  'were not': 'não eram',
  'have not': 'não tenho/temos',
  'has not': 'não tem',
  'had not': 'não tinha',
  'break down': 'quebrar (máq.)',
  'call back': 'retornar ligação',
  'check in': 'fazer check-in',
  'fill out': 'preencher',
  'point at': 'apontar para',
  'spoke slowly': 'falou devagar',
  'spoke clearly': 'falou claramente',
  // Formas passadas/outras flexões (mesmo sentido)
  'gave up': 'desistiu de',
  'gave in': 'cedeu',
  'got up': 'levantou-se',
  'got in': 'entrou',
  'got out': 'saiu',
  'got on': 'embarcou',
  'looked for': 'procurou',
  'looked at': 'olhou para',
  'found out': 'descobriu',
  'came back': 'voltou',
  'came in': 'entrou',
  'went on': 'continuou',
  'went back': 'voltou',
  'went out': 'saiu',
  'turned on': 'ligou',
  'turned off': 'desligou',
  'picked up': 'pegou/buscou',
  'ran out': 'acabou',
  'ran into': 'encontrou por acaso',
  'depends on': 'depende de',
  'depended on': 'dependia de',
  'talked about': 'falou sobre',
  'thought about': 'pensou em',
  'waited for': 'esperou por',
  'listened to': 'ouviu',
};

export interface TokenizeOptions {
  /** Palavras desconhecidas ficam clicáveis com tradução "—" (útil para histórias geradas por IA) */
  unknownAsClickable?: boolean;
}

/**
 * Tokeniza por CHUNKS: prioriza phrasal verbs e expressões, depois palavras soltas.
 * Cada chunk pode ser "give up" (tradução única) ou "give" (palavra).
 */
function tokenizeByChunks(
  text: string,
  wordDict: Record<string, string>,
  options?: TokenizeOptions
): ReaderWord[] {
  const rawWords = text.split(/\s+/);
  const result: ReaderWord[] = [];
  let i = 0;
  const unknownAsClickable = options?.unknownAsClickable ?? false;

  while (i < rawWords.length) {
    const clean = (w: string) => w.replace(/[.,!?;:"'()]/g, '').toLowerCase();
    const withPunct = (w: string) => {
      const match = w.match(/(.*?)([.,!?;:"'()]*)$/);
      return match ? { word: match[1], punct: match[2] } : { word: w, punct: '' };
    };

    // Tenta frase de 3 palavras
    if (i + 2 < rawWords.length) {
      const w1 = withPunct(rawWords[i]);
      const w2 = withPunct(rawWords[i + 1]);
      const w3 = withPunct(rawWords[i + 2]);
      const key3 = `${clean(w1.word)} ${clean(w2.word)} ${clean(w3.word)}`;
      if (PHRASE_DICTIONARY[key3]) {
        result.push({
          word: `${rawWords[i]} ${rawWords[i + 1]} ${rawWords[i + 2]}`,
          translation: PHRASE_DICTIONARY[key3],
          isClickable: true,
        });
        i += 3;
        continue;
      }
    }

    // Tenta frase de 2 palavras
    if (i + 1 < rawWords.length) {
      const w1 = withPunct(rawWords[i]);
      const w2 = withPunct(rawWords[i + 1]);
      const key2 = `${clean(w1.word)} ${clean(w2.word)}`;
      if (PHRASE_DICTIONARY[key2]) {
        result.push({
          word: `${rawWords[i]} ${rawWords[i + 1]}`,
          translation: PHRASE_DICTIONARY[key2],
          isClickable: true,
        });
        i += 2;
        continue;
      }
    }

    // Palavra única
    const w = withPunct(rawWords[i]);
    const key = clean(w.word);
    const translation = PHRASE_DICTIONARY[key] ?? wordDict[key] ?? '';
    const hasTranslation = !!translation;
    result.push({
      word: rawWords[i],
      translation: hasTranslation ? translation : unknownAsClickable ? '—' : '',
      isClickable: hasTranslation || unknownAsClickable,
    });
    i++;
  }

  return result;
}

// Compatibilidade: aceita texto + dicionário de palavras (frases são detectadas automaticamente)
const tokenize = (text: string, wordTranslations: Record<string, string>) =>
  tokenizeByChunks(text, wordTranslations);

// Dicionário de palavras comuns A1
const a1Dictionary: Record<string, string> = {
  'i': 'eu',
  'my': 'meu/minha',
  'name': 'nome',
  'is': 'é/está',
  'am': 'sou/estou',
  'live': 'moro/vivo',
  'in': 'em',
  'a': 'um/uma',
  'small': 'pequeno/a',
  'city': 'cidade',
  'every': 'todo/a',
  'day': 'dia',
  'wake': 'acordo',
  'up': 'cima',
  'at': 'em/às',
  'have': 'tenho/tomo',
  'breakfast': 'café da manhã',
  'go': 'vou',
  'to': 'para',
  'work': 'trabalho',
  'by': 'de',
  'bus': 'ônibus',
  'like': 'gosto',
  'job': 'trabalho/emprego',
  'help': 'ajudo',
  'people': 'pessoas',
  'after': 'depois',
  'come': 'venho',
  'home': 'casa',
  'and': 'e',
  'cook': 'cozinho',
  'dinner': 'jantar',
  'read': 'leio',
  'books': 'livros',
  'watch': 'assisto',
  'tv': 'TV',
  'sleep': 'durmo',
  'the': 'o/a',
  'morning': 'manhã',
  'evening': 'noite',
  'happy': 'feliz',
  'life': 'vida',
  'simple': 'simples',
  'good': 'bom/boa',
  'love': 'amo',
  'family': 'família',
  'friends': 'amigos',
  'weekend': 'fim de semana',
  'park': 'parque',
  'walk': 'caminho',
  'dog': 'cachorro',
  'cat': 'gato',
  'sunny': 'ensolarado',
  'rainy': 'chuvoso',
  'weather': 'clima',
  'nice': 'legal/agradável',
  'today': 'hoje',
  'tomorrow': 'amanhã',
  'yesterday': 'ontem',
  'was': 'foi/estava',
  'are': 'são/estão',
  'we': 'nós',
  'they': 'eles/elas',
  'he': 'ele',
  'she': 'ela',
  'it': 'isso/ele/ela',
  'this': 'este/esta/isso',
  'that': 'aquele/aquela/isso',
  'here': 'aqui',
  'there': 'lá',
  'now': 'agora',
  'then': 'então',
  'but': 'mas',
  'or': 'ou',
  'because': 'porque',
  'so': 'então/assim',
  'very': 'muito',
  'really': 'realmente',
  'always': 'sempre',
  'never': 'nunca',
  'sometimes': 'às vezes',
  'often': 'frequentemente',
  'usually': 'geralmente',
  'eat': 'como',
  'drink': 'bebo',
  'coffee': 'café',
  'tea': 'chá',
  'water': 'água',
  'food': 'comida',
  'want': 'quero',
  'need': 'preciso',
  'can': 'posso',
  'new': 'novo/a',
  'old': 'velho/a',
  'big': 'grande',
  'little': 'pequeno/a',
  'time': 'tempo/hora',
  'year': 'ano',
  'month': 'mês',
  'week': 'semana',
  'hour': 'hora',
  'minute': 'minuto',
  'school': 'escola',
  'student': 'estudante',
  'teacher': 'professor/a',
  'learn': 'aprendo',
  'study': 'estudo',
  'english': 'inglês',
  'portuguese': 'português',
  'language': 'língua/idioma',
  'speak': 'falo',
  'understand': 'entendo',
  'know': 'sei/conheço',
  'think': 'penso',
  'feel': 'sinto',
  'see': 'vejo',
  'hear': 'ouço',
  'say': 'digo',
  'tell': 'conto',
  'ask': 'pergunto',
  'answer': 'respondo',
  'give': 'dou',
  'take': 'pego',
  'make': 'faço',
  'get': 'pego/consigo',
  'put': 'coloco',
  'find': 'encontro',
  'use': 'uso',
  'call': 'chamo/ligo',
  'try': 'tento',
  'start': 'começo',
  'stop': 'paro',
  'open': 'abro',
  'close': 'fecho',
  'run': 'corro',
  'sit': 'sento',
  'stand': 'fico em pé',
  'wait': 'espero',
  'write': 'escrevo',
  'play': 'jogo/brinco',
  'listen': 'escuto',
  'music': 'música',
  'movie': 'filme',
  'book': 'livro',
  'phone': 'telefone',
  'computer': 'computador',
  'car': 'carro',
  'house': 'casa',
  'room': 'quarto/sala',
  'door': 'porta',
  'window': 'janela',
  'table': 'mesa',
  'chair': 'cadeira',
  'bed': 'cama',
  'kitchen': 'cozinha',
  'bathroom': 'banheiro',
  'street': 'rua',
  'store': 'loja',
  'restaurant': 'restaurante',
  'office': 'escritório',
  'hospital': 'hospital',
  'money': 'dinheiro',
  'price': 'preço',
  'buy': 'compro',
  'sell': 'vendo',
  'pay': 'pago',
  'cheap': 'barato',
  'expensive': 'caro',
  'free': 'grátis/livre',
  'sorry': 'desculpe',
  'please': 'por favor',
  'thank': 'obrigado',
  'thanks': 'obrigado',
  'you': 'você',
  'your': 'seu/sua',
  'welcome': 'bem-vindo',
  'hello': 'olá',
  'hi': 'oi',
  'bye': 'tchau',
  'goodbye': 'adeus',
  'yes': 'sim',
  'no': 'não',
  'maybe': 'talvez',
  'ok': 'ok',
  'okay': 'ok',
  'fine': 'bem',
  'great': 'ótimo',
  'beautiful': 'bonito/a',
  'ugly': 'feio/a',
  'hot': 'quente',
  'cold': 'frio',
  'warm': 'morno',
  'cool': 'fresco/legal',
  'any': 'qualquer/algum/alguma',
  'from': 'de/desde',
  'into': 'em/dentro de',
  'out': 'fora',
  'over': 'sobre/acima',
  'down': 'para baixo',
  'off': 'fora/desligado',
  'about': 'sobre',
  'with': 'com',
  'for': 'para',
  'message': 'mensagem',
  'messages': 'mensagens',
  'chat': 'conversar/chat',
  'chatting': 'conversando',
  'joy': 'alegria',
  'end': 'fim/terminar',
  'started': 'comecei',
  'online': 'online',
  'tab': 'aba',
  'keyboard': 'teclado',
  'screen': 'tela',
  'click': 'clique/clicar',
  'clicked': 'cliquei',
  'send': 'enviar',
  'sent': 'enviei',
  'reply': 'resposta/responder',
  'replied': 'respondi',
  'writing': 'escrevendo',
  'written': 'escrito',
  'back': 'volta/trás',
  'again': 'novamente',
  'still': 'ainda',
  'already': 'já',
  'just': 'só/acabei de',
  'even': 'até/mesmo',
  'only': 'só/apenas',
  'both': 'ambos',
  'either': 'qualquer um',
  'neither': 'nenhum',
  'none': 'nenhum',
  'someone': 'alguém',
  'everyone': 'todo mundo',
  'anyone': 'qualquer um',
  'nothing': 'nada',
  'everything': 'tudo',
  'somewhere': 'em algum lugar',
  'everywhere': 'em todo lugar',
  'anywhere': 'em qualquer lugar',
  'nowhere': 'em lugar nenhum',
  'however': 'porém',
  'although': 'embora',
  'though': 'embora',
  'whether': 'se',
  'until': 'até',
  'during': 'durante',
  'through': 'através',
  'without': 'sem',
  'within': 'dentro de',
  'between': 'entre',
  'among': 'entre',
  'against': 'contra',
  'toward': 'em direção a',
  'towards': 'em direção a',
  'above': 'acima',
  'below': 'abaixo',
  'behind': 'atrás',
  'beside': 'ao lado',
  'inside': 'dentro',
  'outside': 'fora',
};

// Dicionário A2 (inclui A1 + mais palavras)
const a2Dictionary: Record<string, string> = {
  ...a1Dictionary,
  'decided': 'decidi',
  'visit': 'visitar',
  'excited': 'animado/a',
  'trip': 'viagem',
  'first': 'primeiro/a',
  'arrived': 'cheguei',
  'airport': 'aeroporto',
  'nervous': 'nervoso/a',
  'everything': 'tudo',
  'different': 'diferente',
  'signs': 'placas',
  'language': 'língua',
  'lost': 'perdido/a',
  'kind': 'gentil',
  'helped': 'ajudou',
  'taxi': 'táxi',
  'driver': 'motorista',
  'smiled': 'sorriu',
  'tried': 'tentei',
  'few': 'poucos/as',
  'words': 'palavras',
  'laughed': 'riu',
  'accent': 'sotaque',
  'funny': 'engraçado/a',
  'hotel': 'hotel',
  'tired': 'cansado/a',
  'next': 'próximo/a',
  'explored': 'explorei',
  'walked': 'caminhei',
  'streets': 'ruas',
  'buildings': 'prédios',
  'shops': 'lojas',
  'cafes': 'cafés',
  'stopped': 'parei',
  'ordered': 'pedi',
  'pointed': 'apontei',
  'picture': 'foto',
  'menu': 'cardápio',
  'waiter': 'garçom',
  'understood': 'entendeu',
  'brought': 'trouxe',
  'delicious': 'delicioso/a',
  'proud': 'orgulhoso/a',
  'myself': 'eu mesmo/a',
  'afternoon': 'tarde',
  'museum': 'museu',
  'art': 'arte',
  'history': 'história',
  'interesting': 'interessante',
  'guide': 'guia',
  'slowly': 'devagar',
  'clearly': 'claramente',
  'followed': 'segui',
  'learned': 'aprendi',
  'culture': 'cultura',
  'country': 'país',
  'night': 'noite',
  'along': 'ao longo',
  'river': 'rio',
  'lights': 'luzes',
  'sparkled': 'brilharam',
  'sat': 'sentei',
  'bench': 'banco',
  'watched': 'observei',
  'pass': 'passar',
  'moment': 'momento',
  'perfect': 'perfeito/a',
  'peaceful': 'tranquilo/a',
  'remembered': 'lembrei',
  'afraid': 'com medo',
  'traveling': 'viajar',
  'alone': 'sozinho/a',
  'realized': 'percebi',
  'brave': 'corajoso/a',
  'thought': 'pensei',
  'week': 'semana',
  'visited': 'visitei',
  'places': 'lugares',
  'met': 'conheci',
  'wonderful': 'maravilhoso/a',
  'each': 'cada',
  'taught': 'ensinou',
  'something': 'algo',
  'left': 'parti',
  'sad': 'triste',
  'leave': 'partir',
  'knew': 'sabia',
  'return': 'voltar',
  'someday': 'algum dia',
  'changed': 'mudou',
  'confident': 'confiante',
  'ready': 'pronto/a',
  'adventure': 'aventura',
  'world': 'mundo',
  'waiting': 'esperando',
  'explore': 'explorar',
  // B1 / B2 – vocabulário dos livros intermediários
  'bother': 'incomodar',
  'towel': 'toalha',
  'drying': 'secando',
  'invited': 'convidei',
  'inside': 'dentro',
  'explained': 'explicou',
  'neighbor': 'vizinho',
  'tears': 'lágrimas',
  'filled': 'encheram',
  'hugged': 'abraçaram',
  'reunite': 'reunir',
  'unexpected': 'inesperado/a',
  'surprises': 'surpresas',
  'raining': 'chovendo',
  'knock': 'batida',
  'expecting': 'esperando',
  'standing': 'em pé',
  'completely': 'completamente',
  'wet': 'molhado/a',
  'signal': 'sinal',
  'yours': 'seu/sua',
  'spoken': 'falado',
  'town': 'cidade',
  'address': 'endereço',
  'believe': 'acreditar',
  'without': 'sem',
  'saying': 'dizendo',
  'brings': 'traz',
  'rainy': 'chuvoso',
  'radical': 'radical',
  'decision': 'decisão',
  'entire': 'inteiro/a',
  'devices': 'dispositivos',
  'incredibly': 'incrivelmente',
  'reaching': 'alcançando',
  'locked': 'trancado',
  'isolating': 'isolador',
  'texting': 'mandar mensagem',
  'conversations': 'conversas',
  'meaningful': 'significativo',
  'rediscovered': 'redescobri',
  'hobbies': 'hobbies',
  'painted': 'pintei',
  'physical': 'físico',
  'elaborate': 'elaborado',
  'meals': 'refeições',
  'dramatically': 'drasticamente',
  'blue': 'azul',
  'hundreds': 'centenas',
  'surprisingly': 'surpreendentemente',
  'anxious': 'ansioso/a',
  'mindfully': 'com consciência',
  'detox': 'detox',
  'screens': 'telas',
  'colleagues': 'colegas',
  'questions': 'perguntas',
  'friendly': 'amigável',
  'welcomed': 'deu boas-vindas',
  'desk': 'mesa de trabalho',
  'lunch': 'almoço',
  'near': 'perto',
  'boss': 'chefe',
  'tasks': 'tarefas',
  'carefully': 'com cuidado',
  'notes': 'notas',
  'passed': 'passou',
  'opened': 'abri / abriu',
  'woman': 'mulher',
  'saw': 'vi',
  'rain': 'chuva',
  'broke': 'quebrou',
  'may': 'posso',
  'gave': 'dei',
  'hair': 'cabelo',
  'driving': 'dirigindo',
  'looking': 'procurando',
  'brother': 'irmão',
  'lives': 'mora',
  'asked': 'perguntei',
  'lived': 'morava',
  'eyes': 'olhos',
  'word': 'palavra',
  'checking': 'verificando',
  'notifications': 'notificações',
  'become': 'tornaram-se',
  'oxygen': 'oxigênio',
  'doctor': 'médico',
  'anxiety': 'ansiedade',
  'directly': 'diretamente',
  'linked': 'ligado',
  'screen': 'tela',
  'spend': 'passar',
  'digital': 'digital',
  'kept': 'continuei',
  'away': 'longe',
  'social': 'social',
  'media': 'mídia',
  'idea': 'ideia',
  'doing': 'fazendo',
  'happened': 'aconteceu',
  'started': 'comecei',
  'calling': 'ligando',
  'instead': 'em vez de',
  'longer': 'mais longas',
  'deeper': 'mais profundas',
  'than': 'que',
  'message': 'mensagem',
  'ever': 'já',
  'sent': 'enviei',
  'second': 'segundo',
  'cooked': 'cozinhou',
  'noticed': 'notei',
  'seen': 'visto',
  'birds': 'pássaros',
  'singing': 'cantando',
  'color': 'cor',
  'sunset': 'pôr do sol',
  'improved': 'melhorou',
  'light': 'luz',
  'falling': 'caindo',
  'asleep': 'adormecido',
  'ended': 'terminou',
  'turned': 'liguei',
  'check': 'verificar',
  'seemed': 'pareciam',
  'unimportant': 'sem importância',
  'given': 'desistido',
  'technology': 'tecnologia',
  'real': 'real',
  'happens': 'acontece',
  'look': 'olhar',
  'famous': 'famoso',
  'almost': 'quase',
  'center': 'centro',
  'best': 'melhor',
  'clothes': 'roupas',
  'quickly': 'rapidamente',
  'anyone': 'ninguém',
  'dry': 'secar',
  'while': 'enquanto',
  'five': 'cinco',
  'minutes': 'minutos',
  'would': 'iria',
  'most': 'a maioria',
  'our': 'nossas',
};

export const defaultGradedBooks: GradedBook[] = [
  // ==========================================
  // A1 - BEGINNER
  // ==========================================
  {
    id: 'a1-my-day',
    title: 'My Day',
    author: 'English Learning',
    level: 'A1',
    tags: ['daily-life'],
    coverUrl: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=300&h=400&fit=crop',
    totalWords: 120,
    estimatedMinutes: 3,
    description: 'A simple story about daily routine. Perfect for beginners.',
    paragraphs: [
      {
        id: 'p1',
        words: tokenize('My name is Tom. I am 25 years old. I live in a small city.', a1Dictionary),
      },
      {
        id: 'p2',
        words: tokenize('Every day, I wake up at 7 in the morning. I have breakfast and drink coffee.', a1Dictionary),
      },
      {
        id: 'p3',
        words: tokenize('I go to work by bus. I like my job. I help people every day.', a1Dictionary),
      },
      {
        id: 'p4',
        words: tokenize('After work, I come home. I cook dinner and watch TV.', a1Dictionary),
      },
      {
        id: 'p5',
        words: tokenize('Sometimes I read books. I like books about travel.', a1Dictionary),
      },
      {
        id: 'p6',
        words: tokenize('At night, I sleep at 10. My life is simple but happy.', a1Dictionary),
      },
    ],
    questions: [
      {
        id: 'q1',
        question: 'What time does Tom wake up?',
        options: ['6 in the morning', '7 in the morning', '8 in the morning', '9 in the morning'],
        correctIndex: 1,
      },
      {
        id: 'q2',
        question: 'How does Tom go to work?',
        options: ['By car', 'By bus', 'By train', 'On foot'],
        correctIndex: 1,
      },
      {
        id: 'q3',
        question: 'What does Tom like to read?',
        options: ['Books about food', 'Books about travel', 'Books about work', 'Books about animals'],
        correctIndex: 1,
      },
    ],
    progress: 0,
    createdAt: Date.now(),
    isCustom: false,
  },
  {
    id: 'a1-my-family',
    title: 'My Family',
    author: 'English Learning',
    level: 'A1',
    tags: ['daily-life'],
    coverUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=300&h=400&fit=crop',
    totalWords: 100,
    estimatedMinutes: 2,
    description: 'Learn family vocabulary with this simple story.',
    paragraphs: [
      {
        id: 'p1',
        words: tokenize('I have a small family. There are four people in my family.', a1Dictionary),
      },
      {
        id: 'p2',
        words: tokenize('My father is a teacher. He is 50 years old. He is very kind.', a1Dictionary),
      },
      {
        id: 'p3',
        words: tokenize('My mother works at a hospital. She helps people every day.', a1Dictionary),
      },
      {
        id: 'p4',
        words: tokenize('I have one sister. Her name is Maria. She is a student.', a1Dictionary),
      },
      {
        id: 'p5',
        words: tokenize('We live in a big house. I love my family very much.', a1Dictionary),
      },
    ],
    progress: 0,
    createdAt: Date.now(),
    isCustom: false,
  },

  // ==========================================
  // A2 - ELEMENTARY
  // ==========================================
  {
    id: 'a2-first-trip',
    title: 'My First Trip Abroad',
    author: 'English Learning',
    level: 'A2',
    tags: ['travel', 'adventure'],
    coverUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&h=400&fit=crop',
    totalWords: 350,
    estimatedMinutes: 8,
    description: 'An exciting story about traveling to a new country for the first time.',
    paragraphs: [
      {
        id: 'p1',
        words: tokenize('Last year, I decided to visit London. I was very excited because it was my first trip abroad.', a2Dictionary),
      },
      {
        id: 'p2',
        words: tokenize('When I arrived at the airport, I was a little nervous. Everything was different. The signs were in English.', a2Dictionary),
      },
      {
        id: 'p3',
        words: tokenize('I felt lost at first, but a kind woman helped me. She showed me where to find a taxi.', a2Dictionary),
      },
      {
        id: 'p4',
        words: tokenize('The taxi driver smiled at me. I tried to speak a few words in English. He laughed because my accent was funny.', a2Dictionary),
      },
      {
        id: 'p5',
        words: tokenize('I arrived at my hotel very tired. I slept well that night.', a2Dictionary),
      },
      {
        id: 'p6',
        words: tokenize('The next morning, I explored the city. I walked in the streets and saw beautiful old buildings.', a2Dictionary),
      },
      {
        id: 'p7',
        words: tokenize('There were many shops and cafes. I stopped at a small cafe and ordered coffee.', a2Dictionary),
      },
      {
        id: 'p8',
        words: tokenize('I pointed at a picture on the menu. The waiter understood and brought me a delicious sandwich too.', a2Dictionary),
      },
      {
        id: 'p9',
        words: tokenize('I was proud of myself. I could communicate in English!', a2Dictionary),
      },
      {
        id: 'p10',
        words: tokenize('In the afternoon, I visited a famous museum. I learned about art and history.', a2Dictionary),
      },
      {
        id: 'p11',
        words: tokenize('The guide spoke slowly and clearly. I understood almost everything. It was very interesting.', a2Dictionary),
      },
      {
        id: 'p12',
        words: tokenize('That night, I walked along the river. The lights sparkled on the water. It was beautiful.', a2Dictionary),
      },
      {
        id: 'p13',
        words: tokenize('I sat on a bench and watched people pass by. It was a perfect moment.', a2Dictionary),
      },
      {
        id: 'p14',
        words: tokenize('I remembered that I was afraid of traveling alone. But now I felt brave and happy.', a2Dictionary),
      },
      {
        id: 'p15',
        words: tokenize('During that week, I visited many places and met wonderful people. Each day taught me something new.', a2Dictionary),
      },
      {
        id: 'p16',
        words: tokenize('When I left London, I was sad to leave. But I knew I would return someday.', a2Dictionary),
      },
      {
        id: 'p17',
        words: tokenize('This trip changed me. Now I am more confident. I am ready for my next adventure!', a2Dictionary),
      },
    ],
    questions: [
      {
        id: 'q1',
        question: 'Where did the narrator travel to?',
        options: ['Paris', 'New York', 'London', 'Tokyo'],
        correctIndex: 2,
      },
      {
        id: 'q2',
        question: 'How did the narrator feel at the airport?',
        options: ['Happy', 'Nervous', 'Angry', 'Bored'],
        correctIndex: 1,
      },
      {
        id: 'q3',
        question: 'What did the narrator visit in the afternoon?',
        options: ['A park', 'A museum', 'A restaurant', 'A hotel'],
        correctIndex: 1,
      },
      {
        id: 'q4',
        question: 'Where did the narrator walk at night?',
        options: ['In the park', 'In the museum', 'Along the river', 'In the hotel'],
        correctIndex: 2,
      },
      {
        id: 'q5',
        question: 'How did the narrator feel at the end of the trip?',
        options: ['Scared', 'Confident', 'Tired', 'Bored'],
        correctIndex: 1,
      },
    ],
    progress: 0,
    createdAt: Date.now(),
    isCustom: false,
  },
  {
    id: 'a2-new-job',
    title: 'The New Job',
    author: 'English Learning',
    level: 'A2',
    tags: ['work', 'daily-life'],
    coverUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=300&h=400&fit=crop',
    totalWords: 200,
    estimatedMinutes: 5,
    description: 'A story about starting a new job and meeting new colleagues.',
    paragraphs: [
      {
        id: 'p1',
        words: tokenize('Today was my first day at my new job. I woke up early because I was nervous.', a2Dictionary),
      },
      {
        id: 'p2',
        words: tokenize('I put on my best clothes and left home at 7:30. The office was in the center of the city.', a2Dictionary),
      },
      {
        id: 'p3',
        words: tokenize('When I arrived, a friendly woman welcomed me. Her name was Sarah. She showed me my desk.', a2Dictionary),
      },
      {
        id: 'p4',
        words: tokenize('I met my new colleagues. They were very nice and asked me many questions about myself.', a2Dictionary),
      },
      {
        id: 'p5',
        words: tokenize('At lunch, we went to a restaurant near the office. The food was delicious and cheap.', a2Dictionary),
      },
      {
        id: 'p6',
        words: tokenize('In the afternoon, my boss explained my tasks. I listened carefully and took notes.', a2Dictionary),
      },
      {
        id: 'p7',
        words: tokenize('The day passed quickly. At 6 pm, I said goodbye to everyone and went home.', a2Dictionary),
      },
      {
        id: 'p8',
        words: tokenize('I felt tired but happy. I think I will like this job. Tomorrow will be another good day.', a2Dictionary),
      },
    ],
    progress: 0,
    createdAt: Date.now(),
    isCustom: false,
  },

  // ==========================================
  // B1 - INTERMEDIATE  
  // ==========================================
  {
    id: 'b1-unexpected-guest',
    title: 'The Unexpected Guest',
    author: 'English Learning',
    level: 'B1',
    tags: ['mystery', 'daily-life'],
    coverUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop',
    totalWords: 400,
    estimatedMinutes: 10,
    description: 'A mysterious visitor changes everything in this engaging story.',
    paragraphs: [
      {
        id: 'p1',
        words: tokenize('It had been raining all evening when I heard a knock at my door. I was not expecting anyone.', a2Dictionary),
      },
      {
        id: 'p2',
        words: tokenize('I opened the door and saw a woman standing there. She was completely wet from the rain.', a2Dictionary),
      },
      {
        id: 'p3',
        words: tokenize('"I am sorry to bother you," she said. "My car broke down and my phone has no signal. May I use yours?"', a2Dictionary),
      },
      {
        id: 'p4',
        words: tokenize('I invited her inside and gave her a towel. While she was drying her hair, I made some hot tea.', a2Dictionary),
      },
      {
        id: 'p5',
        words: tokenize('"Thank you so much," she said. "My name is Elena. I have been driving for hours."', a2Dictionary),
      },
      {
        id: 'p6',
        words: tokenize('She told me she was looking for her brother. They had not spoken in five years.', a2Dictionary),
      },
      {
        id: 'p7',
        words: tokenize('"He lives somewhere in this town," she explained. "But I have lost his address."', a2Dictionary),
      },
      {
        id: 'p8',
        words: tokenize('I asked her what his name was. When she told me, I could not believe it.', a2Dictionary),
      },
      {
        id: 'p9',
        words: tokenize('Her brother was my neighbor! He lived in the house next door.', a2Dictionary),
      },
      {
        id: 'p10',
        words: tokenize('I walked with Elena to his house. When he opened the door, tears filled his eyes.', a2Dictionary),
      },
      {
        id: 'p11',
        words: tokenize('They hugged for a long time without saying a word. It was a beautiful moment.', a2Dictionary),
      },
      {
        id: 'p12',
        words: tokenize('Sometimes life brings unexpected surprises. That rainy night, I helped reunite a family.', a2Dictionary),
      },
    ],
    questions: [
      {
        id: 'q1',
        question: 'Why did Elena knock on the door?',
        options: ['She was lost', 'Her car broke down', 'She was hungry', 'She knew the narrator'],
        correctIndex: 1,
      },
      {
        id: 'q2',
        question: 'Who was Elena looking for?',
        options: ['Her friend', 'Her mother', 'Her brother', 'Her husband'],
        correctIndex: 2,
      },
      {
        id: 'q3',
        question: 'Where did Elena\'s brother live?',
        options: ['In another city', 'Next door', 'Far away', 'In the same house'],
        correctIndex: 1,
      },
    ],
    progress: 0,
    createdAt: Date.now(),
    isCustom: false,
  },

  // ==========================================
  // B2 - UPPER-INTERMEDIATE
  // ==========================================
  {
    id: 'b2-digital-detox',
    title: 'The Digital Detox',
    author: 'English Learning',
    level: 'B2',
    tags: ['daily-life', 'adventure'],
    coverUrl: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=300&h=400&fit=crop',
    totalWords: 500,
    estimatedMinutes: 12,
    description: 'A thought-provoking story about disconnecting from technology.',
    paragraphs: [
      {
        id: 'p1',
        words: tokenize('I had been checking my phone every five minutes for years. Notifications had become my oxygen.', a2Dictionary),
      },
      {
        id: 'p2',
        words: tokenize('One day, my doctor told me something that changed everything. "Your anxiety is directly linked to your screen time."', a2Dictionary),
      },
      {
        id: 'p3',
        words: tokenize('That evening, I made a radical decision. I would spend an entire month without any digital devices.', a2Dictionary),
      },
      {
        id: 'p4',
        words: tokenize('The first week was incredibly difficult. I kept reaching for my phone, only to remember it was locked away.', a2Dictionary),
      },
      {
        id: 'p5',
        words: tokenize('Without social media, I had no idea what my friends were doing. At first, this felt isolating.', a2Dictionary),
      },
      {
        id: 'p6',
        words: tokenize('But then something unexpected happened. I started calling people instead of texting them.', a2Dictionary),
      },
      {
        id: 'p7',
        words: tokenize('The conversations were longer, deeper, and more meaningful than any message I had ever sent.', a2Dictionary),
      },
      {
        id: 'p8',
        words: tokenize('By the second week, I had rediscovered old hobbies. I painted, read physical books, and cooked elaborate meals.', a2Dictionary),
      },
      {
        id: 'p9',
        words: tokenize('I noticed things I had never seen before: the birds singing in the morning, the color of the sunset.', a2Dictionary),
      },
      {
        id: 'p10',
        words: tokenize('My sleep improved dramatically. Without blue light before bed, I was falling asleep naturally.', a2Dictionary),
      },
      {
        id: 'p11',
        words: tokenize('When the month ended, I turned on my phone. There were hundreds of notifications waiting for me.', a2Dictionary),
      },
      {
        id: 'p12',
        words: tokenize('But surprisingly, I did not feel anxious to check them. Most of them seemed unimportant now.', a2Dictionary),
      },
      {
        id: 'p13',
        words: tokenize('I have not given up technology completely. But I have learned to use it mindfully.', a2Dictionary),
      },
      {
        id: 'p14',
        words: tokenize('The digital detox taught me that real life happens when we look up from our screens.', a2Dictionary),
      },
    ],
    questions: [
      {
        id: 'q1',
        question: 'Why did the narrator decide to do a digital detox?',
        options: ['To save money', 'Because of anxiety', 'To travel', 'To work more'],
        correctIndex: 1,
      },
      {
        id: 'q2',
        question: 'What did the narrator start doing instead of texting?',
        options: ['Writing letters', 'Calling people', 'Sending emails', 'Using social media'],
        correctIndex: 1,
      },
      {
        id: 'q3',
        question: 'How did the narrator feel about the notifications after the detox?',
        options: ['Very anxious', 'They seemed unimportant', 'Very excited', 'Very angry'],
        correctIndex: 1,
      },
    ],
    progress: 0,
    createdAt: Date.now(),
    isCustom: false,
  },
];

/** Gera ID único para livro customizado */
const generateBookId = () => `ai-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

/** Imagens de capa por tema (Unsplash, compatíveis com a história) */
const THEME_COVER_URLS: Record<BookTag, string> = {
  'daily-life':
    'https://images.unsplash.com/photo-1484480974693-6d0e1c4b5d8a?w=300&h=400&fit=crop',
  travel:
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&h=400&fit=crop',
  romance:
    'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=300&h=400&fit=crop',
  work: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=300&h=400&fit=crop',
  adventure:
    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=300&h=400&fit=crop',
  mystery:
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop',
  fantasy:
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&h=400&fit=crop',
  science:
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=300&h=400&fit=crop',
  'rpg-fantasy':
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&h=400&fit=crop',
  horror:
    'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=300&h=400&fit=crop',
};

export function getCoverUrlForTheme(theme: BookTag): string {
  return THEME_COVER_URLS[theme] ?? THEME_COVER_URLS['daily-life'];
}

/**
 * Extrai título e corpo do texto retornado pela IA (primeira linha = título, resto = história).
 */
export function parseAIStoryResponse(rawText: string): { title: string; storyText: string } {
  const t = rawText.trim();
  const firstLineEnd = t.indexOf('\n');
  if (firstLineEnd <= 0) {
    return { title: t ? t.slice(0, 80) : 'Story by AI', storyText: t };
  }
  let title = t.slice(0, firstLineEnd).trim();
  let storyText = t.slice(firstLineEnd).trim();
  if (title.toLowerCase().startsWith('title:')) {
    title = title.slice(6).trim();
  }
  if (!title) {
    title = 'Story by AI';
  }
  if (!storyText) {
    storyText = t;
  }
  return { title, storyText };
}

/**
 * Converte texto bruto (história gerada por IA) em GradedBook.
 * Parágrafos = split por \n\n. Palavras desconhecidas ficam clicáveis com "—".
 */
export function parseRawStoryToBook(
  rawText: string,
  options: { title: string; level: GradedBook['level']; theme: BookTag; coverUrl?: string }
): GradedBook {
  const { title, level, theme, coverUrl } = options;
  const paragraphsRaw = rawText
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  const paragraphs: ReaderParagraph[] = paragraphsRaw.map((text, index) => ({
    id: `p-${index + 1}`,
    words: tokenizeByChunks(text, a2Dictionary, { unknownAsClickable: true }),
  }));

  const totalWords = paragraphs.reduce(
    (acc, p) => acc + p.words.reduce((sum, w) => sum + w.word.split(/\s+/).length, 0),
    0
  );
  const estimatedMinutes = Math.max(1, Math.ceil(totalWords / 120));
  const themeLabel = BOOK_TAGS.find((t) => t.tag === theme)?.label ?? theme;

  return {
    id: generateBookId(),
    title: title || 'Story by AI',
    author: 'IA (Groq)',
    level,
    tags: [theme],
    coverUrl: coverUrl ?? getCoverUrlForTheme(theme),
    totalWords,
    estimatedMinutes,
    description: `História gerada por IA. Tema: ${themeLabel}.`,
    paragraphs,
    progress: 0,
    createdAt: Date.now(),
    isCustom: true,
  };
}

/**
 * Retorna livros por nível
 */
export function getBooksByLevel(books: GradedBook[], level: GradedBook['level']): GradedBook[] {
  return books.filter(book => book.level === level);
}

/**
 * Retorna livros por tag
 */
export function getBooksByTag(books: GradedBook[], tag: string): GradedBook[] {
  return books.filter(book => book.tags.includes(tag as any));
}
