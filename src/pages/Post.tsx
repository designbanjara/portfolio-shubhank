import React from 'react';
import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Sidebar from '@/components/Sidebar';
import MobileHeader from '@/components/MobileHeader';
import BottomNavigation from '@/components/BottomNavigation';

type PostData = {
  slug: string;
  title: string;
  date?: string;
  readingTimeMinutes?: number;
  heroImage?: string;
  excerpt?: string;
  html: string;
};

const allPosts: Record<string, PostData> = (() => {
  const modules = import.meta.glob('/src/content/posts/*.json', { eager: true }) as Record<string, any>;
  const map: Record<string, PostData> = {};
  Object.values(modules).forEach((mod: any) => {
    const data: PostData = (mod.default ?? mod) as PostData;
    if (data?.slug) {
      map[data.slug] = data;
    }
  });
  return map;
})();

const Post: React.FC = () => {
  const { slug } = useParams();

  const post = useMemo(() => {
    if (!slug) return undefined;
    return allPosts[slug];
  }, [slug]);

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
              <Link to="/writing" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
                <ArrowLeftIcon className="h-4 w-4" />
                Back to Writing
              </Link>
              <h1 className="text-2xl font-custom font-bold mb-2">Post not found</h1>
              <p className="text-gray-400">The requested post does not exist.</p>
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
            <Link to="/writing" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Writing
            </Link>

            <article className="prose prose-invert prose-lg prose-p:leading-relaxed">
              <header className="mb-10">
                <h1 className="font-custom font-bold mb-4 text-white text-3xl">{post.title}</h1>
                {(post.date || post.readingTimeMinutes) && (
                  <div className="flex items-center gap-4 text-gray-400 text-sm">
                    {post.date && (
                      <time dateTime={post.date}>{new Date(post.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                    )}
                    {post.date && post.readingTimeMinutes ? <span>·</span> : null}
                    {typeof post.readingTimeMinutes === 'number' && <span>{post.readingTimeMinutes} min read</span>}
                  </div>
                )}
              </header>

              {post.heroImage && (
                <img src={post.heroImage} alt={post.title} className="w-full h-64 object-cover rounded-lg mb-8" />
              )}

              <div className="space-y-10 text-gray-300" dangerouslySetInnerHTML={{ __html: post.html }} />
            </article>
          </div>
        </main>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default Post;


