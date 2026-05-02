export default function StatusStrip() {
  return (
    <div className="relative z-[3] border-t border-white/5 bg-black/80 backdrop-blur-xl grid grid-cols-2 md:grid-cols-4 w-full">
      <div className="p-4 md:p-6 border-r border-white/5 border-b md:border-b-0 relative group flex flex-col justify-center">
        <div className="absolute top-4 right-4 w-1.5 h-1.5 bg-brand-red rounded-full shadow-[0_0_8px_var(--red)] animate-blink"></div>
        <div className="font-mono text-[8px] md:text-[9px] tracking-[0.25em] md:tracking-[0.3em] text-brand-ink/40 uppercase mb-2">
          NEXT EVENT
        </div>
        <div className="font-serif italic font-medium text-[1.2rem] md:text-2xl text-brand-red">
          LOADING
        </div>
      </div>
      
      <div className="p-4 md:p-6 border-b md:border-b-0 md:border-r border-white/5 relative flex flex-col justify-center">
        <div className="font-mono text-[8px] md:text-[9px] tracking-[0.25em] md:tracking-[0.3em] text-brand-ink/40 uppercase mb-2">
          MEMBERS
        </div>
        <div className="font-serif italic font-medium text-[1.2rem] md:text-2xl text-brand-ink/90">
          40
        </div>
      </div>

      <div className="p-4 md:p-6 border-r border-white/5 relative flex flex-col justify-center">
        <div className="font-mono text-[8px] md:text-[9px] tracking-[0.25em] md:tracking-[0.3em] text-brand-ink/40 uppercase mb-2">
          DROPS
        </div>
        <div className="font-serif italic font-medium text-[1.2rem] md:text-2xl text-brand-ink/90">
          3
        </div>
      </div>

      <div className="p-4 md:p-6 relative flex flex-col justify-center">
        <div className="font-mono text-[8px] md:text-[9px] tracking-[0.25em] md:tracking-[0.3em] text-brand-ink/40 uppercase mb-2">
          ARCHIVE
        </div>
        <div className="font-serif italic font-medium text-[1.2rem] md:text-2xl text-brand-ink/90">
          OPEN
        </div>
      </div>
    </div>
  );
}
