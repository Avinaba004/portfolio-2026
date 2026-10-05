"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { skillGroups } from "@/data/profile";
import { projectsUsing } from "@/lib/skills";
import { useApp } from "@/components/system/AppProvider";

const GROUP_META: Record<string, { color: string; layer: string }> = {
  Languages: { color: "var(--ink)", layer: "FOUNDATION" },
  Frontend: { color: "var(--cobalt)", layer: "INTERFACE" },
  Backend: { color: "var(--violet)", layer: "SERVICES" },
  Databases: { color: "var(--mint)", layer: "DATA" },
  "Cloud & DevOps": { color: "var(--signal)", layer: "INFRASTRUCTURE" },
  "Auth & Security": { color: "var(--amber)", layer: "TRUST" },
  "AI / GenAI": { color: "var(--rose)", layer: "INTELLIGENCE" },
  Architecture: { color: "var(--cyan)", layer: "DESIGN" },
  "Testing & Tools": { color: "var(--muted)", layer: "QUALITY" },
};

/**
 * Every skill from the CV, grouped by system layer. Skills proven in a project are solid
 * and reveal where they were used; the rest are listed honestly as part of the toolkit.
 */
export function SkillAtlas() {
  const { sfx } = useApp();
  const [sel, setSel] = useState<string | null>("Python");
  const [provenOnly, setProvenOnly] = useState(false);

  const usage = useMemo(() => {
    const m = new Map<string, ReturnType<typeof projectsUsing>>();
    skillGroups.forEach((g) => g.items.forEach((s) => m.set(s, projectsUsing(s))));
    return m;
  }, []);
  const total = skillGroups.reduce((a, g) => a + g.items.length, 0);
  const proven = [...usage.values()].filter((v) => v.length).length;
  const selUsage = sel ? usage.get(sel) ?? [] : [];
  const selGroup = skillGroups.find((g) => sel && g.items.includes(sel));

  return (
    <div className="mt-20">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="label">SKILL ATLAS · FULL CV</div>
          <h3 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
            {total} skills, mapped to the layer they live in
          </h3>
          <p className="mt-2 max-w-xl text-sm text-ink-2">
            Solid chips are proven in a project on this site — select one to see where. Outlined chips are part of the toolkit.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-muted">
            {proven}/{total} PROVEN IN PROJECTS
          </span>
          <button onClick={() => setProvenOnly((v) => !v)} aria-pressed={provenOnly} className={`chip ${provenOnly ? "!border-ink !bg-ink !text-white" : ""}`}>
            {provenOnly ? "SHOWING PROVEN" : "SHOW PROVEN ONLY"}
          </button>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((g, gi) => {
            const meta = GROUP_META[g.label] ?? { color: "var(--ink)", layer: "" };
            const items = provenOnly ? g.items.filter((s) => usage.get(s)?.length) : g.items;
            return (
              <motion.section
                key={g.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: (gi % 3) * 0.06 }}
                className="panel-flat relative overflow-hidden p-4"
                aria-label={`${g.label} skills`}
              >
                <span className="absolute inset-x-0 top-0 h-1" style={{ background: meta.color }} />
                <div className="flex items-baseline justify-between gap-2">
                  <h4 className="font-display text-[13px] font-bold tracking-wide">{g.label}</h4>
                  <span className="font-mono text-[9px] tracking-widest text-muted">{meta.layer}</span>
                </div>
                <motion.ul layout className="mt-3 flex flex-wrap gap-1.5">
                  <AnimatePresence initial={false}>
                    {items.map((s) => {
                      const used = usage.get(s)?.length ?? 0;
                      const on = sel === s;
                      return (
                        <motion.li key={s} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                          <button
                            onClick={() => {
                              setSel(s);
                              sfx("tick");
                            }}
                            aria-pressed={on}
                            className="rounded-lg border px-2 py-1 text-[11.5px] transition-all hover:-translate-y-0.5"
                            style={{
                              borderColor: on ? "var(--ink)" : used ? meta.color : "var(--line)",
                              background: on ? "var(--ink)" : used ? `color-mix(in srgb, ${meta.color} 12%, var(--card))` : "transparent",
                              color: on ? "#fff" : "var(--ink)",
                            }}
                          >
                            {s}
                            {used > 0 && <sup className="ml-0.5 font-mono text-[8px] opacity-70">{used}</sup>}
                          </button>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </motion.ul>
              </motion.section>
            );
          })}
        </div>

        {/* Usage panel */}
        <aside className="panel !rounded-[24px] p-6 xl:sticky xl:top-28 xl:self-start" aria-live="polite">
          <AnimatePresence mode="wait">
            {sel && (
              <motion.div key={sel} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
                <div className="label">{selGroup?.label ?? "SKILL"}</div>
                <div className="mt-1 font-display text-2xl font-bold break-words">{sel}</div>
                {selUsage.length ? (
                  <>
                    <div className="mt-5 label">PROVEN IN</div>
                    <ul className="mt-2 space-y-2">
                      {selUsage.map((p) => (
                        <li key={p.slug}>
                          {p.category === "work" ? (
                            <Link href={`/work/${p.slug}`} className="group flex items-center justify-between gap-2 rounded-xl border border-line bg-card px-3 py-2 hover:border-ink">
                              <span>
                                <span className="font-display text-[13px] font-bold">{p.name}</span>
                                <span className="block text-[11.5px] text-ink-2">{p.tagline}</span>
                              </span>
                              <span className="text-muted transition-transform group-hover:translate-x-0.5">↗</span>
                            </Link>
                          ) : (
                            <a href={`/#lab-${p.slug}`} className="flex flex-col rounded-xl border border-dashed border-line-strong px-3 py-2 hover:border-ink">
                              <span className="font-display text-[13px] font-bold">{p.name} · LAB</span>
                              <span className="text-[11.5px] text-ink-2">{p.tagline}</span>
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p className="mt-4 text-sm text-ink-2">Part of the toolkit listed on the CV — not tied to a specific project shown on this site.</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </aside>
      </div>
    </div>
  );
}
