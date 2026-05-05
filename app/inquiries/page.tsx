"use client";

import InquiryForm from "@/components/inquiries/InquiryForm";
import Footer from "@/components/Footer";

export default function InquiriesPage() {
  return (
    <>
      <main className="min-h-screen pt-[52px]">
        <section className="max-w-[700px] mx-auto px-5 md:px-12 py-20 md:py-32">
          <div className="mb-12">
            <h1
              className="font-serif italic text-brand-ink leading-none mb-4"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
            >
              tell us what this is.
            </h1>
            <p className="font-mono text-[10px] tracking-[0.15em] text-brand-ink/30 uppercase">
              pick a category. be specific. we read everything.
            </p>
          </div>

          <InquiryForm />
        </section>
      </main>
      <Footer />
    </>
  );
}
