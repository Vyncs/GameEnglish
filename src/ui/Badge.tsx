import type { ReactNode } from 'react';

/**
 * Badge — etiqueta colorida.
 *
 * Intent: marcar status (Assinante, VIP), contadores, role.
 *         Inspiração: as fitinhas de papel pinadas em mural.
 * Tom:    superfícies tingidas (não tinta sólida) — fica leve no
 *         contexto, não compete com CTAs.
 */

type Tone = 'neutral' | 'bic' | 'correction' | 'highlighter' | 'chalkboard' | 'premium';
type Variant = 'soft' | 'solid' | 'outline';

interface BadgeProps {
  children: ReactNode;
  tone?: Tone;
  variant?: Variant;
  size?: 'sm' | 'md';
}

const toneStyles: Record<
  Tone,
  { soft: { bg: string; color: string }; solid: { bg: string; color: string } }
> = {
  neutral: {
    soft: { bg: 'var(--paper-aged)', color: 'var(--graphite)' },
    solid: { bg: 'var(--graphite)', color: '#FFFFFF' },
  },
  bic: {
    soft: { bg: 'var(--bic-tint)', color: 'var(--bic)' },
    solid: { bg: 'var(--bic)', color: '#FFFFFF' },
  },
  correction: {
    soft: { bg: 'var(--correction-tint)', color: 'var(--correction-dark)' },
    solid: { bg: 'var(--correction)', color: '#FFFFFF' },
  },
  highlighter: {
    soft: { bg: 'var(--highlighter-tint)', color: 'var(--graphite)' },
    solid: { bg: 'var(--highlighter)', color: 'var(--graphite)' },
  },
  chalkboard: {
    soft: { bg: 'var(--chalkboard-tint)', color: 'var(--chalkboard-dark)' },
    solid: { bg: 'var(--chalkboard)', color: '#FFFFFF' },
  },
  premium: {
    soft: { bg: 'var(--highlighter-tint)', color: 'var(--correction-dark)' },
    solid: {
      bg: 'linear-gradient(120deg, var(--bic) 0%, var(--correction) 100%)',
      color: '#FFFFFF',
    },
  },
};

const sizeStyles = {
  sm: { padding: '2px 8px', fontSize: '10.5px' },
  md: { padding: '3px 10px', fontSize: '12px' },
};

export function Badge({ children, tone = 'neutral', variant = 'soft', size = 'md' }: BadgeProps) {
  const sz = sizeStyles[size];
  const isOutline = variant === 'outline';
  const palette = isOutline ? toneStyles[tone].solid : toneStyles[tone][variant];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: sz.padding,
        fontFamily: 'var(--font-ui)',
        fontSize: sz.fontSize,
        fontWeight: 600,
        letterSpacing: '0.02em',
        color: isOutline ? palette.bg : palette.color,
        background: isOutline ? 'transparent' : palette.bg,
        border: isOutline ? `1px solid ${palette.bg}` : '1px solid transparent',
        borderRadius: '999px',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}
