"use client";

import { useEffect, useState } from "react";
import { requestMagicLink } from "@/app/actions/signIn";

type SignInFormProps = {
  initialEmail: string;
  nextPath: string;
  showStaleBanner: boolean;
};

type FormStatus = "idle" | "submitting" | "sent" | "error";

export default function SignInForm({
  initialEmail,
  nextPath,
  showStaleBanner,
}: SignInFormProps) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const hasApprovedEmail = initialEmail.length > 0;
  const isWaiting = status === "submitting" || cooldown > 0;

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = window.setInterval(() => {
      setCooldown((seconds) => Math.max(seconds - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isWaiting) return;

    setStatus("submitting");
    setMessage(null);

    const form = event.currentTarget;
    const result = await requestMagicLink(new FormData(form));
    if (result.success) {
      if (!hasApprovedEmail) form.reset();
      setStatus("sent");
      setMessage(result.message || "check your inbox.");
      setCooldown(60);
      return;
    }

    setStatus("error");
    setMessage(result.error || "try again.");
    setCooldown(result.retryAfter ?? 0);
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
              the room.
            </h1>
            <p className="mt-5 max-w-[34ch] font-mono text-[10px] uppercase leading-[1.8] tracking-[0.14em] text-ink-dim">
              by approval only. enter the email tied to your member id. we send one secure link. no password.
            </p>
            {hasApprovedEmail && (
              <p className="mt-5 border border-red/30 bg-red/5 px-4 py-3 font-mono text-[9px] uppercase leading-[1.7] tracking-[0.16em] text-red">
                approval loaded. send the login link to this email.
              </p>
            )}
            {showStaleBanner && (
              <p className="mt-5 border border-border bg-ink/5 px-4 py-3 font-mono text-[9px] uppercase leading-[1.7] tracking-[0.16em] text-ink-dim">
                that link expired. request a fresh one below.
              </p>
            )}

            <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-7">
              <input
                name="email"
                type="email"
                required
                defaultValue={initialEmail}
                placeholder="email"
                className="border-b border-border-2 bg-transparent py-3 font-mono text-[14px] text-ink placeholder:text-ink-faint focus:border-red focus:outline-none"
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
                disabled={isWaiting}
                className="brand-action self-start border border-red/45 px-6 py-3 font-mono text-[10px] uppercase tracking-[0.28em] text-red transition-colors hover:bg-red hover:text-bg disabled:opacity-45"
              >
                {status === "submitting"
                  ? "sending..."
                  : cooldown > 0
                    ? `send again in ${cooldown}s`
                    : status === "sent"
                      ? "link sent"
                      : "send link ->"}
              </button>
            </form>

            <p className="mt-10 font-mono text-[8px] uppercase tracking-[0.22em] text-ink-faint">
              links expire. use the same inbox you applied with.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
