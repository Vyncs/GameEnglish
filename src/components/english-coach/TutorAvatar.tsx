import { useCallback, useState } from 'react';
import { Ear, Brain, Volume2, AlertCircle, Sparkles } from 'lucide-react';
import { useAvatarStateOptional } from './avatar/AvatarStateProvider';
import { RiveTutor } from './avatar/RiveTutor';
import type { AvatarStateKind } from '../../types/englishCoach';

interface TutorAvatarProps {
  /** Tamanho em px. Default 96. */
  size?: number;
  /**
   * @deprecated Use o AvatarStateProvider. Mantido para retrocompatibilidade
   * de chamadas antigas (MessageBubble passando explicitamente).
   */
  isThinking?: boolean;
  /** URL de imagem opcional — futuro Ready Player Me / Lottie / Rive. */
  imageUrl?: string;
  /** Nome para fallback (iniciais). */
  name?: string;
  /**
   * Quando true (default), o avatar lê o estado do AvatarStateProvider
   * automaticamente. Passe false em casos como bolhas de chat onde queremos
   * apenas o ícone do tutor sem reagir a estado global.
   */
  reactive?: boolean;
}

/**
 * TutorAvatar — Orb premium com presença real.
 *
 * Estados visuais (gerenciados pelo AvatarStateProvider):
 *
 *   idle         → breathing 4s, halo rotacionando 18s, sheen interno
 *   listening    → 3 ondas sonar expandindo (sequência), cyan
 *   thinking     → 3 dots pulsando em sequência, amber, halo acelerado
 *   speaking     → equalizer de 3 barras (audio waveform), emerald saturado
 *   correcting   → ícone AlertCircle, ring amber sólido
 *   celebrating  → sparkles, gradient fuchsia/violet, scale lift
 *
 * Estrutura preparada pra futuro receber Lottie/Rive/RPM sem refator: troque
 * o conteúdo do <div className="tutor-face">.
 *
 * Mantém API pública: size, isThinking (deprecated), imageUrl, name, reactive.
 */
