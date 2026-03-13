import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { craftApi } from '../services/craftApi';
import { getPostSlug } from '../lib/slugify';
import { useProjects } from '../hooks/useCraftApi';
import { Badge } from './ui/badge';
import { useTheme } from '@/contexts/ThemeContext';
import { projectThumbnailOverrides, ThumbnailOverride } from '@/config/projectThumbnails';

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.44, 0, 0.56, 1] } },
};

function resolveOverride(override: ThumbnailOverride | undefined, theme: 'dark' | 'light'): string | null {
  if (!override) return null;
  if (typeof override === 'string') return override;
  return theme === 'light' ? override.light : override.dark;
}

const ProjectsContent = () => {
  const { data: projects = [], isLoading: loading, isError } = useProjects();
  const shouldReduceMotion = useReducedMotion();
  const { theme } = useTheme();

  const extractDocTags = (markdown: string): string[] | null => {
    const trimmed = markdown.trim();
    if (!trimmed) return null;

    // "Tags: a, b, c"
    const prefixMatch = trimmed.match(/^tags?\s*:\s*(.+)$/i);
    if (prefixMatch) {
      const tags = prefixMatch[1]
        .split(/[,\u00B7]/g)
        .map((t) => t.trim())
        .filter(Boolean);
      return tags.length ? tags : null;
    }

    // "#a #b #c" (only if the whole line is just hashtags)
    if (trimmed.startsWith('#')) {
      const onlyHashtagsResidue = trimmed.replace(/#[\w-]+/g, '').trim();
      if (onlyHashtagsResidue.length === 0) {
        const tags = Array.from(trimmed.matchAll(/#([\w-]+)/g)).map((m) => m[1]);
        return tags.length ? tags : null;
      }
    }

    return null;
  };

  const getTagsForProject = (project: { properties?: { tags?: string[] }; content?: Array<{ type: string; markdown: string; listStyle?: string }> }) => {
    const fromProps = project.properties?.tags ?? [];

    // Scan a few first blocks for a "Tags:" / hashtag line.
    const content = project.content ?? [];
    let fromDoc: string[] = [];
    for (let i = 0; i < Math.min(12, content.length); i++) {
      const b = content[i];
      if (!b || b.type !== 'text') continue;
      if (b.listStyle) continue;
      if (!b.markdown || b.markdown.trim().length === 0) continue;
      const tags = extractDocTags(b.markdown);
      if (tags && tags.length) {
        fromDoc = tags;
        break;
      }
    }

    const merged = [...fromProps, ...fromDoc];
    const seen = new Set<string>();
    const out: string[] = [];
    for (const t of merged) {
      const clean = (t ?? '').trim();
      if (!clean) continue;
      const key = clean.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(clean);
    }
    return out;
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-48 mb-8"></div>
          <div className="space-y-14">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="pb-14 border-b border-border last:border-b-0 last:pb-0">
                <div className="w-full h-56 bg-muted rounded-lg mb-4"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-6">
        <h1 className="text-3xl font-custom font-bold mb-6">Projects</h1>
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
    <div className="max-w-2xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-custom font-bold mb-6">Projects</h1>

      {/* Projects Grid */}
      <motion.div
        className="mt-10 divide-y divide-border"
        variants={shouldReduceMotion ? undefined : listVariants}
        initial={shouldReduceMotion ? false : 'hidden'}
        animate="visible"
      >
        {projects.length === 0 ? (
          <p className="text-muted-foreground text-center py-8 col-span-1">
            No projects found.
          </p>
        ) : (
          projects.map((project, idx) => {
            const imageUrl = craftApi.getPostImage(project);
            const slug = getPostSlug(project.title);
            const tags = getTagsForProject(project);
            const resolvedImageUrl =
              resolveOverride(projectThumbnailOverrides[slug], theme as 'dark' | 'light')
              ?? imageUrl;

            return (
              <motion.div
                key={project.id}
                className={`py-10 ${idx === 0 ? 'pt-0' : ''}`}
                variants={shouldReduceMotion ? undefined : itemVariants}
              >
                <Link
                  to={`/projects/${slug}`}
                  state={{ postId: project.id }}
                  className="block group transition-all duration-200"
                  style={{ transitionTimingFunction: 'cubic-bezier(0.44, 0, 0.56, 1)' }}
                >
                  <div className="flex flex-col">
                    {/* Image */}
                    <div className="w-full rounded-lg bg-muted flex-shrink-0 overflow-hidden mb-4">
                      {resolvedImageUrl ? (
                        <img
                          src={resolvedImageUrl}
                          alt={project.title}
                          className="w-full h-auto transition-transform duration-300 group-hover:scale-[1.02]"
                          style={{ transitionTimingFunction: 'cubic-bezier(0.44, 0, 0.56, 1)' }}
                        />
                      ) : (
                        <div className="w-full h-56 flex items-center justify-center text-muted-foreground">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-8 h-8"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-custom font-bold text-foreground leading-tight flex items-center gap-1.5">
                      <span>{project.title}</span>
                    </h2>

                    {/* Tags (from doc content, plus properties) */}
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="bg-muted text-muted-foreground hover:bg-muted/80"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })
        )}
      </motion.div>
    </div>
  );
};

export default ProjectsContent;

