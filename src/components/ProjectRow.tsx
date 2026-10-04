import React, { useMemo } from 'react';
import { CarouselCard } from './ProjectCarousel';
import { renderCaption } from '@/lib/caption';

interface ProjectRowProps {
  card: CarouselCard;
  /** Position in the group; decides which way the art leans. */
  index: number;
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
 * A project on the home page: art beside its caption, stacking to art above
 * caption on narrow screens.
 *
 * The 420px threshold is measured rather than guessed: below roughly 400px the
 * captions wrap past the 88px art height, so they are better off with the full
 * width. 420 leaves a little headroom above that edge.
 *
 * This is deliberately a media query and not a measurement. Measuring the
 * caption and storing the result in state meant the layout fed back into the
 * thing being measured, which could oscillate and did — it blanked the page at
 * ~405px. A media query cannot oscillate, and because every row shares it, rows
 * in a group always agree.
 *
 * The art is 88px tall on phones and 124px from sm up; width follows from its
 * own ratio, and the width/height attributes reserve that width before the
 * image loads so the row does not shift as it arrives.
 */
const ProjectRow = ({ card, index }: ProjectRowProps) => {
  const tilt = useMemo(() => tiltFor(card.id, index), [card.id, index]);

  const content = (
    <div className="flex items-center gap-4 max-[420px]:flex-col max-[420px]:items-start">
      <div
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
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <p className="mb-0 flex-1 text-base leading-snug text-muted-foreground max-[420px]:w-full">
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
