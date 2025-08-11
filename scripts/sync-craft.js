#!/usr/bin/env node
/*
  Fully automated Craft sync
  - Input: Single public Craft page URL that lists all articles
  - Behavior: Scrape index, discover new articles, fetch content, generate JSON posts
  - Schedule: Run this script periodically (e.g., every 6 hours) to auto-sync new content
*/

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = path.resolve(__dirname, '..');
const projectRoot = path.resolve(root, '..');
const contentDir = path.join(projectRoot, 'src', 'content', 'posts');
const cachePath = path.join(projectRoot, '.craft-sync-cache.json');

// Configuration - update these values
const CRAFT_INDEX_URL = process.env.CRAFT_INDEX_URL || 'https://shubhank.craft.me/';
const SYNC_INTERVAL_HOURS = 6; // How often to check for updates
const FORCE_SYNC = String(process.env.CRAFT_FORCE_SYNC || '').toLowerCase() === 'true';
const CRAWL_DEPTH = Number(process.env.CRAFT_CRAWL_DEPTH || 2);
const MAX_PAGES = Number(process.env.CRAFT_MAX_PAGES || 20);

/** @typedef {{ url: string; title: string; date?: string; slug?: string; lastChecked?: number }} ArticleMeta */

/**
 * Extract article links from Craft index page
 * Adjust selectors based on your Craft page structure
 */
function resolveUrl(href, baseUrl) {
  try {
    return new URL(href, baseUrl).toString();
  } catch {
    return null;
  }
}

function extractHrefLinks(html, baseUrl) {
  const links = [];
  const anchorRegex = /<a[^>]*href=["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = anchorRegex.exec(html)) !== null) {
    const abs = resolveUrl(match[1], baseUrl);
    if (abs) {
      const title = match[2]?.replace(/<[^>]*>/g, '').trim() || '';
      links.push({ url: abs, title });
    }
  }
  return links;
}

function extractArticlesFromIndex(html, baseUrl) {
  const links = extractHrefLinks(html, baseUrl);
  const articles = links
    .filter(l => /https?:\/\/[^\s]+craft\.(?:do|me)\/s\//.test(l.url) || /\/s\//.test(l.url))
    .map(l => ({
      url: l.url,
      title: l.title && l.title.length > 2 ? l.title : (l.url.split('/')?.pop() || 'Article').replace(/[-_]/g, ' '),
      slug: generateSlug(l.title && l.title.length > 2 ? l.title : (l.url.split('/')?.pop() || 'article'))
    }));
  // De-duplicate by URL
  const seen = new Set();
  return articles.filter(a => (seen.has(a.url) ? false : seen.add(a.url)));
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Extract main content from individual article page
 */
function extractArticleContent(html) {
  // Try multiple content selectors
  const contentSelectors = [
    'main',
    'article',
    '.content',
    '.article-content',
    '[data-content]'
  ];
  
  for (const selector of contentSelectors) {
    const regex = new RegExp(`<${selector}[^>]*>([\\s\\S]*?)</${selector}>`, 'i');
    const match = html.match(regex);
    if (match && match[1]) {
      return sanitizeHtml(match[1]);
    }
  }
  
  // Fallback: extract body content
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return bodyMatch ? sanitizeHtml(bodyMatch[1]) : '<p>Content unavailable</p>';
}

function sanitizeHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/class="[^"]*"/g, '') // Remove classes to use our styling
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

/**
 * Estimate reading time from content
 */
function estimateReadingTime(html) {
  const textContent = html.replace(/<[^>]*>/g, '');
  const wordCount = textContent.split(/\s+/).length;
  const wordsPerMinute = 200;
  return Math.max(1, Math.round(wordCount / wordsPerMinute));
}

/**
 * Generate excerpt from content
 */
function generateExcerpt(html, maxLength = 150) {
  const textContent = html.replace(/<[^>]*>/g, '').trim();
  if (textContent.length <= maxLength) return textContent;
  return textContent.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
}

/**
 * Load existing posts cache
 */
function loadCache() {
  if (fs.existsSync(cachePath)) {
    try {
      return JSON.parse(fs.readFileSync(cachePath, 'utf8'));
    } catch (e) {
      console.warn('Invalid cache file, starting fresh');
    }
  }
  return { articles: {}, lastSync: 0 };
}

/**
 * Save cache
 */
function saveCache(cache) {
  fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2));
}

