export const metadata = {
  title: 'NEO4D LIVE - Live 4D Results Today (Magnum, Sports Toto, Da Ma Cai)',
  description: 'Fastest live 4D results (Keputusan 4D) in Malaysia and Singapore. Check real-time results for Magnum 4D, Sports Toto, Da Ma Cai, Singapore Pools, Sabah 88, Sandakan 4D, and Special Cashsweep. Ad-free, fast, and mobile-optimized.',
  keywords: 'live 4d results, check4d, keputusan 4d, 4d results today, magnum 4d, sports toto 4d, da ma cai 1+3d, singapore pools 4d, sabah 88, sandakan 4d, special cashsweep, neo4d, live 4d',
  alternates: {
    canonical: 'https://neo4d.live',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'NEO4D LIVE - Live 4D Results Today (Magnum, Sports Toto, Da Ma Cai)',
    description: 'Fastest live 4D results (Keputusan 4D) in Malaysia and Singapore. Ad-free, lightweight, and fully optimized for mobile devices.',
    url: 'https://neo4d.live',
    siteName: 'NEO4D LIVE',
    images: [
      {
        url: 'https://neo4d.live/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NEO4D LIVE - Ad-Free Live 4D Results',
      }
    ],
    type: 'website',
    locale: 'en_MY',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'b4QjddVCf67G-frXKSLfZj7NlNJKO5rJEVpkurOhlYQ',
    other: {
      'msvalidate.01': '9CE1B0F2F43E22E0706B879AE521A68A',
    },
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-MY">
      <body>{children}</body>
    </html>
  )
}