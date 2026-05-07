"use client";

import { useState } from "react";
import { composeBroadcast } from "@/app/actions/admin/broadcast";

type Broadcast = {
  id: string;
  subject: string;
  body: string;
  recipient_tier: string;
  sent_at: string | null;
  sent_count: number | null;
};

export default function AdminBroadcastClient({
  broadcasts,
}: {
  broadcasts: Broadcast[];
}) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleSend = async (formData: FormData) => {
    setLoading(true);
    setResult("");
    try {
      const res = await composeBroadcast(formData);
      setResult(`sent to ${res.sentCount} members.`);
      window.location.reload();
    } catch (err) {
      setResult(`error: ${(err as Error).message}`);
    }
    setLoading(false);
  };

  return (
    <>
      {/* Compose */}
      <form action={handleSend} className="flex flex-col gap-4 mb-12 max-w-[500px]">
        <select
          name="recipient_tier"
          className="bg-bg border border-border-2 py-2 px-4 font-mono text-[12px] text-ink focus:border-red focus:outline-none"
          defaultValue="all"
        >
          <option value="all">all members</option>
          <option value="room+">the room +</option>
          <option value="regular+">the regular +</option>
          <option value="inner+">the inner room +</option>
          <option value="architects">the architects</option>
        </select>
        <input
          name="subject"
          placeholder="subject"
          required
          className="bg-transparent border-b border-border-2 py-2 font-mono text-[12px] text-ink placeholder:text-ink-faint focus:border-red focus:outline-none"
        />
        <textarea
          name="body"
          placeholder="message body"
          required
          rows={6}
          className="bg-transparent border-b border-border-2 py-2 font-mono text-[12px] text-ink placeholder:text-ink-faint focus:border-red focus:outline-none resize-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="font-mono text-[10px] tracking-[0.2em] text-ink-dim hover:text-red uppercase self-start mt-2 disabled:opacity-40"
        >
          {loading ? "sending..." : "send broadcast"}
        </button>
        {result && (
          <p className="font-mono text-[11px] text-ink-dim mt-2">{result}</p>
        )}
      </form>

      {/* History */}
      <h2 className="font-mono text-[10px] tracking-[0.3em] text-ink-faint uppercase mb-4">
        sent broadcasts
      </h2>
      <div className="flex flex-col gap-4">
        {broadcasts.map((b) => (
          <div key={b.id} className="border-b border-border/50 pb-4">
            <div className="flex justify-between items-baseline">
              <p className="font-mono text-[11px] text-ink">{b.subject}</p>
              <span className="font-mono text-[9px] text-ink-faint">
                {b.sent_at ? new Date(b.sent_at).toLocaleDateString() : "draft"} ·{" "}
                {b.sent_count ?? 0} sent · {b.recipient_tier}
              </span>
            </div>
            <p className="font-mono text-[10px] text-ink-dim mt-1 line-clamp-2">
              {b.body}
            </p>
          </div>
        ))}
        {broadcasts.length === 0 && (
          <p className="font-mono text-[11px] text-ink-faint">no broadcasts yet.</p>
        )}
      </div>
    </>
  );
}
