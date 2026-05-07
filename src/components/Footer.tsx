import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="relative py-16 px-6 md:px-12 border-t"
      style={{ borderColor: "var(--color-border)" }}
    >
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
        {/* Left */}
        <div>
          <Link
            href="/"
            className="font-display italic text-ink text-xl hover:text-red transition-colors"
          >
            slowhrs
          </Link>
          <p className="font-mono text-[9px] tracking-[0.2em] text-ink-faint uppercase mt-4">
            women-led creative society · los angeles
          </p>
        </div>

        {/* Links */}
        <div className="flex gap-8 md:gap-12">
          <div className="flex flex-col gap-3">
            <Link
              href="/events"
              className="font-mono text-[10px] tracking-[0.15em] text-ink-dim hover:text-red transition-colors uppercase"
            >
              events
            </Link>
            <Link
              href="/drops"
              className="font-mono text-[10px] tracking-[0.15em] text-ink-dim hover:text-red transition-colors uppercase"
            >
              drops
            </Link>
            <Link
              href="/news"
              className="font-mono text-[10px] tracking-[0.15em] text-ink-dim hover:text-red transition-colors uppercase"
            >
              news
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              href="/membership"
              className="font-mono text-[10px] tracking-[0.15em] text-ink-dim hover:text-red transition-colors uppercase"
            >
              membership
            </Link>
            <Link
              href="/inquire"
              className="font-mono text-[10px] tracking-[0.15em] text-ink-dim hover:text-red transition-colors uppercase"
            >
              inquire
            </Link>
            <a
              href="https://instagram.com/slowhrstv"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] tracking-[0.15em] text-ink-dim hover:text-red transition-colors uppercase"
            >
              @slowhrstv
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="max-w-[1200px] mx-auto mt-12 pt-6 border-t" style={{ borderColor: "var(--color-border)" }}>
        <p className="font-mono text-[8px] tracking-[0.15em] text-ink-faint uppercase">
          © {new Date().getFullYear()} slowhrs. all rights reserved.
        </p>
      </div>
    </footer>
  );
}
