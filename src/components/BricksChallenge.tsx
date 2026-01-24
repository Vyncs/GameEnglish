import { useState } from 'react';
import { useStore } from '../store/useStore';
import { useSpeech } from '../hooks/useSpeech';
import { availableVerbs } from '../utils/bricksGenerator';
import { BRICK_TYPES } from '../types';
import { 
  Blocks, 
  Play, 
  RotateCcw, 
  Send, 
  Volume2, 
  CheckCircle, 
  XCircle,
  Trophy,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export function BricksChallenge() {
  const { bricksChallenge, startBricksChallenge, submitBrickAnswer, nextBrickPhrase, resetBricksChallenge, viewMode } = useStore();
  const { speak, isSpeaking, isSupported } = useSpeech();
  
  const [selectedVerb, setSelectedVerb] = useState('');
  const [customVerb, setCustomVerb] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);

  // Tela de seleção de verbo
  if (viewMode === 'bricks' || !bricksChallenge) {
    return (
      <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-lg shadow-orange-500/30 mb-6">
              <Blocks className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-800 mb-3">
              Bricks Challenge
            </h1>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              Escolha um verbo e pratique 10 estruturas gramaticais diferentes.
              Domine os "tijolos" fundamentais do inglês!
            </p>
          </div>

          {/* Card de seleção */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Escolha um verbo
            </h2>

            {/* Verbos populares */}
            <div className="mb-8">
              <p className="text-sm font-medium text-slate-500 mb-3">Verbos populares:</p>
              <div className="flex flex-wrap gap-2">
                {availableVerbs.slice(0, 15).map((verb) => (
                  <button
                    key={verb}
                    onClick={() => {
                      setSelectedVerb(verb);
                      setCustomVerb('');
                    }}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      selectedVerb === verb
                        ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg shadow-orange-500/25'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {verb}
                  </button>
                ))}
              </div>
            </div>

            {/* Verbo customizado */}
            <div className="mb-8">
              <p className="text-sm font-medium text-slate-500 mb-3">Ou digite um verbo:</p>
              <input
                type="text"
                value={customVerb}
                onChange={(e) => {
                  setCustomVerb(e.target.value);
                  setSelectedVerb('');
                }}
                placeholder="Ex: sleep, dance, travel..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              />
            </div>

            {/* Estruturas que serão praticadas */}
            <div className="mb-8 p-4 bg-slate-50 rounded-xl">
              <p className="text-sm font-medium text-slate-600 mb-3">Você vai praticar:</p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                {BRICK_TYPES.map((brick, index) => (
                  <div
                    key={brick.type}
                    className="flex items-center gap-2 text-slate-500"
                  >
                    <span className="w-5 h-5 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </span>
                    <span className="truncate">{brick.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Botão iniciar */}
            <button
              onClick={() => {
                const verb = customVerb.trim() || selectedVerb;
                if (verb) {
                  startBricksChallenge(verb);
                }
              }}
              disabled={!selectedVerb && !customVerb.trim()}
              className="w-full py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-lg font-semibold rounded-xl hover:from-amber-500 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-3"
            >
              <Play className="w-6 h-6" />
              Iniciar Desafio
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Tela de resultados finais
  if (bricksChallenge.isComplete) {
    const correctCount = bricksChallenge.results.filter((r) => r.isCorrect).length;
    const percentage = Math.round((correctCount / bricksChallenge.results.length) * 100);

    return (
      <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          {/* Header de resultado */}
          <div className="text-center mb-10">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-3xl shadow-lg mb-6 ${
              percentage >= 70
                ? 'bg-gradient-to-br from-emerald-400 to-green-500 shadow-green-500/30'
                : percentage >= 40
                ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-orange-500/30'
                : 'bg-gradient-to-br from-red-400 to-rose-500 shadow-rose-500/30'
            }`}>
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">
              Desafio Completo!
            </h1>
            <p className="text-lg text-slate-500">
              Verbo: <span className="font-semibold text-slate-700">{bricksChallenge.verb}</span>
            </p>
          </div>

          {/* Score */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 mb-8">
            <div className="flex items-center justify-center gap-8 mb-8">
              <div className="text-center">
                <p className="text-5xl font-bold text-emerald-500">{correctCount}</p>
                <p className="text-slate-500">Acertos</p>
              </div>
              <div className="w-px h-16 bg-slate-200" />
              <div className="text-center">
                <p className="text-5xl font-bold text-red-500">
                  {bricksChallenge.results.length - correctCount}
                </p>
                <p className="text-slate-500">Erros</p>
              </div>
              <div className="w-px h-16 bg-slate-200" />
              <div className="text-center">
                <p className={`text-5xl font-bold ${
                  percentage >= 70 ? 'text-emerald-500' : percentage >= 40 ? 'text-amber-500' : 'text-red-500'
                }`}>
                  {percentage}%
                </p>
                <p className="text-slate-500">Aproveitamento</p>
              </div>
            </div>

            {/* Lista de resultados */}
            <div className="space-y-4">
              {bricksChallenge.results.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border-2 ${
                    result.isCorrect
                      ? 'bg-emerald-50 border-emerald-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-1.5 rounded-full ${
                      result.isCorrect ? 'bg-emerald-500' : 'bg-red-500'
                    }`}>
                      {result.isCorrect ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : (
                        <XCircle className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-slate-500 mb-1">
                        {BRICK_TYPES[index].label}
                      </p>
                      <p className="text-sm text-slate-600 mb-2">
                        {result.phrase.portuguese}
                      </p>
                      {!result.isCorrect && (
                        <>
                          <p className="text-sm text-red-600 line-through mb-1">
                            Sua resposta: {result.userAnswer || '(vazio)'}
                          </p>
                          <p className="text-sm text-emerald-700 font-medium">
                            Correto: {result.phrase.english}
                          </p>
                        </>
                      )}
                      {result.isCorrect && (
                        <p className="text-sm text-emerald-700 font-medium">
                          {result.phrase.english}
                        </p>
                      )}
                    </div>
                    {isSupported && (
                      <button
                        onClick={() => speak(result.phrase.english)}
                        className="p-2 rounded-lg hover:bg-white/50 text-slate-500 hover:text-cyan-600 transition-colors"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Botão recomeçar */}
          <button
            onClick={resetBricksChallenge}
            className="w-full py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-lg font-semibold rounded-xl hover:from-amber-500 hover:to-orange-600 transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-3"
          >
            <RotateCcw className="w-6 h-6" />
            Novo Desafio
          </button>
        </div>
      </div>
    );
  }

  // Tela do desafio em andamento
  const currentPhrase = bricksChallenge.phrases[bricksChallenge.currentIndex];
  const currentBrickType = BRICK_TYPES[bricksChallenge.currentIndex];
  const lastResult = bricksChallenge.results[bricksChallenge.results.length - 1];
  const showingResult = showResult && lastResult;

  const handleSubmit = () => {
    submitBrickAnswer(userAnswer);
    setShowResult(true);
  };

  const handleNext = () => {
    setUserAnswer('');
    setShowResult(false);
    nextBrickPhrase();
  };

  return (
    <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-500">
              Progresso
            </span>
            <span className="text-sm font-medium text-slate-700">
              {bricksChallenge.currentIndex + 1} / {bricksChallenge.phrases.length}
            </span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-300"
              style={{
                width: `${((bricksChallenge.currentIndex + (showResult ? 1 : 0)) / bricksChallenge.phrases.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Card do desafio */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm mb-1">Verbo: {bricksChallenge.verb}</p>
                <h2 className="text-xl font-bold">{currentBrickType.label}</h2>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl font-bold">{bricksChallenge.currentIndex + 1}</span>
              </div>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="p-6">
            {/* Frase em português */}
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-lg mb-3">
                Traduza para o inglês
              </span>
              <p className="text-xl text-slate-800 font-medium leading-relaxed">
                {currentPhrase.portuguese}
              </p>
            </div>

            {/* Input de resposta */}
            {!showingResult && (
              <div className="mb-6">
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
                    className="w-full px-4 py-4 pr-14 bg-slate-50 border-2 border-slate-200 rounded-xl text-lg text-slate-800 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                    autoFocus
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={!userAnswer.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Resultado */}
            {showingResult && (
              <div className="space-y-4 animate-fade-in">
                {/* Feedback */}
                <div className={`p-4 rounded-xl flex items-center gap-3 ${
                  lastResult.isCorrect
                    ? 'bg-emerald-50 border-2 border-emerald-200'
                    : 'bg-red-50 border-2 border-red-200'
                }`}>
                  {lastResult.isCorrect ? (
                    <>
                      <CheckCircle className="w-8 h-8 text-emerald-500 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-emerald-700">Correto! 🎉</p>
                        <p className="text-sm text-emerald-600">Muito bem!</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-8 h-8 text-red-500 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-red-700">Incorreto</p>
                        <p className="text-sm text-red-600">Veja a resposta correta abaixo</p>
                      </div>
                    </>
                  )}
                </div>

                {/* Sua resposta */}
                <div className={`p-4 rounded-xl ${
                  lastResult.isCorrect ? 'bg-emerald-50' : 'bg-red-50'
                }`}>
                  <p className="text-xs font-medium text-slate-500 mb-1">Sua resposta:</p>
                  <p className={`font-medium ${
                    lastResult.isCorrect ? 'text-emerald-700' : 'text-red-700'
                  }`}>
                    {lastResult.userAnswer || '(vazio)'}
                  </p>
                </div>

                {/* Resposta correta */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-500 mb-1">Resposta correta:</p>
                      <p className="font-medium text-slate-800">{currentPhrase.english}</p>
                    </div>
                    {isSupported && (
                      <button
                        onClick={() => speak(currentPhrase.english)}
                        disabled={isSpeaking}
                        className={`p-3 rounded-xl transition-all ${
                          isSpeaking
                            ? 'bg-cyan-100 text-cyan-600'
                            : 'bg-slate-100 text-slate-500 hover:bg-cyan-50 hover:text-cyan-600'
                        }`}
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Botão próximo */}
                <button
                  onClick={handleNext}
                  className="w-full py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-lg font-semibold rounded-xl hover:from-amber-500 hover:to-orange-600 transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-3"
                >
                  {bricksChallenge.currentIndex < bricksChallenge.phrases.length - 1 ? (
                    <>
                      Próxima frase
                      <ArrowRight className="w-5 h-5" />
                    </>
                  ) : (
                    <>
                      Ver resultados
                      <Trophy className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Botão cancelar */}
        <button
          onClick={resetBricksChallenge}
          className="w-full mt-4 py-3 text-slate-500 hover:text-slate-700 transition-colors"
        >
          Cancelar desafio
        </button>
      </div>
    </div>
  );
}
