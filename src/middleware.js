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

  // Simple language negotiation or fallback to default
  const acceptLanguage = request.headers.get('accept-language');
  let locale = defaultLocale;
  
  if (acceptLanguage) {
    if (acceptLanguage.includes('en')) {
      locale = 'en';
    } else if (acceptLanguage.includes('zh')) {
      locale = 'zh';
    }
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
