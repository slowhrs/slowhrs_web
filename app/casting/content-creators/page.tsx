"use client";

import { useState } from "react";
import Link from "next/link";
import { submitContentCreatorCasting } from "@/app/actions/contentCreator";

export default function ContentCreatorsCastingPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setError(null);

    const result = await submitContentCreatorCasting(new FormData(event.currentTarget));
    if (result.success) {
      event.currentTarget.reset();
      setStatus("success");
    } else {
      setError(result.error || "try again.");
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-bg px-5 pt-[52px] text-ink">
      <section className="mx-auto flex min-h-[calc(100vh-52px)] max-w-[920px] items-center py-16">
        <div className="grid w-full gap-6 md:grid-cols-[0.8fr_1.2fr]">
          <aside className="border border-border bg-black/50 p-6 md:p-8">
            <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-red">
              casting / creators
            </p>
            <h1 className="mt-6 font-serif text-[3rem] italic leading-none md:text-[4.8rem]">
              content creators wanted.
            </h1>
            <p className="mt-6 max-w-[32ch] font-mono text-[10px] uppercase leading-[1.8] tracking-[0.12em] text-ink-dim">
              no long form. no fake resume. just the handle and the type of signal you make.
            </p>
            <Link
              href="/#casting"
              className="mt-10 inline-flex font-mono text-[9px] uppercase tracking-[0.24em] text-ink-faint hover:text-red"
            >
              back to casting →
            </Link>
          </aside>

          <div className="relative overflow-hidden border border-red/35 bg-[#050505] p-6 md:p-8">
            <div className="pointer-events-none absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_20%_20%,rgba(230,0,22,0.2),transparent_28%),radial-gradient(circle_at_90%_10%,rgba(255,255,255,0.08),transparent_22%)]" />
            <div className="relative z-10">
              <div className="mb-8 flex items-center justify-between border-b border-border pb-4">
                <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-red">
                  CC-001
                </span>
                <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-ink-faint">
                  open now
                </span>
              </div>

              {status === "success" ? (
                <div className="py-20">
                  <h2 className="font-serif text-[2.6rem] italic leading-none text-ink">
                    got it.
                  </h2>
                  <p className="mt-5 font-mono text-[10px] uppercase leading-[1.8] tracking-[0.16em] text-ink-dim">
                    if the fit is right, slowhrs will tap in through instagram.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="mt-8 font-mono text-[9px] uppercase tracking-[0.22em] text-red"
                  >
                    submit another →
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                  <label className="flex flex-col gap-3">
                    <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-ink-faint">
                      instagram
                    </span>
                    <input
                      name="instagram"
                      required
                      autoComplete="off"
                      placeholder="@yourhandle"
                      className="border-b border-border-2 bg-transparent py-3 font-mono text-[14px] text-ink placeholder:text-ink-faint focus:border-red focus:outline-none"
                    />
                  </label>

                  <label className="flex flex-col gap-3">
                    <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-ink-faint">
                      what type of content do you make?
                    </span>
                    <textarea
                      name="contentType"
                      required
                      rows={4}
                      placeholder="fashion reels, event recaps, nightlife photo dumps, edits, interviews..."
                      className="resize-none border-b border-border-2 bg-transparent py-3 font-mono text-[14px] text-ink placeholder:text-ink-faint focus:border-red focus:outline-none"
                    />
                  </label>

                  {error && (
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-red">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="brand-action self-start border border-red/45 px-6 py-3 font-mono text-[10px] uppercase tracking-[0.28em] text-red transition-colors hover:bg-red hover:text-bg disabled:opacity-45"
                  >
                    {status === "submitting" ? "sending..." : "send signal →"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
