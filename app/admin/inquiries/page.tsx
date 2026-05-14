import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";

export const dynamic = 'force-dynamic';
export const metadata = { title: "SLOWHRS | admin // inquiries" };

export default async function AdminInquiriesPage() {
  const supabase = createAdminClient();
  const { data: inquiries } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-bg pt-[52px] px-6 md:px-12">
      <div className="max-w-[1000px] mx-auto pt-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-mono text-[14px] tracking-[0.3em] text-ink uppercase">
            inquiries
          </h1>
          <Link href="/admin" className="font-mono text-[10px] text-ink-faint hover:text-red">
            ← back
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border">
                {["date", "category", "name", "email", "ig", "status", "details"].map((h) => (
                  <th key={h} className="font-mono text-[9px] tracking-[0.2em] text-ink-faint uppercase py-3 pr-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(inquiries || []).map((inq: { id: string; created_at: string; category: string; name: string; email: string; instagram: string | null; status: string; details: string | null }) => (
                <tr key={inq.id} className="border-b border-border/50">
                  <td className="py-3 pr-4 font-mono text-[11px] text-ink-faint">
                    {new Date(inq.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 pr-4 font-mono text-[10px] text-red uppercase tracking-[0.15em]">
                    {inq.category}
                  </td>
                  <td className="py-3 pr-4 font-mono text-[11px] text-ink">{inq.name}</td>
                  <td className="py-3 pr-4 font-mono text-[11px] text-ink-dim">{inq.email}</td>
                  <td className="py-3 pr-4 font-mono text-[11px] text-ink-dim">
                    {inq.instagram || ""}
                  </td>
                  <td className="py-3 pr-4 font-mono text-[10px] text-ink-dim">{inq.status}</td>
                  <td className="py-3 pr-4 font-mono text-[10px] text-ink-dim max-w-[200px] truncate">
                    {inq.details || ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {(!inquiries || inquiries.length === 0) && (
          <p className="font-mono text-[11px] text-ink-faint mt-8">no inquiries yet.</p>
        )}
      </div>
    </main>
  );
}
