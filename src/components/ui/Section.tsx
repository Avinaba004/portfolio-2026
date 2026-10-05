"use client";

import { motion } from "motion/react";

export function SectionHeader({
  index,
  kicker,
  title,
  intro,
  align = "left",
}: {
  index: string;
  kicker: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div className={`mb-12 sm:mb-16 ${align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-4xl"}`}>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        className={`mb-5 flex items-center gap-3 ${align === "center" ? "justify-center" : ""}`}
      >
        <span className="font-mono text-xs text-signal">{index}</span>
        <span className="h-px w-10 bg-line-strong" aria-hidden />
        <span className="label">{kicker}</span>
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ type: "spring", stiffness: 100, damping: 18 }}
        className="font-display text-[clamp(2.2rem,6vw,5rem)] leading-[0.95] font-bold tracking-[-0.035em]"
      >
        {title}
      </motion.h2>
      {intro && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ delay: 0.1 }}
          className="mt-5 max-w-2xl text-base leading-relaxed text-ink-2 sm:text-lg"
        >
          {intro}
        </motion.p>
      )}
    </div>
  );
}

export function Section({ id, debug, className = "", children, labelledBy }: { id: string; debug: string; className?: string; children: React.ReactNode; labelledBy?: string }) {
  return (
    <section id={id} data-debug={debug} tabIndex={-1} aria-labelledby={labelledBy} className={`relative scroll-mt-20 px-5 py-24 outline-none sm:px-10 sm:py-32 lg:px-[8%] ${className}`}>
      <div className="mx-auto max-w-[1400px]">{children}</div>
    </section>
  );
}
