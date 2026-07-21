import { fetch4dData } from '../utils/fetch4d';
import HomeClient from '../HomeClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const isZh = lang === 'zh';

  return {
    title: 'NEO4D LIVE | 实时4D开彩结果 Magnum, Sports Toto, Da Ma Cai, Singapore Pools',
    description: isZh
      ? '全马最快、无广告的4D开彩结果网站。提供 Magnum万能、Sports Toto多多、Da Ma Cai大马彩、新加坡博彩等实时开彩数据与大伯公梦境解析吉数。'
      : 'Malaysia fastest ad-free live 4D results. Real-time Magnum 4D, Sports Toto, Da Ma Cai, Singapore Pools draw results with dream number analysis.',
    keywords: 'keputusan 4d, live 4d results, check4d, 4d results today, magnum 4d, sports toto, da ma cai, singapore pools, sandakan 4d, special cashsweep, sabah 88, neo4d, 大伯公千字图',
    alternates: {
      // Each language page declares its OWN canonical — never the redirecting root
      canonical: `https://neo4d.live/${lang}`,
      languages: {
        'zh': 'https://neo4d.live/zh',
        'en': 'https://neo4d.live/en',
        'x-default': 'https://neo4d.live/zh',
      },
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
      url: `https://neo4d.live/${lang}`,
      siteName: 'NEO4D LIVE',
      images: [{ url: 'https://neo4d.live/og-premium.png', width: 1200, height: 630, alt: 'NEO4D LIVE - 无广告实时4D开彩' }],
      type: 'website',
      locale: isZh ? 'zh_CN' : 'en_MY',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'NEO4D LIVE | 实时4D开彩结果',
      description: '全马最快、无广告的4D实时开彩数据中心。提供即时开彩通知与大伯公梦境解析。',
      images: ['https://neo4d.live/og-premium.png'],
    },
  };
}


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
    const fs = require('fs'); // fallback if needed or import at top
    // Wait, let's just use dynamic import or require since next.js dev handles it, but fs is safer:
    const fsModule = await import('fs');
    const pathModule = await import('path');
    const faqPath = pathModule.join(process.cwd(), 'src/app/data/faq_schema.json');
    faqData = JSON.parse(fsModule.readFileSync(faqPath, 'utf8'));
  } catch (e) {
    console.error("Failed to load dynamic FAQ schema using fs, attempting standard import:", e.message);
    try {
      // Direct import fallback
      const data = await import('../data/faq_schema.json', { assert: { type: 'json' } });
      faqData = data.default || data;
    } catch (importErr) {
      console.error("All FAQ schema load attempts failed:", importErr.message);
    }
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

  // Elite SEO Strategy: LiveBlogPosting schema - ALWAYS rendered so Google always finds all Event fields
  // EventScheduled on draw days (Wed/Sat/Sun + Special Tue), EventPostponed on off-days
  const today = new Date();
  const mytDay = today.getUTCDay(); // 0=Sun, 3=Wed, 6=Sat
  const isDrawDay = [0, 2, 3, 6].includes(mytDay);
  const drawDateStr = today.toISOString().split('T')[0];

  const liveBlogSchema = {
    "@context": "https://schema.org",
    "@type": "LiveBlogPosting",
    "headline": "马来西亚4D开彩直播 - 最新万能、多多、大马彩成绩",
    "description": "实时更新今天的马来西亚4D开彩成绩。包括 Magnum 4D, Sports Toto, Da Ma Cai。",
    "about": {
      "@type": "Event",
      "name": "Malaysia 4D Draw - Magnum, Sports Toto, Da Ma Cai",
      "description": "Live 4D draw results for Malaysia's major lottery operators: Magnum 4D, Sports Toto, Da Ma Cai, Singapore Pools, Sabah 88, Sandakan 4D, and Special CashSweep.",
      "startDate": `${drawDateStr}T19:00:00+08:00`,
      "endDate": `${drawDateStr}T20:30:00+08:00`,
      "eventStatus": isDrawDay
        ? "https://schema.org/EventScheduled"
        : "https://schema.org/EventPostponed",
      "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
      "image": "https://neo4d.live/og-premium.png",
      "url": "https://neo4d.live",
      "organizer": {
        "@type": "Organization",
        "name": "NEO4D LIVE",
        "url": "https://neo4d.live"
      },
      "location": {
        "@type": "VirtualLocation",
        "url": "https://neo4d.live"
      },
      "offers": {
        "@type": "Offer",
        "name": "Free Live 4D Results",
        "price": "0",
        "priceCurrency": "MYR",
        "availability": "https://schema.org/InStock",
        "url": "https://neo4d.live"
      }
    },
    "coverageStartTime": `${drawDateStr}T19:00:00+08:00`,
    "coverageEndTime": `${drawDateStr}T20:30:00+08:00`,
    "liveBlogUpdate": [
      {
        "@type": "BlogPosting",
        "headline": "4D Draw Commences",
        "datePublished": `${drawDateStr}T19:00:00+08:00`,
        "articleBody": "开彩正式开始！我们将实时更新万能、多多和大马彩的最新成绩。"
      }
    ]
  };

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