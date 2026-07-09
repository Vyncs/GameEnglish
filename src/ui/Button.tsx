import type { ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * Button — versão "Caderno do aluno"
 *
 * Intent: ação clara, com peso de verbo. Sem glow. Sem gradiente.
 *         Tinta sólida + sombra de papel curta. Hover deixa a tinta
 *         um pouco mais escura — como pressionar a Bic.
 * Palette: bic (primary), correction (danger), chalkboard (success),
 *          manila/graphite (ghost/outline).
 * Depth: sombra baixa de papel; hover lift de 1px; active recua.
 * Radius: 8px — papel não é redondo, mas tem cantos vivos.
 */

type Variant = 'primary' | 'danger' | 'success' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const sizeStyles: Record<Size, { padding: string; fontSize: string; minH: string; gap: string }> = {
  sm: { padding: '6px 12px', fontSize: '0.875rem', minH: '36px', gap: '6px' },
  md: { padding: '10px 18px', fontSize: '1rem', minH: '44px', gap: '8px' },
  lg: { padding: '14px 24px', fontSize: '1.0625rem', minH: '52px', gap: '10px' },
};

const variantStyles: Record<Variant, { bg: string; bgHover: string; bgActive: string; color: string; border?: string }> = {
  primary: {
    bg: 'var(--bic)',
    bgHover: 'var(--bic-dark)',
    bgActive: 'var(--bic-dark)',
    color: '#FFFFFF',
  },
  danger: {
    bg: 'var(--correction)',
    bgHover: 'var(--correction-dark)',
    bgActive: 'var(--correction-dark)',
    color: '#FFFFFF',
  },
  success: {
    bg: 'var(--chalkboard)',
    bgHover: 'var(--chalkboard-dark)',
    bgActive: 'var(--chalkboard-dark)',
    color: '#FFFFFF',
  },
  outline: {
    bg: 'transparent',
    bgHover: 'var(--paper-aged)',
    bgActive: 'var(--paper-aged)',
    color: 'var(--graphite)',
    border: '1px solid var(--manila)',
  },
  ghost: {
    bg: 'transparent',
    bgHover: 'rgba(40,40,38,0.04)',
    bgActive: 'rgba(40,40,38,0.06)',
    color: 'var(--graphite-mid)',
  },
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled,
  style,
  children,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  ...rest
}: ButtonProps) {
  const sz = sizeStyles[size];
  const v = variantStyles[variant];

  return (
    <button
      disabled={disabled || loading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: sz.gap,
        padding: sz.padding,
        minHeight: sz.minH,
        fontFamily: 'var(--font-ui)',
        fontSize: sz.fontSize,
        fontWeight: 600,
        letterSpacing: '-0.005em',
        color: v.color,
        background: v.bg,
        border: v.border ?? '1px solid transparent',
        borderRadius: '8px',
        boxShadow: variant === 'outline' || variant === 'ghost' ? 'none' : 'var(--shadow-paper)',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled || loading ? 0.55 : 1,
        transition: `background var(--motion-fast), box-shadow var(--motion-fast), transform var(--motion-fast)`,
        width: fullWidth ? '100%' : 'auto',
        userSelect: 'none',
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.background = v.bgHover;
          if (variant !== 'outline' && variant !== 'ghost') {
            e.currentTarget.style.boxShadow = 'var(--shadow-lifted)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }
        }
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = v.bg;
        e.currentTarget.style.boxShadow = variant === 'outline' || variant === 'ghost' ? 'none' : 'var(--shadow-paper)';
        e.currentTarget.style.transform = 'translateY(0)';
        onMouseLeave?.(e);
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.background = v.bgActive;
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = variant === 'outline' || variant === 'ghost' ? 'none' : 'var(--shadow-inset)';
        onMouseDown?.(e);
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.background = v.bgHover;
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = variant === 'outline' || variant === 'ghost' ? 'none' : 'var(--shadow-lifted)';
        onMouseUp?.(e);
      }}
      className="focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      {...rest}
    >
      {loading ? (
        <Spinner />
      ) : icon && iconPosition === 'left' ? (
        <span style={{ display: 'inline-flex' }}>{icon}</span>
      ) : null}
      <span>{children}</span>
      {!loading && icon && iconPosition === 'right' ? (
        <span style={{ display: 'inline-flex' }}>{icon}</span>
      ) : null}
    </button>
  );
}

function Spinner() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      style={{ animation: 'spin 700ms linear infinite' }}
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </svg>
  );
}
