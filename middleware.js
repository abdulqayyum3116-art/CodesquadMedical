import { NextResponse } from 'next/server';
import { DASH_COOKIE, isValidToken } from './lib/dashboard-auth';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  // Only guard the dashboard, but always allow the login page itself.
  if (!pathname.startsWith('/dashboard')) return NextResponse.next();
  if (pathname === '/dashboard/login') return NextResponse.next();

  const token = request.cookies.get(DASH_COOKIE)?.value;
  if (isValidToken(token)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = '/dashboard/login';
  url.searchParams.set('next', pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/dashboard', '/dashboard/:path*'],
};
