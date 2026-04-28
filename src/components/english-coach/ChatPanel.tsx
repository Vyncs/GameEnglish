import { useEffect, useRef } from 'react';
import { Trash2, Wifi } from 'lucide-react';
import type { CoachMessage } from '../../types/englishCoach';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { EmptyState } from './EmptyState';

interface ChatPanelProps {
  messages: CoachMessage[];
  isSending: boolean;
  onSend: (text: string) => void;
  onClear: () => void;
  onPickStarter: (message: string, mode?: import('../../types/englishCoach').CoachMode) => void;
}

export function ChatPanel({ messages, isSending, onSend, onClear, onPickStarter }: ChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll para o final ao receber/enviar mensagem
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages.length, isSending]);

  const isEmpty = messages.length === 0;

  return (
    <div
      className="flex flex-col h-full rounded-3xl overflow-hidden relative"
      style={{
        background:
          'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(16, 185, 129, 0.06) 0%, transparent 60%), linear-gradient(180deg, #ffffff 0%, #f8fffd 100%)',
        border: '1px solid rgba(16, 185, 129, 0.18)',
        boxShadow:
          '0 1px 2px rgba(15, 23, 42, 0.04), 0 24px 48px -24px rgba(16, 185, 129, 0.18), inset 0 1px 0 rgba(255, 255, 255, 1)',
      }}
    >
      {/* Toolbar premium */}
      <div
        className="flex items-center justify-between px-4 sm:px-5 py-2.5 border-b"
        style={{
          borderColor: 'rgba(16, 185, 129, 0.14)',
          background:
            'linear-gradient(180deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.65) 100%)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <div className="text-[13px] font-semibold tracking-tight text-slate-800 truncate">
            Conversa com Coach
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/70">
            <Wifi className="w-2.5 h-2.5" strokeWidth={2.6} />
            HD Voice
          </span>
        </div>
        <button
          type="button"
          onClick={onClear}
          disabled={isEmpty}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md px-2 py-1 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          title="Limpar conversa"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Limpar</span>
        </button>
      </div>

      {/* Mensagens */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-3 sm:px-5 py-4 space-y-3"
      >
        {isEmpty ? (
          <EmptyState onStart={onPickStarter} />
        ) : (
          messages.map((m) => <MessageBubble key={m.id} message={m} />)
        )}
      </div>

      {/* Input */}
      <div
        className="p-2 sm:p-3 border-t"
        style={{
          borderColor: 'rgba(16, 185, 129, 0.14)',
          background:
            'linear-gradient(0deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.75) 100%)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <ChatInput onSend={onSend} disabled={isSending} isSending={isSending} />
        <p className="mt-1.5 px-2 text-[10px] text-slate-400">
          Pressione{' '}
          <kbd className="px-1 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono text-[10px]">
            Enter
          </kbd>{' '}
          para enviar •{' '}
          <kbd className="px-1 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono text-[10px]">
            Shift+Enter
          </kbd>{' '}
          para nova linha
        </p>
      </div>
    </div>
  );
}
