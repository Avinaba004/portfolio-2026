"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useInterval, useReducedMotionPref } from "@/lib/hooks";

/* ---------- Mock application window ---------- */
export function MockWindow({ title, children, accent = "var(--ink)", className = "", badge }: { title: string; children: React.ReactNode; accent?: string; className?: string; badge?: string }) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-line bg-card shadow-[var(--shadow-md)] ${className}`}>
      <div className="flex items-center gap-2 border-b border-line bg-paper/70 px-3.5 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
        <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: accent }} />
        <span className="ml-2 truncate font-mono text-[10.5px] text-muted">{title}</span>
        {badge && <span className="ml-auto rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[9px] text-muted">{badge}</span>}
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

/* ---------- Animated pipeline (auto-steps; vertical on mobile, horizontal on desktop) ---------- */
export function Pipeline({
  steps,
  accent,
  active: controlled,
  onStep,
  interval = 1100,
  compact,
  render,
}: {
  steps: string[];
  accent: string;
  active?: number;
  onStep?: (i: number) => void;
  interval?: number;
  compact?: boolean;
  render?: (s: string, i: number, on: boolean) => React.ReactNode;
}) {
  const reduced = useReducedMotionPref();
  const [inner, setInner] = useState(0);
  const active = controlled ?? inner;
  useInterval(
    () => {
      const n = (active + 1) % steps.length;
      setInner(n);
      onStep?.(n);
    },
    controlled === undefined && !reduced ? interval : null,
  );

  return (
    <ol className={`flex flex-col gap-1.5 ${steps.length > 6 ? "xl:flex-row xl:items-stretch xl:gap-0" : steps.length > 4 ? "lg:flex-row lg:items-stretch lg:gap-0" : "md:flex-row md:items-stretch md:gap-0"} ${compact ? "" : ""}`}>
      {steps.map((s, i) => {
        const on = i <= active;
        const cur = i === active;
        return (
          <li key={s + i} className={`flex flex-col items-center ${steps.length > 6 ? "xl:flex-1 xl:flex-row" : steps.length > 4 ? "lg:flex-1 lg:flex-row" : "md:flex-1 md:flex-row"}`}>
            <motion.div
              animate={{ borderColor: on ? accent : "var(--line)", backgroundColor: cur ? accent : on ? "var(--card)" : "var(--paper)", color: cur ? "#fff" : on ? "var(--ink)" : "var(--muted)", scale: cur ? 1.04 : 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="w-full rounded-xl border px-3 py-2.5 text-center font-mono text-[10.5px] font-medium tracking-wider md:min-h-[54px] md:content-center"
            >
              {render ? render(s, i, on) : s.toUpperCase()}
            </motion.div>
            {i < steps.length - 1 && (
              <div className={`relative flex h-5 w-full items-center justify-center ${steps.length > 6 ? "xl:h-auto xl:w-6 xl:shrink-0" : steps.length > 4 ? "lg:h-auto lg:w-6 lg:shrink-0" : "md:h-auto md:w-6 md:shrink-0"}`} aria-hidden>
                <div className={`h-full w-px bg-line ${steps.length > 6 ? "xl:h-px xl:w-full" : steps.length > 4 ? "lg:h-px lg:w-full" : "md:h-px md:w-full"}`} />
                {i === active && !reduced && (
                  <motion.span
                    className="absolute h-2 w-2 rounded-full"
                    style={{ background: accent }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: interval / 1000, repeat: Infinity }}
                  />
                )}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

/* ---------- Layered architecture diagram with side annotations ---------- */
export function ArchDiagram({
  layers,
  accent,
  ring = [],
  notes = {},
}: {
  layers: string[];
  accent: string;
  ring?: string[];
  notes?: Record<string, string>;
}) {
  const reduced = useReducedMotionPref();
  const [hover, setHover] = useState<string | null>(null);
  return (
    <div className="relative grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-center">
      {/* left ring */}
      <ul className="order-2 flex flex-wrap justify-center gap-1.5 md:order-1 md:flex-col md:items-end">
        {ring.slice(0, Math.ceil(ring.length / 2)).map((r, i) => (
          <motion.li key={r} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.06 }} className="chip !text-[10px]" style={{ borderColor: accent }}>
            {r}
          </motion.li>
        ))}
      </ul>

      <ol className="order-1 mx-auto flex w-full max-w-[340px] flex-col items-center md:order-2">
        {layers.map((l, i) => (
          <li key={l} className="flex w-full flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 14, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 160, damping: 18 }}
              onPointerEnter={() => setHover(l)}
              onPointerLeave={() => setHover(null)}
              tabIndex={notes[l] ? 0 : -1}
              onFocus={() => setHover(l)}
              onBlur={() => setHover(null)}
              className="relative w-full rounded-2xl border bg-card px-5 py-3.5 text-center shadow-[var(--shadow-sm)] transition-shadow hover:shadow-[var(--shadow-md)]"
              style={{ borderColor: hover === l ? accent : "var(--line)" }}
            >
              <span className="absolute top-1/2 left-3 -translate-y-1/2 font-mono text-[9px] text-muted">L{i + 1}</span>
              <span className="font-display text-[13px] font-bold tracking-wider">{l.toUpperCase()}</span>
              <AnimatePresence>
                {hover === l && notes[l] && (
                  <motion.span initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="block overflow-hidden text-[11.5px] text-ink-2">
                    <span className="block pt-1">{notes[l]}</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
            {i < layers.length - 1 && (
              <div className="relative h-7 w-px bg-line" aria-hidden>
                {!reduced && (
                  <motion.span
                    className="absolute -left-[3px] h-[7px] w-[7px] rounded-full"
                    style={{ background: accent }}
                    animate={{ top: ["-10%", "100%"], opacity: [0, 1, 0] }}
                    transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.25, ease: "easeInOut" }}
                  />
                )}
              </div>
            )}
          </li>
        ))}
      </ol>

      <ul className="order-3 flex flex-wrap justify-center gap-1.5 md:flex-col md:items-start">
        {ring.slice(Math.ceil(ring.length / 2)).map((r, i) => (
          <motion.li key={r} initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.06 }} className="chip !text-[10px]" style={{ borderColor: accent }}>
            {r}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Clickable workflow state machine ---------- */
export type WfState = { id: string; label: string; role: string; actions: string[]; tone?: "ok" | "bad" | "warn" };

export function StateMachine({ states, accent, edges }: { states: WfState[]; accent: string; edges?: [string, string][] }) {
  const [sel, setSel] = useState(states[0].id);
  const s = states.find((x) => x.id === sel)!;
  const toneColor = (t?: string) => (t === "ok" ? "var(--mint)" : t === "bad" ? "var(--rose)" : t === "warn" ? "var(--amber)" : accent);
  const next = edges ? edges.filter(([a]) => a === sel).map(([, b]) => b) : [states[states.findIndex((x) => x.id === sel) + 1]?.id].filter(Boolean);

  return (
    <div className="grid gap-5 md:grid-cols-[1fr_1fr]">
      <div role="tablist" aria-label="Workflow states" className="flex flex-col gap-1">
        {states.map((st, i) => {
          const on = st.id === sel;
          const isNext = next.includes(st.id);
          return (
            <div key={st.id} className="flex flex-col items-start">
              <button
                role="tab"
                aria-selected={on}
                onClick={() => setSel(st.id)}
                className="group relative flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors"
                style={{ borderColor: on ? toneColor(st.tone) : isNext ? "var(--line-strong)" : "var(--line)", background: on ? toneColor(st.tone) : "var(--card)", color: on ? "#fff" : "var(--ink)" }}
              >
                <span className="font-mono text-[10px] opacity-60">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-display text-sm font-bold tracking-wider">{st.label}</span>
                {isNext && !on && <span className="ml-auto font-mono text-[9px] text-muted">NEXT →</span>}
              </button>
              {i < states.length - 1 && <span className="ml-6 h-2 w-px bg-line" aria-hidden />}
            </div>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={sel} role="tabpanel" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="panel-flat self-start p-6">
          <div className="label">STATE</div>
          <div className="mt-1 font-display text-2xl font-bold" style={{ color: toneColor(s.tone) }}>
            {s.label}
          </div>
          <div className="mt-5 label">ROLE</div>
          <div className="mt-1 text-[15px] font-medium">{s.role}</div>
          <div className="mt-5 label">ACTIONS</div>
          <ul className="mt-2 space-y-1.5">
            {s.actions.map((a) => (
              <li key={a} className="flex items-center gap-2 text-sm">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
                {a}
              </li>
            ))}
          </ul>
          <p className="mt-5 font-mono text-[10px] text-muted">Every action is checked against RBAC before it runs.</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ---------- Animated counter ---------- */
export function Counter({ to, duration = 1.4, suffix = "" }: { to: number; duration?: number; suffix?: string }) {
  const [v, setV] = useState(0);
  const reduced = useReducedMotionPref();
  useEffect(() => {
    if (reduced) {
      queueMicrotask(() => setV(to));
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / (duration * 1000));
      setV(Math.round(to * (1 - (1 - k) ** 3)));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration, reduced]);
  return (
    <>
      {v}
      {suffix}
    </>
  );
}

/* ---------- Section block inside a case study ---------- */
export function Block({ k, title, children, intro }: { k: string; title: string; intro?: string; children: React.ReactNode }) {
  return (
    <section className="py-14 sm:py-20" aria-label={title}>
      <div className="mb-8 flex items-baseline gap-3">
        <span className="font-mono text-xs text-signal">{k}</span>
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      </div>
      {intro && <p className="-mt-4 mb-8 max-w-2xl text-ink-2">{intro}</p>}
      {children}
    </section>
  );
}
