"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { commands, fuzzyScore, type Command } from "@/lib/commands";
import { useRunCommand } from "@/lib/navigate";
import { useApp } from "./AppProvider";

export function CommandPalette() {
  const { paletteOpen, setPaletteOpen, sfx } = useApp();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);
  const run = useRunCommand();

  // Global shortcut: Ctrl/Cmd + K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(!paletteOpen);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paletteOpen, setPaletteOpen]);

  useEffect(() => {
    if (paletteOpen) {
      restoreFocus.current = document.activeElement as HTMLElement;
      sfx("open");
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      restoreFocus.current?.focus?.();
    }
  }, [paletteOpen, sfx]);

  const results = useMemo(() => {
    return commands
      .map((c) => ({ c, s: fuzzyScore(query, `${c.label} ${c.keywords ?? ""} ${c.hint ?? ""}`) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .map((r) => r.c);
  }, [query]);

  const close = () => {
    setPaletteOpen(false);
    setQuery("");
    setActive(0);
  };

  const exec = (c: Command) => {
    sfx("select");
    close();
    run(c.run);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % Math.max(results.length, 1));
      sfx("tick");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a - 1 + results.length) % Math.max(results.length, 1));
      sfx("tick");
    } else if (e.key === "Enter") {
      e.preventDefault();
      const c = results[active];
      if (c) exec(c);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "Tab") {
      e.preventDefault(); // keep focus trapped in the input
    }
  };

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return (
    <AnimatePresence>
      {paletteOpen && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-start justify-center px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <button aria-label="Close command palette" className="absolute inset-0 cursor-default bg-ink/20 backdrop-blur-[3px]" onClick={close} tabIndex={-1} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="panel relative w-full max-w-xl overflow-hidden !rounded-2xl !bg-card"
            initial={{ y: -16, scale: 0.97, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: -8, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            onKeyDown={onKeyDown}
          >
            <div className="flex items-center gap-3 border-b border-line px-4 py-3.5">
              <span className="font-mono text-signal" aria-hidden>
                ⌘
              </span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                placeholder="Type a command or search…"
                className="w-full bg-transparent text-[15px] outline-none placeholder:text-muted"
                role="combobox"
                aria-expanded="true"
                aria-controls="palette-list"
                aria-activedescendant={results[active] ? `cmd-${results[active].id}` : undefined}
                aria-autocomplete="list"
              />
              <kbd className="chip !py-0.5">ESC</kbd>
            </div>
            <ul ref={listRef} id="palette-list" role="listbox" className="thin-scroll max-h-[52vh] overflow-y-auto p-2">
              {results.length === 0 && <li className="px-3 py-8 text-center text-sm text-muted">No matching command.</li>}
              {results.map((c, i) => {
                const header = !query && c.group !== results[i - 1]?.group;
                return (
                  <li key={c.id} role="presentation">
                    {header && <div className="label px-3 pt-3 pb-1.5">{c.group}</div>}
                    <div
                      id={`cmd-${c.id}`}
                      role="option"
                      aria-selected={i === active}
                      data-index={i}
                      onMouseMove={() => setActive(i)}
                      onClick={() => exec(c)}
                      className={`relative flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors ${
                        i === active ? "text-white" : "text-ink-2"
                      }`}
                    >
                      {i === active && (
                        <motion.span layoutId="palette-active" className="absolute inset-0 rounded-xl bg-ink" transition={{ type: "spring", stiffness: 600, damping: 40 }} />
                      )}
                      <span className="relative font-medium">{c.label}</span>
                      {c.hint && <span className={`relative font-mono text-[11px] ${i === active ? "text-white/60" : "text-muted"}`}>{c.hint}</span>}
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="flex items-center gap-4 border-t border-line px-4 py-2.5 font-mono text-[10.5px] text-muted">
              <span>↑↓ navigate</span>
              <span>↵ open</span>
              <span className="ml-auto">AG-OS command center</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
