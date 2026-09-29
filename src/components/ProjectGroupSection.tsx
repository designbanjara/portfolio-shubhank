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
 */
const ProjectGroupSection = ({ id, company, description, cards }: ProjectGroupSectionProps) => (
  <section aria-labelledby={`group-${id}`}>
    <h3 id={`group-${id}`} className="text-base font-medium text-foreground">
      {company}
    </h3>
    {description && (
      <p className="mt-2 max-w-[60ch] text-base text-muted-foreground">{description}</p>
    )}

    <div className="mt-6 space-y-8">
      {cards.map((card) => (
        <ProjectRow key={card.id} card={card} />
      ))}
    </div>
  </section>
);

export default ProjectGroupSection;
