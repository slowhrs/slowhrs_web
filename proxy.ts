import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAdminAuth } from '@/lib/admin-auth';

export async function proxy(req: NextRequest) {
  if (
    req.nextUrl.pathname.startsWith('/admin') &&
    req.nextUrl.pathname !== '/admin/login'
  ) {
    const cookie = req.cookies.get('sh_admin');
    const isValid = await verifyAdminAuth(cookie?.value);
    if (!isValid) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = { matcher: '/admin/:path*' };
