export default function sitemap() {
  const baseUrl = 'https://neo4d.live';
  const locales = ['zh', 'en'];
  
  const routes = [
    '',
    '/predictions',
    '/dreams',
    '/analysis',
    '/scanner',
    '/strategy',
    '/ramalan',
    '/zodiac'
  ];

  const sitemapEntries = [];

  // Add root domain first (highest priority for Google indexing)
  sitemapEntries.push({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'always',
    priority: 1.0,
  });

  locales.forEach(locale => {
    routes.forEach(route => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' || route === '/predictions' ? 'always' : 'daily',
        priority: route === '' ? 1 : 0.8,
      });
    });

    const zodiacs = ['rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake', 'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig'];
    zodiacs.forEach(z => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/zodiac/${z}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
      });
    });
  });

  return sitemapEntries;
}
