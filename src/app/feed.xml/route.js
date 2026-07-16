export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = 'https://neo4d.live';
  const dateObj = new Date();
  
  // Format dates for RSS (RFC 822)
  const buildDate = dateObj.toUTCString();
  const pubDate = dateObj.toUTCString();

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>NEO4D LIVE News</title>
    <link>${baseUrl}</link>
    <description>Daily market trends, data analysis, and numerology predictions for Malaysia 4D draws.</description>
    <language>en-MY</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />

    <item>
      <title>Today's 4D Magnum &amp; Toto Draw Trend Analysis (${dateObj.toISOString().split('T')[0]})</title>
      <link>${baseUrl}/en/news</link>
      <guid isPermaLink="false">${baseUrl}/en/news?date=${dateObj.toISOString().split('T')[0]}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[Exclusive AI Data Analysis: Today's hot 4D numbers, cold digits, and Dream Dictionary numerology predictions. Read the ultimate draw guide.]]></description>
    </item>

    <item>
      <title>今日4D大马彩/万能/多多开奖趋势分析 (${dateObj.toISOString().split('T')[0]})</title>
      <link>${baseUrl}/zh/news</link>
      <guid isPermaLink="false">${baseUrl}/zh/news?date=${dateObj.toISOString().split('T')[0]}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[独家AI数据分析：今日万字热门号码、冷门号码以及易经千字图玄学预测。立即查看最强开彩指南。]]></description>
    </item>

  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
