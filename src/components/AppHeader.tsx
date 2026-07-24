import { useState, useEffect, useCallback } from 'react';
import {
  Home, RefreshCw, Blocks, Puzzle, Mic, Library, Lock,
  GraduationCap, BookOpen, MessagesSquare, Moon, Sun,
  Volume2,
  VolumeX,
  Languages,
} from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';
import { useSfxStore } from '../store/useSfxStore';
import { useLangStore } from '../store/useLangStore';
import { useT } from '../i18n/useT';
import { findTheme } from '../data/themes';
import { useStore } from '../store/useStore';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../api/client';
import { AccountMenu } from './AccountMenu';

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

// Cor de cada seção (mesma temática da barra de baixo do mobile).
// Usada para deixar os pills do header sempre coloridos, não só o ativo.
const NAV_COLOR: Record<string, string> = {
  home: 'text-cyan-600',
  groups: 'text-teal-600',
  readers: 'text-indigo-600',
  review: 'text-violet-600',
  bricks: 'text-amber-600',
  pairs: 'text-pink-600',
  karaoke: 'text-fuchsia-600',
  'english-coach': 'text-emerald-600',
  'teacher-materials': 'text-violet-600',
};

export function AppHeader() {
  const { user } = useAuthStore();
  const {
    viewMode, setViewMode, goToHome, startMemoryGame,
    startReaders, getTotalCardsForReview,
  } = useStore();

  const themeId = useThemeStore((s) => s.themeId);
  const toggleMode = useThemeStore((s) => s.toggleMode);
  const sfxOn = useSfxStore((s) => s.enabled);
  const toggleSfx = useSfxStore((s) => s.toggle);
  const lang = useLangStore((s) => s.lang);
  const toggleLang = useLangStore((s) => s.toggle);
  const t = useT();
  const isDark = findTheme(themeId).mode === 'dark';

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
      label: t('nav.home'),
      icon: <Home className="w-4 h-4" />,
      viewModes: ['home'],
      action: goToHome,
      gradient: 'from-cyan-500 to-blue-500',
    },
    {
      id: 'groups',
      label: t('nav.groups'),
      icon: <BookOpen className="w-4 h-4" />,
      viewModes: ['cards'],
      action: goToGroups,
      gradient: 'from-cyan-500 to-teal-500',
    },
    {
      id: 'readers',
      label: t('nav.readers'),
      icon: <Library className="w-4 h-4" />,
      viewModes: ['readers'],
      action: () => startReaders(),
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      id: 'review',
      label: t('nav.review'),
      icon: <RefreshCw className="w-4 h-4" />,
      viewModes: ['play', 'review-hub'],
      action: () => setViewMode('review-hub'),
      badge: totalReviewCount > 0 ? totalReviewCount : undefined,
      gradient: 'from-violet-500 to-purple-500',
    },
    {
      id: 'bricks',
      label: t('nav.bricks'),
      icon: <Blocks className="w-4 h-4" />,
      viewModes: ['bricks', 'bricks-challenge'],
      action: () => setViewMode('bricks'),
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      id: 'pairs',
      label: t('nav.pairs'),
      icon: <Puzzle className="w-4 h-4" />,
      viewModes: ['memory'],
      action: () => startMemoryGame(),
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      id: 'karaoke',
      label: t('nav.karaoke'),
      icon: <Mic className="w-4 h-4" />,
      viewModes: ['karaoke'],
      action: () => setViewMode('karaoke'),
      inDevelopment: true,
      gradient: 'from-fuchsia-500 to-purple-600',
    },
    {
      id: 'english-coach',
      label: t('nav.coach'),
      icon: <MessagesSquare className="w-4 h-4" />,
      viewModes: ['english-coach'],
      action: () => setViewMode('english-coach'),
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      id: 'teacher-materials',
      label: t('nav.materials'),
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

    const basePill = 'relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200';

    const sectionColor = NAV_COLOR[item.id] ?? 'text-secondary';

    let pillClass = basePill;
    if (isActive) {
      pillClass += ` bg-gradient-to-r ${item.gradient} text-white shadow-lg`;
    } else if (item.locked) {
      pillClass += ' text-faint hover:bg-surface-2';
    } else if (item.inDevelopment) {
      pillClass += ` ${sectionColor} hover:bg-amber-50 border border-amber-200`;
    } else {
      pillClass += ` ${sectionColor} hover:bg-surface-2`;
    }

    return (
      <button
        key={item.id}
        type="button"
        onClick={() => item.action()}
        className={pillClass}
        title={
          item.locked
            ? t('header.tip.locked')
            : item.inDevelopment
              ? t('header.tip.inDev')
              : item.badge
                ? t('header.tip.reviewBadge')
                : undefined
        }
      >
        {item.locked && !isActive && <Lock className="w-3 h-3 opacity-50" />}
        {item.icon}
        {!compact && <span>{item.label}</span>}
        {item.badge && (
          <span
            className={`relative z-10 px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
              isActive
                ? 'bg-white/25 text-white'
                : 'bg-violet-500 text-white ring-1 ring-violet-300/50 ring-offset-1 ring-offset-transparent'
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
            {t('nav.inDevelopment')}
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden lg:flex fixed top-0 left-0 right-0 h-16 bg-surface backdrop-blur-xl border-b border-line z-40 items-center px-6 gap-4">
        {/* Center Nav */}
        <nav className="flex-1 flex items-center justify-center gap-1 overflow-x-auto">
          {visibleNavItems.map((item) => renderNavPill(item))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={toggleLang}
            className="flex h-9 items-center gap-1 rounded-xl px-2 text-secondary transition-colors hover:bg-surface-2"
            title={lang === 'pt' ? t('header.lang.toEn') : t('header.lang.toPt')}
            aria-label={lang === 'pt' ? t('header.lang.toEn') : t('header.lang.toPt')}
          >
            <Languages className="h-5 w-5" />
            <span className="text-xs font-bold">{lang === 'pt' ? 'PT' : 'EN'}</span>
          </button>

          <button
            type="button"
            onClick={toggleSfx}
            className="grid h-9 w-9 place-items-center rounded-xl text-secondary transition-colors hover:bg-surface-2"
            title={sfxOn ? t('header.sfx.off') : t('header.sfx.on')}
            aria-label={sfxOn ? t('header.sfx.off') : t('header.sfx.on')}
            aria-pressed={sfxOn}
          >
            {sfxOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </button>

          <button
            type="button"
            onClick={toggleMode}
            className="grid h-9 w-9 place-items-center rounded-xl text-secondary transition-colors hover:bg-surface-2"
            title={isDark ? t('header.theme.toLight') : t('header.theme.toDark')}
            aria-label={isDark ? t('header.theme.toLight') : t('header.theme.toDark')}
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <AccountMenu />
        </div>
      </header>

      {/* Mobile Top Bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-surface backdrop-blur-xl border-b border-line z-40 flex items-center justify-between px-4 gap-2">
        <button
          type="button"
          onClick={goToHome}
          className="flex items-center gap-1.5 rounded-xl px-2 py-1.5 text-sm font-semibold text-secondary transition-colors hover:bg-surface-2"
          title={t('header.goHome')}
          aria-label={t('header.goHome')}
        >
          <Home className="h-5 w-5 text-cyan-600" />
          {t('nav.home')}
        </button>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={goToGroups}
            className={`p-2 rounded-xl transition-colors ${
              viewMode === 'cards'
                ? 'bg-cyan-500 text-white'
                : 'text-secondary hover:bg-surface-2'
            }`}
            title={t('nav.groups')}
          >
            <BookOpen className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => setViewMode('english-coach')}
            className={`p-2 rounded-xl transition-colors ${
              viewMode === 'english-coach'
                ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white'
                : 'text-secondary hover:bg-surface-2'
            }`}
            title={t('nav.coach')}
            aria-label={t('nav.coach')}
          >
            <MessagesSquare className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={toggleSfx}
            className="grid h-9 w-9 place-items-center rounded-xl text-secondary transition-colors hover:bg-surface-2"
            title={sfxOn ? 'Desativar sons' : 'Ativar sons'}
            aria-label={sfxOn ? 'Desativar sons' : 'Ativar sons'}
            aria-pressed={sfxOn}
          >
            {sfxOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </button>

          <button
            type="button"
            onClick={toggleMode}
            className="grid h-9 w-9 place-items-center rounded-xl text-secondary transition-colors hover:bg-surface-2"
            title={isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
            aria-label={isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <AccountMenu />

          {hasTeacher && (
            <button
              type="button"
              onClick={() => setViewMode('teacher-materials')}
              className={`p-2 rounded-xl transition-colors ${
                viewMode === 'teacher-materials'
                  ? 'bg-violet-500 text-white'
                  : 'text-secondary hover:bg-surface-2'
              }`}
              title={t('nav.materials')}
            >
              <GraduationCap className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>
    </>
  );
}
