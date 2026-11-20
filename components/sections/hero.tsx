"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { registerGsap } from "@/lib/gsap-register";
import { usePrefersReducedMotion } from "@/lib/smooth-scroll-provider";
import { SITE_CONFIG } from "@/content/projects";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { playSfx } from "@/lib/sfx";

const HERO_LINE_1 = "ROHITH".split("");
const HERO_LINE_2 = "EP".split("");

export function Hero({ ready = true }: { ready?: boolean }) {
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const leftWordRef = useRef<HTMLSpanElement>(null);
  const rightWordRef = useRef<HTMLSpanElement>(null);
  const portraitWrapRef = useRef<HTMLDivElement>(null);
  const portraitTiltRef = useRef<HTMLDivElement>(null);
  const topRowRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;
    const { gsap } = registerGsap();

    const mm = gsap.matchMedia();

    // Desktop (1024px+): Pinned "Zoom-Through" Camera Sequence
    mm.add("(min-width: 1024px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=135%",
          pin: true,
          scrub: 0.9,
          anticipatePin: 1,
        },
      });

      // 1. Top row & scroll cue lift and fade out
      if (topRowRef.current) {
        tl.to(
          topRowRef.current,
          { yPercent: -32, autoAlpha: 0, force3D: true, ease: "power1.inOut" },
          0
        );
      }
      if (cueRef.current) {
        tl.to(cueRef.current, { autoAlpha: 0, duration: 0.25, ease: "none" }, 0);
      }

      // 2. ROHITH and EP split apart horizontally as camera pushes in
      if (leftWordRef.current) {
        tl.to(
          leftWordRef.current,
          {
            xPercent: -42,
            scale: 1.12,
            autoAlpha: 0.06,
            force3D: true,
            ease: "power2.inOut",
          },
          0
        );
      }
      if (rightWordRef.current) {
        tl.to(
          rightWordRef.current,
          {
            xPercent: 52,
            scale: 1.12,
            autoAlpha: 0.06,
            force3D: true,
            ease: "power2.inOut",
          },
          0
        );
      }

      // 3. Portrait zooms toward camera centered on face, then dissolves into About
      if (portraitWrapRef.current) {
        tl.to(
          portraitWrapRef.current,
          {
            scale: 1.58,
            yPercent: 10,
            transformOrigin: "50% 26%",
            force3D: true,
            ease: "power2.inOut",
            duration: 1,
          },
          0
        ).to(
          portraitWrapRef.current,
          {
            autoAlpha: 0,
            ease: "power2.in",
            duration: 0.42,
          },
          0.58
        );
      }
    });

    // Mobile & Tablet (<1024px): Unpinned smooth split + gentle zoom
    mm.add("(max-width: 1023px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      if (leftWordRef.current) {
        tl.to(leftWordRef.current, { xPercent: -24, autoAlpha: 0.15 }, 0);
      }
      if (rightWordRef.current) {
        tl.to(rightWordRef.current, { xPercent: 28, autoAlpha: 0.15 }, 0);
      }
      if (portraitWrapRef.current) {
        tl.to(
          portraitWrapRef.current,
          {
            scale: 1.18,
            yPercent: 8,
            autoAlpha: 0.25,
            transformOrigin: "50% 28%",
          },
          0
        );
      }
    });

    // Mouse depth parallax (desktop hover only)
    const isHoverDevice = window.matchMedia("(hover: hover)").matches;
    if (!isHoverDevice) return () => mm.revert();

    const qNameX = nameRef.current
      ? gsap.quickTo(nameRef.current, "x", { duration: 0.7, ease: "power3.out" })
      : null;
    const qNameY = nameRef.current
      ? gsap.quickTo(nameRef.current, "y", { duration: 0.7, ease: "power3.out" })
      : null;
    const qPortraitX = portraitWrapRef.current
      ? gsap.quickTo(portraitWrapRef.current, "x", { duration: 0.6, ease: "power3.out" })
      : null;
    const qPortraitY = portraitWrapRef.current
      ? gsap.quickTo(portraitWrapRef.current, "y", { duration: 0.6, ease: "power3.out" })
      : null;

    const onMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      qNameX?.(nx * 10);
      qNameY?.(ny * 8);
      qPortraitX?.(nx * 18);
      qPortraitY?.(ny * 12);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      mm.revert();
    };
  }, [reducedMotion]);

  const handlePortraitMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !portraitTiltRef.current) return;
    if (!window.matchMedia("(hover: hover)").matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const rx = ((e.clientY - rect.top) / rect.height - 0.5) * -6;
    const ry = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
    const { gsap } = registerGsap();
    gsap.to(portraitTiltRef.current, {
      rotateX: rx,
      rotateY: ry,
      scale: 1.025,
      transformPerspective: 1100,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handlePortraitLeave = () => {
    setHovered(false);
    if (!portraitTiltRef.current) return;
    const { gsap } = registerGsap();
    gsap.to(portraitTiltRef.current, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.6,
      ease: "power3.out",
    });
  };

  return (
    <section
      id="signal"
      ref={sectionRef}
      className="relative flex min-h-[100svh] w-full flex-col justify-between overflow-hidden border-b border-[var(--border)] pt-20 lg:h-[100svh] lg:min-h-[640px]"
    >
      {/* Top Editorial Row */}
      <div
        ref={topRowRef}
        className="relative z-30 mx-auto flex w-full max-w-7xl flex-col justify-between gap-4 px-5 sm:gap-6 sm:px-8 lg:flex-row lg:items-start"
      >
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 14 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-1 sm:space-y-1.5"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--muted)] sm:text-xs">
            Software Engineer &amp; AI Developer
          </p>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--text)] sm:text-3xl">
            Rohith EP
          </h1>
          <p className="text-xs text-[var(--muted)]">
            BSc CS · MCA 2026 · Remote &amp; Relocatable
          </p>
        </motion.div>

        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 14 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-sm space-y-3 sm:space-y-4 lg:text-right"
        >
          <p className="text-xs leading-relaxed text-[var(--muted)] sm:text-sm">
            {SITE_CONFIG.pitch}
          </p>
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 lg:justify-end">
            <MagneticButton
              href="#work"
              className="rounded-full bg-[var(--text)] px-4 py-2 text-xs font-semibold text-[var(--bg)] transition-opacity hover:opacity-85 sm:px-5 sm:py-2.5"
            >
              <span>Selected Work</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </MagneticButton>
            <MagneticButton
              href="#contact"
              className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-semibold text-[var(--text)] transition-colors hover:border-[var(--text)] sm:px-5 sm:py-2.5"
            >
              <span>Contact / Résumé</span>
            </MagneticButton>
          </div>
        </motion.div>
      </div>

      {/* Giant Edge-to-Edge Typography Behind Portrait */}
      <div
        ref={nameRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-[6svh] z-10 flex items-center justify-center overflow-hidden select-none sm:bottom-[7svh] lg:bottom-[5svh]"
      >
        <div className="font-display flex items-baseline justify-center whitespace-nowrap text-[17.5vw] font-bold leading-[0.86] tracking-[-0.045em] text-[var(--text)] sm:text-[15.5vw] lg:text-[14.5vw]">
          <span ref={leftWordRef} className="inline-block will-change-transform">
            {HERO_LINE_1.map((char, i) => (
              <span key={i} className="inline-block overflow-hidden">
                <motion.span
                  initial={reducedMotion ? false : { y: "105%" }}
                  animate={ready ? { y: "0%" } : {}}
                  transition={{
                    duration: 0.72,
                    delay: 0.08 + i * 0.048,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              </span>
            ))}
          </span>
          <span className="inline-block w-[3.2vw]" />
          <span ref={rightWordRef} className="inline-block will-change-transform">
            {HERO_LINE_2.map((char, i) => (
              <span key={i} className="inline-block overflow-hidden">
                <motion.span
                  initial={reducedMotion ? false : { y: "105%" }}
                  animate={ready ? { y: "0%" } : {}}
                  transition={{
                    duration: 0.72,
                    delay: 0.32 + i * 0.048,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="inline-block text-[var(--accent)]"
                >
                  {char}
                </motion.span>
              </span>
            ))}
          </span>
        </div>
      </div>

      {/* Subtle Studio Backlight Rim Glow on Hover */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute left-1/2 bottom-[6svh] z-[15] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,77,41,0.22)_0%,rgba(245,244,240,0.06)_45%,transparent_70%)] blur-3xl transition-opacity duration-500 ${
          hovered ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Centered Portrait Cutout (Zoom-Through on Scroll + 3D Tilt on Hover) */}
      <div
        ref={portraitWrapRef}
        onMouseEnter={() => {
          setHovered(true);
          playSfx("focus");
        }}
        onMouseMove={handlePortraitMove}
        onMouseLeave={handlePortraitLeave}
        className="pointer-events-auto relative z-20 mx-auto mt-auto flex h-[56svh] w-[108%] max-w-[440px] items-end justify-center will-change-transform sm:h-[64svh] sm:w-full sm:max-w-[540px] lg:absolute lg:inset-x-0 lg:bottom-0 lg:m-0 lg:mx-auto lg:h-[70svh] lg:max-w-[660px]"
      >
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="relative h-full w-full"
        >
          <div ref={portraitTiltRef} className="relative h-full w-full will-change-transform">
            <img
              src="/photos/newrohith.png"
              alt="Rohith EP — Software Engineer & AI Developer"
              className="h-full w-full object-contain object-bottom"
            />
          </div>
        </motion.div>
      </div>

      {/* Minimal Scroll Cue */}
      <div
        ref={cueRef}
        className="pointer-events-none absolute top-20 right-5 z-30 hidden items-center gap-2 text-xs font-medium text-[var(--muted)] sm:flex lg:top-auto lg:bottom-[18svh] lg:left-8 lg:right-auto"
      >
        <ArrowDown className="h-3.5 w-3.5 text-[var(--accent)]" />
        <span>Scroll to explore</span>
      </div>
    </section>
  );
}
