import { leitnerStages, type LeitnerLevel } from './tokens';

/**
 * LeitnerBox — SIGNATURE COMPONENT
 *
 * Intent: visualizar a caixa Leitner física do aluno. 5 compartimentos
 *         com pilhas de cards. O compartimento ativo (cards devidos hoje)
 *         tem um marcador highlighter. Substitui o "100 cards aguardando
 *         revisão" genérico por uma representação que CONTA a história
 *         do método.
 *
 * Por que isso é signature: nenhum SaaS edutech genérico tem isso porque
 * é específico do método Leitner que esse produto usa. Um competidor
 * só conseguiria copiar imitando — e copiar isso seria copiar o produto.
 *
 * Palette: superfícies tingidas por nível (correction → chalkboard → manila)
 * Depth: pilhas de papel com offset escalonado (cards físicos empilhados)
 * Motion: cards "promovem" para cima (animação leitner-promote)
 */

interface LeitnerBoxProps {
  /** Quantidade de cards em cada compartimento, do nível 1 ao 5. */
  countByLevel: Record<LeitnerLevel, number>;
  /** Compartimento que tem cards prontos pra revisão hoje (highlight). */
  dueLevel?: LeitnerLevel;
  /** Click em um compartimento. */
  onSelectLevel?: (level: LeitnerLevel) => void;
  /** Layout: horizontal (desktop) ou stacked (mobile). */
  orientation?: 'horizontal' | 'vertical';
}

export function LeitnerBox({
  countByLevel,
  dueLevel,
  onSelectLevel,
  orientation = 'horizontal',
}: LeitnerBoxProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: orientation === 'horizontal' ? 'repeat(5, 1fr)' : '1fr',
        gap: '12px',
        padding: '20px',
        background: 'var(--paper-aged)',
        border: '1px solid rgba(154, 124, 80, 0.35)',
        borderRadius: '14px',
        boxShadow: 'var(--shadow-inset)',
        backgroundImage:
          'linear-gradient(135deg, rgba(154,124,80,0.06) 0%, transparent 60%)',
      }}
    >
      {leitnerStages.map((stage) => {
        const count = countByLevel[stage.level] ?? 0;
        const isDue = dueLevel === stage.level && count > 0;
        return (
          <Compartment
            key={stage.level}
            stage={stage}
            count={count}
            isDue={isDue}
            onClick={onSelectLevel ? () => onSelectLevel(stage.level) : undefined}
          />
        );
      })}
    </div>
  );
}

interface CompartmentProps {
  stage: (typeof leitnerStages)[number];
  count: number;
  isDue: boolean;
  onClick?: () => void;
}

function Compartment({ stage, count, isDue, onClick }: CompartmentProps) {
  // Quantidade de "papéis" desenhados na pilha (max 4, mínimo 1 se count > 0)
  const stackSize = count === 0 ? 0 : Math.min(4, Math.ceil(Math.log2(count + 1)));

  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        padding: '16px 10px 14px',
        background: isDue ? '#FFFFFF' : 'var(--paper-bright)',
        border: isDue
          ? `2px solid ${stage.accent}`
          : '1px solid rgba(154, 124, 80, 0.20)',
        borderRadius: '10px',
        boxShadow: isDue ? 'var(--shadow-lifted)' : 'var(--shadow-paper)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'box-shadow var(--motion-fast), transform var(--motion-fast)',
        minHeight: '140px',
        fontFamily: 'var(--font-ui)',
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.boxShadow = 'var(--shadow-lifted)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = isDue
          ? 'var(--shadow-lifted)'
          : 'var(--shadow-paper)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Marcador de nível (canto sup esquerdo) */}
      <span
        style={{
          position: 'absolute',
          top: '-7px',
          left: '12px',
          padding: '1px 8px',
          background: stage.accent,
          color: stage.level === 2 ? 'var(--graphite)' : '#FFFFFF',
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.06em',
          borderRadius: '3px',
        }}
      >
        {stage.level}
      </span>

      {/* Tab highlighter se for o compartimento devido */}
      {isDue && (
        <span
          style={{
            position: 'absolute',
            top: '-12px',
            right: '10px',
            width: '18px',
            height: '20px',
            background: 'var(--highlighter)',
            borderRadius: '2px',
            boxShadow: '0 1px 2px rgba(40,40,38,0.20)',
            transform: 'rotate(-3deg)',
          }}
          aria-label="Cards devidos hoje"
        />
      )}

      {/* Pilha visual de papéis */}
      <div
        style={{
          position: 'relative',
          width: '64px',
          height: '50px',
          marginTop: '6px',
        }}
      >
        {Array.from({ length: stackSize }).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              inset: 0,
              background: stage.tint,
              border: `1px solid ${stage.accent}40`,
              borderRadius: '3px',
              transform: `translate(${i * 1.5}px, ${-i * 1.5}px) rotate(${
                i % 2 === 0 ? -1 : 1
              }deg)`,
              boxShadow: '0 1px 1px rgba(40,40,38,0.06)',
            }}
          />
        ))}
        {stackSize === 0 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              border: '1px dashed rgba(154,124,80,0.4)',
              borderRadius: '3px',
            }}
          />
        )}
      </div>

      {/* Contador */}
      <div
        style={{
          fontSize: '24px',
          fontWeight: 700,
          fontVariantNumeric: 'tabular-nums',
          color: count === 0 ? 'var(--graphite-faint)' : 'var(--graphite)',
          lineHeight: 1,
        }}
      >
        {count}
      </div>

      {/* Label do estágio */}
      <div
        style={{
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.04em',
          color: count === 0 ? 'var(--graphite-faint)' : 'var(--graphite-mid)',
          textTransform: 'uppercase',
          textAlign: 'center',
        }}
      >
        {stage.label}
      </div>
    </button>
  );
}
