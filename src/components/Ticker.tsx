export default function Ticker() {
  return (
    <div className="ticker-sticky h-[var(--header-height)] overflow-hidden flex items-center">
      <div className="flex whitespace-nowrap animate-ticker">
        {/* We duplicate the content to ensure a perfect loop */}
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex shrink-0">
            <span className="font-mono text-[10px] tracking-[0.28em] text-brand-ink-dim px-6 uppercase">
              SLOWHRS // Los Angeles
            </span>
            <span className="font-mono text-[10px] tracking-[0.28em] text-brand-ink-dim px-6 uppercase">
              <span className="text-brand-red">●</span> REC
            </span>
            <span className="font-mono text-[10px] tracking-[0.28em] text-brand-ink-dim px-6 uppercase">
              Los Angeles Creative Society
            </span>
            <span className="font-mono text-[10px] tracking-[0.28em] text-brand-ink-dim px-6 uppercase">
              <span className="text-brand-red">●</span> PRIVATE ACCESS
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
