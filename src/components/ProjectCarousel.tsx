import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export interface CarouselCard {
  id: string;
  /** Caption, with *bold* runs marked. */
  caption: string;
  imageUrl?: string | null;
  /** Intrinsic art size — the card takes its width from this ratio. */
  size: { width: number; height: number };
  /** Omitted when there is no project page to open. */
  slug?: string;
}

/**
 * Splits a caption on *asterisk* runs. The design bolds a phrase that can sit
 * anywhere in the sentence, not just at the start, so this is a marker rather
 * than a separate lead-in field.
 */
function renderCaption(caption: string) {
  return caption
    .split(/(\*[^*]+\*)/g)
    .filter(Boolean)
    .map((part, i) =>
      part.startsWith('*') && part.endsWith('*') ? (
        <strong key={i} className="font-bold text-foreground">
          {part.slice(1, -1)}
        </strong>
      ) : (
        // A span, not React.Fragment: the lovable-tagger plugin injects a
        // data-lov-id onto every JSX node and Fragment rejects extra props.
        <span key={i}>{part}</span>
      )
    );
}

interface ProjectCarouselProps {
  cards: CarouselCard[];
  /** Announced to screen readers, e.g. "PhonePe Invest projects". */
  label: string;
}

/**
 * Horizontal project carousel.
 *
 * Deliberately built on native overflow scrolling plus CSS scroll snapping
 * rather than a JS transform track — the same approach Apple uses on their
 * product pages. Native scrolling is what gives real trackpad and touch
 * momentum; a JS track can only ever approximate it. The paddle buttons then
 * drive the same scroller with scrollTo({ behavior: 'smooth' }), so mouse
 * users get one-card steps without a second, competing animation model.
 */
const ProjectCarousel = ({ cards, label }: ProjectCarouselProps) => {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const syncPaddles = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanScrollPrev(el.scrollLeft > 1);
    setCanScrollNext(el.scrollLeft < max - 1);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(syncPaddles);
    };

    syncPaddles();
    el.addEventListener('scroll', onScroll, { passive: true });

    // Card widths and the gutter are viewport-dependent, so re-check on resize.
    const observer = new ResizeObserver(syncPaddles);
    observer.observe(el);

    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, [syncPaddles, cards.length]);

  const page = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;

    const items = Array.from(
      el.querySelectorAll<HTMLElement>('[data-carousel-item]')
    );
    if (!items.length) return;

    // Offsets measured against the scroller itself, so they hold regardless of
    // where the offsetParent chain happens to land.
    const base = el.getBoundingClientRect().left;
    const offsets = items.map(
      (item) => item.getBoundingClientRect().left - base + el.scrollLeft
    );

    const gutter = parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0;
    const current = el.scrollLeft + gutter;

    const target =
      direction === 1
        ? offsets.find((offset) => offset > current + 1)
        : [...offsets].reverse().find((offset) => offset < current - 1);

    if (target === undefined) return;

    el.scrollTo({
      left: target - gutter,
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
    });
  };

  if (!cards.length) return null;

  return (
    <div className="relative carousel-gutter">
      {/* Full-bleed: cards stay aligned to the text column but run off the
          right edge, as in the design. */}
      <div className="ml-[calc(50%-50vw)] mr-[calc(50%-50vw)]">
        <ul
          ref={scrollerRef}
          aria-label={label}
          className="
            no-scrollbar m-0 flex list-none gap-6 overflow-x-auto overscroll-x-contain
            snap-x snap-mandatory
            px-[var(--carousel-gutter)] scroll-px-[var(--carousel-gutter)]
          "
        >
          {cards.map((card) => {
            const art = (
              <div className="h-[288px] sm:h-[360px] overflow-hidden rounded-2xl bg-muted">
                {card.imageUrl ? (
                  <img
                    src={card.imageUrl}
                    alt=""
                    width={card.size.width}
                    height={card.size.height}
                    loading="lazy"
                    draggable={false}
                    className="h-full w-auto max-w-none object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    style={{ transitionTimingFunction: 'cubic-bezier(0.44, 0, 0.56, 1)' }}
                  />
                ) : (
                  <div
                    className="h-full"
                    style={{ aspectRatio: `${card.size.width} / ${card.size.height}` }}
                  />
                )}
              </div>
            );

            // w-0 min-w-full keeps the caption from widening the card: the
            // card's width comes from the art, and the text wraps inside it.
            const caption = (
              <p className="mt-4 w-0 min-w-full text-base leading-snug text-muted-foreground">
                {renderCaption(card.caption)}
              </p>
            );

            return (
              <li key={card.id} data-carousel-item className="snap-start shrink-0 list-none">
                {card.slug ? (
                  <Link
                    to={`/projects/${card.slug}`}
                    className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                  >
                    {art}
                    {caption}
                  </Link>
                ) : (
                  <div className="group block">
                    {art}
                    {caption}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Paddles: pointer affordance only. Keyboard users tab through the
          cards themselves, which scrolls the list natively. */}
      <div className="mt-6 hidden gap-2 md:flex">
        <button
          type="button"
          onClick={() => page(-1)}
          disabled={!canScrollPrev}
          aria-label={`Previous ${label}`}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-portfolio-sidebar text-muted-foreground transition-colors duration-150 hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
          style={{ transitionTimingFunction: 'cubic-bezier(0.44, 0, 0.56, 1)' }}
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => page(1)}
          disabled={!canScrollNext}
          aria-label={`Next ${label}`}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-portfolio-sidebar text-muted-foreground transition-colors duration-150 hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
          style={{ transitionTimingFunction: 'cubic-bezier(0.44, 0, 0.56, 1)' }}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default ProjectCarousel;
