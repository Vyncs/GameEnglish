import { useStore } from './store/useStore';
import { Sidebar } from './components/Sidebar';
import { Home } from './components/Home';
import { CardList } from './components/CardList';
import { ReviewSession } from './components/ReviewSession';
import { PlayMode } from './components/PlayMode';
import { BricksChallenge } from './components/BricksChallenge';
import { MemoryGame } from './components/MemoryGame';
import { KaraokeMode } from './components/KaraokeMode';

function App() {
  const { viewMode, sidebarOpen } = useStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-blue-50/50">
      {/* Elementos decorativos de fundo */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 w-72 h-72 bg-indigo-200/20 rounded-full blur-3xl" />
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Conteúdo principal */}
      <main
        className={`min-h-screen transition-all duration-300 ${
          sidebarOpen ? 'ml-80' : 'ml-0'
        }`}
      >
        <div className={viewMode === 'play' || viewMode === 'karaoke' ? '' : 'pt-16 lg:pt-4'}>
          {viewMode === 'home' && <Home />}
          {viewMode === 'cards' && <CardList />}
          {viewMode === 'review' && <ReviewSession />}
          {viewMode === 'play' && <PlayMode />}
          {(viewMode === 'bricks' || viewMode === 'bricks-challenge') && <BricksChallenge />}
          {viewMode === 'memory' && <MemoryGame />}
          {viewMode === 'karaoke' && <KaraokeMode />}
        </div>
      </main>
    </div>
  );
}

export default App;
