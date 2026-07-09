// Tipos do módulo English Coach Avatar

export type CoachLevel = 'beginner' | 'intermediate' | 'advanced';

export type CoachMode =
  | 'free'
  | 'travel'
  | 'work'
  | 'interview'
  | 'restaurant'
  | 'airport'
  | 'pronunciation';

export interface CoachLevelOption {
  id: CoachLevel;
  label: string;
  description: string;
  emoji: string;
}

export interface CoachModeOption {
  id: CoachMode;
  label: string;
  description: string;
  emoji: string;
}

export const COACH_LEVELS: CoachLevelOption[] = [
  {
    id: 'beginner',
    label: 'Iniciante',
    description: 'Frases curtas, vocabulário básico (A1/A2)',
    emoji: '🌱',
  },
  {
    id: 'intermediate',
    label: 'Intermediário',
    description: 'Conversa natural, tempos variados (B1/B2)',
    emoji: '🌿',
  },
  {
    id: 'advanced',
    label: 'Avançado',
    description: 'Idioms, nuance e fluência (C1+)',
    emoji: '🌳',
  },
];

export const COACH_MODES: CoachModeOption[] = [
  { id: 'free', label: 'Conversação livre', description: 'Sem tema definido', emoji: '💬' },
  { id: 'travel', label: 'Viagem', description: 'Hotel, transporte, turismo', emoji: '✈️' },
  { id: 'work', label: 'Trabalho', description: 'E-mails, reuniões, escritório', emoji: '💼' },
  { id: 'interview', label: 'Entrevista', description: 'Entrevista de emprego', emoji: '🎯' },
  { id: 'restaurant', label: 'Restaurante', description: 'Pedidos, dietas, conta', emoji: '🍽️' },
  { id: 'airport', label: 'Aeroporto', description: 'Check-in, imigração, conexão', emoji: '🛫' },
  { id: 'pronunciation', label: 'Pronúncia', description: 'TH, R, vogais, ritmo', emoji: '🎤' },
];

export interface CoachMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  correction?: string | null;
  explanation?: string | null;
  naturalExample?: string | null;
  nextQuestion?: string | null;
  createdAt: number;
  /** Mensagem temporária renderizada antes da resposta do servidor (otimismo). */
  pending?: boolean;
  /**
   * `true` enquanto o conteúdo está sendo recebido via SSE — usado pra mostrar
   * cursor piscando e impedir a UI de alternar pra TypingIndicator depois do
   * primeiro token.
   */
  streaming?: boolean;
}

export interface CoachConversationSummary {
  id: string;
  title: string | null;
  level: CoachLevel;
  mode: CoachMode;
  scoreGrammar: number;
  scoreVocabulary: number;
  scoreFluency: number;
  scorePronunciation: number;
  createdAt: number;
  updatedAt: number;
}

export interface CoachConversation extends CoachConversationSummary {
  messages: CoachMessage[];
}

export interface CoachChatRequest {
  message: string;
  level: CoachLevel;
  mode: CoachMode;
  conversationId?: string;
}

export interface CoachChatResponse {
  conversationId: string;
  userMessage: CoachMessage;
  assistantMessage: CoachMessage;
  reply: string;
  correction: string | null;
  explanation: string | null;
  naturalExample: string | null;
  nextQuestion: string;
  /** "premium" para users active/vip; "free" para os demais. */
  plan?: 'premium' | 'free';
  /** Limite diário (apenas free). null para premium. */
  usageLimit?: number | null;
  /** Mensagens restantes hoje (apenas free). null para premium. */
  usageRemaining?: number | null;
}

/** Sugestões para o estado vazio da tela. */
export interface CoachStarterPrompt {
  label: string;
  emoji: string;
  message: string;
  mode?: CoachMode;
}

