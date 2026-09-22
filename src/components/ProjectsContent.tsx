import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { craftApi } from '../services/craftApi';
import { getPostSlug } from '../lib/slugify';
import { useProjects } from '../hooks/useCraftApi';
import { useTheme } from '@/contexts/ThemeContext';
import { projectThumbnailOverrides, ThumbnailOverride } from '@/config/projectThumbnails';
import { projectGroups, fallbackGroup } from '@/config/projectGroups';
import ProjectCarousel, { CarouselCard } from './ProjectCarousel';

const groupVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.44, 0, 0.56, 1] } },
};

function resolveOverride(
  override: ThumbnailOverride | undefined,
  theme: 'dark' | 'light'
): string | null {
  if (!override) return null;
  if (typeof override === 'string') return override;
  return theme === 'light' ? override.light : override.dark;
}

const ProjectsContent = () => {
  const { data: projects = [], isLoading: loading, isError } = useProjects();
  const shouldReduceMotion = useReducedMotion();
  const { theme } = useTheme();

  // Fold the flat Craft project list into the company groups from config.
  // Anything unclaimed falls through to a trailing group rather than vanishing.
  const groups = useMemo(() => {
    const cards = new Map<string, CarouselCard>();

    for (const project of projects) {
      const slug = getPostSlug(project.title);
      cards.set(slug, {
        id: project.id,
        slug,
        title: project.title,
        blurb: project.properties?.blurb,
        imageUrl:
          resolveOverride(projectThumbnailOverrides[slug], theme as 'dark' | 'light')
          ?? craftApi.getPostImage(project),
      });
    }

    const claimed = new Set<string>();
    const built = projectGroups
      .map((group) => {
        const items = group.slugs
          .map((slug) => {
            const card = cards.get(slug);
            if (card) claimed.add(slug);
            return card;
          })
          .filter((card): card is CarouselCard => Boolean(card));
        return { ...group, cards: items };
      })
      .filter((group) => group.cards.length > 0);

    const leftovers = [...cards.entries()]
      .filter(([slug]) => !claimed.has(slug))
      .map(([, card]) => card);

    if (leftovers.length) {
      built.push({ ...fallbackGroup, slugs: [], cards: leftovers });
    }

    return built;
  }, [projects, theme]);

  if (loading) {
    return (
      <div>
        <div className="animate-pulse">
          <div className="h-8 w-48 rounded bg-muted mb-8" />
          <div className="space-y-12">
            {[1, 2].map((i) => (
              <div key={i}>
                <div className="h-5 w-40 rounded bg-muted mb-3" />
                <div className="h-4 w-full rounded bg-muted mb-6" />
                <div className="flex gap-6">
                  <div className="h-[300px] w-[380px] shrink-0 rounded-2xl bg-muted" />
                  <div className="h-[300px] w-[380px] shrink-0 rounded-2xl bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <h2 id="projects-heading" className="text-3xl font-custom font-bold mb-6">Work</h2>
        <div className="py-8 text-center">
          <p className="text-muted-foreground mb-4">Could not load projects. Please check your connection.</p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-primary hover:opacity-80 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 id="projects-heading" className="text-3xl font-custom font-bold mb-6">Work</h2>

      {groups.length === 0 ? (
        <p className="text-muted-foreground py-8">No projects found.</p>
      ) : (
        <motion.div
          className="mt-10 space-y-16"
          variants={shouldReduceMotion ? undefined : groupVariants}
          initial={shouldReduceMotion ? false : 'hidden'}
          animate="visible"
        >
          {groups.map((group) => (
            <motion.section
              key={group.id}
              aria-labelledby={`group-${group.id}`}
              variants={shouldReduceMotion ? undefined : itemVariants}
            >
              <h3
                id={`group-${group.id}`}
                className="text-xl font-custom font-bold text-foreground"
              >
                {group.company}
              </h3>
              {group.description && (
                <p className="mt-2 max-w-[60ch] text-base text-muted-foreground">
                  {group.description}
                </p>
              )}

              <div className="mt-6">
                <ProjectCarousel cards={group.cards} label={`${group.company} projects`} />
              </div>
            </motion.section>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ProjectsContent;
