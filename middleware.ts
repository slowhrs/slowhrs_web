import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  if (
    req.nextUrl.pathname.startsWith('/admin') &&
    req.nextUrl.pathname !== '/admin/login'
  ) {
    const cookie = req.cookies.get('slowhrs_admin');
    if (cookie?.value !== 'authenticated') {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = { matcher: '/admin/:path*' };
