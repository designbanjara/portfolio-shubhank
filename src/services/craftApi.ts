const DEFAULT_CRAFT_API_BASE = 'https://connect.craft.do/links/8a3DPwLXbQU/api/v1';

const craftEnv = ((import.meta as any)?.env ?? {}) as Record<string, string | undefined>;

const CRAFT_BLOG_API_BASE = (craftEnv.VITE_CRAFT_BLOG_API_BASE ?? craftEnv.VITE_CRAFT_API_BASE ?? DEFAULT_CRAFT_API_BASE).trim();
const CRAFT_PROJECTS_API_BASE = (
  craftEnv.VITE_CRAFT_PROJECTS_API_BASE ??
  craftEnv.VITE_CRAFT_API_BASE ??
  DEFAULT_CRAFT_API_BASE
).trim();

// Defaults taken from the Craft multi-document connection reference:
// - Writing is a PAGE block id that contains the Posts collection
// - Projects is a DOCUMENT id
const DEFAULT_BLOG_ROOT_ID = 'AB068729-8615-40EB-870A-C69E72A2CADA';
const DEFAULT_PROJECTS_ROOT_ID = 'f0a67abe-8c5e-ec93-a135-fb5c809113f6';

// Note: Craft /blocks accepts document IDs *and* page/block IDs.
const CRAFT_BLOG_DOCUMENT_ID = ((craftEnv.VITE_CRAFT_BLOG_DOCUMENT_ID ?? '').trim() || DEFAULT_BLOG_ROOT_ID) || null;
const CRAFT_PROJECTS_DOCUMENT_ID =
  ((craftEnv.VITE_CRAFT_PROJECTS_DOCUMENT_ID ?? '').trim() || DEFAULT_PROJECTS_ROOT_ID) || null;

type CraftDocumentsResponse = {
  items: Array<{
    id: string;
    title: string;
  }>;
};

const normalize = (s: string | undefined | null) => (s ?? '').trim().toLowerCase();

const isProbablyDeletedTitle = (title: string) => normalize(title).includes('deleted document');

function pickDocument(
  docs: CraftDocumentsResponse['items'],
  preferredTitles: string[]
): { id: string; title: string } | null {
  const preferred = preferredTitles.map(normalize).filter(Boolean);

  for (const p of preferred) {
    const hit = docs.find((d) => normalize(d.title) === p);
    if (hit) return hit;
  }

  // Fallback: first non-deleted doc
  const firstUsable = docs.find((d) => !isProbablyDeletedTitle(d.title));
  return firstUsable ?? null;
}

function pickCollectionBlock(
  document: CraftDocument,
  preferredCollectionNames: string[]
): CraftDocument['content'][number] | null {
  const blocks = document.content ?? [];
  const preferred = preferredCollectionNames.map(normalize).filter(Boolean);

  // Exact (case-insensitive) match on collection name (markdown)
  for (const p of preferred) {
    const hit = blocks.find((b) => b.type === 'collection' && normalize(b.markdown) === p);
    if (hit) return hit;
  }

  // Fallback: first collection block
  return blocks.find((b) => b.type === 'collection') ?? null;
}

function isPublishedValue(value: unknown): boolean {
  if (value === true) return true;
  if (typeof value === 'string') {
    const v = normalize(value);
    return v === 'true' || v === 'yes' || v === 'published' || v === 'public';
  }
  if (typeof value === 'number') return value === 1;
  return false;
}

export interface CraftBlock {
  id: string;
  type: string; // 'text', 'image', 'video', 'file', 'page', 'collection', etc.
  markdown: string;
  textStyle?: string; // 'h1', 'h2', 'h3', 'body', 'page', etc.
  decorations?: string[]; // 'quote', 'bold', 'italic', etc.
  listStyle?: string; // 'bullet', 'numbered', etc.
  url?: string; // For images, videos, and files
  rows?: Array<
    Array<{
      value: string;
      attributes?: Array<{
        type: string;
        color?: string;
        start?: number;
        end?: number;
      }>;
    }>
  >; // For tables
  content?: CraftBlock[]; // Nested blocks
}

