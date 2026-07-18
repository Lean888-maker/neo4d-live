import fs from 'fs';
import path from 'path';

/**
 * Internal Linker Bot
 * Scans generated Markdown articles and automatically injects SEO-optimized internal links 
 * back to neo4d.live before syndication to external platforms.
 */
export function injectInternalLinks(articlePath) {
  if (!fs.existsSync(articlePath)) {
    console.warn(`Internal Linker: Article not found at ${articlePath}`);
    return;
  }

  let content = fs.readFileSync(articlePath, 'utf8');

  // Define keywords and their target URLs
  const linkMap = [
    { keyword: /万能4D/gi, url: 'https://neo4d.live/' },
    { keyword: /大马彩/gi, url: 'https://neo4d.live/' },
    { keyword: /多多博彩/gi, url: 'https://neo4d.live/' },
    { keyword: /4D预测/gi, url: 'https://neo4d.live/promo' },
    { keyword: /万字票成绩/gi, url: 'https://neo4d.live/' },
    { keyword: /今日开奖/gi, url: 'https://neo4d.live/' },
    { keyword: /心水字/gi, url: 'https://neo4d.live/' },
  ];

  // Track injected links to avoid over-stuffing (max 1 per keyword)
  const injected = new Set();

  let modified = false;

  linkMap.forEach(({ keyword, url }) => {
    // Check if keyword exists and hasn't been linked yet
    if (keyword.test(content) && !injected.has(url)) {
      // Replace only the FIRST occurrence of the keyword to avoid spammy SEO penalties
      content = content.replace(keyword, (match) => {
        injected.add(url);
        modified = true;
        return `[${match}](${url})`;
      });
    }
  });

  if (modified) {
    // Add a signature backlink at the very end of the article
    content += `\n\n---\n*For the fastest, ad-free live results, visit [neo4d.live](https://neo4d.live).*`;
    fs.writeFileSync(articlePath, content);
    console.log(`✅ Internal Linker: Successfully injected ${injected.size + 1} powerful backlinks into the article.`);
  }
}
