import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { useSpeech } from '../hooks/useSpeech';
import type { FlashCard } from '../types';
import { LEITNER_INTERVALS } from '../types';
import { 
  Volume2, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  Trophy,
  RotateCcw,
  Home,
  Send,
  Flame,
  Target,
  Image as ImageIcon,
  Languages
} from 'lucide-react';

export function ReviewSession() {
  const { 
    getCardsForReview, 
    selectedGroupId, 
    groups,
    reviewCard,
    goToHome
  } = useStore();
  const { speak, isSpeaking, isSupported } = useSpeech();

  const [cardsToReview, setCardsToReview] = useState<FlashCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [sessionResults, setSessionResults] = useState<{ correct: number; incorrect: number }>({ correct: 0, incorrect: 0 });
  const [isComplete, setIsComplete] = useState(false);

  const selectedGroup = groups.find(g => g.id === selectedGroupId);

  // Carregar cards para revisão
  useEffect(() => {
    const cards = getCardsForReview(selectedGroupId || undefined);
    setCardsToReview(cards);
    setCurrentIndex(0);
    setIsComplete(cards.length === 0);
  }, [selectedGroupId, getCardsForReview]);

  const currentCard = cardsToReview[currentIndex];
  
  // Determina a direção do card atual
  const direction = currentCard?.direction || 'pt-en';
  const questionPhrase = direction === 'pt-en' ? currentCard?.portuguesePhrase : currentCard?.englishPhrase;
  const answerPhrase = direction === 'pt-en' ? currentCard?.englishPhrase : currentCard?.portuguesePhrase;
  const questionLang = direction === 'pt-en' ? 'Português' : 'Inglês';
  const answerLang = direction === 'pt-en' ? 'Inglês' : 'Português';
  const questionFlag = direction === 'pt-en' ? '🇧🇷' : '🇺🇸';
  const answerFlag = direction === 'pt-en' ? '🇺🇸' : '🇧🇷';

  const handleSubmit = () => {
    if (!currentCard || !answerPhrase) return;

    const normalizedUser = userAnswer.trim().toLowerCase();
    const normalizedCorrect = answerPhrase.trim().toLowerCase();
    const correct = normalizedUser === normalizedCorrect;

    setIsCorrect(correct);
    setShowResult(true);
    
    // Atualizar estatísticas da sessão
    setSessionResults(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      incorrect: prev.incorrect + (correct ? 0 : 1),
    }));

    // Atualizar o card no store
    reviewCard(currentCard.id, correct);

    // Tocar áudio automaticamente (sempre em inglês)
    if (isSupported && currentCard.englishPhrase) {
      speak(currentCard.englishPhrase, 'en-US');
    }
  };

  const handleNext = () => {
    if (currentIndex < cardsToReview.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setUserAnswer('');
      setShowResult(false);
      setIsCorrect(null);
    } else {
      setIsComplete(true);
    }
  };

  const handleRestart = () => {
    const cards = getCardsForReview(selectedGroupId || undefined);
    setCardsToReview(cards);
    setCurrentIndex(0);
    setUserAnswer('');
    setShowResult(false);
    setIsCorrect(null);
    setSessionResults({ correct: 0, incorrect: 0 });
    setIsComplete(cards.length === 0);
  };

  // Tela quando não há cards para revisar
  if (cardsToReview.length === 0 && !isComplete) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md animate-fade-in">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center">
            <Trophy className="w-12 h-12 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">
            Parabéns! 🎉
          </h2>
          <p className="text-slate-500 mb-6 leading-relaxed">
            {selectedGroup 
              ? `Você revisou todos os cards de "${selectedGroup.name}" por hoje!`
              : 'Você não tem cards para revisar agora!'
            }
          </p>
          <button
            onClick={goToHome}
            className="px-6 py-3 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 transition-colors inline-flex items-center gap-2"
          >
            <Home className="w-5 h-5" />
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  // Tela de resultados finais
  if (isComplete) {
    const total = sessionResults.correct + sessionResults.incorrect;
    const percentage = total > 0 ? Math.round((sessionResults.correct / total) * 100) : 0;

    return (
      <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-lg mx-auto animate-fade-in">
          <div className="text-center mb-8">
            <div className={`w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center shadow-lg ${
              percentage >= 70
                ? 'bg-gradient-to-br from-emerald-400 to-green-500 shadow-green-500/30'
                : percentage >= 40
                ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-orange-500/30'
                : 'bg-gradient-to-br from-red-400 to-rose-500 shadow-rose-500/30'
            }`}>
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Sessão Completa!
            </h1>
            <p className="text-slate-500">
              {selectedGroup ? `Grupo: ${selectedGroup.name}` : 'Todos os grupos'}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-6">
            <div className="flex items-center justify-center gap-8 mb-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-emerald-500">{sessionResults.correct}</p>
                <p className="text-slate-500">Acertos</p>
              </div>
              <div className="w-px h-16 bg-slate-200" />
              <div className="text-center">
                <p className="text-4xl font-bold text-red-500">{sessionResults.incorrect}</p>
                <p className="text-slate-500">Erros</p>
              </div>
              <div className="w-px h-16 bg-slate-200" />
              <div className="text-center">
                <p className={`text-4xl font-bold ${
                  percentage >= 70 ? 'text-emerald-500' : percentage >= 40 ? 'text-amber-500' : 'text-red-500'
                }`}>
                  {percentage}%
                </p>
                <p className="text-slate-500">Aproveitamento</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-sm text-slate-600 text-center">
                {percentage >= 70 
                  ? '🎉 Excelente! Continue assim!' 
                  : percentage >= 40 
                  ? '💪 Bom progresso! Continue praticando.' 
                  : '📚 Não desanime! A prática leva à perfeição.'}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleRestart}
              className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Revisar Novamente
            </button>
            <button
              onClick={goToHome}
              className="flex-1 py-3 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Voltar ao Início
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Tela de revisão
  return (
    <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Flame className="w-6 h-6 text-orange-500" />
              Sessão de Revisão
            </h1>
            <p className="text-slate-500">
              {selectedGroup ? selectedGroup.name : 'Todos os grupos'}
            </p>
          </div>
          <button
            onClick={goToHome}
            className="px-4 py-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Sair
          </button>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2 text-sm">
            <span className="text-slate-500">Progresso</span>
            <span className="font-medium text-slate-700">
              {currentIndex + 1} / {cardsToReview.length}
            </span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
              style={{ width: `${((currentIndex + (showResult ? 1 : 0)) / cardsToReview.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Card atual */}
        {currentCard && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden animate-fade-in">
            {/* Header do card */}
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  <span className="font-medium">Nível {currentCard.level}</span>
                </div>
                <span className="text-sm text-cyan-100">
                  Próxima revisão: {LEITNER_INTERVALS[currentCard.level]} dia{LEITNER_INTERVALS[currentCard.level] !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Conteúdo */}
            <div className="p-6">
              {/* Indicador de direção */}
              <div className="flex items-center gap-2 mb-4 text-xs text-slate-500">
                <Languages className="w-3.5 h-3.5" />
                <span>{questionFlag} {questionLang}</span>
                <ArrowRight className="w-3 h-3" />
                <span>{answerFlag} {answerLang}</span>
              </div>
              
              {/* Frase de pergunta */}
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-lg mb-3">
                  Traduza para {answerLang.toLowerCase()} {answerFlag}
                </span>
                <p className="text-xl text-slate-800 font-medium leading-relaxed">
                  {questionPhrase}
                </p>
              </div>

              {/* Input de resposta */}
              {!showResult && (
                <div className="mb-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && userAnswer.trim()) {
                          handleSubmit();
                        }
                      }}
                      placeholder="Digite sua resposta em inglês..."
                      className="w-full px-4 py-4 pr-14 bg-slate-50 border-2 border-slate-200 rounded-xl text-lg text-slate-800 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                      autoFocus
                    />
                    <button
                      onClick={handleSubmit}
                      disabled={!userAnswer.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Resultado */}
              {showResult && (
                <div className="space-y-4 animate-fade-in">
                  {/* Feedback */}
                  <div className={`p-4 rounded-xl flex items-center gap-3 ${
                    isCorrect
                      ? 'bg-emerald-50 border-2 border-emerald-200'
                      : 'bg-red-50 border-2 border-red-200'
                  }`}>
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-8 h-8 text-emerald-500 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-emerald-700">Correto! 🎉</p>
                          <p className="text-sm text-emerald-600">
                            Subiu para o nível {Math.min(currentCard.level + 1, 5)}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-8 h-8 text-red-500 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-red-700">Incorreto</p>
                          <p className="text-sm text-red-600">Voltou para o nível 1</p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Sua resposta */}
                  {!isCorrect && (
                    <div className="p-4 rounded-xl bg-red-50">
                      <p className="text-xs font-medium text-slate-500 mb-1">Sua resposta:</p>
                      <p className="font-medium text-red-700">{userAnswer || '(vazio)'}</p>
                    </div>
                  )}

                  {/* Resposta correta */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-slate-500 mb-1">Resposta correta ({answerFlag} {answerLang}):</p>
                        <p className="font-medium text-slate-800 text-lg">{answerPhrase}</p>
                      </div>
                      {isSupported && (
                        <button
                          onClick={() => speak(currentCard.englishPhrase, 'en-US')}
                          disabled={isSpeaking}
                          className={`p-3 rounded-xl transition-all ${
                            isSpeaking
                              ? 'bg-cyan-100 text-cyan-600'
                              : 'bg-slate-100 text-slate-500 hover:bg-cyan-50 hover:text-cyan-600'
                          }`}
                          title="Ouvir em inglês"
                        >
                          <Volume2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Imagem associada */}
                  {currentCard.imageUrl && (
                    <div className="rounded-xl overflow-hidden border border-slate-200">
                      <div className="p-2 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-medium text-slate-500">Imagem associada</span>
                      </div>
                      <img
                        src={currentCard.imageUrl}
                        alt={currentCard.englishPhrase}
                        className="w-full max-h-48 object-contain bg-white"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  {/* Botão próximo */}
                  <button
                    onClick={handleNext}
                    className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-lg font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-3"
                  >
                    {currentIndex < cardsToReview.length - 1 ? (
                      <>
                        Próximo Card
                        <ArrowRight className="w-5 h-5" />
                      </>
                    ) : (
                      <>
                        Ver Resultados
                        <Trophy className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stats da sessão */}
        <div className="mt-6 flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-emerald-600">
            <CheckCircle className="w-4 h-4" />
            <span>{sessionResults.correct} acertos</span>
          </div>
          <div className="flex items-center gap-2 text-red-500">
            <XCircle className="w-4 h-4" />
            <span>{sessionResults.incorrect} erros</span>
          </div>
        </div>
      </div>
    </div>
  );
}
