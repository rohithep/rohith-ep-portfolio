"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { registerGsap } from "./gsap-register";

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Always start at the Hero on page load/reload
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }
    window.scrollTo(0, 0);

    if (reducedMotion) return;

    const { gsap, ScrollTrigger } = registerGsap();
    const lenis = new Lenis({
      duration: 1.35,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.35,
    });
    lenisRef.current = lenis;
    lenis.scrollTo(0, { immediate: true });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Intercept same-page hash links (#work, /#work, #top) in capture phase before Next.js <Link>
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href) return;

      if (href === "/" && window.location.pathname === "/") {
        e.preventDefault();
        e.stopPropagation();
        if (window.location.hash) {
          window.history.replaceState(null, "", "/");
        }
        lenis.scrollTo(0);
        return;
      }

      const isHashOnly = href.startsWith("#");
      const isRootHash = href.startsWith("/#") && window.location.pathname === "/";
      if (!isHashOnly && !isRootHash) return;

      const hash = isHashOnly ? href : href.slice(1);
      if (hash === "#" || hash === "#top") {
        e.preventDefault();
        e.stopPropagation();
        lenis.scrollTo(0);
        return;
      }

      const el = document.querySelector<HTMLElement>(hash);
      if (el) {
        e.preventDefault();
        e.stopPropagation();
        if (window.location.hash) {
          window.history.replaceState(null, "", window.location.pathname);
        }
        lenis.scrollTo(el, { offset: -64 });
      }
    };

    const handleScrollTopEvent = () => {
      lenis.scrollTo(0);
    };

    document.addEventListener("click", handleAnchorClick, true);
    window.addEventListener("lenis:scroll-top", handleScrollTopEvent);

    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 300);

    return () => {
      clearTimeout(refreshTimer);
      document.removeEventListener("click", handleAnchorClick, true);
      window.removeEventListener("lenis:scroll-top", handleScrollTopEvent);
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  // Reset scroll to top on route changes
  useEffect(() => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return <>{children}</>;
}
