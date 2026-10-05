"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { incidents, type Incident } from "@/data/system";
import { Section, SectionHeader } from "@/components/ui/Section";
import { useApp } from "@/components/system/AppProvider";

const STAGES = ["PROBLEM", "INVESTIGATION", "SOLUTION", "RESOLVED"];

function Ticket({ inc, onOpen, resolved, i }: { inc: Incident; onOpen: () => void; resolved: boolean; i: number }) {
  const rot = ((i * 37) % 9) - 4;
  return (
    <motion.button
      onClick={onOpen}
      initial={{ opacity: 0, y: 30, rotate: rot * 2 }}
      whileInView={{ opacity: 1, y: 0, rotate: rot }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.08, type: "spring", stiffness: 120, damping: 14 }}
      whileHover={{ rotate: 0, scale: 1.04, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="group w-full max-w-[300px] cursor-pointer text-left lg:w-[260px]"
      aria-label={`Incident: ${inc.title} (${inc.project}). ${resolved ? "Resolved." : "Open."} Press to investigate.`}
    >
      <div className={`relative overflow-hidden rounded-2xl border bg-card shadow-[var(--shadow-md)] transition-colors ${resolved ? "border-mint/40" : "border-signal/30"}`}>
        <div className={`flex items-center justify-between px-4 py-2 font-mono text-[10px] tracking-widest text-white ${resolved ? "bg-mint" : "bg-signal"}`}>
          <span>{inc.code}</span>
          <span className="flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full bg-white ${resolved ? "" : "pulse-dot"}`} />
            {resolved ? "RESOLVED" : "OPEN"}
          </span>
        </div>
        <div className="px-4 py-4">
          <div className="font-display text-[15px] leading-tight font-bold">{inc.title}</div>
          <div className="mt-2 font-mono text-[10px] text-muted">PROJECT · {inc.project}</div>
          <div className="mt-3 font-mono text-[10px] tracking-wider text-ink-2 opacity-60 transition-opacity group-hover:opacity-100">INVESTIGATE →</div>
        </div>
        {/* tape */}
        <span className="absolute -top-1 left-1/2 h-4 w-14 -translate-x-1/2 rotate-2 bg-amber/30" aria-hidden />
      </div>
    </motion.button>
  );
}

function Investigation({ inc, onClose, onResolved }: { inc: Incident; onClose: () => void; onResolved: () => void }) {
  const [step, setStep] = useState(0);
  const { sfx } = useApp();
  const closeRef = useRef<HTMLButtonElement>(null);
  const cbs = useRef({ onClose, onResolved, sfx });
  useEffect(() => {
    cbs.current = { onClose, onResolved, sfx };
  });

  useEffect(() => {
    closeRef.current?.focus();
    const ids = inc.steps.map((_, i) => setTimeout(() => setStep(i + 1), 500 + i * 650));
    const done = setTimeout(() => {
      cbs.current.onResolved();
      cbs.current.sfx("success");
    }, 500 + inc.steps.length * 650);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && cbs.current.onClose();
    addEventListener("keydown", onKey);
    return () => {
      ids.forEach(clearTimeout);
      clearTimeout(done);
      removeEventListener("keydown", onKey);
    };
  }, [inc]);

  return (
    <motion.div className="fixed inset-0 z-[75] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <button className="absolute inset-0 bg-ink/25 backdrop-blur-sm" onClick={onClose} aria-label="Close investigation" tabIndex={-1} />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="inc-title"
        initial={{ y: 30, scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 20, scale: 0.97, opacity: 0 }}
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-line bg-card shadow-[var(--shadow-lg)]"
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <div>
            <div className="label">INCIDENT · {inc.project}</div>
            <h3 id="inc-title" className="mt-1 font-display text-xl font-bold">
              {inc.title}
            </h3>
          </div>
          <button ref={closeRef} onClick={onClose} className="chip">
            ESC ✕
          </button>
        </div>
        <div className="bp-grid-fine px-6 py-7">
          <div className="mb-6 grid grid-cols-4 gap-1.5">
            {STAGES.map((s, i) => {
              const on = step >= Math.round((i / 3) * inc.steps.length);
              return (
                <div key={s}>
                  <div className="h-1 overflow-hidden rounded bg-line">
                    <motion.div className={`h-full ${i === 3 ? "bg-mint" : "bg-signal"}`} initial={{ width: 0 }} animate={{ width: on ? "100%" : 0 }} />
                  </div>
                  <div className={`mt-1.5 font-mono text-[9px] tracking-widest ${on ? "text-ink" : "text-muted"}`}>{s}</div>
                </div>
              );
            })}
          </div>
          <ol className="space-y-2" aria-live="polite">
            {inc.steps.map((s, i) => (
              <motion.li
                key={s}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: step > i ? 1 : 0.25, x: step > i ? 0 : -12 }}
                className="flex items-center gap-3"
              >
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full font-mono text-[10px] ${
                    step > i ? (i === inc.steps.length - 1 ? "bg-mint text-white" : "bg-ink text-white") : "border border-line text-muted"
                  }`}
                >
                  {step > i ? (i === inc.steps.length - 1 ? "✓" : i + 1) : i + 1}
                </span>
                <span className={`rounded-xl border px-4 py-2.5 text-sm ${i === inc.steps.length - 1 && step > i ? "border-mint/40 bg-mint/10 font-medium" : "border-line bg-card"}`}>{s}</span>
              </motion.li>
            ))}
          </ol>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="label mr-1">TECHNOLOGY</span>
            {inc.tech.map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Incidents() {
  const [open, setOpen] = useState<Incident | null>(null);
  const [resolved, setResolved] = useState<Set<string>>(new Set());
  const room = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const { sfx } = useApp();

  return (
    <Section id="incidents" debug="ThingsThatBroke · DebugRoom" labelledBy="inc-h" className="bg-paper-2/60">
      <div className="bp-grid-fine pointer-events-none absolute inset-0 opacity-70" aria-hidden />
      <div className="relative">
        <SectionHeader
          index="03"
          kicker="THE DEBUGGING ROOM"
          title={
            <span id="inc-h">
              THINGS THAT <span className="text-signal">BROKE</span>
              <span className="ml-3 inline-block translate-y-[-0.4em] rounded-full border border-line bg-card px-3 py-1 align-middle font-mono text-xs tracking-normal text-muted">
                {resolved.size}/{incidents.length} RESOLVED
              </span>
            </span>
          }
          intro="Real problems from real integrations. Drag the incidents around. Open one to replay the investigation — from failure to fix."
        />

        {/* Desktop: free-floating, draggable incident tickets */}
        <div ref={room} className="relative hidden h-[580px] rounded-[28px] border border-dashed border-line-strong lg:block">
          <div className="absolute top-4 left-5 font-mono text-[10px] tracking-widest text-muted">INCIDENT BOARD · DRAG TO REARRANGE</div>
          {incidents.map((inc, i) => (
            <motion.div
              key={inc.id}
              drag
              dragConstraints={room}
              dragElastic={0.15}
              dragMomentum
              whileDrag={{ scale: 1.06, zIndex: 20, cursor: "grabbing" }}
              className="absolute cursor-grab"
              style={{ left: `min(${inc.x}%, calc(100% - 280px))`, top: `min(${inc.y}%, calc(100% - 190px))` }}
              onDragStart={() => {
                dragging.current = true;
                sfx("tick");
              }}
              onDragEnd={() => setTimeout(() => (dragging.current = false), 60)}
            >
              <Ticket inc={inc} i={i} resolved={resolved.has(inc.id)} onOpen={() => !dragging.current && setOpen(inc)} />
            </motion.div>
          ))}
        </div>

        {/* Mobile: stacked tickets */}
        <div className="grid justify-items-center gap-4 sm:grid-cols-2 lg:hidden">
          {incidents.map((inc, i) => (
            <Ticket key={inc.id} inc={inc} i={i} resolved={resolved.has(inc.id)} onOpen={() => setOpen(inc)} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <Investigation
            key={open.id}
            inc={open}
            onClose={() => setOpen(null)}
            onResolved={() => setResolved((r) => new Set(r).add(open.id))}
          />
        )}
      </AnimatePresence>
    </Section>
  );
}
