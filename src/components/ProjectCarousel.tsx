import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import MaterialIcon from './MaterialIcon';
import { EASE, DURATION, STAGGER } from '@/lib/motion';
import { renderCaption } from '@/lib/caption';

export interface CarouselCard {
  id: string;
  /** Caption, with *bold* runs marked. */
  caption: string;
  imageUrl?: string | null;
  /** Intrinsic art size — the card takes its width from this ratio. */
  size: { width: number; height: number };
  /** Omitted when the card has nothing to open; it then renders inert. */
  onSelect?: () => void;
}

interface ProjectCarouselProps {
  cards: CarouselCard[];
  /** Announced to screen readers, e.g. "PhonePe Invest projects". */
  label: string;
  /** False while the group is collapsed; flipping it true deals the cards in. */
  active?: boolean;
  /**
   * Page carousels break out to the full viewport width; one inside a modal
   * stays within its container and takes the gutter from it.
   */
  bleed?: boolean;
}

// Cards rise into place in reading order. The movement is vertical on purpose:
// the li is the scroll-snap target, so translating it horizontally moves its
// snap position and leaves the row resting that many pixels scrolled in.
// delayChildren lets the panel start opening first, so the cards land into a
// space that already exists rather than racing it.
const rowVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER, delayChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      // The rise settles quickly; the fade is what makes the card feel like
      // it arrives rather than blinks on, so it runs longer and more evenly.
      y: { duration: DURATION.base, ease: EASE.outCubic },
      opacity: { duration: DURATION.slow, ease: EASE.inOutQuad },
    },
  },
};

/**
 * Horizontal project carousel.
 *
 * Deliberately built on native overflow scrolling plus CSS scroll snapping
 * rather than a JS transform track — the same approach Apple uses on their
 * product pages. Native scrolling is what gives real trackpad and touch
 * momentum; a JS track can only ever approximate it. The paddles drive the
 * same scroller with scrollTo({ behavior: 'smooth' }).
 *
 * The paddle scroll is deliberately NOT tweened by Framer. Writing scrollLeft
 * frame by frame makes mandatory snapping re-snap on every write, so the tween
 * only works if snapping is switched off for its duration and restored after —
 * a hack that trades a reliable, snap-aware scroll for a custom easing curve.
 * The browser's own smooth scroll coordinates with snapping for free.
 */
const ProjectCarousel = ({
  cards,
  label,
  active = true,
  bleed = true,
}: ProjectCarouselProps) => {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Drag to scroll. Pointer events cover mouse, pen and touch, but touch
  // already has native panning, so this only takes over for a mouse. Snapping
  // is suspended for the duration, otherwise the browser fights every frame by
  // pulling scrollLeft back to the nearest snap point.
  const drag = useRef<{ startX: number; startScroll: number } | null>(null);

  const onPointerDown = (event: React.PointerEvent<HTMLUListElement>) => {
    if (event.pointerType === 'touch' || event.button !== 0) return;
    const el = scrollerRef.current;
    if (!el || el.scrollWidth <= el.clientWidth) return;
    drag.current = { startX: event.clientX, startScroll: el.scrollLeft };
    el.style.scrollSnapType = 'none';
    el.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLUListElement>) => {
    const el = scrollerRef.current;
    if (!drag.current || !el) return;
    el.scrollLeft = drag.current.startScroll - (event.clientX - drag.current.startX);
  };

  const endDrag = (event: React.PointerEvent<HTMLUListElement>) => {
    const el = scrollerRef.current;
    if (!drag.current || !el) return;
    drag.current = null;
    el.style.scrollSnapType = '';
    if (el.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId);
  };

  const syncPaddles = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanScrollPrev(el.scrollLeft > 1);
    setCanScrollNext(el.scrollLeft < max - 1);
  }, []);

  // Opening a group should always present its first card, whatever the row was
  // left scrolled to last time.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || !active) return;
    el.scrollLeft = 0;
    syncPaddles();
  }, [active, syncPaddles]);

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
    <div className={`relative ${bleed ? 'carousel-gutter' : 'carousel-gutter-contained'}`}>
      {/* On the page, cards stay aligned to the text column but run off the
          right edge. Inside a modal the container already provides that
          alignment, so the row simply fills it. */}
      <div className={bleed ? 'ml-[calc(50%-50vw)] mr-[calc(50%-50vw)]' : undefined}>
        <motion.ul
          ref={scrollerRef}
          aria-label={label}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          variants={shouldReduceMotion ? undefined : rowVariants}
          initial={shouldReduceMotion ? false : 'hidden'}
          animate={shouldReduceMotion ? undefined : active ? 'visible' : 'hidden'}
          className="
            no-scrollbar m-0 list-none gap-6
            flex flex-col
            sm:flex-row sm:overflow-x-auto sm:overscroll-x-contain
            sm:snap-x sm:snap-mandatory sm:cursor-grab sm:active:cursor-grabbing
            pl-[var(--carousel-gutter)] pr-[var(--carousel-gutter)]
            sm:pr-[calc(var(--carousel-gutter)+4rem)]
            scroll-px-[var(--carousel-gutter)]
          "
        >
          {cards.map((card) => {
            // The card is sized by width, not height, so a narrow viewport can
            // never produce a card wider than the screen. Height comes from the
            // aspect ratio. --carousel-card-h is the height ceiling, converted
            // to a width here; --carousel-card-max-w is what the viewport can
            // actually show while still leaving the next card peeking.
            const ratio = card.size.width / card.size.height;
            const art = (
              <div
                className="carousel-card-art overflow-hidden rounded-2xl"
                style={{
                  '--card-w': `min(calc(var(--carousel-card-h) * ${ratio}), var(--carousel-card-max-w))`,
                  aspectRatio: `${card.size.width} / ${card.size.height}`,
                } as React.CSSProperties}
              >
                {card.imageUrl ? (
                  <img
                    src={card.imageUrl}
                    alt=""
                    width={card.size.width}
                    height={card.size.height}
                    loading="lazy"
                    draggable={false}
                    // Art that has not been exported yet leaves the empty
                    // panel behind rather than a broken-image icon.
                    onError={(event) => {
                      event.currentTarget.style.visibility = 'hidden';
                    }}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full" />
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
              <motion.li
                key={card.id}
                data-carousel-item
                className="carousel-card sm:snap-start sm:shrink-0 list-none"
                variants={shouldReduceMotion ? undefined : cardVariants}
              >
                {card.onSelect ? (
                  <button
                    type="button"
                    onClick={card.onSelect}
                    data-no-press-scale
                    className="group block w-full text-left rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                  >
                    {art}
                    {caption}
                  </button>
                ) : (
                  <div className="group block">
                    {art}
                    {caption}
                  </div>
                )}
              </motion.li>
            );
          })}
        </motion.ul>
      </div>

      {/* Paddles: pointer affordance only. Keyboard users tab through the
          cards themselves, which scrolls the list natively. */}
      <div className="my-6 hidden justify-end gap-2 pr-[var(--carousel-edge,0px)] sm:flex">
        <button
          type="button"
          onClick={() => page(-1)}
          disabled={!canScrollPrev}
          aria-label={`Previous ${label}`}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors duration-150 ease-out-quad hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-30"
        >
          <MaterialIcon name="chevron_left" className="text-[24px]" />
        </button>
        <button
          type="button"
          onClick={() => page(1)}
          disabled={!canScrollNext}
          aria-label={`Next ${label}`}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors duration-150 ease-out-quad hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-30"
        >
          <MaterialIcon name="chevron_right" className="text-[24px]" />
        </button>
      </div>
    </div>
  );
};

export default ProjectCarousel;