export const COACH_STARTERS: CoachStarterPrompt[] = [
  {
    label: 'Começar conversa',
    emoji: '👋',
    message: "Hi! I'd like to practice English with you today.",
  },
  {
    label: 'Vou viajar',
    emoji: '✈️',
    message: "I'm planning a trip and need to practice some travel English.",
    mode: 'travel',
  },
  {
    label: 'Entrevista',
    emoji: '🎯',
    message: 'Can we simulate a job interview, please?',
    mode: 'interview',
  },
  {
    label: 'Pronúncia',
    emoji: '🎤',
    message: 'I want to improve my pronunciation. Where should we start?',
    mode: 'pronunciation',
  },
];

// ==========================================
// AVATAR STATE — fonte única de verdade do tutor
// ==========================================

/**
 * Discriminated union: cada estado carrega só os dados que precisa.
 * Esse tipo é o coração do produto — todo componente que afeta o avatar
 * publica uma transição via AvatarStateProvider; o avatar lê e renderiza.
 */
export type AvatarState =
  | { kind: 'idle' }
  | { kind: 'listening'; mode: 'voice' | 'text'; since: number }
  | { kind: 'thinking'; since: number }
  | {
      kind: 'speaking';
      /** Tempo (epoch ms) em que o áudio começou a tocar — facilita driver de lip sync. */
      startedAt: number;
      /** Visemas pré-calculados (opcional; pode chegar depois do áudio começar). */
      visemes?: Viseme[];
      /** Referência ao <audio> tocando, usada por LipSyncDriver pra sincronizar. */
      audioElement?: HTMLAudioElement | null;
    }
  | { kind: 'correcting'; severity: 'minor' | 'major'; since: number }
  | { kind: 'celebrating'; reason: 'streak' | 'milestone' | 'perfect'; since: number };

export type AvatarStateKind = AvatarState['kind'];

// ==========================================
// VISEMAS (lip sync)
// ==========================================

/**
 * Conjunto reduzido de formas de boca. Mapeado a partir dos timestamps de
 * caractere do ElevenLabs (ou do alinhamento do TTS atual) por um phonema/grafema
 * → viseme mapper. 8 formas + silêncio cobrem ~95% da percepção de lip sync.
 */
export type VisemeShape =
  | 'AA'      // pa, ah, hot
  | 'EH'      // bed, head
  | 'IY'      // see, beat
  | 'OH'      // go, boat
  | 'OW'      // who, food
  | 'L'       // L, N, T, D
  | 'M'       // M, B, P (bilabial)
  | 'F'       // F, V (labiodental)
  | 'silent'; // pausa, fim

export interface Viseme {
  /** Tempo em segundos relativo ao início do áudio. */
  time: number;
  shape: VisemeShape;
  /** 0–1 — intensidade da abertura/expressão. */
  weight: number;
}

// ==========================================
// VOZ (TTS / STT)
// ==========================================

export interface VoiceStatus {
  /** Servidor tem chave ElevenLabs configurada. */
  tts: boolean;
  /** Servidor tem chave OpenAI Whisper configurada. */
  stt: boolean;
  /**
   * Servidor expõe TTS com timestamps de caractere
   * (POST /voice/tts-with-timestamps). Quando true, o front pode evoluir
   * para lip sync viseme-based. Quando false, fica no fallback amplitude.
   */
  ttsWithTimestamps: boolean;
}

/**
 * Resposta do endpoint /voice/tts-with-timestamps.
 * `audioBase64` é mp3 codificado pra trafegar dentro de JSON (uma única chamada).
 */
export interface CoachTtsWithTimestampsResponse {
  audioBase64: string;
  alignment: TtsAlignment;
  /**
   * Visemas pré-calculados pelo backend. Pode ser null no MVP (Semana 1)
   * quando o visemeMapper ainda não foi implementado.
   */
  visemes: Viseme[] | null;
}

/** Alinhamento bruto retornado pelo ElevenLabs (with-timestamps). */
export interface TtsAlignment {
  characters: string[];
  characterStartTimesSeconds: number[];
  characterEndTimesSeconds: number[];
}

// ==========================================
// STREAMING DE CHAT — Server-Sent Events
// ==========================================

/**
 * Eventos emitidos pelo endpoint POST /api/english-coach/chat/stream (SSE).
 * Discriminados por `type`. O frontend decodifica por linha "event: <type>"
 * com payload em "data: <json>".
 */
