import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Sidebar from '../components/Sidebar';
import MobileHeader from '../components/MobileHeader';
import BottomNavigation from '../components/BottomNavigation';
import { craftApi, BlogPost } from '../services/craftApi';
import { Badge } from '../components/ui/badge';
import { getPostSlug } from '../lib/slugify';
import { useBlogPosts } from '../hooks/useCraftApi';

const WritingByTag = () => {
  const { tag } = useParams<{ tag: string }>();
  const { data: allPosts = [], isLoading: loading } = useBlogPosts();

  // Filter posts by tag from cached data
  const posts = useMemo(() => {
    if (!tag || !allPosts.length) return [];
    return allPosts.filter((post) => 
      post.properties?.tags?.includes(tag)
    );
  }, [allPosts, tag]);

  return (
    <div className="min-h-screen bg-portfolio-dark text-white">
      <MobileHeader />
      <div className="flex">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <main className="flex-1 lg:ml-56">
          <div className="max-w-3xl mx-auto py-10 px-4">
            <Link
              to="/writing"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Writing
            </Link>

            <div className="mb-8">
              <h1 className="text-3xl font-custom font-bold mb-4">
                Posts tagged with "{tag}"
              </h1>
              <p className="text-gray-400">
                {posts.length} {posts.length === 1 ? 'post' : 'posts'} found
              </p>
            </div>

            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-24 bg-gray-800 rounded"></div>
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">No posts found with this tag.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {posts.map((post) => {
                  const imageUrl = craftApi.getPostImage(post);
                  const slug = getPostSlug(post.title);

                  return (
                    <article key={post.id} className="border-b border-[#333] pb-6">
                      <Link
                        to={`/writing/${slug}`}
                        state={{ postId: post.id }}
                        className="block group hover:bg-[#1f1f1f] p-4 -m-4 rounded-lg transition-colors"
                      >
                        <div className="flex gap-4">
                          {/* Image placeholder */}
                          <div className="w-20 h-20 rounded-lg bg-[#2a2a2a] flex-shrink-0 overflow-hidden">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={post.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-600">
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

                          <div className="flex-1 min-w-0">
                            <h2 className="font-bold mb-1 text-white group-hover:text-gray-100 text-lg">
                              {post.title}
                            </h2>
                            {post.properties?.date && (
                              <p className="text-sm text-gray-500 mb-2">
                                {craftApi.formatDate(post.properties.date)}
                              </p>
                            )}
                            {post.properties?.blurb && (
                              <p className="text-gray-300 text-sm line-clamp-2">
                                {post.properties.blurb}
                              </p>
                            )}
                            {post.properties?.tags && post.properties.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {post.properties.tags.map((t) => (
                                  <Link
                                    key={t}
                                    to={`/writing/tag/${t}`}
                                    onClick={(e) => {
                                      if (t === tag) {
                                        e.preventDefault();
                                      }
                                    }}
                                  >
                                    <Badge
                                      variant="secondary"
                                      className={`text-xs ${
                                        t === tag
                                          ? 'bg-white text-black'
                                          : 'bg-[#2a2a2a] text-gray-400 hover:bg-[#333]'
                                      } cursor-pointer`}
                                    >
                                      {t}
                                    </Badge>
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default WritingByTag;
