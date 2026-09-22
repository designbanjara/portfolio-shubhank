import React, { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { craftApi } from '../services/craftApi';
import { EASE, DURATION, STAGGER } from '@/lib/motion';
import { getPostSlug } from '../lib/slugify';
import { useProjects } from '../hooks/useCraftApi';
import { useTheme } from '@/contexts/ThemeContext';
import { projectThumbnailOverrides, ThumbnailOverride } from '@/config/projectThumbnails';
import { projectGroups, fallbackGroup } from '@/config/projectGroups';
import { CarouselCard } from './ProjectCarousel';
import ProjectGroupSection from './ProjectGroupSection';

const groupVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER, delayChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE.outCubic } },
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
  // null until the visitor touches a group: groups arrive asynchronously, so
  // "first one open" is resolved at render rather than in initial state.
  const [openIds, setOpenIds] = useState<string[] | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const { theme } = useTheme();

  // The carousel is config-driven: captions and art come from the design.
  // Craft only decides whether a card's project page exists to link to, and
  // supplies any published project the design does not cover.
  const groups = useMemo(() => {
    const bySlug = new Map<string, (typeof projects)[number]>();
    for (const project of projects) {
      bySlug.set(getPostSlug(project.title), project);
    }

    const claimed = new Set<string>();

    const built = projectGroups.map((group) => ({
      id: group.id,
      company: group.company,
      description: group.description,
      cards: group.cards.map<CarouselCard>((card) => {
        if (card.slug) claimed.add(card.slug);
        return {
          id: card.id,
          caption: card.caption,
          size: card.size,
          imageUrl: theme === 'light' ? card.image.light : card.image.dark,
          // The slug is static config, so a card keeps its link even if the
          // Craft fetch is slow or fails. Cards with no project page simply
          // omit a slug and render unlinked.
          slug: card.slug,
        };
      }),
    }));

    const leftovers = [...bySlug.entries()]
      .filter(([slug]) => !claimed.has(slug))
      .map<CarouselCard>(([slug, project]) => ({
        id: project.id,
        slug,
        caption: `*${project.title}* ${project.properties?.blurb ?? ''}`.trim(),
        size: { width: 1488, height: 1200 },
        imageUrl:
          resolveOverride(projectThumbnailOverrides[slug], theme as 'dark' | 'light')
          ?? craftApi.getPostImage(project),
      }));

    if (leftovers.length) {
      built.push({ ...fallbackGroup, cards: leftovers });
    }

    return built.filter((group) => group.cards.length > 0);
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
                  <div
                    className="aspect-[1820/1200] shrink-0 rounded-2xl bg-muted"
                    style={{ height: 'var(--carousel-card-h)' }}
                  />
                  <div
                    className="aspect-[1820/1200] shrink-0 rounded-2xl bg-muted"
                    style={{ height: 'var(--carousel-card-h)' }}
                  />
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

  // The first group stays open until the visitor decides otherwise.
  const openGroupIds = openIds ?? (groups.length ? [groups[0].id] : []);

  // Exclusive: opening a group closes any other. Clicking the open one closes
  // it, so all-collapsed is still reachable.
  const toggleGroup = (id: string) => {
    setOpenIds(openGroupIds.includes(id) ? [] : [id]);
  };

  return (
    <div>
      <h2 id="projects-heading" className="text-3xl font-custom font-bold mb-6">Work</h2>

      {groups.length === 0 ? (
        <p className="text-muted-foreground py-8">No projects found.</p>
      ) : (
        <motion.div
          className="mt-10"
          variants={shouldReduceMotion ? undefined : groupVariants}
          initial={shouldReduceMotion ? false : 'hidden'}
          animate="visible"
        >
          {groups.map((group, index) => {
            const open = openGroupIds.includes(group.id);
            const isLast = index === groups.length - 1;

            return (
              <motion.div
                key={group.id}
                variants={shouldReduceMotion ? undefined : itemVariants}
                // A collapsed group is only a heading, so it does not need the
                // breathing room an open one does.
                className={isLast ? undefined : open ? 'mb-16' : 'mb-6'}
              >
                <ProjectGroupSection
                  id={group.id}
                  company={group.company}
                  description={group.description}
                  cards={group.cards}
                  open={open}
                  onToggle={() => toggleGroup(group.id)}
                />
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default ProjectsContent;
