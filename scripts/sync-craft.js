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
const CRAFT_INDEX_URL = process.env.CRAFT_INDEX_URL || 'https://your-craft-writings-page.craft.do';
const SYNC_INTERVAL_HOURS = 6; // How often to check for updates

/** @typedef {{ url: string; title: string; date?: string; slug?: string; lastChecked?: number }} ArticleMeta */

/**
 * Extract article links from Craft index page
 * Adjust selectors based on your Craft page structure
 */
function extractArticlesFromIndex(html) {
  const articles = [];
  
  // Try multiple selectors for article links
  const linkSelectors = [
    'a[href*="/s/"]', // Craft share links
    '.article-link',   // Custom class
    'article a',       // Links in article elements
    '.content a[href*="craft.do"]' // Any craft.do links in content
  ];
  
  for (const selector of linkSelectors) {
    const matches = html.match(new RegExp(`<a[^>]*href="([^"]*)"[^>]*>([^<]*)</a>`, 'gi'));
    if (matches) {
      for (const match of matches) {
        const hrefMatch = match.match(/href="([^"]*)"/);
        const titleMatch = match.match(/>([^<]*)</);
        
        if (hrefMatch && titleMatch) {
          const url = hrefMatch[1];
          const title = titleMatch[1].trim();
          
          // Only include craft.do links that look like articles
          if (url.includes('craft.do') && title.length > 10) {
            articles.push({
              url: url.startsWith('http') ? url : `https://craft.do${url}`,
              title: title,
              slug: generateSlug(title)
            });
          }
        }
      }
      if (articles.length > 0) break; // Found articles with this selector
    }
  }
  
  return articles;
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
    const articles = extractArticlesFromIndex(indexHtml);
    
    console.log(`📚 Found ${articles.length} articles`);
    
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


