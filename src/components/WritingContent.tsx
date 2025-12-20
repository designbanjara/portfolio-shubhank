import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { craftApi, BlogPost } from '../services/craftApi';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { getPostSlug } from '../lib/slugify';
import { useBlogPosts } from '../hooks/useCraftApi';

const WritingContent = () => {
  const { data: posts = [], isLoading: loading } = useBlogPosts();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter posts by search query
  const filteredPosts = useMemo(() => {
    if (!searchQuery) {
      return posts;
    }
    
    const query = searchQuery.toLowerCase();
    return posts.filter((post) => {
      const titleMatch = post.title.toLowerCase().includes(query);
      const blurbMatch = post.properties?.blurb?.toLowerCase().includes(query);
      const tagsMatch = post.properties?.tags?.some((tag) =>
        tag.toLowerCase().includes(query)
      );
      return titleMatch || blurbMatch || tagsMatch;
    });
  }, [searchQuery, posts]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-800 rounded w-48"></div>
          <div className="h-4 bg-gray-800 rounded w-full"></div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-custom font-bold mb-6">Writing</h1>
      <div className="space-y-6">
        <p className="text-lg text-gray-300">
          Each article features distinct visual or interaction styles. I use them as a space to explore different design approaches in context.
        </p>

        {/* Search */}
        <div className="pt-4">
          <Input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#1a1a1a] border-[#333] text-white placeholder:text-gray-500"
          />
        </div>

        {/* Posts */}
        <div className="space-y-8 mt-8">
          {filteredPosts.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              No posts found matching your criteria.
            </p>
          ) : (
            filteredPosts.map((post) => {
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
                        <h2 className="font-bold mb-1 text-white group-hover:text-gray-100 text-xl">
                          {post.title}
                        </h2>
                        {post.properties?.date && (
                          <p className="text-sm text-gray-500 mb-2">
                            {craftApi.formatDate(post.properties.date)}
                          </p>
                        )}
                        {post.properties?.blurb && (
                          <p className="text-gray-300 text-lg line-clamp-2">
                            {post.properties.blurb}
                          </p>
                        )}
                        {post.properties?.tags && post.properties.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {post.properties.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs bg-[#2a2a2a] text-gray-400 hover:bg-[#333]"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default WritingContent;