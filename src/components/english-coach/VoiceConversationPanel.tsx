import { Mic, MicOff, Loader2, Volume2, RefreshCw } from 'lucide-react';
import type { VoiceConversationStatus } from '../../types/englishCoach';

interface VoiceConversationPanelProps {
  status: VoiceConversationStatus;
  isSupported: boolean;
  isActive: boolean;
  interimTranscript: string;
  errorMessage: string | null;
  onStart: () => void;
  onStop: () => void;
}

const STATUS_LABEL: Record<VoiceConversationStatus, string> = {
  idle: 'Modo voz desligado',
  starting: 'Pedindo permissão do microfone…',
  listening: 'Ouvindo… fale em inglês',
  processing: 'Analisando sua resposta…',
  speaking: 'Coach está falando',
  error: 'Erro no modo voz',
};

const STATUS_COLOR: Record<VoiceConversationStatus, string> = {
  idle: 'bg-slate-100 text-slate-600 border-slate-200',
  starting: 'bg-amber-50 text-amber-700 border-amber-200',
  listening: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  processing: 'bg-amber-50 text-amber-700 border-amber-200',
  speaking: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  error: 'bg-red-50 text-red-700 border-red-200',
};

/**
 * Panel principal do modo voz. Mostra:
 *   - botão grande de Iniciar/Parar
 *   - status atual com cor
 *   - interim transcript em tempo real (durante listening)
 *   - mensagem de erro quando relevante
 *
 * Nota: o avatar visual em si não fica neste painel — fica no
 * EnglishCoachPage e reage automaticamente ao AvatarStateProvider.
 */
export function VoiceConversationPanel({
  status,
  isSupported,
  isActive,
  interimTranscript,
  errorMessage,
  onStart,
  onStop,
}: VoiceConversationPanelProps) {
  if (!isSupported) {
    return (
      <div className="rounded-3xl border border-amber-200 bg-amber-50/60 p-4 text-sm text-amber-900">
        <div className="font-semibold mb-1">Modo voz indisponível</div>
        <p className="m-0 text-amber-800/80 text-xs leading-relaxed">
          Seu navegador não suporta reconhecimento de voz nativo. Use Chrome ou Edge no desktop, ou
          continue conversando por texto — o tutor funciona igual.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50/60 via-teal-50/40 to-cyan-50/40 p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
            Conversa por voz
          </div>
          <div className="mt-0.5 text-sm text-slate-600">
            {isActive
              ? 'Ele te ouve, responde e devolve a palavra pra você.'
              : 'Aperte Iniciar e converse normalmente com o tutor.'}
          </div>
        </div>

        {!isActive ? (
          <button
            type="button"
            onClick={onStart}
            disabled={status === 'starting'}
            className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-60"
          >
            {status === 'starting' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
            Iniciar
          </button>
        ) : (
          <button
            type="button"
            onClick={onStop}
            className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-red-500 text-white text-sm font-semibold shadow-md hover:bg-red-600 transition-colors"
          >
            <MicOff className="w-4 h-4" />
            Parar
          </button>
        )}
      </div>

      {/* Status pill */}
      <div className="mt-3 flex items-center gap-2 flex-wrap">
        <span
          className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full border ${STATUS_COLOR[status]}`}
        >
          <StatusDot status={status} />
          {STATUS_LABEL[status]}
        </span>

        {status === 'speaking' && (
          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700">
            <Volume2 className="w-3 h-3" />
            Tocando resposta
          </span>
        )}
      </div>

      {/* Interim transcript */}
      {status === 'listening' && interimTranscript && (
        <div className="mt-3 rounded-2xl bg-white/80 border border-cyan-200/60 px-3 py-2 text-sm text-slate-700">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-cyan-700 mb-0.5">
            Você está dizendo
          </div>
          <p className="m-0 italic leading-relaxed">"{interimTranscript}"</p>
        </div>
      )}

      {/* Erro */}
      {status === 'error' && errorMessage && (
        <div className="mt-3 rounded-2xl bg-red-50 border border-red-200 px-3 py-2.5 text-sm text-red-800">
          <p className="m-0 leading-relaxed">{errorMessage}</p>
          <button
            type="button"
            onClick={onStart}
            className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-red-200 text-red-700 text-xs font-semibold hover:bg-red-50 hover:border-red-300 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Tentar novamente
          </button>
        </div>
      )}
    </div>
  );
}

function StatusDot({ status }: { status: VoiceConversationStatus }) {
  if (status === 'idle') return <span className="block w-2 h-2 rounded-full bg-slate-400" />;
  if (status === 'error') return <span className="block w-2 h-2 rounded-full bg-red-500" />;
  if (status === 'speaking')
    return <span className="block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />;
  if (status === 'processing')
    return <span className="block w-2 h-2 rounded-full bg-amber-500 animate-pulse" />;
  if (status === 'starting')
    return <span className="block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />;
  // listening
  return <span className="block w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />;
}
