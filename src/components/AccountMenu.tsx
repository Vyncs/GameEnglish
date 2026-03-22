import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, ChevronDown, UserCircle, GraduationCap, LayoutDashboard,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { useAuthStore } from '../store/useAuthStore';

export function AccountMenu() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { viewMode, setViewMode } = useStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const isAdmin = user?.role === 'ADMIN';
  const isTeacher = user?.role === 'TEACHER' || user?.role === 'ADMIN';

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const active = viewMode === 'account' || open;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
          active
            ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg'
            : 'text-slate-600 hover:bg-slate-100'
        }`}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <User className="w-4 h-4 shrink-0" />
        <span className="hidden xl:inline">Conta</span>
        <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          className="absolute top-full right-0 mt-2 min-w-[220px] py-1.5 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/60 z-50 overflow-hidden"
          role="menu"
        >
          <button
            type="button"
            role="menuitem"
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left"
            onClick={() => {
              setViewMode('account');
              setOpen(false);
            }}
          >
            <UserCircle className="w-4 h-4 text-slate-500 shrink-0" />
            Meu perfil
          </button>
          {isAdmin && (
            <button
              type="button"
              role="menuitem"
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-amber-600 hover:bg-amber-50 transition-colors text-left"
              onClick={() => {
                navigate('/admin');
                setOpen(false);
              }}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              Admin
            </button>
          )}
          {isTeacher && (
            <button
              type="button"
              role="menuitem"
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-violet-600 hover:bg-violet-50 transition-colors text-left"
              onClick={() => {
                navigate('/teacher');
                setOpen(false);
              }}
            >
              <GraduationCap className="w-4 h-4 shrink-0" />
              Professor
            </button>
          )}
        </div>
      )}
    </div>
  );
}
