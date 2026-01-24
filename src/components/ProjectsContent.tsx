import React from 'react';
import { Link } from 'react-router-dom';
import { craftApi } from '../services/craftApi';
import { getPostSlug } from '../lib/slugify';
import { useProjects } from '../hooks/useCraftApi';
import { Badge } from './ui/badge';

const PROJECT_THUMBNAIL_OVERRIDE_PREFIXES: Record<string, string> = {
  // Uses prefix matching so minor title changes won't break thumbnails.
  // Place images in `public/projects/` and reference via `/projects/<file>`.
  'simple-and-faster-way-to-place-orders-to-exchange': '/projects/tata-motors-order.png',
  'automating-investments-through-sips': '/projects/Stock-sip.png',
  'revamping-the-ticket-creation-experience': '/projects/rzp-care.png',
};

const ProjectsContent = () => {
  const { data: projects = [], isLoading: loading } = useProjects();

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
      <div className="max-w-2xl mx-auto py-10 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-800 rounded w-48 mb-8"></div>
          <div className="space-y-14">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="pb-14 border-b border-[#333] last:border-b-0 last:pb-0">
                <div className="w-full h-56 bg-gray-800 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-800 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-custom font-bold mb-6">Projects</h1>
      
      {/* Projects Grid */}
      <div className="mt-10 divide-y divide-[#333]">
        {projects.length === 0 ? (
          <p className="text-gray-400 text-center py-8 col-span-1">
            No projects found.
          </p>
        ) : (
          projects.map((project, idx) => {
            const imageUrl = craftApi.getPostImage(project);
            const slug = getPostSlug(project.title);
            const tags = getTagsForProject(project);
            const overrideImageUrl =
              Object.entries(PROJECT_THUMBNAIL_OVERRIDE_PREFIXES).find(([prefix]) =>
                slug.startsWith(prefix)
              )?.[1] ?? null;
            const isLastProject = idx === projects.length - 1;
            const resolvedImageUrl = isLastProject ? '/projects/rzp-tog.png' : (overrideImageUrl ?? imageUrl);

            return (
              <div key={project.id} className={`py-10 ${idx === 0 ? 'pt-0' : ''}`}>
                <Link
                  to={`/projects/${slug}`}
                  state={{ postId: project.id }}
                  className="block group hover:opacity-80 transition-opacity"
                >
                  <div className="flex flex-col">
                    {/* Image */}
                    <div className="w-full rounded-lg bg-[#2a2a2a] flex-shrink-0 overflow-hidden mb-4">
                      {resolvedImageUrl ? (
                        <img
                          src={resolvedImageUrl}
                          alt={project.title}
                          className="w-full h-auto"
                        />
                      ) : (
                        <div className="w-full h-56 flex items-center justify-center text-gray-600">
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
                    <h2 className="text-2xl font-custom font-bold text-white group-hover:text-gray-100 leading-tight">
                      {project.title}
                    </h2>

                    {/* Tags (from doc content, plus properties) */}
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="bg-[#2a2a2a] text-gray-400 hover:bg-[#333]"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ProjectsContent;

