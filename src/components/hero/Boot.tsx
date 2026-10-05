"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const LINES = [
  "INITIALIZING ENGINEERING SYSTEM...",
  "LOADING EXPERIENCE...",
  "LOADING ARCHITECTURES...",
  "LOADING AI SYSTEMS...",
  "LOADING CLOUD INFRASTRUCTURE...",
];

/**
 * Boot sequence. Plays once per session; any key / click skips.
 * An inline script in <head> adds `booted` to <html> for repeat visits so the
 * overlay never flashes (see BOOT_SCRIPT).
 */

export function Boot({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(-1);
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (document.documentElement.classList.contains("booted")) {
      queueMicrotask(() => setDone(true));
      onDone();
      return;
    }
    const timers: number[] = [];
    const finish = () => {
      try {
        sessionStorage.setItem("ag-booted", "1");
      } catch {}
      setDone(true);
      onDone();
    };
    timers.push(window.setTimeout(() => setStep(0), 450));
    LINES.forEach((_, i) => timers.push(window.setTimeout(() => setStep(i + 1), 650 + i * 260)));
    timers.push(window.setTimeout(() => setStep(LINES.length + 1), 650 + LINES.length * 260 + 150));
    timers.push(window.setTimeout(finish, 650 + LINES.length * 260 + 900));
    const onSkip = () => {
      timers.forEach(clearTimeout);
      finish();
    };
    window.addEventListener("keydown", onSkip, { once: true });
    window.addEventListener("pointerdown", onSkip, { once: true });
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("keydown", onSkip);
      window.removeEventListener("pointerdown", onSkip);
    };
  }, [onDone]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="boot-overlay fixed inset-0 z-[100] flex items-center justify-center bg-paper"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          role="status"
          aria-label="Loading portfolio system"
        >
          <div className="bp-grid absolute inset-0 opacity-50 mask-fade" aria-hidden />
          <div className="relative w-full max-w-md px-6 font-mono text-[12px] leading-7 sm:text-[13px]">
            {step < 0 && <span className="caret inline-block h-4 w-2 translate-y-0.5 bg-ink" />}
            {LINES.slice(0, Math.max(0, step)).map((l, i) => (
              <motion.div key={l} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className="flex justify-between gap-4 text-ink-2">
                <span>{l}</span>
                <span className="text-mint">{i < step - 1 || step > LINES.length ? "OK" : <span className="caret">▌</span>}</span>
              </motion.div>
            ))}
            {step > LINES.length && (
              <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="mt-4 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-signal pulse-dot" />
                <span className="font-display text-lg font-semibold tracking-[0.2em] text-ink">SYSTEM READY</span>
              </motion.div>
            )}
            <div className="mt-8 h-px w-full overflow-hidden bg-line">
              <motion.div className="h-full bg-ink" initial={{ width: 0 }} animate={{ width: `${(Math.max(0, step) / (LINES.length + 1)) * 100}%` }} />
            </div>
            <p className="mt-3 text-[10px] tracking-widest text-muted">PRESS ANY KEY TO SKIP</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
