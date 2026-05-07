"use client";

import { useState } from "react";
import { approveApplication, denyApplication } from "@/app/actions/admin/approve";
import Link from "next/link";

type Application = {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  instagram: string | null;
  what_you_do: string | null;
  why_apply: string | null;
  status: string;
};

export default function AdminApplicationsClient({
  applications,
}: {
  applications: Application[];
}) {
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState<string | null>(null);

  const filtered =
    filter === "all"
      ? applications
      : applications.filter((a) => a.status === filter);

  const handleApprove = async (id: string) => {
    setLoading(id);
    try {
      await approveApplication(id);
      window.location.reload();
    } catch (err) {
      alert("Error approving: " + (err as Error).message);
    }
    setLoading(null);
  };

  const handleDeny = async (id: string) => {
    setLoading(id);
    try {
      await denyApplication(id);
      window.location.reload();
    } catch (err) {
      alert("Error denying: " + (err as Error).message);
    }
    setLoading(null);
  };

  return (
    <main className="min-h-screen bg-bg pt-[52px] px-6 md:px-12">
      <div className="max-w-[1000px] mx-auto pt-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-mono text-[14px] tracking-[0.3em] text-ink uppercase">
            applications
          </h1>
          <Link
            href="/admin"
            className="font-mono text-[10px] text-ink-faint hover:text-red"
          >
            ← back
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-8">
          {["all", "pending", "approved", "denied"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`font-mono text-[10px] tracking-[0.2em] uppercase transition-colors ${
                filter === f ? "text-red" : "text-ink-dim hover:text-ink"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border">
                {["name", "email", "ig", "does", "status", "actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className="font-mono text-[9px] tracking-[0.2em] text-ink-faint uppercase py-3 pr-4"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((app) => (
                <tr key={app.id} className="border-b border-border/50">
                  <td className="py-3 pr-4 font-mono text-[11px] text-ink">
                    {app.full_name}
                  </td>
                  <td className="py-3 pr-4 font-mono text-[11px] text-ink-dim">
                    {app.email}
                  </td>
                  <td className="py-3 pr-4 font-mono text-[11px] text-ink-dim">
                    {app.instagram || "—"}
                  </td>
                  <td className="py-3 pr-4 font-mono text-[11px] text-ink-dim max-w-[200px] truncate">
                    {app.what_you_do || "—"}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`font-mono text-[10px] tracking-[0.15em] uppercase ${
                        app.status === "approved"
                          ? "text-green-500"
                          : app.status === "denied"
                          ? "text-red"
                          : "text-ink-dim"
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="py-3">
                    {app.status === "pending" && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleApprove(app.id)}
                          disabled={loading === app.id}
                          className="font-mono text-[10px] text-green-500 hover:text-green-400 disabled:opacity-40"
                        >
                          approve
                        </button>
                        <button
                          onClick={() => handleDeny(app.id)}
                          disabled={loading === app.id}
                          className="font-mono text-[10px] text-red hover:text-red-bright disabled:opacity-40"
                        >
                          deny
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <p className="font-mono text-[11px] text-ink-faint mt-8">
            no applications.
          </p>
        )}
      </div>
    </main>
  );
}
