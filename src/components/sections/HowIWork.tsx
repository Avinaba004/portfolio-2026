"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { workStages } from "@/data/system";
import { Section, SectionHeader } from "@/components/ui/Section";
import { useInterval, useReducedMotionPref } from "@/lib/hooks";

export function HowIWork() {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-20%" });
  const reduced = useReducedMotionPref();

  useInterval(() => setI((v) => (v + 1) % workStages.length), auto && inView && !reduced ? 2600 : null);

  const s = workStages[i];

  return (
    <Section id="process" debug="HowIWork · DeliveryLoop" labelledBy="proc-h" className="bg-ink text-white">
      <div className="bp-grid pointer-events-none absolute inset-0 opacity-[0.07] invert" aria-hidden />
      <div ref={ref} className="relative">
        <div className="[&_.label]:!text-white/50 [&_p]:!text-white/70">
          <SectionHeader
            index="05"
            kicker="HOW I ACTUALLY WORK"
            title={
              <span id="proc-h">
                Requirement in.
                <br />
                <span className="text-signal">Delivered system</span> out.
              </span>
            }
            intro="I don't code in isolation. I sit between the client's problem and the running system — from the first requirement call to the demo, and back again."
          />
        </div>

        {/* Stage rail */}
        <div className="relative">
          <div className="thin-scroll -mx-5 overflow-x-auto px-5 pb-3 sm:mx-0 sm:px-0">
            <ol className="flex min-w-max gap-1.5 sm:min-w-0 sm:grid sm:grid-cols-5 lg:grid-cols-10" role="tablist" aria-label="Delivery stages">
              {workStages.map((st, k) => (
                <li key={st.stage} role="presentation">
                  <button
                    role="tab"
                    aria-selected={k === i}
                    onClick={() => {
                      setI(k);
                      setAuto(false);
                    }}
                    className={`relative w-full overflow-hidden rounded-xl border px-3 py-3 text-left transition-colors ${
                      k === i ? "border-signal bg-signal text-white" : k < i ? "border-white/20 bg-white/10 text-white" : "border-white/10 text-white/50 hover:text-white"
                    }`}
                  >
                    <div className="font-mono text-[9px] opacity-70">{String(k + 1).padStart(2, "0")}</div>
                    <div className="mt-1 font-display text-[10px] leading-tight font-semibold tracking-wider whitespace-nowrap sm:whitespace-normal">{st.stage}</div>
                    {k === i && auto && !reduced && (
                      <motion.span key={i} className="absolute bottom-0 left-0 h-0.5 bg-white" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 2.6, ease: "linear" }} />
                    )}
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              role="tabpanel"
              initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
              transition={{ duration: 0.35 }}
              className="min-w-0 rounded-[28px] border border-white/10 bg-white/[0.04] p-6 sm:p-10"
            >
              <div className="font-mono text-xs text-signal">STAGE {String(i + 1).padStart(2, "0")} / 10</div>
              <div className="mt-3 font-display text-2xl font-bold break-words sm:text-5xl">{s.stage}</div>
              <div className="mt-6 flex items-center gap-3">
                <span className="text-signal">→</span>
                <span className="text-xl font-medium sm:text-2xl">{s.example}</span>
              </div>
              <p className="mt-4 max-w-lg text-white/65">{s.detail}</p>
            </motion.div>
          </AnimatePresence>

          {/* Loop diagram */}
          <div className="relative hidden aspect-square max-h-[380px] w-full justify-self-center lg:block" aria-hidden>
            <svg viewBox="0 0 200 200" className="h-full w-full">
              <circle cx="100" cy="100" r="78" fill="none" stroke="rgba(255,255,255,.12)" strokeDasharray="2 4" />
              {workStages.map((st, k) => {
                const a = (k / workStages.length) * Math.PI * 2 - Math.PI / 2;
                const x = 100 + Math.cos(a) * 78;
                const y = 100 + Math.sin(a) * 78;
                return (
                  <g key={st.stage}>
                    <motion.circle cx={x} cy={y} animate={{ r: k === i ? 7 : 3.5, fill: k === i ? "#ff4d17" : k < i ? "#fff" : "rgba(255,255,255,.3)" }} />
                    {k === i && (
                      <text x={x} y={y + (y > 100 ? 18 : -12)} textAnchor="middle" fill="#fff" fontSize="7" fontFamily="monospace">
                        {st.stage}
                      </text>
                    )}
                  </g>
                );
              })}
              <text x="100" y="96" textAnchor="middle" fill="rgba(255,255,255,.5)" fontSize="7" fontFamily="monospace" letterSpacing="2">
                DELIVERY
              </text>
              <text x="100" y="110" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700">
                LOOP
              </text>
            </svg>
          </div>
        </div>
        <p className="mt-6 font-mono text-[11px] text-white/40">Forward-deployed by nature: client requirement → demo → iterate.</p>
      </div>
    </Section>
  );
}
