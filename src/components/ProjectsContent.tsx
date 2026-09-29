import React, { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { projectGroups, Highlights } from '@/config/projectGroups';
import { CarouselCard } from './ProjectCarousel';
import ProjectGroupSection from './ProjectGroupSection';
import ProjectHighlightsModal from './ProjectHighlightsModal';
import { EASE, DURATION, STAGGER } from '@/lib/motion';

const groupVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER, delayChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE.outCubic } },
};

/**
 * The Work section.
 *
 * Entirely config-driven: the groups, their cards, the copy and the art all
 * come from projectGroups.ts, and a card opens its highlights in a modal
 * rather than navigating to a Craft page. Nothing here waits on a fetch, so
 * there is no loading or error state to show.
 */
const ProjectsContent = () => {
  const shouldReduceMotion = useReducedMotion();
  const { theme } = useTheme();
  const [openIds, setOpenIds] = useState<string[] | null>(null);
  // The project whose highlights are showing, if any.
  const [highlights, setHighlights] = useState<Highlights | null>(null);

  const groups = useMemo(
    () =>
      projectGroups.map((group) => ({
        id: group.id,
        company: group.company,
        description: group.description,
        cards: group.cards.map<CarouselCard>((card) => ({
          id: card.id,
          caption: card.caption,
          size: card.size,
          imageUrl: theme === 'light' ? card.image.light : card.image.dark,
          // Only a card with highlights is interactive.
          onSelect: card.highlights ? () => setHighlights(card.highlights ?? null) : undefined,
        })),
      })),
    [theme]
  );

  // Every group starts collapsed; openIds stays null until the first click.
  const openGroupIds = openIds ?? [];

  // Exclusive: opening a group closes any other. Clicking the open one closes
  // it, so all-collapsed is still reachable.
  const toggleGroup = (id: string) => {
    setOpenIds(openGroupIds.includes(id) ? [] : [id]);
  };

  return (
    <div>
      <h2
        id="projects-heading"
        className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-3"
      >
        Work
      </h2>

      <motion.div
        variants={shouldReduceMotion ? undefined : groupVariants}
        initial={shouldReduceMotion ? false : 'hidden'}
        animate="visible"
      >
        {groups.map((group) => (
          <motion.div
            key={group.id}
            variants={shouldReduceMotion ? undefined : itemVariants}
            className="py-1 first:pt-0 last:pb-0"
          >
            <ProjectGroupSection
              id={group.id}
              company={group.company}
              description={group.description}
              cards={group.cards}
              open={openGroupIds.includes(group.id)}
              onToggle={() => toggleGroup(group.id)}
            />
          </motion.div>
        ))}
      </motion.div>

      <ProjectHighlightsModal highlights={highlights} onClose={() => setHighlights(null)} />
    </div>
  );
};

export default ProjectsContent;
