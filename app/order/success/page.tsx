import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Confirmed - SLOWHRS",
  description: "Your SLOWHRS order has been confirmed.",
  robots: { index: false, follow: false },
};

export default function OrderSuccessPage() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="max-w-[480px] text-center">
        <div className="font-mono text-[10px] tracking-[0.3em] text-brand-red uppercase mb-6">
          ORDER CONFIRMED
        </div>

        <h1 className="font-serif italic text-[2.5rem] md:text-[3rem] text-brand-ink leading-tight mb-6">
          secured.
        </h1>

        <p className="font-mono text-[10px] md:text-[11px] tracking-[0.1em] text-brand-ink/60 uppercase leading-[1.8] mb-8 max-w-[40ch] mx-auto">
          receipt sent to your email. keep it filed.
        </p>

        <div className="flex flex-col items-center gap-4">
          <Link
            href="/"
            className="brand-action font-mono text-[10px] tracking-[0.2em] uppercase text-brand-ink border border-brand-ink/20 px-8 py-4 hover:border-brand-ink/60 hover:text-brand-red transition-colors"
          >
            back to the room
          </Link>

          <Link
            href="/#drops"
            className="font-mono text-[9px] tracking-[0.15em] uppercase text-brand-ink/40 hover:text-brand-ink transition-colors"
          >
            continue shopping
          </Link>
        </div>

        <div className="mt-16 font-mono text-[8px] tracking-[0.2em] text-brand-ink/20 uppercase">
          SLOWHRS // LOS ANGELES
        </div>
      </div>
    </main>
  );
}
