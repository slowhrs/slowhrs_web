import { adminLogout } from "@/app/actions/admin";
import { verifyAdminAuth } from "@/lib/admin-auth";
import { redirect } from "next/navigation";

export default async function AdminAuthedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthed = await verifyAdminAuth();

  if (!isAuthed) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-bg text-ink">
      <header className="fixed left-0 right-0 top-0 z-40 border-b border-border bg-bg/90 backdrop-blur-md">
        <div className="mx-auto flex h-[52px] max-w-[1200px] items-center justify-between px-6 md:px-12">
          <div className="flex items-baseline gap-3">
            <span className="font-serif text-[24px] italic leading-none text-ink">
              listkeeper.
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-red">
              private
            </span>
          </div>
          <form action={adminLogout}>
            <button
              type="submit"
              className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faint transition-colors hover:text-red"
            >
              sign out
            </button>
          </form>
        </div>
      </header>
      {children}
    </div>
  );
}
