import { createAdminClient } from "@/lib/supabase/admin";
import AdminApplicationsClient from "./client";

export const metadata = { title: "SLOWHRS | admin — applications" };

export default async function AdminApplicationsPage() {
  const supabase = createAdminClient();
  const { data: applications } = await supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });

  return <AdminApplicationsClient applications={applications || []} />;
}
