import { COACH_LEVELS, type CoachLevel } from '../../types/englishCoach';

interface LevelSelectorProps {
  value: CoachLevel;
  onChange: (level: CoachLevel) => void;
  compact?: boolean;
}

export function LevelSelector({ value, onChange, compact }: LevelSelectorProps) {
  return (
    <div className={compact ? 'flex flex-wrap gap-1.5' : 'grid grid-cols-1 gap-2'}>
      {COACH_LEVELS.map((opt) => {
        const active = value === opt.id;
        if (compact) {
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                active
                  ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40'
              }`}
              aria-pressed={active}
            >
              <span className="mr-1">{opt.emoji}</span>
              {opt.label}
            </button>
          );
        }
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`text-left p-3 rounded-2xl border transition-all ${
              active
                ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-300 ring-2 ring-emerald-200 shadow-sm'
                : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-sm'
            }`}
            aria-pressed={active}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{opt.emoji}</span>
              <span className={`font-semibold ${active ? 'text-emerald-800' : 'text-slate-800'}`}>
                {opt.label}
              </span>
            </div>
            <p className={`mt-1 text-xs ${active ? 'text-emerald-700/80' : 'text-slate-500'}`}>
              {opt.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}
