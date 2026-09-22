import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { craftApi, BlogPost } from '../services/craftApi';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { getPostSlug } from '../lib/slugify';
import { useBlogPosts } from '../hooks/useCraftApi';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { useTheme } from '@/contexts/ThemeContext';
import { writingThumbnailOverrides, ThumbnailOverride } from '@/config/writingThumbnails';
import { EASE, DURATION, STAGGER } from '@/lib/motion';

function resolveOverride(
  override: ThumbnailOverride | undefined,
  theme: 'dark' | 'light'
): string | null {
  if (!override) return null;
  if (typeof override === 'string') return override;
  return theme === 'light' ? override.light : override.dark;
}

const listVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: STAGGER,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE.outCubic },
  },
};

const WritingContent = () => {
  const { data: posts = [], isLoading: loading, isError } = useBlogPosts();
  const [searchQuery, setSearchQuery] = useState('');
  const shouldReduceMotion = useReducedMotion();
  const { theme } = useTheme();

  // Filter posts by search query
  const filteredPosts = useMemo(() => {
    if (!searchQuery) return posts;
    const query = searchQuery.toLowerCase();
    return posts.filter((post) => {
      const titleMatch = post.title.toLowerCase().includes(query);
      const blurbMatch = post.properties?.blurb?.toLowerCase().includes(query);
      const tagsMatch = post.properties?.tags?.some((tag) => tag.toLowerCase().includes(query));
      return titleMatch || blurbMatch || tagsMatch;
    });
  }, [searchQuery, posts]);

  if (loading) {
    return (
      <div>
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-48"></div>
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <h2 id="writing-heading" className="text-3xl font-custom font-bold mb-6">Writing</h2>
        <div className="py-8 text-center">
          <p className="text-muted-foreground mb-4">Could not load posts. Please check your connection.</p>
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
      <h2 id="writing-heading" className="text-3xl font-custom font-bold mb-6">Writing</h2>
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {searchQuery ? `${filteredPosts.length} ${filteredPosts.length === 1 ? 'post' : 'posts'} found` : ''}
      </div>

      {/* The list reads as one panel rather than loose rows. */}
      <div className="mt-8 rounded-2xl bg-muted/50 p-5 sm:p-7">
        {/* Posts */}
        <motion.div
          className="divide-y divide-dashed divide-border/70"
          variants={shouldReduceMotion ? undefined : listVariants}
          initial={shouldReduceMotion ? false : 'hidden'}
          animate="visible"
        >
          {filteredPosts.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No posts found matching your criteria.
            </p>
          ) : (
            filteredPosts.map((post) => {
              const slug = getPostSlug(post.title);
              const imageUrl =
                resolveOverride(writingThumbnailOverrides[slug], theme)
                ?? craftApi.getPostImage(post)
                ?? null;

              return (
                <motion.article
                  key={post.id}
                  className=""
                  variants={shouldReduceMotion ? undefined : itemVariants}
                >
                  <Link
                    to={`/writing/${slug}`}
                    state={{ postId: post.id }}
                    className="block group hover:bg-black/[0.04] dark:hover:bg-white/[0.03] p-3 -mx-3 my-1 rounded-lg transition-colors duration-150 ease-out-quad"
                  >
                    <div className="flex items-center gap-3">
                      {/* Thumbnail */}
                      <div className="w-12 h-12 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04] ease-out-cubic"
                          />
                        ) : (
                          <img
                            src={theme === 'light' ? '/writing/Wave-light.png' : '/writing/Wave.png'}
                            alt=""
                            className="w-full h-full object-cover opacity-90 transition-transform duration-300 group-hover:scale-[1.04] ease-out-cubic"
                            loading="lazy"
                          />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Title and date on one line, so each row is a single
                            band of text beside its icon. */}
                        <div className="flex items-center justify-between gap-4">
                          <h3 className="font-bold text-foreground text-base transition-colors duration-150 flex items-center gap-1 min-w-0">
                            <span className="truncate">{post.title}</span>
                            <ChevronRightIcon
                              className="h-3.5 w-3.5 opacity-0 blur-sm scale-75 group-hover:opacity-100 group-hover:blur-none group-hover:scale-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-150 flex-shrink-0 ease-out-cubic"
                            />
                          </h3>
                          {post.properties?.date && (
                            <p className="mb-0 flex-shrink-0 text-sm text-muted-foreground tabular-nums">
                              {craftApi.formatDate(post.properties.date)}
                            </p>
                          )}
                        </div>
                        {post.properties?.tags && post.properties.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {post.properties.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs bg-muted text-muted-foreground hover:bg-muted/80"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.article>
              );
            })
          )}
        </motion.div>
      </div>

    </div>
  );
};

export default WritingContent;
