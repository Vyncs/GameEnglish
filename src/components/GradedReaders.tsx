import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { useAuthStore } from '../store/useAuthStore';
import { hasPremiumAccess } from '../utils/subscription';
import { FREE_AI_STORIES_PER_LEVEL } from '../utils/freeTier';
import { defaultGradedBooks, parseRawStoryToBook, parseAIStoryResponse, getCoverUrlForTheme } from '../data/gradedBooks';
import { SubscriptionModal } from './SubscriptionModal';
import { useSpeech } from '../hooks/useSpeech';
import {
  READER_LEVEL_CONFIG,
  BOOK_TAGS,
  type ReaderLevel,
  type GradedBook,
  type ReaderWord,
  type BookTag,
} from '../types';
import {
  BookOpen,
  Library,
  Sparkles,
  Search,
  ArrowLeft,
  Sun,
  Moon,
  Coffee,
  Volume2,
  X,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  RotateCcw,
  Home,
  Filter,
  Loader2,
  Key,
  ExternalLink,
  Trash2,
} from 'lucide-react';

export function GradedReaders() {
  const {
    readerLevel,
    readerTheme,
    readerSubTab,
    selectedBook,
    isReading,
    customBooks,
    setReaderLevel,
    setReaderTheme,
    setReaderSubTab,
    openBook,
    closeBook,
    addCustomBook,
    deleteCustomBook,
    goToHome,
  } = useStore();

  const { speak, isSpeaking } = useSpeech();
  
  // Estados locais
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<BookTag | 'all'>('all');
  const [activeWord, setActiveWord] = useState<ReaderWord | null>(null);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });
  const [showQuestions, setShowQuestions] = useState(false);
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [playingParagraphIndex, setPlayingParagraphIndex] = useState<number | null>(null);

  // Combina livros padrão com customizados
  const allBooks = [...defaultGradedBooks, ...customBooks];
  
  // Filtra livros pelo nível atual
  const filteredBooks = allBooks
    .filter(book => book.level === readerLevel)
    .filter(book => 
      selectedTag === 'all' || book.tags.includes(selectedTag)
    )
    .filter(book =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Tema de fundo
  const getThemeClasses = () => {
    switch (readerTheme) {
      case 'dark':
        return 'bg-zinc-900 text-zinc-100';
      case 'sepia':
        return 'bg-[#F4ECD8] text-zinc-800';
      default:
        return 'bg-white text-zinc-800';
    }
  };

  // Tema do popover
  const getPopoverClasses = () => {
    switch (readerTheme) {
      case 'dark':
        return 'bg-zinc-800 border-zinc-700 text-white';
      case 'sepia':
        return 'bg-[#E8DCC8] border-amber-300 text-zinc-800';
      default:
        return 'bg-white border-slate-200 text-zinc-800';
    }
  };

  // Handler para click em palavra
  const handleWordClick = (word: ReaderWord, event: React.MouseEvent) => {
    if (!word.isClickable) return;
    
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setPopoverPosition({
      x: rect.left + rect.width / 2,
      y: rect.bottom + 8,
    });
    setActiveWord(word);
  };

  // Fechar popover
  const closePopover = () => {
    setActiveWord(null);
  };

  // Falar palavra ou frase
  const speakWord = (word: string) => {
    speak(word, 'en-US');
  };

  // Falar parágrafo inteiro
  const speakParagraph = (paragraph: { words: { word: string }[] }, pIndex: number) => {
    const text = paragraph.words.map((w) => w.word).join(' ');
    if (!text.trim()) return;
    setPlayingParagraphIndex(pIndex);
    speak(text, 'en-US', () => setPlayingParagraphIndex(null));
  };

  // Calcular resultado das questões
  const calculateScore = () => {
    if (!selectedBook?.questions) return { correct: 0, total: 0 };
    
    let correct = 0;
    selectedBook.questions.forEach(q => {
      if (questionAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });
    
    return { correct, total: selectedBook.questions.length };
  };

  // =============================================
  // TELA DE LEITURA (Reader View)
  // =============================================
  if (isReading && selectedBook) {
    const score = calculateScore();

    // Tela de perguntas
    if (showQuestions && selectedBook.questions) {
      return (
        <div className={`flex-1 min-h-screen ${getThemeClasses()} transition-colors duration-300`}>
          <div className="max-w-2xl mx-auto p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => setShowQuestions(false)}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-700"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to reading
              </button>
              <h2 className="text-xl font-bold">Comprehension Questions</h2>
            </div>

            {/* Questions */}
            {!showResults ? (
              <div className="space-y-6">
                {selectedBook.questions.map((question, qIndex) => (
                  <div key={question.id} className={`p-6 rounded-2xl border ${
                    readerTheme === 'dark' ? 'border-zinc-700 bg-zinc-800' : 
                    readerTheme === 'sepia' ? 'border-amber-200 bg-[#EDE4D3]' : 
                    'border-slate-200 bg-slate-50'
                  }`}>
                    <p className="font-semibold mb-4">{qIndex + 1}. {question.question}</p>
                    <div className="space-y-2">
                      {question.options.map((option, oIndex) => (
                        <button
                          key={oIndex}
                          onClick={() => setQuestionAnswers(prev => ({ ...prev, [question.id]: oIndex }))}
                          className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                            questionAnswers[question.id] === oIndex
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : readerTheme === 'dark'
                              ? 'border-zinc-600 hover:border-zinc-500'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => setShowResults(true)}
                  disabled={Object.keys(questionAnswers).length < selectedBook.questions.length}
                  className="w-full py-4 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Check Answers
                </button>
              </div>
            ) : (
              /* Results */
              <div className="text-center">
                <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
                  score.correct === score.total
                    ? 'bg-emerald-100 text-emerald-600'
                    : score.correct >= score.total / 2
                    ? 'bg-amber-100 text-amber-600'
                    : 'bg-red-100 text-red-600'
                }`}>
                  {score.correct === score.total ? (
                    <CheckCircle className="w-12 h-12" />
                  ) : (
                    <span className="text-3xl font-bold">{score.correct}/{score.total}</span>
                  )}
                </div>
                <h3 className="text-2xl font-bold mb-2">
                  {score.correct === score.total ? 'Perfect!' : score.correct >= score.total / 2 ? 'Good job!' : 'Keep practicing!'}
                </h3>
                <p className="text-slate-500 mb-8">
                  You got {score.correct} out of {score.total} questions correct.
                </p>

                {/* Show correct answers */}
                <div className="text-left space-y-4 mb-8">
                  {selectedBook.questions.map((question, qIndex) => {
                    const isCorrect = questionAnswers[question.id] === question.correctIndex;
                    return (
                      <div key={question.id} className={`p-4 rounded-xl border ${
                        isCorrect ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'
                      }`}>
                        <div className="flex items-start gap-2">
                          {isCorrect ? (
                            <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                          )}
                          <div>
                            <p className="font-medium">{qIndex + 1}. {question.question}</p>
                            {!isCorrect && (
                              <p className="text-sm text-emerald-600 mt-1">
                                Correct: {question.options[question.correctIndex]}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowResults(false);
                      setQuestionAnswers({});
                    }}
                    className="flex-1 py-3 border-2 border-slate-200 rounded-xl font-semibold hover:bg-slate-50 flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Try Again
                  </button>
                  <button
                    onClick={() => {
                      setShowQuestions(false);
                      closeBook();
                    }}
                    className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 flex items-center justify-center gap-2"
                  >
                    <Home className="w-4 h-4" />
                    Back to Library
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div 
        className={`flex-1 min-h-screen ${getThemeClasses()} transition-colors duration-300`}
        onClick={closePopover}
      >
        {/* Header do Reader */}
        <div className={`sticky top-0 z-10 backdrop-blur-lg ${
          readerTheme === 'dark' ? 'bg-zinc-900/90' : 
          readerTheme === 'sepia' ? 'bg-[#F4ECD8]/90' : 
          'bg-white/90'
        } border-b ${
          readerTheme === 'dark' ? 'border-zinc-800' : 
          readerTheme === 'sepia' ? 'border-amber-200' : 
          'border-slate-200'
        }`}>
          <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={closeBook}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-700"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Back</span>
              </button>
              {selectedBook.isCustom && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Excluir este livro? Esta ação não pode ser desfeita.')) {
                      deleteCustomBook(selectedBook.id);
                      closeBook();
                    }
                  }}
                  className="p-2 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                  title="Excluir livro"
                  aria-label="Excluir livro"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="text-center">
              <h1 className="font-semibold truncate max-w-[200px] sm:max-w-none">{selectedBook.title}</h1>
              <p className="text-sm text-slate-500">
                {selectedBook.totalWords} words • {selectedBook.estimatedMinutes} min read
              </p>
            </div>

            {/* Theme Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setReaderTheme('light')}
                className={`p-2 rounded-md transition-colors ${
                  readerTheme === 'light' ? 'bg-white shadow-sm' : 'hover:bg-slate-200'
                }`}
                title="Light"
              >
                <Sun className="w-4 h-4" />
              </button>
              <button
                onClick={() => setReaderTheme('sepia')}
                className={`p-2 rounded-md transition-colors ${
                  readerTheme === 'sepia' ? 'bg-white shadow-sm' : 'hover:bg-slate-200'
                }`}
                title="Sepia"
              >
                <Coffee className="w-4 h-4" />
              </button>
              <button
                onClick={() => setReaderTheme('dark')}
                className={`p-2 rounded-md transition-colors ${
                  readerTheme === 'dark' ? 'bg-zinc-700 shadow-sm text-white' : 'hover:bg-slate-200'
                }`}
                title="Dark"
              >
                <Moon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Book Content - Full Page Like a Real Book */}
        <div className="max-w-2xl mx-auto px-6 py-12 pb-32">
          {/* Book Title */}
          <div className="text-center mb-12">
            <h1 className={`text-3xl font-serif font-bold mb-2 ${
              readerTheme === 'dark' ? 'text-white' : 'text-slate-800'
            }`}>
              {selectedBook.title}
            </h1>
            <p className={`text-sm ${
              readerTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'
            }`}>
              by {selectedBook.author}
            </p>
            <div className={`w-16 h-0.5 mx-auto mt-4 ${
              readerTheme === 'dark' ? 'bg-slate-700' : 
              readerTheme === 'sepia' ? 'bg-amber-300' : 
              'bg-slate-300'
            }`} />
          </div>

          {/* All Paragraphs */}
          <div className="space-y-6">
            {selectedBook.paragraphs.map((paragraph, pIndex) => {
              const isThisPlaying = playingParagraphIndex === pIndex;
              return (
                <div key={paragraph.id} className="flex gap-3 items-start">
                  <button
                    type="button"
                    onClick={() => speakParagraph(paragraph, pIndex)}
                    disabled={isSpeaking && !isThisPlaying}
                    className={`flex-shrink-0 mt-1 p-2 rounded-xl transition-all ${
                      isThisPlaying
                        ? 'bg-blue-500 text-white shadow-md'
                        : readerTheme === 'dark'
                        ? 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                        : readerTheme === 'sepia'
                        ? 'bg-amber-200/80 text-amber-800 hover:bg-amber-300'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    title="Reproduzir frase"
                    aria-label="Reproduzir áudio da frase"
                  >
                    <Volume2 className={`w-5 h-5 ${isThisPlaying ? 'animate-pulse' : ''}`} />
                  </button>
                  <p className="flex-1 text-lg leading-relaxed text-justify first-letter:text-2xl first-letter:font-semibold min-w-0">
                    {paragraph.words.map((word, wIndex) => (
                      <span
                        key={`${pIndex}-${wIndex}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWordClick(word, e);
                        }}
                        className={`${
                          word.isClickable
                            ? `cursor-pointer hover:underline hover:decoration-2 ${
                                readerTheme === 'dark' ? 'hover:bg-yellow-500/30' : 'hover:bg-yellow-200'
                              } rounded px-0.5 transition-colors`
                            : ''
                        }`}
                      >
                        {word.word}{' '}
                      </span>
                    ))}
                  </p>
                </div>
              );
            })}
          </div>

          {/* End of Book Divider */}
          <div className="text-center mt-12">
            <div className={`w-16 h-0.5 mx-auto ${
              readerTheme === 'dark' ? 'bg-slate-700' : 
              readerTheme === 'sepia' ? 'bg-amber-300' : 
              'bg-slate-300'
            }`} />
            <p className={`mt-4 text-sm italic ${
              readerTheme === 'dark' ? 'text-slate-500' : 'text-slate-400'
            }`}>
              ~ The End ~
            </p>
          </div>
        </div>

        {/* Fixed Bottom Bar - Quiz Button */}
        {selectedBook.questions && (
          <div className={`fixed bottom-0 left-0 right-0 ${
            readerTheme === 'dark' ? 'bg-zinc-900/90' : 
            readerTheme === 'sepia' ? 'bg-[#F4ECD8]/90' : 
            'bg-white/90'
          } backdrop-blur-lg border-t ${
            readerTheme === 'dark' ? 'border-zinc-800' : 
            readerTheme === 'sepia' ? 'border-amber-200' : 
            'border-slate-200'
          }`}>
            <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-center">
              <button
                onClick={() => setShowQuestions(true)}
                className="px-8 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Take Comprehension Quiz
              </button>
            </div>
          </div>
        )}

        {/* Word Popover */}
        {activeWord && (
          <div
            className={`fixed z-50 ${getPopoverClasses()} border rounded-xl shadow-xl p-4 min-w-[200px] animate-fade-in`}
            style={{
              left: Math.min(popoverPosition.x - 100, window.innerWidth - 220),
              top: popoverPosition.y,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-lg font-bold">{activeWord.word.replace(/[.,!?;:"'()]/g, '')}</span>
              <button
                onClick={closePopover}
                className="p-1 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-slate-500 mb-3">{activeWord.translation}</p>
            <button
              onClick={() => speakWord(activeWord.word.replace(/[.,!?;:"'()]/g, ''))}
              disabled={isSpeaking}
              className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              <Volume2 className="w-4 h-4" />
              Listen
            </button>
          </div>
        )}
      </div>
    );
  }

  // =============================================
  // TELA PRINCIPAL (Library/Create)
  // =============================================
  return (
    <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
      {/* Back to Home */}
      <div className="max-w-4xl mx-auto mb-4">
        <button
          onClick={goToHome}
          className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
          <BookOpen className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Graded Readers</h1>
        <p className="text-slate-500">Learn English through reading.</p>
      </div>

      {/* Level Tabs */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex flex-wrap gap-2 justify-center">
          {(Object.keys(READER_LEVEL_CONFIG) as ReaderLevel[]).map((level) => {
            const config = READER_LEVEL_CONFIG[level];
            const count = allBooks.filter(b => b.level === level).length;
            return (
              <button
                key={level}
                onClick={() => setReaderLevel(level)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  readerLevel === level
                    ? `bg-${config.color}-500 text-white shadow-lg`
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
                style={{
                  backgroundColor: readerLevel === level 
                    ? config.color === 'emerald' ? '#10b981'
                    : config.color === 'blue' ? '#3b82f6'
                    : config.color === 'amber' ? '#f59e0b'
                    : '#a855f7'
                    : undefined
                }}
              >
                <span className="font-bold">{level}</span>
                <span className="ml-2 text-sm opacity-80">({count})</span>
              </button>
            );
          })}
        </div>
        
        {/* Level info */}
        <div className="mt-4 text-center text-sm text-slate-500">
          <span className="font-medium">{READER_LEVEL_CONFIG[readerLevel].label}</span>
          {' • '}
          {READER_LEVEL_CONFIG[readerLevel].vocabularyRange}
          {' • '}
          {READER_LEVEL_CONFIG[readerLevel].grammarFocus}
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex gap-2 justify-center border-b border-slate-200 pb-2">
          <button
            onClick={() => setReaderSubTab('library')}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-xl font-medium transition-all ${
              readerSubTab === 'library'
                ? 'bg-white border border-b-0 border-slate-200 text-blue-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Library className="w-4 h-4" />
            Library
          </button>
          <button
            onClick={() => setReaderSubTab('create')}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-xl font-medium transition-all ${
              readerSubTab === 'create'
                ? 'bg-white border border-b-0 border-slate-200 text-blue-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Create with AI
          </button>
        </div>
      </div>

      {/* Content based on sub tab */}
      <div className="max-w-4xl mx-auto">
        {readerSubTab === 'library' && (
          <>
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search books..."
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-slate-400" />
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value as BookTag | 'all')}
                  className="px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400"
                >
                  <option value="all">All Topics</option>
                  {BOOK_TAGS.map(tag => (
                    <option key={tag.tag} value={tag.tag}>
                      {tag.emoji} {tag.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Books Grid */}
            {filteredBooks.length === 0 ? (
              <div className="text-center py-16">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <h3 className="text-xl font-semibold text-slate-700 mb-2">No books found</h3>
                <p className="text-slate-500">Try a different search or filter</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onOpen={openBook}
                    onDelete={
                      book.isCustom
                        ? () => {
                            deleteCustomBook(book.id);
                            if (selectedBook?.id === book.id) closeBook();
                          }
                        : undefined
                    }
                  />
                ))}
              </div>
            )}
          </>
        )}

        {readerSubTab === 'create' && (
          <CreateWithAI
            customBooks={customBooks}
            addCustomBook={addCustomBook}
            openBook={openBook}
          />
        )}
      </div>

    </div>
  );
}

// =============================================
// Componente BookCard
// =============================================
function BookCard({
  book,
  onOpen,
  onDelete,
}: {
  book: GradedBook;
  onOpen: (book: GradedBook) => void;
  onDelete?: () => void;
}) {
  const levelConfig = READER_LEVEL_CONFIG[book.level];
  const themeTag = (book.tags[0] ?? 'daily-life') as BookTag;
  const fallbackCover = getCoverUrlForTheme(themeTag);
  const [coverSrc, setCoverSrc] = useState(() => book.coverUrl ?? fallbackCover);
  useEffect(() => {
    setCoverSrc(book.coverUrl ?? fallbackCover);
  }, [book.id, book.coverUrl, fallbackCover]);

  return (
    <div className="relative bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all text-left group">
      <button
        type="button"
        onClick={() => onOpen(book)}
        className="w-full text-left"
      >
        {/* Cover */}
        <div className="aspect-[3/4] relative overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
          {coverSrc ? (
            <img
              src={coverSrc}
              alt=""
              referrerPolicy="no-referrer"
              onError={() => {
                setCoverSrc((prev) =>
                  prev && prev !== fallbackCover ? fallbackCover : ''
                );
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-slate-400" />
            </div>
          )}

          {/* Level badge */}
          <div
            className="absolute top-3 right-3 px-3 py-1 rounded-full text-white text-sm font-bold"
            style={{
              backgroundColor:
                levelConfig.color === 'emerald'
                  ? '#10b981'
                  : levelConfig.color === 'blue'
                    ? '#3b82f6'
                    : levelConfig.color === 'amber'
                      ? '#f59e0b'
                      : '#a855f7',
            }}
          >
            {book.level}
          </div>

          {/* Progress overlay */}
          {book.progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
              <div
                className="h-full bg-emerald-500"
                style={{ width: `${book.progress}%` }}
              />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-semibold text-slate-800 mb-1 line-clamp-1">{book.title}</h3>
          <p className="text-sm text-slate-500 mb-3 line-clamp-2">{book.description}</p>

          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <FileText className="w-3 h-3" />
              {book.totalWords} words
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {book.estimatedMinutes} min
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mt-3">
            {book.tags.slice(0, 2).map((tag) => {
              const tagInfo = BOOK_TAGS.find((t) => t.tag === tag);
              return (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full"
                >
                  {tagInfo?.emoji} {tagInfo?.label}
                </span>
              );
            })}
          </div>
        </div>
      </button>

      {/* Botão excluir (só para livros customizados / gerados por IA) */}
      {onDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm('Excluir este livro? Esta ação não pode ser desfeita.')) {
              onDelete();
            }
          }}
          className="absolute top-3 left-3 p-2 rounded-xl bg-red-500/90 text-white hover:bg-red-600 shadow-md transition-colors z-10"
          title="Excluir livro"
          aria-label="Excluir livro"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// =============================================
// Componente CreateWithAI
// =============================================
const GROQ_API_KEY_STORAGE = 'gradereaders_groq_api_key';

/** O modelo tende a repetir “família + casa + jardim”; cada tema força foco e cenário diferentes. */
const THEME_STORY_FOCUS: Record<BookTag, string> = {
  'daily-life':
    'Routines, meals, school, neighbors, shopping, weather—vary the place (flat, bus, park, market). Do not default to the same “small house + garden + pet” plot every time.',
  travel:
    'Trip, ticket, hotel/hostel, airport/train, new city, language mix-up, luggage, a small travel problem to solve.',
  romance:
    'Meeting someone, a kind gesture, feelings in simple words—keep it age-appropriate and light; avoid cliché “perfect date” only.',
  work:
    'Job tasks, colleagues, break time, email/call, a simple problem at work (deadline, mistake, helping a coworker).',
  adventure:
    'A journey, map, weather, obstacle, choice—outdoor or exploration; concrete actions, not only description.',
  mystery:
    'A small puzzle (lost item, strange note, wrong number)—the narrator notices clues and finds a simple answer.',
  fantasy:
    'One magical rule or creature, a humble hero, a small quest—clear but simple for the CEFR level.',
  science:
    'Experiment, lab/school project, nature discovery, “why” questions—simple cause and effect.',
  'rpg-fantasy':
    'Party, quest hook, tavern or road, one battle or riddle—keep vocabulary controlled for the level.',
  horror:
    'Moody setting, strange sound or shadow, mild suspense—no gore; safe for learners.',
};

const LENGTH_SPECS = {
  short: { min: 150, max: 200, paragraphsMin: 4, target: 180 },
  medium: { min: 300, max: 400, paragraphsMin: 5, target: 350 },
  long: { min: 500, max: 600, paragraphsMin: 7, target: 550 },
} as const;

function maxTokensForStorySize(size: 'short' | 'medium' | 'long'): number {
  if (size === 'short') return 2300;
  if (size === 'medium') return 3400;
  return 4500;
}

function isAiGeneratedStory(b: GradedBook): boolean {
  if (!b.isCustom) return false;
  const a = String(b.author || '');
  return a.includes('Groq') || a.includes('IA (');
}

function CreateWithAI({
  customBooks,
  addCustomBook,
  openBook,
}: {
  customBooks: GradedBook[];
  addCustomBook: (book: GradedBook) => void;
  openBook: (book: GradedBook) => void;
}) {
  const { user } = useAuthStore();
  const isPremium = hasPremiumAccess(user?.subscriptionStatus);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [title, setTitle] = useState('');
  const [theme, setTheme] = useState<BookTag>('daily-life');
  const [size, setSize] = useState<'short' | 'medium' | 'long'>('medium');
  const [apiKey, setApiKey] = useState(() => {
    try {
      return localStorage.getItem(GROQ_API_KEY_STORAGE) || '';
    } catch {
      return '';
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { readerLevel } = useStore();

  const saveApiKey = (key: string) => {
    setApiKey(key);
    try {
      if (key) localStorage.setItem(GROQ_API_KEY_STORAGE, key);
      else localStorage.removeItem(GROQ_API_KEY_STORAGE);
    } catch {
      /* ignore */
    }
  };

  /**
   * @param variationSeed — só na chamada à API: história diferente a cada geração. Omitido no texto “Copiar prompt”.
   */
  const buildGroqPrompt = (variationSeed?: number) => {
    const levelConfig = READER_LEVEL_CONFIG[readerLevel];
    const spec = LENGTH_SPECS[size];
    const tagMeta = BOOK_TAGS.find((t) => t.tag === theme);
    const themeLabel = tagMeta?.label ?? theme;
    const themeFocus = THEME_STORY_FOCUS[theme];
    const seedBlock =
      variationSeed !== undefined
        ? `
Variation (mandatory): generation id ${variationSeed} — use NEW names, NEW place, NEW conflict. Do NOT reuse a generic opener you often use (e.g. "My name is… I live with my family in a small house with a big garden") unless the user theme explicitly requires that exact setting.`
        : '';

    return `You write graded-reader fiction for English learners.

OUTPUT: Return ONLY valid JSON. No markdown fences, no commentary before or after the JSON.

Schema (exact keys):
{
  "title": "English title",
  "paragraphs": ["...", "..."],
  "questions": [
    { "id": "q1", "question": "English question", "options": ["A","B","C","D"], "correctIndex": 0 }
  ]
}

Level & language:
- CEFR ${readerLevel} (${levelConfig.label})
- Vocabulary range: ${levelConfig.vocabularyRange}
- Grammar focus: ${levelConfig.grammarFocus}
- Short sentences, high repetition of key words, natural dialogue allowed in very simple lines.

Theme (this generation must OBVIOUSLY match the theme — not a generic story with the theme label ignored):
- Theme: "${themeLabel}" (${tagMeta?.emoji ?? ''})
- Theme focus: ${themeFocus}
${seedBlock}

Length (STRICT — models often write too little; follow this literally):
- Count words in the STORY ONLY: join every string in "paragraphs" with spaces and count English words.
- Minimum: ${spec.min} words. Maximum: ${spec.max} words. Target: about ${spec.target} words.
- Use at least ${spec.paragraphsMin} paragraphs. Each paragraph should have several sentences (not one or two very short lines).
- If your draft is below ${spec.min} words, DO NOT output JSON yet: mentally expand with more scenes, sensory detail, a small problem, or short dialogue until the story reaches at least ${spec.min} words.

Questions:
- 4 to 6 questions; each has exactly 4 options (strings); correctIndex is 0-based and must match one option.
${title ? `- Optional title hint from user: "${title}" (you may adapt).` : ''}`;
  };

  const generatePrompt = () => buildGroqPrompt(undefined);

  const generateWithAI = async () => {
    const key = apiKey.trim();
    if (!key) {
      setError('Coloque sua API key do Groq (grátis em console.groq.com)');
      return;
    }
    const aiCountForLevel = customBooks.filter(
      (b) => b.level === readerLevel && isAiGeneratedStory(b)
    ).length;
    if (!isPremium && aiCountForLevel >= FREE_AI_STORIES_PER_LEVEL) {
      setError(
        `No plano free você pode criar até ${FREE_AI_STORIES_PER_LEVEL} histórias com IA por nível. Assine para gerar mais.`
      );
      setShowSubscriptionModal(true);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      // Chamada direta à API Groq (funciona em qualquer host: localhost, Netlify, Vercel, etc.)
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [{ role: 'user', content: buildGroqPrompt(Date.now()) }],
          max_tokens: maxTokensForStorySize(size),
          temperature: 0.78,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = data?.error?.message || data?.error?.code || `Erro ${res.status}`;
        setError(msg);
        return;
      }
      const text = data?.choices?.[0]?.message?.content?.trim() || '';
      if (!text) {
        setError('Resposta vazia da IA.');
        return;
      }
      const { title: aiTitle, storyText, questions } = parseAIStoryResponse(text);
      const book = parseRawStoryToBook(storyText, {
        title: aiTitle,
        level: readerLevel,
        theme,
        coverUrl: getCoverUrlForTheme(theme),
        questions,
      });
      addCustomBook(book);
      openBook(book);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Falha ao chamar a IA.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(generatePrompt());
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
      <SubscriptionModal
        open={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
      />
      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-purple-500" />
        Criar história com IA (Groq – grátis)
      </h3>
      <p className="text-sm text-slate-500 mb-6">
        Crie diversas histórias divertidas com a IA de acordo com seu nível. Use uma chave gratuita do
        Groq; a resposta vem em JSON com texto e quiz de múltipla escolha para o modo Take Quiz.
        {!isPremium && (
          <span className="block mt-2 text-amber-700">
            Plano free: até {FREE_AI_STORIES_PER_LEVEL} histórias por nível (A1, A2…).
          </span>
        )}
      </p>

      <div className="space-y-4">
        {/* API Key */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            <Key className="w-4 h-4 inline mr-1" />
            API Key Groq (obrigatório para gerar aqui)
          </label>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => saveApiKey(e.target.value)}
              placeholder="gsk_..."
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 font-mono text-sm"
            />
            <a
              href="https://console.groq.com/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-4 py-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              Obter chave
            </a>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Grátis em{' '}
            <a
              href="https://console.groq.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              console.groq.com
            </a>
            . Fica salva só no seu navegador.
          </p>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">Título (opcional)</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="ex.: A Day at the Beach"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Theme */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">Tema</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as BookTag)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400"
          >
            {BOOK_TAGS.map((tag) => (
              <option key={tag.tag} value={tag.tag}>
                {tag.emoji} {tag.label}
              </option>
            ))}
          </select>
        </div>

        {/* Size */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">Tamanho</label>
          <div className="flex gap-2">
            {[
              { value: 'short', label: 'Curto', words: '150-200' },
              { value: 'medium', label: 'Médio', words: '300-400' },
              { value: 'long', label: 'Longo', words: '500-600' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setSize(option.value as 'short' | 'medium' | 'long')}
                className={`flex-1 py-3 rounded-xl border-2 transition-all ${
                  size === option.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className="font-medium">{option.label}</span>
                <span className="block text-xs text-slate-500">{option.words} palavras</span>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Generate with AI */}
        <button
          onClick={generateWithAI}
          disabled={loading}
          className="w-full py-4 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Gerando...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Gerar história com IA
            </>
          )}
        </button>

        <div className="border-t border-slate-200 pt-4 mt-4">
          <p className="text-sm font-medium text-slate-600 mb-2">Ou copie o prompt e use em outro lugar</p>
          <textarea
            value={generatePrompt()}
            readOnly
            className="w-full min-h-[200px] px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono resize-y"
          />
          <button
            onClick={copyPrompt}
            className="mt-2 w-full py-2 border-2 border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Copiar prompt
          </button>
        </div>
      </div>
    </div>
  );
}
