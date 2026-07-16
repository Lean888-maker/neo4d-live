export async function fetch4dData() {
  const urls = [
    'https://www.4d2u.co/actions',
    'https://www.4d2u.com/actions'
  ];

  let data = null;
  let lastError = null;

  for (const url of urls) {
    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        body: 'action=get_data2',
        cache: 'no-store'
      };

      const response = await fetch(url, options);
      if (response.ok) {
        data = await response.json();
        break; // Scrape succeeded!
      } else {
        console.warn(`Scraper warning: status ${response.status} from ${url}`);
      }
    } catch (err) {
      lastError = err;
      console.warn(`Scraper failed for URL ${url}:`, err);
    }
  }

  if (!data) {
    throw new Error(`Scraper failed for all sources. Last error: ${lastError ? lastError.message : 'Unknown error'}`);
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

    const special = [];
    for (let i = 1; i <= cfg.special; i++) {
      special.push(opData[`S${i}`] || '----');
    }

    const consolation = [];
    for (let i = 1; i <= cfg.consolation; i++) {
      consolation.push(opData[`C${i}`] || '----');
    }

    results[id] = {
      provider: id.toUpperCase(),
      date: opData.DD || results.date,
      drawNo: opData.DN || '',
      numbers: {
        first: opData.P1 || '----',
        second: opData.P2 || '----',
        third: opData.P3 || '----',
        special,
        consolation
      }
    };
  }

  return results;
}
