import React, { useId, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import ProjectCarousel, { CarouselCard } from './ProjectCarousel';

interface ProjectGroupSectionProps {
  id: string;
  company: string;
  description?: string;
  cards: CarouselCard[];
  defaultOpen?: boolean;
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
  defaultOpen = false,
}: ProjectGroupSectionProps) => {
  const [open, setOpen] = useState(defaultOpen);
  const [overflow, setOverflow] = useState<'hidden' | 'visible'>(
    defaultOpen ? 'visible' : 'hidden'
  );
  const shouldReduceMotion = useReducedMotion();
  const panelId = `${useId()}-panel`;

  const toggle = () => {
    // Clip during the transition so the carousel cannot spill out of a
    // half-open panel; onAnimationComplete releases it again.
    setOverflow('hidden');
    setOpen((value) => !value);
  };

  return (
    <section aria-labelledby={`group-${id}`}>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="group flex w-full items-start gap-4 text-left rounded-lg -mx-3 px-3 py-2 transition-colors duration-150 hover:bg-black/[0.03] dark:hover:bg-white/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        style={{ transitionTimingFunction: 'cubic-bezier(0.44, 0, 0.56, 1)' }}
      >
        <span className="min-w-0 flex-1">
          <span
            id={`group-${id}`}
            className="block text-xl font-custom font-bold text-foreground"
          >
            {company}
          </span>
          {description && (
            <span className="mt-2 block max-w-[60ch] text-base text-muted-foreground">
              {description}
            </span>
          )}
        </span>

        <motion.span
          aria-hidden="true"
          className="mt-1 flex h-7 w-7 flex-none items-center justify-center rounded-full border border-border text-muted-foreground group-hover:text-foreground"
          initial={false}
          animate={{ rotate: open ? 180 : 0 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 0.3, ease: [0.44, 0, 0.56, 1] }
          }
        >
          <ChevronDownIcon className="h-4 w-4" />
        </motion.span>
      </button>

      <motion.div
        id={panelId}
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { duration: 0.4, ease: [0.44, 0, 0.56, 1] }
        }
        onAnimationComplete={() => {
          if (open) setOverflow('visible');
        }}
        style={{ overflow }}
      >
        <div className="pt-6">
          <ProjectCarousel cards={cards} label={`${company} projects`} />
        </div>
      </motion.div>
    </section>
  );
};

export default ProjectGroupSection;
