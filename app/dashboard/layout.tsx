import { requireMember } from '@/lib/auth/member';
import { signOut } from '@/app/actions/signOut';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const member = await requireMember();

  return (
    <div className="min-h-screen bg-bg text-ink">
      <header className="border-b border-border-2 px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-6">
          <div className="flex items-baseline gap-5">
            <Link href="/" className="font-serif text-2xl italic lowercase transition-colors hover:text-red">
              the room.
            </Link>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-red">
              {member.member_id}
            </p>
          </div>
          <form action={signOut}>
            <button className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-dim transition-colors hover:text-red">
              sign out →
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}
