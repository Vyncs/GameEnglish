import { CheckCircle2, Sparkles, BookOpenCheck } from 'lucide-react';

interface CorrectionCardProps {
  correction?: string | null;
  explanation?: string | null;
  naturalExample?: string | null;
}

/**
 * CorrectionCard — bloco didático que aparece logo após a resposta do tutor
 * quando há erro a corrigir. Não aparece se não houver nenhum dos campos.
 */
export function CorrectionCard({ correction, explanation, naturalExample }: CorrectionCardProps) {
  const hasAny = !!(correction || explanation || naturalExample);
  if (!hasAny) return null;

  return (
    <div className="mt-2 rounded-2xl border border-amber-200/70 bg-gradient-to-br from-amber-50 via-yellow-50/60 to-amber-50/40 p-3 sm:p-4 shadow-sm animate-fade-in">
      {correction && (
        <div className="flex items-start gap-2 text-amber-900">
          <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
          <div className="text-sm leading-relaxed">
            <div className="text-[11px] uppercase tracking-wider font-semibold text-amber-700 mb-0.5">
              Correção
            </div>
            <p className="m-0 whitespace-pre-line">{correction}</p>
          </div>
        </div>
      )}

      {explanation && (
        <div className="mt-3 flex items-start gap-2 text-slate-700">
          <BookOpenCheck className="w-4 h-4 mt-0.5 shrink-0 text-emerald-600" />
          <div className="text-sm leading-relaxed">
            <div className="text-[11px] uppercase tracking-wider font-semibold text-emerald-700 mb-0.5">
              Explicação
            </div>
            <p className="m-0">{explanation}</p>
          </div>
        </div>
      )}

      {naturalExample && (
        <div className="mt-3 flex items-start gap-2 text-slate-800">
          <Sparkles className="w-4 h-4 mt-0.5 shrink-0 text-violet-600" />
          <div className="text-sm leading-relaxed">
            <div className="text-[11px] uppercase tracking-wider font-semibold text-violet-700 mb-0.5">
              Forma mais natural
            </div>
            <p className="m-0 italic">"{naturalExample}"</p>
          </div>
        </div>
      )}
    </div>
  );
}
