import { createAdminClient } from "@/lib/supabase/admin";
import { updateMemberAdminFieldsForm } from "@/app/actions/admin/member";
import Link from "next/link";

export const dynamic = 'force-dynamic';
export const metadata = { title: "SLOWHRS | admin // members" };

const TIERS = [
  { value: "tier_02", label: "tier 02 // the room" },
  { value: "tier_03", label: "tier 03 // the regular" },
  { value: "tier_04", label: "tier 04 // inner room" },
  { value: "tier_05", label: "tier 05 // architects" },
] as const;

export default async function AdminMembersPage() {
  const supabase = createAdminClient();
  const { data: members } = await supabase
    .from("applications")
    .select("id, created_at, email, full_name, instagram, member_id, status, events_attended")
    .in("status", ["tier_02", "tier_03", "tier_04", "tier_05"])
    .order("reviewed_at", { ascending: false, nullsFirst: false });

  const approvedMembers = members || [];

  return (
    <main className="min-h-screen bg-bg pt-[52px] px-6 md:px-12">
      <div className="max-w-[1100px] mx-auto pt-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-mono text-[14px] tracking-[0.3em] text-ink uppercase">
              members
            </h1>
            <p className="font-mono text-[10px] text-ink-faint mt-1">
              {approvedMembers.length} approved
            </p>
          </div>
          <Link href="/admin" className="font-mono text-[10px] text-ink-faint hover:text-red">
            ← back
          </Link>
        </div>

        <div className="mb-6 border border-border bg-black/35 p-4">
          <p className="max-w-[78ch] font-mono text-[9px] uppercase leading-[1.7] tracking-[0.15em] text-ink-dim">
            This table controls what members see after login. Set how many events they went to, choose the tier, then save the row.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border">
                {["id", "name", "email", "ig", "events went", "tier", "save"].map((h) => (
                  <th key={h} className="font-mono text-[9px] tracking-[0.2em] text-ink-faint uppercase py-3 pr-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {approvedMembers.map((m) => (
                <tr key={m.id} className="border-b border-border/50 hover:bg-white/[0.02]">
                  <td className="py-3 pr-4 font-mono text-[11px] text-ink-faint">
                    {m.member_id}
                  </td>
                  <td className="py-3 pr-4 font-mono text-[11px] text-ink">
                    {m.full_name}
                  </td>
                  <td className="py-3 pr-4 font-mono text-[10px] text-ink-dim">
                    {m.email}
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
                  <td className="py-3 pr-4">
                    <input
                      form={`member-${m.id}`}
                      name="events_attended"
                      type="number"
                      min="0"
                      defaultValue={m.events_attended ?? 0}
                      className="w-20 border border-border bg-black px-3 py-2 font-mono text-[11px] text-ink outline-none focus:border-red"
                    />
                  </td>
                  <td className="py-3 pr-4">
                    <select
                      form={`member-${m.id}`}
                      name="status"
                      defaultValue={m.status}
                      className="border border-border bg-black px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-ink outline-none focus:border-red"
                    >
                      {TIERS.map((tier) => (
                        <option key={tier.value} value={tier.value}>
                          {tier.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 pr-4">
                    <form action={updateMemberAdminFieldsForm} id={`member-${m.id}`}>
                      <input type="hidden" name="id" value={m.id} />
                      <button
                        type="submit"
                        className="brand-action border border-red/45 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.2em] text-red hover:bg-red hover:text-bg"
                      >
                        save
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {approvedMembers.length === 0 && (
          <p className="font-mono text-[11px] text-ink-faint mt-8">no members yet.</p>
        )}
      </div>
    </main>
  );
}
