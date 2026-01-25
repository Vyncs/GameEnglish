import type { Song } from '../types';

/**
 * Músicas para o Karaoke Mode
 * 
 * IMPORTANTE: O sistema foi projetado para o usuário adicionar suas próprias músicas.
 * As músicas abaixo são apenas exemplos educacionais com frases genéricas.
 * 
 * Para usar músicas reais:
 * 1. Adicione músicas via interface de importação
 * 2. Use suas próprias gravações ou covers
 * 3. Use músicas royalty-free
 * 4. Forneça o arquivo de áudio
 */
export const defaultKaraokeSongs: Song[] = [
  // ==========================================
  // 🟢 EASY - Frases educacionais simples
  // ==========================================
  {
    id: 'english-basics-1',
    title: 'English Basics',
    artist: 'Educational',
    difficulty: 'easy',
    coverUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200&h=200&fit=crop',
    audioUrl: '', // Usuário deve fornecer
    lyrics: [
      { id: 'eb1-1', startTime: 0, endTime: 4, textEN: 'Hello, how are you today?', textPT: 'Olá, como você está hoje?' },
      { id: 'eb1-2', startTime: 4, endTime: 8, textEN: 'I am fine, thank you very much', textPT: 'Estou bem, muito obrigado' },
      { id: 'eb1-3', startTime: 8, endTime: 12, textEN: 'What is your name?', textPT: 'Qual é o seu nome?' },
      { id: 'eb1-4', startTime: 12, endTime: 16, textEN: 'My name is John', textPT: 'Meu nome é John' },
      { id: 'eb1-5', startTime: 16, endTime: 20, textEN: 'Nice to meet you', textPT: 'Prazer em conhecê-lo' },
      { id: 'eb1-6', startTime: 20, endTime: 24, textEN: 'See you later, goodbye', textPT: 'Até mais, tchau' },
    ],
  },
  {
    id: 'daily-routines',
    title: 'Daily Routines',
    artist: 'Educational',
    difficulty: 'easy',
    coverUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop',
    audioUrl: '',
    lyrics: [
      { id: 'dr-1', startTime: 0, endTime: 4, textEN: 'I wake up early in the morning', textPT: 'Eu acordo cedo de manhã' },
      { id: 'dr-2', startTime: 4, endTime: 8, textEN: 'I take a shower and brush my teeth', textPT: 'Eu tomo banho e escovo meus dentes' },
      { id: 'dr-3', startTime: 8, endTime: 12, textEN: 'I have breakfast with my family', textPT: 'Eu tomo café da manhã com minha família' },
      { id: 'dr-4', startTime: 12, endTime: 16, textEN: 'Then I go to work by bus', textPT: 'Então eu vou para o trabalho de ônibus' },
      { id: 'dr-5', startTime: 16, endTime: 20, textEN: 'I come back home in the evening', textPT: 'Eu volto para casa à noite' },
      { id: 'dr-6', startTime: 20, endTime: 24, textEN: 'I go to sleep at ten o\'clock', textPT: 'Eu vou dormir às dez horas' },
    ],
  },
  {
    id: 'weather-talk',
    title: 'Weather Talk',
    artist: 'Educational',
    difficulty: 'easy',
    coverUrl: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=200&h=200&fit=crop',
    audioUrl: '',
    lyrics: [
      { id: 'wt-1', startTime: 0, endTime: 4, textEN: 'What is the weather like today?', textPT: 'Como está o tempo hoje?' },
      { id: 'wt-2', startTime: 4, endTime: 8, textEN: 'It is sunny and warm outside', textPT: 'Está ensolarado e quente lá fora' },
      { id: 'wt-3', startTime: 8, endTime: 12, textEN: 'I think it will rain tomorrow', textPT: 'Eu acho que vai chover amanhã' },
      { id: 'wt-4', startTime: 12, endTime: 16, textEN: 'Don\'t forget your umbrella', textPT: 'Não esqueça seu guarda-chuva' },
      { id: 'wt-5', startTime: 16, endTime: 20, textEN: 'The sky is very cloudy now', textPT: 'O céu está muito nublado agora' },
      { id: 'wt-6', startTime: 20, endTime: 24, textEN: 'Winter is my favorite season', textPT: 'Inverno é minha estação favorita' },
    ],
  },

  // ==========================================
  // 🟡 MEDIUM - Frases mais complexas
  // ==========================================
  {
    id: 'at-restaurant',
    title: 'At The Restaurant',
    artist: 'Educational',
    difficulty: 'medium',
    coverUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&h=200&fit=crop',
    audioUrl: '',
    lyrics: [
      { id: 'ar-1', startTime: 0, endTime: 5, textEN: 'Good evening, I have a reservation for two', textPT: 'Boa noite, tenho uma reserva para dois' },
      { id: 'ar-2', startTime: 5, endTime: 10, textEN: 'Could I see the menu please?', textPT: 'Poderia ver o cardápio, por favor?' },
      { id: 'ar-3', startTime: 10, endTime: 15, textEN: 'I would like to order the chicken', textPT: 'Eu gostaria de pedir o frango' },
      { id: 'ar-4', startTime: 15, endTime: 20, textEN: 'Can I have a glass of water?', textPT: 'Posso ter um copo de água?' },
      { id: 'ar-5', startTime: 20, endTime: 25, textEN: 'The food was absolutely delicious', textPT: 'A comida estava absolutamente deliciosa' },
      { id: 'ar-6', startTime: 25, endTime: 30, textEN: 'May I have the check please?', textPT: 'Posso ter a conta, por favor?' },
    ],
  },
  {
    id: 'travel-phrases',
    title: 'Travel Phrases',
    artist: 'Educational',
    difficulty: 'medium',
    coverUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=200&h=200&fit=crop',
    audioUrl: '',
    lyrics: [
      { id: 'tp-1', startTime: 0, endTime: 5, textEN: 'Where is the nearest train station?', textPT: 'Onde fica a estação de trem mais próxima?' },
      { id: 'tp-2', startTime: 5, endTime: 10, textEN: 'I need to buy a ticket to London', textPT: 'Preciso comprar uma passagem para Londres' },
      { id: 'tp-3', startTime: 10, endTime: 15, textEN: 'What time does the flight depart?', textPT: 'A que horas o voo parte?' },
      { id: 'tp-4', startTime: 15, endTime: 20, textEN: 'Could you help me find my hotel?', textPT: 'Você poderia me ajudar a encontrar meu hotel?' },
      { id: 'tp-5', startTime: 20, endTime: 25, textEN: 'I am looking for a taxi to the airport', textPT: 'Estou procurando um táxi para o aeroporto' },
      { id: 'tp-6', startTime: 25, endTime: 30, textEN: 'How long does it take to get there?', textPT: 'Quanto tempo leva para chegar lá?' },
    ],
  },
  {
    id: 'job-interview',
    title: 'Job Interview',
    artist: 'Educational',
    difficulty: 'medium',
    coverUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=200&h=200&fit=crop',
    audioUrl: '',
    lyrics: [
      { id: 'ji-1', startTime: 0, endTime: 5, textEN: 'Tell me a little bit about yourself', textPT: 'Me fale um pouco sobre você' },
      { id: 'ji-2', startTime: 5, endTime: 10, textEN: 'I have five years of experience', textPT: 'Eu tenho cinco anos de experiência' },
      { id: 'ji-3', startTime: 10, endTime: 15, textEN: 'What are your greatest strengths?', textPT: 'Quais são seus maiores pontos fortes?' },
      { id: 'ji-4', startTime: 15, endTime: 20, textEN: 'I am a very organized person', textPT: 'Eu sou uma pessoa muito organizada' },
      { id: 'ji-5', startTime: 20, endTime: 25, textEN: 'Why do you want to work here?', textPT: 'Por que você quer trabalhar aqui?' },
      { id: 'ji-6', startTime: 25, endTime: 30, textEN: 'When can you start working?', textPT: 'Quando você pode começar a trabalhar?' },
    ],
  },

  // ==========================================
  // 🔴 HARD - Frases complexas e rápidas
  // ==========================================
  {
    id: 'business-meeting',
    title: 'Business Meeting',
    artist: 'Educational',
    difficulty: 'hard',
    coverUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=200&fit=crop',
    audioUrl: '',
    lyrics: [
      { id: 'bm-1', startTime: 0, endTime: 4, textEN: 'Let\'s get started with today\'s agenda', textPT: 'Vamos começar com a agenda de hoje' },
      { id: 'bm-2', startTime: 4, endTime: 8, textEN: 'I\'d like to propose a new marketing strategy', textPT: 'Gostaria de propor uma nova estratégia de marketing' },
      { id: 'bm-3', startTime: 8, endTime: 12, textEN: 'Could you elaborate on that point?', textPT: 'Você poderia elaborar sobre esse ponto?' },
      { id: 'bm-4', startTime: 12, endTime: 16, textEN: 'We need to increase our productivity significantly', textPT: 'Precisamos aumentar nossa produtividade significativamente' },
      { id: 'bm-5', startTime: 16, endTime: 20, textEN: 'The quarterly results exceeded our expectations', textPT: 'Os resultados trimestrais superaram nossas expectativas' },
      { id: 'bm-6', startTime: 20, endTime: 24, textEN: 'Let\'s schedule a follow-up meeting next week', textPT: 'Vamos agendar uma reunião de acompanhamento na próxima semana' },
    ],
  },
  {
    id: 'academic-discussion',
    title: 'Academic Discussion',
    artist: 'Educational',
    difficulty: 'hard',
    coverUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200&h=200&fit=crop',
    audioUrl: '',
    lyrics: [
      { id: 'ad-1', startTime: 0, endTime: 4, textEN: 'The research methodology was quite comprehensive', textPT: 'A metodologia de pesquisa foi bastante abrangente' },
      { id: 'ad-2', startTime: 4, endTime: 8, textEN: 'However, there are some limitations to consider', textPT: 'No entanto, há algumas limitações a considerar' },
      { id: 'ad-3', startTime: 8, endTime: 12, textEN: 'The statistical analysis supports our hypothesis', textPT: 'A análise estatística apoia nossa hipótese' },
      { id: 'ad-4', startTime: 12, endTime: 16, textEN: 'We should examine the underlying assumptions', textPT: 'Devemos examinar as suposições subjacentes' },
      { id: 'ad-5', startTime: 16, endTime: 20, textEN: 'Further investigation is required to draw conclusions', textPT: 'Mais investigação é necessária para tirar conclusões' },
      { id: 'ad-6', startTime: 20, endTime: 24, textEN: 'The implications of this study are significant', textPT: 'As implicações deste estudo são significativas' },
    ],
  },
];

/**
 * Filtra músicas por dificuldade
 */
export function getSongsByDifficulty(songs: Song[], difficulty: Song['difficulty']): Song[] {
  return songs.filter(song => song.difficulty === difficulty);
}
