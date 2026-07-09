import { useState } from 'react';
import {
  Download, Share, SquarePlus, CheckCircle2, Smartphone,
  MoreVertical, Chrome, Sparkles, WifiOff, Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import { usePwaInstall } from '../hooks/usePwaInstall';
import logoMark from '../assets/logotipo-educacional-raio-tablet.png';

function Benefit({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/70 px-4 py-3">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
    </div>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-bold text-white">
        {n}
      </span>
      <span className="pt-0.5 text-sm text-slate-700">{children}</span>
    </li>
  );
}

export function InstallApp() {
  const { isInstalled, canPrompt, platform, isIosSafari, promptInstall } = usePwaInstall();
  const [busy, setBusy] = useState(false);

  const handleInstall = async () => {
    setBusy(true);
    try {
      const outcome = await promptInstall();
      if (outcome === 'accepted') {
        toast.success('App instalado! Procure o ícone na sua tela inicial.');
      } else if (outcome === 'dismissed') {
        toast.message('Instalação cancelada. Você pode instalar quando quiser por aqui.');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden">
        {/* Cabeçalho */}
        <div className="relative bg-gradient-to-br from-cyan-500 to-blue-600 px-6 py-7 text-white">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-white/15 ring-1 ring-white/30 shadow-lg">
              <img src={logoMark} alt="" className="h-full w-full object-cover" draggable={false} />
            </div>
            <div>
              <h2 className="text-xl font-bold leading-tight">Instalar o app</h2>
              <p className="text-sm text-white/85">
                Tenha o Flash Cards na tela inicial do seu celular, como um aplicativo.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Estado: já instalado */}
          {isInstalled ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-8 text-center">
              <CheckCircle2 className="h-12 w-12 text-emerald-500" />
              <p className="text-lg font-semibold text-emerald-800">App já instalado 🎉</p>
              <p className="text-sm text-emerald-700">
                Você já está usando o Flash Cards instalado. Bons estudos!
              </p>
            </div>
          ) : (
            <>
              {/* Benefícios */}
              <div className="grid gap-3">
                <Benefit
                  icon={<Zap className="h-4 w-4" />}
                  title="Acesso rápido"
                  desc="Abre direto pelo ícone, sem digitar o endereço."
                />
                <Benefit
                  icon={<Smartphone className="h-4 w-4" />}
                  title="Tela cheia"
                  desc="Roda como um app de verdade, sem a barra do navegador."
                />
                <Benefit
                  icon={<WifiOff className="h-4 w-4" />}
                  title="Abre offline"
                  desc="Continua abrindo mesmo com a internet instável."
                />
              </div>

              {/* Ação principal — Android / desktop com prompt nativo */}
              {canPrompt && (
                <button
                  type="button"
                  onClick={handleInstall}
                  disabled={busy}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-60 transition-opacity shadow-lg shadow-cyan-500/25"
                >
                  <Download className="h-5 w-5" />
                  {busy ? 'Instalando…' : 'Instalar agora'}
                </button>
              )}

              {/* iOS Safari — passo a passo manual */}
              {platform === 'ios' && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
                  <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <Share className="h-4 w-4 text-cyan-600" />
                    No iPhone/iPad (Safari):
                  </p>
                  <ol className="space-y-3">
                    <Step n={1}>
                      Toque no botão <strong>Compartilhar</strong>{' '}
                      <Share className="inline h-4 w-4 text-cyan-600 align-text-bottom" /> na barra do Safari.
                    </Step>
                    <Step n={2}>
                      Role a lista e toque em <strong>Adicionar à Tela de Início</strong>{' '}
                      <SquarePlus className="inline h-4 w-4 text-cyan-600 align-text-bottom" />.
                    </Step>
                    <Step n={3}>
                      Confirme em <strong>Adicionar</strong>. Pronto, o ícone aparece na tela inicial!
                    </Step>
                  </ol>
                  {!isIosSafari && (
                    <p className="mt-4 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800">
                      No iPhone, a instalação só funciona pelo <strong>Safari</strong>. Abra este site no Safari
                      para adicionar à tela inicial.
                    </p>
                  )}
                </div>
              )}

              {/* Android sem prompt disponível ainda — instruções pelo menu do Chrome */}
              {platform === 'android' && !canPrompt && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
                  <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <Chrome className="h-4 w-4 text-cyan-600" />
                    No Android (Chrome):
                  </p>
                  <ol className="space-y-3">
                    <Step n={1}>
                      Toque no menu <MoreVertical className="inline h-4 w-4 text-cyan-600 align-text-bottom" />{' '}
                      (três pontinhos) no canto superior.
                    </Step>
                    <Step n={2}>
                      Toque em <strong>Instalar app</strong> ou <strong>Adicionar à tela inicial</strong>.
                    </Step>
                    <Step n={3}>Confirme e pronto — o ícone aparece na sua tela inicial!</Step>
                  </ol>
                </div>
              )}

              {/* Desktop / outros navegadores sem prompt */}
              {platform !== 'ios' && platform !== 'android' && !canPrompt && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
                  <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <Sparkles className="h-4 w-4 text-cyan-600" />
                    Como instalar
                  </p>
                  <p className="text-sm text-slate-600">
                    Abra este site no <strong>Chrome</strong> ou <strong>Edge</strong> e procure o ícone de
                    instalar <Download className="inline h-4 w-4 text-cyan-600 align-text-bottom" /> na barra de
                    endereço, ou acesse pelo celular para adicionar à tela inicial.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
