"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Volume2 } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/smooth-scroll-provider";
import { playSfx, unlockAudioContext } from "@/lib/sfx";

export function Preloader({ onComplete }: { onComplete?: () => void }) {
  const reducedMotion = usePrefersReducedMotion();
  const [count, setCount] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [done, setDone] = useState(false);
  const enteredRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const handleEnter = useCallback(() => {
    if (enteredRef.current) return;
    enteredRef.current = true;

    // Unlock Web Audio inside a direct user tap/click/key gesture so all scroll SFX work on iOS & Android
    unlockAudioContext();
    playSfx("portal-open");

    setCount(100);
    setDone(true);
    onCompleteRef.current?.();
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setCount(100);
      setLoaded(true);
      return;
    }

    let frame: number;
    const start = performance.now();
    const duration = 950;

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * 100));

      if (t < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setLoaded(true);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reducedMotion]);

  // Also allow Enter or Spacebar on desktop keyboards once loaded
  useEffect(() => {
    if (!loaded || done) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleEnter();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [loaded, done, handleEnter]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          data-sfx-custom="true"
          onClick={() => {
            if (loaded) handleEnter();
          }}
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
          className={`fixed inset-0 z-[100] flex flex-col justify-between bg-[#0B0B0C] p-6 text-[#F5F4F0] select-none sm:p-10 ${
            loaded ? "cursor-pointer" : "cursor-wait"
          }`}
        >
          {/* Top Editorial Bar */}
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-[#8A8A93]">
            <span>Rohith EP</span>
            <span>Portfolio — 2026</span>
          </div>

          {/* Center Counter + Tap to Enter CTA */}
          <div className="flex flex-col items-start justify-between sm:flex-row sm:items-end">
            <div className="font-display text-7xl font-bold tracking-tighter sm:text-9xl">
              {String(count).padStart(2, "0")}
              <span className="text-[#FF4D29]">.</span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={loaded ? { opacity: 1, y: 0 } : { opacity: 0.35, y: 6 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-x-0 bottom-32 flex justify-center sm:static sm:mb-10 sm:mr-20 sm:w-auto sm:justify-end"
            >
              <button
                type="button"
                data-sfx-custom="true"
                disabled={!loaded}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEnter();
                }}
                className={`group inline-flex items-center gap-3 rounded-full border px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] transition-all duration-300 ${
                  loaded
                    ? "cursor-pointer border-[#FF4D29] bg-[#FF4D29] text-white shadow-[0_0_30px_rgba(255,77,41,0.35)] hover:bg-[#ff6242]"
                    : "border-white/15 bg-white/5 text-[#8A8A93]"
                }`}
              >
                <Volume2 className="h-3.5 w-3.5" />
                <span>{loaded ? "Tap to Enter" : "Loading"}</span>
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </motion.div>
          </div>

          {/* Bottom Progress Bar */}
          <div className="h-[2px] w-full bg-white/10">
            <div
              className={`h-full transition-all duration-150 ${
                loaded ? "bg-[#FF4D29]" : "bg-[#F5F4F0]"
              }`}
              style={{ width: `${count}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
