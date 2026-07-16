export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = 'https://neo4d.live';
  const locales = ['zh', 'en'];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Generate 10000 numbers from 0000 to 9999 for both locales
  for (const locale of locales) {
    for (let i = 0; i < 10000; i++) {
      const numStr = i.toString().padStart(4, '0');
      xml += `
  <url>
    <loc>${baseUrl}/${locale}/number/${numStr}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
    }
  }

  xml += `\n</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate',
    },
  });
}
