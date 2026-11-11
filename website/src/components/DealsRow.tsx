"use client";

import { useRef, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "./icons";

/** A titled row of cards that scrolls sideways, with arrow buttons on bigger screens. */
export function DealsRow({
  id,
  title,
  subtitle,
  children,
}: {
  id: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = scroller.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };
  const titleId = `${id}-title`;

  return (
    <section id={id} aria-labelledby={titleId} className="scroll-mt-4">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 id={titleId} className="text-xl font-bold sm:text-2xl">{title}</h2>
          {subtitle && <p className="mt-0.5 text-sm text-ink-muted">{subtitle}</p>}
        </div>
        <div className="hidden gap-2 sm:flex">
          <button type="button" onClick={() => scroll(-1)} aria-label={`Scroll ${title} left`} className="grid size-9 place-items-center rounded-full bg-white shadow-raise hover:bg-surface-muted">
            <ChevronLeft width={18} height={18} />
          </button>
          <button type="button" onClick={() => scroll(1)} aria-label={`Scroll ${title} right`} className="grid size-9 place-items-center rounded-full bg-white shadow-raise hover:bg-surface-muted">
            <ChevronRight width={18} height={18} />
          </button>
        </div>
      </div>
      <div ref={scroller} className="no-scrollbar -mx-4 flex snap-x scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 lg:mx-0 lg:px-0">
        {children}
      </div>
    </section>
  );
}
