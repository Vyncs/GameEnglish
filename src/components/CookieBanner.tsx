import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const COOKIE_CONSENT_KEY = 'pfc-cookie-consent';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'rejected');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] p-4 animate-fade-in">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-slate-800 mb-1">Utilizamos cookies</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Usamos cookies essenciais para o funcionamento da plataforma e cookies analíticos para melhorar sua experiência. 
              Ao clicar em "Aceitar", você concorda com o uso de cookies conforme nossa{' '}
              <a href="/privacidade" className="text-cyan-600 hover:underline">Política de Privacidade</a>, 
              em conformidade com a LGPD (Lei nº 13.709/2018).
            </p>
          </div>
          <button onClick={() => setVisible(false)} className="p-1 hover:bg-slate-100 rounded-lg transition-colors sm:hidden">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-4">
          <button
            onClick={handleAccept}
            className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
          >
            Aceitar todos
          </button>
          <button
            onClick={handleReject}
            className="px-5 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
          >
            Apenas essenciais
          </button>
        </div>
      </div>
    </div>
  );
}
