import { Sparkles, Mic, ArrowRight, ShieldCheck } from 'lucide-react';
import { COACH_STARTERS } from '../../types/englishCoach';
import { TutorAvatar } from './TutorAvatar';

interface EmptyStateProps {
  onStart: (message: string, mode?: import('../../types/englishCoach').CoachMode) => void;
  tutorName?: string;
}

/**
 * Empty state — primeira tela do English Coach.
 *
 * Refinamento premium: avatar grande com presença real (orb breathing),
 * eyebrow de autoridade ("AI TUTOR · HD VOICE"), copy reposicionada como
 * "tutor pessoal" não "chatbot", starter cards com depth/hover refinado,
 * cue visual de HD Voice + privacy.
 *
 * Mantém estrutura original: avatar → título → tagline → starters → dica.
 */
export function EmptyState({ onStart, tutorName = 'Coach' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center text-center py-6 sm:py-10 px-4 max-w-2xl mx-auto">
      {/* Avatar premium — orb com presença real */}
      <div className="relative">
        <TutorAvatar size={132} />
        {/* HD Voice cue — chip flutuante embaixo do avatar */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 translate-y-full">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase whitespace-nowrap shadow-lg"
            style={{
              background:
                'linear-gradient(135deg, rgba(16, 185, 129, 0.95) 0%, rgba(20, 184, 166, 0.95) 50%, rgba(56, 189, 248, 0.95) 100%)',
              color: '#fff',
              boxShadow:
                '0 4px 14px -2px rgba(16, 185, 129, 0.40), inset 0 1px 0 rgba(255,255,255,0.25)',
            }}
          >
            <Mic className="w-3 h-3" strokeWidth={2.6} />
            HD Voice Ativo
          </span>
        </div>
      </div>

      {/* Eyebrow */}
      <span className="mt-10 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-700">
        <span className="block h-px w-6 bg-gradient-to-r from-transparent to-emerald-500" />
        AI Tutor · Personalizado
        <span className="block h-px w-6 bg-gradient-to-l from-transparent to-emerald-500" />
      </span>

      {/* Hero — autoridade */}
      <h2
        className="mt-3 text-[28px] sm:text-[36px] font-bold leading-[1.1] tracking-tight text-slate-900"
        style={{ fontFeatureSettings: '"ss01", "cv11"' }}
      >
        Hi, I'm {tutorName}{' '}
        <span className="inline-block animate-fade-in">👋</span>
      </h2>

      <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-md leading-relaxed">
        Seu professor particular de inglês. Vou conversar com você, corrigir seus erros e te ajudar
        a soar mais{' '}
        <span className="relative inline-block">
          <span className="relative z-10 font-semibold text-slate-800">natural</span>
          <span
            className="absolute inset-x-0 bottom-0.5 h-2 -z-0"
            style={{ background: 'rgba(244, 226, 43, 0.40)' }}
            aria-hidden
          />
        </span>{' '}
        — no seu ritmo.
      </p>

      {/* Starter prompt CTA */}
      <div className="mt-7 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border border-emerald-200 text-xs font-semibold text-emerald-800 shadow-sm">
        <Sparkles className="w-3.5 h-3.5" />
        Escolha por onde começar
      </div>

      {/* Starter cards premium */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-md">
        {COACH_STARTERS.map((s, idx) => (
          <button
            key={s.label}
            type="button"
            onClick={() => onStart(s.message, s.mode)}
            className="group relative text-left p-3.5 rounded-2xl bg-white border border-slate-200/80 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300 overflow-hidden animate-fade-in"
            style={{
              animationDelay: `${idx * 60}ms`,
              boxShadow:
                '0 1px 2px rgba(15, 23, 42, 0.04), 0 1px 0 rgba(255,255,255,1) inset',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                '0 1px 2px rgba(15, 23, 42, 0.04), 0 14px 28px -10px rgba(16, 185, 129, 0.22), 0 1px 0 rgba(255,255,255,1) inset';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow =
                '0 1px 2px rgba(15, 23, 42, 0.04), 0 1px 0 rgba(255,255,255,1) inset';
            }}
          >
            {/* Faixa colorida no topo (visível só no hover) */}
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
              style={{
                background:
                  'linear-gradient(90deg, #10b981 0%, #14b8a6 50%, #0ea5e9 100%)',
              }}
            />

            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 font-semibold text-[15px] tracking-tight text-slate-900 group-hover:text-emerald-800 transition-colors">
                <span className="text-lg leading-none">{s.emoji}</span>
                {s.label}
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 transition-all duration-200 group-hover:text-emerald-600 group-hover:translate-x-0.5" />
            </div>
            <p className="mt-1.5 text-[12px] text-slate-500 line-clamp-2 leading-snug">
              "{s.message}"
            </p>
          </button>
        ))}
      </div>

      {/* Privacy + tip */}
      <div className="mt-7 flex flex-col items-center gap-2">
        <p className="text-[11px] text-slate-400 leading-relaxed max-w-sm">
          Pode escrever em português também — eu respondo em inglês.
        </p>
        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-400">
          <ShieldCheck className="w-3 h-3" strokeWidth={2.2} />
          Suas conversas são privadas
        </span>
      </div>
    </div>
  );
}
