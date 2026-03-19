import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home, Gamepad2, Blocks, Puzzle, Mic, Library, Lock, Construction,
  GraduationCap, LayoutDashboard, User, BookOpen,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../api/client';
import { GroupsDropdown } from './GroupsDropdown';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  viewModes: string[];
  action: () => void;
  badge?: number;
  locked?: boolean;
  disabled?: boolean;
  disabledLabel?: string;
  gradient: string;
  conditional?: boolean;
  show?: boolean;
}

export function AppHeader() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    viewMode, setViewMode, goToHome, startPlayMode, startMemoryGame,
    startReaders, getTotalCardsForReview,
  } = useStore();

  const isSubscribed = user?.subscriptionStatus === 'active';
  const isAdmin = user?.role === 'ADMIN';
  const isTeacher = user?.role === 'TEACHER' || user?.role === 'ADMIN';
  const [hasTeacher, setHasTeacher] = useState(false);

  const checkTeacher = useCallback(() => {
    if (!user || user.role !== 'USER') return;
    api.getStudentHasTeacher().then((r) => setHasTeacher(r.hasTeacher)).catch(() => {});
  }, [user]);

  useEffect(() => { checkTeacher(); }, [checkTeacher]);

  const totalReviewCount = getTotalCardsForReview();

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
      action: () => {},
      disabled: true,
      disabledLabel: 'Em breve',
      gradient: 'from-slate-400 to-slate-500',
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

    if (item.disabled) {
      return (
        <div
          key={item.id}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl opacity-40 cursor-not-allowed text-slate-400 text-sm"
          title={item.disabledLabel}
        >
          <Construction className="w-3 h-3 text-amber-500" />
          {item.icon}
          {!compact && <span className="font-medium">{item.label}</span>}
          {!compact && (
            <span className="px-1 py-0.5 bg-amber-100 text-amber-600 text-[8px] font-bold uppercase rounded">
              Breve
            </span>
          )}
        </div>
      );
    }

    return (
      <button
        key={item.id}
        onClick={() => item.action()}
        className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
          isActive
            ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg shadow-${item.gradient.split('-')[1]}-500/25`
            : item.locked
              ? 'text-slate-400 hover:bg-slate-100'
              : 'text-slate-600 hover:bg-slate-100'
        }`}
        title={item.locked ? 'Assine para desbloquear' : undefined}
      >
        {item.locked && !isActive && <Lock className="w-3 h-3 opacity-50" />}
        {item.icon}
        {!compact && <span>{item.label}</span>}
        {item.badge && (
          <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
            isActive
              ? 'bg-white/25 text-white'
              : 'bg-violet-100 text-violet-600 animate-pulse'
          }`}>
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden lg:flex fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 z-40 items-center px-6 gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0 mr-2">
          <span className="text-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
            Play Flash Cards
          </span>
        </div>

        {/* Center Nav */}
        <nav className="flex-1 flex items-center justify-center gap-1 overflow-x-auto">
          {visibleNavItems.map((item) => renderNavPill(item))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-2 shrink-0">
          <GroupsDropdown />

          {isTeacher && (
            <button
              onClick={() => navigate('/teacher')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-violet-600 hover:bg-violet-50 transition-colors"
            >
              <GraduationCap className="w-4 h-4" />
              <span className="hidden xl:inline">Professor</span>
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => navigate('/admin')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-amber-600 hover:bg-amber-50 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden xl:inline">Admin</span>
            </button>
          )}

          <button
            onClick={() => setViewMode('account')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              viewMode === 'account'
                ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <User className="w-4 h-4" />
            <span className="hidden xl:inline">Conta</span>
          </button>
        </div>
      </header>

      {/* Mobile Top Bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 z-40 flex items-center justify-between px-4">
        <span className="text-lg font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
          PFC
        </span>

        <div className="flex items-center gap-2">
          <GroupsDropdown />

          {isTeacher && (
            <button
              onClick={() => navigate('/teacher')}
              className="p-2 rounded-xl text-violet-600 hover:bg-violet-50 transition-colors"
            >
              <GraduationCap className="w-5 h-5" />
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => navigate('/admin')}
              className="p-2 rounded-xl text-amber-600 hover:bg-amber-50 transition-colors"
            >
              <LayoutDashboard className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={() => setViewMode('account')}
            className={`p-2 rounded-xl transition-colors ${
              viewMode === 'account'
                ? 'bg-teal-500 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <User className="w-5 h-5" />
          </button>

          {hasTeacher && (
            <button
              onClick={() => setViewMode('teacher-materials')}
              className={`p-2 rounded-xl transition-colors ${
                viewMode === 'teacher-materials'
                  ? 'bg-violet-500 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>
    </>
  );
}
