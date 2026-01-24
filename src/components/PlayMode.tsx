import { useState, useEffect, useCallback } from 'react';
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
  Target,
  Image as ImageIcon,
  Languages,
  Zap,
  Star,
  ChevronRight,
  X
} from 'lucide-react';

export function PlayMode() {
  const { 
    getCardsForReview, 
    selectedGroupId, 
    groups,
    reviewCard,
    goToHome
  } = useStore();
  const { speak, isSpeaking, isSupported } = useSpeech();

  const [cardsToPlay, setCardsToPlay] = useState<FlashCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0, streak: 0, maxStreak: 0 });
  const [isComplete, setIsComplete] = useState(false);
  const [showStreakAnimation, setShowStreakAnimation] = useState(false);

  const selectedGroup = groups.find(g => g.id === selectedGroupId);

  // Carregar cards para jogar
  useEffect(() => {
    const cards = getCardsForReview(selectedGroupId || undefined);
    // Embaralhar os cards para variar a ordem
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCardsToPlay(shuffled);
    setCurrentIndex(0);
    setIsComplete(shuffled.length === 0);
  }, [selectedGroupId, getCardsForReview]);

  const currentCard = cardsToPlay[currentIndex];
  
  // Determina a direção do card atual
  const direction = currentCard?.direction || 'pt-en';
  const questionPhrase = direction === 'pt-en' ? currentCard?.portuguesePhrase : currentCard?.englishPhrase;
  const answerPhrase = direction === 'pt-en' ? currentCard?.englishPhrase : currentCard?.portuguesePhrase;
  const questionLang = direction === 'pt-en' ? 'Português' : 'Inglês';
  const answerLang = direction === 'pt-en' ? 'Inglês' : 'Português';
  const questionFlag = direction === 'pt-en' ? '🇧🇷' : '🇺🇸';
  const answerFlag = direction === 'pt-en' ? '🇺🇸' : '🇧🇷';

  const handleSubmit = useCallback(() => {
    if (!currentCard || !answerPhrase) return;

    const normalizedUser = userAnswer.trim().toLowerCase();
    const normalizedCorrect = answerPhrase.trim().toLowerCase();
    const correct = normalizedUser === normalizedCorrect;

    setIsCorrect(correct);
    setShowResult(true);
    
    // Atualizar estatísticas da sessão
    setSessionStats(prev => {
      const newStreak = correct ? prev.streak + 1 : 0;
      const newMaxStreak = Math.max(prev.maxStreak, newStreak);
      
      // Mostrar animação de streak a cada 3 acertos seguidos
      if (correct && newStreak > 0 && newStreak % 3 === 0) {
        setShowStreakAnimation(true);
        setTimeout(() => setShowStreakAnimation(false), 1500);
      }
      
      return {
        correct: prev.correct + (correct ? 1 : 0),
        incorrect: prev.incorrect + (correct ? 0 : 1),
        streak: newStreak,
        maxStreak: newMaxStreak,
      };
    });

    // Atualizar o card no store (spaced repetition)
    reviewCard(currentCard.id, correct);

    // Tocar áudio automaticamente (sempre em inglês)
    if (isSupported && currentCard.englishPhrase) {
      speak(currentCard.englishPhrase, 'en-US');
    }
  }, [currentCard, answerPhrase, userAnswer, reviewCard, isSupported, speak]);

  const handleNext = () => {
    if (currentIndex < cardsToPlay.length - 1) {
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
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCardsToPlay(shuffled);
    setCurrentIndex(0);
    setUserAnswer('');
    setShowResult(false);
    setIsCorrect(null);
    setSessionStats({ correct: 0, incorrect: 0, streak: 0, maxStreak: 0 });
    setIsComplete(shuffled.length === 0);
  };

  // Tela quando não há cards para jogar
  if (cardsToPlay.length === 0 && !isComplete) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 min-h-screen">
        <div className="text-center max-w-md animate-fade-in">
          <div className="w-28 h-28 mx-auto mb-6 bg-gradient-to-br from-emerald-400 to-green-500 rounded-3xl flex items-center justify-center shadow-lg shadow-green-500/30">
            <Trophy className="w-14 h-14 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-3">
            Parabéns! 🎉
          </h2>
          <p className="text-lg text-slate-500 mb-8 leading-relaxed">
            {selectedGroup 
              ? `Você completou todos os cards de "${selectedGroup.name}" por hoje!`
              : 'Você não tem cards para revisar agora. Volte mais tarde!'
            }
          </p>
          <button
            onClick={goToHome}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-lg font-semibold rounded-2xl hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg shadow-cyan-500/25 inline-flex items-center gap-3"
          >
            <Home className="w-6 h-6" />
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  // Tela de resultados finais
  if (isComplete) {
    const total = sessionStats.correct + sessionStats.incorrect;
    const percentage = total > 0 ? Math.round((sessionStats.correct / total) * 100) : 0;

    return (
      <div className="flex-1 flex items-center justify-center p-6 min-h-screen">
        <div className="max-w-lg w-full animate-fade-in">
          {/* Header com resultado */}
          <div className="text-center mb-8">
            <div className={`w-28 h-28 mx-auto mb-6 rounded-3xl flex items-center justify-center shadow-xl ${
              percentage >= 70
                ? 'bg-gradient-to-br from-emerald-400 to-green-500 shadow-green-500/30'
                : percentage >= 40
                ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-orange-500/30'
                : 'bg-gradient-to-br from-red-400 to-rose-500 shadow-rose-500/30'
            }`}>
              {percentage >= 70 ? (
                <Trophy className="w-14 h-14 text-white" />
              ) : percentage >= 40 ? (
                <Star className="w-14 h-14 text-white" />
              ) : (
                <Target className="w-14 h-14 text-white" />
              )}
            </div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">
              {percentage >= 70 ? 'Incrível! 🎉' : percentage >= 40 ? 'Bom trabalho! 💪' : 'Continue praticando! 📚'}
            </h1>
            <p className="text-lg text-slate-500">
              {selectedGroup ? `Grupo: ${selectedGroup.name}` : 'Todos os grupos'}
            </p>
          </div>

          {/* Card de estatísticas */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 mb-6">
            {/* Score principal */}
            <div className="flex items-center justify-center gap-8 mb-8">
              <div className="text-center">
                <p className="text-5xl font-bold text-emerald-500">{sessionStats.correct}</p>
                <p className="text-slate-500 font-medium">Acertos</p>
              </div>
              <div className="w-px h-20 bg-slate-200" />
              <div className="text-center">
                <p className="text-5xl font-bold text-red-500">{sessionStats.incorrect}</p>
                <p className="text-slate-500 font-medium">Erros</p>
              </div>
              <div className="w-px h-20 bg-slate-200" />
              <div className="text-center">
                <p className={`text-5xl font-bold ${
                  percentage >= 70 ? 'text-emerald-500' : percentage >= 40 ? 'text-amber-500' : 'text-red-500'
                }`}>
                  {percentage}%
                </p>
                <p className="text-slate-500 font-medium">Aproveitamento</p>
              </div>
            </div>

            {/* Streak */}
            {sessionStats.maxStreak > 0 && (
              <div className="flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 mb-6">
                <Zap className="w-6 h-6 text-amber-500" />
                <span className="text-lg font-semibold text-amber-700">
                  Melhor sequência: {sessionStats.maxStreak} acertos seguidos!
                </span>
              </div>
            )}

            {/* Mensagem motivacional */}
            <div className="p-4 bg-slate-50 rounded-2xl">
              <p className="text-center text-slate-600">
                {percentage >= 90 
                  ? '🌟 Desempenho excepcional! Você está dominando o conteúdo!' 
                  : percentage >= 70 
                  ? '🎯 Ótimo progresso! Continue assim e logo dominará tudo!' 
                  : percentage >= 40 
                  ? '💪 Bom esforço! A prática constante leva à perfeição.' 
                  : '📖 Não desanime! Cada erro é uma oportunidade de aprender.'}
              </p>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex gap-4">
            <button
              onClick={handleRestart}
              className="flex-1 py-4 bg-white border-2 border-slate-200 text-slate-700 text-lg font-semibold rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Jogar Novamente
            </button>
            <button
              onClick={goToHome}
              className="flex-1 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-lg font-semibold rounded-2xl hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Início
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Tela de jogo
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animação de streak */}
      {showStreakAnimation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="animate-bounce">
            <div className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl shadow-2xl">
              <Zap className="w-10 h-10 text-white" />
              <span className="text-3xl font-bold text-white">
                {sessionStats.streak}x Streak! 🔥
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <button
          onClick={goToHome}
          className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-4">
          {/* Streak atual */}
          {sessionStats.streak > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl border border-amber-500/30">
              <Zap className="w-5 h-5 text-amber-400" />
              <span className="font-bold text-amber-400">{sessionStats.streak}x</span>
            </div>
          )}
          
          {/* Progresso */}
          <div className="flex items-center gap-3 px-4 py-2 bg-white/10 rounded-xl">
            <span className="text-white/60 text-sm">Progresso</span>
            <span className="font-bold text-white">
              {currentIndex + 1} / {cardsToPlay.length}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-emerald-400">{sessionStats.correct}</span>
          <span className="text-white/40">|</span>
          <XCircle className="w-4 h-4 text-red-400" />
          <span className="font-bold text-red-400">{sessionStats.incorrect}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-4 mb-6">
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500 ease-out"
            style={{ width: `${((currentIndex + (showResult ? 1 : 0)) / cardsToPlay.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Card central */}
      <div className="flex-1 flex items-center justify-center px-4 pb-8">
        {currentCard && (
          <div className="w-full max-w-2xl animate-fade-in">
            <div className={`bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 ${
              showResult 
                ? isCorrect 
                  ? 'ring-4 ring-emerald-400 ring-offset-4 ring-offset-slate-900' 
                  : 'ring-4 ring-red-400 ring-offset-4 ring-offset-slate-900'
                : ''
            }`}>
              {/* Indicador de nível e direção */}
              <div className="bg-gradient-to-r from-slate-100 to-slate-50 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 rounded-lg">
                    <Target className="w-4 h-4 text-slate-600" />
                    <span className="text-sm font-medium text-slate-600">Nível {currentCard.level}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Languages className="w-4 h-4" />
                    <span>{questionFlag}</span>
                    <ArrowRight className="w-3 h-3" />
                    <span>{answerFlag}</span>
                  </div>
                </div>
                {currentCard.imageUrl && (
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <ImageIcon className="w-4 h-4 text-indigo-600" />
                  </div>
                )}
              </div>

              {/* Conteúdo principal */}
              <div className="p-8">
                {/* Pergunta */}
                <div className="text-center mb-8">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 text-sm font-medium rounded-xl mb-4">
                    <span>{questionFlag}</span>
                    {questionLang}
                  </span>
                  <p className="text-3xl font-bold text-slate-800 leading-relaxed">
                    {questionPhrase}
                  </p>
                </div>

                {/* Input de resposta */}
                {!showResult && (
                  <div className="space-y-4">
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
                        placeholder={`Digite em ${answerLang.toLowerCase()}...`}
                        className="w-full px-6 py-5 pr-16 bg-slate-50 border-2 border-slate-200 rounded-2xl text-xl text-slate-800 text-center focus:outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                        autoFocus
                      />
                      <button
                        onClick={handleSubmit}
                        disabled={!userAnswer.trim()}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                      >
                        <Send className="w-6 h-6" />
                      </button>
                    </div>
                    <p className="text-center text-sm text-slate-400">
                      Pressione Enter para enviar
                    </p>
                  </div>
                )}

                {/* Resultado */}
                {showResult && (
                  <div className="space-y-6 animate-fade-in">
                    {/* Feedback visual grande */}
                    <div className={`p-6 rounded-2xl flex items-center justify-center gap-4 ${
                      isCorrect
                        ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200'
                        : 'bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200'
                    }`}>
                      {isCorrect ? (
                        <>
                          <CheckCircle className="w-12 h-12 text-emerald-500" />
                          <div>
                            <p className="text-2xl font-bold text-emerald-700">Correto! 🎉</p>
                            <p className="text-emerald-600">
                              +1 nível → Nível {Math.min(currentCard.level + 1, 5)}
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-12 h-12 text-red-500" />
                          <div>
                            <p className="text-2xl font-bold text-red-700">Ops! Quase lá</p>
                            <p className="text-red-600">Voltou para o nível 1</p>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Comparação de respostas */}
                    {!isCorrect && (
                      <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                        <p className="text-sm font-medium text-red-600 mb-1">Sua resposta:</p>
                        <p className="text-lg text-red-700">{userAnswer || '(vazio)'}</p>
                      </div>
                    )}

                    {/* Resposta correta */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-500 mb-1">
                            Resposta correta ({answerFlag} {answerLang}):
                          </p>
                          <p className="text-xl font-semibold text-slate-800">{answerPhrase}</p>
                        </div>
                        {isSupported && (
                          <button
                            onClick={() => speak(currentCard.englishPhrase, 'en-US')}
                            disabled={isSpeaking}
                            className={`p-4 rounded-xl transition-all ${
                              isSpeaking
                                ? 'bg-cyan-100 text-cyan-600'
                                : 'bg-slate-100 text-slate-500 hover:bg-cyan-50 hover:text-cyan-600'
                            }`}
                            title="Ouvir pronúncia em inglês"
                          >
                            <Volume2 className="w-6 h-6" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Imagem associada */}
                    {currentCard.imageUrl && (
                      <div className="rounded-xl overflow-hidden border border-slate-200">
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

                    {/* Próxima revisão */}
                    <p className="text-center text-sm text-slate-500">
                      Próxima revisão em {LEITNER_INTERVALS[isCorrect ? Math.min(currentCard.level + 1, 5) : 1]} dia{LEITNER_INTERVALS[isCorrect ? Math.min(currentCard.level + 1, 5) : 1] !== 1 ? 's' : ''}
                    </p>

                    {/* Botão próximo */}
                    <button
                      onClick={handleNext}
                      className="w-full py-5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xl font-bold rounded-2xl hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-3"
                    >
                      {currentIndex < cardsToPlay.length - 1 ? (
                        <>
                          Próximo Card
                          <ChevronRight className="w-6 h-6" />
                        </>
                      ) : (
                        <>
                          Ver Resultados
                          <Trophy className="w-6 h-6" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
