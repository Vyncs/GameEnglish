import { Volume2, Turtle, MessageCircle, Sparkles, StopCircle } from 'lucide-react';
import type { CoachMessage } from '../../types/englishCoach';
import { useCoachVoice } from '../../hooks/useCoachVoice';
import { TutorAvatar } from './TutorAvatar';
import { CorrectionCard } from './CorrectionCard';
import { TypingIndicator } from './TypingIndicator';

interface MessageBubbleProps {
  message: CoachMessage;
  /** Mensagem está aguardando resposta da IA — renderiza TypingIndicator no lugar do conteúdo. */
  loading?: boolean;
}

export function MessageBubble({ message, loading }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  // Mostrar TypingIndicator APENAS quando o assistant ainda não recebeu nem
  // o primeiro token. Quando começa a streamar, deixamos o conteúdo crescer
  // dentro da bolha com cursor piscante.
  const isAssistantThinking =
    !isUser && (loading || message.pending) && !message.streaming && !message.content;

  if (isAssistantThinking) {
    return (
      <div className="flex items-end gap-2 animate-fade-in">
        <TutorAvatar size={36} reactive={false} />
        <TypingIndicator />
      </div>
    );
  }

  if (isUser) {
    return (
      <div className="flex justify-end animate-fade-in">
        <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl rounded-br-sm bg-gradient-to-br from-cyan-500 to-blue-600 text-white px-4 py-2.5 shadow-md">
          <p className="m-0 text-sm sm:text-[15px] leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
      </div>
    );
  }

  return <AssistantBubble message={message} />;
}

function AssistantBubble({ message }: { message: CoachMessage }) {
  const { play, stop, isPlaying, serverAvailable } = useCoachVoice();
  const supported = serverAvailable !== false || ('speechSynthesis' in window);

  const handleListen = (slow = false) => {
    if (isPlaying) {
      stop();
      return;
    }
    if (!message.content) return;
    play(message.content, { slow });
  };

  const isStreaming = !!message.streaming;

  return (
    <div className="flex items-start gap-2 sm:gap-3 animate-fade-in">
      <TutorAvatar size={36} reactive={false} />
      <div className="max-w-[85%] sm:max-w-[78%]">
        <div className="rounded-2xl rounded-bl-sm bg-white border border-emerald-100 px-4 py-2.5 shadow-sm">
          <p className="m-0 text-sm sm:text-[15px] leading-relaxed text-slate-800 whitespace-pre-wrap">
            {message.content}
            {isStreaming && (
              <span
                className="ml-0.5 inline-block w-[2px] h-[1em] align-text-bottom bg-emerald-500 animate-pulse"
                aria-hidden
              />
            )}
          </p>

          {supported && message.content && !isStreaming && (
            <div className="mt-2 -mb-1 flex items-center gap-1 flex-wrap">
              <button
                type="button"
                onClick={() => handleListen(false)}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-md px-2 py-1 transition-colors"
                title={isPlaying ? 'Parar' : 'Ouvir resposta'}
              >
                {isPlaying ? <StopCircle className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                {isPlaying ? 'Parar' : 'Ouvir'}
              </button>
              <button
                type="button"
                onClick={() => handleListen(true)}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-md px-2 py-1 transition-colors"
                title="Repetir mais devagar"
              >
                <Turtle className="w-3.5 h-3.5" />
                Devagar
              </button>
              {serverAvailable === true && (
                <span
                  className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-violet-50 text-violet-700 border border-violet-200"
                  title="Voz de alta qualidade via ElevenLabs"
                >
                  <Sparkles className="w-3 h-3" />
                  HD
                </span>
              )}
            </div>
          )}
        </div>

        <CorrectionCard
          correction={message.correction}
          explanation={message.explanation}
          naturalExample={message.naturalExample}
        />

        {message.nextQuestion && (
          <div className="mt-2 flex items-start gap-2 text-sm text-emerald-800 bg-emerald-50/70 border border-emerald-200/60 rounded-2xl px-3 py-2">
            <MessageCircle className="w-4 h-4 mt-0.5 shrink-0 text-emerald-600" />
            <p className="m-0 italic">{message.nextQuestion}</p>
          </div>
        )}
      </div>
    </div>
  );
}
