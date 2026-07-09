import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import type {
  CoachConversation,
  CoachLevel,
  CoachMessage,
  CoachMode,
  CoachStreamCallbacks,
} from '../types/englishCoach';
import { api } from '../api/client';

const localId = () => `local-${Math.random().toString(36).slice(2, 10)}`;

/** Cota diária do plano free retornada pelo backend a cada mensagem. */
export interface CoachUsageInfo {
  plan: 'premium' | 'free';
  /** Limite diário; null para premium. */
  limit: number | null;
  /** Restante após a última mensagem; null para premium. */
  remaining: number | null;
  /** Timestamp epoch ms — última atualização. */
  updatedAt: number;
}

/**
 * Runner de stream injetado pelo componente React (vem do hook useCoachStream).
 * O store fica agnóstico de hooks — apenas chama esta função e provê callbacks
 * que mutam o estado interno conforme os eventos SSE chegam.
 */
export type CoachStreamRunner = (
  payload: { message: string; level: CoachLevel; mode: CoachMode; conversationId?: string },
  callbacks: CoachStreamCallbacks
) => Promise<void>;

interface CoachState {
  // Configuração escolhida pelo aluno
  level: CoachLevel;
  mode: CoachMode;

  // Estado da conversa atual
  conversationId: string | null;
  messages: CoachMessage[];

  // UI
  isSending: boolean;

  // Cota diária (free tier). Premium fica null.
  lastUsage: CoachUsageInfo | null;

  // Ações
  setLevel: (level: CoachLevel) => void;
  setMode: (mode: CoachMode) => void;
  sendMessage: (text: string) => Promise<void>;
  /**
   * Envia mensagem em modo streaming. Recebe um `runStream` injetado por
   * componente React (que tem acesso ao hook useCoachStream) e callbacks
   * extras de avatar — store não importa hooks, mantém-se framework-agnóstico.
   */
  sendMessageStreaming: (
    text: string,
    runStream: CoachStreamRunner,
    avatarCallbacks?: AvatarTransitionCallbacks
  ) => Promise<void>;
  clearConversation: () => Promise<void>;
  /** Carrega uma conversa existente do backend (usado quando faz login). */
  loadConversation: (conversationId: string) => Promise<void>;
}

/**
 * Callbacks de transição de avatar publicadas pelo store nos momentos
 * relevantes do fluxo. Componente React passa setters do AvatarStateProvider.
 */
export interface AvatarTransitionCallbacks {
  onThinking?: () => void;
  onFirstToken?: () => void;
  onCorrecting?: (severity: 'minor' | 'major') => void;
  onCelebrating?: (reason: 'streak' | 'milestone' | 'perfect') => void;
  onIdle?: () => void;
}

