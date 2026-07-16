export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
    sitemap: [
      'https://neo4d.live/sitemap.xml',
      'https://neo4d.live/sitemap-numbers.xml'
    ]
  };
}
