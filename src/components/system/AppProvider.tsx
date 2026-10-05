"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { MotionConfig } from "motion/react";
import { playSfx, type Sfx } from "@/lib/sound";

type AppState = {
  paletteOpen: boolean;
  setPaletteOpen: (v: boolean) => void;
  soundOn: boolean;
  toggleSound: () => void;
  debug: boolean;
  toggleDebug: () => void;
  sfx: (s: Sfx) => void;
  /** Fires a transient system toast (used by easter eggs). */
  toast: string | null;
  showToast: (msg: string) => void;
  /** Konami / sudo celebratory pulse counter. */
  pulse: number;
  firePulse: () => void;
};

const Ctx = createContext<AppState | null>(null);

const readStored = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};
const writeStored = (key: string, v: string) => {
  try {
    localStorage.setItem(key, v);
  } catch {
    /* storage unavailable */
  }
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [debug, setDebug] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    // Hydrate the persisted sound preference after mount (default OFF).
    const stored = readStored("ag-sound") === "on";
    if (stored) queueMicrotask(() => setSoundOn(true));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("debug", debug);
  }, [debug]);

  const sfx = useCallback((s: Sfx) => soundOn && playSfx(s), [soundOn]);

  const toggleSound = useCallback(() => {
    setSoundOn((v) => {
      writeStored("ag-sound", v ? "off" : "on");
      if (!v) playSfx("success");
      return !v;
    });
  }, []);

  const toggleDebug = useCallback(() => setDebug((d) => !d), []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast((t) => (t === msg ? null : t)), 2600);
  }, []);

  const firePulse = useCallback(() => setPulse((p) => p + 1), []);

  const value = useMemo(
    () => ({ paletteOpen, setPaletteOpen, soundOn, toggleSound, debug, toggleDebug, sfx, toast, showToast, pulse, firePulse }),
    [paletteOpen, soundOn, toggleSound, debug, toggleDebug, sfx, toast, showToast, pulse, firePulse],
  );

  return (
    <Ctx.Provider value={value}>
      <MotionConfig reducedMotion="user" transition={{ type: "spring", stiffness: 260, damping: 30 }}>
        {children}
      </MotionConfig>
    </Ctx.Provider>
  );
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be used inside AppProvider");
  return v;
}
