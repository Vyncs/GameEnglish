import { useRef, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * "Prateleira" de cards com rolagem horizontal e setas — o padrão de
 * catálogo (tipo Netflix). Os filhos devem ter largura fixa e `shrink-0`.
 */
export function CardRail({
  title,
  desc,
  icon,
  children,
}: {
  title: string;
  desc?: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  const railRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    // Rola ~85% da área visível: sempre sobra um card à vista como âncora.
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' });
  };

  return (
    <section className="mb-8">
      <header className="mb-3 flex items-center gap-2.5">
        {icon && (
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent-soft text-lg ring-1 ring-accent-line">
            {icon}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold tracking-tight text-primary">{title}</h2>
          {desc && <p className="truncate text-xs text-tertiary">{desc}</p>}
        </div>

        {/* Setas — escondidas no toque, onde o gesto de arrastar já resolve */}
        <div className="hidden shrink-0 gap-1 sm:flex">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-surface text-secondary transition-colors hover:bg-surface-2"
            aria-label={`Ver anteriores em ${title}`}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-surface text-secondary transition-colors hover:bg-surface-2"
            aria-label={`Ver mais em ${title}`}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div
        ref={railRef}
        className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-1 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
    </section>
  );
}
