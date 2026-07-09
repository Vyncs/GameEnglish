import { useCallback, useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { useEnglishCoachStore } from '../../store/useEnglishCoachStore';
import { useCoachStream } from '../../hooks/useCoachStream';
import { useVoiceConversation } from '../../hooks/useVoiceConversation';
import { useCoachProgress } from '../../hooks/useCoachProgress';
import {
  COACH_MODES,
  COACH_LEVELS,
  type CoachMode,
} from '../../types/englishCoach';
import { LevelSelector } from './LevelSelector';
import { LearningModeSelector } from './LearningModeSelector';
import { JarvisAICore } from './jarvis/JarvisAICore';
import { JarvisProgressPanel } from './jarvis/JarvisProgressPanel';
import { JarvisChatPanel } from './jarvis/JarvisChatPanel';
import {
  AvatarStateProvider,
  useAvatarState,
} from './avatar/AvatarStateProvider';

/**
 * EnglishCoachPage — wrapper de topo.
 * Instala AvatarStateProvider e ativa o tema JARVIS (dark) no escopo.
 */
export function EnglishCoachPage() {
  return (
    <AvatarStateProvider>
      <div className="jarvis-scope relative min-h-[calc(100vh-72px)] -mt-3 sm:-mt-5">
        <EnglishCoachInner />
      </div>
    </AvatarStateProvider>
  );
}

function EnglishCoachInner() {
  // ===== Store / hooks (toda a lógica preservada) =====
  const {
    level,
    mode,
    messages,
    isSending,
    conversationId,
    setLevel,
    setMode,
    sendMessageStreaming,
    clearConversation,
  } = useEnglishCoachStore();

  const { start: runStream } = useCoachStream();
  const avatar = useAvatarState();
  const progress = useCoachProgress();

  const currentMode = useMemo(() => COACH_MODES.find((m) => m.id === mode)!, [mode]);
  const currentLevel = useMemo(() => COACH_LEVELS.find((l) => l.id === level)!, [level]);

  /** Conecta o store ao runner de stream + transitions do avatar. */
  const handleSend = useCallback(
    (text: string) =>
      sendMessageStreaming(text, runStream, {
        onThinking: () => avatar.setThinking(),
        onFirstToken: () => avatar.setSpeaking({ startedAt: Date.now() }),
        onCorrecting: (severity) => avatar.setCorrecting(severity),
        onCelebrating: (reason) => avatar.setCelebrating(reason),
        onIdle: () => avatar.setIdle(),
      }),
    [sendMessageStreaming, runStream, avatar]
  );

  // Bridge useVoiceConversation → store stream
  const handleVoiceTranscript = useCallback(
    async (transcript: string): Promise<string> => {
      if (!transcript) return '';
      await sendMessageStreaming(transcript, runStream, {
        onThinking: () => avatar.setThinking(),
        onFirstToken: () => avatar.setSpeaking({ startedAt: Date.now() }),
        onCorrecting: (severity) => avatar.setCorrecting(severity),
        onIdle: () => avatar.setIdle(),
      });
      const last = useEnglishCoachStore.getState().messages.slice(-1)[0];
      return last?.role === 'assistant' ? last.content : '';
    },
    [sendMessageStreaming, runStream, avatar]
  );

  const voice = useVoiceConversation({
    level,
    mode,
    conversationId,
    onTranscript: handleVoiceTranscript,
  });

  const handlePickStarter = useCallback(
    (text: string, starterMode?: CoachMode) => {
      if (starterMode && starterMode !== mode) setMode(starterMode);
      handleSend(text);
    },
    [mode, setMode, handleSend]
  );

  const handleClear = useCallback(async () => {
    avatar.setIdle();
    if (voice.isActive) voice.stop();
    await clearConversation();
  }, [avatar, clearConversation, voice]);

  // ===== Render =====
  return (
    <div className="relative z-10 px-3 sm:px-4 lg:px-5 py-3">
      <div className="max-w-[1440px] mx-auto">
        {/* Top status bar — slim */}
        <header className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="grid place-items-center w-8 h-8 rounded-md shrink-0"
              style={{
                background: 'rgba(34, 211, 238, 0.08)',
                border: '1px solid rgba(34, 211, 238, 0.28)',
                boxShadow: 'inset 0 0 12px rgba(34, 211, 238, 0.10)',
              }}
            >
              <Sparkles className="w-4 h-4 text-cyan-400" strokeWidth={2.2} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-[12px] font-bold tracking-[0.28em] text-white">
                  E.&nbsp;C.&nbsp;A.
                </h1>
                <span
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-semibold tracking-wider uppercase"
                  style={{
                    background: 'rgba(16, 185, 129, 0.10)',
                    border: '1px solid rgba(16, 185, 129, 0.30)',
                    color: '#34d399',
                  }}
                >
                  <span className="block w-1 h-1 rounded-full bg-emerald-400 jv-dot-pulse" />
                  Online
                </span>
                <span className="hidden md:inline text-[10px] text-slate-500">
                  · HD Voice · Premium AI Tutor
                </span>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1.5">
            <ChipReadOnly label={`${currentLevel.emoji} ${currentLevel.label}`} />
            <ChipReadOnly label={`${currentMode.emoji} ${currentMode.label}`} />
          </div>
        </header>

        {/* Layout 3-col já em lg — denso, sem altura vazia */}
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_340px] gap-3">
          {/* COL 1 — progresso */}
          <aside className="space-y-2.5 order-2 lg:order-1">
            <JarvisProgressPanel data={progress.data} loading={progress.loading} />

            {/* Settings inline (compactos, num único card) */}
            <div className="jarvis-card jarvis-bracket px-3 py-2.5">
              <div className="space-y-2">
                <div>
                  <div className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500 mb-1">
                    Nível
                  </div>
                  <LevelSelector value={level} onChange={setLevel} compact />
                </div>
                <div>
                  <div className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500 mb-1">
                    Modo
                  </div>
                  <LearningModeSelector value={mode} onChange={setMode} compact />
                </div>
              </div>
            </div>
          </aside>

          {/* COL 2 — AI Core central */}
          <main className="order-1 lg:order-2 flex items-center justify-center py-3 lg:py-2">
            <JarvisAICore
              onPushToTalk={voice.start}
              onStop={voice.stop}
              isVoiceActive={voice.isActive}
              voiceSupported={voice.isSupported}
              voiceStatus={voice.status}
            />
          </main>

          {/* COL 3 — chat */}
          <aside className="order-3 h-[calc(100vh-160px)] min-h-[420px] max-h-[640px]">
            <JarvisChatPanel
              messages={messages}
              isSending={isSending}
              onSend={handleSend}
              onClear={handleClear}
              onPickStarter={handlePickStarter}
            />
          </aside>
        </div>
      </div>

      {/* Style overrides locais — força chips de selector compactos a ficarem dark */}
      <style>{`
        .jarvis-scope [aria-pressed="true"] {
          background: linear-gradient(135deg, #22d3ee 0%, #3b82f6 100%) !important;
          color: #0b1020 !important;
          border-color: transparent !important;
          box-shadow: 0 0 16px rgba(34, 211, 238, 0.40);
        }
        .jarvis-scope [aria-pressed="false"] {
          background: rgba(15, 21, 37, 0.6) !important;
          color: #cbd5e1 !important;
          border-color: rgba(34, 211, 238, 0.18) !important;
        }
        .jarvis-scope [aria-pressed="false"]:hover {
          background: rgba(34, 211, 238, 0.08) !important;
          border-color: rgba(34, 211, 238, 0.36) !important;
          color: #e5edff !important;
        }
      `}</style>
    </div>
  );
}

function ChipReadOnly({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-md"
      style={{
        background: 'rgba(15, 21, 37, 0.7)',
        border: '1px solid rgba(34, 211, 238, 0.18)',
        color: '#94a3b8',
      }}
    >
      {label}
    </span>
  );
}
