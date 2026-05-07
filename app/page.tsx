"use client";

import { useState, useEffect } from "react";
import CinemaEntry from "@/components/CinemaEntry";
import HomepageHero from "@/components/HomepageHero";
import Footer from "@/components/Footer";

export default function HomePage() {
  const [showEntry, setShowEntry] = useState(false);
  const [showHome, setShowHome] = useState(false);

  useEffect(() => {
    const visited =
      typeof window !== "undefined"
        ? localStorage.getItem("slowhrs_visited")
        : null;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (visited || reduced) {
      setShowHome(true);
    } else {
      setShowEntry(true);
    }
  }, []);

  const handleEntryComplete = () => {
    setShowEntry(false);
    setShowHome(true);
  };

  // SSR / initial — black screen, no flash
  if (!showEntry && !showHome) {
    return <main className="min-h-screen bg-black" />;
  }

  return (
    <>
      {showEntry && <CinemaEntry onComplete={handleEntryComplete} />}
      {showHome && (
        <main>
          <HomepageHero />
          <Footer />
        </main>
      )}
    </>
  );
}
