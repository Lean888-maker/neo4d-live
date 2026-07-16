import { NextResponse } from 'next/server';
import { fetch4dData } from '../../utils/fetch4d';
import { pingSearchEngines } from '../../utils/seo';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

let lastPingedDraw = '';

export async function GET() {
  try {
    const results = await fetch4dData();
    
    // Dynamic Sitemap Index Sync on live draw updates
    const currentDraw = results.magnum?.drawNo;
    if (currentDraw && currentDraw !== lastPingedDraw) {
      lastPingedDraw = currentDraw;
      pingSearchEngines().catch((err) => console.error('SEO Ping execution failed:', err));
    }

    return NextResponse.json(results, {
      headers: {
        'Cache-Control': 'public, s-maxage=3, stale-while-revalidate=5',
      },
    });
  } catch (error) {
    console.error("Data proxy fetch failed:", error);
    return NextResponse.json({ error: 'Data Fetch Error', message: error.message }, { status: 500 });
  }
}