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

const projectRoot = path.resolve(__dirname, '..');
const contentDir = path.join(projectRoot, 'src', 'content', 'posts');
const cachePath = path.join(projectRoot, '.craft-sync-cache.json');

// Configuration - update these values
const CRAFT_INDEX_URL = process.env.CRAFT_INDEX_URL || 'https://shubhank.craft.me/';
const SYNC_INTERVAL_HOURS = 6; // How often to check for updates
const FORCE_SYNC = String(process.env.CRAFT_FORCE_SYNC || '').toLowerCase() === 'true';
// New approach: parse only explicit links on the Craft page by default
const MAX_LINKS = Number(process.env.CRAFT_MAX_LINKS || 20);
const FOLLOW_SAME_ORIGIN = String(process.env.CRAFT_FOLLOW_SAME_ORIGIN || 'true').toLowerCase() === 'true';
const USE_PLAYWRIGHT = String(process.env.CRAFT_USE_PLAYWRIGHT || 'true').toLowerCase() === 'true';

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

function extractExplicitArticleLinks(html, baseUrl) {
  const origin = new URL(baseUrl).origin;
  const rawLinks = extractHrefLinks(html, baseUrl)
    // ignore non-http(s)
    .filter(l => /^https?:\/\//i.test(l.url))
    // ignore assets
    .filter(l => !l.url.match(/\.(?:css|js|png|jpg|jpeg|gif|svg|webp|ico|pdf|zip|mp4|mov|webm)(?:\?|$)/i))
    // ignore same-page anchors
    .filter(l => !l.url.startsWith(baseUrl + '#'));

  // If FOLLOW_SAME_ORIGIN is false, keep only off-site links
  const filtered = rawLinks.filter(l => FOLLOW_SAME_ORIGIN || !l.url.startsWith(origin));

  const uniq = [];
  const seen = new Set();
  for (const l of filtered) {
    if (!seen.has(l.url)) {
      seen.add(l.url);
      const titleGuess = l.title && l.title.length > 2
        ? l.title
        : (l.url.split('/')?.filter(Boolean).pop() || 'Article').replace(/[-_]/g, ' ');
      uniq.push({ url: l.url, title: titleGuess, slug: generateSlug(titleGuess) });
    }
  }
  return uniq.slice(0, MAX_LINKS);
}

// extractTitleFromHtml defined above

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
    'article',
    'main',
    '[role="main"]',
    'div#content',
    'div[class*="content"]',
    'div[class*="article"]',
    'div[class*="post"]',
    'section[class*="article"]',
    'section[class*="post"]',
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
    .replace(/on[a-z]+="[^"]*"/gi, '')
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

function extractTitleFromHtml(html) {
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1 && h1[1]) return h1[1].replace(/<[^>]*>/g, '').trim();
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (title && title[1]) return title[1].replace(/<[^>]*>/g, '').trim();
  return undefined;
}

function extractOgImage(html) {
  const og = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["'][^>]*>/i);
  return og && og[1] ? og[1] : undefined;
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
  let browser = null;
  let context = null;
  let page = null;
  async function ensureBrowser() {
    if (!USE_PLAYWRIGHT) return null;
    if (browser) return browser;
    try {
      const { chromium } = await import('playwright');
      browser = await chromium.launch({ headless: true });
      context = await browser.newContext({ userAgent: 'CraftSync/1.0 (+github.com)' });
      page = await context.newPage();
      return browser;
    } catch (e) {
      console.warn('Playwright not available, falling back to raw fetch.', e?.message || e);
      return null;
    }
  }
  async function renderHtml(url) {
    const b = await ensureBrowser();
    if (!b) return null;
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      const html = await page.content();
      return html;
    } catch (e) {
      console.warn('Render failed for', url, e?.message || e);
      return null;
    }
  }
  
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
    let indexHtml = null;
    // Prefer rendered HTML if allowed
    if (USE_PLAYWRIGHT) {
      indexHtml = await renderHtml(CRAFT_INDEX_URL);
    }
    if (!indexHtml) {
      const indexRes = await fetch(CRAFT_INDEX_URL, {
        headers: { 'User-Agent': 'CraftSync/1.0 (+github.com)' }
      });
      if (!indexRes.ok) {
        throw new Error(`Failed to fetch index: HTTP ${indexRes.status}`);
      }
      indexHtml = await indexRes.text();
    }

    // New: Only parse explicit links present on the Craft page
    const articles = extractExplicitArticleLinks(indexHtml, CRAFT_INDEX_URL);
    console.log(`📚 Found ${articles.length} link(s) on Craft page to process`);
    
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
        
        let articleHtml = null;
        if (USE_PLAYWRIGHT) {
          articleHtml = await renderHtml(article.url);
        }
        if (!articleHtml) {
          const articleRes = await fetch(article.url, {
            headers: { 'User-Agent': 'CraftSync/1.0 (+github.com)' }
          });
          if (!articleRes.ok) {
            console.warn(`⚠️  Failed to fetch ${article.url}: HTTP ${articleRes.status}`);
            continue;
          }
          articleHtml = await articleRes.text();
        }
        const content = extractArticleContent(articleHtml);
        const titleFromPage = extractTitleFromHtml(articleHtml);
        const heroFromOg = extractOgImage(articleHtml);
        
        // Generate metadata
        const post = {
          slug: article.slug,
          title: titleFromPage || article.title,
          date: new Date().toISOString().split('T')[0], // Today's date as fallback
          readingTimeMinutes: estimateReadingTime(content),
          excerpt: generateExcerpt(content),
          heroImage: heroFromOg,
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
  } finally {
    if (browser) {
      try { await page?.close(); } catch {}
      try { await context?.close(); } catch {}
      try { await browser?.close(); } catch {}
    }
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main };


