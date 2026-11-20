"use client";

import { useEffect, useRef } from "react";
import {
  initSfxPreference,
  playSfx,
  unlockAudioContext,
} from "@/lib/sfx";

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const lastHoverElRef = useRef<Element | null>(null);
  const lastCardElRef = useRef<Element | null>(null);

  useEffect(() => {
    initSfxPreference();

    const handleUnlock = () => {
      unlockAudioContext();
    };

    const handlePointerOver = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Check for interactive controls (links, buttons)
      const interactive = target.closest(
        'a, button, [role="button"], [data-sfx="hover"]'
      );
      if (interactive) {
        if (interactive !== lastHoverElRef.current) {
          lastHoverElRef.current = interactive;
          playSfx("hover");
        }
        return;
      } else {
        lastHoverElRef.current = null;
      }

      // Check for editorial showcase cards / timeline cards
      const card = target.closest(
        '.editorial-frame, .origin-card, [data-sfx="card"]'
      );
      if (card) {
        if (card !== lastCardElRef.current) {
          lastCardElRef.current = card;
          playSfx("card-hover");
        }
      } else {
        lastCardElRef.current = null;
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      unlockAudioContext();
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        'a, button, [role="button"], [data-sfx="click"]'
      );
      if (!interactive) return;

      // Elements with data-sfx-custom play their own specialized sound (e.g. theme, copy, whoosh)
      if (interactive.hasAttribute("data-sfx-custom")) return;

      playSfx("click");
    };

    window.addEventListener("pointerdown", handlePointerDown, {
      passive: true,
      capture: true,
    });
    window.addEventListener("pointerover", handlePointerOver, {
      passive: true,
    });
    window.addEventListener("keydown", handleUnlock, {
      passive: true,
      once: true,
    });
    window.addEventListener("wheel", handleUnlock, {
      passive: true,
      once: true,
    });

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown, true);
      window.removeEventListener("pointerover", handlePointerOver);
      window.removeEventListener("keydown", handleUnlock);
      window.removeEventListener("wheel", handleUnlock);
    };
  }, []);

  return <>{children}</>;
}
