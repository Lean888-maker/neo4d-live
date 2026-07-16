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
        url: 'https://neo4d.live/api/og',
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
    images: ['https://neo4d.live/og-image.png'],
  }
};

export default async function Page({ params }) {
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

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What time are the live 4D results drawn in Malaysia and Singapore?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Live 4D results are drawn on Wednesdays, Saturdays, and Sundays (with Special Draws occasionally on Tuesdays) starting around 7:00 PM and concluding around 8:30 PM (Asia/Kuala_Lumpur time)."
        }
      },
      {
        "@type": "Question",
        "name": "How does NEO4D deliver results so fast without ads?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "NEO4D aggregates broadcast streams directly from official digit networks. By refusing to place display banner ads, the system remains lightweight and executes real-time updates at lightning speeds directly to users."
        }
      },
      {
        "@type": "Question",
        "name": "How does the Red Packet Fortune Shaker work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The Red Packet Fortune Shaker calculates a unique lucky pick using secure mathematical algorithms to help you generate random winning numbers for today's draws."
        }
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
      <HomeClient initialResults={initialResults} initialLang={params.lang} />
    </>
  );
}