import { createServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

function safeNextPath(value: string | null): string {
  if (!value) return '/dashboard';
  if (!value.startsWith('/') || value.startsWith('//')) return '/dashboard';

  try {
    const url = new URL(value, 'https://slowhrs.com');
    const path = `${url.pathname}${url.search}${url.hash}`;
    if (url.pathname === '/' || url.pathname === '/events') return path;
    if (url.pathname === '/dashboard' || url.pathname.startsWith('/dashboard/')) return path;
  } catch {
    return '/dashboard';
  }

  return '/dashboard';
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = safeNextPath(searchParams.get('next'));

  if (code) {
    const supabase = await createServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.error('[auth/callback] exchange failed:', error);
  }

  return NextResponse.redirect(`${origin}/sign-in?stale=1`);
}
