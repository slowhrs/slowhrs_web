"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { INQUIRY_CATEGORIES } from "@/lib/constants";
import { submitInquiry } from "@/app/actions/inquiry";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

export default function InquireForm() {
  const searchParams = useSearchParams();
  const [category, setCategory] = useState("other");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const detailsRef = useRef<HTMLTextAreaElement>(null);

  // Pre-select from URL params
  useEffect(() => {
    const subject = searchParams.get("subject");
    const note = searchParams.get("note");

    if (subject) {
      const match = INQUIRY_CATEGORIES.find((c) => c.value === subject);
      if (match) setCategory(match.value);
    }

    if (note && detailsRef.current) {
      const drop = note.startsWith("DR-") ? `Re: ${note} — ` : note;
      detailsRef.current.value = drop;
    }
  }, [searchParams]);

  const currentCategory = INQUIRY_CATEGORIES.find((c) => c.value === category);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setLoading(true);
    setError(null);

    const formData = new FormData(formRef.current);
    formData.set("category", category);

    const result = await submitInquiry(formData);

    if (result.success) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        formRef.current?.reset();
        setCategory("other");
      }, 5000);
    } else {
      setError(result.error || "something went wrong.");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-bg pt-[52px]">
      {/* Ambient glow */}
      <div
        className="ambient-glow"
        style={{ top: "10%", right: "-20%", opacity: 0.5 }}
      />

      <div className="max-w-[640px] mx-auto px-6 pt-20 md:pt-28 pb-24 relative">
        {/* Hero */}
        <ScrollReveal>
          <h1
            className="font-display italic text-ink"
            style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)", fontWeight: 300 }}
          >
            inquire.
          </h1>
        </ScrollReveal>
        <ScrollReveal delay={150}>
          <p className="font-serif italic text-ink-dim mt-4 max-w-[600px] leading-relaxed text-lg">
            event footage, production work, collabs,
            <br />
            casting, vendor slots — start here.
          </p>
        </ScrollReveal>

        {/* Category grid */}
        <ScrollReveal delay={250}>
          <div className="grid grid-cols-2 gap-3 mt-12">
            {INQUIRY_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                className={`py-3 px-4 border text-left font-mono text-[10px] tracking-[0.2em] uppercase transition-all duration-200 ${
                  category === cat.value
                    ? "border-red bg-red/10 text-red"
                    : "border-border-2 text-ink-dim hover:border-red hover:text-red"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Question text — crossfade on category change */}
        <div className="relative mt-10 min-h-[2rem]">
          <p
            key={category}
            className="font-serif italic text-ink-dim text-lg"
            style={{
              animation: "fadeIn 0.3s ease-out forwards",
            }}
          >
            {currentCategory?.question}
          </p>
        </div>

        {/* Form */}
        {submitted ? (
          <div className="mt-12 text-center py-16">
            <h2
              className="font-display italic text-ink"
              style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)", fontWeight: 300 }}
            >
              sent.
            </h2>
            <p className="font-serif italic text-ink-dim mt-4 text-lg">
              48 hours or less.
            </p>
          </div>
        ) : (
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col gap-6"
          >
            <input type="hidden" name="category" value={category} />

            <input
              name="name"
              type="text"
              placeholder="your name"
              required
              className="bg-transparent border-b border-border-2 py-3 font-mono text-[13px] text-ink placeholder:text-ink-faint form-glow transition-colors"
            />

            <input
              name="instagram"
              type="text"
              placeholder="@instagram"
              className="bg-transparent border-b border-border-2 py-3 font-mono text-[13px] text-ink placeholder:text-ink-faint form-glow transition-colors"
            />

            <input
              name="email"
              type="email"
              placeholder="email or phone"
              required
              className="bg-transparent border-b border-border-2 py-3 font-mono text-[13px] text-ink placeholder:text-ink-faint form-glow transition-colors"
            />

            <input
              name="dateOrProject"
              type="text"
              placeholder="date or project"
              className="bg-transparent border-b border-border-2 py-3 font-mono text-[13px] text-ink placeholder:text-ink-faint form-glow transition-colors"
            />

            <textarea
              ref={detailsRef}
              name="details"
              placeholder={currentCategory?.question || "tell us more"}
              required
              rows={4}
              className="bg-transparent border-b border-border-2 py-3 font-mono text-[13px] text-ink placeholder:text-ink-faint form-glow transition-colors resize-none"
            />

            {error && (
              <p className="font-mono text-[11px] text-red">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="self-start font-mono text-[11px] tracking-[0.25em] uppercase text-ink-dim hover:text-red transition-colors border-b border-ink-faint hover:border-red pb-0.5 mt-4 disabled:opacity-40 cta-breathe"
            >
              {loading ? "sending..." : "send →"}
            </button>
          </form>
        )}

        {/* VHSCam sticker — bottom-right */}
        <div className="absolute bottom-8 right-0">
          <Image
            src="/assets/icons/vhscam_live.png"
            alt=""
            width={70}
            height={24}
            className="pixel opacity-40"
            aria-hidden="true"
          />
        </div>
      </div>

      <Footer />
    </main>
  );
}
