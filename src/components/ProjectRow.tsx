import React from 'react';
import { CarouselCard } from './ProjectCarousel';
import { renderCaption } from '@/lib/caption';

interface ProjectRowProps {
  card: CarouselCard;
}

/**
 * A project on the home page: art on the left, caption on the right.
 *
 * The art keeps its own ratio from the intrinsic size, and the width and
 * height attributes reserve the space so the column does not reflow as images
 * load. Stacks on narrow screens, where a 240px image beside text would leave
 * neither enough room.
 */
const ProjectRow = ({ card }: ProjectRowProps) => {
  const content = (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
      <div className="w-full overflow-hidden rounded-xl bg-muted sm:w-[240px] sm:flex-none">
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
            className="h-auto w-full object-cover transition-transform duration-500 ease-out-cubic group-hover:scale-[1.03]"
          />
        )}
      </div>

      <p className="flex-1 text-base leading-snug text-muted-foreground">
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
      className="group block w-full rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
    >
      {content}
    </button>
  );
};

export default ProjectRow;
