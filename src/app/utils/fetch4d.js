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
      cache: 'no-store',
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
    sabah: { key: 'SB', special: 13, consolation: 10 },
    granddragon: { key: 'G', special: 13, consolation: 10 },
    ninelotto: { key: 'H', special: 13, consolation: 10 }
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
      },
      jackpots: {
        jp1: opData.ESTJP1 || opData.JP1 || null,
        jp2: opData.ESTJP2 || opData.JP2 || null,
        jp3: opData.ESTJP3 || opData.JP3 || null
      },
      jackpotGames: {
        magnumLife: id === 'magnum' && opData.L1 ? {
          numbers: [opData.L1, opData.L2, opData.L3, opData.L4, opData.L5, opData.L6, opData.L7, opData.L8].filter(Boolean),
          bonus: [opData.LB1, opData.LB2].filter(Boolean)
        } : null,
        toto650: id === 'toto' && opData.P6501 ? {
          numbers: [opData.P6501, opData.P6502, opData.P6503, opData.P6504, opData.P6505, opData.P6506].filter(Boolean),
          jp1: opData.P650JP1,
          jp2: opData.P650JP2
        } : null,
        toto655: id === 'toto' && opData.P6551 ? {
          numbers: [opData.P6551, opData.P6552, opData.P6553, opData.P6554, opData.P6555, opData.P6556].filter(Boolean),
          jp1: opData.P655JP
        } : null,
        toto658: id === 'toto' && opData.P6581 ? {
          name: 'Supreme Toto 6/58',
          numbers: [opData.P6581, opData.P6582, opData.P6583, opData.P6584, opData.P6585, opData.P6586].filter(Boolean),
          jp1: opData.P658JP
        } : null,
        damacai3d: id === 'damacai' && data['D3']?.P1 ? {
          name: 'Da Ma Cai 3D Jackpot',
          numbers: [data['D3'].P1, data['D3'].P2, data['D3'].P3].filter(Boolean),
          jp1: data['D3'].J61,
          jp2: data['D3'].J62,
          jp3: data['D3'].J63
        } : null
      }
    };
  }

  return results;
}
