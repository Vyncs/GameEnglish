import { useEffect, useRef, useState } from 'react';
import { Send, Mic, MicOff, Loader2 } from 'lucide-react';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { useAvatarStateOptional } from './avatar/AvatarStateProvider';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  isSending?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  disabled,
  isSending,
  placeholder = 'Digite em inglês ou português…',
}: ChatInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const avatar = useAvatarStateOptional();
  const {
    isListening,
    transcript,
    isSupported: micSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  // Auto-grow do textarea (até ~5 linhas)
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 140) + 'px';
  }, [value]);

  // Quando o microfone produz transcrição, espelhamos no input.
  useEffect(() => {
    if (transcript && isListening) {
      setValue(transcript);
    }
  }, [transcript, isListening]);

  // Listening de voz → avatar entra em listening(voice).
  useEffect(() => {
    if (!avatar) return;
    if (isListening) {
      avatar.setListening('voice');
    } else if (avatar.state.kind === 'listening' && avatar.state.mode === 'voice') {
      // Só volta pra idle se o estado atual ainda é o "voice listening" que nós setamos.
      avatar.setIdle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening]);

  const submit = () => {
    const text = value.trim();
    if (!text || disabled || isSending) return;
    onSend(text);
    setValue('');
    resetTranscript();
    if (isListening) stopListening();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const toggleMic = () => {
    if (!micSupported) return;
    if (isListening) stopListening();
    else startListening();
  };

  // Listening de texto: enquanto o usuário tem foco no campo E está digitando,
  // publicar listening(text). Quando perder foco ou esvaziar, volta a idle —
  // mas só se o estado atual ainda for "text listening" (não atrapalha thinking/speaking).
  const handleFocus = () => {
    if (!avatar) return;
    if (avatar.state.kind === 'idle') {
      avatar.setListening('text');
    }
  };
  const handleBlur = () => {
    if (!avatar) return;
    if (avatar.state.kind === 'listening' && avatar.state.mode === 'text') {
      avatar.setIdle();
    }
  };

  return (
    <div className="relative flex items-end gap-2 p-2 sm:p-3 rounded-2xl border border-slate-200 bg-white shadow-sm focus-within:border-emerald-300 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
      {micSupported && (
        <button
          type="button"
          onClick={toggleMic}
          disabled={disabled || isSending}
          className={`shrink-0 h-9 w-9 inline-flex items-center justify-center rounded-xl transition-colors ${
            isListening
              ? 'bg-red-500 text-white animate-pulse'
              : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
          }`}
          title={isListening ? 'Parar gravação' : 'Falar'}
          aria-label={isListening ? 'Parar gravação' : 'Falar'}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>
      )}

      <textarea
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        placeholder={isListening ? 'Ouvindo… fale em inglês' : placeholder}
        className="flex-1 resize-none border-none outline-none bg-transparent text-[15px] leading-relaxed placeholder:text-slate-400 max-h-[140px] py-1.5"
        aria-label="Mensagem"
      />

      <button
        type="button"
        onClick={submit}
        disabled={!value.trim() || disabled || isSending}
        className="shrink-0 h-9 px-3 inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-sm"
        title="Enviar (Enter)"
        aria-label="Enviar mensagem"
      >
        {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        <span className="hidden sm:inline">Enviar</span>
      </button>
    </div>
  );
}
