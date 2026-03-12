import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { craftApi, BlogPost } from '../services/craftApi';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { getPostSlug } from '../lib/slugify';
import { useBlogPosts } from '../hooks/useCraftApi';
import { ChevronRightIcon } from '@heroicons/react/24/solid';

const listVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.44, 0, 0.56, 1] },
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
      <div className="max-w-2xl mx-auto py-10 px-6">
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
      <div className="max-w-2xl mx-auto py-10 px-6">
        <h1 className="text-3xl font-custom font-bold mb-6">Writing</h1>
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
    <div className="max-w-2xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-custom font-bold mb-6">Writing</h1>
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {searchQuery ? `${filteredPosts.length} ${filteredPosts.length === 1 ? 'post' : 'posts'} found` : ''}
      </div>

      <div className="space-y-6">
        {/* Posts */}
        <motion.div
          className="space-y-8 mt-8"
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
              const imageUrl = craftApi.getPostImage(post);
              const slug = getPostSlug(post.title);

              return (
                <motion.article
                  key={post.id}
                  className="border-b border-border pb-6"
                  variants={shouldReduceMotion ? undefined : itemVariants}
                >
                  <Link
                    to={`/writing/${slug}`}
                    state={{ postId: post.id }}
                    className="block group hover:bg-black/[0.04] dark:hover:bg-white/[0.03] p-3 -m-3 rounded-lg transition-colors duration-150"
                    style={{ transitionTimingFunction: 'cubic-bezier(0.44, 0, 0.56, 1)' }}
                  >
                    <div className="flex gap-4">
                      {/* Thumbnail */}
                      <div className="w-20 h-20 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                            style={{ transitionTimingFunction: 'cubic-bezier(0.44, 0, 0.56, 1)' }}
                          />
                        ) : (
                          <img
                            src="/writing/Wave.png"
                            alt=""
                            className="w-full h-full object-cover opacity-90 transition-transform duration-300 group-hover:scale-[1.04]"
                            style={{ transitionTimingFunction: 'cubic-bezier(0.44, 0, 0.56, 1)' }}
                            loading="lazy"
                          />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h2 className="font-bold mb-1 text-foreground text-base transition-colors duration-150 flex items-center gap-1">
                          <span>{post.title}</span>
                          <ChevronRightIcon
                            className="h-3.5 w-3.5 opacity-0 blur-sm scale-75 group-hover:opacity-100 group-hover:blur-none group-hover:scale-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-150 flex-shrink-0"
                            style={{ transitionTimingFunction: 'cubic-bezier(0.44, 0, 0.56, 1)' }}
                          />
                        </h2>
                        {post.properties?.date && (
                          <p className="text-sm text-muted-foreground mb-2 tabular-nums">
                            {craftApi.formatDate(post.properties.date)}
                          </p>
                        )}
                        {post.properties?.blurb && (
                          <p className="text-muted-foreground text-sm line-clamp-2">
                            {post.properties.blurb}
                          </p>
                        )}
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

      {/* Newsletter Footer */}
      <div className="mt-10 pt-1 pb-1">
        <a
          href="https://designbanjara.substack.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-wrap justify-between items-center py-3 h-full hover:bg-black/[0.04] dark:hover:bg-white/5 transition-colors duration-200 rounded-lg px-3 -mx-3 cursor-pointer group gap-1"
          style={{ transitionTimingFunction: 'cubic-bezier(0.44, 0, 0.56, 1)', verticalAlign: 'middle' }}
        >
          <div className="text-foreground flex items-center gap-2">
            <div className="flex flex-col">
              <span>Get updates by subscribing to my newsletter</span>
              <span className="text-sm text-muted-foreground mt-0.5">Redirects to Substack</span>
            </div>
          </div>
          <div
            className="text-white bg-blue-600 hover:bg-blue-500 py-2 px-5 rounded-xl transition-colors duration-150 flex items-center font-custom text-base"
            style={{ transitionTimingFunction: 'cubic-bezier(0.44, 0, 0.56, 1)' }}
          >
            Subscribe
            <ChevronRightIcon className="h-4 w-4 ml-1" />
          </div>
        </a>
      </div>
    </div>
  );
};

export default WritingContent;
