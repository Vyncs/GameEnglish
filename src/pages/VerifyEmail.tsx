import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useStore } from '../store/useStore';
import { api, setToken } from '../api/client';
import { Loader2, Mail, RefreshCw } from 'lucide-react';

export function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get('email') || '';
  const { setUser } = useAuthStore();
  const { hydrateFromSync } = useStore();

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      digits.forEach((d, i) => {
        if (i + index < 6) newCode[i + index] = d;
      });
      setCode(newCode);
      const nextIndex = Math.min(index + digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
    } else {
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 5) inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const fullCode = code.join('');

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (fullCode.length !== 6 || submitting) return;

    setError('');
    setSubmitting(true);
    try {
      const { user, token } = await api.verifyEmail(emailParam, fullCode);
      setToken(token);
      setUser(user);
      try {
        const sync = await api.getSync();
        hydrateFromSync(sync);
      } catch {}
      navigate('/app', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao verificar código');
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (fullCode.length === 6) handleSubmit();
  }, [fullCode]);

  const handleResend = async () => {
    if (resending || cooldown > 0) return;
    setResending(true);
    setResendSuccess(false);
    setError('');
    try {
      await api.resendVerification(emailParam);
      setResendSuccess(true);
      setCooldown(60);
      setTimeout(() => setResendSuccess(false), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao reenviar código');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-blue-50/50 flex items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 w-72 h-72 bg-indigo-200/20 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            🎓 Play Flash Cards
          </h1>
        </div>

        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-slate-200/60 p-8 text-center">
          <div className="w-16 h-16 bg-cyan-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Mail className="w-8 h-8 text-cyan-600" />
          </div>

          <h2 className="text-xl font-semibold text-slate-800 mb-2">Verifique seu email</h2>
          <p className="text-sm text-slate-500 mb-1">Enviamos um código de 6 dígitos para</p>
          <p className="text-sm font-medium text-slate-700 mb-6">{emailParam}</p>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-xl mb-4">{error}</p>
          )}

          {resendSuccess && (
            <p className="text-sm text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl mb-4">
              Novo código enviado com sucesso!
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="flex justify-center gap-2 sm:gap-3 mb-6">
              {code.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl border-2 border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={fullCode.length !== 6 || submitting}
              className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-xl hover:opacity-95 active:opacity-90 disabled:opacity-40 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Verificar'
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-xs text-slate-400 mb-3">Não recebeu o código?</p>
            <button
              onClick={handleResend}
              disabled={resending || cooldown > 0}
              className="text-sm font-medium text-cyan-600 hover:text-cyan-700 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center gap-1.5 mx-auto transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
              {cooldown > 0 ? `Reenviar em ${cooldown}s` : 'Reenviar código'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
