import { useState } from 'react';
import { Lock, CreditCard } from 'lucide-react';
import { SubscriptionModal } from './SubscriptionModal';

interface PaywallOverlayProps {
  featureName: string;
}

export function PaywallOverlay({ featureName }: PaywallOverlayProps) {
  const [showPlanModal, setShowPlanModal] = useState(false);

  return (
    <>
      <SubscriptionModal
        open={showPlanModal}
        onClose={() => setShowPlanModal(false)}
      />
      <div
        className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/40 backdrop-blur-md"
        aria-hidden="false"
      >
        <div className="mx-4 max-w-sm rounded-2xl border border-slate-200/60 bg-white/95 p-6 text-center shadow-xl backdrop-blur-sm">
          <div className="mb-3 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
              <Lock className="h-7 w-7 text-amber-600" />
            </div>
          </div>
          <h2 className="text-lg font-bold text-slate-800">Recurso exclusivo para assinantes</h2>
          <p className="mt-1 text-sm text-slate-600">
            <strong>{featureName}</strong> faz parte do plano pago. Assine para desbloquear.
          </p>
          <button
            onClick={() => setShowPlanModal(true)}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 px-4 font-medium text-white transition-opacity hover:opacity-90"
          >
            <CreditCard className="w-5 h-5" />
            Assinar para desbloquear
          </button>
        </div>
      </div>
    </>
  );
}
