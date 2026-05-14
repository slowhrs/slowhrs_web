import { createAdminClient } from "@/lib/supabase/admin";
import { getTier } from "@/lib/membership";
import { toggleContributor, toggleArchitect } from "@/app/actions/admin/contributor";
import Link from "next/link";

export const dynamic = 'force-dynamic';
export const metadata = { title: "SLOWHRS | admin // members" };

export default async function AdminMembersPage() {
  const supabase = createAdminClient();
  const { data: members } = await supabase
    .from("members")
    .select("*")
    .order("member_number", { ascending: true });

  // Fetch emails from auth for each member
  const membersWithEmails = await Promise.all(
    (members || []).map(async (m: { user_id: string; member_number: number; full_name: string; instagram: string | null; hearts: number; is_contributor: boolean; is_architect: boolean }) => {
      const { data } = await supabase.auth.admin.getUserById(m.user_id);
      return { ...m, email: data?.user?.email || '—' };
    })
  );

  return (
    <main className="min-h-screen bg-bg pt-[52px] px-6 md:px-12">
      <div className="max-w-[1100px] mx-auto pt-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-mono text-[14px] tracking-[0.3em] text-ink uppercase">
              members
            </h1>
            <p className="font-mono text-[10px] text-ink-faint mt-1">
              {membersWithEmails.length} total
            </p>
          </div>
          <Link href="/admin" className="font-mono text-[10px] text-ink-faint hover:text-red">
            ← back
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border">
                {["#", "name", "email", "ig", "hearts", "tier", "contributor", "architect"].map((h) => (
                  <th key={h} className="font-mono text-[9px] tracking-[0.2em] text-ink-faint uppercase py-3 pr-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {membersWithEmails.map((m) => {
                const tier = getTier(m);
                return (
                  <tr key={m.user_id} className="border-b border-border/50 hover:bg-white/[0.02]">
                    <td className="py-3 pr-4 font-mono text-[11px] text-ink-faint">
                      {m.member_number}
                    </td>
                    <td className="py-3 pr-4 font-mono text-[11px] text-ink">
                      {m.full_name}
                    </td>
                    <td className="py-3 pr-4 font-mono text-[10px] text-ink-dim">
                      <button
                        onClick={undefined}
                        className="hover:text-red transition-colors cursor-text select-all"
                        title="click to select"
                      >
                        {m.email}
                      </button>
                    </td>
                    <td className="py-3 pr-4 font-mono text-[11px] text-ink-dim">
                      {m.instagram ? (
                        <a
                          href={`https://instagram.com/${m.instagram.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-red transition-colors"
                        >
                          @{m.instagram.replace('@', '')}
                        </a>
                      ) : '—'}
                    </td>
                    <td className="py-3 pr-4 font-mono text-[11px] text-ink-dim">
                      {m.hearts}
                    </td>
                    <td className="py-3 pr-4 font-mono text-[10px] text-ink-dim">
                      {tier.display}
                    </td>
                    <td className="py-3 pr-4">
                      <form action={async () => {
                        "use server";
                        await toggleContributor(m.user_id, !m.is_contributor);
                      }}>
                        <button type="submit" className={`font-mono text-[10px] ${m.is_contributor ? "text-green-500" : "text-ink-faint"} hover:text-red`}>
                          {m.is_contributor ? "yes" : "no"}
                        </button>
                      </form>
                    </td>
                    <td className="py-3 pr-4">
                      <form action={async () => {
                        "use server";
                        await toggleArchitect(m.user_id, !m.is_architect);
                      }}>
                        <button type="submit" className={`font-mono text-[10px] ${m.is_architect ? "text-gold" : "text-ink-faint"} hover:text-red`}>
                          {m.is_architect ? "yes" : "no"}
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {membersWithEmails.length === 0 && (
          <p className="font-mono text-[11px] text-ink-faint mt-8">no members yet.</p>
        )}
      </div>
    </main>
  );
}
