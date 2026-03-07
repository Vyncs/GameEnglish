import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import { AppLayout } from './AppLayout';
import { Login } from './pages/Login';
import { Cadastro } from './pages/Cadastro';
import { LandingPage } from './pages/LandingPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { VerifyEmail } from './pages/VerifyEmail';
import { TermosDeUso } from './pages/TermosDeUso';
import { PoliticaPrivacidade } from './pages/PoliticaPrivacidade';
import { CookieBanner } from './components/CookieBanner';
import { setToken } from './api/client';

function AuthInit() {
  const initAuth = useAuthStore((s) => s.initAuth);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      setToken(token);
      window.history.replaceState({}, '', window.location.pathname || '/');
    }
    initAuth();
    // Retorno do Mercado Pago: refresh do usuário após 2s para pegar subscriptionStatus atualizado (notificação pode atrasar)
    const fromPayment = params.get('success') === 'true' || params.get('pending') === 'true';
    if (fromPayment) {
      const t = setTimeout(() => initAuth(), 2000);
      return () => clearTimeout(t);
    }
  }, [initAuth]);
  return null;
}

export default function App() {
  return (
    <>
      <AuthInit />
      <CookieBanner />
      <Routes>
        <Route path="/login" element={<LoginOrRedirect />} />
        <Route path="/cadastro" element={<CadastroOrRedirect />} />
        <Route path="/" element={<HomeRoute />} />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/termos" element={<TermosDeUso />} />
        <Route path="/privacidade" element={<PoliticaPrivacidade />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function AuthLoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-blue-50/50 flex items-center justify-center">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
      </div>
      <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin relative z-10" />
    </div>
  );
}

function HomeRoute() {
  const { user, authLoading } = useAuthStore();
  if (authLoading) return <AuthLoadingScreen />;
  if (user) return <Navigate to="/app" replace />;
  return <LandingPage />;
}

function LoginOrRedirect() {
  const { user, authLoading } = useAuthStore();
  if (authLoading) return <AuthLoadingScreen />;
  if (user) return <Navigate to="/app" replace />;
  return <Login />;
}

function CadastroOrRedirect() {
  const { user, authLoading } = useAuthStore();
  if (authLoading) return <AuthLoadingScreen />;
  if (user) return <Navigate to="/app" replace />;
  return <Cadastro />;
}
