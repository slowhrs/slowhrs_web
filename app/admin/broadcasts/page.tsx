import { createAdminClient } from "@/lib/supabase/admin";
import AdminBroadcastClient from "./client";
import Link from "next/link";

export const metadata = { title: "SLOWHRS | admin — broadcasts" };

export default async function AdminBroadcastsPage() {
  const supabase = createAdminClient();
  const { data: broadcasts } = await supabase
    .from("broadcasts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-bg pt-[52px] px-6 md:px-12">
      <div className="max-w-[800px] mx-auto pt-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-mono text-[14px] tracking-[0.3em] text-ink uppercase">
            broadcasts
          </h1>
          <Link href="/admin" className="font-mono text-[10px] text-ink-faint hover:text-red">
            ← back
          </Link>
        </div>
        <AdminBroadcastClient broadcasts={broadcasts || []} />
      </div>
    </main>
  );
}
