export default function Ticker() {
  return (
    <div className="fixed top-0 left-0 right-0 h-[26px] bg-black border-b border-brand-border overflow-hidden flex items-center z-[90]">
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
              Only For Those Who Desire A Fast Life
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
