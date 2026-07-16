export async function pingSearchEngines() {
  const host = 'neo4d.live';
  const key = 'a8f5ecc862214222919842e5e23fa800';
  const urls = [
    'https://neo4d.live',
    'https://neo4d.live/predictions',
    'https://neo4d.live/dreams',
    'https://neo4d.live/analysis',
    'https://neo4d.live/operators/magnum',
    'https://neo4d.live/operators/toto',
    'https://neo4d.live/operators/damacai',
    'https://neo4d.live/operators/singapore',
    'https://neo4d.live/operators/sabah',
    'https://neo4d.live/operators/sarawak',
    'https://neo4d.live/operators/sandakan'
  ];

  try {
    // Ping Bing IndexNow (supported by Bing, Yahoo, Yandex, etc.)
    const indexNowUrl = 'https://api.indexnow.org/indexnow';
    const response = await fetch(indexNowUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        host,
        key,
        keyLocation: `https://neo4d.live/${key}.txt`,
        urlList: urls
      })
    });

    if (response.ok) {
      console.log('IndexNow ping triggered successfully.');
    } else {
      const text = await response.text();
      console.warn(`IndexNow API warning: ${response.status} - ${text}`);
    }
  } catch (error) {
    console.error('Failed to execute search engine ping:', error);
  }
}
