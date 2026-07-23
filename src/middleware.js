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

  if (pathnameHasLocale) {
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    return response;
  }

  // Language negotiation: check zh FIRST — our primary audience is Malaysian Chinese.
  const acceptLanguage = request.headers.get('accept-language');
  let locale = defaultLocale;

  if (acceptLanguage) {
    if (acceptLanguage.includes('zh')) {
      locale = 'zh';
    } else if (acceptLanguage.includes('en')) {
      locale = 'en';
    }
  }

  request.nextUrl.pathname = `/${locale}${pathname}`;
  const redirectResponse = NextResponse.redirect(request.nextUrl);
  redirectResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  return redirectResponse;
}

export const config = {
  matcher: [
    // Skip all internal paths (_next), API routes, and static files
    '/((?!api|_next|.*\\..*).*)',
  ],
};