export function TutorAvatar({
  size = 96,
  isThinking,
  imageUrl,
  name = 'Coach',
  reactive = true,
}: TutorAvatarProps) {
  const ctx = useAvatarStateOptional();
  const stateKind: AvatarStateKind | 'idle' =
    reactive && ctx
      ? ctx.state.kind
      : isThinking
        ? 'thinking'
        : 'idle';

  // Tenta Rive apenas em montagens "grandes" e reativas (avatar principal).
  // Bolhas de chat e ícones pequenos continuam usando só o orb.
  // `riveFallback=true` significa: o Rive falhou (asset 404 / load error) →
  // permanente nesta sessão, mostra orb.
  const tryRive = reactive && size >= 80 && !imageUrl;
  const [riveFallback, setRiveFallback] = useState(false);
  const handleRiveFallback = useCallback(() => setRiveFallback(true), []);

  const initials = name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const visual = visualByState(stateKind);
  const isLarge = size >= 80;

  // Estratégia: orb SEMPRE renderiza como base. Quando o asset Rive existe e
  // o bundle carrega, RiveTutor é posicionado absolutamente por cima (cobre o
  // orb). Se o asset falhar (404 / load error), riveFallback=true e ficamos só
  // com o orb daqui pra frente — sem layout shift, sem flash.
  return (
    <div
      className="relative shrink-0"
      style={{
        width: size,
        height: size,
        transform: stateKind === 'celebrating' ? 'scale(1.05)' : 'scale(1)',
        transition: 'transform 280ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      aria-label={`Avatar do ${name} — ${stateKind}`}
      data-avatar-state={stateKind}
    >
      {/* Rive overlay — cobre o orb quando carrega; null quando ausente. */}
      {tryRive && !riveFallback && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          <RiveTutor size={size} onFallback={handleRiveFallback} />
        </div>
      )}
      {/* Halo externo rotacionando — gradient conic, fica visível só em sizes grandes */}
      {isLarge && (
        <div
          className="orb-halo-spin pointer-events-none absolute -inset-2 rounded-full opacity-60"
          style={{
            background: visual.haloGradient,
            filter: 'blur(8px)',
          }}
          aria-hidden
        />
      )}

      {/* Sonar (listening) — 3 ondas em cascata */}
      {stateKind === 'listening' && (
        <>
          <div
            className="orb-sonar-1 pointer-events-none absolute inset-0 rounded-full ring-2"
            style={{ borderColor: visual.sonarColor, color: visual.sonarColor, boxShadow: `0 0 0 2px ${visual.sonarColor}` }}
            aria-hidden
          />
          <div
            className="orb-sonar-2 pointer-events-none absolute inset-0 rounded-full"
            style={{ boxShadow: `0 0 0 2px ${visual.sonarColor}` }}
            aria-hidden
          />
          <div
            className="orb-sonar-3 pointer-events-none absolute inset-0 rounded-full"
            style={{ boxShadow: `0 0 0 2px ${visual.sonarColor}` }}
            aria-hidden
          />
        </>
      )}

      {/* Glow externo (sempre presente, intensidade varia por state) */}
      <div
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background: visual.glowGradient,
          filter: 'blur(20px)',
          opacity: visual.glowOpacity,
          transform: 'scale(1.15)',
          transition: 'opacity 320ms ease-out',
        }}
        aria-hidden
      />

      {/* Anel de borda fino */}
      <div
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          boxShadow: `0 0 0 1.5px ${visual.ringColor}`,
          transition: 'box-shadow 320ms ease-out',
        }}
        aria-hidden
      />

      {/* Face do orb (gradient principal + sheen interno) */}
      <div
        className={`tutor-face relative h-full w-full rounded-full overflow-hidden flex items-center justify-center text-white ${
          stateKind === 'idle' && isLarge ? 'orb-breathe' : ''
        }`}
        style={{
          background: visual.faceGradient,
          boxShadow: visual.shadow,
          transition: 'background 360ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 360ms ease-out',
        }}
      >
        {/* Sheen interno (highlight de luz na superfície superior do orb) */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 40% at 30% 22%, rgba(255,255,255,0.32) 0%, transparent 60%)',
          }}
          aria-hidden
        />

        {/* Sheen rotativo lento (idle) — adiciona vida sem chamar atenção */}
        {stateKind === 'idle' && isLarge && (
          <div
            className="orb-sheen pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(110deg, transparent 35%, rgba(255,255,255,0.18) 50%, transparent 65%)',
            }}
            aria-hidden
          />
        )}

        {/* Conteúdo central — varia por estado */}
        <div className="relative z-10 flex items-center justify-center w-full h-full">
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="h-full w-full object-cover" draggable={false} />
          ) : stateKind === 'speaking' ? (
            // Equalizer 3 barras — feel de audio waveform
            <div
              className="flex items-end justify-center gap-[14%]"
              style={{ width: '38%', height: '52%' }}
            >
              <div className="orb-bar-1 w-[26%] rounded-full bg-white/90" />
              <div className="orb-bar-2 w-[26%] rounded-full bg-white" />
              <div className="orb-bar-3 w-[26%] rounded-full bg-white/90" />
            </div>
          ) : stateKind === 'thinking' ? (
            // 3 dots em sequência
            <div className="flex items-center gap-[10%]" style={{ width: '46%' }}>
              <span className="thinking-dot-1 block rounded-full bg-white" style={{ width: '22%', aspectRatio: '1' }} />
              <span className="thinking-dot-2 block rounded-full bg-white" style={{ width: '22%', aspectRatio: '1' }} />
              <span className="thinking-dot-3 block rounded-full bg-white" style={{ width: '22%', aspectRatio: '1' }} />
            </div>
          ) : stateKind === 'correcting' ? (
            <AlertCircle
              style={{ width: size * 0.42, height: size * 0.42 }}
              strokeWidth={2.2}
              className="opacity-95"
            />
          ) : stateKind === 'celebrating' ? (
            <Sparkles
              style={{ width: size * 0.46, height: size * 0.46 }}
              strokeWidth={1.9}
              className="opacity-95"
            />
          ) : stateKind === 'listening' ? (
            <Ear
              style={{ width: size * 0.42, height: size * 0.42 }}
              strokeWidth={2.0}
              className="opacity-95"
            />
          ) : (
            // idle — initials sutis (centradas) + ponto luminoso
            <div className="flex flex-col items-center justify-center">
              {isLarge ? (
                <span
                  className="font-bold tracking-[0.18em] opacity-95"
                  style={{
                    fontSize: size * 0.18,
                    textShadow: '0 1px 2px rgba(0,0,0,0.18)',
                  }}
                >
                  {initials}
                </span>
              ) : (
                <span
                  className="font-bold tracking-[0.14em] opacity-90"
                  style={{ fontSize: size * 0.32 }}
                >
                  {initials.charAt(0)}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Status badge no canto (overlay) — só pra estados ativos e sizes grandes */}
      {size >= 56 && stateKind !== 'idle' && stateKind !== 'thinking' && stateKind !== 'speaking' && (
        <span
          className="absolute -bottom-0.5 -right-0.5 inline-flex items-center justify-center rounded-full ring-2 ring-white shadow-md"
          style={{
            width: Math.max(20, size * 0.22),
            height: Math.max(20, size * 0.22),
            background: visual.badgeBg,
          }}
          aria-hidden
        >
          {visual.badgeIcon(Math.max(11, size * 0.13))}
        </span>
      )}

      {/* Status dot pequeno (sizes pequenos onde overlay não cabe) */}
      {size < 56 && (
        <span
          className="absolute bottom-0.5 right-0.5 block h-2.5 w-2.5 rounded-full ring-2 ring-white"
          style={{
            background: visual.dotColor,
            animation: stateKind === 'idle' ? undefined : 'orb-breathe 1.4s ease-in-out infinite',
          }}
          aria-hidden
        />
      )}
    </div>
  );
}

