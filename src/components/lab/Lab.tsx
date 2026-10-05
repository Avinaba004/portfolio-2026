"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { labProjects, miniProjects } from "@/data/projects";
import { Section, SectionHeader } from "@/components/ui/Section";
import { useNearView } from "@/lib/hooks";
import { ExpTrack, QueryMini, StoriesMini } from "./LabMinis";

const SkyWatch = dynamic(() => import("./SkyWatch"), { ssr: false, loading: () => <div className="h-[480px] animate-pulse rounded-[22px] bg-paper-2" /> });

const get = (slug: string) => labProjects.find((p) => p.slug === slug)!;

function Experiment({ id, slug, exp, children, className = "", demo = true }: { id: string; slug: string; exp: string; children: React.ReactNode; className?: string; demo?: boolean }) {
  const p = get(slug);
  return (
    <motion.article
      id={id}
      tabIndex={-1}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 100, damping: 18 }}
      className={`panel crop relative flex scroll-mt-24 flex-col !rounded-[28px] p-5 outline-none sm:p-6 ${className}`}
      aria-labelledby={`${id}-h`}
    >
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-muted">
            <span style={{ color: p.accent }}>EXP-{exp}</span>
            <span>·</span>
            <span>{p.domain.join(" · ").toUpperCase()}</span>
          </div>
          <h3 id={`${id}-h`} className="mt-1.5 font-display text-xl font-bold">
            {p.fullName}
          </h3>
          <p className="mt-1 max-w-xl text-[13.5px] text-ink-2">{p.description}</p>
        </div>
        {demo && <span className="chip !text-[9px]">INTERACTIVE DEMO · SAMPLE DATA</span>}
      </header>
      <div className="@container flex-1">{children}</div>
      <footer className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-line pt-4">
        {p.technologies.map((t) => (
          <span key={t.name} title={t.usedFor.join(", ")} className="rounded-md bg-paper-2 px-2 py-1 font-mono text-[10px] text-ink-2">
            {t.name}
          </span>
        ))}
        {p.links?.map((l) => (
          <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="ml-auto font-mono text-[10px] tracking-wider text-ink underline-offset-4 hover:underline">
            {l.label.toUpperCase()} ↗
          </a>
        ))}
      </footer>
    </motion.article>
  );
}

export function Lab() {
  const [skyRef, near] = useNearView<HTMLDivElement>("400px");
  return (
    <Section id="lab" debug="TheLab · Experiments" labelledBy="lab-h" className="bg-paper-2/50">
      <div className="bp-grid pointer-events-none absolute inset-0 opacity-40 mask-fade-y" aria-hidden />
      <div className="relative">
        <SectionHeader
          index="07"
          kicker="PERSONAL PROJECTS"
          title={
            <span id="lab-h">
              THE <span className="text-mint">LAB</span>
            </span>
          }
          intro="Experiments I build on my own time. These are playable — poke at them."
        />

        <div className="grid gap-5">
          <Experiment id="lab-skywatch" slug="skywatch" exp="01" demo={false}>
            <div ref={skyRef}>{near ? <SkyWatch /> : <div className="h-[480px] rounded-[22px] bg-paper-2" />}</div>
          </Experiment>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <Experiment id="lab-exptrack" slug="exptrack" exp="02" className="md:col-span-2 xl:col-span-1">
              <ExpTrack />
            </Experiment>
            <Experiment id="lab-query" slug="query" exp="03">
              <QueryMini />
            </Experiment>
            <Experiment id="lab-stories" slug="stories" exp="04">
              <StoriesMini />
            </Experiment>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {miniProjects.map((m, i) => (
              <motion.a
                key={m.name}
                href={m.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3 }}
                className="panel-flat group flex items-center justify-between !rounded-2xl px-5 py-4"
              >
                <span className="flex items-center gap-3">
                  <span className="font-mono text-[10px] text-muted">EXP-0{5 + i}</span>
                  <span className="font-display text-base font-bold">{m.name}</span>
                </span>
                <span className="font-mono text-[11px] text-ink-2 transition-transform group-hover:translate-x-1">{m.blurb.toUpperCase()} ↗</span>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
