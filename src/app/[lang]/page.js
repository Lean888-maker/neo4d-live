import { fetch4dData } from '../utils/fetch4d';
import HomeClient from '../HomeClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'NEO4D LIVE | 实时4D开彩结果 Magnum, Sports Toto, Da Ma Cai, Singapore Pools',
  description: '全马最快、无广告的4D开彩结果网站。提供 Magnum万能、Sports Toto多多、Da Ma Cai大马彩、新加坡博彩等实时开彩数据与大伯公梦境解析吉数。',
  keywords: 'keputusan 4d, live 4d results, check4d, 4d results today, magnum 4d, sports toto, da ma cai, singapore pools, sandakan 4d, special cashsweep, sabah 88, neo4d, 大伯公千字图',
  alternates: {
    canonical: 'https://neo4d.live',
  },
  verification: {
    google: 'b4QjddVCf67G-frXKSLfZj7NlNJKO5rJEVpkurOhlYQ',
    other: {
      'msvalidate.01': '9CE1B0F2F43E22E0706B879AE521A68A',
    },
  },
  openGraph: {
    title: 'NEO4D LIVE | 实时4D开彩结果 (Magnum, Sports Toto, Da Ma Cai)',
    description: '全马最快、无广告、无弹窗的4D实时开彩数据中心。提供即时开彩通知、生肖吉数、大伯公千字图梦境解析。',
    url: 'https://neo4d.live',
    siteName: 'NEO4D LIVE',
    images: [
      {
        url: 'https://neo4d.live/og-premium.png',
        width: 1200,
        height: 630,
        alt: 'NEO4D LIVE - 无广告实时4D开彩',
      }
    ],
    type: 'website',
    locale: 'zh_CN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NEO4D LIVE | 实时4D开彩结果',
    description: '全马最快、无广告的4D实时开彩数据中心。提供即时开彩通知与大伯公梦境解析。',
    images: ['https://neo4d.live/og-premium.png'],
  }
};

export default async function Page({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang;
  let initialResults = null;
  
  try {
    initialResults = await fetch4dData();
  } catch (error) {
    console.error("Failed to load initial 4D results on server:", error);
  }

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "NEO4D LIVE",
    "url": "https://neo4d.live",
    "description": "Fastest real-time live 4D draw results in Malaysia and Singapore. Search winning numbers for Magnum 4D, Sports Toto, Da Ma Cai, Singapore Pools, Sabah 88, Sandakan 4D, and CashSweep.",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5."
  };

  let faqData = [];
  try {
    faqData = require('../data/faq_schema.json');
  } catch (e) {
    console.error("Failed to load dynamic FAQ schema");
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  // Elite SEO Strategy: LiveBlogPosting schema on draw days (Wed, Sat, Sun, Tue)
  // This helps trigger Google's "LIVE" badge in search results during peak hours (6:30 PM - 8:30 PM)
  const today = new Date();
  const mytHour = (today.getUTCHours() + 8) % 24;
  const mytDay = today.getUTCDay(); // 0 = Sun, 3 = Wed, 6 = Sat
  const isDrawDay = [0, 2, 3, 6].includes(mytDay); // Tue included for Special Draws
  
  let liveBlogSchema = null;
  if (isDrawDay) {
    liveBlogSchema = {
      "@context": "https://schema.org",
      "@type": "LiveBlogPosting",
      "headline": "马来西亚4D开彩直播 - 最新万能、多多、大马彩成绩",
      "description": "实时更新今天的马来西亚4D开彩成绩。包括 Magnum 4D, Sports Toto, Da Ma Cai。",
      "about": {
        "@type": "Event",
        "name": "Malaysia 4D Draw",
        "startDate": `${today.toISOString().split('T')[0]}T19:00:00+08:00`
      },
      "coverageStartTime": `${today.toISOString().split('T')[0]}T19:00:00+08:00`,
      "coverageEndTime": `${today.toISOString().split('T')[0]}T20:30:00+08:00`,
      "liveBlogUpdate": [
        {
          "@type": "BlogPosting",
          "headline": "4D Draw Commences",
          "datePublished": `${today.toISOString().split('T')[0]}T19:00:00+08:00`,
          "articleBody": "开彩正式开始！我们将实时更新万能、多多和大马彩的最新成绩。"
        }
      ]
    };
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://neo4d.live"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Predictions",
        "item": "https://neo4d.live/predictions"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Dream Dictionary",
        "item": "https://neo4d.live/dreams"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {liveBlogSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(liveBlogSchema) }}
        />
      )}
      <HomeClient initialResults={initialResults} initialLang={lang} />
    </>
  );
}