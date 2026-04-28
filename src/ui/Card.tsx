import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Card — superfície de papel.
 *
 * Intent: cada card é uma folha avulsa em cima da página. Borda manila
 *         quase invisível, sombra de papel (não glow), padding generoso.
 *         Quando 'tab' está presente, parece um separador de pasta.
 * Surface: paper-bright (1 nível acima do canvas paper).
 * Depth: shadow-paper (default), shadow-lifted (em hover/elevated).
 */

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  /** Etiqueta no topo do card (estilo separador de pasta). */
  tab?: { label: string; color?: 'bic' | 'correction' | 'highlighter' | 'chalkboard' | 'manila' };
  /** Padding interno: tight=12, normal=20 (default), loose=28. */
  padding?: 'tight' | 'normal' | 'loose';
  children: ReactNode;
}

const padMap = { tight: '12px', normal: '20px', loose: '28px' };

const tabBg: Record<NonNullable<CardProps['tab']>['color'] & string, string> = {
  bic: 'var(--bic)',
  correction: 'var(--correction)',
  highlighter: 'var(--highlighter)',
  chalkboard: 'var(--chalkboard)',
  manila: 'var(--manila-deep)',
};

export function Card({
  elevated = false,
  tab,
  padding = 'normal',
  style,
  children,
  ...rest
}: CardProps) {
  return (
    <div
      style={{
        position: 'relative',
        background: 'var(--paper-bright)',
        border: '1px solid rgba(154, 124, 80, 0.18)',
        borderRadius: '12px',
        boxShadow: elevated ? 'var(--shadow-lifted)' : 'var(--shadow-paper)',
        padding: padMap[padding],
        transition: `box-shadow var(--motion-fast), transform var(--motion-fast)`,
        ...style,
      }}
      {...rest}
    >
      {tab && (
        <span
          style={{
            position: 'absolute',
            top: '-9px',
            left: '20px',
            padding: '2px 10px',
            fontFamily: 'var(--font-ui)',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: tab.color === 'highlighter' ? 'var(--graphite)' : '#FFFFFF',
            background: tabBg[tab.color ?? 'bic'],
            borderRadius: '4px',
            boxShadow: '0 1px 2px rgba(40,40,38,0.10)',
          }}
        >
          {tab.label}
        </span>
      )}
      {children}
    </div>
  );
}

/**
 * FlashPaper — card que mostra uma frase em inglês escrita à mão.
 * Usa Caveat (signature). Diferencia visualmente "voz do aluno" de
 * "voz da interface".
 */
interface FlashPaperProps {
  pt: string;
  en: string;
  /** Mostra apenas um lado (estudo). Default mostra os dois. */
  reveal?: 'pt' | 'en' | 'both';
  level?: 1 | 2 | 3 | 4 | 5;
}

export function FlashPaper({ pt, en, reveal = 'both', level }: FlashPaperProps) {
  return (
    <Card padding="loose" elevated style={{ minHeight: '160px' }}>
      {level && (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '14px',
            fontFamily: 'var(--font-ui)',
            fontSize: '11px',
            color: 'var(--graphite-soft)',
            letterSpacing: '0.06em',
          }}
        >
          NÍVEL {level}/5
        </div>
      )}
      {(reveal === 'pt' || reveal === 'both') && (
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--font-ui)',
            fontSize: '0.95rem',
            color: 'var(--graphite-mid)',
            marginBottom: reveal === 'both' ? '12px' : 0,
          }}
        >
          {pt}
        </p>
      )}
      {(reveal === 'en' || reveal === 'both') && (
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--font-hand)',
            fontSize: '2rem',
            fontWeight: 600,
            color: 'var(--bic)',
            lineHeight: 1.2,
          }}
        >
          {en}
        </p>
      )}
    </Card>
  );
}
