import { NextResponse } from 'next/server';

const locales = ['zh', 'en'];
const defaultLocale = 'zh';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Exclude internal Next.js routes, API routes, the embeddable widget, promotional pages, and static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/widget') ||
    pathname.startsWith('/promo') ||
    pathname.startsWith('/telegram-vip') ||
    pathname.startsWith('/telegram-game') ||
    pathname.startsWith('/telegram-supervip') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico' ||
    pathname === '/manifest.json' ||
    pathname === '/robots.txt'
  ) {
    return;
  }

  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Language negotiation: check zh FIRST — our primary audience is Malaysian Chinese.
  // A Malaysian Chinese browser typically sends: zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7
  // If we checked 'en' first they'd land on English, which is wrong.
  if (acceptLanguage) {
    if (acceptLanguage.includes('zh')) {
      locale = 'zh';
    } else if (acceptLanguage.includes('en')) {
      locale = 'en';
    }
    // Anything else (ms, ta, etc.) falls back to zh (Chinese default)
  }

  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next).*)',
  ],
};
