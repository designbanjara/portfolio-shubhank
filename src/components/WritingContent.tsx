import React, { useMemo } from 'react';

type PostMeta = {
  slug: string;
  title: string;
  date?: string;
  readingTimeMinutes?: number;
  heroImage?: string;
  excerpt?: string;
};

const loadAllPostMeta = (): PostMeta[] => {
  const modules = import.meta.glob('/src/content/posts/*.json', { eager: true }) as Record<string, any>;
  const posts: PostMeta[] = Object.values(modules).map((m: any) => (m.default ?? m) as PostMeta);
  return posts
    .filter(p => Boolean(p?.slug && p?.title))
    .sort((a, b) => {
      const aTime = a.date ? new Date(a.date).getTime() : 0;
      const bTime = b.date ? new Date(b.date).getTime() : 0;
      return bTime - aTime;
    });
};

const WritingContent = () => {
  const posts = useMemo(() => loadAllPostMeta(), []);

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-custom font-bold mb-6">Writing</h1>
      <div className="space-y-6">
        <p className="text-base">Each article features distinct visual or interaction styles. I use them as a space to explore different design approaches in context</p>

        <div className="space-y-8 mt-8">
          {posts.map((post) => (
            <article key={post.slug} className="border-b border-[#333] pb-6">
              <a href={`/writing/${post.slug}`} className="block group hover:bg-[#1f1f1f] p-4 -m-4 rounded-lg transition-colors">
                <div className="flex gap-4">
                  {post.heroImage ? (
                    <img src={post.heroImage} alt={post.title} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-20 h-20 rounded-lg bg-[#222] flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold mb-1 text-white group-hover:text-gray-100 text-lg">{post.title}</h2>
                    {post.excerpt && <p className="text-gray-300 text-base">{post.excerpt}</p>}
                    <div className="text-gray-500 text-sm mt-2">
                      {post.date && new Date(post.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      {post.date && typeof post.readingTimeMinutes === 'number' && ' · '}
                      {typeof post.readingTimeMinutes === 'number' && `${post.readingTimeMinutes} min read`}
                    </div>
                  </div>
                </div>
              </a>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WritingContent;