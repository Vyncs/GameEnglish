import { useState, useRef } from 'react';
import { useStore } from '../store/useStore';
import { defaultKaraokeSongs } from '../data/karaokeSongs';
import { useSpeechRecognition, compareTexts } from '../hooks/useSpeechRecognition';
import { KARAOKE_DIFFICULTY_CONFIG } from '../types';
import type { Song, SongDifficulty, LineResult, WordResult } from '../types';
import {
  Mic,
  MicOff,
  Pause,
  SkipForward,
  ArrowLeft,
  Home,
  RotateCcw,
  Music,
  CheckCircle,
  XCircle,
  AlertCircle,
  Volume2,
  Trophy,
  Target
} from 'lucide-react';

export function KaraokeMode() {
  const {
    karaokePhase,
    karaokeSong,
    karaokeLineIndex,
    karaokeResults,
    selectKaraokeSong,
    nextKaraokeLine,
    addKaraokeResult,
    resetKaraoke,
    goToHome,
  } = useStore();

  const {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  const [filterDifficulty, setFilterDifficulty] = useState<SongDifficulty | 'all'>('all');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [currentResult, setCurrentResult] = useState<{ words: WordResult[]; accuracy: number } | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Filtrar músicas
  const filteredSongs = filterDifficulty === 'all'
    ? defaultKaraokeSongs
    : defaultKaraokeSongs.filter(s => s.difficulty === filterDifficulty);

  // Linha atual
  const currentLine = karaokeSong?.lyrics[karaokeLineIndex];

  // Tocar trecho de áudio
  const playLine = () => {
    if (!audioRef.current || !currentLine || !karaokeSong?.audioUrl) return;
    
    audioRef.current.currentTime = currentLine.startTime;
    audioRef.current.play();
    setIsPlaying(true);

    // Pausar no final do trecho
    const duration = (currentLine.endTime - currentLine.startTime) * 1000;
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }, duration);
  };

  // Processar resposta do usuário
  const handleSubmit = () => {
    if (!currentLine) return;
    
    stopListening();
    
    const result = compareTexts(currentLine.textEN, transcript);
    setCurrentResult(result);
    setShowResult(true);
    
    const lineResult: LineResult = {
      lineId: currentLine.id,
      expectedText: currentLine.textEN,
      spokenText: transcript,
      words: result.words,
      accuracy: result.accuracy,
    };
    
    addKaraokeResult(lineResult);
  };

  // Próxima linha
  const handleNext = () => {
    setShowResult(false);
    setCurrentResult(null);
    resetTranscript();
    nextKaraokeLine();
  };

  // Calcular precisão geral
  const calculateOverallAccuracy = () => {
    if (karaokeResults.length === 0) return 0;
    const total = karaokeResults.reduce((acc, r) => acc + r.accuracy, 0);
    return Math.round(total / karaokeResults.length);
  };

  // =============================================
  // TELA 1: Seleção de Música
  // =============================================
  if (karaokePhase === 'song-selection') {
    return (
      <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-violet-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Mic className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Karaoke Mode</h1>
          <p className="text-slate-500">Train pronunciation with speaking practice</p>
          
          {!isSupported && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-700">
              <AlertCircle className="w-5 h-5 inline mr-2" />
              Speech recognition is not supported in your browser. Try Chrome or Edge.
            </div>
          )}
        </div>

        {/* Filtros */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterDifficulty('all')}
              className={`px-4 py-2 rounded-xl transition-all ${
                filterDifficulty === 'all'
                  ? 'bg-violet-500 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              All
            </button>
            {(Object.keys(KARAOKE_DIFFICULTY_CONFIG) as SongDifficulty[]).map((diff) => {
              const config = KARAOKE_DIFFICULTY_CONFIG[diff];
              return (
                <button
                  key={diff}
                  onClick={() => setFilterDifficulty(diff)}
                  className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                    filterDifficulty === diff
                      ? 'bg-violet-500 text-white'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {config.emoji} {config.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Lista de músicas */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg font-semibold text-slate-700 mb-4">
            Choose a lesson ({filteredSongs.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSongs.map((song) => (
              <SongCard
                key={song.id}
                song={song}
                onClick={() => selectKaraokeSong(song)}
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
  // TELA 2: Playing (Karaoke)
  // =============================================
  if (karaokePhase === 'playing' && karaokeSong && currentLine) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen">
        {/* Audio element */}
        {karaokeSong.audioUrl && (
          <audio ref={audioRef} src={karaokeSong.audioUrl} />
        )}

        {/* Header */}
        <div className="absolute top-6 left-6">
          <button
            onClick={resetKaraoke}
            className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Progresso */}
        <div className="absolute top-6 right-6 flex items-center gap-4">
          <div className="px-4 py-2 bg-white/10 rounded-xl text-white">
            <span className="font-bold">{karaokeLineIndex + 1}</span>
            <span className="text-white/60"> / {karaokeSong.lyrics.length}</span>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="max-w-2xl w-full text-center">
          {/* Info da música */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white/80">{karaokeSong.title}</h2>
            <p className="text-white/50">{karaokeSong.artist}</p>
          </div>

          {/* Linha em inglês */}
          <div className="mb-4 p-6 bg-white/10 backdrop-blur rounded-2xl">
            <p className="text-3xl font-bold text-white leading-relaxed">
              {currentLine.textEN}
            </p>
          </div>

          {/* Tradução */}
          <p className="text-lg text-white/50 mb-8 italic">
            {currentLine.textPT}
          </p>

          {/* Resultado da fala */}
          {showResult && currentResult && (
            <div className="mb-8 p-4 bg-white/10 backdrop-blur rounded-2xl animate-fade-in">
              <div className="flex items-center justify-center gap-2 mb-3">
                {currentResult.accuracy >= 80 ? (
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                ) : currentResult.accuracy >= 50 ? (
                  <AlertCircle className="w-6 h-6 text-amber-400" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-400" />
                )}
                <span className="text-2xl font-bold text-white">{currentResult.accuracy}%</span>
              </div>
              
              {/* Palavras */}
              <div className="flex flex-wrap justify-center gap-2">
                {currentResult.words.map((word, i) => (
                  <span
                    key={i}
                    className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      word.status === 'correct'
                        ? 'bg-emerald-500/30 text-emerald-300'
                        : word.status === 'approximate'
                        ? 'bg-amber-500/30 text-amber-300'
                        : 'bg-red-500/30 text-red-300'
                    }`}
                  >
                    {word.word}
                  </span>
                ))}
              </div>

              {transcript && (
                <p className="mt-3 text-white/60 text-sm">
                  You said: "{transcript}"
                </p>
              )}
            </div>
          )}

          {/* Transcrição em tempo real */}
          {isListening && transcript && !showResult && (
            <div className="mb-8 p-4 bg-violet-500/20 backdrop-blur rounded-2xl">
              <p className="text-white/80">{transcript}</p>
            </div>
          )}

          {/* Controles */}
          <div className="flex items-center justify-center gap-4">
            {/* Play Audio (se disponível) */}
            {karaokeSong.audioUrl && (
              <button
                onClick={playLine}
                disabled={isPlaying}
                className="p-4 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all disabled:opacity-50"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              </button>
            )}

            {/* Microfone */}
            {!showResult ? (
              <button
                onClick={isListening ? handleSubmit : startListening}
                disabled={!isSupported}
                className={`p-6 rounded-full transition-all ${
                  isListening
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                    : 'bg-violet-500 hover:bg-violet-600'
                } text-white shadow-lg disabled:opacity-50`}
              >
                {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="p-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full transition-all shadow-lg"
              >
                <SkipForward className="w-8 h-8" />
              </button>
            )}

            {/* Skip */}
            {!showResult && (
              <button
                onClick={() => {
                  stopListening();
                  handleNext();
                }}
                className="p-4 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all"
              >
                <SkipForward className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Instruções */}
          <p className="mt-6 text-white/40 text-sm">
            {isListening 
              ? 'Speak now... Click the button when done'
              : showResult
              ? 'Click to continue'
              : 'Click the microphone and speak the phrase'}
          </p>
        </div>
      </div>
    );
  }

  // =============================================
  // TELA 3: Resultados
  // =============================================
  if (karaokePhase === 'results') {
    const overallAccuracy = calculateOverallAccuracy();
    const correctLines = karaokeResults.filter(r => r.accuracy >= 80).length;
    const approximateLines = karaokeResults.filter(r => r.accuracy >= 50 && r.accuracy < 80).length;
    const missedLines = karaokeResults.filter(r => r.accuracy < 50).length;

    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-lg w-full animate-fade-in">
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`w-24 h-24 mx-auto mb-4 rounded-3xl flex items-center justify-center shadow-xl ${
              overallAccuracy >= 70
                ? 'bg-gradient-to-br from-emerald-400 to-green-500 shadow-green-500/30'
                : overallAccuracy >= 50
                ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-orange-500/30'
                : 'bg-gradient-to-br from-violet-400 to-purple-500 shadow-purple-500/30'
            }`}>
              {overallAccuracy >= 70 ? (
                <Trophy className="w-12 h-12 text-white" />
              ) : (
                <Mic className="w-12 h-12 text-white" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              {overallAccuracy >= 70 ? 'Great Job!' : overallAccuracy >= 50 ? 'Good Effort!' : 'Keep Practicing!'}
            </h1>
            <p className="text-slate-500">{karaokeSong?.title}</p>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 mb-6">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                <p className="text-2xl font-bold text-emerald-500">{correctLines}</p>
                <p className="text-sm text-slate-500">Correct</p>
              </div>
              <div className="text-center">
                <AlertCircle className="w-6 h-6 text-amber-500 mx-auto mb-1" />
                <p className="text-2xl font-bold text-amber-500">{approximateLines}</p>
                <p className="text-sm text-slate-500">Approximate</p>
              </div>
              <div className="text-center">
                <XCircle className="w-6 h-6 text-red-500 mx-auto mb-1" />
                <p className="text-2xl font-bold text-red-500">{missedLines}</p>
                <p className="text-sm text-slate-500">Needs Work</p>
              </div>
            </div>

            {/* Accuracy bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-slate-600 mb-1">
                <span>Overall Accuracy</span>
                <span className="font-semibold">{overallAccuracy}%</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    overallAccuracy >= 70 ? 'bg-emerald-500' : overallAccuracy >= 50 ? 'bg-amber-500' : 'bg-violet-500'
                  }`}
                  style={{ width: `${overallAccuracy}%` }}
                />
              </div>
            </div>

            {/* Lines to review */}
            {missedLines > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Lines to Practice
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {karaokeResults
                    .filter(r => r.accuracy < 50)
                    .map((result, i) => (
                      <div key={i} className="p-3 bg-red-50 rounded-xl border border-red-100">
                        <p className="font-medium text-slate-700">{result.expectedText}</p>
                        <p className="text-sm text-slate-500 mt-1">You said: "{result.spokenText || '(nothing)'}"</p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={resetKaraoke}
              className="flex-1 py-3 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </button>
            <button
              onClick={goToHome}
              className="flex-1 py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-semibold rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2"
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
// Componente de Card da Música
// =============================================
function SongCard({ song, onClick }: { song: Song; onClick: () => void }) {
  const config = KARAOKE_DIFFICULTY_CONFIG[song.difficulty];
  
  return (
    <button
      onClick={onClick}
      className="p-6 bg-white rounded-2xl shadow-lg border border-slate-200 hover:border-violet-300 hover:shadow-xl transition-all text-left group"
    >
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 bg-gradient-to-br from-violet-100 to-purple-100 rounded-xl flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform">
          {song.coverUrl ? (
            <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover" />
          ) : (
            <Music className="w-6 h-6 text-violet-500" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-800 mb-1">{song.title}</h3>
          <p className="text-sm text-slate-500 mb-2">{song.artist}</p>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
              song.difficulty === 'easy' ? 'bg-emerald-100 text-emerald-600' :
              song.difficulty === 'medium' ? 'bg-amber-100 text-amber-600' :
              'bg-red-100 text-red-600'
            }`}>
              {config.emoji} {config.label}
            </span>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
              {song.lyrics.length} lines
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
