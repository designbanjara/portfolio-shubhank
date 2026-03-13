/**
 * Per-article thumbnail overrides.
 *
 * Map article slug → local asset path (string) or { dark, light } variants.
 * Slug is derived from the post title via getPostSlug(post.title),
 * which lowercases and hyphenates the title.
 * e.g. "To Creatives in Corporate" → "to-creatives-in-corporate"
 *
 * Overrides take priority over images embedded in Craft content.
 * If no override and no Craft image, Wave.png (dark) / Wave-light.png (light) is used.
 *
 * Workflow for a new article:
 * 1. Drop the asset(s) in /public/writing/
 *    - Dark only:  my-article.png
 *    - Both modes: my-article.png + my-article-light.png
 * 2. Add an entry below:
 *    - Single asset:  'my-article-slug': '/writing/my-article.png'
 *    - Theme-aware:   'my-article-slug': { dark: '/writing/my-article.png', light: '/writing/my-article-light.png' }
 */
export type ThumbnailOverride = string | { dark: string; light: string };

export const writingThumbnailOverrides: Record<string, ThumbnailOverride> = {
  'to-creatives-in-corporate': {
    dark:  '/writing/to-creatives-in-corporate.png',
    light: '/writing/to-creatives-in-corporate-light.png',
  },
  'resource-for-design-resources': {
    dark:  '/writing/resource-for-design-resources.png',
    light: '/writing/resource-for-design-resources-light.png',
  },
};
