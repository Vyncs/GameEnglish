import { Lock, CreditCard } from 'lucide-react';
import { useStore } from '../store/useStore';

interface PaywallBlockProps {
  featureName: string;
}

export function PaywallBlock({ featureName }: PaywallBlockProps) {
  const setViewMode = useStore((s) => s.setViewMode);

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-slate-200/60 p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-amber-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Recurso exclusivo para assinantes</h2>
        <p className="text-slate-600 mb-6">
          <strong>{featureName}</strong> faz parte do plano pago. Assine para desbloquear e aproveitar todos os recursos.
        </p>
        <button
          onClick={() => setViewMode('account')}
          className="inline-flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
        >
          <CreditCard className="w-5 h-5" />
          Assinar para desbloquear
        </button>
      </div>
    </div>
  );
}
