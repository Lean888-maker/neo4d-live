export default function sitemap() {
  const base = 'https://neo4d.live';
  const operators = ['magnum', 'toto', 'damacai', 'singapore', 'sabah', 'sarawak', 'sandakan'];
  
  const routes = [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1.0,
    },
    {
      url: `${base}/predictions`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${base}/dreams`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${base}/analysis`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  const operatorRoutes = operators.map(op => ({
    url: `${base}/operators/${op}`,
    lastModified: new Date(),
    changeFrequency: 'always',
    priority: 0.9,
  }));

  return [...routes, ...operatorRoutes];
}
