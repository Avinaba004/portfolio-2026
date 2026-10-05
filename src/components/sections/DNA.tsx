"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { principles } from "@/data/profile";

function Row({ a, b, i, progress }: { a: string; b: string; i: number; progress: MotionValue<number> }) {
  const dir = i % 2 === 0 ? 1 : -1;
  const x = useTransform(progress, [0, 1], [`${dir * 8}%`, `${dir * -8}%`]);
  return (
    <motion.div style={{ x }} className="flex flex-col items-center justify-center gap-x-[0.25em] font-display text-[clamp(1.9rem,9vw,6.4rem)] leading-[1.02] font-extrabold tracking-[-0.04em] whitespace-nowrap md:flex-row md:items-baseline md:text-[clamp(2rem,6vw,6.4rem)]">
      <span className="text-ink">{a}</span>
      <span className="text-signal max-md:text-[0.6em] max-md:leading-none">&gt;</span>
      <span className="text-ink/15">{b}</span>
    </motion.div>
  );
}

export function DNA() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  return (
    <section ref={ref} id="dna" data-debug="EngineeringDNA" aria-labelledby="dna-h" className="relative overflow-hidden py-24 sm:py-36">
      <div className="mb-10 flex items-center justify-center gap-3">
        <span className="font-mono text-xs text-signal">06</span>
        <span className="h-px w-10 bg-line-strong" aria-hidden />
        <h2 id="dna-h" className="label">
          ENGINEERING DNA
        </h2>
      </div>
      <ul className="space-y-1" aria-label="Engineering principles">
        {principles.map(([a, b], i) => (
          <li key={a}>
            <span className="sr-only">
              {a} over {b}
            </span>
            <div aria-hidden>
              <Row a={a} b={b} i={i} progress={scrollYProgress} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
