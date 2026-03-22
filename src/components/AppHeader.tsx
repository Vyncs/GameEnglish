import { useState, useEffect, useCallback } from 'react';
import {
  Home, Gamepad2, Blocks, Puzzle, Mic, Library, Lock,
  GraduationCap, BookOpen,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../api/client';
import { AccountMenu } from './AccountMenu';
import { hasPremiumAccess } from '../utils/subscription';
import logoMark from '../assets/logotipo-educacional-raio-tablet.png';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  viewModes: string[];
  action: () => void;
  badge?: number;
  locked?: boolean;
  inDevelopment?: boolean;
  gradient: string;
  conditional?: boolean;
  show?: boolean;
}

export function AppHeader() {
  const { user } = useAuthStore();
  const {
    viewMode, setViewMode, goToHome, startPlayMode, startMemoryGame,
    startReaders, getTotalCardsForReview,
  } = useStore();

  const isSubscribed = hasPremiumAccess(user?.subscriptionStatus);
  const [hasTeacher, setHasTeacher] = useState(false);

  const checkTeacher = useCallback(() => {
    if (!user || user.role !== 'USER') return;
    api.getStudentHasTeacher().then((r) => setHasTeacher(r.hasTeacher)).catch(() => {});
  }, [user]);

  useEffect(() => { checkTeacher(); }, [checkTeacher]);

  const totalReviewCount = getTotalCardsForReview();

  const goToGroups = () => {
    const { groups, selectedGroupId, selectGroup, setViewMode } = useStore.getState();
    if (groups.length && !selectedGroupId) {
      selectGroup(groups[0].id);
    } else {
      setViewMode('cards');
    }
  };

  const navItems: NavItem[] = [
    {
      id: 'home',
      label: 'Início',
      icon: <Home className="w-4 h-4" />,
      viewModes: ['home'],
      action: goToHome,
      gradient: 'from-cyan-500 to-blue-500',
    },
    {
      id: 'groups',
      label: 'Grupos',
      icon: <BookOpen className="w-4 h-4" />,
      viewModes: ['cards'],
      action: goToGroups,
      gradient: 'from-cyan-500 to-teal-500',
    },
    {
      id: 'readers',
      label: 'Readers',
      icon: <Library className="w-4 h-4" />,
      viewModes: ['readers'],
      action: () => startReaders(),
      locked: !isSubscribed,
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      id: 'play',
      label: 'Jogar',
      icon: <Gamepad2 className="w-4 h-4" />,
      viewModes: ['play'],
      action: () => startPlayMode(),
      badge: totalReviewCount > 0 ? totalReviewCount : undefined,
      gradient: 'from-violet-500 to-purple-500',
    },
    {
      id: 'bricks',
      label: 'Bricks',
      icon: <Blocks className="w-4 h-4" />,
      viewModes: ['bricks', 'bricks-challenge'],
      action: () => setViewMode('bricks'),
      locked: !isSubscribed,
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      id: 'pairs',
      label: 'Pairs',
      icon: <Puzzle className="w-4 h-4" />,
      viewModes: ['memory'],
      action: () => startMemoryGame(),
      locked: !isSubscribed,
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      id: 'karaoke',
      label: 'Karaoke',
      icon: <Mic className="w-4 h-4" />,
      viewModes: ['karaoke'],
      action: () => setViewMode('karaoke'),
      inDevelopment: true,
      gradient: 'from-fuchsia-500 to-purple-600',
    },
    {
      id: 'teacher-materials',
      label: 'Materiais',
      icon: <GraduationCap className="w-4 h-4" />,
      viewModes: ['teacher-materials'],
      action: () => setViewMode('teacher-materials'),
      gradient: 'from-violet-500 to-purple-500',
      conditional: true,
      show: hasTeacher,
    },
  ];

  const visibleNavItems = navItems.filter((item) => !item.conditional || item.show);

  const renderNavPill = (item: NavItem, compact = false) => {
    const isActive = item.viewModes.includes(viewMode);
    const playHasReviews = item.id === 'play' && !!item.badge;

    const basePill = 'relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200';

    let pillClass = basePill;
    if (isActive) {
      pillClass += ` bg-gradient-to-r ${item.gradient} text-white shadow-lg`;
    } else if (item.locked) {
      pillClass += ' text-slate-400 hover:bg-slate-100';
    } else if (item.inDevelopment) {
      pillClass += ' text-slate-600 hover:bg-amber-50/80 border border-amber-200/60';
    } else if (playHasReviews) {
      /* Jogar com revisões pendentes: destaque gamificação */
      pillClass +=
        ' bg-gradient-to-r from-violet-500/12 via-fuchsia-500/12 to-violet-600/12 text-violet-900 border border-violet-400/45 shadow-md shadow-violet-500/20 ring-1 ring-fuchsia-400/25 hover:from-violet-500/18 hover:via-fuchsia-500/18 hover:to-violet-600/18';
    } else {
      pillClass += ' text-slate-600 hover:bg-slate-100';
    }

    return (
      <button
        key={item.id}
        type="button"
        onClick={() => item.action()}
        className={pillClass}
        title={
          item.locked
            ? 'Assine para desbloquear'
            : item.inDevelopment
              ? 'Em desenvolvimento'
              : playHasReviews
                ? 'Você tem cards para revisar!'
                : undefined
        }
      >
        {item.locked && !isActive && <Lock className="w-3 h-3 opacity-50" />}
        {item.icon}
        {!compact && <span>{item.label}</span>}
        {item.badge && (
          <span
            className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
              isActive
                ? 'bg-white/25 text-white'
                : 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-sm ring-1 ring-white/40 animate-pulse'
            }`}
          >
            {item.badge}
          </span>
        )}
        {item.inDevelopment && !compact && (
          <span
            className={`px-1.5 py-0.5 text-[9px] font-semibold rounded-md whitespace-nowrap ${
              isActive ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
            }`}
          >
            Em desenvolvimento
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden lg:flex fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 z-40 items-center px-6 gap-4">
        {/* Logo — apenas o círculo da marca */}
        <div className="flex items-center shrink-0 mr-2">
          <button
            type="button"
            onClick={goToHome}
            className="h-10 w-10 rounded-full overflow-hidden ring-1 ring-slate-200/80 shadow-sm shrink-0 cursor-pointer hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2"
            title="Ir para o início"
            aria-label="Ir para o início"
          >
            <img
              src={logoMark}
              alt=""
              className="h-full w-full object-cover object-center pointer-events-none"
              draggable={false}
            />
          </button>
        </div>

        {/* Center Nav */}
        <nav className="flex-1 flex items-center justify-center gap-1 overflow-x-auto">
          {visibleNavItems.map((item) => renderNavPill(item))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-2 shrink-0">
          <AccountMenu />
        </div>
      </header>

      {/* Mobile Top Bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 z-40 flex items-center justify-between px-4 gap-2">
        <button
          type="button"
          onClick={goToHome}
          className="h-9 w-9 rounded-full overflow-hidden ring-1 ring-slate-200/80 shadow-sm shrink-0 cursor-pointer hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2"
          title="Ir para o início"
          aria-label="Ir para o início"
        >
          <img
            src={logoMark}
            alt=""
            className="h-full w-full object-cover object-center pointer-events-none"
            draggable={false}
          />
        </button>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={goToGroups}
            className={`p-2 rounded-xl transition-colors ${
              viewMode === 'cards'
                ? 'bg-cyan-500 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            title="Grupos"
          >
            <BookOpen className="w-5 h-5" />
          </button>

          <AccountMenu />

          {hasTeacher && (
            <button
              type="button"
              onClick={() => setViewMode('teacher-materials')}
              className={`p-2 rounded-xl transition-colors ${
                viewMode === 'teacher-materials'
                  ? 'bg-violet-500 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="Materiais"
            >
              <GraduationCap className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>
    </>
  );
}
