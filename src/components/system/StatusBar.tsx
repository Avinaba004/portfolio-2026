"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { allProjects } from "@/data/projects";
import { useApp } from "./AppProvider";

const rows = [
  ["SYSTEM STATUS", "ONLINE", "var(--mint)"],
  ["PROJECTS", String(allProjects.length), "var(--ink)"],
  ["SYSTEMS BUILT", "ACTIVE", "var(--cobalt)"],
  ["AI PIPELINES", "ACTIVE", "var(--violet)"],
  ["CLOUD", "CONNECTED", "var(--signal)"],
] as const;

function Clock() {
  const [t, setT] = useState("");
  useEffect(() => {
    const tick = () =>
      setT(
        new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(new Date()),
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span suppressHydrationWarning>{t || "--:--:--"}</span>;
}

/** Decorative interface indicators — part of the portfolio UI, not live telemetry. */
export function StatusBar() {
  const [open, setOpen] = useState(false);
  const { toast, debug } = useApp();
  const pathname = usePathname();
  const [pastHero, setPastHero] = useState(false);

  // Keep the hero clean: the status panel appears once you've scrolled past it.
  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);
  const visible = pathname !== "/" || pastHero;

  return (
    <>
      <aside
        aria-label="Portfolio interface status (decorative)"
        className={`no-print fixed bottom-4 left-4 z-40 hidden transition-all duration-300 xl:block ${visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}
      >
        <motion.div layout className="panel overflow-hidden !rounded-xl font-mono text-[10px]">
          <button onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex w-full items-center gap-2 px-3 py-2 text-left">
            <span className="h-1.5 w-1.5 rounded-full bg-mint pulse-dot" aria-hidden />
            <span className="tracking-[0.14em] text-ink-2">AG-OS</span>
            <span className="ml-auto text-muted">
              IST <Clock />
            </span>
            <span className="text-muted" aria-hidden>
              {open ? "–" : "+"}
            </span>
          </button>
          <AnimatePresence initial={false}>
            {open && (
              <motion.dl initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="border-t border-line px-3">
                <div className="space-y-1 py-2">
                  {rows.map(([k, v, c]) => (
                    <div key={k} className="flex w-52 justify-between gap-4">
                      <dt className="text-muted">{k}</dt>
                      <dd style={{ color: c }} className="font-semibold">
                        {v}
                      </dd>
                    </div>
                  ))}
                  {debug && (
                    <div className="flex w-52 justify-between gap-4">
                      <dt className="text-muted">DEBUG</dt>
                      <dd className="font-semibold text-cobalt">ENABLED</dd>
                    </div>
                  )}
                </div>
                <p className="border-t border-line py-1.5 text-[9px] text-muted">interface indicators · not live telemetry</p>
              </motion.dl>
            )}
          </AnimatePresence>
        </motion.div>
      </aside>

      <div aria-live="polite" className="no-print pointer-events-none fixed inset-x-0 bottom-6 z-[95] flex justify-center px-4">
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 10, opacity: 0 }}
              className="rounded-xl bg-ink px-4 py-2.5 font-mono text-xs tracking-wider text-white shadow-[var(--shadow-lg)]"
            >
              <span className="text-signal">●</span> {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
