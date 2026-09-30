import React from 'react';
import { CarouselCard } from './ProjectCarousel';
import { renderCaption } from '@/lib/caption';

interface ProjectRowProps {
  card: CarouselCard;
}

/**
 * A project on the home page: art on the left, caption on the right.
 *
 * The art is a fixed 124px tall; width follows from its own ratio, and the
 * width/height attributes reserve that width before the image loads so the
 * row does not shift as it arrives.
 */
const ProjectRow = ({ card }: ProjectRowProps) => {
  const content = (
    <div className="flex items-center gap-4">
      <div className="h-[124px] flex-none overflow-hidden rounded-lg">
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
            className="h-full w-auto max-w-none object-cover transition-transform duration-500 ease-out-cubic group-hover:scale-[1.03]"
          />
        )}
      </div>

      <p className="mb-0 flex-1 text-base leading-snug text-muted-foreground">
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
