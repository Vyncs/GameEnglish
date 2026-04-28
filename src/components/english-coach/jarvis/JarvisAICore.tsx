import { Mic, Keyboard } from 'lucide-react';
import { useAvatarStateOptional } from '../avatar/AvatarStateProvider';
import type { AvatarStateKind } from '../../../types/englishCoach';

interface JarvisAICoreProps {
  onPushToTalk?: () => void;
  onStop?: () => void;
  isVoiceActive?: boolean;
  voiceSupported?: boolean;
  voiceStatus?: string;
}

/**
 * AI Core compacto — ring 260, push-to-talk 64, margens reduzidas.
 */
export function JarvisAICore({
  onPushToTalk,
  onStop,
  isVoiceActive,
  voiceSupported,
}: JarvisAICoreProps) {
  const ctx = useAvatarStateOptional();
  const stateKind: AvatarStateKind | 'idle' = ctx?.state.kind ?? 'idle';
  const statusLabel = labelByState(stateKind, isVoiceActive);
  const statusColor = colorByState(stateKind);

  const SIZE = 260;

  return (
    <div className="relative flex flex-col items-center justify-center w-full">
      {/* Container do Core */}
      <div className="relative" style={{ width: SIZE, height: SIZE, maxWidth: '100%' }}>
        <CoreBackdrop size={SIZE} />

        <div className="jv-ring-spin-slow absolute inset-0">
          <Ring size={SIZE} stroke={1} color="rgba(34, 211, 238, 0.16)" dashed={[1, 4]} />
        </div>

        <div className="jv-ring-spin-rev absolute" style={{ inset: 22 }}>
          <Ring
            size={SIZE - 44}
            stroke={1}
            color="rgba(34, 211, 238, 0.30)"
            dashed={[6, 8]}
            tickMarks={12}
          />
        </div>

        <div
          className="jv-pulse-ring absolute rounded-full"
          style={{
            inset: 50,
            border: `1px solid ${statusColor}`,
            boxShadow: `0 0 22px ${statusColor}33, inset 0 0 22px ${statusColor}22`,
          }}
        />

        <div
          className="absolute rounded-full"
          style={{
            inset: 66,
            border: `1.5px solid ${statusColor}`,
            boxShadow: `0 0 18px ${statusColor}55`,
          }}
        />

        {(stateKind === 'listening' || isVoiceActive) && (
          <div
            className="jv-radar absolute pointer-events-none"
            style={{ inset: 66, transformOrigin: 'center' }}
          >
            <div
              className="absolute"
              style={{
                top: '50%',
                left: '50%',
                width: '50%',
                height: 1.5,
                transformOrigin: 'left center',
                background: `linear-gradient(90deg, ${statusColor} 0%, transparent 100%)`,
                opacity: 0.7,
              }}
            />
          </div>
        )}

        {/* Núcleo central */}
        <div
          className="absolute rounded-full flex items-center justify-center overflow-hidden"
          style={{
            inset: 84,
            background: `radial-gradient(circle at 35% 30%, rgba(34, 211, 238, 0.18) 0%, rgba(11, 16, 32, 0.95) 65%)`,
            boxShadow: `inset 0 0 36px ${statusColor}40, 0 0 44px ${statusColor}30`,
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, ${statusColor}55 0%, transparent 60%)`,
              filter: 'blur(6px)',
              opacity: stateKind === 'idle' ? 0.5 : 1,
              transition: 'opacity 280ms ease-out',
            }}
          />
          {/* 5 audio bars */}
          <div className="relative z-10 flex items-end justify-center gap-[5px] h-9">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`jv-bar-${i} w-[3px] rounded-full origin-bottom`}
                style={{
                  height: '100%',
                  background: `linear-gradient(180deg, ${statusColor} 0%, ${statusColor}77 100%)`,
                  boxShadow: `0 0 5px ${statusColor}88`,
                  opacity: stateKind === 'idle' && !isVoiceActive ? 0.45 : 1,
                  animationPlayState:
                    stateKind === 'idle' && !isVoiceActive ? 'paused' : 'running',
                }}
              />
            ))}
          </div>
        </div>

        <CornerTicks color={statusColor} />
      </div>

      {/* Title compacto */}
      <div className="mt-3 flex flex-col items-center text-center">
        <h2
          className="text-[20px] font-bold tracking-[0.30em] text-white leading-none"
          style={{ textShadow: `0 0 18px ${statusColor}66` }}
        >
          E.&nbsp;C.&nbsp;A.
        </h2>

        <div
          className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full"
          style={{
            background: 'rgba(34, 211, 238, 0.06)',
            border: `1px solid ${statusColor}40`,
          }}
        >
          <span
            className="jv-dot-pulse relative inline-block w-1.5 h-1.5 rounded-full"
            style={{ background: statusColor }}
          />
          <span
            className="text-[10px] font-semibold tracking-wider uppercase"
            style={{ color: statusColor }}
          >
            {statusLabel}
          </span>
        </div>
      </div>

      {/* Push-to-talk row — compacto */}
      <div className="mt-4 flex items-center gap-3">
        <PushToTalkButton
          active={!!isVoiceActive}
          color={statusColor}
          disabled={!voiceSupported}
          onClick={() => {
            if (!voiceSupported) return;
            if (isVoiceActive) onStop?.();
            else onPushToTalk?.();
          }}
        />
        <CircleAuxButton icon={<Keyboard className="w-4 h-4" />} />
      </div>

      <div className="mt-2 text-center">
        <p className="text-[12px] font-medium text-slate-200">
          {voiceSupported
            ? isVoiceActive
              ? 'Toque para parar'
              : 'Toque para falar'
            : 'Voz não suportada'}
        </p>
        {voiceSupported && (
          <p className="mt-0.5 text-[10px] text-slate-500">
            ou pressione{' '}
            <kbd className="px-1 py-0.5 rounded bg-slate-800/60 border border-cyan-500/15 font-mono text-[9px] text-slate-300">
              Espaço
            </kbd>
          </p>
        )}
      </div>
    </div>
  );
}

// ============================================================================

function Ring({
  size,
  stroke,
  color,
  dashed,
  tickMarks,
}: {
  size: number;
  stroke: number;
  color: string;
  dashed?: [number, number];
  tickMarks?: number;
}) {
  const r = size / 2 - stroke;
  const cx = size / 2;
  const cy = size / 2;
  const dashArray = dashed ? `${dashed[0]} ${dashed[1]}` : undefined;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={dashArray}
      />
      {tickMarks &&
        Array.from({ length: tickMarks }).map((_, i) => {
          const angle = (i / tickMarks) * Math.PI * 2;
          const x1 = cx + Math.cos(angle) * (r - 4);
          const y1 = cy + Math.sin(angle) * (r - 4);
          const x2 = cx + Math.cos(angle) * (r + 4);
          const y2 = cy + Math.sin(angle) * (r + 4);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={color}
              strokeWidth={1.2}
              opacity={0.55}
            />
          );
        })}
    </svg>
  );
}

function CornerTicks({ color }: { color: string }) {
  const corners: Array<{ rotate: number; pos: React.CSSProperties }> = [
    { rotate: 0,   pos: { top: 4,    left: 4 } },
    { rotate: 90,  pos: { top: 4,    right: 4 } },
    { rotate: 180, pos: { bottom: 4, right: 4 } },
    { rotate: 270, pos: { bottom: 4, left: 4 } },
  ];
  return (
    <>
      {corners.map((c, i) => (
        <div
          key={i}
          className="absolute pointer-events-none"
          style={{ ...c.pos, transform: `rotate(${c.rotate}deg)` }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16">
            <path
              d="M 1 6 L 1 1 L 6 1"
              stroke={color}
              strokeWidth="1.2"
              fill="none"
              opacity="0.6"
            />
          </svg>
        </div>
      ))}
    </>
  );
}

function CoreBackdrop({ size }: { size: number }) {
  return (
    <svg
      className="pointer-events-none absolute"
      style={{ inset: 0, opacity: 0.14 }}
      viewBox={`0 0 ${size} ${size}`}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="jv-wave" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="50%" stopColor="rgba(34,211,238,0.6)" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
      <path
        d={`M 0 ${size / 2} Q ${size / 6} ${size / 2 - 30} ${size / 3} ${size / 2} T ${(2 * size) / 3} ${size / 2} T ${size} ${size / 2}`}
        stroke="url(#jv-wave)"
        strokeWidth="1.2"
        fill="none"
      />
    </svg>
  );
}

function PushToTalkButton({
  active,
  color,
  disabled,
  onClick,
}: {
  active: boolean;
  color: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="relative grid place-items-center rounded-full transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.96]"
      style={{
        width: 64,
        height: 64,
        background: active
          ? `radial-gradient(circle at 35% 30%, ${color}cc 0%, ${color}66 70%)`
          : `radial-gradient(circle at 35% 30%, rgba(34, 211, 238, 0.22) 0%, rgba(11, 16, 32, 0.6) 70%)`,
        border: `1.5px solid ${color}${active ? 'cc' : '55'}`,
        boxShadow: active
          ? `0 0 0 3px ${color}22, 0 0 24px ${color}88, inset 0 0 18px ${color}44`
          : `0 0 18px ${color}33, inset 0 0 14px rgba(34, 211, 238, 0.12)`,
      }}
      aria-pressed={active}
      aria-label={active ? 'Parar de falar' : 'Iniciar conversa por voz'}
    >
      <Mic
        className="relative z-10 transition-transform duration-200"
        style={{
          width: 24,
          height: 24,
          color: active ? '#fff' : color,
          transform: active ? 'scale(1.1)' : 'scale(1)',
        }}
        strokeWidth={2.2}
      />
    </button>
  );
}

function CircleAuxButton({ icon }: { icon: React.ReactNode }) {
  return (
    <button
      type="button"
      className="grid place-items-center rounded-full transition-all duration-200 hover:border-cyan-500/60 hover:bg-cyan-500/10"
      style={{
        width: 44,
        height: 44,
        background: 'rgba(15, 21, 37, 0.7)',
        border: '1px solid rgba(34, 211, 238, 0.22)',
        color: '#94a3b8',
      }}
    >
      {icon}
    </button>
  );
}

function labelByState(kind: AvatarStateKind | 'idle', voiceActive?: boolean): string {
  if (kind === 'speaking') return 'Falando';
  if (kind === 'listening' || voiceActive) return 'Ouvindo';
  if (kind === 'thinking') return 'Pensando';
  if (kind === 'correcting') return 'Corrigindo';
  if (kind === 'celebrating') return 'Excelente';
  return 'Online';
}

function colorByState(kind: AvatarStateKind | 'idle'): string {
  if (kind === 'speaking') return '#22d3ee';
  if (kind === 'listening') return '#22d3ee';
  if (kind === 'thinking') return '#a78bfa';
  if (kind === 'correcting') return '#fbbf24';
  if (kind === 'celebrating') return '#f0abfc';
  return '#22d3ee';
}
