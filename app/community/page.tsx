import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getTier } from '@/lib/membership';
import ChatRoom from './ChatRoom';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'SLOWHRS | community',
  description: 'members-only community chat.',
};

const CHANNELS = [
  { id: 'general', label: 'general', minTier: 1, description: 'open to all members' },
  { id: 'the-room', label: 'the room', minTier: 2, description: 'tier 2+' },
  { id: 'inner-room', label: 'inner room', minTier: 4, description: 'tier 4+' },
  { id: 'architects', label: 'architects', minTier: 5, description: 'architects only' },
];

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ channel?: string }>;
}) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/membership');
  }

  const admin = createAdminClient();
  const { data: member } = await admin
    .from('members')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (!member) {
    redirect('/membership');
  }

  const tier = getTier(member);
  const params = await searchParams;
  const activeChannel = params.channel || 'general';

  // Check if admin
  const isAdmin = member.is_architect;

  return (
    <main className="min-h-screen bg-bg pt-[52px]">
      <div className="max-w-[900px] mx-auto px-5 md:px-12 pt-12 md:pt-20 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-mono text-[12px] tracking-[0.3em] text-ink uppercase">
              community
            </h1>
            <p className="font-mono text-[9px] tracking-[0.15em] text-ink-faint uppercase mt-1">
              {tier.display} · live
            </p>
          </div>
          <Link
            href="/membership/dashboard"
            className="font-mono text-[10px] text-ink-faint hover:text-red transition-colors"
          >
            ← dashboard
          </Link>
        </div>

        {/* Channel Tabs */}
        <div className="flex gap-1 border-b border-brand-border mb-0 overflow-x-auto">
          {CHANNELS.map((ch) => {
            const hasAccess = tier.number >= ch.minTier;
            const isActive = activeChannel === ch.id;

            if (!hasAccess) {
              return (
                <div
                  key={ch.id}
                  className="relative flex items-center gap-1.5 px-4 py-3 font-mono text-[10px] tracking-[0.15em] uppercase text-ink-faint/40 cursor-not-allowed select-none shrink-0"
                  title={`requires ${ch.description}`}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-50">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  {ch.label}
                </div>
              );
            }

            return (
              <Link
                key={ch.id}
                href={`/community?channel=${ch.id}`}
                className={`px-4 py-3 font-mono text-[10px] tracking-[0.15em] uppercase transition-colors shrink-0 border-b-2 ${
                  isActive
                    ? 'text-brand-red border-brand-red'
                    : 'text-ink-dim border-transparent hover:text-ink hover:border-ink-faint/30'
                }`}
              >
                {ch.label}
              </Link>
            );
          })}
        </div>

        {/* Chat Room */}
        {tier.number >= (CHANNELS.find((c) => c.id === activeChannel)?.minTier || 1) ? (
          <ChatRoom
            userId={user.id}
            memberName={member.full_name}
            instagram={member.instagram}
            channel={activeChannel}
            isAdmin={isAdmin}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-faint)" strokeWidth="1.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <p className="font-mono text-[11px] text-ink-faint text-center">
              this channel requires a higher tier.
            </p>
            <p className="font-mono text-[9px] text-ink-faint/60 text-center">
              attend more events to level up.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
