"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      const data = await res.json();
      setError(data.error || "wrong password.");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-bg flex items-center justify-center px-6">
      <div className="max-w-[320px] w-full">
        <h1 className="font-mono text-[12px] tracking-[0.3em] text-ink-dim uppercase mb-8">
          admin
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            className="bg-transparent border-b border-border-2 py-3 font-mono text-[13px] text-ink placeholder:text-ink-faint focus:border-red focus:outline-none"
            autoFocus
          />
          {error && (
            <p className="font-mono text-[11px] text-red">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="font-mono text-[11px] tracking-[0.2em] uppercase text-ink-dim hover:text-red transition-colors self-start mt-2 disabled:opacity-40"
          >
            {loading ? "..." : "enter"}
          </button>
        </form>
      </div>
    </main>
  );
}
