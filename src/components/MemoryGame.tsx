import { useEffect, useState, useRef } from 'react';
import { useStore } from '../store/useStore';
import { defaultMemoryDecks } from '../data/memoryDecks';
import { MEMORY_DIFFICULTY_CONFIG } from '../types';
import type { MemoryDeck, MemoryDifficulty, MemoryPair } from '../types';
import {
  Puzzle,
  Play,
  ArrowLeft,
  Trophy,
  Clock,
  Target,
  RotateCcw,
  Home,
  CheckCircle,
  XCircle,
  Zap,
  Star,
  Download,
  Upload,
  Settings,
  Trash2,
  Pencil,
  Plus,
  X,
  Save
} from 'lucide-react';

export function MemoryGame() {
  const {
    memoryGame,
    memoryDecks,
    hiddenDefaultDeckIds,
    selectMemoryDeck,
    selectMemoryDifficulty,
    startMemoryPlaying,
    flipMemoryCard,
    resetMemoryGame,
    goToHome,
    addMemoryDeck,
    updateMemoryDeck,
    deleteMemoryDeck,
    hideDefaultDeck,
    restoreDefaultDecks,
    exportMemoryDecks,
    importMemoryDecks,
    updateMemoryPair,
    deleteMemoryPair,
    addMemoryPair,
  } = useStore();

  const [showManageMode, setShowManageMode] = useState(false);
  const [editingDeck, setEditingDeck] = useState<MemoryDeck | null>(null);
  const [editingPair, setEditingPair] = useState<{ deckId: string; pair: MemoryPair } | null>(null);
  const [newPairMode, setNewPairMode] = useState<string | null>(null);
  const [importMessage, setImportMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [deckForm, setDeckForm] = useState({ title: '', category: '', emoji: '', description: '' });
  const [pairForm, setPairForm] = useState({ word: '', imageUrl: '' });

  // Carregar decks padrão se não houver nenhum
  useEffect(() => {
    if (memoryDecks.length === 0) {
      defaultMemoryDecks.forEach((deck) => {
        addMemoryDeck(deck);
      });
    }
  }, [memoryDecks.length, addMemoryDeck]);

  // Combinar decks padrão (exceto ocultos) com customizados
  const visibleDefaultDecks = defaultMemoryDecks.filter(
    (d) => !hiddenDefaultDeckIds.includes(d.id)
  );
  const allDecks = [...visibleDefaultDecks, ...memoryDecks.filter(
    (d) => !defaultMemoryDecks.some((dd) => dd.id === d.id)
  )];

  // Identificar decks customizados (que podem ser editados/deletados)
  const isCustomDeck = (deckId: string) => !defaultMemoryDecks.some((d) => d.id === deckId);

  // Função para deletar deck (customizado ou ocultar padrão)
  const handleDeleteDeck = (deckId: string) => {
    if (isCustomDeck(deckId)) {
      deleteMemoryDeck(deckId);
    } else {
      hideDefaultDeck(deckId);
    }
  };

  // Exportar decks
  const handleExport = () => {
    const data = exportMemoryDecks();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `memory-decks-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Importar decks
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        const result = importMemoryDecks(data);
        setImportMessage({ type: result.success ? 'success' : 'error', text: result.message });
        setTimeout(() => setImportMessage(null), 3000);
      } catch {
        setImportMessage({ type: 'error', text: 'Erro ao ler arquivo JSON' });
        setTimeout(() => setImportMessage(null), 3000);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Iniciar edição de deck
  const startEditDeck = (deck: MemoryDeck) => {
    setEditingDeck(deck);
    setDeckForm({
      title: deck.title,
      category: deck.category,
      emoji: deck.emoji,
      description: deck.description,
    });
  };

  // Salvar edição de deck
  const saveDeckEdit = () => {
    if (!editingDeck) return;
    updateMemoryDeck(editingDeck.id, {
      title: deckForm.title,
      category: deckForm.category,
      emoji: deckForm.emoji,
      description: deckForm.description,
    });
    setEditingDeck(null);
  };

  // Iniciar edição de par
  const startEditPair = (deckId: string, pair: MemoryPair) => {
    setEditingPair({ deckId, pair });
    setPairForm({ word: pair.word, imageUrl: pair.imageUrl });
  };

  // Salvar edição de par
  const savePairEdit = () => {
    if (!editingPair) return;
    updateMemoryPair(editingPair.deckId, editingPair.pair.pairId, {
      word: pairForm.word,
      imageUrl: pairForm.imageUrl,
    });
    setEditingPair(null);
  };

  // Adicionar novo par
  const handleAddPair = (deckId: string) => {
    if (!pairForm.word || !pairForm.imageUrl) return;
    const newPair: MemoryPair = {
      pairId: `pair-${Date.now()}`,
      word: pairForm.word,
      imageUrl: pairForm.imageUrl,
    };
    addMemoryPair(deckId, newPair);
    setPairForm({ word: '', imageUrl: '' });
    setNewPairMode(null);
  };

  // Criar novo deck
  const [showNewDeck, setShowNewDeck] = useState(false);
  const [newDeckForm, setNewDeckForm] = useState({ title: '', category: '', emoji: '📚', description: '' });

  const handleCreateDeck = () => {
    if (!newDeckForm.title) return;
    const newDeck: MemoryDeck = {
      id: `deck-${Date.now()}`,
      title: newDeckForm.title,
      category: newDeckForm.category || 'Custom',
      emoji: newDeckForm.emoji || '📚',
      description: newDeckForm.description || 'Custom deck',
      pairs: [],
    };
    addMemoryDeck(newDeck);
    setNewDeckForm({ title: '', category: '', emoji: '📚', description: '' });
    setShowNewDeck(false);
  };

  // =============================================
  // TELA 1: Seleção de Deck
  // =============================================
  if (memoryGame.phase === 'deck-selection') {
    return (
      <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/30">
            <Puzzle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Pairs Challenge</h1>
          <p className="text-slate-500">Train your memory and English at the same time</p>
        </div>

        {/* Mensagem de importação */}
        {importMessage && (
          <div className={`max-w-4xl mx-auto mb-4 p-4 rounded-xl ${
            importMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {importMessage.text}
          </div>
        )}

        {/* Botões de ação */}
        <div className="max-w-4xl mx-auto mb-6 flex flex-wrap gap-3">
          <button
            onClick={() => setShowManageMode(!showManageMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              showManageMode
                ? 'bg-pink-500 text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Settings className="w-4 h-4" />
            {showManageMode ? 'Fechar Gerenciamento' : 'Gerenciar Decks'}
          </button>
          
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all"
          >
            <Download className="w-4 h-4" />
            Exportar Decks
          </button>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all"
          >
            <Upload className="w-4 h-4" />
            Importar Decks
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />

          {showManageMode && (
            <>
              <button
                onClick={() => setShowNewDeck(true)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all"
              >
                <Plus className="w-4 h-4" />
                Novo Deck
              </button>
              {hiddenDefaultDeckIds.length > 0 && (
                <button
                  onClick={restoreDefaultDecks}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  Restaurar Padrões ({hiddenDefaultDeckIds.length})
                </button>
              )}
            </>
          )}
        </div>

        {/* Modal: Criar Novo Deck */}
        {showNewDeck && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-800">Criar Novo Deck</h2>
                <button onClick={() => setShowNewDeck(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Título</label>
                  <input
                    type="text"
                    value={newDeckForm.title}
                    onChange={(e) => setNewDeckForm({ ...newDeckForm, title: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Ex: Animals"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Emoji</label>
                    <input
                      type="text"
                      value={newDeckForm.emoji}
                      onChange={(e) => setNewDeckForm({ ...newDeckForm, emoji: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="📚"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
                    <input
                      type="text"
                      value={newDeckForm.category}
                      onChange={(e) => setNewDeckForm({ ...newDeckForm, category: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="Custom"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
                  <input
                    type="text"
                    value={newDeckForm.description}
                    onChange={(e) => setNewDeckForm({ ...newDeckForm, description: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Meu deck customizado"
                  />
                </div>
                <button
                  onClick={handleCreateDeck}
                  disabled={!newDeckForm.title}
                  className="w-full py-3 bg-pink-500 text-white font-semibold rounded-xl hover:bg-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Criar Deck
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Editar Deck */}
        {editingDeck && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-800">Editar Deck: {editingDeck.title}</h2>
                <button onClick={() => setEditingDeck(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Informações do deck */}
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Título</label>
                    <input
                      type="text"
                      value={deckForm.title}
                      onChange={(e) => setDeckForm({ ...deckForm, title: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Emoji</label>
                    <input
                      type="text"
                      value={deckForm.emoji}
                      onChange={(e) => setDeckForm({ ...deckForm, emoji: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
                    <input
                      type="text"
                      value={deckForm.category}
                      onChange={(e) => setDeckForm({ ...deckForm, category: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
                    <input
                      type="text"
                      value={deckForm.description}
                      onChange={(e) => setDeckForm({ ...deckForm, description: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>
                <button
                  onClick={saveDeckEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-all"
                >
                  <Save className="w-4 h-4" />
                  Salvar Alterações
                </button>
              </div>

              {/* Lista de pares */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-800">Pares ({editingDeck.pairs.length})</h3>
                  <button
                    onClick={() => {
                      setNewPairMode(editingDeck.id);
                      setPairForm({ word: '', imageUrl: '' });
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500 text-white text-sm rounded-lg hover:bg-emerald-600 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar Par
                  </button>
                </div>

                {/* Form para novo par */}
                {newPairMode === editingDeck.id && (
                  <div className="mb-4 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Palavra</label>
                        <input
                          type="text"
                          value={pairForm.word}
                          onChange={(e) => setPairForm({ ...pairForm, word: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="Ex: apple"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">URL da Imagem</label>
                        <input
                          type="text"
                          value={pairForm.imageUrl}
                          onChange={(e) => setPairForm({ ...pairForm, imageUrl: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddPair(editingDeck.id)}
                        disabled={!pairForm.word || !pairForm.imageUrl}
                        className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all disabled:opacity-50"
                      >
                        Adicionar
                      </button>
                      <button
                        onClick={() => setNewPairMode(null)}
                        className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-all"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

                {/* Lista de pares existentes */}
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {editingDeck.pairs.map((pair) => (
                    <div key={pair.pairId} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <img
                        src={pair.imageUrl}
                        alt={pair.word}
                        className="w-12 h-12 rounded-lg object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48?text=?';
                        }}
                      />
                      <span className="flex-1 font-medium text-slate-700">{pair.word}</span>
                      <button
                        onClick={() => startEditPair(editingDeck.id, pair)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteMemoryPair(editingDeck.id, pair.pairId)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Editar Par */}
        {editingPair && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-800">Editar Par</h2>
                <button onClick={() => setEditingPair(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Palavra</label>
                  <input
                    type="text"
                    value={pairForm.word}
                    onChange={(e) => setPairForm({ ...pairForm, word: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">URL da Imagem</label>
                  <input
                    type="text"
                    value={pairForm.imageUrl}
                    onChange={(e) => setPairForm({ ...pairForm, imageUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                {pairForm.imageUrl && (
                  <div className="flex justify-center">
                    <img
                      src={pairForm.imageUrl}
                      alt="Preview"
                      className="w-24 h-24 rounded-xl object-cover border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/96?text=Erro';
                      }}
                    />
                  </div>
                )}
                <button
                  onClick={savePairEdit}
                  className="w-full py-3 bg-pink-500 text-white font-semibold rounded-xl hover:bg-pink-600 transition-all"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Grid de Decks */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg font-semibold text-slate-700 mb-4">
            {showManageMode ? 'Gerenciar Decks' : 'Choose a deck'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allDecks.map((deck) => (
              <DeckCard
                key={deck.id}
                deck={deck}
                onClick={() => !showManageMode && selectMemoryDeck(deck)}
                showManageMode={showManageMode}
                isCustom={isCustomDeck(deck.id)}
                onEdit={() => startEditDeck(deck)}
                onDelete={() => handleDeleteDeck(deck.id)}
              />
            ))}
          </div>
        </div>

        {/* Botão voltar */}
        <div className="max-w-4xl mx-auto mt-8">
          <button
            onClick={goToHome}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // =============================================
  // TELA 2: Seleção de Dificuldade
  // =============================================
  if (memoryGame.phase === 'difficulty-selection') {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full animate-fade-in">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-3xl">{memoryGame.selectedDeck?.emoji}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-1">
              {memoryGame.selectedDeck?.title}
            </h1>
            <p className="text-slate-500">{memoryGame.selectedDeck?.description}</p>
          </div>

          {/* Opções de Dificuldade */}
          <div className="space-y-3 mb-8">
            {(Object.keys(MEMORY_DIFFICULTY_CONFIG) as MemoryDifficulty[]).map((difficulty) => {
              const config = MEMORY_DIFFICULTY_CONFIG[difficulty];
              const isSelected = memoryGame.difficulty === difficulty;
              const hasEnoughPairs = (memoryGame.selectedDeck?.pairs.length || 0) >= config.pairs;
              
              return (
                <button
                  key={difficulty}
                  onClick={() => hasEnoughPairs && selectMemoryDifficulty(difficulty)}
                  disabled={!hasEnoughPairs}
                  className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                    isSelected
                      ? 'border-pink-500 bg-pink-50'
                      : hasEnoughPairs
                      ? 'border-slate-200 bg-white hover:border-slate-300'
                      : 'border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <span className="text-2xl">{config.emoji}</span>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-slate-800">{config.label}</p>
                    <p className="text-sm text-slate-500">{config.pairs} pairs</p>
                  </div>
                  {isSelected && (
                    <CheckCircle className="w-5 h-5 text-pink-500" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Botões de ação */}
          <div className="flex gap-3">
            <button
              onClick={resetMemoryGame}
              className="flex-1 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={startMemoryPlaying}
              className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              Start Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =============================================
  // TELA 3: Jogo
  // =============================================
  if (memoryGame.phase === 'playing') {
    const totalPairs = memoryGame.cards.length / 2;
    const gridCols = totalPairs <= 6 ? 'grid-cols-3' : totalPairs <= 10 ? 'grid-cols-4' : 'grid-cols-5';
    
    return (
      <div className="flex-1 flex flex-col p-4 lg:p-6">
        {/* Header do jogo */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={resetMemoryGame}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-200">
              <Target className="w-4 h-4 text-pink-500" />
              <span className="font-semibold text-slate-700">
                {memoryGame.matches} / {totalPairs}
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-200">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="font-semibold text-slate-700">
                {memoryGame.attempts} tries
              </span>
            </div>
          </div>
          
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Grid de cartas */}
        <div className="flex-1 flex items-center justify-center">
          <div className={`grid ${gridCols} gap-3 max-w-3xl w-full`}>
            {memoryGame.cards.map((card) => (
              <MemoryCard
                key={card.id}
                card={card}
                onClick={() => flipMemoryCard(card.id)}
                disabled={memoryGame.selectedCardIds.length >= 2 || card.isMatched}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =============================================
  // TELA 4: Resultados
  // =============================================
  if (memoryGame.phase === 'results') {
    const totalPairs = memoryGame.cards.length / 2;
    const mistakes = memoryGame.attempts - memoryGame.matches;
    const accuracy = Math.round((memoryGame.matches / memoryGame.attempts) * 100);
    const duration = memoryGame.endTime && memoryGame.startTime
      ? Math.round((memoryGame.endTime - memoryGame.startTime) / 1000)
      : 0;
    
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-lg w-full animate-fade-in">
          {/* Header com resultado */}
          <div className="text-center mb-8">
            <div className={`w-24 h-24 mx-auto mb-4 rounded-3xl flex items-center justify-center shadow-xl ${
              accuracy >= 70
                ? 'bg-gradient-to-br from-emerald-400 to-green-500 shadow-green-500/30'
                : accuracy >= 50
                ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-orange-500/30'
                : 'bg-gradient-to-br from-pink-400 to-rose-500 shadow-rose-500/30'
            }`}>
              {accuracy >= 70 ? (
                <Trophy className="w-12 h-12 text-white" />
              ) : accuracy >= 50 ? (
                <Star className="w-12 h-12 text-white" />
              ) : (
                <Puzzle className="w-12 h-12 text-white" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              {accuracy >= 70 ? 'Excellent! 🎉' : accuracy >= 50 ? 'Good Job! 💪' : 'Keep Practicing! 📚'}
            </h1>
            <p className="text-slate-500">{memoryGame.selectedDeck?.title}</p>
          </div>

          {/* Card de estatísticas */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 mb-6">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                </div>
                <p className="text-3xl font-bold text-emerald-500">{memoryGame.matches}</p>
                <p className="text-sm text-slate-500">Correct</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <XCircle className="w-5 h-5 text-red-500" />
                </div>
                <p className="text-3xl font-bold text-red-500">{mistakes}</p>
                <p className="text-sm text-slate-500">Mistakes</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Clock className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-3xl font-bold text-blue-500">{duration}s</p>
                <p className="text-sm text-slate-500">Time</p>
              </div>
            </div>

            {/* Barra de progresso */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-slate-600 mb-1">
                <span>Accuracy</span>
                <span className="font-semibold">{accuracy}%</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    accuracy >= 70 ? 'bg-emerald-500' : accuracy >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${accuracy}%` }}
                />
              </div>
            </div>

            {/* Review de erros */}
            {memoryGame.mistakes.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  Review Mistakes
                </h3>
                <div className="space-y-2">
                  {memoryGame.mistakes.map((pair) => (
                    <div
                      key={pair.pairId}
                      className="flex items-center gap-3 p-3 bg-red-50 rounded-xl border border-red-100"
                    >
                      <img
                        src={pair.imageUrl}
                        alt={pair.word}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <span className="font-medium text-slate-700">{pair.word}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Botões de ação */}
          <div className="flex gap-3">
            <button
              onClick={resetMemoryGame}
              className="flex-1 py-3 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Play Again
            </button>
            <button
              onClick={goToHome}
              className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// =============================================
// Componente de Card do Deck (seleção)
// =============================================
function DeckCard({ 
  deck, 
  onClick, 
  showManageMode, 
  isCustom,
  onEdit,
  onDelete,
}: { 
  deck: MemoryDeck; 
  onClick: () => void;
  showManageMode: boolean;
  isCustom: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className={`p-6 bg-white rounded-2xl shadow-lg border border-slate-200 transition-all text-left group ${
        showManageMode ? '' : 'hover:border-pink-300 hover:shadow-xl cursor-pointer'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
          {deck.emoji}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-800 mb-1">{deck.title}</h3>
          <p className="text-sm text-slate-500 mb-2">{deck.description}</p>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
              {deck.pairs.length} pairs
            </span>
            <span className="px-2 py-0.5 bg-pink-100 text-pink-600 text-xs font-medium rounded-full">
              {deck.category}
            </span>
            {isCustom && (
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 text-xs font-medium rounded-full">
                Custom
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Botões de gerenciamento */}
      {showManageMode && (
        <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Pencil className="w-4 h-4" />
            Editar
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              const message = isCustom 
                ? 'Tem certeza que deseja excluir este deck?' 
                : 'Este é um deck padrão. Deseja realmente excluí-lo?';
              if (confirm(message)) {
                onDelete();
              }
            }}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

// =============================================
// Componente de Carta do Jogo
// =============================================
function MemoryCard({
  card,
  onClick,
  disabled,
}: {
  card: { id: string; type: 'image' | 'word'; content: string; isFlipped: boolean; isMatched: boolean };
  onClick: () => void;
  disabled: boolean;
}) {
  const isRevealed = card.isFlipped || card.isMatched;
  
  return (
    <div
      onClick={() => !disabled && !isRevealed && onClick()}
      className={`aspect-square cursor-pointer perspective-1000 ${
        disabled && !isRevealed ? 'pointer-events-none' : ''
      }`}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
          isRevealed ? 'rotate-y-180' : ''
        }`}
      >
        {/* Frente (escondida) */}
        <div
          className={`absolute inset-0 backface-hidden rounded-xl flex items-center justify-center ${
            card.isMatched
              ? 'bg-gradient-to-br from-emerald-400 to-green-500'
              : 'bg-gradient-to-br from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600'
          } shadow-lg`}
        >
          <Puzzle className="w-8 h-8 text-white/80" />
        </div>
        
        {/* Verso (conteúdo) */}
        <div
          className={`absolute inset-0 backface-hidden rotate-y-180 rounded-xl flex items-center justify-center p-2 ${
            card.isMatched
              ? 'bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-300'
              : 'bg-white border-2 border-pink-200'
          } shadow-lg`}
        >
          {card.type === 'image' ? (
            <img
              src={card.content}
              alt=""
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200?text=Erro';
              }}
            />
          ) : (
            <span className={`text-center font-bold ${
              card.content.length > 10 ? 'text-sm' : 'text-lg'
            } ${card.isMatched ? 'text-emerald-700' : 'text-slate-700'}`}>
              {card.content}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
