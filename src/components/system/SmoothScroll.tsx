"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Inertial smooth scrolling for mouse / trackpad (Lenis). Off for touch and reduced-motion users.
 * Inner scroll areas (terminal, lists, dialogs, maps) keep native scrolling.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Touch devices already have native momentum scrolling; smoothing it only adds work.
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      autoRaf: true,
      anchors: { offset: -80 },
      // Hand the wheel to an inner box only if it can actually scroll vertically; otherwise Lenis keeps
      // control. (Blanket-preventing panels let the wheel fall through to native page scroll → jumps.)
      prevent: (node) => {
        for (let el: HTMLElement | null = node; el && el !== document.body; el = el.parentElement) {
          if (el.matches("[role=dialog], [data-lenis-prevent]")) return true;
          const oy = getComputedStyle(el).overflowY;
          if ((oy === "auto" || oy === "scroll") && el.scrollHeight > el.clientHeight + 1) return true;
        }
        return false;
      },
    });
    window.__lenis = lenis;
    return () => {
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  // New route → start at the top immediately.
  useEffect(() => {
    if (!location.hash) window.__lenis?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
}
