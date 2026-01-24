import { useState } from 'react';
import { useStore } from '../store/useStore';
import { 
  FolderPlus, 
  Pencil, 
  Trash2, 
  Check, 
  X, 
  Folder, 
  ChevronLeft,
  ChevronRight,
  Blocks,
  BookOpen,
  Home,
  Gamepad2
} from 'lucide-react';

export function Sidebar() {
  const { 
    groups, 
    selectedGroupId, 
    selectGroup, 
    addGroup, 
    renameGroup, 
    deleteGroup,
    sidebarOpen,
    toggleSidebar,
    viewMode,
    setViewMode,
    goToHome,
    startPlayMode,
    getCardsForReviewCount,
    getTotalCardsForReview
  } = useStore();
  
  const [newGroupName, setNewGroupName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const totalReviewCount = getTotalCardsForReview();

  const handleAddGroup = () => {
    if (newGroupName.trim()) {
      addGroup(newGroupName.trim());
      setNewGroupName('');
      setIsAdding(false);
    }
  };

  const handleStartEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setEditingName(currentName);
  };

  const handleSaveEdit = () => {
    if (editingId && editingName.trim()) {
      renameGroup(editingId, editingName.trim());
      setEditingId(null);
      setEditingName('');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleDeleteGroup = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este grupo e todos os seus cards?')) {
      deleteGroup(id);
    }
  };

  return (
    <>
      {/* Botão de toggle para mobile/desktop */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-4 z-50 bg-white shadow-lg rounded-full p-2 hover:bg-slate-50 transition-all duration-300 ${
          sidebarOpen ? 'left-[300px]' : 'left-4'
        }`}
      >
        {sidebarOpen ? (
          <ChevronLeft className="w-5 h-5 text-slate-600" />
        ) : (
          <ChevronRight className="w-5 h-5 text-slate-600" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white transition-all duration-300 z-40 shadow-2xl ${
          sidebarOpen ? 'w-80' : 'w-0 overflow-hidden'
        }`}
      >
        <div className="p-4 h-full flex flex-col">
          {/* Logo / Título */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              🎓 English Cards
            </h1>
            <p className="text-slate-400 text-sm mt-1">Seu estudo diário de inglês</p>
          </div>

          {/* Menu de Navegação */}
          <nav className="mb-6 space-y-2">
            {/* Home */}
            <button
              onClick={goToHome}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                viewMode === 'home'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'hover:bg-white/5 text-slate-300'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Início</span>
              {totalReviewCount > 0 && viewMode !== 'home' && (
                <span className="ml-auto px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-bold rounded-full">
                  {totalReviewCount}
                </span>
              )}
            </button>

            {/* Jogar */}
            {totalReviewCount > 0 && (
              <button
                onClick={() => startPlayMode()}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  viewMode === 'play'
                    ? 'bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-violet-400 border border-violet-500/30'
                    : 'hover:bg-white/5 text-slate-300'
                }`}
              >
                <Gamepad2 className="w-5 h-5" />
                <span className="font-medium">Jogar</span>
                <span className="ml-auto px-2.5 py-0.5 bg-violet-500 text-white text-xs font-bold rounded-full animate-pulse">
                  {totalReviewCount}
                </span>
              </button>
            )}

            {/* Bricks Challenge */}
            <button
              onClick={() => setViewMode('bricks')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                viewMode === 'bricks' || viewMode === 'bricks-challenge'
                  ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30'
                  : 'hover:bg-white/5 text-slate-300'
              }`}
            >
              <Blocks className="w-5 h-5" />
              <span className="font-medium">Bricks Challenge</span>
            </button>
          </nav>

          {/* Seção de Grupos */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-slate-300">
                <BookOpen className="w-5 h-5" />
                <span className="font-medium">Meus Grupos</span>
              </div>
              <button
                onClick={() => setIsAdding(true)}
                className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors"
                title="Novo grupo"
              >
                <FolderPlus className="w-4 h-4" />
              </button>
            </div>

            {/* Formulário de novo grupo */}
            {isAdding && (
              <div className="mb-4 animate-fade-in">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="Nome do grupo..."
                    className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddGroup();
                      if (e.key === 'Escape') setIsAdding(false);
                    }}
                  />
                  <button
                    onClick={handleAddGroup}
                    className="p-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setIsAdding(false);
                      setNewGroupName('');
                    }}
                    className="p-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Lista de grupos */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
              {groups.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Folder className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nenhum grupo criado</p>
                  <p className="text-xs mt-1">Clique em + para criar</p>
                </div>
              ) : (
                groups.map((group) => {
                  const reviewCount = getCardsForReviewCount(group.id);
                  
                  return (
                    <div
                      key={group.id}
                      className={`group rounded-xl transition-all duration-200 ${
                        selectedGroupId === group.id && viewMode === 'cards'
                          ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30'
                          : 'hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      {editingId === group.id ? (
                        <div className="flex gap-2 p-2">
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="flex-1 px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEdit();
                              if (e.key === 'Escape') handleCancelEdit();
                            }}
                          />
                          <button
                            onClick={handleSaveEdit}
                            className="p-1.5 bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-1.5 bg-slate-600 rounded-lg hover:bg-slate-500 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div
                          className="flex items-center gap-2 px-3 py-3 cursor-pointer"
                          onClick={() => selectGroup(group.id)}
                        >
                          <Folder className={`w-5 h-5 flex-shrink-0 ${
                            selectedGroupId === group.id && viewMode === 'cards'
                              ? 'text-cyan-400'
                              : 'text-slate-400'
                          }`} />
                          <span className={`font-medium flex-1 text-sm leading-tight ${
                            selectedGroupId === group.id && viewMode === 'cards'
                              ? 'text-white'
                              : 'text-slate-300'
                          }`} title={group.name}>
                            {group.name}
                          </span>
                          {/* Badge de revisão */}
                          {reviewCount > 0 && (
                            <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-bold rounded-full flex-shrink-0">
                              {reviewCount}
                            </span>
                          )}
                          {/* Botões de ação - aparecem no hover */}
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartEdit(group.id, group.name);
                              }}
                              className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteGroup(group.id);
                              }}
                              className="p-1 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-slate-700">
            <p className="text-xs text-slate-500 text-center">
              {groups.length} grupo{groups.length !== 1 ? 's' : ''} · 
              Dados salvos localmente
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
