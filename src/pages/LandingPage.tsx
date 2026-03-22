import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  Brain,
  Gamepad2,
  Mic,
  BookOpen,
  Puzzle,
  ChevronRight,
  Check,
  ArrowRight,
  Menu,
  X,
  Sparkles,
  MessageCircle,
  Bot,
  Construction,
} from 'lucide-react';

import logoMark from '../assets/logotipo-educacional-raio-tablet.png';

const WHATSAPP_URL = 'https://wa.me/5513988513127?text=Ol%C3%A1!%20Tenho%20interesse%20no%20Play%20Flash%20Cards';

/** 24h em segundos — contador fictício (reinicia ao zerar). */
const LAUNCH_COUNTDOWN_START_SEC = 24 * 60 * 60;

function formatCountdownHMS(totalSec: number): string {
  const t = Math.max(0, totalSec);
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = t % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function useLaunchCountdown() {
  const [secondsLeft, setSecondsLeft] = useState(LAUNCH_COUNTDOWN_START_SEC);
  useEffect(() => {
    const id = window.setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? LAUNCH_COUNTDOWN_START_SEC : prev - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);
  return secondsLeft;
}

const VIDEOS = {
  bricks: '/videos/BricksChallenge.mp4',
  pairs: '/videos/PairsChallenge.mp4',
  readers: '/videos/GradedReaders.mp4',
  revisao: '/videos/SistemaRevisaoEspacada.mp4',
};

export function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [videoModal, setVideoModal] = useState<{ title: string; videoUrl: string } | null>(null);
  const launchCountdownSec = useLaunchCountdown();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-800 overflow-x-hidden">
      <div className="fixed top-0 left-0 right-0 z-50">
        {/* Promoção de lançamento */}
        <div className="bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-600 text-white px-4 py-2.5 text-center text-[11px] sm:text-sm leading-snug border-b border-white/10">
          <p className="max-w-4xl mx-auto">
            <span className="inline-flex items-center justify-center gap-1.5 font-semibold">
              <Sparkles className="w-3.5 h-3.5 shrink-0 opacity-95" aria-hidden />
              Promoção de lançamento:
            </span>{' '}
            <span className="text-violet-50">
              GARANTA seu acesso VIP durante 6 meses para os primeiros{' '}
              <strong className="text-white font-bold">50</strong> cadastros.{' '}
              <span className="hidden sm:inline">·</span>{' '}
              Para os <strong className="text-white font-bold">10</strong> primeiros professores:{' '}
              <strong className="text-white font-bold">10</strong> alunos gratuitos.
            </span>
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11px] sm:text-sm font-medium text-violet-100">
            <span className="opacity-95">Oferta acaba em:</span>
            <span
              className="inline-flex items-center rounded-lg bg-white/15 px-2.5 py-0.5 font-mono text-[13px] sm:text-sm font-bold tabular-nums tracking-wide text-white ring-1 ring-white/25"
              role="timer"
              aria-live="polite"
              aria-label={`Tempo restante da oferta: ${formatCountdownHMS(launchCountdownSec)}`}
            >
              {formatCountdownHMS(launchCountdownSec)}
            </span>
          </div>
        </div>

        {/* Navbar */}
        <nav
          className={`transition-all duration-300 w-full ${
            scrolled
              ? 'bg-white/90 backdrop-blur-xl shadow-sm border-b border-slate-100'
              : 'bg-transparent'
          }`}
        >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex items-center gap-3">
              <div
                className="h-10 w-10 rounded-full overflow-hidden ring-1 ring-slate-200/80 shadow-sm shrink-0"
                aria-hidden
              >
                <img
                  src={logoMark}
                  alt=""
                  className="h-full w-full object-cover object-center pointer-events-none"
                  draggable={false}
                />
              </div>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-slate-500 hover:text-slate-800 transition-colors">Recursos</a>
              <a href="#how-it-works" className="text-sm text-slate-500 hover:text-slate-800 transition-colors">Como Funciona</a>
              <a href="#pricing" className="text-sm text-slate-500 hover:text-slate-800 transition-colors">Planos</a>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
              >
                Entrar
              </button>
              <button
                onClick={() => navigate('/cadastro')}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
              >
                Começar Grátis
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 shadow-lg">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-600">Recursos</a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-600">Como Funciona</a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-600">Planos</a>
              <hr className="border-slate-100" />
              <button onClick={() => navigate('/login')} className="block w-full text-left py-2 text-slate-600">Entrar</button>
              <button
                onClick={() => navigate('/cadastro')}
                className="w-full py-3 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl"
              >
                Começar Grátis
              </button>
            </div>
          </div>
        )}
        </nav>
      </div>

      {/* Hero — padding compensa faixa promocional + navbar */}
      <section className="relative pt-44 pb-20 lg:pt-52 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-cyan-100/40 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-100/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-50 border border-cyan-100 rounded-full text-cyan-700 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              Revisão espaçada + gamificação
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
              Aprenda inglês de forma
              <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 bg-clip-text text-transparent"> inteligente</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
              Flash cards com repetição espaçada, jogos interativos e leitura guiada. 
              Tudo o que você precisa para dominar o inglês no seu ritmo.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/cadastro')}
                className="group w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl hover:shadow-xl hover:shadow-cyan-500/25 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Começar Grátis
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-slate-700 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 hover:shadow-lg transition-all duration-300"
              >
                Já tenho conta
              </button>
            </div>
          </div>

          {/* Hero visual — floating cards */}
          <div className="relative mt-16 lg:mt-24 max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-700/50">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <HeroCard front="to run" back="correr" color="cyan" />
                <HeroCard front="to eat" back="comer" color="blue" />
                <HeroCard front="to sleep" back="dormir" color="indigo" />
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-slate-400">Nível 3 · Revisão espaçada</span>
                <div className="flex gap-1">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-1.5 rounded-full bg-cyan-500" />
                  ))}
                  {[4, 5].map((i) => (
                    <div key={i} className="w-8 h-1.5 rounded-full bg-slate-700" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-12 border-y border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <Stat value="5+" label="Modos de estudo" />
            <Stat value="100%" label="Gratuito para começar" />
            <Stat value="5" label="Níveis Leitner" />
            <Stat value="24/7" label="Acesso em qualquer lugar" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Tudo para acelerar seu
              <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent"> aprendizado</span>
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Recursos pensados para quem quer aprender inglês de verdade, com ciência e diversão.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Brain className="w-6 h-6" />}
              color="cyan"
              title="Repetição Espaçada"
              description="Sistema Leitner com 5 níveis que garante que você revise na hora certa — sem esquecer nunca mais."
              videoUrl={VIDEOS.revisao}
              onOpenVideo={(title, url) => setVideoModal({ title, videoUrl: url })}
            />
            <FeatureCard
              icon={<Gamepad2 className="w-6 h-6" />}
              color="violet"
              title="Bricks Challenge"
              description="Monte frases tijolo por tijolo. Pratique gramática de forma interativa e divertida."
              videoUrl={VIDEOS.bricks}
              onOpenVideo={(title, url) => setVideoModal({ title, videoUrl: url })}
            />
            <FeatureCard
              icon={<Puzzle className="w-6 h-6" />}
              color="pink"
              title="Pairs Challenge"
              description="Jogo da memória com palavras e imagens. Treine vocabulário enquanto se diverte."
              videoUrl={VIDEOS.pairs}
              onOpenVideo={(title, url) => setVideoModal({ title, videoUrl: url })}
            />
            <FeatureCard
              icon={<BookOpen className="w-6 h-6" />}
              color="indigo"
              title="Graded Readers"
              description="Leitura guiada por nível com tradução instantânea. Do A1 ao B2 no seu ritmo."
              videoUrl={VIDEOS.readers}
              onOpenVideo={(title, url) => setVideoModal({ title, videoUrl: url })}
            />
            <FeatureCard
              icon={<Layers className="w-6 h-6" />}
              color="emerald"
              title="Import / Export"
              description="Importe e exporte seus cards em JSON simples. Crie decks no ChatGPT e importe em segundos."
            />
            <FeatureCard
              icon={<Bot className="w-6 h-6" />}
              color="cyan"
              title="AI Conversation"
              description="Converse com um avatar inteligente que simula situações reais. Receba dicas e correções instantâneas."
              comingSoon
            />
            <FeatureCard
              icon={<Mic className="w-6 h-6" />}
              color="amber"
              title="Karaoke Mode"
              description="Cante músicas em inglês e receba feedback de pronúncia em tempo real."
              comingSoon
            />
          </div>
        </div>
      </section>

      {/* Seção destaque: Repetição Espaçada (gratuita) */}
      <section className="py-20 lg:py-32 bg-gradient-to-b from-white to-cyan-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Texto */}
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider rounded-full mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                100% Gratuito
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
                Revisão Espaçada com
                <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent"> Sistema Leitner</span>
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed mb-6">
                Organize seus cards em grupos temáticos e deixe o algoritmo cuidar do resto. 
                Cada card passa por 5 níveis de memorização — do iniciante ao dominado.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Crie grupos ilimitados e organize por tema',
                  '5 níveis de revisão com intervalos crescentes',
                  'O sistema avisa quando é hora de revisar',
                  'Importe cards prontos ou crie os seus',
                  'Sincronização na nuvem entre dispositivos',
                ].map((text) => (
                  <li key={text} className="flex items-center gap-3 text-slate-600">
                    <div className="w-5 h-5 rounded-full bg-cyan-100 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-cyan-600" />
                    </div>
                    <span className="text-sm">{text}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate('/cadastro')}
                className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 inline-flex items-center gap-2"
              >
                Começar Grátis
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Vídeo */}
            <div
              className="relative group cursor-pointer"
              onClick={() => setVideoModal({ title: 'Revisão Espaçada & Grupos', videoUrl: VIDEOS.revisao })}
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl shadow-cyan-500/10 border border-slate-200">
                <video
                  src={VIDEOS.revisao}
                  muted
                  loop
                  autoPlay
                  playsInline
                  className="w-full aspect-video object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-2xl transition-colors flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/90 shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="w-8 h-8 text-cyan-600 ml-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 lg:py-32 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Como funciona
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Em 3 passos simples você já está aprendendo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <Step
              number="1"
              title="Crie seus cards"
              description="Adicione palavras e frases em português e inglês. Organize em grupos temáticos."
            />
            <Step
              number="2"
              title="Estude no seu ritmo"
              description="O sistema de repetição espaçada agenda automaticamente a revisão ideal para cada card."
            />
            <Step
              number="3"
              title="Jogue e evolua"
              description="Use os modos de jogo para fixar o conteúdo. Bricks, Memory, Karaoke e muito mais."
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Planos simples e
              <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent"> transparentes</span>
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Comece de graça. Faça upgrade quando quiser desbloquear tudo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-800">Grátis</h3>
                <p className="text-slate-400 text-sm mt-1">Para quem está começando</p>
              </div>
              <div className="mb-8">
                <span className="text-4xl font-bold text-slate-800">R$ 0</span>
                <span className="text-slate-400 text-sm">/mês</span>
              </div>
              <ul className="space-y-3 mb-8">
                <PricingItem text="Flash Cards ilimitados" />
                <PricingItem text="Grupos organizados" />
                <PricingItem text="Repetição espaçada (Leitner)" />
                <PricingItem text="Modo Play" />
                <PricingItem text="Import / Export" />
                <PricingItem text="Sincronização na nuvem" />
              </ul>
              <button
                onClick={() => navigate('/cadastro')}
                className="w-full py-3 text-sm font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
              >
                Criar conta grátis
              </button>
            </div>

            {/* Pro */}
            <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 shadow-xl border border-slate-700">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-4 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold rounded-full">
                  MAIS POPULAR
                </span>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white">Pro</h3>
                <p className="text-slate-400 text-sm mt-1">Para quem quer evoluir rápido</p>
              </div>
              <div className="mb-8">
                <span className="text-4xl font-bold text-white">R$ 19,99</span>
                <span className="text-slate-400 text-sm">/mês</span>
                <p className="text-cyan-400 text-xs mt-1">ou R$ 179/ano (25% off)</p>
              </div>
              <ul className="space-y-3 mb-8">
                <PricingItem text="Tudo do plano Grátis" light />
                <PricingItem text="Bricks Challenge" light />
                <PricingItem text="Pairs Challenge" light />
                <PricingItem text="Karaoke Mode" light />
                <PricingItem text="Graded Readers" light />
                <PricingItem text="Suporte prioritário" light />
              </ul>
              <button
                onClick={() => navigate('/cadastro')}
                className="w-full py-3 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
              >
                Começar Grátis
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Pronto para dominar o inglês?
          </h2>
          <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto">
            Junte-se a quem já está aprendendo de forma inteligente. Comece agora, é grátis.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/cadastro')}
              className="group w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl hover:shadow-xl hover:shadow-cyan-500/25 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Criar conta grátis
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white border border-slate-600 rounded-2xl hover:border-slate-500 hover:bg-white/5 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5 text-green-400" />
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6 text-sm text-slate-400">
                <a href="#features" className="hover:text-slate-600 transition-colors">Recursos</a>
                <a href="#pricing" className="hover:text-slate-600 transition-colors">Planos</a>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="hover:text-slate-600 transition-colors">Contato</a>
              </div>
              <div className="flex items-center gap-6 text-sm text-slate-400">
                <a href="/termos" className="hover:text-slate-600 transition-colors">Termos de Uso</a>
                <a href="/privacidade" className="hover:text-slate-600 transition-colors">Política de Privacidade</a>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3 text-center">
              <p className="text-xs text-slate-400">
                &copy; {new Date().getFullYear()} Play Flash Cards. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal de vídeo (hover no desktop / clique no mobile) */}
      {videoModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setVideoModal(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Assistir demonstração"
        >
          <div
            className="relative w-full max-w-3xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
              <h3 className="text-lg font-semibold text-white truncate pr-2">{videoModal.title}</h3>
              <button
                type="button"
                onClick={() => setVideoModal(null)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video bg-black">
              <video
                src={videoModal.videoUrl}
                controls
                autoPlay
                className="w-full h-full"
                onEnded={() => {}}
              />
            </div>
            <p className="px-4 py-2 text-sm text-slate-400 text-center">
              Veja como funciona na prática
            </p>
          </div>
        </div>
      )}

      {/* WhatsApp FAB */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 rounded-full shadow-lg shadow-green-500/30 flex items-center justify-center hover:bg-green-600 hover:scale-110 transition-all duration-300 group"
        aria-label="Falar no WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7 text-white fill-current">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        <span className="absolute -top-10 right-0 bg-slate-800 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Fale conosco
        </span>
      </a>
    </div>
  );
}

