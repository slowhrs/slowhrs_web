"use client";

import { useState } from "react";
import { importPartifulEvent, createEvent, deleteEvent } from "@/app/actions/admin/event";

type Event = {
  id: string;
  name: string;
  date: string;
  location: string | null;
  partiful_url: string | null;
  produced_by_slowhrs: boolean;
  is_public: boolean;
};

export default function AdminEventsClient({ events }: { events: Event[] }) {
  const [partifulUrl, setPartifulUrl] = useState("");
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState("");

  const handleImport = async () => {
    if (!partifulUrl) return;
    setImporting(true);
    setError("");
    try {
      await importPartifulEvent(partifulUrl);
      setPartifulUrl("");
      window.location.reload();
    } catch (err) {
      setError((err as Error).message);
    }
    setImporting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("delete this event?")) return;
    await deleteEvent(id);
    window.location.reload();
  };

  return (
    <>
      {/* Partiful import */}
      <div className="mb-8 flex gap-3">
        <input
          type="text"
          value={partifulUrl}
          onChange={(e) => setPartifulUrl(e.target.value)}
          placeholder="paste partiful url"
          className="flex-1 bg-transparent border-b border-border-2 py-2 font-mono text-[12px] text-ink placeholder:text-ink-faint focus:border-red focus:outline-none"
        />
        <button
          onClick={handleImport}
          disabled={importing}
          className="font-mono text-[10px] tracking-[0.2em] text-ink-dim hover:text-red uppercase disabled:opacity-40"
        >
          {importing ? "..." : "import"}
        </button>
      </div>
      {error && <p className="font-mono text-[11px] text-red mb-4">{error}</p>}

      {/* Manual add */}
      <details className="mb-8">
        <summary className="font-mono text-[10px] tracking-[0.2em] text-ink-dim uppercase cursor-pointer hover:text-red">
          + add manual event
        </summary>
        <form
          action={async (formData: FormData) => {
            await createEvent(formData);
            window.location.reload();
          }}
          className="mt-4 flex flex-col gap-3 max-w-[400px]"
        >
          <input name="name" placeholder="name" required className="bg-transparent border-b border-border-2 py-2 font-mono text-[12px] text-ink placeholder:text-ink-faint focus:border-red focus:outline-none" />
          <input name="date" type="datetime-local" required className="bg-transparent border-b border-border-2 py-2 font-mono text-[12px] text-ink focus:border-red focus:outline-none" />
          <input name="location" placeholder="location" className="bg-transparent border-b border-border-2 py-2 font-mono text-[12px] text-ink placeholder:text-ink-faint focus:border-red focus:outline-none" />
          <input name="blurb" placeholder="blurb" className="bg-transparent border-b border-border-2 py-2 font-mono text-[12px] text-ink placeholder:text-ink-faint focus:border-red focus:outline-none" />
          <input name="cover_video" placeholder="cover video path" className="bg-transparent border-b border-border-2 py-2 font-mono text-[12px] text-ink placeholder:text-ink-faint focus:border-red focus:outline-none" />
          <input name="partiful_url" placeholder="partiful url (optional)" className="bg-transparent border-b border-border-2 py-2 font-mono text-[12px] text-ink placeholder:text-ink-faint focus:border-red focus:outline-none" />
          <label className="flex items-center gap-2 font-mono text-[10px] text-ink-dim">
            <input type="checkbox" name="produced_by_slowhrs" value="true" defaultChecked />
            produced by slowhrs
          </label>
          <button type="submit" className="font-mono text-[10px] tracking-[0.2em] text-ink-dim hover:text-red uppercase self-start mt-2">
            create
          </button>
        </form>
      </details>

      {/* Events table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border">
              {["name", "date", "location", "partiful", "ours", ""].map((h) => (
                <th key={h} className="font-mono text-[9px] tracking-[0.2em] text-ink-faint uppercase py-3 pr-4">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {events.map((ev) => (
              <tr key={ev.id} className="border-b border-border/50">
                <td className="py-3 pr-4 font-mono text-[11px] text-ink">{ev.name}</td>
                <td className="py-3 pr-4 font-mono text-[11px] text-ink-dim">
                  {new Date(ev.date).toLocaleDateString()}
                </td>
                <td className="py-3 pr-4 font-mono text-[11px] text-ink-dim">
                  {ev.location || "—"}
                </td>
                <td className="py-3 pr-4 font-mono text-[10px] text-ink-faint">
                  {ev.partiful_url ? "yes" : "—"}
                </td>
                <td className="py-3 pr-4 font-mono text-[10px] text-ink-faint">
                  {ev.produced_by_slowhrs ? "yes" : "no"}
                </td>
                <td className="py-3">
                  <button
                    onClick={() => handleDelete(ev.id)}
                    className="font-mono text-[10px] text-ink-faint hover:text-red"
                  >
                    delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
