import { drops } from "@/lib/data/drops";
import DropTile from "@/components/drops/DropTile";
import Footer from "@/components/Footer";

export const metadata = {
  title: "SLOWHRS | drops",
  description: "what we wear when we're not shooting.",
};

export default function DropsPage() {
  return (
    <main className="min-h-screen pt-[52px] md:pt-[52px]" style={{ backgroundColor: "var(--color-bg-cream)" }}>
      {/* Header */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 pt-20 md:pt-28 pb-8">
        <h1
          className="font-display italic"
          style={{
            fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)",
            fontWeight: 300,
            color: "var(--color-ink-warm)",
          }}
        >
          drops.
        </h1>
        <p
          className="font-serif italic mt-4 max-w-[480px] leading-relaxed"
          style={{
            fontSize: "clamp(0.9rem, 1.5vw, 1.1rem)",
            color: "var(--color-ink-warm-dim)",
          }}
        >
          what we wear when we&apos;re not shooting.
          <br />
          limited. members get the early window.
        </p>
      </div>

      {/* Drops */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 pb-24">
        {drops.map((drop, i) => (
          <DropTile key={drop.id} drop={drop} index={i} />
        ))}
      </div>

      <Footer />
    </main>
  );
}
