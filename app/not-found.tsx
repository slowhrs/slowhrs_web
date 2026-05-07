import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h1 className="font-display italic text-2xl md:text-3xl text-red mb-6">404</h1>
      <p className="font-mono text-xs tracking-[0.2em] text-ink-dim uppercase mb-12">
        this room does not exist
      </p>
      <Link 
        href="/"
        className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink border border-ink/20 px-8 py-3 hover:bg-ink hover:text-bg transition-colors"
      >
        return
      </Link>
    </div>
  );
}
