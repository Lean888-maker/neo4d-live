import { NextResponse } from 'next/server';

export async function GET() {
  const url = 'https://www.4d2u.co/actions';
  
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    },
    body: 'action=get_data2',
    next: { revalidate: 30 } // Cache results in Next.js for 30 seconds
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Failed to fetch from 4D2U API: status ${response.status}`);
    }
    const data = await response.json();

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

    return NextResponse.json(results, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=59',
      },
    });
  } catch (error) {
    console.error("Data proxy fetch failed:", error);
    return NextResponse.json({ error: 'Data Fetch Error', message: error.message }, { status: 500 });
  }
}
