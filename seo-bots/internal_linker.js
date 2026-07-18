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
    { keyword: /Magnum 4D/gi, url: 'https://neo4d.live/' },
    { keyword: /Sports Toto/gi, url: 'https://neo4d.live/' },
    { keyword: /Da Ma Cai/gi, url: 'https://neo4d.live/' },
    { keyword: /Carta Ramalan/gi, url: 'https://neo4d.live/en/ramalan' },
    { keyword: /4D forecast/gi, url: 'https://neo4d.live/en/ramalan' },
    { keyword: /live 4d results/gi, url: 'https://neo4d.live/' }
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