export type CoachStreamEvent =
  | {
      type: 'start';
      conversationId: string;
      userMessageId: string;
      assistantMessageId: string;
      /** Plano do usuário no momento da chamada (apenas backend que envia). */
      plan?: 'premium' | 'free';
      /** Limite diário (apenas free). null/undefined para premium. */
      usageLimit?: number | null;
      /** Mensagens restantes hoje (apenas free). null/undefined para premium. */
      usageRemaining?: number | null;
    }
  | { type: 'token'; delta: string }
  | {
      type: 'meta';
      correction: string | null;
      explanation: string | null;
      naturalExample: string | null;
      nextQuestion: string;
    }
  | { type: 'done'; reply: string }
  | { type: 'error'; message: string };

/** Callbacks que o caller passa pra orquestrar avatar/UI durante o stream. */
export interface CoachStreamCallbacks {
  onStart?: (e: Extract<CoachStreamEvent, { type: 'start' }>) => void;
  onToken?: (delta: string, accumulated: string) => void;
  onMeta?: (e: Extract<CoachStreamEvent, { type: 'meta' }>) => void;
  onDone?: (reply: string) => void;
  onError?: (message: string) => void;
}

// ==========================================
// MEMÓRIA PEDAGÓGICA
// ==========================================

export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type CoachLearningStyle =
  | 'conversational'
  | 'structured'
  | 'immersive'
  | 'exam-focused'
  | 'casual';

/**
 * Perfil pedagógico agregado do aluno. NÃO contém conversa bruta —
 * apenas insights derivados pelo memoryAnalyzer no backend.
 *
 * Frontend recebe os arrays já parseados (no banco vivem como JSON-string).
 */
export interface CoachMemory {
  id: string;
  weakPoints: string[];
  strongPoints: string[];
  vocabularySeen: string[];
  pronunciationIssues: string[];
  topicsOfInterest: string[];
  studyGoals: string[];
  preferredLearningStyle: CoachLearningStyle | string | null;
  cefrEstimate: CefrLevel;
  /** 0-100. Auto-avaliado/inferido pelo analyzer. */
  confidenceLevel: number;
  /** 0-100. Tendência crescente — só cai em regressão clara. */
  progressionScore: number;
  /** 2-3 frases — onde a conversa parou. */
  conversationHistorySummary: string | null;
  /** 1-2 frases — insight acionável para próxima sessão. */
  lastSessionInsights: string | null;
  /** Total de mensagens do user no momento da última análise. */
  lastAnalyzedMessageCount: number;
  updatedAt: number | null;
  createdAt: number | null;
}

/** Resposta de POST /memory/analyze — inclui flags da execução. */
export interface CoachMemoryAnalyzeResponse extends CoachMemory {
  /** True quando a análise rodou e a memória foi atualizada. */
  analyzed: boolean;
  /** Razão de não ter rodado (`threshold_not_met`, `no_api_key`, etc). */
  reason: string | null;
}

// ==========================================
// CONVERSAÇÃO POR VOZ (loop contínuo)
// ==========================================

/**
 * Estados do loop de voice conversation:
 *
 *   idle        → não iniciado / parado pelo usuário
 *   starting    → solicitando permissão do mic
 *   listening   → STT ativo, capturando fala
 *   processing  → transcrição enviada, esperando IA
 *   speaking    → TTS tocando a resposta do tutor
 *   error       → falha de mic/STT/TTS — UI mostra mensagem
 *
 * O loop natural é: idle → starting → listening → processing → speaking → listening → ...
 */
export type VoiceConversationStatus =
  | 'idle'
  | 'starting'
  | 'listening'
  | 'processing'
  | 'speaking'
  | 'error';

export interface VoiceConversationState {
  status: VoiceConversationStatus;
  /** Texto sendo capturado em tempo real pelo STT. */
  interimTranscript: string;
  /** Mensagem de erro humana, quando status === 'error'. */
  errorMessage: string | null;
}
