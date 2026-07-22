import { RefreshCw, Folder, CheckCircle2 } from 'lucide-react';
import { useStore } from '../store/useStore';

// Fundo em camadas usando a cor de acento do tema escolhido.
const heroBackground = `
  radial-gradient(ellipse 70% 70% at 100% 0%, rgba(255, 255, 255, 0.18) 0%, transparent 55%),
  radial-gradient(ellipse 80% 80% at 0% 100%, rgba(0, 0, 0, 0.16) 0%, transparent 55%),
  linear-gradient(135deg, var(--accent-strong) 0%, var(--accent) 52%, var(--accent-strong) 100%)
`;
const heroShadow = `
  inset 0 1px 0 rgba(255, 255, 255, 0.14),
  inset 0 0 0 1px rgba(255, 255, 255, 0.06),
  0 24px 60px -20px rgba(15, 23, 42, 0.40),
  0 8px 32px -12px rgba(15, 23, 42, 0.28)
`;
const reviewBtnGradient =
  'bg-gradient-to-br from-[var(--accent-strong)] via-[var(--accent)] to-[var(--accent-strong)] shadow-lg shadow-slate-900/10 ring-2 ring-[var(--accent-border)] ring-offset-2 ring-offset-white/10 shadow-[inset_0_2px_0_0_rgba(255,255,255,0.35)]';

export function ReviewHub() {
  const { getGroupsWithReviewCount, getTotalCardsForReview, startPlayMode } = useStore();
  const groups = getGroupsWithReviewCount();
  const totalReview = getTotalCardsForReview();
  const hasDue = totalReview > 0;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white"
        style={{ background: heroBackground, boxShadow: heroShadow }}
      >
        {/* Glow orbs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-20 h-80 w-80 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.22) 0%, transparent 60%)', filter: 'blur(50px)' }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,0,0,0.20) 0%, transparent 60%)', filter: 'blur(45px)' }}
        />

        <div className="relative z-10 flex flex-col items-center">
          {/* Eyebrow */}
          <div className="mb-4 flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/15 backdrop-blur-sm">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/85">
              Sessão de hoje
            </span>
          </div>

          {hasDue ? (
            <>
              <button
                type="button"
                onClick={() => startPlayMode()}
                className={`relative flex h-16 w-full max-w-sm flex-col items-center justify-center gap-0.5 overflow-hidden rounded-2xl text-white transition-transform active:scale-[0.98] ${reviewBtnGradient}`}
              >
                <RefreshCw className="relative z-[1] h-7 w-7 shrink-0" strokeWidth={2.25} />
                <span className="relative z-[1] text-[11px] font-black uppercase leading-tight tracking-[0.2em]">
                  Revisar tudo
                </span>
              </button>
              <p className="mt-4 text-center text-sm text-white/85">
                <span className="text-2xl font-bold tracking-tight text-white tabular-nums">{totalReview}</span>
                <span className="ml-1.5 font-medium">cards aguardando você</span>
              </p>
            </>
          ) : (
            <div className="flex flex-col items-center py-2 text-center">
              <CheckCircle2 className="h-12 w-12 text-emerald-300" />
              <p className="mt-2 text-lg font-bold">Você está em dia! 🎉</p>
              <p className="text-sm text-white/85">
                Nenhum card pendente agora. Você pode praticar um grupo abaixo.
              </p>
            </div>
          )}

          {/* Seletor de grupo */}
          {groups.length > 0 && (
            <div className="mt-5 w-full border-t border-white/15 pt-4">
              <p className="mb-2 text-center text-[11px] font-medium uppercase tracking-wider text-white/70">
                {hasDue ? 'Ou escolha um grupo específico' : 'Praticar um grupo'}
              </p>
              <div className="max-h-[min(360px,50vh)] overflow-y-auto overscroll-contain pr-1 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.35)_transparent]">
                <div className="flex flex-col gap-2">
                  {groups.map(({ group, reviewCount, totalCards }) => (
                    <button
                      key={group.id}
                      type="button"
                      onClick={() => startPlayMode(group.id)}
                      className="flex w-full items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/[0.08] px-3.5 py-3 text-left text-sm backdrop-blur-sm transition-all hover:border-white/25 hover:bg-white/[0.14]"
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <Folder className="h-4 w-4 shrink-0 text-white/70" />
                        <span className="truncate font-medium">{group.name}</span>
                      </span>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold tabular-nums ring-1 ring-white/10 ${
                          reviewCount > 0 ? 'bg-white/20' : 'bg-white/10 text-white/70'
                        }`}
                        title={reviewCount > 0 ? `${reviewCount} para revisar` : `${totalCards} cards`}
                      >
                        {reviewCount > 0 ? reviewCount : totalCards}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
