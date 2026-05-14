export default function StatusStrip() {
  return (
    <div className="relative z-[3] border-t border-brand-border bg-black/65 backdrop-blur-md grid grid-cols-2 md:grid-cols-4">
      <div className="p-4 md:p-5 border-r border-brand-border border-b md:border-b-0 relative group">
        <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-brand-red rounded-full shadow-[0_0_8px_var(--red)] animate-blink"></div>
        <div className="font-mono text-[9px] tracking-[0.3em] text-brand-ink-faint uppercase mb-1.5">
          NEXT EVENT
        </div>
        <div className="font-serif italic font-medium text-2xl text-brand-red">
          LOADING
        </div>
      </div>
      
      <div className="p-4 md:p-5 border-b md:border-b-0 md:border-r border-brand-border relative">
        <div className="font-mono text-[9px] tracking-[0.3em] text-brand-ink-faint uppercase mb-1.5">
          MEMBERS
        </div>
        <div className="font-serif italic font-medium text-2xl text-brand-ink">
          40
        </div>
      </div>

      <div className="p-4 md:p-5 border-r border-brand-border relative">
        <div className="font-mono text-[9px] tracking-[0.3em] text-brand-ink-faint uppercase mb-1.5">
          DROPS
        </div>
        <div className="font-serif italic font-medium text-2xl text-brand-ink">
          3
        </div>
      </div>

      <div className="p-4 md:p-5 relative">
        <div className="font-mono text-[9px] tracking-[0.3em] text-brand-ink-faint uppercase mb-1.5">
          ARCHIVE
        </div>
        <div className="font-serif italic font-medium text-2xl text-brand-ink">
          OPEN
        </div>
      </div>
    </div>
  );
}
