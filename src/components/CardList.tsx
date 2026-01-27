import { useState } from 'react';
import { useStore } from '../store/useStore';
import { FlashCard } from './FlashCard';
import type { TranslationDirection } from '../types';
import { Plus, Search, SortAsc, SortDesc, Inbox, Image as ImageIcon, Link, ArrowRight, Languages, Gamepad2, Lightbulb } from 'lucide-react';

export function CardList() {
  const { cards, selectedGroupId, groups, addCard, getCardsForReviewCount, startPlayMode } = useStore();
  
  const [isAdding, setIsAdding] = useState(false);
  const [newPortuguese, setNewPortuguese] = useState('');
  const [newEnglish, setNewEnglish] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newTips, setNewTips] = useState('');
  const [newDirection, setNewDirection] = useState<TranslationDirection>('pt-en');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [directionFilter, setDirectionFilter] = useState<'all' | 'pt-en' | 'en-pt'>('all');

  const selectedGroup = groups.find((g) => g.id === selectedGroupId);
  const groupCards = cards.filter((c) => c.groupId === selectedGroupId);

  // Contar cards por direção
  const ptEnCount = groupCards.filter(c => (c.direction || 'pt-en') === 'pt-en').length;
  const enPtCount = groupCards.filter(c => c.direction === 'en-pt').length;

  // Filtrar e ordenar cards
  const filteredCards = groupCards
    .filter(
      (card) =>
        card.portuguesePhrase.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.englishPhrase.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((card) => {
      if (directionFilter === 'all') return true;
      const cardDirection = card.direction || 'pt-en';
      return cardDirection === directionFilter;
    })
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.createdAt - b.createdAt;
      }
      return b.createdAt - a.createdAt;
    });

  const handleAddCard = () => {
    if (newPortuguese.trim() && newEnglish.trim() && selectedGroupId) {
      addCard(newPortuguese.trim(), newEnglish.trim(), selectedGroupId, newDirection, newImageUrl.trim() || undefined, newTips.trim() || undefined);
      setNewPortuguese('');
      setNewEnglish('');
      setNewImageUrl('');
      setNewTips('');
      setNewDirection('pt-en');
      setIsAdding(false);
    }
  };

  if (!selectedGroupId) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full flex items-center justify-center">
            <Inbox className="w-12 h-12 text-cyan-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">
            Selecione um grupo
          </h2>
          <p className="text-slate-500 leading-relaxed">
            Escolha um grupo na barra lateral para ver e gerenciar seus flash cards, 
            ou crie um novo grupo para começar.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">
          {selectedGroup?.name}
        </h2>
        <p className="text-slate-500">
          {groupCards.length} card{groupCards.length !== 1 ? 's' : ''} neste grupo
        </p>
      </div>

      {/* Barra de ações */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Busca */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar cards..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
          />
        </div>

        {/* Filtro de direção */}
        <div className="flex rounded-xl border border-slate-200 bg-white overflow-hidden">
          <button
            onClick={() => setDirectionFilter('all')}
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              directionFilter === 'all'
                ? 'bg-slate-800 text-white'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Todos ({groupCards.length})
          </button>
          <button
            onClick={() => setDirectionFilter('pt-en')}
            className={`px-4 py-3 text-sm font-medium transition-colors border-l border-slate-200 flex items-center gap-1.5 ${
              directionFilter === 'pt-en'
                ? 'bg-green-500 text-white'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>🇧🇷→🇺🇸</span>
            <span className="hidden sm:inline">({ptEnCount})</span>
          </button>
          <button
            onClick={() => setDirectionFilter('en-pt')}
            className={`px-4 py-3 text-sm font-medium transition-colors border-l border-slate-200 flex items-center gap-1.5 ${
              directionFilter === 'en-pt'
                ? 'bg-blue-500 text-white'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>🇺🇸→🇧🇷</span>
            <span className="hidden sm:inline">({enPtCount})</span>
          </button>
        </div>

        {/* Ordenação */}
        <button
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
        >
          {sortOrder === 'asc' ? (
            <>
              <SortAsc className="w-5 h-5" />
              <span className="hidden sm:inline">Mais antigos</span>
            </>
          ) : (
            <>
              <SortDesc className="w-5 h-5" />
              <span className="hidden sm:inline">Mais recentes</span>
            </>
          )}
        </button>

        {/* Botão Jogar - aparece se houver cards para revisar */}
        {selectedGroupId && getCardsForReviewCount(selectedGroupId) > 0 && (
          <button
            onClick={() => startPlayMode(selectedGroupId)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl hover:from-violet-600 hover:to-purple-700 transition-all shadow-lg shadow-purple-500/25"
          >
            <Gamepad2 className="w-5 h-5" />
            <span>Jogar</span>
            <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold">
              {getCardsForReviewCount(selectedGroupId)}
            </span>
          </button>
        )}

        {/* Botão adicionar */}
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg shadow-cyan-500/25"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Card</span>
        </button>
      </div>

      {/* Formulário de novo card */}
      {isAdding && (
        <div className="mb-6 p-6 bg-white rounded-2xl shadow-lg border border-slate-200 animate-fade-in">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Novo Flash Card</h3>
          <div className="space-y-4">
            {/* Toggle de direção */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2 flex items-center gap-2">
                <Languages className="w-4 h-4" />
                Direção da Tradução
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setNewDirection('pt-en')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                    newDirection === 'pt-en'
                      ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span className="font-medium">🇧🇷 PT</span>
                  <ArrowRight className="w-4 h-4" />
                  <span className="font-medium">🇺🇸 EN</span>
                </button>
                <button
                  type="button"
                  onClick={() => setNewDirection('en-pt')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                    newDirection === 'en-pt'
                      ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span className="font-medium">🇺🇸 EN</span>
                  <ArrowRight className="w-4 h-4" />
                  <span className="font-medium">🇧🇷 PT</span>
                </button>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                {newDirection === 'pt-en' 
                  ? 'Você verá a frase em Português e responderá em Inglês'
                  : 'Você verá a frase em Inglês e responderá em Português'}
              </p>
            </div>
            
            {/* Campos de frase - ordem muda conforme direção */}
            {newDirection === 'pt-en' ? (
              <>
                {/* PT primeiro (pergunta) */}
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    🇧🇷 Frase em Português <span className="text-amber-600">(pergunta)</span>
                  </label>
                  <textarea
                    value={newPortuguese}
                    onChange={(e) => setNewPortuguese(e.target.value)}
                    placeholder="Ex: Eu preciso estudar todos os dias."
                    className="w-full px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-slate-800 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 resize-none"
                    rows={2}
                    autoFocus
                  />
                </div>
                {/* EN segundo (resposta) */}
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    🇺🇸 Frase em Inglês <span className="text-cyan-600">(resposta)</span>
                  </label>
                  <textarea
                    value={newEnglish}
                    onChange={(e) => setNewEnglish(e.target.value)}
                    placeholder="Ex: I need to study every day."
                    className="w-full px-4 py-3 bg-cyan-50 border border-cyan-200 rounded-xl text-slate-800 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 resize-none"
                    rows={2}
                  />
                </div>
              </>
            ) : (
              <>
                {/* EN primeiro (pergunta) */}
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    🇺🇸 Frase em Inglês <span className="text-amber-600">(pergunta)</span>
                  </label>
                  <textarea
                    value={newEnglish}
                    onChange={(e) => setNewEnglish(e.target.value)}
                    placeholder="Ex: I need to study every day."
                    className="w-full px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-slate-800 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 resize-none"
                    rows={2}
                    autoFocus
                  />
                </div>
                {/* PT segundo (resposta) */}
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    🇧🇷 Frase em Português <span className="text-cyan-600">(resposta)</span>
                  </label>
                  <textarea
                    value={newPortuguese}
                    onChange={(e) => setNewPortuguese(e.target.value)}
                    placeholder="Ex: Eu preciso estudar todos os dias."
                    className="w-full px-4 py-3 bg-cyan-50 border border-cyan-200 rounded-xl text-slate-800 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 resize-none"
                    rows={2}
                  />
                </div>
              </>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                URL da Imagem (opcional)
              </label>
              <div className="relative">
                <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://exemplo.com/imagem.jpg"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                />
              </div>
              {newImageUrl && (
                <div className="mt-2 rounded-lg overflow-hidden border border-slate-200">
                  <img
                    src={newImageUrl}
                    alt="Preview"
                    className="w-full max-h-32 object-contain bg-slate-100"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '';
                      (e.target as HTMLImageElement).alt = 'URL inválida';
                    }}
                  />
                </div>
              )}
              <p className="mt-1 text-xs text-slate-400">
                Cole a URL de uma imagem que represente a palavra/frase em inglês
              </p>
            </div>
            {/* Campo de Dicas */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                Dicas (opcional)
              </label>
              <textarea
                value={newTips}
                onChange={(e) => setNewTips(e.target.value)}
                placeholder="Ex: Verbo irregular - Past: went, Past Participle: gone"
                className="w-full px-4 py-3 bg-amber-50/50 border border-amber-200 rounded-xl text-slate-800 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 resize-none"
                rows={2}
              />
              <p className="mt-1 text-xs text-slate-400">
                Adicione dicas, regras gramaticais ou informações úteis sobre esta palavra/frase
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewPortuguese('');
                  setNewEnglish('');
                  setNewImageUrl('');
                  setNewTips('');
                  setNewDirection('pt-en');
                }}
                className="px-5 py-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddCard}
                disabled={!newPortuguese.trim() || !newEnglish.trim()}
                className="px-5 py-2.5 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Criar Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de cards */}
      {filteredCards.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
            <Inbox className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">
            {searchTerm ? 'Nenhum card encontrado' : 'Nenhum card ainda'}
          </h3>
          <p className="text-slate-500">
            {searchTerm
              ? 'Tente uma busca diferente'
              : 'Clique em "Novo Card" para começar'}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredCards.map((card, index) => (
            <div
              key={card.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* enableSpacedRepetition=false: modo treino livre, não afeta revisão espaçada */}
              <FlashCard card={card} enableSpacedRepetition={false} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