export interface BlogPost {
  id: string;
  title: string;
  properties: {
    blurb?: string;
    published?: boolean;
    date?: string;
    tags?: string[];
  };
  content: CraftBlock[];
}

export interface CraftDocument {
  id: string;
  type: string;
  markdown: string;
  content: Array<{
    id: string;
    type: string;
    markdown: string;
    items?: BlogPost[];
  }>;
}

export const craftApi = {
  // Fetch the main blog document
  async getDocument(documentId: string, apiBase: string = DEFAULT_CRAFT_API_BASE): Promise<CraftDocument> {
    const response = await fetch(
      `${apiBase}/blocks?id=${documentId}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch document: ${response.statusText}`);
    }
    
    return response.json();
  },

  // Get all blog posts from the collection
  async getBlogPosts(): Promise<BlogPost[]> {
    try {
      // If explicitly configured, fetch directly (works even when /documents is restricted).
      if (CRAFT_BLOG_DOCUMENT_ID) {
        const document = await craftApi.getDocument(CRAFT_BLOG_DOCUMENT_ID, CRAFT_BLOG_API_BASE);
        const postsCollection = pickCollectionBlock(document, ['Posts', 'Writings', 'Writing', 'Articles']);
        if (!postsCollection?.items) return [];

        return postsCollection.items
          .filter((post) => isPublishedValue((post as any)?.properties?.published))
          .sort((a, b) => {
            const dateA = a.properties?.date || '';
            const dateB = b.properties?.date || '';
            return dateB.localeCompare(dateA);
          });
      }

      // Otherwise, list accessible docs and find the *blog* doc by title.
      const docsResponse = await fetch(`${CRAFT_BLOG_API_BASE}/documents`, {
        headers: { Accept: 'application/json' },
      });

      if (!docsResponse.ok) throw new Error('Failed to fetch documents');

      const docsData = (await docsResponse.json()) as CraftDocumentsResponse;

      // IMPORTANT: do not fall back to "Projects" here — Writing must not leak projects content.
      const blogDoc =
        docsData.items.find((doc) => normalize(doc.title) === normalize('Personal Blog')) ??
        docsData.items.find((doc) => normalize(doc.title) === normalize('Writing')) ??
        docsData.items.find((doc) => normalize(doc.title) === normalize('Writings')) ??
        docsData.items.find((doc) => normalize(doc.title) === normalize('Blog')) ??
        null;

      if (!blogDoc) {
        console.error(
          'Personal Blog document not accessible via the configured Craft link.',
          {
            apiBase: CRAFT_BLOG_API_BASE,
            availableDocuments: docsData.items.map((d) => d.title),
            hint: 'Set VITE_CRAFT_BLOG_API_BASE (share link for Personal Blog) or VITE_CRAFT_BLOG_DOCUMENT_ID.',
          }
        );
        return [];
      }

      const document = await craftApi.getDocument(blogDoc.id, CRAFT_BLOG_API_BASE);
      
      // Find the Posts/Writings collection (or first collection as fallback)
      const postsCollection = pickCollectionBlock(document, ['Posts', 'Writings', 'Writing', 'Articles']);
      
      if (!postsCollection?.items) {
        return [];
      }
      
      // Filter for published posts only
      return postsCollection.items
        .filter((post) => isPublishedValue((post as any)?.properties?.published))
        .sort((a, b) => {
          // Sort by date, newest first
          const dateA = a.properties?.date || '';
          const dateB = b.properties?.date || '';
          return dateB.localeCompare(dateA);
        });
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }
  },

  // Get all projects from the collection
  async getProjects(): Promise<BlogPost[]> {
    try {
      if (CRAFT_PROJECTS_DOCUMENT_ID) {
        const document = await craftApi.getDocument(CRAFT_PROJECTS_DOCUMENT_ID, CRAFT_PROJECTS_API_BASE);
        const collection = pickCollectionBlock(document, ['Projects']);
        if (!collection?.items) return [];

        return collection.items
          .filter((project) => isPublishedValue((project as any)?.properties?.published))
          .sort((a, b) => {
            const dateA = a.properties?.date || '';
            const dateB = b.properties?.date || '';
            return dateB.localeCompare(dateA);
          });
      }

      const docsResponse = await fetch(`${CRAFT_PROJECTS_API_BASE}/documents`, {
        headers: { Accept: 'application/json' },
      });

      if (!docsResponse.ok) throw new Error('Failed to fetch documents');

      const docsData = (await docsResponse.json()) as CraftDocumentsResponse;

      const projectsDoc =
        docsData.items.find((doc) => normalize(doc.title) === normalize('Projects')) ??
        pickDocument(docsData.items, ['Projects']);

      if (!projectsDoc) {
        console.error('Projects document not accessible via the configured Craft link.', {
          apiBase: CRAFT_PROJECTS_API_BASE,
          availableDocuments: docsData.items.map((d) => d.title),
          hint: 'Set VITE_CRAFT_PROJECTS_API_BASE (share link for Projects) or VITE_CRAFT_PROJECTS_DOCUMENT_ID.',
        });
        return [];
      }

      const document = await craftApi.getDocument(projectsDoc.id, CRAFT_PROJECTS_API_BASE);
      
      // Find the Projects collection (prefer one named "Projects", otherwise use first collection)
      const projectsCollection = document.content?.find(
        (block) => block.type === 'collection' && block.markdown === 'Projects'
      );
      
      // If no collection with "Projects" name, try to find any collection
      const collection = projectsCollection || document.content?.find(
        (block) => block.type === 'collection'
      );
      
      if (!collection?.items) {
        return [];
      }
      
      // Filter for published projects only
      return collection.items
        .filter((project) => isPublishedValue((project as any)?.properties?.published))
        .sort((a, b) => {
          // Sort by date, newest first
          const dateA = a.properties?.date || '';
          const dateB = b.properties?.date || '';
          return dateB.localeCompare(dateA);
        });
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  },

  // Get a single blog post by ID
  async getBlogPost(postId: string): Promise<BlogPost | null> {
    const posts = await craftApi.getBlogPosts();
    return posts.find((post) => post.id === postId) || null;
  },

  // Get posts by tag
  async getPostsByTag(tag: string): Promise<BlogPost[]> {
    const posts = await craftApi.getBlogPosts();
    return posts.filter((post) => 
      post.properties?.tags?.includes(tag)
    );
  },

  // Get all unique tags
  async getAllTags(): Promise<string[]> {
    const posts = await craftApi.getBlogPosts();
    const tagsSet = new Set<string>();
    
    posts.forEach((post) => {
      post.properties?.tags?.forEach((tag) => tagsSet.add(tag));
    });
    
    return Array.from(tagsSet).sort();
  },

  // Search posts
  async searchPosts(query: string): Promise<BlogPost[]> {
    const posts = await craftApi.getBlogPosts();
    const lowerQuery = query.toLowerCase();
    
    return posts.filter((post) => {
      const titleMatch = post.title.toLowerCase().includes(lowerQuery);
      const blurbMatch = post.properties?.blurb?.toLowerCase().includes(lowerQuery);
      const tagsMatch = post.properties?.tags?.some((tag) =>
        tag.toLowerCase().includes(lowerQuery)
      );
      
      return titleMatch || blurbMatch || tagsMatch;
    });
  },

  // Get the first image from a post's content
  getPostImage(post: BlogPost): string | null {
    const findImage = (blocks: CraftBlock[]): string | null => {
      for (const block of blocks) {
        if (block.type === 'image' && block.url) {
          return block.url;
        }
        if (block.content) {
          const found = findImage(block.content);
          if (found) return found;
        }
      }
      return null;
    };
    
    return findImage(post.content);
  },

  // Format post date
  formatDate(dateString?: string): string {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },
};

