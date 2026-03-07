import { useState } from 'react';
import { X, Crown, Check, Loader2, ArrowRight, Lock, LayoutGrid, Mic, BookOpen, BarChart3, Shield, Construction } from 'lucide-react';
import { api } from '../api/client';

interface SubscriptionModalProps {
  open: boolean;
  onClose: () => void;
  /** Chamado ao clicar em Assinar (mensal ou anual); recebe o plano e pode redirecionar */
  onSelectPlan?: (plan: 'monthly' | 'annual') => void;
}

export function SubscriptionModal({ open, onClose, onSelectPlan }: SubscriptionModalProps) {
  const [loadingPlan, setLoadingPlan] = useState<'monthly' | 'annual' | null>(null);
  const [error, setError] = useState('');

  const handleSubscribe = async (plan: 'monthly' | 'annual') => {
    setError('');
    setLoadingPlan(plan);
    try {
      const { url } = await api.createCheckoutSession(plan);
      if (url) {
        if (onSelectPlan) onSelectPlan(plan);
        window.location.href = url;
        return;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao iniciar assinatura');
    } finally {
      setLoadingPlan(null);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-800 border border-slate-600 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-slate-600 bg-slate-800/95 backdrop-blur">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Crown className="w-6 h-6 text-cyan-400" />
              Desbloqueie <span className="text-cyan-400">todos os recursos</span>
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Flash Cards são gratuitos. Assine para liberar o resto!
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cards */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6" onClick={e => e.stopPropagation()}>
          {/* FREE */}
          <div className="rounded-xl border border-slate-600 bg-slate-700/50 p-5 flex flex-col">
            <div className="text-emerald-400 font-bold text-sm">FREE</div>
            <h3 className="text-lg font-bold text-white mt-1">Flash Cards</h3>
            <ul className="mt-4 space-y-2 flex-1">
              <li className="flex items-center gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                Revisões ilimitadas
              </li>
              <li className="flex items-center gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                Simples e rápido
              </li>
            </ul>
            <button
              disabled
              className="mt-4 w-full py-3 rounded-xl bg-slate-600 text-slate-400 font-medium cursor-default"
            >
              Gratuito
            </button>
            <p className="text-center text-slate-500 text-xs mt-2">Já disponível</p>
          </div>

          {/* PRO - Mensal */}
          <div className="rounded-xl border-2 border-cyan-500/50 bg-slate-700/80 p-5 flex flex-col relative shadow-lg shadow-cyan-500/10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold">
              MAIS VENDIDO
            </div>
            <div className="text-cyan-400 font-bold text-sm">PRO</div>
            <h3 className="text-lg font-bold text-white mt-1">Plano Mensal</h3>
            <p className="text-2xl font-bold text-white mt-2">R$ 19,99 <span className="text-slate-400 text-base font-normal">/mês</span></p>
            <ul className="mt-4 space-y-2 flex-1">
              <li className="flex items-center gap-2 text-slate-300 text-sm">
                <LayoutGrid className="w-4 h-4 text-cyan-400 shrink-0" />
                Bricks Challenge
              </li>
              <li className="flex items-center gap-2 text-slate-300 text-sm">
                <LayoutGrid className="w-4 h-4 text-cyan-400 shrink-0" />
                Pairs Challenge
              </li>
              <li className="flex items-center gap-2 text-slate-500 text-sm">
                <Mic className="w-4 h-4 text-slate-500 shrink-0" />
                Karaoke Mode
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase rounded-full">
                  <Construction className="w-2.5 h-2.5" />
                  Em breve
                </span>
              </li>
              <li className="flex items-center gap-2 text-slate-300 text-sm">
                <BookOpen className="w-4 h-4 text-cyan-400 shrink-0" />
                Graded Readers
              </li>
              <li className="flex items-center gap-2 text-slate-300 text-sm">
                <BarChart3 className="w-4 h-4 text-cyan-400 shrink-0" />
                Estatísticas
              </li>
              <li className="flex items-center gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                Revisões ilimitadas
              </li>
            </ul>
            <button
              onClick={() => handleSubscribe('monthly')}
              disabled={!!loadingPlan}
              className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loadingPlan === 'monthly' ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
              {loadingPlan === 'monthly' ? 'Abrindo...' : 'Assinar Agora'}
            </button>
          </div>

          {/* ANUAL */}
          <div className="rounded-xl border border-slate-600 bg-slate-700/50 p-5 flex flex-col">
            <div className="text-violet-400 font-bold text-sm">ANUAL</div>
            <h3 className="text-lg font-bold text-white mt-1">Economize 30%</h3>
            <p className="text-2xl font-bold text-white mt-2">R$ 179 <span className="text-slate-400 text-base font-normal">/ano</span></p>
            <p className="text-slate-400 text-sm mt-1">
              <span className="inline-block px-2 py-0.5 rounded-md bg-slate-600 text-slate-300">R$ 14,99 /mês</span>
            </p>
            <ul className="mt-4 space-y-2 flex-1">
              <li className="flex items-center gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                Tudo do Plano PRO
              </li>
              <li className="flex items-center gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                Acesso completo
              </li>
              <li className="flex items-center gap-2 text-slate-300 text-sm">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                Desconto 30%
              </li>
            </ul>
            <button
              onClick={() => handleSubscribe('annual')}
              disabled={!!loadingPlan}
              className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loadingPlan === 'annual' ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {loadingPlan === 'annual' ? 'Abrindo...' : 'Assinar Anual'}
            </button>
            <p className="text-center text-emerald-400 text-sm mt-2 font-medium">• Economize R$ 61!</p>
          </div>
        </div>

        {error && (
          <div className="px-6 pb-4">
            <p className="text-red-400 text-sm text-center bg-red-500/10 rounded-lg py-2">{error}</p>
          </div>
        )}

        {/* Footer */}
        <div className="p-6 border-t border-slate-600 flex flex-wrap items-center justify-center gap-6 text-slate-400 text-sm">
          <span className="flex items-center gap-2">
            <span className="rounded-full p-1.5 bg-slate-600"><span className="text-slate-300">↻</span></span>
            Cancelamento a qualquer momento
          </span>
          <span className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Pagamento seguro
          </span>
          <span className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            7 dias de garantia
          </span>
        </div>
      </div>
    </div>
  );
}
