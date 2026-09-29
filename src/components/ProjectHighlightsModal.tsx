import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useTheme } from '@/contexts/ThemeContext';
import { Highlights } from '@/config/projectGroups';
import ProjectCarousel, { CarouselCard } from './ProjectCarousel';

interface ProjectHighlightsModalProps {
  highlights: Highlights | null;
  onClose: () => void;
}

/**
 * Full-screen story behind a project: a title, a paragraph of context, and the
 * same carousel the page uses — native scrolling, snapping and paddles.
 *
 * Radix handles the parts a hand-rolled overlay gets wrong: focus moves into
 * the panel and is trapped there, Escape and the scrim close it, the page
 * behind stops scrolling, and everything else is hidden from screen readers.
 */
const ProjectHighlightsModal = ({ highlights, onClose }: ProjectHighlightsModalProps) => {
  const { theme } = useTheme();

  const cards: CarouselCard[] = (highlights?.cards ?? []).map((card) => ({
    id: card.id,
    caption: card.caption,
    size: card.size,
    imageUrl: theme === 'light' ? card.image.light : card.image.dark,
  }));

  return (
    <DialogPrimitive.Root
      open={Boolean(highlights)}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />

        <DialogPrimitive.Content
          className="
            fixed inset-3 sm:inset-6 z-50 overflow-y-auto overflow-x-hidden
            rounded-2xl bg-background shadow-2xl
            focus:outline-none
            data-[state=open]:animate-in data-[state=closed]:animate-out
            data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0
            data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95
          "
        >
          <DialogPrimitive.Close
            aria-label="Close highlights"
            className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors duration-150 ease-out-quad hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <XMarkIcon className="h-5 w-5" />
          </DialogPrimitive.Close>

          {highlights && (
            /* px sets the inset the carousel aligns to; the row then runs off
               the panel's right edge, as it does on the page. */
            <div className="px-6 py-14 sm:px-10 sm:py-16">
              <DialogPrimitive.Title className="text-2xl font-custom font-bold text-foreground">
                {highlights.title}
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="mt-3 max-w-[80ch] text-base text-muted-foreground">
                {highlights.description}
              </DialogPrimitive.Description>

              {/* Pull the row out to the panel's right edge so cards run off
                  it, as they do on the page. */}
              <div className="mt-10 -mr-6 sm:-mr-10">
                <ProjectCarousel
                  cards={cards}
                  label={`${highlights.title} cards`}
                  bleed={false}
                />
              </div>
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default ProjectHighlightsModal;
