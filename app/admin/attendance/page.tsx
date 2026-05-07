import { createAdminClient } from "@/lib/supabase/admin";
import AdminAttendanceClient from "./client";
import Link from "next/link";

export const dynamic = 'force-dynamic';
export const metadata = { title: "SLOWHRS | admin — attendance" };

export default async function AdminAttendancePage() {
  const supabase = createAdminClient();

  const { data: events } = await supabase
    .from("events")
    .select("id, name, date")
    .order("date", { ascending: false });

  const { data: members } = await supabase
    .from("members")
    .select("user_id, full_name, member_number")
    .order("member_number", { ascending: true });

  const { data: attendances } = await supabase
    .from("attendances")
    .select("member_id, event_id");

  return (
    <main className="min-h-screen bg-bg pt-[52px] px-6 md:px-12">
      <div className="max-w-[1000px] mx-auto pt-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-mono text-[14px] tracking-[0.3em] text-ink uppercase">
            attendance
          </h1>
          <Link href="/admin" className="font-mono text-[10px] text-ink-faint hover:text-red">
            ← back
          </Link>
        </div>
        <AdminAttendanceClient
          events={events || []}
          members={members || []}
          attendances={attendances || []}
        />
      </div>
    </main>
  );
}
