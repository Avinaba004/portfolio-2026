"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";
import type { Command } from "./commands";
import { useApp } from "@/components/system/AppProvider";

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return false;
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: id === "system" ? 0 : -16, duration: 1.4 });
  else el.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  el.focus?.({ preventScroll: true });
  return true;
}

/** Runs a palette/terminal command against router, sections and system toggles. */
export function useRunCommand() {
  const router = useRouter();
  const pathname = usePathname();
  const { toggleDebug, toggleSound } = useApp();

  return useCallback(
    (run: Command["run"]) => {
      switch (run.type) {
        case "route":
          router.push(run.href);
          break;
        case "section":
          if (pathname !== "/" || !scrollToSection(run.id)) router.push(`/#${run.id}`);
          break;
        case "external":
          if (run.href.startsWith("mailto:")) window.location.href = run.href;
          else window.open(run.href, "_blank", "noopener,noreferrer");
          break;
        case "action":
          if (run.name === "debug") toggleDebug();
          else toggleSound();
          break;
      }
    },
    [router, pathname, toggleDebug, toggleSound],
  );
}
