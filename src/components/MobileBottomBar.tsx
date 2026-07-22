import { Home, Blocks, RefreshCw, Puzzle, Library } from 'lucide-react';
import { useStore } from '../store/useStore';

export function MobileBottomBar() {
  const { viewMode, goToHome, setViewMode, startMemoryGame, startReaders, getTotalCardsForReview } = useStore();
  const totalReview = getTotalCardsForReview();

  const items = [
    {
      id: 'home',
      label: 'Início',
      icon: Home,
      viewModes: ['home', 'cards', 'review'],
      action: goToHome,
      gradient: 'from-cyan-400 to-blue-500',
      color: 'text-cyan-500',
    },
    {
      id: 'bricks',
      label: 'Bricks',
      icon: Blocks,
      viewModes: ['bricks', 'bricks-challenge'],
      action: () => setViewMode('bricks'),
      gradient: 'from-amber-400 to-orange-500',
      color: 'text-amber-500',
    },
    {
      id: 'review',
      label: 'Revisar',
      icon: RefreshCw,
      viewModes: ['play', 'review-hub'],
      action: () => setViewMode('review-hub'),
      badge: totalReview > 0 ? totalReview : undefined,
      gradient: 'from-violet-500 to-purple-500',
      color: 'text-violet-500',
    },
    {
      id: 'pairs',
      label: 'Pairs',
      icon: Puzzle,
      viewModes: ['memory'],
      action: () => startMemoryGame(),
      gradient: 'from-pink-400 to-rose-500',
      color: 'text-pink-500',
    },
    {
      id: 'readers',
      label: 'Readers',
      icon: Library,
      viewModes: ['readers'],
      action: () => startReaders(),
      gradient: 'from-indigo-400 to-purple-500',
      color: 'text-indigo-500',
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface backdrop-blur-xl border-t border-line safe-area-bottom">
      <div className="flex items-stretch justify-around px-2 h-16">
        {items.map((item) => {
          const isActive = item.viewModes.includes(viewMode);
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={item.action}
              className="flex flex-1 flex-col items-center justify-center py-2 px-1 transition-all duration-200"
            >
              <div
                className={`relative p-2 rounded-xl transition-all duration-200 ${
                  isActive ? `bg-gradient-to-br ${item.gradient} shadow-md` : 'bg-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-white' : item.color}`} />
                {item.badge && (
                  <span className="absolute -right-1.5 -top-1.5 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-violet-500 px-1 text-[10px] font-bold leading-none text-white shadow-sm ring-2 ring-white tabular-nums">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-semibold mt-0.5 ${item.color}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
