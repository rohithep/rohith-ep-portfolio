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
  const isTouchRef = useRef(false);

  useEffect(() => {
    initSfxPreference();

    const handleUnlock = () => {
      unlockAudioContext();
    };

    const handleTouchStart = () => {
      isTouchRef.current = true;
      unlockAudioContext();
    };

    const handleTouchEnd = () => {
      unlockAudioContext();
    };

    const handlePointerOver = (e: PointerEvent) => {
      // Suppress emulated mouse hover events on touch devices
      if (e.pointerType === "touch" || isTouchRef.current) return;
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Check for interactive controls (links, buttons, hover-tagged items)
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

      // Check for editorial showcase cards / timeline cards / stat cards
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
      if (e.pointerType === "mouse") {
        isTouchRef.current = false;
      }
      unlockAudioContext();
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // 1. Primary clickable controls (links, buttons)
      const clickable = target.closest(
        'a, button, [role="button"], [data-sfx="click"]'
      );
      if (clickable) {
        if (clickable.hasAttribute("data-sfx-custom")) return;
        playSfx("click");
        return;
      }

      // 2. On touch devices, tapping a card (stats 06./03./2026., timeline cards, skill groups) or hover item plays its tactile sound
      if (e.pointerType === "touch" || isTouchRef.current) {
        const card = target.closest(
          '.origin-card, .origin-mobile-card, [data-sfx="card"]'
        );
        if (card) {
          playSfx("card-hover");
          return;
        }

        const hoverItem = target.closest('[data-sfx="hover"]');
        if (hoverItem) {
          playSfx("hover");
        }
      }
    };

    window.addEventListener("touchstart", handleTouchStart, {
      passive: true,
      capture: true,
    });
    window.addEventListener("touchend", handleTouchEnd, {
      passive: true,
      capture: true,
    });
    window.addEventListener("pointerdown", handlePointerDown, {
      passive: true,
      capture: true,
    });
    window.addEventListener("pointerover", handlePointerOver, {
      passive: true,
    });
    window.addEventListener("keydown", handleUnlock, {
      passive: true,
    });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart, true);
      window.removeEventListener("touchend", handleTouchEnd, true);
      window.removeEventListener("pointerdown", handlePointerDown, true);
      window.removeEventListener("pointerover", handlePointerOver);
      window.removeEventListener("keydown", handleUnlock);
    };
  }, []);

  return <>{children}</>;
}
