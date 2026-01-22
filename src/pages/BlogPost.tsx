import React, { useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Sidebar from '../components/Sidebar';
import MobileHeader from '../components/MobileHeader';
import BottomNavigation from '../components/BottomNavigation';
import { craftApi, CraftBlock } from '../services/craftApi';
import { Badge } from '../components/ui/badge';
import { getPostSlug } from '../lib/slugify';
import { useBlogPosts, useProjects } from '../hooks/useCraftApi';
import { Dialog, DialogContent } from '../components/ui/dialog';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const isProjectRoute = location.pathname.startsWith('/projects');
  const { data: allPosts = [], isLoading: loadingPosts } = useBlogPosts();
  const { data: allProjects = [], isLoading: loadingProjects } = useProjects();
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  
  const allItems = isProjectRoute ? allProjects : allPosts;
  const loading = isProjectRoute ? loadingProjects : loadingPosts;

  // Find the post from cached data
  const post = useMemo(() => {
    if (!allItems.length) return null;

    // Try to get post from location state first
    const postId = location.state?.postId;
    if (postId) {
      return allItems.find((p) => p.id === postId) || null;
    }

    // Find by slug
    if (slug) {
      return allItems.find((p) => {
        const postSlug = getPostSlug(p.title);
        return postSlug === slug;
      }) || null;
    }

    return null;
  }, [allItems, slug, location.state]);

  const currentIndex = post ? allItems.findIndex((p) => p.id === post.id) : -1;
  const prevPost = currentIndex > 0 ? allItems[currentIndex - 1] : null;
  const nextPost = currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null;

  const renderContent = (blocks: CraftBlock[]) => {
    const result: React.ReactNode[] = [];
    let i = 0;

    // Helper to extract URL from markdown if needed
    const extractUrlFromMarkdown = (markdown: string) => {
      const match = markdown.match(/!\[.*?\]\((.*?)\)/);
      return match ? match[1] : null;
    };

    // Detect "a paragraph that is just a URL", even if Craft gives us multiple lines like:
    // [https://...]
    // (https://...)
    // or markdown link syntax: [label](https://...)
    const extractStandaloneUrl = (text: string) => {
      const trimmed = text.trim();

      // Markdown link where the whole paragraph is the link
      const mdLinkMatch = trimmed.match(/^\[[^\]]*\]\((https?:\/\/[^)\s]+)\)\s*$/i);
      if (mdLinkMatch) return mdLinkMatch[1];

      // Extract URLs that may be wrapped by [], (), etc.
      const urlMatches = trimmed.match(/https?:\/\/[^\s)\]]+/gi);
      if (!urlMatches || urlMatches.length === 0) return null;

      // If there are multiple URLs, they must all be identical (Craft sometimes duplicates them)
      const first = urlMatches[0];
      if (urlMatches.some((u) => u !== first)) return null;

      // Ensure the remaining content is only wrappers/whitespace
      const residue = trimmed
        .replace(/https?:\/\/[^\s)\]]+/gi, '')
        .replace(/[()[\]]/g, '')
        .trim();

      return residue.length === 0 ? first : null;
    };

    const isFigmaShareUrl = (url: string) => {
      try {
        const u = new URL(url);
        if (!/(\.|^)figma\.com$/i.test(u.hostname)) return false;
        // Common share/prototype paths: /proto, /file, /design
        return (
          u.pathname.startsWith('/proto') ||
          u.pathname.startsWith('/file') ||
          u.pathname.startsWith('/design')
        );
      } catch {
        return false;
      }
    };

    const toFigmaEmbedSrc = (figmaUrl: string) =>
      `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(figmaUrl)}`;

    // Very small GFM table renderer (Craft often sends tables as pipe-delimited markdown)
    const parseGfmTable = (markdown: string) => {
      const lines = markdown
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      // Find a header + separator pair
      for (let idx = 0; idx < lines.length - 1; idx++) {
        const header = lines[idx];
        const sep = lines[idx + 1];

        const looksLikeRow = header.includes('|');
        const looksLikeSeparator =
          sep.includes('|') &&
          sep.includes('-') &&
          /^[\s|:-]+$/.test(sep);

        if (!looksLikeRow || !looksLikeSeparator) continue;

        const splitRow = (row: string) =>
          row
            .replace(/^\|/, '')
            .replace(/\|$/, '')
            .split('|')
            .map((c) => c.trim());

        const headerCells = splitRow(header);
        const rows: string[][] = [];

        for (let j = idx + 2; j < lines.length; j++) {
          const rowLine = lines[j];
          if (!rowLine.includes('|')) break;
          rows.push(splitRow(rowLine));
        }

        if (headerCells.length === 0) return null;
        return { headerCells, rows };
      }

      return null;
    };

    const renderTable = (key: string, table: { headerCells: string[]; rows: string[][] }) => (
      <div key={key} className="my-6 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              {table.headerCells.map((cell, idx) => (
                <th
                  key={`${key}-th-${idx}`}
                  className="border border-white/10 bg-white/5 px-3 py-2 text-left font-semibold text-gray-100"
                >
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, rIdx) => (
              <tr key={`${key}-tr-${rIdx}`} className="align-top">
                {row.map((cell, cIdx) => (
                  <td
                    key={`${key}-td-${rIdx}-${cIdx}`}
                    className="border border-white/10 px-3 py-2 text-gray-200"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

    while (i < blocks.length) {
      const block = blocks[i];

      // Check if this is a list item
      if (block.type === 'text' && block.listStyle) {
        // Collect consecutive list items of the same type
        const listItems: CraftBlock[] = [];
        const listType = block.listStyle;
        
        while (
          i < blocks.length && 
          blocks[i].type === 'text' && 
          blocks[i].listStyle === listType
        ) {
          listItems.push(blocks[i]);
          i++;
        }

        // Render wrapped list based on type
        const ListTag = listType === 'bullet' ? 'ul' : 'ol';
        result.push(
          <ListTag 
            key={`list-${i}`} 
            className={`${listType === 'bullet' ? 'list-disc' : 'list-decimal'} pl-6 mb-4 space-y-2`}
          >
            {listItems.map((item, idx) => (
              <li key={item.id || idx} className="text-gray-300">
                {item.markdown.replace(/^[-*]\s/, '').replace(/^\d+\.\s/, '')}
              </li>
            ))}
          </ListTag>
        );
        continue;
      }

      // Handle non-list blocks
      switch (block.type) {
        case 'text':
          if (block.textStyle === 'h2') {
            result.push(
              <h2 key={block.id || i} className="font-bold text-white" style={{ marginTop: '69px' }}>
                {block.markdown.replace(/^## /, '')}
              </h2>
            );
          } else if (block.textStyle === 'h3') {
            result.push(
              <h3 key={block.id || i} className="font-bold text-white">
                {block.markdown.replace(/^### /, '')}
              </h3>
            );
          } else if (block.decorations?.includes('quote')) {
            result.push(
              <blockquote
                key={block.id || i}
                className="text-gray-200"
              >
                {block.markdown.replace(/^> /, '')}
              </blockquote>
            );
          } else {
            const table = parseGfmTable(block.markdown);
            if (table) {
              result.push(
                <div key={block.id || i} className="my-6 overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr>
                        {table.headerCells.map((cell, idx) => (
                          <th
                            key={`th-${block.id || i}-${idx}`}
                            className="border border-white/10 bg-white/5 px-3 py-2 text-left font-semibold text-gray-100"
                          >
                            {cell}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {table.rows.map((row, rIdx) => (
                        <tr key={`tr-${block.id || i}-${rIdx}`} className="align-top">
                          {row.map((cell, cIdx) => (
                            <td
                              key={`td-${block.id || i}-${rIdx}-${cIdx}`}
                              className="border border-white/10 px-3 py-2 text-gray-200"
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
              break;
            }

            const standaloneUrl = extractStandaloneUrl(block.markdown);
            if (standaloneUrl && isFigmaShareUrl(standaloneUrl)) {
              result.push(
                <figure key={block.id || i} className="my-6">
                  <div className="w-full overflow-hidden rounded-lg border border-white/10 bg-black">
                    <iframe
                      title="Figma prototype"
                      src={toFigmaEmbedSrc(standaloneUrl)}
                      className="w-full h-[70vh] min-h-[420px] max-h-[900px]"
                      style={{ border: 0 }}
                      loading="lazy"
                      allow="clipboard-write; fullscreen"
                      allowFullScreen
                    />
                  </div>
                </figure>
              );
            } else {
            result.push(
              <p key={block.id || i} className="text-gray-300">
                {block.markdown}
              </p>
            );
            }
          }
          break;

        case 'table': {
          // Prefer structured rows if present
          const rows = block.rows;
          if (rows && rows.length > 0) {
            const headerCells = rows[0].map((c) => c?.value ?? '');
            const bodyRows = rows.slice(1).map((r) => r.map((c) => c?.value ?? ''));
            result.push(renderTable(`table-${block.id || i}`, { headerCells, rows: bodyRows }));
          } else {
            const table = parseGfmTable(block.markdown);
            if (table) result.push(renderTable(`table-${block.id || i}`, table));
          }
          break;
        }

        case 'richUrl': {
          // Craft sometimes emits link cards as `richUrl` blocks; embed Figma prototypes here too.
          const standaloneUrl = extractStandaloneUrl(block.markdown);
          if (standaloneUrl && isFigmaShareUrl(standaloneUrl)) {
            result.push(
              <figure key={block.id || i} className="my-6">
                <div className="w-full overflow-hidden rounded-lg border border-white/10 bg-black">
                  <iframe
                    title="Figma prototype"
                    src={toFigmaEmbedSrc(standaloneUrl)}
                    className="w-full h-[70vh] min-h-[420px] max-h-[900px]"
                    style={{ border: 0 }}
                    loading="lazy"
                    allow="clipboard-write; fullscreen"
                    allowFullScreen
                  />
                </div>
              </figure>
            );
          } else {
            // Fallback: show as a regular external link (use markdown as text)
            result.push(
              <p key={block.id || i} className="text-gray-300">
                {block.markdown}
              </p>
            );
          }
          break;
        }

        case 'image': {
          // Try to get URL from block.url or parse from markdown
          const imageUrl = block.url || extractUrlFromMarkdown(block.markdown);
          if (imageUrl) {
            result.push(
              <figure key={block.id || i}>
                <button
                  type="button"
                  className="block w-full cursor-zoom-in focus:outline-none"
                  onClick={() => setLightboxUrl(imageUrl)}
                  aria-label="Open image preview"
                >
                  <img
                    src={imageUrl}
                    alt=""
                    className="block max-h-[480px] max-w-full w-auto rounded-lg mx-auto"
                    onError={(e) => {
                      console.error('Failed to load image:', imageUrl);
                      // Hide broken images
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </button>
              </figure>
            );
          }
          break;
        }

        case 'video':
          if (block.url) {
            result.push(
              <figure key={block.id || i}>
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
              </figure>
            );
          }
          break;

        case 'file':
          // Handle embedded files/media
          if (block.url) {
            const isVideo = block.url?.match(/\.(mp4|webm|ogg|mov)$/i);
            const isImage = block.url?.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);
            
            if (isVideo) {
              result.push(
                <figure key={block.id || i}>
                  <video
                    controls
                    className="w-full rounded-lg"
                    src={block.url}
                  >
                    Your browser does not support the video tag.
                  </video>
                </figure>
              );
            } else if (isImage) {
              result.push(
                <figure key={block.id || i}>
                  <button
                    type="button"
                    className="block w-full cursor-zoom-in focus:outline-none"
                    onClick={() => setLightboxUrl(block.url!)}
                    aria-label="Open image preview"
                  >
                    <img
                      src={block.url}
                      alt=""
                      className="block max-h-[480px] max-w-full w-auto rounded-lg mx-auto"
                      onError={(e) => {
                        console.error('Failed to load file image:', block.url);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </button>
                </figure>
              );
            } else {
              // For other file types, show a download link
              result.push(
                <div key={block.id || i} className="mb-6 mt-6">
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
            }
          }
          break;

        default:
          if (block.content) {
            result.push(
              <div key={block.id || i}>
                {renderContent(block.content)}
              </div>
            );
          }
          break;
      }

      i++;
    }

    return result;
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
                to={isProjectRoute ? "/projects" : "/writing"}
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Back to {isProjectRoute ? "Projects" : "Writing"}
              </Link>
              <h1 className="text-2xl font-bold text-white mb-4">{isProjectRoute ? "Project" : "Post"} not found</h1>
              <p className="text-gray-400">
                The {isProjectRoute ? "project" : "blog post"} you're looking for doesn't exist or hasn't been published yet.
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
              to={isProjectRoute ? "/projects" : "/writing"}
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to {isProjectRoute ? "Projects" : "Writing"}
            </Link>

            <article className="prose prose-invert prose-lg max-w-none">
              <header className="mb-10">
                <h3 className="post-date text-center text-gray-400 mb-2" style={{ fontSize: '0.89em', fontWeight: 400 }}>
                  {post.properties?.date && craftApi.formatDate(post.properties.date)}
                </h3>
                <h1 className="post-headline font-custom font-bold text-white text-center" style={{ fontSize: '2.1em', lineHeight: '1.15', fontWeight: 700, margin: '0.5em 8%' }}>
                  {post.title}
                </h1>
                {post.properties?.tags && post.properties.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.properties.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-[#2a2a2a] text-gray-400 hover:bg-[#333]"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </header>

              {post.properties?.blurb && (
                <p className="introduction text-gray-200" style={{ fontSize: '1.25em', lineHeight: '1.25', marginBottom: '1.4em' }}>
                  {post.properties.blurb}
                </p>
              )}

              <div className="post-body">
                {renderContent(post.content)}
              </div>
            </article>

            <Dialog open={!!lightboxUrl} onOpenChange={(open) => !open && setLightboxUrl(null)}>
              <DialogContent className="max-w-[96vw] w-[96vw] h-[92vh] p-4 bg-background border border-white/10 flex items-center justify-center overflow-hidden">
                {lightboxUrl ? (
                  <div className="w-full h-full flex items-center justify-center overflow-hidden">
                    <img
                      src={lightboxUrl}
                      alt=""
                      className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg"
                    />
                  </div>
                ) : null}
              </DialogContent>
            </Dialog>

            {/* Prev/Next Navigation */}
            <div className="mt-16 pt-8 border-t border-[#333]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {prevPost && (
                  <Link
                    to={`${isProjectRoute ? "/projects" : "/writing"}/${getPostSlug(prevPost.title)}`}
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
                    to={`${isProjectRoute ? "/projects" : "/writing"}/${getPostSlug(nextPost.title)}`}
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
