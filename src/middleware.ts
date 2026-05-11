import { NextRequest, NextResponse } from 'next/server';
import acceptLanguage from 'accept-language';
import { SUPPORTED_LANGS, DEFAULT_LANG, type LangType } from '@/types/lang';

const COOKIE_NAME = 'i18next';

acceptLanguage.languages([...SUPPORTED_LANGS]);

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip API routes, static files, and swagger
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/swagger') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const hasLangPrefix = SUPPORTED_LANGS.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );

  if (!hasLangPrefix) {
    const cookieLang = req.cookies.get(COOKIE_NAME)?.value as LangType | undefined;
    const headerLang = acceptLanguage.get(req.headers.get('Accept-Language')) as LangType | null;
    const lang = SUPPORTED_LANGS.includes(cookieLang!) ? cookieLang! : (headerLang ?? DEFAULT_LANG);

    return NextResponse.redirect(
      new URL(`/${lang}${pathname}${req.nextUrl.search}`, req.url)
    );
  }

  // Sync cookie with URL language
  const urlLang = SUPPORTED_LANGS.find(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  if (urlLang && req.cookies.get(COOKIE_NAME)?.value !== urlLang) {
    const res = NextResponse.next();
    res.cookies.set(COOKIE_NAME, urlLang, { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' });
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|swagger\\.html).*)'],
};
