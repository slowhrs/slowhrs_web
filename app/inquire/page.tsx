"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { INQUIRY_CATEGORIES } from "@/lib/constants";
import { submitInquiry } from "@/app/actions/inquiry";
import Footer from "@/components/Footer";

export default function InquirePage() {
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
      <div className="max-w-[640px] mx-auto px-6 pt-20 md:pt-28 pb-24 relative">
        {/* Hero */}
        <h1
          className="font-display italic text-ink"
          style={{ fontSize: "clamp(3rem, 8vw, 5rem)" }}
        >
          inquire.
        </h1>
        <p className="font-serif italic text-ink-dim mt-4 max-w-[600px] leading-relaxed text-lg">
          shot something for us, want us to shoot yours,
          <br />
          have a project, want to throw something together — start here.
        </p>

        {/* Category grid */}
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

        {/* Question text */}
        <p className="font-serif italic text-ink-dim text-lg mt-10">
          {currentCategory?.question}
        </p>

        {/* Form */}
        {submitted ? (
          <div className="mt-12 text-center py-16">
            <h2
              className="font-display italic text-ink"
              style={{ fontSize: "4rem" }}
            >
              sent.
            </h2>
            <p className="font-serif italic text-ink-dim mt-4 text-lg">
              we&apos;ll reply within 48 hours.
            </p>
          </div>
        ) : (
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col gap-6"
          >
            <input type="hidden" name="category" value={category} />

            <div className="flex flex-col gap-1">
              <input
                name="name"
                type="text"
                placeholder="your name"
                required
                className="bg-transparent border-b border-border-2 py-3 font-mono text-[13px] text-ink placeholder:text-ink-faint focus:border-red focus:outline-none transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1">
              <input
                name="instagram"
                type="text"
                placeholder="@instagram"
                className="bg-transparent border-b border-border-2 py-3 font-mono text-[13px] text-ink placeholder:text-ink-faint focus:border-red focus:outline-none transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1">
              <input
                name="email"
                type="email"
                placeholder="email or phone"
                required
                className="bg-transparent border-b border-border-2 py-3 font-mono text-[13px] text-ink placeholder:text-ink-faint focus:border-red focus:outline-none transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1">
              <input
                name="dateOrProject"
                type="text"
                placeholder="date or project"
                className="bg-transparent border-b border-border-2 py-3 font-mono text-[13px] text-ink placeholder:text-ink-faint focus:border-red focus:outline-none transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1">
              <textarea
                ref={detailsRef}
                name="details"
                placeholder={currentCategory?.question || "tell us more"}
                required
                rows={4}
                className="bg-transparent border-b border-border-2 py-3 font-mono text-[13px] text-ink placeholder:text-ink-faint focus:border-red focus:outline-none transition-colors resize-none"
              />
            </div>

            {error && (
              <p className="font-mono text-[11px] text-red">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="self-start font-mono text-[11px] tracking-[0.25em] uppercase text-ink-dim hover:text-red transition-colors border-b border-ink-faint hover:border-red pb-0.5 mt-4 disabled:opacity-40"
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
