"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import gsap from "gsap";
import { THRESHOLD_ANSWERS } from "@/lib/constants";

type EntryState = "hold" | "question" | "answers" | "transitioning" | "returning";

export default function ThresholdPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const questionRef = useRef<HTMLHeadingElement>(null);
  const answersRef = useRef<HTMLDivElement>(null);
  const chosenRef = useRef<HTMLDivElement>(null);
  const returnRef = useRef<HTMLDivElement>(null);

  const [state, setState] = useState<EntryState>("hold");
  const [previousAnswer, setPreviousAnswer] = useState<string | null>(null);

  // Check for returning visitor
  useEffect(() => {
    const stored = localStorage.getItem("slowhrs_entry");
    if (stored) {
      setPreviousAnswer(stored);
      setState("returning");
    } else {
      // Start the threshold sequence
      const holdTimer = setTimeout(() => setState("question"), 800);
      return () => clearTimeout(holdTimer);
    }
  }, []);

  // Animate question appearance
  useEffect(() => {
    if (state === "question" && questionRef.current) {
      gsap.fromTo(
        questionRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power2.out",
          onComplete: () => {
            setTimeout(() => setState("answers"), 600);
          },
        }
      );
    }
  }, [state]);

  // Animate answers stagger
  useEffect(() => {
    if (state === "answers" && answersRef.current) {
      const buttons = answersRef.current.querySelectorAll("button");
      gsap.fromTo(
        buttons,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.2,
        }
      );
    }
  }, [state]);

  // Animate returning visitor greeting
  useEffect(() => {
    if (state === "returning" && returnRef.current) {
      gsap.fromTo(
        returnRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.2, ease: "power2.out", delay: 0.4 }
      );
    }
  }, [state]);

  const handleAnswer = (text: string, route: string) => {
    localStorage.setItem("slowhrs_entry", text);
    setState("transitioning");

    // Animate chosen answer to full-bleed
    if (chosenRef.current) {
      chosenRef.current.textContent = text;
      gsap.timeline()
        .set(chosenRef.current, { display: "flex", opacity: 0 })
        .to(containerRef.current, { opacity: 0, duration: 0.3 })
        .to(chosenRef.current, {
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
        })
        .to(chosenRef.current, {
          opacity: 0,
          duration: 0.5,
          delay: 0.4,
          ease: "power2.in",
          onComplete: () => router.push(route),
        });
    }
  };

  const handleReturn = () => {
    const stored = previousAnswer;
    const answer = THRESHOLD_ANSWERS.find((a) => a.text === stored);
    if (answer) {
      handleAnswer(answer.text, answer.route);
    } else {
      router.push("/events");
    }
  };

  const handleChangeTime = () => {
    localStorage.removeItem("slowhrs_entry");
    setPreviousAnswer(null);
    setState("hold");
    setTimeout(() => setState("question"), 400);
  };

  // Respect reduced motion
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (previousAnswer) {
        setState("returning");
      } else {
        setState("answers");
      }
    }
  }, [previousAnswer]);

  return (
    <main className="relative min-h-screen bg-[#000] flex items-center justify-center overflow-hidden">
      {/* Content container */}
      <div ref={containerRef} className="relative z-10 flex flex-col items-center text-center px-6 max-w-[600px]">
        
        {/* First visit: question */}
        {(state === "question" || state === "answers") && (
          <>
            <h1
              ref={questionRef}
              className="font-serif italic text-brand-ink opacity-0"
              style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
            >
              what time is it
            </h1>

            <div ref={answersRef} className="mt-12 flex flex-col items-center gap-5">
              {state === "answers" &&
                THRESHOLD_ANSWERS.map((answer) => (
                  <button
                    key={answer.text}
                    onClick={() => handleAnswer(answer.text, answer.route)}
                    className="group relative font-mono text-[14px] tracking-[0.1em] text-brand-ink/70 hover:text-brand-ink transition-colors duration-200 py-2 px-1 opacity-0"
                  >
                    {answer.text}
                    {/* Red underline draws left-to-right on hover */}
                    <span className="absolute bottom-0 left-0 h-[1px] bg-brand-red w-0 group-hover:w-full transition-all duration-300 ease-out" />
                  </button>
                ))}
            </div>
          </>
        )}

        {/* Returning visitor */}
        {state === "returning" && (
          <div ref={returnRef} className="flex flex-col items-center gap-10 opacity-0">
            <p
              className="font-serif italic text-brand-ink/90"
              style={{ fontSize: "clamp(1.8rem, 4vw, 3.2rem)" }}
            >
              welcome back. you were{" "}
              <span className="text-brand-red">{previousAnswer}</span> last time.
            </p>
            <button
              onClick={handleReturn}
              className="group relative font-mono text-[14px] tracking-[0.1em] text-brand-ink/70 hover:text-brand-ink transition-colors duration-200 py-2 px-1"
            >
              enter
              <span className="absolute bottom-0 left-0 h-[1px] bg-brand-red w-0 group-hover:w-full transition-all duration-300 ease-out" />
            </button>
            <button
              onClick={handleChangeTime}
              className="font-mono text-[10px] tracking-[0.2em] text-brand-ink/30 hover:text-brand-ink/60 transition-colors uppercase mt-4"
            >
              change time
            </button>
          </div>
        )}
      </div>

      {/* Chosen answer full-bleed overlay */}
      <div
        ref={chosenRef}
        className="fixed inset-0 z-50 items-center justify-center bg-black hidden"
        style={{ fontSize: "clamp(3rem, 10vw, 8rem)" }}
      >
        <span className="font-serif italic text-white" />
      </div>

      {/* Logo watermark — very subtle */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 w-[60px] opacity-[0.08] mix-blend-screen">
        <Image
          src="/assets/logos/logo_main.png"
          alt=""
          width={60}
          height={14}
          className="w-full h-auto"
          aria-hidden="true"
        />
      </div>
    </main>
  );
}
