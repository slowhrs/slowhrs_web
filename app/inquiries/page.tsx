"use client";

import Footer from "@/components/Footer";


export default function InquiriesPage() {
  return (
    <>
      <main className="min-h-screen pt-[52px] md:pt-[52px]">
        <section className="max-w-[800px] mx-auto px-5 md:px-12 py-20 md:py-32">
          <div className="mb-16 text-center">
            <h1
              className="font-serif italic text-brand-ink leading-none mb-6"
              style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
            >
              tell us what this is.
            </h1>
          </div>

          {/* Placeholder form — fully built in Step 5 */}
          <form className="flex flex-col gap-8" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="name"
              className="bg-transparent border-b border-brand-ink/20 py-3 font-mono text-[13px] italic text-brand-ink placeholder:text-brand-ink/20 focus:outline-none focus:border-brand-red transition-colors"
            />
            <input
              type="text"
              placeholder="@instagram"
              className="bg-transparent border-b border-brand-ink/20 py-3 font-mono text-[13px] italic text-brand-ink placeholder:text-brand-ink/20 focus:outline-none focus:border-brand-red transition-colors"
            />
            <textarea
              placeholder="what do you need?"
              rows={4}
              className="bg-transparent border-b border-brand-ink/20 py-3 font-mono text-[13px] italic text-brand-ink placeholder:text-brand-ink/20 focus:outline-none focus:border-brand-red transition-colors resize-none"
            />
            <button
              type="submit"
              className="self-start font-mono text-[12px] tracking-[0.1em] text-brand-ink/60 hover:text-brand-ink transition-colors"
            >
              send →
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}
