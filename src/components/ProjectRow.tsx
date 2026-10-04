import React, { useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import { CarouselCard } from './ProjectCarousel';
import { renderCaption } from '@/lib/caption';

interface ProjectRowProps {
  card: CarouselCard;
  /** Position in the group; decides which way the art leans. */
  index: number;
  /** Decided for the whole group, so rows never disagree with each other. */
  stacked: boolean;
  /** Reports whether this row's caption would outgrow the art beside it. */
  onMeasure: (needsStacking: boolean) => void;
}

/**
 * A per-card tilt that never changes between renders.
 *
 * The angle comes from the card's id rather than Math.random, so a card keeps
 * it across re-renders and theme switches instead of jumping. Magnitude lands
 * in 2..6 degrees: never past the 6 degree limit, and never 0, which would
 * leave a card looking accidentally straight.
 *
 * Direction alternates by position rather than coming out of the hash too.
 * Taking both from the hash let every card in a group lean the same way,
 * which reads as a systematic slant instead of a casual one.
 */
function tiltFor(id: string, index: number): number {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  const magnitude = 2 + (hash % 5);
  return index % 2 === 0 ? magnitude : -magnitude;
}

/**
 * A project on the home page: art on the left, caption on the right.
 *
 * The art is 88px tall on phones and 124px from sm up; width follows from its
 * own ratio, and the
 * width/height attributes reserve that width before the image loads so the
 * row does not shift as it arrives. It sits slightly tilted and straightens
 * when the row is hovered.
 */
/** Matches gap-4 between the art and the caption. */
const ROW_GAP = 16;

const ProjectRow = ({ card, index, stacked, onMeasure }: ProjectRowProps) => {
  const tilt = useMemo(() => tiltFor(card.id, index), [card.id, index]);
  const rowRef = useRef<HTMLDivElement>(null);
  const artRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  // Reports whether the caption would stand taller than the art beside it.
  // The group decides what to do with that; see ProjectGroupSection.
  //
  // The caption is always measured at the width it would have *beside* the
  // art, whatever the current layout. Measuring it where it sits would make
  // this oscillate: stacking widens the caption, which shortens it, which
  // would unstack it, and so on.
  const measure = useCallback(() => {
    const row = rowRef.current;
    const art = artRef.current;
    const text = textRef.current;
    if (!row || !art || !text) return;

    const besideWidth = row.clientWidth - art.offsetWidth - ROW_GAP;
    if (besideWidth <= 0) {
      onMeasure(true);
      return;
    }

    const previous = text.style.width;
    text.style.width = `${besideWidth}px`;
    const heightBeside = text.scrollHeight;
    text.style.width = previous;

    onMeasure(heightBeside > art.offsetHeight);
  }, [onMeasure]);

  useLayoutEffect(() => {
    measure();
    const row = rowRef.current;
    if (!row) return;
    const observer = new ResizeObserver(measure);
    observer.observe(row);
    return () => observer.disconnect();
  }, [measure, card.caption]);

  const content = (
    <div
      ref={rowRef}
      className={`flex gap-4 ${stacked ? 'flex-col items-start' : 'items-center'}`}
    >
      <div
        ref={artRef}
        style={{ '--tilt': `${tilt}deg` } as React.CSSProperties}
        className="
          h-[88px] sm:h-[124px] flex-none overflow-hidden rounded-lg
          rotate-[var(--tilt)] group-hover:rotate-0
          transition-transform duration-500 ease-out-cubic motion-reduce:transition-none
        "
      >
        {card.imageUrl && (
          <img
            src={card.imageUrl}
            alt=""
            width={card.size.width}
            height={card.size.height}
            loading="lazy"
            draggable={false}
            // Art that has not been exported yet leaves the empty panel
            // behind rather than a broken-image icon.
            onError={(event) => {
              event.currentTarget.style.visibility = 'hidden';
            }}
            className="h-full w-auto max-w-none object-cover"
          />
        )}
      </div>

      <p
        ref={textRef}
        className={`mb-0 text-base leading-snug text-muted-foreground ${stacked ? 'w-full' : 'flex-1'}`}
      >
        {renderCaption(card.caption)}
      </p>
    </div>
  );

  if (!card.onSelect) {
    return <div className="group">{content}</div>;
  }

  return (
    <button
      type="button"
      onClick={card.onSelect}
      data-no-press-scale
      className="
        group block w-full rounded-xl p-2 -m-2 text-left
        transition-colors duration-150 ease-out-quad
        hover:bg-black/[0.04] dark:hover:bg-white/[0.04]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
      "
    >
      {content}
    </button>
  );
};

export default ProjectRow;
