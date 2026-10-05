"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { timeline } from "@/data/system";
import { certifications } from "@/data/profile";
import { Section, SectionHeader } from "@/components/ui/Section";

const KIND_COLOR = { edu: "var(--cobalt)", work: "var(--signal)", cert: "var(--amber)", now: "var(--mint)" } as const;

export function Timeline() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  return (
    <Section id="career" debug="CareerTimeline" labelledBy="career-h">
      <SectionHeader
        index="07"
        kicker="CAREER TIMELINE"
        title={
          <span id="career-h">
            From B.Tech to <span className="text-signal">client delivery.</span>
          </span>
        }
      />
      <div className="grid gap-12 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_340px]">
        <ol ref={ref} className="relative ml-3 min-w-0 sm:ml-6">
          <div className="absolute top-2 bottom-2 left-0 w-px bg-line" aria-hidden />
          <motion.div style={{ scaleY }} className="absolute top-2 bottom-2 left-0 w-[2px] origin-top bg-ink" aria-hidden />
          {timeline.map((t, i) => (
            <motion.li
              key={t.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ type: "spring", stiffness: 110, damping: 18, delay: i * 0.05 }}
              className="relative pb-12 pl-8 last:pb-0 sm:pl-12"
            >
              <span className="absolute top-1.5 -left-[7px] h-[15px] w-[15px] rounded-full border-[3px] border-paper" style={{ background: KIND_COLOR[t.kind] }} aria-hidden />
              <div className="font-mono text-xs tracking-widest" style={{ color: KIND_COLOR[t.kind] }}>
                {t.when.toUpperCase()}
              </div>
              <h3 className="mt-2 font-display text-xl font-bold tracking-tight break-words sm:text-3xl">{t.title}</h3>
              <div className="mt-1 text-sm font-medium text-ink-2">{t.org}</div>
              <p className="mt-2 max-w-xl text-[15px] text-muted">{t.body}</p>
            </motion.li>
          ))}
        </ol>

        <aside aria-label="Certifications" className="grid min-w-0 gap-4 sm:grid-cols-2 lg:sticky lg:top-32 lg:grid-cols-1 lg:self-start">
          <div className="label sm:col-span-2 lg:col-span-1">CERTIFICATIONS</div>
          {certifications.map((c, i) => (
            <motion.a
              key={c.name}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20, rotateX: 25 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 120, damping: 16 }}
              whileHover={{ y: -4, rotate: i ? 1 : -1 }}
              className="panel group relative block overflow-hidden !rounded-3xl p-6"
            >
              <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full opacity-20 blur-2xl" style={{ background: i ? "var(--violet)" : "var(--signal)" }} aria-hidden />
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-ink font-display text-sm font-bold text-white">{i ? "ML" : "GC"}</span>
                <div>
                  <div className="font-mono text-[10px] tracking-widest text-muted">{c.issuer.toUpperCase()}</div>
                  <div className="font-display text-[15px] font-bold leading-tight">{c.name}</div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="chip">{c.note}</span>
                <span className="font-mono text-[10px] text-ink-2 transition-transform group-hover:translate-x-1">VERIFY ↗</span>
              </div>
            </motion.a>
          ))}
        </aside>
      </div>
    </Section>
  );
}
