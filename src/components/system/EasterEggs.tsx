"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useApp } from "./AppProvider";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

/**
 * Hidden interactions:
 *  - Konami code → blueprint "system schematic" overlay
 *  - `sudo portfolio` (terminal) → same overlay via pulse
 *  - 5× logo click → debug mode (handled in Dock)
 */
export function EasterEggs() {
  const { pulse, firePulse, showToast, sfx } = useApp();
  const seq = useRef<string[]>([]);
  const [show, setShow] = useState(false);
  const lastPulse = useRef(pulse);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      seq.current = [...seq.current, e.key].slice(-KONAMI.length);
      if (seq.current.join() === KONAMI.join()) {
        seq.current = [];
        showToast("KONAMI ACCEPTED · ROOT SCHEMATIC UNLOCKED");
        firePulse();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [firePulse, showToast]);

  useEffect(() => {
    if (pulse === lastPulse.current) return;
    lastPulse.current = pulse;
    sfx("success");
    queueMicrotask(() => setShow(true));
    const id = setTimeout(() => setShow(false), 3600);
    return () => clearTimeout(id);
  }, [pulse, sfx]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="no-print pointer-events-none fixed inset-0 z-[80] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-hidden
        >
          <div className="absolute inset-0 bg-cobalt/[0.06]" />
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
            {Array.from({ length: 14 }).map((_, i) => (
              <motion.line
                key={`h${i}`}
                x1="0"
                x2="1000"
                y1={i * 45}
                y2={i * 45}
                stroke="var(--cobalt)"
                strokeOpacity="0.25"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: i * 0.03 }}
              />
            ))}
            {[
              [180, 150, "CLIENT"],
              [420, 120, "NEXT.JS"],
              [660, 160, "PYTHON"],
              [820, 330, "POSTGRESQL"],
              [560, 430, "GEMINI"],
              [280, 400, "OAUTH"],
            ].map(([x, y, t], i, arr) => {
              const [nx, ny] = arr[(i + 1) % arr.length];
              return (
                <g key={String(t)}>
                  <motion.path
                    d={`M${x},${y} L${nx},${ny}`}
                    stroke="var(--signal)"
                    strokeWidth="2"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 + i * 0.15 }}
                  />
                  <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 + i * 0.15, type: "spring" }} style={{ transformOrigin: `${x}px ${y}px` }}>
                    <rect x={Number(x) - 60} y={Number(y) - 18} width="120" height="36" rx="10" fill="white" stroke="var(--ink)" />
                    <text x={x} y={Number(y) + 5} textAnchor="middle" fontFamily="monospace" fontSize="13" fill="var(--ink)">
                      {t}
                    </text>
                  </motion.g>
                </g>
              );
            })}
          </svg>
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 font-mono text-xs tracking-[0.3em] text-cobalt">ROOT@AVINABA.SYS — FULL SYSTEM SCHEMATIC</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
