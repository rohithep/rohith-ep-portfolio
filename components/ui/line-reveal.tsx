"use client";

import { useEffect, useRef } from "react";
import { registerGsap } from "@/lib/gsap-register";
import { usePrefersReducedMotion } from "@/lib/smooth-scroll-provider";

interface LineRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function LineReveal({
  children,
  className = "",
  delay = 0,
}: LineRevealProps) {
  const reducedMotion = usePrefersReducedMotion();
  const outerRef = useRef<HTMLSpanElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reducedMotion || !outerRef.current || !innerRef.current) return;
    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        innerRef.current,
        { yPercent: 108, rotate: 1.5 },
        {
          yPercent: 0,
          rotate: 0,
          duration: 0.95,
          delay,
          force3D: true,
          ease: "power3.out",
          scrollTrigger: {
            trigger: outerRef.current,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, outerRef);

    return () => ctx.revert();
  }, [reducedMotion, delay]);

  return (
    <span
      ref={outerRef}
      className={`block overflow-hidden pb-[0.08em] ${className}`}
    >
      <span
        ref={innerRef}
        className="block origin-bottom-left will-change-transform"
      >
        {children}
      </span>
    </span>
  );
}
