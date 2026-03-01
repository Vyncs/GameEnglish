import { useEffect } from 'react';
import { useStore } from './store/useStore';
import { useAuthStore } from './store/useAuthStore';
import { Sidebar } from './components/Sidebar';
import { Home } from './components/Home';
import { CardList } from './components/CardList';
import { ReviewSession } from './components/ReviewSession';
import { PlayMode } from './components/PlayMode';
import { BricksChallenge } from './components/BricksChallenge';
import { MemoryGame } from './components/MemoryGame';
import { KaraokeMode } from './components/KaraokeMode';
import { GradedReaders } from './components/GradedReaders';
import { Account } from './components/Account';
import { PaywallOverlay } from './components/PaywallOverlay';
import { api } from './api/client';

const SUBSCRIPTION_VIEWS: Record<string, string> = {
  'bricks': 'Bricks Challenge',
  'bricks-challenge': 'Bricks Challenge',
  'memory': 'Pairs Challenge',
  'karaoke': 'Karaoke Mode',
  'readers': 'Graded Readers',
};

const MEMORY_SYNC_DEBOUNCE_MS = 1500;

export function AppLayout() {
  const { viewMode, sidebarOpen, hydrateFromSync, memoryDecks, hiddenDefaultDeckIds } = useStore();
  const { user } = useAuthStore();
  const isSubscribed = user?.subscriptionStatus === 'active';

  useEffect(() => {
    const token = api.getToken();
    if (!token) return;
    api.getSync().then(hydrateFromSync).catch(() => {});
  }, [hydrateFromSync]);

  // Persistir decks do Pairs Challenge no backend quando o usuário editar (debounce)
  useEffect(() => {
    if (!api.getToken()) return;
    const t = setTimeout(() => {
      api.putMemory({ memoryDecks, hiddenDefaultDeckIds }).catch(() => {});
    }, MEMORY_SYNC_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [memoryDecks, hiddenDefaultDeckIds]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-blue-50/50">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 w-72 h-72 bg-indigo-200/20 rounded-full blur-3xl" />
      </div>

      <Sidebar />

      <main
        className={`min-h-screen transition-all duration-300 ${
          sidebarOpen ? 'ml-80' : 'ml-0'
        }`}
      >
        <div className={`relative ${viewMode === 'play' || viewMode === 'karaoke' || viewMode === 'readers' ? '' : 'pt-16 lg:pt-4'}`}>
          {viewMode === 'home' && <Home />}
          {viewMode === 'cards' && <CardList />}
          {viewMode === 'review' && <ReviewSession />}
          {viewMode === 'play' && <PlayMode />}
          {(viewMode === 'bricks' || viewMode === 'bricks-challenge') && (
            <>
              <BricksChallenge />
              {!isSubscribed && <PaywallOverlay featureName={SUBSCRIPTION_VIEWS[viewMode] || 'Bricks Challenge'} />}
            </>
          )}
          {viewMode === 'memory' && (
            <>
              <MemoryGame />
              {!isSubscribed && <PaywallOverlay featureName="Pairs Challenge" />}
            </>
          )}
          {viewMode === 'karaoke' && (
            <>
              <KaraokeMode />
              {!isSubscribed && <PaywallOverlay featureName="Karaoke Mode" />}
            </>
          )}
          {viewMode === 'readers' && (
            <>
              <GradedReaders />
              {!isSubscribed && <PaywallOverlay featureName="Graded Readers" />}
            </>
          )}
          {viewMode === 'account' && <Account />}
        </div>
      </main>
    </div>
  );
}