/**
 * Check if we should sync (based on time interval)
 */
function shouldSync(cache) {
  if (FORCE_SYNC) return true;
  const now = Date.now();
  const lastSync = cache.lastSync || 0;
  const intervalMs = SYNC_INTERVAL_HOURS * 60 * 60 * 1000;
  return (now - lastSync) > intervalMs;
}

async function main() {
  console.log('🤖 Starting Craft sync...');
  
  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
  }
  
  const cache = loadCache();
  
  // Check if we should sync
  if (!shouldSync(cache)) {
    console.log(`⏰ Last sync was ${Math.round((Date.now() - cache.lastSync) / 1000 / 60)} minutes ago. Skipping.`);
    return;
  }
  
  try {
    // Fetch index page
    console.log(`📄 Fetching index from ${CRAFT_INDEX_URL}`);
    const indexRes = await fetch(CRAFT_INDEX_URL, {
      headers: { 'User-Agent': 'CraftSync/1.0 (+github.com)' }
    });
    
    if (!indexRes.ok) {
      throw new Error(`Failed to fetch index: HTTP ${indexRes.status}`);
    }
    
    const indexHtml = await indexRes.text();

    // Crawl up to CRAWL_DEPTH within same origin to discover /s/ links
    const origin = new URL(CRAFT_INDEX_URL).origin;
    const queue = [{ url: CRAFT_INDEX_URL, depth: 0, html: indexHtml }];
    const visited = new Set([CRAFT_INDEX_URL]);
    const articles = [];

    while (queue.length && visited.size <= MAX_PAGES) {
      const { url, depth, html } = queue.shift();
      const foundHere = extractArticlesFromIndex(html, url);
      foundHere.forEach(a => {
        if (!articles.find(x => x.url === a.url)) articles.push(a);
      });
      if (depth < CRAWL_DEPTH) {
        const links = extractHrefLinks(html, url)
          .filter(l => l.url.startsWith(origin));
        for (const link of links) {
          if (!visited.has(link.url)) {
            visited.add(link.url);
            try {
              const res = await fetch(link.url, { headers: { 'User-Agent': 'CraftSync/1.0 (+github.com)' } });
              if (res.ok) {
                const childHtml = await res.text();
                queue.push({ url: link.url, depth: depth + 1, html: childHtml });
              }
            } catch {
              // ignore fetch errors during crawl
            }
          }
          if (visited.size > MAX_PAGES) break;
        }
      }
    }

    console.log(`📚 Found ${articles.length} article link(s)`);
    
    let newArticles = 0;
    
    // Process each article
    for (const article of articles) {
      const cacheKey = article.url;
      const cached = cache.articles[cacheKey];
      
      // Skip if we've processed this recently
      if (cached && (Date.now() - cached.lastChecked) < (60 * 60 * 1000)) {
        continue;
      }
      
      try {
        console.log(`📖 Processing: ${article.title}`);
        
        const articleRes = await fetch(article.url, {
          headers: { 'User-Agent': 'CraftSync/1.0 (+github.com)' }
        });
        
        if (!articleRes.ok) {
          console.warn(`⚠️  Failed to fetch ${article.url}: HTTP ${articleRes.status}`);
          continue;
        }
        
        const articleHtml = await articleRes.text();
        const content = extractArticleContent(articleHtml);
        
        // Generate metadata
        const post = {
          slug: article.slug,
          title: article.title,
          date: new Date().toISOString().split('T')[0], // Today's date as fallback
          readingTimeMinutes: estimateReadingTime(content),
          excerpt: generateExcerpt(content),
          html: content
        };
        
        // Write post file
        const outPath = path.join(contentDir, `${article.slug}.json`);
        fs.writeFileSync(outPath, JSON.stringify(post, null, 2));
        
        // Update cache
        cache.articles[cacheKey] = {
          ...article,
          lastChecked: Date.now()
        };
        
        newArticles++;
        console.log(`✅ Created: ${outPath}`);
        
        // Small delay to be respectful
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (err) {
        console.error(`❌ Failed to process ${article.url}:`, err.message);
      }
    }
    
    cache.lastSync = Date.now();
    saveCache(cache);
    
    console.log(`🎉 Sync complete! ${newArticles} new articles processed.`);
    
  } catch (err) {
    console.error('💥 Sync failed:', err.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main };


