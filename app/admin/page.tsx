import Link from "next/link";

export const metadata = { title: "SLOWHRS | admin" };

const TABS = [
  { label: "applications", href: "/admin/applications" },
  { label: "members", href: "/admin/members" },
  { label: "events", href: "/admin/events" },
  { label: "attendance", href: "/admin/attendance" },
  { label: "broadcasts", href: "/admin/broadcasts" },
  { label: "inquiries", href: "/admin/inquiries" },
];

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-bg pt-[52px] px-6 md:px-12">
      <div className="max-w-[800px] mx-auto pt-16">
        <h1 className="font-mono text-[14px] tracking-[0.3em] text-ink uppercase mb-12">
          admin
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {TABS.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className="border border-border-2 p-6 font-mono text-[11px] tracking-[0.2em] text-ink-dim uppercase hover:border-red hover:text-red transition-colors"
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
