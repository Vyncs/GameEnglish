import { useState } from 'react';
import { useStore } from '../store/useStore';
import { ImportExport } from './ImportExport';
import {
  BookOpen,
  Clock,
  Trophy,
  Folder,
  Plus,
  Download,
  Upload,
  Sparkles,
  Target,
  Calendar,
  Gamepad2,
  Play,
  ArrowRight,
  Check,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export function Home() {
  const {
    groups,
    cards,
    getGroupsWithReviewCount,
    getTotalCardsForReview,
    startPlayMode,
    addGroup,
    selectGroup,
  } = useStore();

  const [showImportExport, setShowImportExport] = useState(false);
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  const groupsWithReview = getGroupsWithReviewCount();
  const totalReviewCount = getTotalCardsForReview();
  const groupsWithPendingReview = groupsWithReview.filter((g) => g.reviewCount > 0);

  const handleAddGroup = () => {
    if (newGroupName.trim()) {
      addGroup(newGroupName.trim());
      setNewGroupName('');
      setIsAddingGroup(false);
    }
  };

  // Calcular estatísticas
  const totalCards = cards.length;
  const avgLevelNum =
    totalCards > 0 ? cards.reduce((acc, c) => acc + c.level, 0) / totalCards : 0;
  const avgLevel = totalCards > 0 ? avgLevelNum.toFixed(1) : '0';
  const masteredCards = cards.filter((c) => c.level === 5).length;
  const masteredPct = totalCards > 0 ? Math.round((masteredCards / totalCards) * 100) : 0;

  // Cards revisados nas últimas 24h — feed de retenção
  const reviewedToday = cards.filter((c) => {
    if (!c.lastReviewed) return false;
    const last = new Date(c.lastReviewed).getTime();
    return Date.now() - last < 24 * 60 * 60 * 1000;
  }).length;

  /** Mesmo gradiente "com revisões" do FAB do menu inferior (mobile). */
  const playFabGradient =
    'bg-gradient-to-br from-violet-600 via-fuchsia-500 to-orange-500 shadow-lg shadow-fuchsia-500/30 ring-2 ring-violet-400/35 ring-offset-2 ring-offset-white/80 shadow-[inset_0_2px_0_0_rgba(255,255,255,0.35)]';

  // Estilo do hero — gradiente sofisticado em camadas + sombras de produto premium
  const heroBackground = `
    radial-gradient(ellipse 70% 70% at 100% 0%, rgba(244, 114, 182, 0.22) 0%, transparent 55%),
    radial-gradient(ellipse 80% 80% at 0% 100%, rgba(56, 189, 248, 0.18) 0%, transparent 55%),
    linear-gradient(135deg, #6d28d9 0%, #5b21b6 38%, #4f46e5 72%, #4338ca 100%)
  `;
  const heroShadow = `
    inset 0 1px 0 rgba(255, 255, 255, 0.14),
    inset 0 0 0 1px rgba(255, 255, 255, 0.06),
    0 24px 60px -20px rgba(91, 33, 182, 0.55),
    0 8px 32px -12px rgba(67, 56, 202, 0.40)
  `;

  return (
    <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto flex flex-col">
        {/* HERO — Sessão de hoje */}
        {totalReviewCount > 0 && (
          <div className="mb-8 animate-fade-in order-1 lg:order-1">
            <div
              className="relative rounded-3xl p-6 sm:p-8 text-white overflow-hidden"
              style={{ background: heroBackground, boxShadow: heroShadow }}
            >
              {/* Grain texture overlay (sutil, ~5% opacidade) */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
                style={{
                  backgroundImage:
                    'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'160\' height=\'160\'><filter id=\'n\'><feTurbulence baseFrequency=\'0.9\' numOctaves=\'2\' seed=\'4\'/></filter><rect width=\'160\' height=\'160\' filter=\'url(%23n)\' opacity=\'0.6\'/></svg>")',
                  backgroundSize: '160px 160px',
                }}
              />
              {/* Glow orbs — mais refinados que os "blur 3xl" anteriores */}
              <div
                aria-hidden
                className="pointer-events-none absolute -top-32 -right-20 w-80 h-80 rounded-full"
                style={{
                  background:
                    'radial-gradient(circle, rgba(244, 114, 182, 0.32) 0%, transparent 60%)',
                  filter: 'blur(50px)',
                }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-24 -left-20 w-72 h-72 rounded-full"
                style={{
                  background:
                    'radial-gradient(circle, rgba(99, 102, 241, 0.42) 0%, transparent 60%)',
                  filter: 'blur(45px)',
                }}
              />
              {/* Linha sutil de "shimmer" no topo */}
              <div
                aria-hidden
                className="pointer-events-none absolute top-0 left-1/4 right-1/4 h-px"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                }}
              />

              {/* Mobile: FAB compacto + texto + scroll de grupos */}
              <div className="relative z-10 lg:hidden flex flex-col items-center">
                {/* Eyebrow + streak */}
                <div className="mb-4 flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/15 backdrop-blur-sm">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-100">
                    Sessão de hoje
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => startPlayMode()}
                  className={`relative flex h-16 w-full max-w-[260px] flex-col items-center justify-center gap-0.5 rounded-2xl text-white transition-transform active:scale-[0.98] overflow-hidden ${playFabGradient} before:pointer-events-none before:absolute before:inset-x-2 before:top-1.5 before:h-[42%] before:rounded-t-xl before:bg-gradient-to-b before:from-white/30 before:to-transparent`}
                >
                  <Gamepad2 className="relative z-[1] h-7 w-7 shrink-0" strokeWidth={2.25} />
                  <span className="relative z-[1] text-[11px] font-black uppercase tracking-[0.2em] leading-tight">
                    Jogar agora
                  </span>
                </button>

                <p className="mt-4 text-center text-sm text-violet-100">
                  <span className="text-2xl font-bold tracking-tight text-white tabular-nums">
                    {totalReviewCount}
                  </span>
                  <span className="ml-1.5 font-medium">cards aguardando você</span>
                </p>

                {reviewedToday > 0 && (
                  <p className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-violet-200">
                    <TrendingUp className="h-3 w-3" />
                    {reviewedToday} revisados nas últimas 24h
                  </p>
                )}

                {groupsWithPendingReview.length > 0 && (
                  <div className="mt-5 w-full border-t border-white/15 pt-4">
                    <p className="mb-2 text-center text-[11px] font-medium uppercase tracking-wider text-violet-200">
                      Ou escolha um grupo específico
                    </p>
                    <div className="max-h-[min(220px,38vh)] overflow-y-auto overscroll-contain pr-1 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.35)_transparent]">
                      <div className="flex flex-col gap-2">
                        {groupsWithPendingReview.map(({ group, reviewCount }) => (
                          <button
                            key={group.id}
                            type="button"
                            onClick={() => startPlayMode(group.id)}
                            className="group/chip flex w-full shrink-0 items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/[0.08] px-3 py-2.5 text-left text-sm backdrop-blur-sm transition-all hover:border-white/25 hover:bg-white/[0.14]"
                          >
                            <span className="flex min-w-0 items-center gap-2">
                              <Folder className="h-4 w-4 shrink-0 text-violet-200" />
                              <span className="truncate font-medium">{group.name}</span>
                            </span>
                            <span className="shrink-0 rounded-full bg-white/15 px-2 py-0.5 text-xs font-bold tabular-nums ring-1 ring-white/10">
                              {reviewCount}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Desktop: layout horizontal premium */}
              <div className="relative z-10 hidden lg:block">
                <div className="flex flex-wrap items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                    {/* Ícone com profundidade */}
                    <div
                      className="relative grid h-16 w-16 place-items-center rounded-2xl"
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.08) 100%)',
                        boxShadow:
                          'inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(0,0,0,0.1), 0 6px 16px -4px rgba(0,0,0,0.25)',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      <Gamepad2 className="h-9 w-9" strokeWidth={2} />
                    </div>
                    <div>
                      {/* Eyebrow com pulse de "ao vivo" */}
                      <div className="mb-1.5 flex items-center gap-2">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        </span>
                        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-100">
                          Sessão de hoje
                        </span>
                      </div>
                      <h2 className="mb-1 text-3xl font-bold tracking-tight">Hora de Jogar!</h2>
                      <p className="text-base text-violet-100/90">
                        <span className="text-lg font-semibold text-white tabular-nums">
                          {totalReviewCount}
                        </span>{' '}
                        cards aguardando sua revisão
                        {reviewedToday > 0 && (
                          <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium ring-1 ring-white/10">
                            <TrendingUp className="h-3 w-3" />
                            {reviewedToday} hoje
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* CTA premium — sombra em camadas, gradient interno, hover refinado */}
                  <button
                    type="button"
                    onClick={() => startPlayMode()}
                    className="group relative flex items-center gap-3 rounded-2xl px-7 py-3.5 text-base font-semibold text-violet-700 transition-all duration-200 will-change-transform hover:-translate-y-0.5 active:translate-y-0"
                    style={{
                      background:
                        'linear-gradient(180deg, #ffffff 0%, #faf5ff 100%)',
                      boxShadow: `
                        inset 0 1px 0 rgba(255, 255, 255, 1),
                        inset 0 0 0 1px rgba(124, 58, 237, 0.08),
                        0 1px 2px rgba(67, 56, 202, 0.12),
                        0 8px 24px -8px rgba(67, 56, 202, 0.35),
                        0 16px 40px -12px rgba(124, 58, 237, 0.30)
                      `,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = `
                        inset 0 1px 0 rgba(255,255,255,1),
                        inset 0 0 0 1px rgba(124,58,237,0.12),
                        0 1px 2px rgba(67,56,202,0.15),
                        0 14px 32px -8px rgba(67,56,202,0.50),
                        0 24px 56px -12px rgba(124,58,237,0.40)`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = `
                        inset 0 1px 0 rgba(255,255,255,1),
                        inset 0 0 0 1px rgba(124,58,237,0.08),
                        0 1px 2px rgba(67,56,202,0.12),
                        0 8px 24px -8px rgba(67,56,202,0.35),
                        0 16px 40px -12px rgba(124,58,237,0.30)`;
                    }}
                  >
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-700 text-white shadow-md shadow-violet-500/35 transition-transform duration-200 group-hover:scale-110 group-active:scale-95">
                      <Play className="h-3.5 w-3.5 fill-current" strokeWidth={0} />
                    </span>
                    <span className="tracking-tight">Jogar Agora</span>
                    <ArrowRight className="h-4 w-4 -ml-0.5 opacity-50 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </button>
                </div>

                {groupsWithPendingReview.length > 0 && (
                  <div className="mt-8 border-t border-white/15 pt-6">
                    <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-violet-200/80">
                      Ou escolha um grupo específico
                    </p>
                    <div className="max-h-[min(280px,40vh)] overflow-y-auto overscroll-contain pr-1 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.35)_transparent]">
                      <div className="flex flex-wrap gap-2.5">
                        {groupsWithPendingReview.map(({ group, reviewCount }) => (
                          <button
                            key={group.id}
                            type="button"
                            onClick={() => startPlayMode(group.id)}
                            className="group/chip flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.08] px-4 py-2.5 backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.14] hover:shadow-lg hover:shadow-violet-900/20"
                          >
                            <Folder className="h-4 w-4 text-violet-200" />
                            <span className="text-sm font-medium">{group.name}</span>
                            <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs font-bold tabular-nums ring-1 ring-white/10">
                              {reviewCount}
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
        )}

        {/* KPIs — sistema de progresso, não dashboard administrativo */}
        <div
          className={`mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 ${
            totalReviewCount > 0 ? 'order-2 lg:order-2' : 'order-1 lg:order-1'
          }`}
        >
          <KpiCard
            icon={<BookOpen className="h-4 w-4" strokeWidth={2.4} />}
            iconTint="bg-cyan-50 text-cyan-600 ring-cyan-100"
            label="Total de Cards"
            value={totalCards}
            visual={
              totalCards > 0 ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-cyan-600">
                  <BookOpen className="h-3 w-3" /> biblioteca
                </span>
              ) : (
                <span className="text-[10px] font-medium text-slate-400">
                  comece criando um grupo
                </span>
              )
            }
          />

          <KpiCard
            icon={<Clock className="h-4 w-4" strokeWidth={2.4} />}
            iconTint="bg-amber-50 text-amber-600 ring-amber-100"
            label="Para Revisar"
            value={totalReviewCount}
            valueColorClass={totalReviewCount > 0 ? 'text-amber-600' : 'text-slate-900'}
            visual={
              totalReviewCount > 0 ? (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-amber-600">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
                  </span>
                  pronto agora
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                  <Check className="h-3 w-3" /> tudo em dia
                </span>
              )
            }
          />

          <KpiCard
            icon={<Target className="h-4 w-4" strokeWidth={2.4} />}
            iconTint="bg-violet-50 text-violet-600 ring-violet-100"
            label="Nível Médio"
            value={avgLevel}
            suffix={<span className="text-base font-medium text-slate-400">/ 5</span>}
            visual={<LevelDots value={avgLevelNum} />}
          />

          <KpiCard
            icon={<Trophy className="h-4 w-4" strokeWidth={2.4} />}
            iconTint="bg-emerald-50 text-emerald-600 ring-emerald-100"
            label="Dominados"
            value={masteredCards}
            valueColorClass={masteredCards > 0 ? 'text-emerald-600' : 'text-slate-900'}
            visual={<MasteryRatio pct={masteredPct} />}
          />
        </div>

        {/* MEUS GRUPOS — mapa de evolução */}
        <div
          className={`mb-8 ${
            totalReviewCount > 0 ? 'order-3 lg:order-3' : 'order-2 lg:order-3'
          }`}
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100/80 ring-1 ring-slate-200/80">
                <Folder className="h-4 w-4 text-slate-600" strokeWidth={2.4} />
              </div>
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                  Meus Grupos
                </h2>
                <p className="text-xs text-slate-500">
                  {groups.length} {groups.length === 1 ? 'coleção' : 'coleções'}
                  {totalCards > 0 && (
                    <>
                      <span className="text-slate-300"> · </span>
                      {totalCards} {totalCards === 1 ? 'card' : 'cards'} no total
                    </>
                  )}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsAddingGroup(true)}
              className="group flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 active:translate-y-0"
            >
              <Plus className="h-3.5 w-3.5 transition-transform group-hover:rotate-90" />
              Novo Grupo
            </button>
          </div>

          {/* Form novo grupo */}
          {isAddingGroup && (
            <div className="mb-4 animate-fade-in rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Nome do grupo..."
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition-all placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-100"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddGroup();
                    if (e.key === 'Escape') setIsAddingGroup(false);
                  }}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddGroup}
                    disabled={!newGroupName.trim()}
                    className="flex-1 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-violet-700 hover:shadow-md hover:shadow-violet-500/30 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none sm:flex-none"
                  >
                    Criar
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingGroup(false);
                      setNewGroupName('');
                    }}
                    className="flex-1 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-slate-200 sm:flex-none"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Lista */}
          {groups.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-14 text-center">
              <div
                className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl"
                style={{
                  background:
                    'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
                  boxShadow: 'inset 0 0 0 1px rgba(124, 58, 237, 0.10)',
                }}
              >
                <Folder className="h-7 w-7 text-violet-500" strokeWidth={2} />
              </div>
              <h3 className="mb-1.5 text-base font-semibold tracking-tight text-slate-900">
                Comece sua biblioteca
              </h3>
              <p className="mx-auto mb-5 max-w-xs text-sm text-slate-500">
                Crie seu primeiro grupo para começar a adicionar flash cards e construir seu progresso.
              </p>
              <button
                onClick={() => setIsAddingGroup(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-violet-700 hover:shadow-lg hover:shadow-violet-500/30"
              >
                <Plus className="h-4 w-4" />
                Criar Primeiro Grupo
              </button>
            </div>
          ) : (
            <div className="max-h-[min(320px,48vh)] overflow-y-auto overscroll-contain pr-1 [scrollbar-width:thin] [scrollbar-color:rgba(148,163,184,0.5)_transparent] md:max-h-[min(380px,52vh)] lg:max-h-[min(460px,55vh)]">
              <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
                {groupsWithReview.map(({ group, reviewCount, totalCards: gTotal }, index) => {
                  const groupCards = cards.filter((c) => c.groupId === group.id);
                  const gAvg =
                    groupCards.length > 0
                      ? groupCards.reduce((a, c) => a + c.level, 0) / groupCards.length
                      : 0;
                  const gMastered = groupCards.filter((c) => c.level === 5).length;
                  const masteryPct = (gAvg / 5) * 100;
                  return (
                    <button
                      key={group.id}
                      onClick={() => selectGroup(group.id)}
                      className="group relative animate-fade-in overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-5 text-left transition-all duration-200 will-change-transform hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_18px_36px_-12px_rgba(124,58,237,0.20)]"
                      style={{
                        animationDelay: `${index * 50}ms`,
                        boxShadow:
                          '0 1px 2px rgba(15, 23, 42, 0.04), 0 1px 0 rgba(255, 255, 255, 1) inset',
                      }}
                    >
                      {/* Faixa colorida no topo (visível só no hover) */}
                      <div
                        aria-hidden
                        className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-400 transition-transform duration-300 group-hover:scale-x-100"
                      />

                      <div className="mb-3.5 flex items-start justify-between gap-2">
                        <div
                          className="grid h-10 w-10 place-items-center rounded-xl transition-all duration-200 group-hover:scale-105"
                          style={{
                            background:
                              'linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)',
                            boxShadow: 'inset 0 0 0 1px rgba(8, 145, 178, 0.10)',
                          }}
                        >
                          <Folder
                            className="h-5 w-5 text-cyan-600 transition-colors group-hover:text-violet-600"
                            strokeWidth={2.2}
                          />
                        </div>

                        {reviewCount > 0 ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/80 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
                            </span>
                            {reviewCount} para revisar
                          </span>
                        ) : gTotal > 0 ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200/80 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                            <Check className="h-3 w-3" />
                            Em dia
                          </span>
                        ) : null}
                      </div>

                      <h3 className="mb-1 text-[15px] font-semibold tracking-tight text-slate-900 transition-colors group-hover:text-violet-900">
                        {group.name}
                      </h3>
                      <div className="mb-3 flex items-center gap-1.5 text-xs text-slate-500">
                        <span className="font-medium tabular-nums">{gTotal}</span>
                        <span>{gTotal === 1 ? 'card' : 'cards'}</span>
                        {gMastered > 0 && (
                          <>
                            <span className="text-slate-300">·</span>
                            <span className="inline-flex items-center gap-0.5 font-medium text-emerald-600">
                              <Trophy className="h-3 w-3" strokeWidth={2.4} />
                              {gMastered}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Progress bar de domínio (avg level / 5) */}
                      {gTotal > 0 && (
                        <>
                          <div className="relative h-1 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
                              style={{
                                width: `${masteryPct}%`,
                                background:
                                  'linear-gradient(90deg, #06b6d4 0%, #8b5cf6 50%, #ec4899 100%)',
                              }}
                            />
                          </div>
                          <div className="mt-2 flex items-center justify-between text-[10px] font-medium text-slate-400">
                            <span className="tabular-nums">
                              Nível {gAvg.toFixed(1)} / 5
                            </span>
                            <span className="flex items-center gap-0.5 opacity-0 transition-opacity duration-200 group-hover:opacity-70">
                              Abrir
                              <ChevronRight className="h-3 w-3" />
                            </span>
                          </div>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* AÇÕES RÁPIDAS — mantidas, refinadas */}
        <div
          className={`grid gap-4 md:grid-cols-2 ${
            totalReviewCount > 0 ? 'order-4 lg:order-4' : 'order-3 lg:order-4'
          }`}
        >
          {/* Backup & Restauração */}
          <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="mb-4 flex items-center gap-3">
              <div
                className="grid h-10 w-10 place-items-center rounded-xl"
                style={{
                  background:
                    'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)',
                  boxShadow: 'inset 0 0 0 1px rgba(99, 102, 241, 0.12)',
                }}
              >
                <Sparkles className="h-5 w-5 text-indigo-600" strokeWidth={2.2} />
              </div>
              <div>
                <h3 className="text-[15px] font-semibold tracking-tight text-slate-900">
                  Backup & Restauração
                </h3>
                <p className="text-xs text-slate-500">
                  Exporte ou importe seu progresso
                </p>
              </div>
            </div>
            <div className="flex gap-2.5">
              <button
                onClick={() => setShowImportExport(true)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-sm"
              >
                <Download className="h-4 w-4" strokeWidth={2.2} />
                Exportar
              </button>
              <button
                onClick={() => setShowImportExport(true)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-sm"
              >
                <Upload className="h-4 w-4" strokeWidth={2.2} />
                Importar
              </button>
            </div>
          </div>

          {/* Dica do dia */}
          <div
            className="relative overflow-hidden rounded-2xl p-5"
            style={{
              background:
                'linear-gradient(135deg, #ecfeff 0%, #f0f9ff 60%, #faf5ff 100%)',
              boxShadow:
                '0 1px 2px rgba(15, 23, 42, 0.04), inset 0 0 0 1px rgba(8, 145, 178, 0.10)',
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -top-12 -right-8 h-32 w-32 rounded-full opacity-50"
              style={{
                background:
                  'radial-gradient(circle, rgba(8, 145, 178, 0.15) 0%, transparent 70%)',
                filter: 'blur(20px)',
              }}
            />
            <div className="relative">
              <div className="mb-3 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-white shadow-sm ring-1 ring-cyan-100">
                  <Calendar className="h-5 w-5 text-cyan-600" strokeWidth={2.2} />
                </div>
                <h3 className="text-[15px] font-semibold tracking-tight text-cyan-950">
                  Dica de Estudo
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-cyan-900/80">
                A revisão espaçada é mais eficiente que estudar muitas horas seguidas.{' '}
                <span className="font-semibold text-cyan-900">
                  Revise alguns minutos todo dia
                </span>{' '}
                — é assim que vocabulário fica retido pra valer.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Import/Export */}
      {showImportExport && <ImportExport onClose={() => setShowImportExport(false)} />}
    </div>
  );
}

// =================================================================
// Subcomponentes — KPI premium
// =================================================================

interface KpiCardProps {
  icon: React.ReactNode;
  iconTint: string;
  label: string;
  value: number | string;
  valueColorClass?: string;
  suffix?: React.ReactNode;
  visual?: React.ReactNode;
}

function KpiCard({
  icon,
  iconTint,
  label,
  value,
  valueColorClass = 'text-slate-900',
  suffix,
  visual,
}: KpiCardProps) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-4 sm:p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300/80 hover:shadow-[0_8px_24px_-8px_rgba(15,23,42,0.10)]"
      style={{
        boxShadow:
          '0 1px 2px rgba(15, 23, 42, 0.04), 0 1px 0 rgba(255, 255, 255, 1) inset',
      }}
    >
      <div className="mb-3 flex items-center justify-between">
        <div
          className={`grid h-9 w-9 place-items-center rounded-xl ring-1 ${iconTint}`}
        >
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-1">
        <p
          className={`text-2xl sm:text-3xl font-bold tracking-tight tabular-nums ${valueColorClass}`}
        >
          {value}
        </p>
        {suffix}
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        {visual && <div className="flex shrink-0 items-center">{visual}</div>}
      </div>
    </div>
  );
}

/** 5 dots — preenchidos proporcional ao nível médio (0..5). */
function LevelDots({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((dot) => {
        const fill = Math.max(0, Math.min(1, value - (dot - 1)));
        return (
          <div
            key={dot}
            className="relative h-2 w-2 overflow-hidden rounded-full bg-slate-200"
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-violet-500 to-violet-600 transition-all duration-700"
              style={{ width: `${fill * 100}%` }}
            />
          </div>
        );
      })}
    </div>
  );
}

/** Mini-progress de domínio (% mastered). */
function MasteryRatio({ pct }: { pct: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="relative h-1.5 w-10 overflow-hidden rounded-full bg-slate-100">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[10px] font-semibold tabular-nums text-emerald-600">
        {pct}%
      </span>
    </div>
  );
}
