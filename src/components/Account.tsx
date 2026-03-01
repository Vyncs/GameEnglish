import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../api/client';
import { User, CreditCard, LogOut, Loader2 } from 'lucide-react';
import { SubscriptionModal } from './SubscriptionModal';

const isDev = import.meta.env.DEV;

export function Account() {
  const navigate = useNavigate();
  const { setViewMode } = useStore();
  const { user, logout, initAuth } = useAuthStore();
  const [error, setError] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [simulateLoading, setSimulateLoading] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const handleLogout = () => {
    logout();
    setViewMode('home');
    navigate('/login', { replace: true });
  };

  const handlePortal = async () => {
    setPaymentLoading(true);
    setError('');
    try {
      const { url } = await api.createPortalSession();
      if (url) window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao abrir portal');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleSimulateNotification = async () => {
    setSimulateLoading(true);
    setError('');
    try {
      await api.simulateMercadoPagoNotification();
      await initAuth();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao simular notificação');
    } finally {
      setSimulateLoading(false);
    }
  };

  const handleSimulateClearSubscription = async () => {
    setSimulateLoading(true);
    setError('');
    try {
      await api.simulateClearSubscription();
      await initAuth();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao simular plano gratuito');
    } finally {
      setSimulateLoading(false);
    }
  };

  if (!user) return null;

  const isActive = user.subscriptionStatus === 'active';

  return (
    <>
    <SubscriptionModal
      open={showSubscriptionModal}
      onClose={() => setShowSubscriptionModal(false)}
    />
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-slate-200/60 p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white">
            <User className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{user.name || 'Usuário'}</h2>
            <p className="text-slate-500">{user.email}</p>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6 space-y-4">
          <div className="flex items-center justify-between py-3 px-4 bg-slate-50 rounded-xl">
            <span className="text-slate-600">Assinatura</span>
            <span className={`font-medium ${isActive ? 'text-emerald-600' : 'text-amber-600'}`}>
              {isActive ? 'Ativa' : 'Plano gratuito'}
            </span>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">{error}</p>
          )}

          <div className="flex gap-3">
            {!isActive && (
              <button
                onClick={() => setShowSubscriptionModal(true)}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
              >
                <CreditCard className="w-5 h-5" />
                Assinar agora
              </button>
            )}
            {isActive && (
              <button
                onClick={handlePortal}
                disabled={paymentLoading}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-slate-700 text-white font-medium rounded-xl hover:bg-slate-600 disabled:opacity-60 transition-colors"
              >
                {paymentLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
                Gerenciar assinatura
              </button>
            )}
          </div>

          {isDev && !isActive && (
            <button
              type="button"
              onClick={handleSimulateNotification}
              disabled={simulateLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-amber-300 bg-amber-50 text-amber-800 rounded-xl hover:bg-amber-100 disabled:opacity-60 text-sm"
            >
              {simulateLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Simular pagamento aprovado (dev)
            </button>
          )}
          {isDev && isActive && (
            <button
              type="button"
              onClick={handleSimulateClearSubscription}
              disabled={simulateLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-300 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 disabled:opacity-60 text-sm"
            >
              {simulateLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Simular plano gratuito (dev)
            </button>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-slate-300 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sair da conta
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
