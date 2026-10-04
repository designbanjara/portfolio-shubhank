import React from 'react';
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
 * Rows stack as a group rather than individually. That falls out of the shared
 * 420px media query in ProjectRow: every row answers the same question the same
 * way, so a group can never show one row side by side between two stacked ones.
 * Spacing switches at the same width, since stacked rows are blocks and need
 * more between them than the tight rhythm a single line of text wants.
 */
const ProjectGroupSection = ({ id, company, description, cards }: ProjectGroupSectionProps) => (
  <section aria-labelledby={`group-${id}`}>
    <h3 id={`group-${id}`} className="text-base font-medium text-foreground">
      {company}
    </h3>
    {description && (
      <p className="mt-2 max-w-[60ch] text-base text-muted-foreground">{description}</p>
    )}

    <div className="mt-6 space-y-2 max-[420px]:space-y-10">
      {cards.map((card, index) => (
        <ProjectRow key={card.id} card={card} index={index} />
      ))}
    </div>
  </section>
);

export default ProjectGroupSection;
