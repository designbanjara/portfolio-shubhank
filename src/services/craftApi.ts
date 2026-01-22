const CRAFT_API_BASE = 'https://connect.craft.do/links/8a3DPwLXbQU/api/v1';

type CraftDocumentsResponse = {
  items: Array<{
    id: string;
    title: string;
  }>;
};

export interface CraftBlock {
  id: string;
  type: string; // 'text', 'image', 'video', 'file', 'page', 'collection', etc.
  markdown: string;
  textStyle?: string; // 'h1', 'h2', 'h3', 'body', 'page', etc.
  decorations?: string[]; // 'quote', 'bold', 'italic', etc.
  listStyle?: string; // 'bullet', 'numbered', etc.
  url?: string; // For images, videos, and files
  rows?: Array<Array<{ value: string; attributes?: string[] }>>; // For tables
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
  async getDocument(documentId: string): Promise<CraftDocument> {
    const response = await fetch(
      `${CRAFT_API_BASE}/blocks?id=${documentId}`,
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
      // First, get the list of documents
      const docsResponse = await fetch(`${CRAFT_API_BASE}/documents`, {
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!docsResponse.ok) {
        throw new Error('Failed to fetch documents');
      }
      
      const docsData = (await docsResponse.json()) as CraftDocumentsResponse;
      
      // Find the "Personal Blog" document
      const blogDoc = docsData.items.find((doc) => 
        doc.title === 'Personal Blog'
      );
      
      if (!blogDoc) {
        console.error('Personal Blog document not found');
        return [];
      }
      
      // Fetch the blog document content
      const document = await craftApi.getDocument(blogDoc.id);
      
      // Find the Posts collection
      const postsCollection = document.content?.find(
        (block) => block.type === 'collection' && block.markdown === 'Posts'
      );
      
      if (!postsCollection?.items) {
        return [];
      }
      
      // Filter for published posts only
      return postsCollection.items
        .filter((post) => post.properties?.published === true)
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
      // First, get the list of documents
      const docsResponse = await fetch(`${CRAFT_API_BASE}/documents`, {
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!docsResponse.ok) {
        throw new Error('Failed to fetch documents');
      }
      
      const docsData = (await docsResponse.json()) as CraftDocumentsResponse;
      
      // Find the "Projects" document
      const projectsDoc = docsData.items.find((doc) => 
        doc.title === 'Projects'
      );
      
      if (!projectsDoc) {
        console.error('Projects document not found');
        return [];
      }
      
      // Fetch the projects document content
      const document = await craftApi.getDocument(projectsDoc.id);
      
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
        .filter((project) => project.properties?.published === true)
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

