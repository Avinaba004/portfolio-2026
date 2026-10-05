"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { buildPipeline } from "@/data/system";
import { profile } from "@/data/profile";
import { Section, SectionHeader } from "@/components/ui/Section";
import { useMotionValueEvent } from "motion/react";

const DETAIL: Record<string, { tech: string; color: string }> = {
  "MESSY REQUIREMENTS": { tech: "Client conversations · government workflows · POCs", color: "var(--muted)" },
  "SYSTEM DESIGN": { tech: "Config-driven architecture · workflow & rule engines", color: "var(--violet)" },
  FRONTEND: { tech: "React · Next.js · TypeScript · Tailwind", color: "var(--cobalt)" },
  BACKEND: { tech: "Python · FastAPI · Node.js · REST APIs", color: "var(--cobalt)" },
  DATABASE: { tech: "PostgreSQL · JSONB · pgvector · data modeling", color: "var(--mint)" },
  AUTHENTICATION: { tech: "OAuth 2.0 · OIDC · SAML · SSO · RBAC", color: "var(--amber)" },
  "AI / AUTOMATION": { tech: "Gemini · RAG · document AI · webhooks", color: "var(--violet)" },
  CLOUD: { tech: "GCP · Cloud Run · Pub/Sub · Docker · Nginx", color: "var(--signal)" },
  "REAL USERS": { tech: "Counties · courts · agencies · reviewers · admins", color: "var(--ink)" },
};

export function WhatIBuild() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 22 });
  const height = useTransform(progress, [0, 1], ["0%", "100%"]);
  const [lit, setLit] = useState(-1);

  useMotionValueEvent(progress, "change", (v) => {
    setLit(Math.min(buildPipeline.length - 1, Math.floor(v * buildPipeline.length * 1.02) - 0));
  });

  return (
    <Section id="build" debug="WhatIBuild · ScrollPipeline" labelledBy="build-title">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeader index="01" kicker="WHO I AM" title={<span id="build-title">WHAT I<br />BUILD</span>} />
          <motion.blockquote
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="-mt-4 max-w-lg border-l-2 border-signal pl-5 text-xl leading-snug font-medium text-ink sm:text-2xl"
          >
            “{profile.statement}”
          </motion.blockquote>
          <div className="mt-8 flex flex-wrap gap-2">
            {["Government", "Healthcare", "Licensing", "GenAI", "Integrations", "Cloud"].map((d) => (
              <span key={d} className="chip">
                {d}
              </span>
            ))}
          </div>
        </div>

        <div ref={ref} className="relative pl-10 sm:pl-14">
          {/* Rail */}
          <div className="absolute top-3 bottom-3 left-[15px] w-[2px] rounded bg-line sm:left-[23px]" aria-hidden />
          <motion.div style={{ height }} className="absolute top-3 left-[15px] w-[2px] rounded bg-gradient-to-b from-ink via-cobalt to-signal sm:left-[23px]" aria-hidden />
          <ol className="space-y-3">
            {buildPipeline.map((step, i) => {
              const on = i <= lit;
              const d = DETAIL[step];
              return (
                <li key={step} className="relative">
                  <motion.span
                    className="absolute top-1/2 -left-10 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full border-2 bg-paper font-mono text-[10px] sm:-left-14 sm:h-12 sm:w-12 sm:text-xs"
                    animate={{ borderColor: on ? d.color : "var(--line-strong)", scale: i === lit ? 1.12 : 1, color: on ? "var(--ink)" : "var(--muted)" }}
                    aria-hidden
                  >
                    {String(i + 1).padStart(2, "0")}
                  </motion.span>
                  <motion.div
                    animate={{ opacity: on ? 1 : 0.4, x: on ? 0 : 8 }}
                    transition={{ type: "spring", stiffness: 200, damping: 24 }}
                    className={`panel-flat flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between ${i === lit ? "shadow-[var(--shadow-md)]" : ""}`}
                    style={{ borderColor: i === lit ? d.color : undefined }}
                  >
                    <span className="font-display text-base font-semibold tracking-wide sm:text-lg">{step}</span>
                    <span className="font-mono text-[11px] text-muted">{d.tech}</span>
                  </motion.div>
                  {i < buildPipeline.length - 1 && (
                    <span className="block py-0.5 pl-6 font-mono text-xs text-muted" aria-hidden>
                      ↓
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </Section>
  );
}
