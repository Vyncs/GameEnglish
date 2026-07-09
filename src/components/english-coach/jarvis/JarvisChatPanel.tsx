import { useEffect, useRef } from 'react';
import { Trash2, Send, Plus, AudioLines } from 'lucide-react';
import type { CoachMessage, CoachMode } from '../../../types/englishCoach';
import { MessageBubble } from '../MessageBubble';
import { ChatInput } from '../ChatInput';

interface JarvisChatPanelProps {
  messages: CoachMessage[];
  isSending: boolean;
  onSend: (text: string) => void;
  onClear: () => void;
  onPickStarter: (message: string, mode?: CoachMode) => void;
}

/**
 * Painel de conversa direito — variante JARVIS (dark).
 *
 * Mantém MessageBubble e ChatInput existentes intactos. Só envolve em
 * uma chrome dark + overrides de cor onde necessário via classes Tailwind.
 *
 * Quando vazio, mostra um briefing minimalista — não duplica o EmptyState
 * da versão clara, pois o AI Core central já cumpre o papel de hero.
 */
export function JarvisChatPanel({
  messages,
  isSending,
  onSend,
  onClear,
}: JarvisChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages.length, isSending]);

  const isEmpty = messages.length === 0;

  return (
    <div className="jarvis-card jarvis-bracket flex flex-col h-full overflow-hidden">
      {/* Toolbar compacta */}
      <div
        className="flex items-center justify-between px-3 py-2 border-b"
        style={{ borderColor: 'rgba(34, 211, 238, 0.12)' }}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <AudioLines className="w-3 h-3 text-cyan-400" strokeWidth={2.4} />
          <span
            className="text-[10px] font-bold uppercase tracking-[0.16em]"
            style={{ color: '#22d3ee' }}
          >
            Conversa
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onClear}
            disabled={isEmpty}
            className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-md px-1.5 py-1 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title="Limpar"
          >
            <Trash2 className="w-3 h-3" />
            <span className="hidden sm:inline">Limpar</span>
          </button>
          <button
            type="button"
            onClick={onClear}
            className="jarvis-btn-ghost inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1"
          >
            <Plus className="w-3 h-3" />
            Nova
          </button>
        </div>
      </div>

      {/* Mensagens — denso */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
        {isEmpty ? (
          <EmptyConversation />
        ) : (
          messages.map((m) => (
            <div key={m.id} className="jarvis-msg">
              <MessageBubble message={m} />
            </div>
          ))
        )}
      </div>

      {/* Input slim */}
      <div
        className="px-2 py-2 border-t"
        style={{ borderColor: 'rgba(34, 211, 238, 0.12)' }}
      >
        <div className="jarvis-input-wrap">
          <ChatInput onSend={onSend} disabled={isSending} isSending={isSending} />
        </div>
        <p className="mt-1 px-1 text-[9px] text-slate-600">
          <Send className="inline w-2 h-2 mr-1" />
          <kbd className="px-1 rounded bg-slate-800/60 border border-cyan-500/15 font-mono text-[9px]">
            Enter
          </kbd>{' '}
          enviar
        </p>
      </div>

      {/* Style overrides locais — para forçar bubbles e input em tema dark */}
      <style>{`
        .jarvis-msg [class*="bg-white"] {
          background: rgba(15, 21, 37, 0.65) !important;
          color: #e5edff !important;
          border-color: rgba(34, 211, 238, 0.12) !important;
        }
        .jarvis-msg [class*="bg-emerald-50"] {
          background: rgba(16, 185, 129, 0.08) !important;
          border-color: rgba(16, 185, 129, 0.24) !important;
        }
        .jarvis-msg [class*="bg-amber-50"] {
          background: rgba(245, 158, 11, 0.08) !important;
          border-color: rgba(245, 158, 11, 0.24) !important;
        }
        .jarvis-msg [class*="text-slate-900"],
        .jarvis-msg [class*="text-slate-800"],
        .jarvis-msg [class*="text-slate-700"] {
          color: #e5edff !important;
        }
        .jarvis-msg [class*="text-slate-600"],
        .jarvis-msg [class*="text-slate-500"] {
          color: #94a3b8 !important;
        }
        .jarvis-input-wrap textarea, .jarvis-input-wrap input[type="text"] {
          background: rgba(11, 16, 32, 0.7) !important;
          color: #e5edff !important;
          border-color: rgba(34, 211, 238, 0.18) !important;
        }
        .jarvis-input-wrap textarea::placeholder,
        .jarvis-input-wrap input::placeholder {
          color: #64748b !important;
        }
      `}</style>
    </div>
  );
}

function EmptyConversation() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8 opacity-90">
      <div
        className="w-12 h-12 rounded-full grid place-items-center mb-3"
        style={{
          background: 'rgba(34, 211, 238, 0.08)',
          border: '1px solid rgba(34, 211, 238, 0.30)',
          boxShadow: '0 0 24px rgba(34, 211, 238, 0.20)',
        }}
      >
        <AudioLines className="w-5 h-5 text-cyan-400" />
      </div>
      <p className="text-[14px] font-semibold text-white tracking-tight">
        Pronto pra começar
      </p>
      <p className="mt-1 text-[12px] text-slate-400 max-w-xs leading-relaxed">
        Toque o microfone ao centro pra conversar por voz, ou escreva abaixo. Eu corrijo,
        explico e te dou exemplos naturais — em tempo real.
      </p>
    </div>
  );
}
