'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h1 className="font-display italic text-6xl md:text-8xl text-red mb-6">Error</h1>
      <p className="font-mono text-xs tracking-[0.2em] text-ink-dim uppercase mb-12">
        something went wrong in the transmission
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink border border-ink/20 px-8 py-3 hover:bg-ink hover:text-bg transition-colors"
        >
          retry
        </button>
        <Link 
          href="/"
          className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink-dim hover:text-red transition-colors py-3"
        >
          return
        </Link>
      </div>
    </div>
  );
}
