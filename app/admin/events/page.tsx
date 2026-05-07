import { createAdminClient } from "@/lib/supabase/admin";
import AdminEventsClient from "./client";
import Link from "next/link";

export const metadata = { title: "SLOWHRS | admin — events" };

export default async function AdminEventsPage() {
  const supabase = createAdminClient();
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("date", { ascending: false });

  return (
    <main className="min-h-screen bg-bg pt-[52px] px-6 md:px-12">
      <div className="max-w-[1000px] mx-auto pt-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-mono text-[14px] tracking-[0.3em] text-ink uppercase">
            events
          </h1>
          <Link href="/admin" className="font-mono text-[10px] text-ink-faint hover:text-red">
            ← back
          </Link>
        </div>
        <AdminEventsClient events={events || []} />
      </div>
    </main>
  );
}
