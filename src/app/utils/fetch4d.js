export async function fetch4dData() {
  const urls = [
    'https://www.4d2u.co/actions',
    'https://www.4d2u.com/actions'
  ];

  let data = null;
  let lastError = null;

  const fetchWithTimeout = async (url) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      body: 'action=get_data2',
      next: { revalidate: 15 },
      signal: AbortSignal.timeout(8000)
    };
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`HTTP ${response.status} from ${url}`);
    return await response.json();
  };

  try {
    data = await Promise.any(urls.map(url => fetchWithTimeout(url)));
  } catch (err) {
    console.warn(`Scraper failed for all URLs:`, err);
  }

  if (!data) {
    throw new Error(`Scraper failed for all sources.`);
  }

  const mapping = {
    magnum: { key: 'M', special: 13, consolation: 10 },
    toto: { key: 'T', special: 13, consolation: 10 },
    damacai: { key: 'D', special: 10, consolation: 10 },
    singapore: { key: 'S', special: 10, consolation: 10 },
    sandakan: { key: 'ST', special: 13, consolation: 10 },
    sarawak: { key: 'SW', special: 10, consolation: 10 },
    sabah: { key: 'SB', special: 13, consolation: 10 }
  };

  const results = {
    date: new Date().toLocaleDateString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' })
  };

  for (const [id, cfg] of Object.entries(mapping)) {
    const opData = data[cfg.key];
    if (!opData) {
      results[id] = null;
      continue;
    }

    const normalize = (val) => {
      if (!val) return '----';
      const v = val.trim();
      if (v === '' || v === '-' || v === '****') return '----';
      return v;
    };

    const special = [];
    for (let i = 1; i <= cfg.special; i++) {
      special.push(normalize(opData[`S${i}`]));
    }

    const consolation = [];
    for (let i = 1; i <= cfg.consolation; i++) {
      consolation.push(normalize(opData[`C${i}`]));
    }

    results[id] = {
      provider: id.toUpperCase(),
      date: opData.DD || results.date,
      drawNo: opData.DN || '',
      numbers: {
        first: normalize(opData.P1),
        second: normalize(opData.P2),
        third: normalize(opData.P3),
        special,
        consolation
      }
    };
  }

  return results;
}
