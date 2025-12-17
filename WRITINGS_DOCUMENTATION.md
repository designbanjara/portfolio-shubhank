# Writings Section Documentation

## Overview
The writings section has been rebuilt to fetch blog posts dynamically from Craft CMS using the Craft Multi-Document API.

## Features

### 1. **Listing Page** (`/writing`)
- Displays all published blog posts with:
  - Post titles
  - Publication dates
  - Blurbs/descriptions
  - Image placeholders (shows actual images from Craft if available)
  - Tags for each post
- **Search functionality**: Real-time search across post titles, blurbs, and tags
- **Tag navigation**: Click any tag to view all posts with that tag
- Only shows posts where `published: true` in Craft

### 2. **Individual Post Pages** (`/writing/:slug`)
- Dynamic routing based on post title slugs
- Displays full post content including:
  - Title
  - Publication date
  - Tags (clickable to filter)
  - Post blurb
  - Complete formatted content (headings, paragraphs, quotes, images, lists)
- **Prev/Next navigation**: Navigate to adjacent posts at the bottom of each post
- Responsive design matching the rest of the site

### 3. **Tag Filter Page** (`/writing/tag/:tag`)
- Shows all posts tagged with a specific tag
- Same listing format as the main writing page
- "Back to Writing" navigation
- Highlights the current tag in the post tags

### 4. **Search Functionality**
- Integrated into the main listing page
- Searches across:
  - Post titles
  - Blurbs
  - Tags
- Real-time filtering as you type

## Technical Implementation

### Files Created/Modified

#### New Files:
1. **`src/services/craftApi.ts`**
   - API client for Craft CMS
   - Functions for fetching posts, filtering by tags, searching
   - Handles published filter automatically
   - Base URL: `https://connect.craft.do/links/8a3DPwLXbQU/api/v1`

2. **`src/pages/BlogPost.tsx`**
   - Dynamic blog post component
   - Renders Craft content blocks (text, headings, images, quotes, lists)
   - Includes prev/next navigation

3. **`src/pages/WritingByTag.tsx`**
   - Tag filter page component
   - Shows all posts for a specific tag

4. **`src/lib/slugify.ts`**
   - Utility functions for consistent slug generation
   - Converts post titles to URL-friendly slugs

#### Modified Files:
1. **`src/components/WritingContent.tsx`**
   - Updated to fetch real data from Craft API
   - Added search functionality
   - Added tag navigation
   - Displays images from Craft or placeholder

2. **`src/App.tsx`**
   - Added routes for dynamic blog posts and tag filtering
   - Removed old static blog post route

#### Removed Files:
- **`src/pages/BellandurTrafficBlog.tsx`** (replaced by dynamic system)

### Data Structure

Posts are fetched from Craft with this structure:
```typescript
{
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
```

### Content Rendering

The BlogPost component renders various Craft block types:
- **Text blocks**: Regular paragraphs
- **Headings**: H2 and H3 styles
- **Quotes**: Styled blockquotes with left border
- **Lists**: Bullet points
- **Images**: Full-width responsive images with error handling
- **Videos**: Embedded video player with controls
- **Files**: Smart detection (images/videos render inline, others show download link)

## Design System

The implementation uses:
- Dark theme: `bg-portfolio-dark` / `bg-background`
- Text colors: `text-white`, `text-gray-300`, `text-gray-400`
- Hover states: `hover:bg-[#1f1f1f]`
- Borders: `border-[#333]`
- Custom font: `font-custom` (Mint Grotesk)
- shadcn/ui components: Badge, Input
- Heroicons for icons

## Usage

### For End Users:
1. Navigate to `/writing` to see all posts
2. Use the search bar to find specific posts
3. Click tags to see posts in that category
4. Click any post to read the full content
5. Use prev/next buttons to navigate between posts

### For Developers:
1. All blog content is managed in Craft CMS
2. Set `published: true` in Craft for posts to appear
3. Posts are automatically sorted by date (newest first)
4. Images are pulled from Craft if available
5. Tag pages are automatically generated based on post tags

## API Integration

The system uses the Craft Multi-Document API:
- **GET /documents**: List all documents
- **GET /blocks?id={documentId}**: Fetch document content
- Finds "Personal Blog" document
- Extracts "Posts" collection
- Filters for published posts only

## Future Enhancements

Potential improvements:
- Add reading time estimates
- Implement pagination for large numbers of posts
- Add related posts section
- Enhance search with fuzzy matching
- Add post categories in addition to tags
- Implement RSS feed
- Add social sharing buttons

