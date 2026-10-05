"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Project } from "@/data/projects";
import { workProjects } from "@/data/projects";

export type VizSlots = { system: React.ReactNode; flow: React.ReactNode; human: React.ReactNode; signature: React.ReactNode };

const VIEWS = [
  { id: "system", label: "SYSTEM VIEW", hint: "Architecture" },
  { id: "flow", label: "FLOW VIEW", hint: "Data / workflow" },
  { id: "human", label: "HUMAN VIEW", hint: "What users touch" },
] as const;

/** Visualizations arrive pre-rendered from the server page, so the case study shows complete on first paint. */
export function CaseStudy({ p, viz }: { p: Project; viz: VizSlots }) {
  const [view, setView] = useState<(typeof VIEWS)[number]["id"]>("system");
  const idx = workProjects.findIndex((x) => x.slug === p.slug);
  const next = workProjects[(idx + 1) % workProjects.length];
  const prev = workProjects[(idx - 1 + workProjects.length) % workProjects.length];

  return (
    <main id="main" className="relative">
      {/* Entry wipe continues the galaxy launch */}
      <motion.div className="pointer-events-none fixed inset-0 z-[65]" style={{ background: p.accent }} initial={{ clipPath: "inset(0 0 0 0)" }} animate={{ clipPath: "inset(0 0 100% 0)" }} transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1], delay: 0.05 }} aria-hidden />

      {/* Header */}
      <header className="relative overflow-hidden px-5 pt-32 pb-16 sm:px-10 lg:px-[8%]">
        <div className="bp-grid mask-fade absolute inset-0 opacity-60" aria-hidden />
        <div className="glow pointer-events-none absolute -top-56 -right-56 h-[820px] w-[820px] opacity-30" style={{ "--glow": p.accent } as React.CSSProperties} aria-hidden />
        <div className="relative mx-auto max-w-[1400px]">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex flex-wrap items-center gap-2">
            <Link href="/#work" className="chip hover:!border-ink">
              ← GALAXY
            </Link>
            <span className="chip">
              CASE STUDY {String(idx + 1).padStart(2, "0")} / {String(workProjects.length).padStart(2, "0")}
            </span>
            {p.domain.map((d) => (
              <span key={d} className="chip" style={{ borderColor: p.accent }}>
                {d.toUpperCase()}
              </span>
            ))}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, type: "spring", stiffness: 90, damping: 16 }}
            className="mt-8 font-display text-[clamp(2.6rem,11vw,11rem)] leading-[0.88] font-extrabold tracking-[-0.05em] break-words"
          >
            {p.name}
            <span style={{ color: p.accent }}>.</span>
          </motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }} className="mt-6 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="text-lg font-medium sm:text-xl">{p.fullName}</p>
              <p className="mt-3 max-w-2xl text-xl leading-snug text-ink-2 sm:text-2xl">{p.tagline}</p>
            </div>
            <dl className="grid grid-cols-2 gap-4 self-end font-mono text-[11px]">
              <div>
                <dt className="text-muted">ROLE</dt>
                <dd className="mt-1 text-[13px] text-ink">{p.role}</dd>
              </div>
              <div>
                <dt className="text-muted">ORGANISATION · PERIOD</dt>
                <dd className="mt-1 text-[13px] text-ink">
                  {p.org} · {p.period}
                </dd>
              </div>
            </dl>
          </motion.div>
          {p.note && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="mt-8 inline-flex max-w-3xl items-start gap-2 rounded-xl border border-line bg-card/80 px-4 py-2.5 text-[12.5px] text-ink-2">
              <span className="font-mono text-[10px] text-signal">NOTE</span> {p.note}
            </motion.p>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-5 sm:px-10 lg:px-[8%]">
        {/* PROBLEM → … → OUTCOME rail */}
        <nav aria-label="Case study structure" className="thin-scroll -mx-5 mb-4 overflow-x-auto px-5">
          <ol className="flex min-w-max items-center gap-2 font-mono text-[10.5px] tracking-widest text-muted">
            {["PROBLEM", "ARCHITECTURE", "ENGINEERING", "TECHNOLOGIES", "CHALLENGES", "OUTCOME"].map((s, i, a) => (
              <li key={s} className="flex items-center gap-2">
                <a href={`#cs-${s.toLowerCase()}`} className="rounded-md px-2 py-1 hover:bg-paper-2 hover:text-ink">
                  {s}
                </a>
                {i < a.length - 1 && <span aria-hidden>→</span>}
              </li>
            ))}
          </ol>
        </nav>

        {/* Problem */}
        <section id="cs-problem" className="scroll-mt-24 grid gap-6 border-y border-line py-12 lg:grid-cols-2" aria-label="Problem and solution">
          <div>
            <div className="label">01 · PROBLEM</div>
            <p className="mt-3 text-lg leading-relaxed">{p.problem}</p>
          </div>
          <div>
            <div className="label">SOLUTION</div>
            <p className="mt-3 text-lg leading-relaxed text-ink-2">{p.solution}</p>
          </div>
        </section>

        {/* Three simultaneous views */}
        <section id="cs-architecture" className="scroll-mt-24 py-14" aria-label="Architecture views">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="label">02 · ARCHITECTURE</div>
              <h2 className="mt-2 font-display text-2xl font-bold sm:text-4xl">Three views of one system</h2>
            </div>
            <div role="tablist" aria-label="Choose a view" className="flex w-full rounded-2xl border border-line bg-card p-1 sm:w-auto">
              {VIEWS.map((v) => (
                <button key={v.id} role="tab" aria-selected={view === v.id} aria-controls="cs-view" onClick={() => setView(v.id)} className="relative flex-1 rounded-xl px-2.5 py-2 text-left sm:flex-none sm:px-4">
                  {view === v.id && <motion.span layoutId="cs-view-pill" className="absolute inset-0 rounded-xl" style={{ background: p.accent }} />}
                  <span className={`relative block font-mono text-[10px] font-semibold tracking-wider sm:text-[11px] ${view === v.id ? "text-white" : ""}`}>{v.label}</span>
                  <span className={`relative hidden text-[10px] sm:block ${view === v.id ? "text-white/70" : "text-muted"}`}>{v.hint}</span>
                </button>
              ))}
            </div>
          </div>
          <p className="mb-6 max-w-2xl text-ink-2">{p.views[view]}</p>
          <div id="cs-view" role="tabpanel" className="crop rounded-[24px] border border-line bg-card/50 p-3 sm:rounded-[28px] sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div key={view} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                {viz[view]}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* Signature interactive blocks */}
        <div id="cs-engineering" className="scroll-mt-24">
          <div className="label pt-6">03 · ENGINEERING</div>
          {viz.signature}
        </div>

        {/* Detail panel */}
        <section className="grid gap-5 py-14 lg:grid-cols-2" aria-label="Project details">
          <div className="panel-flat p-6 sm:p-8">
            <div className="label">WHAT I BUILT</div>
            <ul className="mt-4 space-y-2.5">
              {p.built.map((b, i) => (
                <motion.li key={b} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex gap-3 text-[15px]">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: p.accent }} />
                  {b}
                </motion.li>
              ))}
            </ul>
          </div>
          <div id="cs-technologies" className="panel-flat scroll-mt-24 p-6 sm:p-8">
            <div className="label">04 · TECHNOLOGIES → WHAT THEY DID</div>
            <ul className="mt-4 divide-y divide-line">
              {p.technologies.map((t) => (
                <li key={t.name} className="grid gap-1 py-2.5 sm:grid-cols-[180px_1fr] sm:gap-3">
                  <span className="font-display text-[13px] font-bold">{t.name}</span>
                  <span className="text-[13.5px] text-ink-2">
                    <span className="font-mono text-[9.5px] text-muted">USED FOR · </span>
                    {t.usedFor.join(" · ")}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div id="cs-challenges" className="panel-flat scroll-mt-24 p-6 sm:p-8">
            <div className="label">05 · ENGINEERING CHALLENGES</div>
            <ul className="mt-4 space-y-3">
              {p.challenges.map((c) => (
                <li key={c.problem} className="rounded-xl bg-paper-2/60 p-4">
                  <div className="font-mono text-[11px] text-rose">✕ {c.problem}</div>
                  <div className="mt-1 text-[14px]">
                    <span className="text-mint">✓</span> {c.approach}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div id="cs-outcome" className="scroll-mt-24 rounded-2xl p-6 text-white sm:p-8" style={{ background: "var(--ink)" }}>
            <div className="font-mono text-[11px] tracking-[0.14em] text-white/50">06 · OUTCOME</div>
            {p.metrics.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                {p.metrics.map((m) => (
                  <div key={m.label}>
                    <div className="font-display text-4xl font-extrabold" style={{ color: p.accent }}>
                      {m.value}
                    </div>
                    <div className="mt-1 font-mono text-[10px] tracking-wider text-white/60">{m.label.toUpperCase()}</div>
                  </div>
                ))}
              </div>
            )}
            <ul className="mt-5 space-y-2">
              {p.outcomes.map((o) => (
                <li key={o} className="flex gap-3 text-[15px] text-white/85">
                  <span style={{ color: p.accent }}>→</span>
                  {o}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Next / prev */}
        <nav aria-label="More case studies" className="grid gap-3 border-t border-line py-12 sm:grid-cols-2">
          {[
            ["← PREVIOUS", prev],
            ["NEXT →", next],
          ].map(([l, x]) => {
            const proj = x as Project;
            return (
              <Link key={String(l)} href={`/work/${proj.slug}`} className="group panel-flat relative overflow-hidden p-6 transition-transform hover:-translate-y-1">
                <span className="absolute inset-x-0 top-0 h-1" style={{ background: proj.accent }} />
                <div className="label">{String(l)}</div>
                <div className="mt-2 font-display text-3xl font-bold">{proj.name}</div>
                <div className="mt-1 text-sm text-ink-2">{proj.tagline}</div>
              </Link>
            );
          })}
        </nav>
      </div>
    </main>
  );
}
