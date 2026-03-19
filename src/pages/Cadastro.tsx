import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, getAuthSocialUrl } from '../api/client';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

export function Cadastro() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponStatus, setCouponStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');
  const [couponTeacher, setCouponTeacher] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const couponTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (!couponCode.trim()) {
      setCouponStatus('idle');
      setCouponTeacher(null);
      return;
    }
    setCouponStatus('checking');
    if (couponTimeout.current) clearTimeout(couponTimeout.current);
    couponTimeout.current = setTimeout(async () => {
      try {
        const res = await api.validateCoupon(couponCode.trim());
        setCouponStatus(res.valid ? 'valid' : 'invalid');
        setCouponTeacher(res.teacherName);
      } catch {
        setCouponStatus('invalid');
      }
    }, 500);
    return () => { if (couponTimeout.current) clearTimeout(couponTimeout.current); };
  }, [couponCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (couponCode.trim() && couponStatus !== 'valid') {
      setError('Cupom de professor invalido');
      return;
    }
    setSubmitting(true);
    try {
      const { email: verifiedEmail } = await api.register(
        email.trim(),
        password,
        name.trim() || undefined,
        couponCode.trim() || undefined,
      );
      navigate(`/verify-email?email=${encodeURIComponent(verifiedEmail)}`, { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao criar conta';
      if (msg.includes('Conta criada') || msg.includes('não foi possível enviar')) {
        navigate(`/verify-email?email=${encodeURIComponent(email.trim())}`, { replace: true });
      } else {
        setError(msg);
      }
    } finally {
      setSubmitting(false);
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
          <p className="text-slate-500 mt-2">Crie sua conta</p>
        </div>

        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-slate-200/60 p-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">Criar conta</h2>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-xl mb-4">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome (opcional)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-shadow"
                placeholder="Seu nome"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-shadow"
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-shadow"
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cupom do professor (opcional)</label>
              <div className="relative">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  autoComplete="off"
                  maxLength={10}
                  className={`w-full px-4 py-2.5 bg-white border rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition-shadow uppercase tracking-wider ${
                    couponStatus === 'valid'
                      ? 'border-emerald-300 focus:ring-emerald-500/50 focus:border-emerald-500'
                      : couponStatus === 'invalid'
                        ? 'border-red-300 focus:ring-red-500/50 focus:border-red-500'
                        : 'border-slate-200 focus:ring-cyan-500/50 focus:border-cyan-500'
                  }`}
                  placeholder="Ex: ABC1234"
                />
                {couponStatus === 'checking' && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 animate-spin" />
                )}
                {couponStatus === 'valid' && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                )}
                {couponStatus === 'invalid' && (
                  <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
                )}
              </div>
              {couponStatus === 'valid' && couponTeacher && (
                <p className="text-xs text-emerald-600 mt-1">Professor: {couponTeacher}</p>
              )}
              {couponStatus === 'invalid' && couponCode.trim() && (
                <p className="text-xs text-red-500 mt-1">Cupom nao encontrado</p>
              )}
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-xl hover:opacity-95 active:opacity-90 disabled:opacity-60 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Criar conta'
              )}
            </button>
          </form>

          <div className="relative my-6">
            <span className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </span>
            <span className="relative flex justify-center text-xs text-slate-500 bg-white/80 px-2">
              ou cadastre-se com
            </span>
          </div>

          <div className="flex justify-center">
            <a
              href={getAuthSocialUrl('google')}
              title="Cadastrar com Google"
              className="w-14 h-14 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:shadow-md transition-all"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </a>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Já tem conta?{' '}
            <Link
              to="/login"
              className="font-medium text-cyan-600 hover:text-cyan-700 hover:underline"
            >
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
