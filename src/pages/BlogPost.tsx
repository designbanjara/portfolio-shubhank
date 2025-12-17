import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Sidebar from '../components/Sidebar';
import MobileHeader from '../components/MobileHeader';
import BottomNavigation from '../components/BottomNavigation';
import { craftApi, BlogPost as BlogPostType, CraftBlock } from '../services/craftApi';
import { Badge } from '../components/ui/badge';
import { getPostSlug } from '../lib/slugify';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [allPosts, setAllPosts] = useState<BlogPostType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const posts = await craftApi.getBlogPosts();
        setAllPosts(posts);

        // Try to get post from location state first
        const postId = location.state?.postId;
        let foundPost: BlogPostType | null = null;

        if (postId) {
          foundPost = posts.find((p) => p.id === postId) || null;
        } else {
          // Find by slug
          foundPost = posts.find((p) => {
            const postSlug = getPostSlug(p.title);
            return postSlug === slug;
          }) || null;
        }

        setPost(foundPost);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, location.state]);

  const currentIndex = post ? allPosts.findIndex((p) => p.id === post.id) : -1;
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  const renderContent = (blocks: CraftBlock[]) => {
    return blocks.map((block, index) => {
      // Helper to extract URL from markdown if needed
      const extractUrlFromMarkdown = (markdown: string) => {
        const match = markdown.match(/!\[.*?\]\((.*?)\)/);
        return match ? match[1] : null;
      };

      switch (block.type) {
        case 'text':
          if (block.textStyle === 'h2') {
            return (
              <h2 key={block.id || index} className="font-bold text-white mb-4 text-2xl mt-8">
                {block.markdown.replace(/^## /, '')}
              </h2>
            );
          } else if (block.textStyle === 'h3') {
            return (
              <h3 key={block.id || index} className="font-bold text-white mb-3 text-xl mt-6">
                {block.markdown.replace(/^### /, '')}
              </h3>
            );
          } else if (block.decorations?.includes('quote')) {
            return (
              <blockquote
                key={block.id || index}
                className="border-l-4 border-gray-600 pl-6 my-6 text-gray-200 italic"
              >
                {block.markdown.replace(/^> /, '')}
              </blockquote>
            );
          } else if (block.listStyle === 'bullet') {
            return (
              <li key={block.id || index} className="ml-6 text-gray-300">
                {block.markdown.replace(/^- /, '')}
              </li>
            );
          } else {
            return (
              <p key={block.id || index} className="text-gray-300 leading-relaxed mb-4">
                {block.markdown}
              </p>
            );
          }

        case 'image':
          // Try to get URL from block.url or parse from markdown
          const imageUrl = block.url || extractUrlFromMarkdown(block.markdown);
          if (!imageUrl) return null;
          
          return (
            <div key={block.id || index} className="mb-6 mt-6">
              <img
                src={imageUrl}
                alt=""
                className="w-full rounded-lg"
                onError={(e) => {
                  console.error('Failed to load image:', imageUrl);
                  // Hide broken images
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          );

        case 'video':
          if (!block.url) return null;
          return (
            <div key={block.id || index} className="mb-6 mt-6">
              <video
                controls
                className="w-full rounded-lg"
                src={block.url}
                onError={(e) => {
                  console.error('Failed to load video:', block.url);
                }}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          );

        case 'file':
          // Handle embedded files/media
          if (!block.url) return null;
          const isVideo = block.url?.match(/\.(mp4|webm|ogg|mov)$/i);
          const isImage = block.url?.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);
          
          if (isVideo) {
            return (
              <div key={block.id || index} className="mb-6 mt-6">
                <video
                  controls
                  className="w-full rounded-lg"
                  src={block.url}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            );
          } else if (isImage) {
            return (
              <div key={block.id || index} className="mb-6 mt-6">
                <img
                  src={block.url}
                  alt=""
                  className="w-full rounded-lg"
                  onError={(e) => {
                    console.error('Failed to load file image:', block.url);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            );
          }
          // For other file types, show a download link
          return (
            <div key={block.id || index} className="mb-6 mt-6">
              <a
                href={block.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#2a2a2a] hover:bg-[#333] rounded-lg text-gray-300 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>
                Download File
              </a>
            </div>
          );

        default:
          if (block.content) {
            return (
              <div key={block.id || index}>
                {renderContent(block.content)}
              </div>
            );
          }
          return null;
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <MobileHeader />
        <div className="flex">
          <div className="hidden lg:block">
            <Sidebar />
          </div>
          <main className="flex-1 lg:ml-56">
            <div className="max-w-[672px] mx-auto py-10 px-4">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-800 rounded w-3/4"></div>
                <div className="h-4 bg-gray-800 rounded w-1/4"></div>
                <div className="h-64 bg-gray-800 rounded"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-800 rounded"></div>
                  <div className="h-4 bg-gray-800 rounded"></div>
                  <div className="h-4 bg-gray-800 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </main>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <MobileHeader />
        <div className="flex">
          <div className="hidden lg:block">
            <Sidebar />
          </div>
          <main className="flex-1 lg:ml-56">
            <div className="max-w-[672px] mx-auto py-10 px-4">
              <Link
                to="/writing"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Back to Writing
              </Link>
              <h1 className="text-2xl font-bold text-white mb-4">Post not found</h1>
              <p className="text-gray-400">
                The blog post you're looking for doesn't exist or hasn't been published yet.
              </p>
            </div>
          </main>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <MobileHeader />
      <div className="flex">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <main className="flex-1 lg:ml-56">
          <div className="max-w-[672px] mx-auto py-10 px-4">
            <Link
              to="/writing"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Writing
            </Link>

            <article className="prose prose-invert prose-lg max-w-none">
              <header className="mb-10">
                <h1 className="font-custom font-bold mb-4 text-white text-3xl">
                  {post.title}
                </h1>
                <div className="flex items-center gap-4 text-gray-400 text-sm mb-4">
                  {post.properties?.date && (
                    <>
                      <time dateTime={post.properties.date}>
                        {craftApi.formatDate(post.properties.date)}
                      </time>
                    </>
                  )}
                </div>
                {post.properties?.tags && post.properties.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.properties.tags.map((tag) => (
                      <Link
                        key={tag}
                        to={`/writing/tag/${tag}`}
                      >
                        <Badge
                          variant="secondary"
                          className="bg-[#2a2a2a] text-gray-400 hover:bg-[#333] cursor-pointer"
                        >
                          {tag}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                )}
              </header>

              {post.properties?.blurb && (
                <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                  {post.properties.blurb}
                </p>
              )}

              <div className="space-y-4">
                {renderContent(post.content)}
              </div>
            </article>

            {/* Prev/Next Navigation */}
            <div className="mt-16 pt-8 border-t border-[#333]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {prevPost && (
                  <Link
                    to={`/writing/${getPostSlug(prevPost.title)}`}
                    state={{ postId: prevPost.id }}
                    className="group p-4 rounded-lg border border-[#333] hover:bg-[#1f1f1f] transition-colors"
                  >
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                      <ChevronLeftIcon className="h-4 w-4" />
                      Previous
                    </div>
                    <h3 className="font-bold text-white group-hover:text-gray-100 line-clamp-2">
                      {prevPost.title}
                    </h3>
                  </Link>
                )}
                {nextPost && (
                  <Link
                    to={`/writing/${getPostSlug(nextPost.title)}`}
                    state={{ postId: nextPost.id }}
                    className="group p-4 rounded-lg border border-[#333] hover:bg-[#1f1f1f] transition-colors md:text-right"
                  >
                    <div className="flex items-center justify-end gap-2 text-sm text-gray-400 mb-2">
                      Next
                      <ChevronRightIcon className="h-4 w-4" />
                    </div>
                    <h3 className="font-bold text-white group-hover:text-gray-100 line-clamp-2">
                      {nextPost.title}
                    </h3>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default BlogPost;
