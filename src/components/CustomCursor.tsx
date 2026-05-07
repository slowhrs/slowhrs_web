"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const mousePos = useRef({ x: -100, y: -100 });
  const dotPos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });

  const animate = useCallback(() => {
    // Dot follows with minimal lag
    dotPos.current.x += (mousePos.current.x - dotPos.current.x) * 0.35;
    dotPos.current.y += (mousePos.current.y - dotPos.current.y) * 0.35;

    // Ring follows with more lag (0.18s feel)
    ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.15;
    ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.15;

    if (dotRef.current) {
      dotRef.current.style.left = `${dotPos.current.x}px`;
      dotRef.current.style.top = `${dotPos.current.y}px`;
    }
    if (ringRef.current) {
      ringRef.current.style.left = `${ringPos.current.x}px`;
      ringRef.current.style.top = `${ringPos.current.y}px`;
    }
    if (labelRef.current) {
      labelRef.current.style.left = `${dotPos.current.x}px`;
      labelRef.current.style.top = `${dotPos.current.y}px`;
    }

    requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    // Only enable on fine pointers (mouse, trackpad)
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setIsVisible(true);

    // Add class to html to hide native cursor — ONLY after JS is ready
    document.documentElement.classList.add("custom-cursor-active");

    const onMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const onEnterInteractive = () => {
      dotRef.current?.classList.add("is-hover");
      ringRef.current?.classList.add("is-hover");
    };

    const onLeaveInteractive = () => {
      dotRef.current?.classList.remove("is-hover");
      ringRef.current?.classList.remove("is-hover");
      labelRef.current?.classList.remove("is-visible");
    };

    const onEnterVideo = () => {
      labelRef.current?.classList.add("is-visible");
    };

    const onLeaveVideo = () => {
      labelRef.current?.classList.remove("is-visible");
    };

    window.addEventListener("mousemove", onMove);

    // Delegate hover to interactive elements
    const addListeners = () => {
      document.querySelectorAll("a, button, [role='button'], input, select, textarea").forEach((el) => {
        el.addEventListener("mouseenter", onEnterInteractive);
        el.addEventListener("mouseleave", onLeaveInteractive);
      });
      document.querySelectorAll("video, [data-video-tile]").forEach((el) => {
        el.addEventListener("mouseenter", onEnterVideo);
        el.addEventListener("mouseleave", onLeaveVideo);
      });
    };

    // Add listeners initially and on DOM changes
    addListeners();
    const observer = new MutationObserver(addListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    const rafId = requestAnimationFrame(animate);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onMove);
      observer.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [animate]);

  if (!isVisible) return null;

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
      <div ref={labelRef} className="cursor-label">play</div>
    </>
  );
}
