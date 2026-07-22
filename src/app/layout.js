export const metadata = {
  title: 'NEO4D LIVE - Live 4D Results Today (Magnum, Sports Toto, Da Ma Cai)',
  description: 'Fastest live 4D results (Keputusan 4D) in Malaysia and Singapore. Check real-time results for Magnum 4D, Sports Toto, Da Ma Cai, Singapore Pools, Sabah 88, Sandakan 4D, and Special Cashsweep. Ad-free, fast, and mobile-optimized.',
  keywords: 'live 4d results, check4d, keputusan 4d, 4d results today, magnum 4d, sports toto 4d, da ma cai 1+3d, singapore pools 4d, sabah 88, sandakan 4d, special cashsweep, neo4d, live 4d',
  alternates: {
    canonical: 'https://neo4d.live',
    languages: {
      'zh': 'https://neo4d.live/zh',
      'en': 'https://neo4d.live/en',
      'x-default': 'https://neo4d.live',
    },
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'NEO4D LIVE - Live 4D Results Today (Magnum, Sports Toto, Da Ma Cai)',
    description: 'Fastest live 4D results (Keputusan 4D) in Malaysia and Singapore. Ad-free, lightweight, and fully optimized for mobile devices.',
    url: 'https://neo4d.live',
    siteName: 'NEO4D LIVE',
    images: [
      {
        url: 'https://neo4d.live/og-premium.png',
        width: 1200,
        height: 630,
        alt: 'NEO4D LIVE - Ad-Free Live 4D Results',
      }
    ],
    type: 'website',
    locale: 'en_MY',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NEO4D LIVE - Live 4D Results Today',
    description: 'Fastest live 4D results (Keputusan 4D) in Malaysia and Singapore.',
    images: ['https://neo4d.live/og-premium.png'],
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
  },
  appleWebApp: {
    capable: true,
    title: 'NEO4D',
    statusBarStyle: 'black-translucent',
  },
  formatDetection: {
    telephone: false,
  }
}

export const viewport = {
  themeColor: '#7f1d1d',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

import Script from 'next/script';
import CaiShenChat from './CaiShenChat';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="zh-MY">
      <head>
        <Script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" strategy="beforeInteractive" />
        <Script id="onesignal-init" strategy="afterInteractive">
          {`
            window.OneSignalDeferred = window.OneSignalDeferred || [];
            OneSignalDeferred.push(async function(OneSignal) {
              await OneSignal.init({
                appId: "978d5ce1-c635-4a40-8135-442c974d40c4",
                notifyButton: {
                  enable: true,
                  position: 'bottom-right',
                },
                promptOptions: {
                  slidedown: {
                    prompts: [{
                      type: "push",
                      autoPrompt: true,
                      text: {
                        actionMessage: "Receive instant notifications when Live 4D Draws start at 7:00 PM!",
                        acceptButton: "Allow",
                        cancelButton: "Later"
                      },
                      delay: {
                        pageViews: 1,
                        timeDelay: 5
                      }
                    }]
                  }
                }
              });
            });
          `}
        </Script>
        <Script id="cache-killer" strategy="afterInteractive">
          {`
            try {
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  if (!registrations || registrations.length === 0) return;
                  var unregisteredAny = false;
                  var promises = registrations.map(function(reg) {
                    return reg.unregister().then(function(success) {
                      if (success) unregisteredAny = true;
                    }).catch(function(err) {});
                  });
                  Promise.all(promises).then(function() {
                    if (unregisteredAny) {
                      console.log('Active Service Worker detected and killed. Reloading for fresh live network files...');
                      window.location.reload();
                    }
                  }).catch(function(err) {});
                }).catch(function(err) {});
              }
              if ('caches' in window) {
                caches.keys().then(function(names) {
                  names.forEach(function(name) {
                    caches.delete(name).catch(function(err) {});
                  });
                }).catch(function(err) {});
              }
            } catch (e) {
              console.error('Cache killer error caught:', e);
            }
          `}
        </Script>
        <Script id="richads-click-tracker" strategy="afterInteractive">
          {`
            try {
              var richAdsClickId = new URL(location.href).searchParams.get("utm_ra_click_id");
              if (richAdsClickId) {
                var date = new Date();
                date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
                document.cookie = "richAdsClickId=" + (richAdsClickId || "") + "; expires=" + date.toUTCString() + "; path=/";
              }
            } catch(e) {}

            window.trackRichAdsConversion = function() {
              try {
                var clickId = ('; ' + document.cookie).split('; richAdsClickId=').pop().split(';')[0];
                if (clickId) {
                  fetch('https://us.ahows.co/log?action=conversion&key=' + clickId, { mode: 'no-cors' });
                }
              } catch(e) {}
            };
          `}
        </Script>
        <Script id="schema-org" type="application/ld+json" strategy="beforeInteractive">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "NEO4D LIVE",
              "url": "https://neo4d.live/",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://neo4d.live/{search_term_string}",
                "query-input": "required name=search_term_string"
              },
              "description": "Malaysia's Fastest Live 4D Results Today. Check Magnum, Sports Toto, and Da Ma Cai in real-time."
            }
          `}
        </Script>
      </head>
      <body className={inter.className}>
        {children}
        <CaiShenChat />
      </body>
    </html>
  )
}