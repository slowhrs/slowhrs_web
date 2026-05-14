"use client";

import { useEffect, useState } from "react";

export default function MouseCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on fine pointers
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsVisible(true);
    
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", updatePosition);
    return () => window.removeEventListener("mousemove", updatePosition);
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className="cursor"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
    />
  );
}
