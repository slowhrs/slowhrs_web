import { news } from "@/lib/data/news";
import NewsItemComponent from "@/components/news/NewsItem";
import ScrollReveal from "@/components/ScrollReveal";
import Footer from "@/components/Footer";

export const metadata = {
  title: "SLOWHRS | news",
  description: "drops, recaps, casting calls. what happened between the parties.",
};

export default function NewsPage() {
  return (
    <main className="min-h-screen pt-[52px]" style={{ backgroundColor: "var(--color-bg-cream)" }}>
      {/* Header */}
      <div className="max-w-[720px] mx-auto px-6 pt-20 md:pt-28 pb-8">
        <ScrollReveal>
          <h1
            className="font-display italic"
            style={{
              fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)",
              fontWeight: 300,
              color: "var(--color-ink-warm)",
            }}
          >
            dispatches.
          </h1>
        </ScrollReveal>
        <ScrollReveal delay={150}>
          <p
            className="font-serif italic mt-4 leading-relaxed"
            style={{
              fontSize: "clamp(0.9rem, 1.5vw, 1.1rem)",
              color: "var(--color-ink-warm-dim)",
            }}
          >
            drops. recaps. casting calls.
            <br />
            what happened between the parties.
          </p>
        </ScrollReveal>
      </div>

      {/* News items */}
      <div className="max-w-[720px] mx-auto px-6 pb-24">
        {news.map((item, i) => (
          <ScrollReveal key={item.id} delay={i * 80}>
            <NewsItemComponent
              item={item}
              useSticker={item.id === "TX-011"}
            />
          </ScrollReveal>
        ))}
      </div>

      <Footer />
    </main>
  );
}
