"use client";

import { NEWS_ENTRIES } from "@/components/news/news.data";
import NewsItem from "@/components/news/NewsItem";
import Footer from "@/components/Footer";

export default function NewsPage() {
  return (
    <>
      <main className="min-h-screen pt-[52px]">
        <section className="max-w-[800px] mx-auto px-5 md:px-12 py-20 md:py-32">
          <div className="mb-16">
            <h1
              className="font-serif italic text-brand-ink leading-none mb-4"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
            >
              transmission
            </h1>
            <p className="font-mono text-[10px] tracking-[0.15em] text-brand-ink/30 uppercase">
              what happened. what's coming. nothing else.
            </p>
          </div>

          <div>
            {NEWS_ENTRIES.map((entry, i) => (
              <NewsItem key={entry.id} entry={entry} index={i} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
