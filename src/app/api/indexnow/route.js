import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const urls = [
      'https://neo4d.live/',
      'https://neo4d.live/zh',
      'https://neo4d.live/en',
      'https://neo4d.live/zh/news',
      'https://neo4d.live/en/news',
      'https://neo4d.live/sitemap.xml',
      'https://neo4d.live/feed.xml'
    ];

    const indexNowPayload = {
      host: 'neo4d.live',
      key: 'a8f5ecc862214222919842e5e23fa800',
      keyLocation: 'https://neo4d.live/a8f5ecc862214222919842e5e23fa800.txt',
      urlList: urls
    };

    const indexNowRes = await fetch('https://api.indexnow.org/IndexNow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(indexNowPayload)
    }).catch(() => null);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      indexedUrls: urls.length,
      indexNowStatus: indexNowRes ? indexNowRes.status : 'sent'
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
