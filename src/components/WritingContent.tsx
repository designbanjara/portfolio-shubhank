import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { craftApi, BlogPost } from '../services/craftApi';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { getPostSlug } from '../lib/slugify';
import { useBlogPosts } from '../hooks/useCraftApi';
import { ChevronRightIcon } from '@heroicons/react/24/solid';

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
                          <img
                            src="/writing/Wave.png"
                            alt=""
                            className="w-full h-full object-cover opacity-90"
                            loading="lazy"
                          />
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
      
      {/* Newsletter Footer */}
      <div className="mt-10 pt-1 pb-1">
        <a 
          href="https://designbanjara.substack.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-wrap justify-between items-center py-3 h-full hover:bg-white/5 transition-colors duration-200 rounded-lg px-3 -mx-3 cursor-pointer group gap-1"
          style={{ verticalAlign: 'middle' }}
        >
          <div className="text-white flex items-center gap-2">
            <div className="flex flex-col">
              <span>Get updates by subscribing to my newsletter</span>
              <span className="text-base text-gray-400 mb-2 mt-0">Redirects to Substack</span>
            </div>
          </div>
          <div className="text-white bg-blue-600 py-2 px-5 rounded-xl transition-colors flex items-center font-custom text-base">
            Subscribe
            <ChevronRightIcon className="h-4 w-4 ml-1" />
          </div>
        </a>
      </div>
    </div>
  );
};

export default WritingContent;