interface AvatarVisual {
  glowGradient: string;
  glowOpacity: number;
  haloGradient: string;
  ringColor: string;
  faceGradient: string;
  shadow: string;
  sonarColor: string;
  badgeBg: string;
  dotColor: string;
  badgeIcon: (size: number) => React.ReactNode;
}

function visualByState(kind: AvatarStateKind | 'idle'): AvatarVisual {
  switch (kind) {
    case 'listening':
      return {
        glowGradient:
          'radial-gradient(circle, rgba(56, 189, 248, 0.55) 0%, rgba(56, 189, 248, 0) 70%)',
        glowOpacity: 0.85,
        haloGradient:
          'conic-gradient(from 0deg, rgba(56,189,248,0.0), rgba(56,189,248,0.55), rgba(99,102,241,0.45), rgba(56,189,248,0.0))',
        ringColor: 'rgba(14, 165, 233, 0.55)',
        faceGradient:
          'radial-gradient(circle at 32% 28%, #38bdf8 0%, #0ea5e9 45%, #0369a1 100%)',
        shadow: '0 12px 36px -8px rgba(14, 165, 233, 0.45), inset 0 1px 0 rgba(255,255,255,0.25)',
        sonarColor: 'rgba(56, 189, 248, 0.7)',
        badgeBg: '#0ea5e9',
        dotColor: '#0ea5e9',
        badgeIcon: (s) => <Ear style={{ width: s, height: s, color: '#fff' }} strokeWidth={2.4} />,
      };
    case 'thinking':
      return {
        glowGradient:
          'radial-gradient(circle, rgba(245, 158, 11, 0.50) 0%, rgba(245, 158, 11, 0) 70%)',
        glowOpacity: 0.85,
        haloGradient:
          'conic-gradient(from 0deg, rgba(245,158,11,0.0), rgba(245,158,11,0.55), rgba(217,119,6,0.45), rgba(245,158,11,0.0))',
        ringColor: 'rgba(217, 119, 6, 0.55)',
        faceGradient:
          'radial-gradient(circle at 32% 28%, #fbbf24 0%, #f59e0b 45%, #b45309 100%)',
        shadow: '0 12px 36px -8px rgba(245, 158, 11, 0.40), inset 0 1px 0 rgba(255,255,255,0.25)',
        sonarColor: 'rgba(245, 158, 11, 0.7)',
        badgeBg: '#f59e0b',
        dotColor: '#f59e0b',
        badgeIcon: (s) => <Brain style={{ width: s, height: s, color: '#fff' }} strokeWidth={2.4} />,
      };
    case 'speaking':
      return {
        glowGradient:
          'radial-gradient(circle, rgba(16, 185, 129, 0.65) 0%, rgba(16, 185, 129, 0) 70%)',
        glowOpacity: 1,
        haloGradient:
          'conic-gradient(from 0deg, rgba(16,185,129,0.0), rgba(16,185,129,0.6), rgba(20,184,166,0.5), rgba(16,185,129,0.0))',
        ringColor: 'rgba(16, 185, 129, 0.65)',
        faceGradient:
          'radial-gradient(circle at 32% 28%, #34d399 0%, #10b981 40%, #047857 100%)',
        shadow: '0 14px 40px -10px rgba(16, 185, 129, 0.55), inset 0 1px 0 rgba(255,255,255,0.30)',
        sonarColor: 'rgba(16, 185, 129, 0.7)',
        badgeBg: '#10b981',
        dotColor: '#10b981',
        badgeIcon: (s) => <Volume2 style={{ width: s, height: s, color: '#fff' }} strokeWidth={2.4} />,
      };
    case 'correcting':
      return {
        glowGradient:
          'radial-gradient(circle, rgba(217, 119, 6, 0.50) 0%, rgba(217, 119, 6, 0) 70%)',
        glowOpacity: 0.85,
        haloGradient:
          'conic-gradient(from 0deg, rgba(245,158,11,0.0), rgba(245,158,11,0.5), rgba(202,138,4,0.4), rgba(245,158,11,0.0))',
        ringColor: 'rgba(217, 119, 6, 0.65)',
        faceGradient:
          'radial-gradient(circle at 32% 28%, #fde68a 0%, #f59e0b 35%, #c2410c 100%)',
        shadow: '0 12px 36px -8px rgba(217, 119, 6, 0.45), inset 0 1px 0 rgba(255,255,255,0.25)',
        sonarColor: 'rgba(245, 158, 11, 0.7)',
        badgeBg: '#d97706',
        dotColor: '#d97706',
        badgeIcon: (s) => <AlertCircle style={{ width: s, height: s, color: '#fff' }} strokeWidth={2.4} />,
      };
    case 'celebrating':
      return {
        glowGradient:
          'radial-gradient(circle, rgba(217, 70, 239, 0.55) 0%, rgba(217, 70, 239, 0) 70%)',
        glowOpacity: 1,
        haloGradient:
          'conic-gradient(from 0deg, rgba(217,70,239,0.0), rgba(217,70,239,0.6), rgba(139,92,246,0.5), rgba(236,72,153,0.5), rgba(217,70,239,0.0))',
        ringColor: 'rgba(217, 70, 239, 0.65)',
        faceGradient:
          'radial-gradient(circle at 30% 28%, #f0abfc 0%, #d946ef 40%, #7c3aed 100%)',
        shadow: '0 14px 44px -10px rgba(217, 70, 239, 0.55), inset 0 1px 0 rgba(255,255,255,0.30)',
        sonarColor: 'rgba(217, 70, 239, 0.7)',
        badgeBg: '#d946ef',
        dotColor: '#d946ef',
        badgeIcon: (s) => <Sparkles style={{ width: s, height: s, color: '#fff' }} strokeWidth={2.4} />,
      };
    case 'idle':
    default:
      return {
        glowGradient:
          'radial-gradient(circle, rgba(16, 185, 129, 0.40) 0%, rgba(16, 185, 129, 0) 70%)',
        glowOpacity: 0.7,
        haloGradient:
          'conic-gradient(from 0deg, rgba(16,185,129,0.0), rgba(16,185,129,0.45), rgba(20,184,166,0.40), rgba(56,189,248,0.30), rgba(16,185,129,0.0))',
        ringColor: 'rgba(16, 185, 129, 0.40)',
        faceGradient:
          'radial-gradient(circle at 32% 28%, #5eead4 0%, #14b8a6 38%, #0f766e 100%)',
        shadow: '0 12px 36px -8px rgba(16, 185, 129, 0.32), inset 0 1px 0 rgba(255,255,255,0.28)',
        sonarColor: 'rgba(16, 185, 129, 0.45)',
        badgeBg: '#10b981',
        dotColor: '#10b981',
        badgeIcon: () => null,
      };
  }
}
