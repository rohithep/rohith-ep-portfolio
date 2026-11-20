"use client";

import { useEffect, useRef } from "react";
import { SKILL_GROUPS } from "@/content/projects";
import { registerGsap } from "@/lib/gsap-register";
import { usePrefersReducedMotion } from "@/lib/smooth-scroll-provider";
import { LineReveal } from "@/components/ui/line-reveal";

const MARQUEE_ITEMS = [
  "AI APPLICATION DEVELOPMENT",
  "CLAUDE",
  "GEMINI",
  "OPEN-SOURCE LLMS",
  "PYTHON",
  "FRAPPE",
  "NEXT.JS",
  "REACT",
  "TAILWIND CSS",
  "SUPABASE",
  "POSTGRESQL",
  "FLUTTER",
  "SHOPIFY",
  "AWS",
  "SEO",
  "META ADS",
];

export function Stack() {
  const reducedMotion = usePrefersReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion || !trackRef.current) return;
    const { gsap, ScrollTrigger } = registerGsap();
    const track = trackRef.current;

    let xPercent = 0;
    let direction = -1;
    let velocityBoost = 0;

    const qSkew = gsap.quickTo(track, "skewX", {
      duration: 0.35,
      ease: "power3.out",
    });

    const st = ScrollTrigger.create({
      onUpdate(self) {
        const vel = self.getVelocity();
        if (Math.abs(vel) > 5) {
          direction = vel > 0 ? -1 : 1;
          velocityBoost = Math.min(4.5, Math.abs(vel) / 420);
          qSkew(gsap.utils.clamp(-7, 7, vel / -320));
        }
      },
    });

    const tick = () => {
      const speed = 0.032 + velocityBoost * 0.08;
      xPercent += speed * direction;
      if (xPercent <= -50) xPercent += 50;
      if (xPercent > 0) xPercent -= 50;

      gsap.set(track, { xPercent, force3D: true });

      velocityBoost *= 0.92;
      if (velocityBoost < 0.02) {
        velocityBoost = 0;
        qSkew(0);
      }
    };

    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      st.kill();
    };
  }, [reducedMotion]);

  return (
    <section
      id="stack"
      className="border-t border-[var(--border)] bg-[var(--surface)]/35 py-16 transition-colors duration-500 sm:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-10 grid grid-cols-1 gap-4 sm:mb-14 sm:gap-6 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
              Capabilities
            </p>
          </div>
          <div className="lg:col-span-8">
            <h2 className="font-display text-3xl font-bold tracking-tight text-[var(--text)] sm:text-4xl lg:text-5xl">
              <LineReveal>Technical Stack</LineReveal>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-12 lg:gap-y-10">
          {SKILL_GROUPS.map((group) => (
            <div
              key={group.category}
              data-sfx="card"
              className="border-t border-[var(--border)] pt-5"
            >
              <h3 className="font-display text-lg font-bold text-[var(--text)]">
                {group.category}
              </h3>
              <ul className="mt-3 space-y-1.5 text-sm text-[var(--muted)]">
                {group.skills.map((skill) => (
                  <li
                    key={skill}
                    data-sfx="hover"
                    className="w-fit transition-colors hover:text-[var(--text)]"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Velocity-Driven Editorial Marquee */}
      <div className="mt-14 overflow-hidden border-y border-[var(--border)] py-4 sm:mt-16 sm:py-5 lg:mt-20">
        <div ref={trackRef} className="flex w-max will-change-transform">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
            <span
              key={idx}
              className="font-display mx-5 text-xl font-bold tracking-tight text-[var(--muted)]/60 sm:mx-8 sm:text-3xl lg:text-4xl"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
