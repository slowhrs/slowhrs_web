"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { verifyMemberOtp } from "@/app/actions/verifyOtp";

type CodeFormProps = {
  initialEmail: string;
  nextPath: string;
};

type FormStatus = "idle" | "submitting" | "error";

export default function CodeForm({ initialEmail, nextPath }: CodeFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return;

    setStatus("submitting");
    setMessage(null);

    const form = event.currentTarget;
    const result = await verifyMemberOtp(new FormData(form));
    if (result.ok) {
      router.replace(result.next);
      router.refresh();
      return;
    }

    setStatus("error");
    setMessage(result.error || "try again.");
  };

  return (
    <main className="min-h-screen bg-bg px-5 pt-[52px] text-ink">
      <section className="mx-auto flex min-h-[calc(100vh-52px)] max-w-[560px] items-center py-16">
        <div className="relative w-full overflow-hidden border border-border bg-[#050505] p-6 md:p-9">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(230,0,22,0.22),transparent_28%)] opacity-25" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red/70 to-transparent" />
          <div className="relative z-10">
            <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-red">
              members only
            </p>
            <h1 className="mt-5 font-serif text-[3.5rem] italic leading-none text-ink">
              enter the code.
            </h1>
            <p className="mt-5 max-w-[34ch] font-mono text-[10px] uppercase leading-[1.8] tracking-[0.14em] text-ink-dim">
              paste the 6-digit code from your slowhrs email. same inbox, same approval. no password.
            </p>

            <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-7">
              <input
                name="email"
                type="email"
                required
                defaultValue={initialEmail}
                placeholder="email"
                className="border-b border-border-2 bg-transparent py-3 font-mono text-[14px] text-ink placeholder:text-ink-faint focus:border-red focus:outline-none"
              />
              <input
                name="code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                autoComplete="one-time-code"
                required
                placeholder="000000"
                className="border-b border-border-2 bg-transparent py-3 font-mono text-[16px] tracking-[0.4em] text-ink placeholder:text-ink-faint focus:border-red focus:outline-none"
              />
              <input type="hidden" name="next" value={nextPath} />

              {message && (
                <p
                  className={`font-mono text-[10px] uppercase leading-[1.7] tracking-[0.14em] ${
                    status === "error" ? "text-red" : "text-ink-dim"
                  }`}
                >
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="brand-action self-start border border-red/45 px-6 py-3 font-mono text-[10px] uppercase tracking-[0.28em] text-red transition-colors hover:bg-red hover:text-bg disabled:opacity-45"
              >
                {status === "submitting" ? "checking..." : "enter the room ->"}
              </button>
            </form>

            <p className="mt-10 font-mono text-[8px] uppercase tracking-[0.22em] text-ink-faint">
              code expired? <Link href="/sign-in" className="text-red transition-colors hover:text-red-bright">request a fresh one</Link>.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
