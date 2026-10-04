import React, { useCallback, useState } from 'react';
import { CarouselCard } from './ProjectCarousel';
import ProjectRow from './ProjectRow';

interface ProjectGroupSectionProps {
  id: string;
  company: string;
  description?: string;
  cards: CarouselCard[];
}

/**
 * A company group on the home page: heading, a line of context, then its
 * projects listed out. Everything is visible — there is nothing to expand.
 *
 * Layout is decided for the group rather than per row. Each row reports
 * whether its caption would outgrow the art beside it, and if any one of them
 * would, every row stacks. Letting rows choose individually left one sitting
 * side by side between two stacked ones, which reads as a mistake.
 */
const ProjectGroupSection = ({ id, company, description, cards }: ProjectGroupSectionProps) => {
  const [needsStacking, setNeedsStacking] = useState<boolean[]>(() => cards.map(() => false));
  const stacked = needsStacking.some(Boolean);

  const report = useCallback((index: number, value: boolean) => {
    setNeedsStacking((previous) => {
      if (previous[index] === value) return previous;
      const next = [...previous];
      next[index] = value;
      return next;
    });
  }, []);

  return (
    <section aria-labelledby={`group-${id}`}>
      <h3 id={`group-${id}`} className="text-base font-medium text-foreground">
        {company}
      </h3>
      {description && (
        <p className="mt-2 max-w-[60ch] text-base text-muted-foreground">{description}</p>
      )}

      {/* Stacked rows are taller and read as blocks, so they need more between
          them than the tight rhythm a single line of text wants. */}
      <div className={`mt-6 ${stacked ? 'space-y-10' : 'space-y-2'}`}>
        {cards.map((card, index) => (
          <ProjectRow
            key={card.id}
            card={card}
            index={index}
            stacked={stacked}
            onMeasure={(value) => report(index, value)}
          />
        ))}
      </div>
    </section>
  );
};

export default ProjectGroupSection;
