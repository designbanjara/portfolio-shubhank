import React, { useEffect, useId, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import ProjectCarousel, { CarouselCard } from './ProjectCarousel';
import { EASE, DURATION } from '@/lib/motion';

interface ProjectGroupSectionProps {
  id: string;
  company: string;
  description?: string;
  cards: CarouselCard[];
  open: boolean;
  onToggle: () => void;
}

/**
 * A company group in the Work section, collapsible from its heading.
 *
 * Deliberately not the shadcn/Radix Accordion: that keeps overflow hidden on
 * its content to animate height, which would clip the carousel back to the
 * text column and kill the full-bleed row. Here overflow is hidden only while
 * the height is animating, and released once the panel is open.
 */
const ProjectGroupSection = ({
  id,
  company,
  description,
  cards,
  open,
  onToggle,
}: ProjectGroupSectionProps) => {
  const [overflow, setOverflow] = useState<'hidden' | 'visible'>(
    open ? 'visible' : 'hidden'
  );
  const shouldReduceMotion = useReducedMotion();
  const panelId = `${useId()}-panel`;
  const isFirstRender = useRef(true);

  // Opening decelerates into place over the longer duration; closing is
  // quicker and symmetrical. An exit that takes as long as its entrance reads
  // as sluggish, because nobody is waiting to look at what is leaving.
  const panelTransition = shouldReduceMotion
    ? { duration: 0 }
    : open
      ? { duration: DURATION.slow, ease: EASE.outQuart }
      : { duration: DURATION.base, ease: EASE.inQuad };

  // Clip while the height is animating so the carousel cannot spill out of a
  // half-open panel; onAnimationComplete releases it again. Skipped on mount,
  // where a group that starts open has no animation to wait for.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setOverflow('hidden');
  }, [open]);

  return (
    <section aria-labelledby={`group-${id}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        data-no-press-scale
        className="group block w-full text-left rounded-lg -mx-3 px-3 py-2 transition-colors duration-150 hover:bg-black/[0.03] dark:hover:bg-white/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ease-out-quad"
      >
        <span
          id={`group-${id}`}
          className="flex items-center gap-1 text-xl font-custom font-bold text-foreground"
        >
          {company}
          {/* Same chevron and inline placement as a Writing post title. It
              rotates to a quarter turn when open, so it reads as state rather
              than as a link arrow. */}
          <motion.span
            aria-hidden="true"
            className="flex flex-shrink-0 items-center"
            initial={false}
            animate={{ rotate: open ? 90 : 0 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { duration: DURATION.base, ease: EASE.inOutQuad }
            }
          >
            <ChevronRightIcon className="h-4 w-4" />
          </motion.span>
        </span>
        {description && (
          <span className="mt-2 block max-w-[60ch] text-base text-muted-foreground">
            {description}
          </span>
        )}
      </button>

      <motion.div
        id={panelId}
        initial={false}
        animate={{
          height: open ? 'auto' : 0,
          opacity: open ? 1 : 0,
        }}
        transition={panelTransition}
        onAnimationComplete={() => {
          if (open) setOverflow('visible');
        }}
        style={{ overflow }}
      >
        <div className="pt-6">
          <ProjectCarousel cards={cards} label={`${company} projects`} active={open} />
        </div>
      </motion.div>
    </section>
  );
};

export default ProjectGroupSection;
