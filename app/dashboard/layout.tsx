import { requireMember } from '@/lib/auth/member';
import { signOut } from '@/app/actions/signOut';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const member = await requireMember();

  return (
    <div className="min-h-screen bg-bg text-ink">
      <header className="border-b border-border-2 px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-6">
          <div className="flex items-baseline gap-5">
            <h1 className="font-serif text-2xl italic lowercase">the room.</h1>
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
