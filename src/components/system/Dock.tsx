"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { sections } from "@/lib/commands";
import { scrollToSection } from "@/lib/navigate";
import { useApp } from "./AppProvider";

export function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Avinaba Ghosh — system logo"
      className="group relative grid h-9 w-9 place-items-center rounded-xl bg-ink text-white shadow-[var(--shadow-sm)]"
    >
      <svg viewBox="0 0 32 32" className="h-5 w-5" aria-hidden>
        <path d="M6 25 L14 7 L22 25" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinejoin="round" />
        <path d="M9.5 18 H18.5" stroke="var(--signal)" strokeWidth="2.6" />
        <circle cx="25" cy="10" r="2.6" fill="var(--signal)" className="pulse-dot origin-center" />
      </svg>
    </button>
  );
}

export function Dock() {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";
  const { setPaletteOpen, soundOn, toggleSound, toggleDebug, debug, showToast, sfx } = useApp();
  const [active, setActive] = useState<string>("system");
  const [menu, setMenu] = useState(false);
  const clicks = useRef<number[]>([]);

  // Track which section is in view
  useEffect(() => {
    if (!isHome) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [isHome]);

  // Secret: click the logo 5 times quickly → DEBUG MODE
  const onLogo = () => {
    const now = performance.now();
    clicks.current = [...clicks.current.filter((t) => now - t < 1600), now];
    if (clicks.current.length >= 5) {
      clicks.current = [];
      toggleDebug();
      sfx("success");
      showToast(debug ? "DEBUG MODE · OFF" : "DEBUG MODE · ON — architecture layer visible");
      return;
    }
    if (isHome) scrollToSection("system");
  };

  const go = (id: string) => {
    setMenu(false);
    sfx("tick");
    if (isHome) scrollToSection(id);
    else router.push(`/#${id}`);
  };

  return (
    <>
      <header className="no-print fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3">
        <nav aria-label="System map" className="panel flex w-full max-w-6xl items-center gap-2 !rounded-2xl px-2 py-2">
          {isHome ? (
            <Logo onClick={onLogo} />
          ) : (
            <Link href="/" aria-label="Back to system home" className="grid h-9 w-9 place-items-center rounded-xl bg-ink text-white">
              <span aria-hidden>←</span>
            </Link>
          )}
          <div className="mr-1 hidden leading-tight sm:block">
            <div className="font-display text-[12px] font-semibold tracking-wide">AVINABA.SYS</div>
            <div className="font-mono text-[9.5px] text-muted">v2026.10 · engineering OS</div>
          </div>

          <ul className="mx-auto hidden items-center gap-0.5 xl:flex">
            {sections.map((s, i) => {
              const on = isHome && active === s.id;
              return (
                <li key={s.id}>
                  <button
                    onClick={() => go(s.id)}
                    aria-current={on ? "true" : undefined}
                    className={`relative rounded-lg px-2.5 py-1.5 font-mono text-[10.5px] tracking-[0.12em] transition-colors ${on ? "text-white" : "text-ink-2 hover:text-ink"}`}
                  >
                    {on && <motion.span layoutId="dock-active" className="absolute inset-0 rounded-lg bg-ink" />}
                    <span className="relative">
                      <span className={on ? "text-signal" : "text-muted"}>{String(i).padStart(2, "0")}</span> {s.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="ml-auto flex items-center gap-1.5 xl:ml-0">
            <button
              onClick={toggleSound}
              aria-pressed={soundOn}
              aria-label={soundOn ? "Turn UI sounds off" : "Turn UI sounds on"}
              className="grid h-9 w-9 place-items-center rounded-xl border border-line text-ink-2 hover:bg-paper-2"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <path d="M4 9v6h4l5 4V5L8 9H4z" strokeLinejoin="round" />
                {soundOn ? <path d="M16.5 8.5a5 5 0 010 7M19 6a8.5 8.5 0 010 12" strokeLinecap="round" /> : <path d="M17 9l5 6M22 9l-5 6" strokeLinecap="round" />}
              </svg>
            </button>
            <Link
              href={pathname === "/resume" ? "/" : "/resume"}
              className="hidden h-9 items-center rounded-xl border border-line px-3 font-mono text-[10.5px] tracking-widest text-ink-2 hover:bg-paper-2 sm:flex"
            >
              {pathname === "/resume" ? "VISUAL MODE" : "RESUME MODE"}
            </Link>
            <button
              onClick={() => setPaletteOpen(true)}
              className="flex h-9 items-center gap-2 rounded-xl bg-ink px-3 font-mono text-[11px] text-white"
              aria-label="Open command palette (Ctrl or Cmd + K)"
            >
              <span className="text-signal">⌘K</span>
              <span className="hidden sm:inline">COMMAND</span>
            </button>
            <button
              onClick={() => setMenu(true)}
              className="grid h-9 w-9 place-items-center rounded-xl border border-line xl:hidden"
              aria-label="Open system map"
              aria-expanded={menu}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <circle cx="6" cy="6" r="2" />
                <circle cx="18" cy="6" r="2" />
                <circle cx="12" cy="18" r="2" />
                <path d="M7.5 7.5l3.5 9M16.5 7.5l-3.5 9M8 6h8" />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile system map */}
      <AnimatePresence>
        {menu && (
          <motion.div
            className="no-print fixed inset-0 z-[60] overflow-y-auto bg-paper/95 backdrop-blur-xl xl:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="System map navigation"
          >
            <div className="bp-grid absolute inset-0 opacity-60 mask-fade" aria-hidden />
            <div className="relative mx-auto flex min-h-full max-w-xl flex-col px-6 pt-6 pb-10">
              <div className="flex items-center justify-between">
                <span className="label">SYSTEM MAP</span>
                <button onClick={() => setMenu(false)} className="chip" autoFocus>
                  CLOSE ✕
                </button>
              </div>
              <ol className="mt-8 flex flex-1 flex-col justify-center">
                {sections.map((s, i) => (
                  <motion.li key={s.id} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.03 }} className="relative border-l border-line-strong pl-6">
                    <span className="absolute top-1/2 -left-[5px] h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-ink bg-paper" aria-hidden />
                    <button onClick={() => go(s.id)} className="flex w-full items-baseline gap-3 py-2.5 text-left">
                      <span className="font-mono text-xs text-signal">{String(i).padStart(2, "0")}</span>
                      <span className="font-display text-xl font-semibold sm:text-2xl">{s.label}</span>
                    </button>
                  </motion.li>
                ))}
              </ol>
              <Link href="/resume" onClick={() => setMenu(false)} className="chip justify-center !py-3">
                RESUME MODE →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
