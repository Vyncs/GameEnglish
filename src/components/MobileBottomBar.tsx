import { Home, Blocks, Gamepad2, Puzzle, Library } from 'lucide-react';
import { useStore } from '../store/useStore';
export function MobileBottomBar() {
  const { viewMode, goToHome, setViewMode, startPlayMode, startMemoryGame, startReaders, getTotalCardsForReview } = useStore();
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
      id: 'play',
      label: 'Jogar',
      icon: Gamepad2,
      viewModes: ['play'],
      action: () => startPlayMode(),
      badge: totalReview > 0 ? totalReview : undefined,
      isFab: true,
      gradient: 'from-violet-500 to-purple-600',
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
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-slate-200/60 safe-area-bottom">
      <div className="flex items-end justify-around px-2 h-16">
        {items.map((item) => {
          const isActive = item.viewModes.includes(viewMode);
          const Icon = item.icon;

          if (item.isFab) {
            const hasReviews = !!item.badge;
            return (
              <button
                key={item.id}
                onClick={item.action}
                className="relative -mt-5 flex flex-col items-center"
                title={hasReviews ? 'Cards para revisar!' : undefined}
              >
                {/* Badge fica fora da camada com overflow-hidden para não ser recortado */}
                <div className="relative h-14 w-14 shrink-0">
                  <div
                    className={`absolute inset-0 flex items-center justify-center overflow-hidden rounded-2xl shadow-xl transition-all duration-200 ${
                      isActive
                        ? `bg-gradient-to-br ${item.gradient} shadow-violet-500/40 scale-105`
                        : hasReviews
                          ? 'bg-gradient-to-br from-violet-600 via-fuchsia-500 to-orange-500 shadow-lg shadow-fuchsia-500/30 ' +
                            'ring-2 ring-violet-400/35 ring-offset-2 ring-offset-white/80 ' +
                            'shadow-[inset_0_2px_0_0_rgba(255,255,255,0.35)] ' +
                            'before:pointer-events-none before:absolute before:inset-x-1 before:top-1 before:h-[45%] before:rounded-t-xl before:bg-gradient-to-b before:from-white/30 before:to-transparent'
                          : `bg-gradient-to-br ${item.gradient} shadow-violet-500/20`
                    }`}
                  >
                    {isActive && (
                      <div className="absolute inset-0 rounded-2xl ring-4 ring-violet-400/30 animate-pulse" />
                    )}
                    <Icon className="relative z-[1] h-6 w-6 text-white" />
                  </div>
                  {item.badge && (
                    <span className="absolute -right-1 -top-1 z-20 flex min-h-[22px] min-w-[1.75rem] items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-1.5 py-0.5 text-center text-[10px] font-bold leading-none text-white shadow-lg ring-2 ring-white/90 tabular-nums [font-feature-settings:'tnum'] animate-pulse sm:min-w-8 sm:px-2 sm:text-[11px]">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] font-semibold mt-1 ${
                    isActive ? 'text-violet-600' : hasReviews ? 'text-fuchsia-600' : 'text-slate-500'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={item.action}
              className="flex flex-col items-center justify-center py-2 px-1 min-w-[48px] transition-all duration-200"
            >
              <div className={`relative p-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? `bg-gradient-to-br ${item.gradient} shadow-md`
                  : 'bg-transparent'
              }`}>
                <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-white' : 'text-slate-500'}`} />
              </div>
              <span className={`text-[10px] font-medium mt-0.5 ${
                isActive ? item.color : 'text-slate-400'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
