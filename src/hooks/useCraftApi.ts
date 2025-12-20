import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { craftApi, BlogPost } from '../services/craftApi';

// Query keys
export const craftQueryKeys = {
  all: ['craft'] as const,
  posts: () => [...craftQueryKeys.all, 'posts'] as const,
  tags: () => [...craftQueryKeys.all, 'tags'] as const,
  post: (id: string) => [...craftQueryKeys.posts(), id] as const,
  postsByTag: (tag: string) => [...craftQueryKeys.posts(), 'tag', tag] as const,
};

// Hook to fetch all blog posts
export const useBlogPosts = () => {
  return useQuery({
    queryKey: craftQueryKeys.posts(),
    queryFn: () => craftApi.getBlogPosts(),
    staleTime: Infinity, // Data never goes stale, only fetched once
    gcTime: Infinity, // Keep in cache forever
  });
};

// Hook to fetch all tags
export const useAllTags = () => {
  const { data: posts = [] } = useBlogPosts();
  
  // Extract tags from cached posts
  const tags = useMemo(() => {
    const tagsSet = new Set<string>();
    posts.forEach((post) => {
      post.properties?.tags?.forEach((tag) => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
  }, [posts]);

  return {
    data: tags,
    isLoading: false, // Tags are derived from posts, so no separate loading state
  };
};

// Hook to fetch a single blog post by ID
export const useBlogPost = (postId: string | null) => {
  return useQuery({
    queryKey: craftQueryKeys.post(postId || ''),
    queryFn: () => {
      if (!postId) return null;
      return craftApi.getBlogPost(postId);
    },
    enabled: !!postId,
    staleTime: Infinity,
    gcTime: Infinity,
  });
};

// Hook to fetch posts by tag
export const usePostsByTag = (tag: string | null) => {
  return useQuery({
    queryKey: craftQueryKeys.postsByTag(tag || ''),
    queryFn: () => {
      if (!tag) return [];
      return craftApi.getPostsByTag(tag);
    },
    enabled: !!tag,
    staleTime: Infinity,
    gcTime: Infinity,
  });
};

