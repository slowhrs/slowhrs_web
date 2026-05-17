"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { requestMagicLink } from "@/app/actions/signIn";

function SignInForm() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const initialEmail = searchParams.get("email") ?? "";
  const nextPath = searchParams.get("next") ?? "/dashboard";
  const hasApprovedEmail = initialEmail.length > 0;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setMessage(null);

    const result = await requestMagicLink(new FormData(event.currentTarget));
    if (result.success) {
      if (!hasApprovedEmail) event.currentTarget.reset();
      setStatus("success");
      setMessage(result.message || "check your inbox.");
    } else {
      setStatus("error");
      setMessage(result.error || "try again.");
    }
  };

  const invalidLink = searchParams.get("error") === "invalid_link";

  return (
    <main className="min-h-screen bg-bg px-5 pt-[52px] text-ink">
      <section className="mx-auto flex min-h-[calc(100vh-52px)] max-w-[560px] items-center py-16">
        <div className="relative w-full overflow-hidden border border-border bg-[#050505] p-6 md:p-9">
          <div className="pointer-events-none absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_20%_10%,rgba(230,0,22,0.22),transparent_28%)]" />
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

              {(message || invalidLink) && (
                <p className={`font-mono text-[10px] uppercase leading-[1.7] tracking-[0.14em] ${
                  status === "error" || invalidLink ? "text-red" : "text-ink-dim"
                }`}>
                  {invalidLink ? "link expired or invalid. request a new one." : message}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="brand-action self-start border border-red/45 px-6 py-3 font-mono text-[10px] uppercase tracking-[0.28em] text-red transition-colors hover:bg-red hover:text-bg disabled:opacity-45"
              >
                {status === "submitting" ? "sending..." : "send link →"}
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

export default function SignInPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-bg" />}>
      <SignInForm />
    </Suspense>
  );
}