export const useEnglishCoachStore = create<CoachState>()(
  persist(
    (set, get) => ({
      level: 'beginner',
      mode: 'free',
      conversationId: null,
      messages: [],
      isSending: false,
      lastUsage: null,

      setLevel: (level) => set({ level }),
      setMode: (mode) => set({ mode }),

      sendMessage: async (text) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        if (get().isSending) return;

        const { level, mode, conversationId } = get();

        const optimisticUser: CoachMessage = {
          id: localId(),
          role: 'user',
          content: trimmed,
          createdAt: Date.now(),
          pending: false,
        };
        const typingPlaceholder: CoachMessage = {
          id: localId(),
          role: 'assistant',
          content: '',
          createdAt: Date.now() + 1,
          pending: true,
        };

        set((s) => ({
          messages: [...s.messages, optimisticUser, typingPlaceholder],
          isSending: true,
        }));

        // Sem login: chama endpoint mesmo assim — exige token, e o front
        // tem token quando o usuário entrou via login. Se 401 voltar, mostramos toast.
        try {
          const res = await api.postCoachMessage({
            message: trimmed,
            level,
            mode,
            conversationId: conversationId || undefined,
          });

          // Captura cota retornada pelo backend (apenas free; premium retorna null/undefined).
          const nextUsage: CoachUsageInfo | null =
            res.plan
              ? {
                  plan: res.plan,
                  limit: res.usageLimit ?? null,
                  remaining: res.usageRemaining ?? null,
                  updatedAt: Date.now(),
                }
              : null;

          set((s) => ({
            conversationId: res.conversationId,
            messages: s.messages
              .filter((m) => m.id !== typingPlaceholder.id && m.id !== optimisticUser.id)
              .concat([
                {
                  ...res.userMessage,
                  pending: false,
                },
                {
                  ...res.assistantMessage,
                  pending: false,
                },
              ]),
            isSending: false,
            lastUsage: nextUsage ?? s.lastUsage,
          }));
        } catch (err) {
          set((s) => ({
            messages: s.messages.filter(
              (m) => m.id !== typingPlaceholder.id && m.id !== optimisticUser.id
            ),
            isSending: false,
          }));
          const msg = err instanceof Error ? err.message : 'Erro ao enviar mensagem';
          toast.error(msg);
        }
      },

      sendMessageStreaming: async (text, runStream, avatarCallbacks) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        if (get().isSending) return;

        const { level, mode, conversationId } = get();

        const optimisticUser: CoachMessage = {
          id: localId(),
          role: 'user',
          content: trimmed,
          createdAt: Date.now(),
          pending: false,
        };
        // Placeholder começa com pending=true (mostra TypingIndicator). Quando
        // o primeiro token chega, vira streaming=true e o conteúdo cresce.
        const assistantPlaceholder: CoachMessage = {
          id: localId(),
          role: 'assistant',
          content: '',
          createdAt: Date.now() + 1,
          pending: true,
          streaming: false,
        };

        set((s) => ({
          messages: [...s.messages, optimisticUser, assistantPlaceholder],
          isSending: true,
        }));

        // Avatar entra em "thinking" imediatamente — antes da primeira resposta
        // do servidor — pra dar a sensação de presença instantânea.
        avatarCallbacks?.onThinking?.();

        let firstTokenSeen = false;
        let realAssistantId: string | null = null;
        let lastReply = '';
        let lastMeta: {
          correction: string | null;
          explanation: string | null;
          naturalExample: string | null;
          nextQuestion: string;
        } | null = null;

        try {
          await runStream(
            { message: trimmed, level, mode, conversationId: conversationId || undefined },
            {
              onStart: (e) => {
                // Substitui IDs locais pelos reais e atualiza usage.
                set((s) => ({
                  conversationId: e.conversationId,
                  messages: s.messages.map((m) => {
                    if (m.id === optimisticUser.id) return { ...m, id: e.userMessageId };
                    if (m.id === assistantPlaceholder.id) return { ...m, id: e.assistantMessageId };
                    return m;
                  }),
                  lastUsage: e.plan
                    ? {
                        plan: e.plan,
                        limit: e.usageLimit ?? null,
                        remaining: e.usageRemaining ?? null,
                        updatedAt: Date.now(),
                      }
                    : s.lastUsage,
                }));
                realAssistantId = e.assistantMessageId;
              },
              onToken: (_delta, accumulated) => {
                if (!firstTokenSeen) {
                  firstTokenSeen = true;
                  avatarCallbacks?.onFirstToken?.();
                }
                lastReply = accumulated;
                set((s) => ({
                  messages: s.messages.map((m) =>
                    m.id === (realAssistantId ?? assistantPlaceholder.id)
                      ? { ...m, content: accumulated, pending: false, streaming: true }
                      : m
                  ),
                }));
              },
              onMeta: (meta) => {
                lastMeta = {
                  correction: meta.correction,
                  explanation: meta.explanation,
                  naturalExample: meta.naturalExample,
                  nextQuestion: meta.nextQuestion,
                };
                set((s) => ({
                  messages: s.messages.map((m) =>
                    m.id === (realAssistantId ?? assistantPlaceholder.id)
                      ? {
                          ...m,
                          correction: meta.correction,
                          explanation: meta.explanation,
                          naturalExample: meta.naturalExample,
                          nextQuestion: meta.nextQuestion,
                        }
                      : m
                  ),
                }));
              },
              onDone: (reply) => {
                // Garante que o conteúdo final bate com o reply consolidado
                // pelo backend (cobre divergência rara entre tokens e JSON final).
                lastReply = reply || lastReply;
                set((s) => ({
                  messages: s.messages.map((m) =>
                    m.id === (realAssistantId ?? assistantPlaceholder.id)
                      ? { ...m, content: lastReply, streaming: false, pending: false }
                      : m
                  ),
                  isSending: false,
                }));

                // Decide próximo estado do avatar com base na presença de correção.
                if (lastMeta?.correction) {
                  // Heurística simples: explicação longa ⇒ erro mais relevante.
                  const severity =
                    (lastMeta.explanation && lastMeta.explanation.length > 80) ||
                    /better|wrong|incorret|errad/i.test(lastMeta.correction)
                      ? 'major'
                      : 'minor';
                  avatarCallbacks?.onCorrecting?.(severity);
                } else {
                  avatarCallbacks?.onIdle?.();
                }
              },
              onError: (message) => {
                // Remove placeholder do assistant e desfaz isSending.
                set((s) => ({
                  messages: s.messages.filter(
                    (m) => m.id !== (realAssistantId ?? assistantPlaceholder.id)
                  ),
                  isSending: false,
                }));
                avatarCallbacks?.onIdle?.();
                toast.error(message || 'Erro ao gerar resposta');
              },
            }
          );
        } catch (err) {
          // Erro fora dos callbacks (network etc) — limpa placeholder
          set((s) => ({
            messages: s.messages.filter(
              (m) => m.id !== (realAssistantId ?? assistantPlaceholder.id)
            ),
            isSending: false,
          }));
          avatarCallbacks?.onIdle?.();
          const msg = err instanceof Error ? err.message : 'Erro de conexão';
          toast.error(msg);
        }
      },

      clearConversation: async () => {
        const id = get().conversationId;
        if (id && !id.startsWith('local-')) {
          try {
            await api.deleteCoachConversation(id);
          } catch {
            // silencioso — limpeza local sempre acontece
          }
        }
        set({ conversationId: null, messages: [] });
      },

      loadConversation: async (conversationId) => {
        try {
          const conv: CoachConversation = await api.getCoachConversation(conversationId);
          set({
            conversationId: conv.id,
            messages: conv.messages,
            level: conv.level,
            mode: conv.mode,
          });
        } catch (e) {
          const msg = e instanceof Error ? e.message : 'Erro ao carregar conversa';
          toast.error(msg);
        }
      },
    }),
    {
      name: 'english-coach-storage',
      // Não persistir flags de UI nem conversationId remoto se quisermos sempre
      // tentar continuar — guardamos tudo: nível, modo, conversa atual e mensagens.
      partialize: (state) => ({
        level: state.level,
        mode: state.mode,
        conversationId: state.conversationId,
        messages: state.messages,
      }),
    }
  )
);
