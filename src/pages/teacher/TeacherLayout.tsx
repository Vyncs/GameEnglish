import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  ArrowLeft,
  Menu,
  X,
  GraduationCap,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/teacher', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/teacher/students', label: 'Meus Alunos', icon: Users, end: false },
  { to: '/teacher/materials', label: 'Materiais', icon: FileText, end: false },
];

export function TeacherLayout() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-blue-50/50">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 w-72 h-72 bg-indigo-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:flex flex-col w-64 bg-white/70 backdrop-blur-xl border-r border-slate-200/60 p-4 sticky top-0 h-screen">
          <SidebarContent onBack={() => navigate('/app')} />
        </aside>

        {/* Sidebar - Mobile overlay */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <aside className="relative w-72 bg-white/95 backdrop-blur-xl border-r border-slate-200/60 p-4 flex flex-col shadow-2xl">
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
              <SidebarContent onBack={() => navigate('/app')} onNavClick={() => setMobileOpen(false)} />
            </aside>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {/* Mobile header */}
          <div className="lg:hidden flex items-center gap-3 p-4 bg-white/60 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-40">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-xl bg-white/80 shadow-sm border border-slate-100 hover:bg-white transition-colors"
            >
              <Menu className="w-5 h-5 text-slate-600" />
            </button>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-violet-600" />
              <span className="font-semibold text-slate-800">Professor</span>
            </div>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ onBack, onNavClick }: { onBack: () => void; onNavClick?: () => void }) {
  return (
    <>
      <div className="flex items-center gap-3 mb-2 px-2">
        <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-bold text-slate-800 text-sm">Painel Professor</h2>
          <p className="text-xs text-slate-400">Play Flash Cards</p>
        </div>
      </div>

      <button
        onClick={onBack}
        className="flex items-center gap-2 px-3 py-2 mb-4 mt-2 text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar ao app
      </button>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-violet-500/10 to-purple-500/10 text-violet-700 shadow-sm border border-violet-200/50'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
              }`
            }
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-slate-200/60">
        <p className="text-[10px] text-slate-400 text-center">
          Play Flash Cards &copy; {new Date().getFullYear()}
        </p>
      </div>
    </>
  );
}
