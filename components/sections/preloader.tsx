"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/smooth-scroll-provider";

export function Preloader({ onComplete }: { onComplete?: () => void }) {
  const reducedMotion = usePrefersReducedMotion();
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (reducedMotion) {
      setCount(100);
      setDone(true);
      onCompleteRef.current?.();
      return;
    }

    let frame: number;
    const start = performance.now();
    const duration = 1100;

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * 100));

      if (t < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setDone(true);
          onCompleteRef.current?.();
        }, 160);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reducedMotion]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-[#0B0B0C] p-6 text-[#F5F4F0] sm:p-10"
        >
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-[#8A8A93]">
            <span>Rohith EP</span>
            <span>Portfolio — 2026</span>
          </div>

          <div className="font-display text-7xl font-bold tracking-tighter sm:text-9xl">
            {String(count).padStart(2, "0")}
          </div>

          <div className="h-px w-full bg-white/10">
            <div
              className="h-full bg-[#F5F4F0] transition-[width] duration-75"
              style={{ width: `${count}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
