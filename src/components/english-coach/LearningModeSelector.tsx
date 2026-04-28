import { COACH_MODES, type CoachMode } from '../../types/englishCoach';

interface LearningModeSelectorProps {
  value: CoachMode;
  onChange: (mode: CoachMode) => void;
  compact?: boolean;
}

export function LearningModeSelector({ value, onChange, compact }: LearningModeSelectorProps) {
  if (compact) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {COACH_MODES.map((opt) => {
          const active = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                active
                  ? 'bg-cyan-500 text-white border-cyan-500 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-cyan-300 hover:bg-cyan-50/40'
              }`}
              aria-pressed={active}
            >
              <span className="mr-1">{opt.emoji}</span>
              {opt.label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2">
      {COACH_MODES.map((opt) => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`text-left p-3 rounded-2xl border transition-all ${
              active
                ? 'bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-300 ring-2 ring-cyan-200 shadow-sm'
                : 'bg-white border-slate-200 hover:border-cyan-300 hover:shadow-sm'
            }`}
            aria-pressed={active}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{opt.emoji}</span>
              <span className={`text-sm font-semibold ${active ? 'text-cyan-800' : 'text-slate-800'}`}>
                {opt.label}
              </span>
            </div>
            <p className={`mt-0.5 text-[11px] ${active ? 'text-cyan-700/80' : 'text-slate-500'}`}>
              {opt.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}