/* ────────── Sub-components ────────── */

function HeroCard({ front, back, color }: { front: string; back: string; color: string }) {
  const gradients: Record<string, string> = {
    cyan: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30',
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
    indigo: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/30',
  };

  const textColors: Record<string, string> = {
    cyan: 'text-cyan-400',
    blue: 'text-blue-400',
    indigo: 'text-indigo-400',
  };

  return (
    <div className={`bg-gradient-to-br ${gradients[color]} border rounded-2xl p-5 text-center`}>
      <p className={`text-lg font-bold ${textColors[color]}`}>{front}</p>
      <div className="w-8 h-px bg-slate-600 mx-auto my-2.5" />
      <p className="text-slate-400 text-sm">{back}</p>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
        {value}
      </p>
      <p className="text-sm text-slate-500 mt-1">{label}</p>
    </div>
  );
}

function FeatureCard({
  icon,
  color,
  title,
  description,
  comingSoon = false,
  videoUrl,
  onOpenVideo,
}: {
  icon: React.ReactNode;
  color: string;
  title: string;
  description: string;
  comingSoon?: boolean;
  videoUrl?: string;
  onOpenVideo?: (title: string, videoUrl: string) => void;
}) {
  const [hoverTimer, setHoverTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const bgColors: Record<string, string> = {
    cyan: 'bg-cyan-50 text-cyan-600',
    violet: 'bg-violet-50 text-violet-600',
    pink: 'bg-pink-50 text-pink-600',
    amber: 'bg-amber-50 text-amber-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
  };

  const canShowVideo = !comingSoon && videoUrl && onOpenVideo;

  const handleOpenVideo = () => {
    if (canShowVideo) onOpenVideo!(title, videoUrl!);
  };

  const handleMouseEnter = () => {
    if (!canShowVideo) return;
    const t = setTimeout(handleOpenVideo, 400);
    setHoverTimer(t);
  };

  const handleMouseLeave = () => {
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      setHoverTimer(null);
    }
  };

  return (
    <div
      role={canShowVideo ? 'button' : undefined}
      tabIndex={canShowVideo ? 0 : undefined}
      onClick={canShowVideo ? handleOpenVideo : undefined}
      onKeyDown={canShowVideo ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleOpenVideo(); } } : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative bg-white rounded-2xl p-6 border transition-all duration-300 ${
        comingSoon ? 'border-dashed border-slate-200' : 'border-slate-100 hover:border-slate-200 hover:shadow-lg'
      } ${canShowVideo ? 'cursor-pointer' : ''}`}
    >
      {comingSoon && (
        <div className="absolute -top-2.5 right-4 inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider rounded-full border border-amber-200">
          <Construction className="w-3 h-3" />
          Em desenvolvimento
        </div>
      )}
      {canShowVideo && (
        <p className="absolute top-3 right-3 text-[10px] font-medium text-slate-400 group-hover:text-cyan-600 transition-colors">
          Ver vídeo
        </p>
      )}
      <div className={`w-12 h-12 rounded-xl ${bgColors[color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${comingSoon ? 'opacity-60' : ''}`}>
        {icon}
      </div>
      <h3 className={`text-lg font-semibold mb-2 ${comingSoon ? 'text-slate-500' : 'text-slate-800'}`}>{title}</h3>
      <p className={`text-sm leading-relaxed ${comingSoon ? 'text-slate-400' : 'text-slate-500'}`}>{description}</p>
    </div>
  );
}

function Step({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-xl font-bold flex items-center justify-center mx-auto mb-5 shadow-lg shadow-cyan-500/20">
        {number}
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">{description}</p>
    </div>
  );
}

function PricingItem({ text, light = false }: { text: string; light?: boolean }) {
  return (
    <li className="flex items-center gap-2.5">
      <Check className={`w-4 h-4 flex-shrink-0 ${light ? 'text-cyan-400' : 'text-cyan-600'}`} />
      <span className={`text-sm ${light ? 'text-slate-300' : 'text-slate-600'}`}>{text}</span>
    </li>
  );
}
