"use client";

import { Suspense } from "react";
import InquireForm from "./InquireForm";

export default function InquirePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-bg pt-[52px] flex items-center justify-center">
          <span className="font-mono text-[11px] text-ink-dim animate-pulse">
            loading...
          </span>
        </main>
      }
    >
      <InquireForm />
    </Suspense>
  );
}
