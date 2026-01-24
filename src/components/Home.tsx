import { useState } from 'react';
import { useStore } from '../store/useStore';
import { ImportExport } from './ImportExport';
import { 
  BookOpen, 
  Clock, 
  Flame, 
  Trophy,
  ArrowRight,
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
    startReviewSession,
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

  return (
    <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Bem-vindo de volta! 👋
          </h1>
          <p className="text-lg text-slate-500">
            Continue seu estudo de inglês e mantenha a consistência.
          </p>
        </div>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

        {/* Seção "Jogar" - Destaque principal */}
        {totalReviewCount > 0 && (
          <div className="mb-8 animate-fade-in">
            <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl shadow-purple-500/30 relative overflow-hidden">
              {/* Elementos decorativos */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between flex-wrap gap-6">
                  <div className="flex items-center gap-5">
                    <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                      <Gamepad2 className="w-10 h-10" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold mb-1">Hora de Jogar! 🎮</h2>
                      <p className="text-purple-100 text-lg">
                        <span className="font-bold text-white">{totalReviewCount} cards</span> aguardando sua revisão
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => startPlayMode()}
                    className="px-8 py-4 bg-white text-purple-600 font-bold text-lg rounded-2xl hover:bg-purple-50 transition-all shadow-lg flex items-center gap-3 group"
                  >
                    <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    Jogar Agora
                  </button>
                </div>

                {/* Lista de grupos com revisões pendentes */}
                {groupsWithPendingReview.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-white/20">
                    <p className="text-sm text-purple-200 mb-3">Ou escolha um grupo específico:</p>
                    <div className="flex flex-wrap gap-3">
                      {groupsWithPendingReview.map(({ group, reviewCount }) => (
                        <button
                          key={group.id}
                          onClick={() => startPlayMode(group.id)}
                          className="px-5 py-2.5 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-xl transition-all flex items-center gap-2 border border-white/10"
                        >
                          <Folder className="w-4 h-4" />
                          <span className="font-medium">{group.name}</span>
                          <span className="px-2.5 py-0.5 bg-white/20 rounded-full text-xs font-bold">
                            {reviewCount}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Seção de Grupos */}
        <div className="mb-8">
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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {groupsWithReview.map(({ group, reviewCount, totalCards }, index) => (
                <button
                  key={group.id}
                  onClick={() => selectGroup(group.id)}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md hover:border-cyan-200 transition-all text-left animate-fade-in group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 bg-slate-100 rounded-xl group-hover:bg-cyan-100 transition-colors">
                      <Folder className="w-6 h-6 text-slate-500 group-hover:text-cyan-600 transition-colors" />
                    </div>
                    {reviewCount > 0 && (
                      <span className="px-2.5 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full">
                        {reviewCount} para revisar
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-1 group-hover:text-cyan-700 transition-colors">
                    {group.name}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {totalCards} card{totalCards !== 1 ? 's' : ''}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Ações rápidas */}
        <div className="grid md:grid-cols-2 gap-4">
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
