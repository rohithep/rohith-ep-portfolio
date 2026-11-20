"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);
  const rawScale = useMotionValue(1);

  const x = useSpring(rawX, { stiffness: 520, damping: 34, mass: 0.25 });
  const y = useSpring(rawY, { stiffness: 520, damping: 34, mass: 0.25 });
  const scale = useSpring(rawScale, { stiffness: 420, damping: 28, mass: 0.25 });

  useEffect(() => {
    const isFine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!isFine || reduced || !ringRef.current) return;

    ringRef.current.style.display = "block";
    let isHovered = false;

    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX - 10);
      rawY.set(e.clientY - 10);

      const target = e.target as HTMLElement | null;
      const interactive = Boolean(
        target?.closest("a, button, [data-cursor='hover']")
      );
      if (interactive !== isHovered) {
        isHovered = interactive;
        rawScale.set(interactive ? 2.1 : 1);
        ringRef.current?.classList.toggle("bg-[var(--accent)]/15", interactive);
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [rawX, rawY, rawScale]);

  return (
    <motion.div
      ref={ringRef}
      aria-hidden="true"
      style={{ x, y, scale, display: "none" }}
      className="pointer-events-none fixed left-0 top-0 z-[90] h-5 w-5 rounded-full border border-[var(--accent)]/65 transition-colors duration-200"
    />
  );
}
