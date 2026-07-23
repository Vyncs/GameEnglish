import { useState } from 'react';
import { useStore } from '../store/useStore';
import { useSpeech } from '../hooks/useSpeech';
import { fuzzyCompare } from '../utils/fuzzyMatch';
import type { FlashCard as FlashCardType, TranslationDirection } from '../types';
import { LEITNER_INTERVALS } from '../types';

// Threshold de similaridade para fuzzy matching (85%)
const FUZZY_THRESHOLD = 85;
import { 
  Volume2, 
  VolumeX, 
  Pencil, 
  Trash2, 
  Check, 
  X, 
  Eye,
  EyeOff,
  Send,
  Image as ImageIcon,
  Link,
  Target,
  ArrowRight,
  Languages,
  Lightbulb
} from 'lucide-react';

interface FlashCardProps {
  card: FlashCardType;
  /** Se true, atualiza a revisão espaçada ao responder. Se false, é modo treino livre. */
  enableSpacedRepetition?: boolean;
}

export function FlashCard({ card, enableSpacedRepetition = false }: FlashCardProps) {
  const { updateCard, deleteCard, reviewCard } = useStore();
  const { speak, isSpeaking, isSupported } = useSpeech();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editPortuguese, setEditPortuguese] = useState(card.portuguesePhrase);
  const [editEnglish, setEditEnglish] = useState(card.englishPhrase);
  const [editImageUrl, setEditImageUrl] = useState(card.imageUrl || '');
  const [editTips, setEditTips] = useState(card.tips || '');
  const [editDirection, setEditDirection] = useState<TranslationDirection>(card.direction || 'pt-en');
  
  // Determina qual frase é a pergunta e qual é a resposta baseado na direção
  const direction = card.direction || 'pt-en';
  const questionPhrase = direction === 'pt-en' ? card.portuguesePhrase : card.englishPhrase;
  const answerPhrase = direction === 'pt-en' ? card.englishPhrase : card.portuguesePhrase;
  const questionLang = direction === 'pt-en' ? 'Português' : 'Inglês';
  const answerLang = direction === 'pt-en' ? 'Inglês' : 'Português';
  const questionFlag = direction === 'pt-en' ? '🇧🇷' : '🇺🇸';
  const answerFlag = direction === 'pt-en' ? '🇺🇸' : '🇧🇷';
  
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleSave = () => {
    if (editPortuguese.trim() && editEnglish.trim()) {
      updateCard(card.id, editPortuguese.trim(), editEnglish.trim(), editDirection, editImageUrl.trim() || undefined, editTips.trim() || undefined);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditPortuguese(card.portuguesePhrase);
    setEditEnglish(card.englishPhrase);
    setEditImageUrl(card.imageUrl || '');
    setEditTips(card.tips || '');
    setEditDirection(card.direction || 'pt-en');
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm('Tem certeza que deseja excluir este card?')) {
      deleteCard(card.id);
    }
  };

  const handleSubmitAnswer = () => {
    // Usar fuzzy matching para comparar respostas
    const result = fuzzyCompare(userAnswer, answerPhrase, FUZZY_THRESHOLD);
    const correct = result.isAcceptable;
    
    setIsCorrect(correct);
    setHasSubmitted(true);
    setShowAnswer(true);
    
    // Atualizar progresso do card (spaced repetition) - apenas no modo Jogar
    if (enableSpacedRepetition) {
      reviewCard(card.id, correct);
    }
    
    // Tocar áudio automaticamente (sempre em inglês)
    if (isSupported) {
      speak(card.englishPhrase, 'en-US');
    }
  };

  const handleReset = () => {
    setUserAnswer('');
    setShowAnswer(false);
    setHasSubmitted(false);
    setIsCorrect(null);
  };

  const handleSpeak = () => {
    speak(card.englishPhrase, 'en-US');
  };

  // Função para destacar diferenças entre a resposta do usuário e a correta
  const renderComparison = () => {
    if (!hasSubmitted) return null;

    const userWords = userAnswer.trim().split(' ');
    const correctWords = answerPhrase.trim().split(' ');

    return (
      <div className="mt-4 space-y-3 animate-fade-in">
        {/* Resposta do usuário */}
        <div className={`p-3 rounded-xl ${isCorrect ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
          <p className="text-xs font-medium text-tertiary mb-1">Sua resposta:</p>
          <p className={`font-medium ${isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
            {userWords.map((word, i) => {
              const isWrong = word.toLowerCase() !== (correctWords[i]?.toLowerCase() || '');
              return (
                <span
                  key={i}
                  className={isWrong && !isCorrect ? 'bg-red-200 px-1 rounded' : ''}
                >
                  {word}{' '}
                </span>
              );
            })}
          </p>
        </div>

        {/* Resposta correta */}
        <div className="p-3 rounded-xl bg-surface-2 border border-line">
          <p className="text-xs font-medium text-tertiary mb-1">Resposta correta ({answerFlag} {answerLang}):</p>
          <p className="font-medium text-secondary">{answerPhrase}</p>
        </div>

        {/* Imagem associada */}
        {card.imageUrl && (
          <div className="rounded-xl overflow-hidden border border-line">
            <div className="p-2 bg-surface-2 border-b border-line flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-faint" />
              <span className="text-xs font-medium text-tertiary">Imagem associada</span>
            </div>
            <img
              src={card.imageUrl}
              alt={card.englishPhrase}
              className="w-full max-h-40 object-contain bg-surface"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Dicas */}
        {card.tips && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
            <div className="flex items-center gap-2 mb-1">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <p className="text-xs font-medium text-amber-700">Dica</p>
            </div>
            <p className="text-sm text-amber-800">{card.tips}</p>
          </div>
        )}
      </div>
    );
  };

  if (isEditing) {
    return (
      <div className="bg-surface rounded-2xl shadow-lg border border-line p-6 animate-fade-in">
        <div className="space-y-4">
          {/* Toggle de direção */}
          <div>
            <label className="block text-sm font-medium text-secondary mb-2 flex items-center gap-2">
              <Languages className="w-4 h-4" />
              Direção da Tradução
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditDirection('pt-en')}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl border-2 transition-all text-sm ${
                  editDirection === 'pt-en'
                    ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                    : 'border-line bg-surface-2 text-secondary hover:border-slate-300'
                }`}
              >
                <span className="font-medium">🇧🇷 PT</span>
                <ArrowRight className="w-3 h-3" />
                <span className="font-medium">🇺🇸 EN</span>
              </button>
              <button
                type="button"
                onClick={() => setEditDirection('en-pt')}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl border-2 transition-all text-sm ${
                  editDirection === 'en-pt'
                    ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                    : 'border-line bg-surface-2 text-secondary hover:border-slate-300'
                }`}
              >
                <span className="font-medium">🇺🇸 EN</span>
                <ArrowRight className="w-3 h-3" />
                <span className="font-medium">🇧🇷 PT</span>
              </button>
            </div>
          </div>
          
          {/* Campos de frase - ordem muda conforme direção */}
          {editDirection === 'pt-en' ? (
            <>
              {/* PT primeiro (pergunta) */}
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  🇧🇷 Frase em Português <span className="text-amber-600">(pergunta)</span>
                </label>
                <textarea
                  value={editPortuguese}
                  onChange={(e) => setEditPortuguese(e.target.value)}
                  className="w-full px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-primary focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 resize-none"
                  rows={2}
                  autoFocus
                />
              </div>
              {/* EN segundo (resposta) */}
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  🇺🇸 Frase em Inglês <span className="text-cyan-600">(resposta)</span>
                </label>
                <textarea
                  value={editEnglish}
                  onChange={(e) => setEditEnglish(e.target.value)}
                  className="w-full px-4 py-3 bg-cyan-50 border border-cyan-200 rounded-xl text-primary focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 resize-none"
                  rows={2}
                />
              </div>
            </>
          ) : (
            <>
              {/* EN primeiro (pergunta) */}
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  🇺🇸 Frase em Inglês <span className="text-amber-600">(pergunta)</span>
                </label>
                <textarea
                  value={editEnglish}
                  onChange={(e) => setEditEnglish(e.target.value)}
                  className="w-full px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-primary focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 resize-none"
                  rows={2}
                  autoFocus
                />
              </div>
              {/* PT segundo (resposta) */}
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  🇧🇷 Frase em Português <span className="text-cyan-600">(resposta)</span>
                </label>
                <textarea
                  value={editPortuguese}
                  onChange={(e) => setEditPortuguese(e.target.value)}
                  className="w-full px-4 py-3 bg-cyan-50 border border-cyan-200 rounded-xl text-primary focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 resize-none"
                  rows={2}
                />
              </div>
            </>
          )}
          <div>
            <label className="block text-sm font-medium text-secondary mb-2 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              URL da Imagem (opcional)
            </label>
            <div className="relative">
              <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-faint" />
              <input
                type="url"
                value={editImageUrl}
                onChange={(e) => setEditImageUrl(e.target.value)}
                placeholder="https://exemplo.com/imagem.jpg"
                className="w-full pl-10 pr-4 py-3 bg-surface-2 border border-line rounded-xl text-primary focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              />
            </div>
            {editImageUrl && (
              <div className="mt-2 rounded-lg overflow-hidden border border-line">
                <img
                  src={editImageUrl}
                  alt="Preview"
                  className="w-full max-h-32 object-contain bg-surface-2"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '';
                    (e.target as HTMLImageElement).alt = 'Imagem inválida';
                  }}
                />
              </div>
            )}
          </div>
          {/* Campo de Dicas */}
          <div>
            <label className="block text-sm font-medium text-secondary mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              Dicas (opcional)
            </label>
            <textarea
              value={editTips}
              onChange={(e) => setEditTips(e.target.value)}
              placeholder="Ex: Verbo irregular - Past: went, Past Participle: gone"
              className="w-full px-4 py-3 bg-amber-50/50 border border-amber-200 rounded-xl text-primary focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 resize-none"
              rows={2}
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-surface-2 text-secondary rounded-xl hover:bg-surface-2 transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 transition-colors flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Salvar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-surface rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
        hasSubmitted
          ? isCorrect
            ? 'border-emerald-300 animate-pulse-success'
            : 'border-red-300 animate-pulse-error'
          : 'border-line hover:border-cyan-200'
      }`}
    >
      {/* Header do card */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-line">
        <div className="flex items-center gap-3">
          {/* Nível do card */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-surface-2 rounded-lg">
            <Target className="w-3.5 h-3.5 text-tertiary" />
            <span className="text-xs font-medium text-secondary">Nv.{card.level}</span>
          </div>
          
          {/* Ícone de áudio */}
          {isSupported && (
            <button
              onClick={handleSpeak}
              disabled={isSpeaking}
              className={`p-2 rounded-xl transition-all ${
                isSpeaking
                  ? 'bg-cyan-100 text-cyan-600'
                  : 'bg-surface-2 text-tertiary hover:bg-cyan-50 hover:text-cyan-600'
              }`}
              title="Ouvir pronúncia"
            >
              {isSpeaking ? (
                <Volume2 className="w-5 h-5 animate-pulse" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
          )}
          {!isSupported && (
            <div className="p-2 rounded-xl bg-surface-2 text-faint" title="Áudio não suportado">
              <VolumeX className="w-5 h-5" />
            </div>
          )}
          
          {/* Indicador de imagem */}
          {card.imageUrl && (
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-500" title="Card com imagem">
              <ImageIcon className="w-4 h-4" />
            </div>
          )}
        </div>
        
        {/* Botões de ação */}
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 rounded-xl bg-surface-2 text-tertiary hover:bg-blue-50 hover:text-blue-600 transition-colors"
            title="Editar"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-xl bg-surface-2 text-tertiary hover:bg-red-50 hover:text-red-600 transition-colors"
            title="Excluir"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Conteúdo do card */}
      <div className="p-6">
        {/* Indicador de direção */}
        <div className="flex items-center gap-2 mb-4 text-xs text-tertiary">
          <Languages className="w-3.5 h-3.5" />
          <span>{questionFlag} {questionLang}</span>
          <ArrowRight className="w-3 h-3" />
          <span>{answerFlag} {answerLang}</span>
        </div>
        
        {/* Frase de pergunta */}
        <div className="mb-6">
          <span className="inline-block px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-lg mb-2">
            {questionFlag} {questionLang}
          </span>
          <p className="text-lg text-primary font-medium leading-relaxed">
            {questionPhrase}
          </p>
        </div>

        {/* Campo de resposta */}
        {!hasSubmitted && (
          <div className="mb-4">
            <span className="inline-block px-2 py-1 bg-cyan-100 text-cyan-700 text-xs font-medium rounded-lg mb-2">
              Sua resposta em {answerLang} {answerFlag}
            </span>
            <div className="relative">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && userAnswer.trim()) {
                    handleSubmitAnswer();
                  }
                }}
                placeholder="Digite sua resposta..."
                className="w-full px-4 py-3 pr-12 bg-surface-2 border border-line rounded-xl text-primary focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              />
              <button
                onClick={handleSubmitAnswer}
                disabled={!userAnswer.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Comparação de respostas */}
        {renderComparison()}

        {/* Info de próxima revisão - só mostra no modo Jogar */}
        {hasSubmitted && enableSpacedRepetition && (
          <div className="mt-3 text-xs text-tertiary text-center">
            Próxima revisão em {LEITNER_INTERVALS[isCorrect ? Math.min(card.level + 1, 5) : 1]} dia{LEITNER_INTERVALS[isCorrect ? Math.min(card.level + 1, 5) : 1] !== 1 ? 's' : ''}
          </div>
        )}

        {/* Botão para ver/esconder resposta */}
        <div className="mt-4 flex gap-3">
          {!hasSubmitted && (
            <button
              onClick={() => setShowAnswer(!showAnswer)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-surface-2 text-secondary rounded-xl hover:bg-surface-2 transition-colors"
            >
              {showAnswer ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  Esconder resposta
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  Ver resposta
                </>
              )}
            </button>
          )}
          
          {hasSubmitted && (
            <button
              onClick={handleReset}
              className="flex-1 px-4 py-2.5 bg-surface-2 text-secondary rounded-xl hover:bg-surface-2 transition-colors"
            >
              Tentar novamente
            </button>
          )}
        </div>

        {/* Resposta correta (quando clica em "ver resposta" sem submeter) */}
        {showAnswer && !hasSubmitted && (
          <div className="mt-4 space-y-3 animate-fade-in">
            <div className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-100">
              <span className="inline-block px-2 py-1 bg-cyan-100 text-cyan-700 text-xs font-medium rounded-lg mb-2">
                {answerFlag} {answerLang}
              </span>
              <p className="text-lg text-primary font-medium">{answerPhrase}</p>
            </div>
            
            {/* Imagem quando visualiza resposta */}
            {card.imageUrl && (
              <div className="rounded-xl overflow-hidden border border-line">
                <img
                  src={card.imageUrl}
                  alt={card.englishPhrase}
                  className="w-full max-h-40 object-contain bg-surface"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Dicas quando visualiza resposta */}
            {card.tips && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                <div className="flex items-center gap-2 mb-1">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <p className="text-xs font-medium text-amber-700">Dica</p>
                </div>
                <p className="text-sm text-amber-800">{card.tips}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
