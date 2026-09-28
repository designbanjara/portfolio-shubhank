import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { craftApi, BlogPost } from '../services/craftApi';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { getPostSlug } from '../lib/slugify';
import { useBlogPosts } from '../hooks/useCraftApi';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { EASE, DURATION, STAGGER } from '@/lib/motion';

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
        <h2 id="writing-heading" className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-3">Writing</h2>
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
      <h2 id="writing-heading" className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-3">Writing</h2>
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {searchQuery ? `${filteredPosts.length} ${filteredPosts.length === 1 ? 'post' : 'posts'} found` : ''}
      </div>

      {/* Rows match the Connect list: name left, meta right, a quiet rule
          between, and no container around them. */}
      <motion.div
        className="divide-y divide-border/[0.12]"
        variants={shouldReduceMotion ? undefined : listVariants}
        initial={shouldReduceMotion ? false : 'hidden'}
        animate="visible"
      >
        {filteredPosts.length === 0 ? (
          <p className="text-muted-foreground py-8">
            No posts found matching your criteria.
          </p>
        ) : (
          filteredPosts.map((post) => {
            const slug = getPostSlug(post.title);

            return (
              <motion.article
                key={post.id}
                className="py-1 first:pt-0 last:pb-0"
                variants={shouldReduceMotion ? undefined : itemVariants}
              >
                <Link
                  to={`/writing/${slug}`}
                  state={{ postId: post.id }}
                  className="block group hover:bg-black/[0.04] dark:hover:bg-white/[0.04] py-2.5 px-3 -mx-3 rounded-lg transition-colors duration-150 ease-out-quad"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-medium text-foreground text-base transition-colors duration-150 flex items-center gap-1 min-w-0">
                      <span className="truncate">{post.title}</span>
                      <ChevronRightIcon
                        className="h-3.5 w-3.5 opacity-0 blur-sm scale-75 group-hover:opacity-100 group-hover:blur-none group-hover:scale-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-150 flex-shrink-0 ease-out-cubic"
                      />
                    </h3>
                    {post.properties?.date && (
                      <p className="mb-0 flex-shrink-0 text-base text-muted-foreground tabular-nums">
                        {craftApi.formatDate(post.properties.date)}
                      </p>
                    )}
                  </div>
                  {post.properties?.tags && post.properties.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
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
                </Link>
              </motion.article>
            );
          })
        )}
      </motion.div>
    </div>
  );
};

export default WritingContent;
