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
  Play
} from 'lucide-react';

export function Home() {
  const { 
    groups, 
    cards,
    getGroupsWithReviewCount, 
    getTotalCardsForReview,
    startPlayMode,
    addGroup,
    selectGroup
  } = useStore();
  
  const [showImportExport, setShowImportExport] = useState(false);
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  const groupsWithReview = getGroupsWithReviewCount();
  const totalReviewCount = getTotalCardsForReview();
  const groupsWithPendingReview = groupsWithReview.filter(g => g.reviewCount > 0);

  const handleAddGroup = () => {
    if (newGroupName.trim()) {
      addGroup(newGroupName.trim());
      setNewGroupName('');
      setIsAddingGroup(false);
    }
  };

  // Calcular estatísticas
  const totalCards = cards.length;
  const avgLevel = totalCards > 0 
    ? (cards.reduce((acc, c) => acc + c.level, 0) / totalCards).toFixed(1)
    : '0';
  const masteredCards = cards.filter(c => c.level === 5).length;

  /** Mesmo gradiente “com revisões” do FAB do menu inferior (mobile). */
  const playFabGradient =
    'bg-gradient-to-br from-violet-600 via-fuchsia-500 to-orange-500 shadow-lg shadow-fuchsia-500/30 ring-2 ring-violet-400/35 ring-offset-2 ring-offset-white/80 shadow-[inset_0_2px_0_0_rgba(255,255,255,0.35)]';

  return (
    <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto flex flex-col">
        {/* Seção "Jogar" — no mobile fica no topo; resumo abaixo */}
        {totalReviewCount > 0 && (
          <div className="mb-8 animate-fade-in order-1 lg:order-1">
            <div className="bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-2xl shadow-violet-500/30 relative overflow-hidden">
              {/* Elementos decorativos */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

              {/* Mobile: botão estilo FAB + texto abaixo + grupos com scroll */}
              <div className="relative z-10 lg:hidden flex flex-col items-center">
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
                  <span className="font-bold text-white tabular-nums">{totalReviewCount} cards</span>{' '}
                  aguardando sua revisão
                </p>

                {groupsWithPendingReview.length > 0 && (
                  <div className="mt-5 w-full border-t border-white/20 pt-4">
                    <p className="mb-2 text-center text-xs text-violet-200">
                      Ou escolha um grupo específico:
                    </p>
                    <div className="max-h-[min(220px,38vh)] overflow-y-auto overscroll-contain pr-1 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.35)_transparent]">
                      <div className="flex flex-col gap-2">
                        {groupsWithPendingReview.map(({ group, reviewCount }) => (
                          <button
                            key={group.id}
                            type="button"
                            onClick={() => startPlayMode(group.id)}
                            className="flex w-full shrink-0 items-center justify-between gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-left text-sm backdrop-blur-sm transition-colors hover:bg-white/20"
                          >
                            <span className="flex min-w-0 items-center gap-2">
                              <Folder className="h-4 w-4 shrink-0" />
                              <span className="truncate font-medium">{group.name}</span>
                            </span>
                            <span className="shrink-0 rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold tabular-nums">
                              {reviewCount}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Desktop: layout original */}
              <div className="relative z-10 hidden lg:block">
                <div className="flex flex-wrap items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <div className="rounded-2xl bg-white/20 p-4 backdrop-blur-sm">
                      <Gamepad2 className="h-10 w-10" />
                    </div>
                    <div>
                      <h2 className="mb-1 text-3xl font-bold">Hora de Jogar! 🎮</h2>
                      <p className="text-lg text-violet-100">
                        <span className="font-bold text-white">{totalReviewCount} cards</span> aguardando
                        sua revisão
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => startPlayMode()}
                    className="group flex items-center gap-3 rounded-2xl bg-white px-8 py-4 text-lg font-bold text-violet-600 shadow-lg transition-all hover:bg-violet-50"
                  >
                    <Play className="h-6 w-6 transition-transform group-hover:scale-110" />
                    Jogar Agora
                  </button>
                </div>

                {groupsWithPendingReview.length > 0 && (
                  <div className="mt-8 border-t border-white/20 pt-6">
                    <p className="mb-3 text-sm text-violet-200">Ou escolha um grupo específico:</p>
                    <div className="max-h-[min(280px,40vh)] overflow-y-auto overscroll-contain pr-1 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.35)_transparent]">
                      <div className="flex flex-wrap gap-3">
                      {groupsWithPendingReview.map(({ group, reviewCount }) => (
                        <button
                          key={group.id}
                          type="button"
                          onClick={() => startPlayMode(group.id)}
                          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/15 px-5 py-2.5 backdrop-blur-sm transition-all hover:bg-white/25"
                        >
                          <Folder className="h-4 w-4" />
                          <span className="font-medium">{group.name}</span>
                          <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-bold">
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

        {/* Cards de estatísticas — abaixo do card Jogar no mobile */}
        <div
          className={`mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4 ${
            totalReviewCount > 0 ? 'order-2 lg:order-2' : 'order-1 lg:order-1'
          }`}
        >
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-cyan-100 rounded-xl">
                <BookOpen className="w-5 h-5 text-cyan-600" />
              </div>
              <span className="text-sm text-slate-500">Total de Cards</span>
            </div>
            <p className="text-3xl font-bold text-slate-800">{totalCards}</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-amber-100 rounded-xl">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-sm text-slate-500">Para Revisar</span>
            </div>
            <p className="text-3xl font-bold text-amber-600">{totalReviewCount}</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 rounded-xl">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-sm text-slate-500">Nível Médio</span>
            </div>
            <p className="text-3xl font-bold text-slate-800">{avgLevel}</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-emerald-100 rounded-xl">
                <Trophy className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-sm text-slate-500">Dominados</span>
            </div>
            <p className="text-3xl font-bold text-emerald-600">{masteredCards}</p>
          </div>
        </div>

        {/* Seção de Grupos — order explícito para não ficar acima dos stats no mobile */}
        <div
          className={`mb-8 ${totalReviewCount > 0 ? 'order-3 lg:order-3' : 'order-2 lg:order-3'}`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Folder className="w-6 h-6 text-slate-400" />
              Meus Grupos
            </h2>
            <button
              onClick={() => setIsAddingGroup(true)}
              className="px-4 py-2 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Novo Grupo
            </button>
          </div>

          {/* Formulário de novo grupo */}
          {isAddingGroup && (
            <div className="mb-4 p-4 bg-white rounded-xl border border-slate-200 animate-fade-in">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Nome do grupo..."
                  className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddGroup();
                    if (e.key === 'Escape') setIsAddingGroup(false);
                  }}
                />
                <button
                  onClick={handleAddGroup}
                  disabled={!newGroupName.trim()}
                  className="px-4 py-2 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 disabled:opacity-50 transition-colors"
                >
                  Criar
                </button>
                <button
                  onClick={() => {
                    setIsAddingGroup(false);
                    setNewGroupName('');
                  }}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Lista de grupos */}
          {groups.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                <Folder className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">
                Nenhum grupo criado
              </h3>
              <p className="text-slate-500 mb-4">
                Crie seu primeiro grupo para começar a adicionar flash cards.
              </p>
              <button
                onClick={() => setIsAddingGroup(true)}
                className="px-6 py-3 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Criar Primeiro Grupo
              </button>
            </div>
          ) : (
            <div
              className="max-h-[min(320px,48vh)] overflow-y-auto overscroll-contain pr-1 [scrollbar-width:thin] [scrollbar-color:rgba(148,163,184,0.5)_transparent] md:max-h-[min(380px,52vh)] lg:max-h-[min(440px,55vh)]"
            >
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {groupsWithReview.map(({ group, reviewCount, totalCards }, index) => (
                  <button
                    key={group.id}
                    onClick={() => selectGroup(group.id)}
                    className="bg-gradient-to-br from-cyan-50/80 to-white rounded-2xl p-5 shadow-sm border border-cyan-100/80 hover:shadow-md hover:border-cyan-200 hover:from-cyan-100/60 hover:to-white transition-all text-left animate-fade-in group"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 bg-cyan-100/70 rounded-xl group-hover:bg-cyan-200/80 transition-colors">
                        <Folder className="w-6 h-6 text-cyan-600 group-hover:text-cyan-700 transition-colors" />
                      </div>
                      {reviewCount > 0 && (
                        <span className="px-2.5 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full">
                          {reviewCount} para revisar
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-1 group-hover:text-cyan-800 transition-colors">
                      {group.name}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {totalCards} card{totalCards !== 1 ? 's' : ''}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Ações rápidas */}
        <div
          className={`grid gap-4 md:grid-cols-2 ${totalReviewCount > 0 ? 'order-4 lg:order-4' : 'order-3 lg:order-4'}`}
        >
          {/* Import/Export */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-100 rounded-xl">
                <Sparkles className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Backup & Restauração</h3>
                <p className="text-sm text-slate-500">Exporte ou importe seu progresso</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowImportExport(true)}
                className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Exportar
              </button>
              <button
                onClick={() => setShowImportExport(true)}
                className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Importar
              </button>
            </div>
          </div>

          {/* Dica do dia */}
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-cyan-100 rounded-xl">
                <Calendar className="w-6 h-6 text-cyan-600" />
              </div>
              <h3 className="font-semibold text-cyan-800">Dica de Estudo</h3>
            </div>
            <p className="text-sm text-cyan-700 leading-relaxed">
              A revisão espaçada é mais eficiente que estudar muitas horas seguidas. 
              Revise seus cards diariamente por alguns minutos para melhores resultados!
            </p>
          </div>
        </div>
      </div>

      {/* Modal Import/Export */}
      {showImportExport && (
        <ImportExport onClose={() => setShowImportExport(false)} />
      )}
    </div>
  );
}
