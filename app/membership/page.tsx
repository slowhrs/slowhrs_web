"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { submitApplication } from "@/app/actions/apply";
import Footer from "@/components/Footer";

const TIERS = [
  {
    num: "01",
    name: "the line",
    meter: "\u25AE\u25AF\u25AF\u25AF\u25AF",
    desc: "you applied. the door hasn\u2019t opened yet.",
    accent: false,
  },
  {
    num: "02",
    name: "the room",
    meter: "\u25AE\u25AE\u25AF\u25AF\u25AF",
    desc: "you showed up once. somebody noticed.",
    accent: false,
  },
  {
    num: "03",
    name: "the regular",
    meter: "\u25AE\u25AE\u25AE\u25AF\u25AF",
    desc: "you keep coming back. the room knows your face.",
    accent: false,
  },
  {
    num: "04",
    name: "the inner room",
    meter: "\u25AE\u25AE\u25AE\u25AE\u25AE",
    desc: "you don\u2019t just attend. you shoot, host, perform, provide. the team noticed your +1\u2019s too.",
    accent: true,
  },
  {
    num: "05",
    name: "the architects",
    meter: "\u25AE\u25AE\u25AE\u25AE\u25AE \u2605",
    desc: "invitation only. you helped build this.",
    accent: false,
  },
];

export default function MembershipPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setLoading(true);
    setError(null);

    const formData = new FormData(formRef.current);
    const result = await submitApplication(formData);

    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.error || "something went wrong.");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-bg pt-[52px]">
      {/* Rose gradient accent — top-right */}
      <div
        className="fixed top-0 right-0 w-[60vw] h-[60vh] pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse at top right, rgba(244,197,192,0.07), transparent 50%)",
        }}
      />

      <div className="relative z-10 max-w-[720px] mx-auto px-6 pt-20 md:pt-28 pb-24">
        {/* Hero */}
        <h1
          className="font-display italic text-ink"
          style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)", fontWeight: 300 }}
        >
          the list.
        </h1>
        <p className="font-serif italic text-ink-dim mt-6 max-w-[600px] leading-relaxed text-lg">
          slowhrs runs a small room in los angeles.
          <br />
          the door opens by hand. not by algorithm.
          <br />
          bring something real and the access follows.
        </p>

        {/* Tier ladder */}
        <div className="mt-16 relative">
          {TIERS.map((tier) => (
            <div
              key={tier.num}
              className={`py-6 border-b border-border flex flex-col md:flex-row md:items-start gap-4 ${
                tier.accent ? "border-l-2 pl-4 md:pl-6" : ""
              }`}
              style={
                tier.accent
                  ? { borderLeftColor: "var(--color-rose)" }
                  : undefined
              }
            >
              <div className="flex-1">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[11px] tracking-[0.2em] text-ink-faint">
                    {tier.num}
                  </span>
                  <span className="font-serif italic text-ink text-lg">
                    {tier.name}
                  </span>
                </div>
                <p className="font-serif italic text-ink-dim text-sm mt-1 max-w-[400px] leading-relaxed">
                  {tier.desc}
                </p>
              </div>
              <span className="font-mono text-[14px] tracking-[0.1em] text-ink-dim shrink-0">
                {tier.meter}
              </span>
            </div>
          ))}


        </div>

        {/* Application form */}
        <div className="mt-24">
          {submitted ? (
            <div className="text-center py-16">
              <h2
                className="font-display italic text-ink"
                style={{ fontSize: "clamp(1rem, 1.5vw, 1.4rem)", fontWeight: 300 }}
              >
                you&apos;re on the line.
              </h2>
              <p className="font-serif italic text-ink-dim mt-4 text-lg">
                we&apos;ll see you soon.
              </p>
            </div>
          ) : (
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="flex flex-col gap-6"
            >
              <input
                name="full_name"
                type="text"
                placeholder="your name"
                required
                className="bg-transparent border-b border-border-2 py-3 font-mono text-[13px] text-ink placeholder:text-ink-faint focus:outline-none transition-colors"
                style={{ borderBottomColor: undefined }}
                onFocus={(e) =>
                  (e.target.style.borderBottomColor = "var(--color-rose)")
                }
                onBlur={(e) =>
                  (e.target.style.borderBottomColor = "")
                }
              />

              <input
                name="instagram"
                type="text"
                placeholder="@instagram"
                className="bg-transparent border-b border-border-2 py-3 font-mono text-[13px] text-ink placeholder:text-ink-faint focus:outline-none transition-colors"
                onFocus={(e) =>
                  (e.target.style.borderBottomColor = "var(--color-rose)")
                }
                onBlur={(e) =>
                  (e.target.style.borderBottomColor = "")
                }
              />

              <input
                name="email"
                type="email"
                placeholder="email"
                required
                className="bg-transparent border-b border-border-2 py-3 font-mono text-[13px] text-ink placeholder:text-ink-faint focus:outline-none transition-colors"
                onFocus={(e) =>
                  (e.target.style.borderBottomColor = "var(--color-rose)")
                }
                onBlur={(e) =>
                  (e.target.style.borderBottomColor = "")
                }
              />

              <input
                name="city"
                type="text"
                placeholder="city"
                defaultValue="Los Angeles"
                className="bg-transparent border-b border-border-2 py-3 font-mono text-[13px] text-ink placeholder:text-ink-faint focus:outline-none transition-colors"
                onFocus={(e) =>
                  (e.target.style.borderBottomColor = "var(--color-rose)")
                }
                onBlur={(e) =>
                  (e.target.style.borderBottomColor = "")
                }
              />

              <input
                name="what_you_do"
                type="text"
                placeholder="what do you do?"
                className="bg-transparent border-b border-border-2 py-3 font-mono text-[13px] text-ink placeholder:text-ink-faint focus:outline-none transition-colors"
                onFocus={(e) =>
                  (e.target.style.borderBottomColor = "var(--color-rose)")
                }
                onBlur={(e) =>
                  (e.target.style.borderBottomColor = "")
                }
              />

              <textarea
                name="why_apply"
                placeholder="what do you bring? tell us in your own words. one paragraph."
                required
                rows={4}
                className="bg-transparent border-b border-border-2 py-3 font-mono text-[13px] text-ink placeholder:text-ink-faint focus:outline-none transition-colors resize-none"
                onFocus={(e) =>
                  (e.target.style.borderBottomColor = "var(--color-rose)")
                }
                onBlur={(e) =>
                  (e.target.style.borderBottomColor = "")
                }
              />

              {error && (
                <p className="font-mono text-[11px] text-red">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="self-start font-mono text-[11px] tracking-[0.25em] uppercase text-ink-dim hover:text-red transition-colors border-b border-ink-faint hover:border-red pb-0.5 mt-4 disabled:opacity-40"
              >
                {loading ? "sending..." : "get on the line \u2197"}
              </button>
            </form>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
