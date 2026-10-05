"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import type { Project } from "@/data/projects";
import { ArchDiagram, Block, MockWindow, Pipeline } from "../primitives";

const HOPS = ["Asana event", "Webhook", "API", "Backend", "Database", "Application"];
const EVENTS = {
  "TASK COMPLETED": { effects: ["STATUS", "SYNC", "AUTOMATION"], payload: { resource_type: "task", action: "changed", field: "completed" } },
  "TIME LOGGED": { effects: ["TIME TRACKING", "SYNC"], payload: { resource_type: "task", action: "changed", field: "time_tracking" } },
  "TASK ASSIGNED": { effects: ["SYNC", "STATUS"], payload: { resource_type: "task", action: "changed", field: "assignee" } },
} as const;
type Ev = keyof typeof EVENTS;
const EFFECTS = ["TIME TRACKING", "SYNC", "STATUS", "AUTOMATION"];

function EventSim({ accent }: { accent: string }) {
  const [hop, setHop] = useState(-1);
  const [ev, setEv] = useState<Ev | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const timers = useRef<number[]>([]);

  const fire = (e: Ev) => {
    timers.current.forEach(clearTimeout);
    setEv(e);
    setHop(0);
    timers.current = HOPS.map((h, i) =>
      window.setTimeout(() => {
        setHop(i + 1);
        if (i === HOPS.length - 1) setLog((l) => [`${new Date().toLocaleTimeString()}  ${e} → ${EVENTS[e].effects.join(", ")}`, ...l].slice(0, 5));
      }, 420 * (i + 1)),
    );
  };

  const active = hop >= HOPS.length && ev ? EVENTS[ev].effects : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {(Object.keys(EVENTS) as Ev[]).map((e) => (
          <button key={e} onClick={() => fire(e)} className="rounded-xl border-2 px-4 py-2.5 font-display text-[12px] font-bold tracking-wider transition-transform hover:-translate-y-0.5" style={{ borderColor: accent, color: ev === e ? "#fff" : accent, background: ev === e ? accent : undefined }}>
            ⚡ {e}
          </button>
        ))}
      </div>

      {/* Physical event propagation */}
      <div className="relative">
        <ol className="grid grid-cols-1 gap-2 md:grid-cols-6">
          {HOPS.map((h, i) => {
            const lit = hop > i;
            const cur = hop === i + 1;
            return (
              <li key={h} className="relative">
                <motion.div
                  animate={{ scale: cur ? 1.08 : 1, borderColor: lit ? accent : "var(--line)", backgroundColor: cur ? accent : "var(--card)", color: cur ? "#fff" : "var(--ink)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 18 }}
                  className="rounded-2xl border-2 px-3 py-4 text-center font-mono text-[11px] font-semibold tracking-wider"
                >
                  {h.toUpperCase()}
                </motion.div>
                <AnimatePresence>
                  {cur && (
                    <motion.span
                      initial={{ scale: 0.6, opacity: 0.6 }}
                      animate={{ scale: 1.6, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6 }}
                      className="pointer-events-none absolute inset-0 rounded-2xl border-2"
                      style={{ borderColor: accent }}
                      aria-hidden
                    />
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="grid grid-cols-2 gap-2">
          {EFFECTS.map((f) => {
            const on = active.includes(f as never);
            return (
              <motion.div key={f} animate={{ backgroundColor: on ? "var(--mint)" : "var(--card)", color: on ? "#fff" : "var(--ink)", scale: on ? 1.03 : 1 }} className="rounded-2xl border border-line px-4 py-5 text-center font-display text-[13px] font-bold tracking-wider">
                {f}
                <div className="mt-1 font-mono text-[9px] font-normal opacity-70">{on ? "UPDATED" : "IDLE"}</div>
              </motion.div>
            );
          })}
        </div>
        <MockWindow title="webhook payload · event log" accent={accent} badge="SIMPLIFIED">
          <pre className="max-h-[120px] overflow-auto border-b border-line p-3 font-mono text-[11px] thin-scroll">{ev ? JSON.stringify({ events: [EVENTS[ev].payload] }, null, 2) : "// trigger an event"}</pre>
          <ul className="min-h-[90px] space-y-0.5 p-3 font-mono text-[10.5px] text-ink-2" aria-live="polite">
            {log.map((l, i) => (
              <motion.li key={l + i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}>
                {l}
              </motion.li>
            ))}
          </ul>
        </MockWindow>
      </div>
    </div>
  );
}

export default function Asana({ part, p }: { part: string; p: Project }) {
  if (part === "system") return <ArchDiagram layers={p.architecture} accent={p.accent} ring={["REST APIs", "Webhooks", "Event-driven"]} />;
  if (part === "flow") return <Pipeline steps={["Task completed", "Webhook", "Sync", "Status", "Automation"]} accent={p.accent} interval={900} />;
  if (part === "human")
    return (
      <MockWindow title="time-tracking / tasks" accent={p.accent} badge="ILLUSTRATIVE">
        <ul className="divide-y divide-line">
          {["Review requirements", "Build integration endpoint", "Demo to client"].map((t, i) => (
            <li key={t} className="flex items-center justify-between px-4 py-3 text-sm">
              <span className="flex items-center gap-2">
                <span className={`grid h-4 w-4 place-items-center rounded-full border text-[9px] ${i === 0 ? "border-mint bg-mint text-white" : "border-line"}`}>{i === 0 ? "✓" : ""}</span>
                {t}
              </span>
              <span className="font-mono text-[11px] text-muted">{i === 0 ? "synced from Asana" : "in progress"}</span>
            </li>
          ))}
        </ul>
        <div className="border-t border-line px-4 py-2 font-mono text-[10px] text-muted">Tasks and time entries stay current — no manual updates.</div>
      </MockWindow>
    );
  return (
    <Block k="A" title="Make events physical" intro="Trigger an Asana event and watch it travel through the system.">
      <EventSim accent={p.accent} />
    </Block>
  );
}
