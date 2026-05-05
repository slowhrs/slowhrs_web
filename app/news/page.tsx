import Footer from "@/components/Footer";

export const metadata = {
  title: "News | SLOWHRS",
  description: "Recaps, announcements, and proof the room happened. The SLOWHRS feed.",
};

export default function NewsPage() {
  return (
    <>
      <main className="min-h-screen pt-[52px] md:pt-[52px]">
        <section className="max-w-[1000px] mx-auto px-5 md:px-12 py-20 md:py-32">
          <div className="mb-20">
            <h1
              className="font-serif italic text-brand-ink leading-none mb-4"
              style={{ fontSize: "clamp(3rem, 6vw, 5rem)" }}
            >
              news
            </h1>
            <p className="font-mono text-[11px] tracking-[0.1em] text-brand-ink/40 uppercase">
              proof the room happened
            </p>
          </div>

          {/* Placeholder feed — fully built in Step 6 */}
          <div className="flex flex-col">
            {[
              { date: "05.03.26", title: "act iii archive processing complete", body: "the block party recap is in the archive. 214 frames, 3 rooms, 1 night." },
              { date: "12.01.25", title: "next drop loading", body: null, locked: true },
              { date: "11.20.25", title: "casting window open", body: "looking for 4 faces for the spring lookbook. apply through membership." },
            ].map((entry, i) => (
              <div key={i} className="py-12 border-b border-brand-border/30">
                <span className="font-mono text-[10px] tracking-[0.2em] text-brand-ink/30 uppercase">{entry.date}</span>
                <h2
                  className="font-serif italic text-brand-ink mt-3"
                  style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
                >
                  {entry.title}
                </h2>
                {entry.locked ? (
                  <p className="font-serif italic text-[1rem] text-brand-ink/30 mt-4">
                    you&apos;d see this if you were on the list.{" "}
                    <a href="/membership" className="text-brand-red/60 hover:text-brand-red transition-colors">apply →</a>
                  </p>
                ) : entry.body ? (
                  <p className="font-mono text-[13px] text-brand-ink/50 mt-4 max-w-[60ch] leading-relaxed">{entry.body}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
