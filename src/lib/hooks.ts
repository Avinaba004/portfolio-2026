"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/** SSR-safe media query subscription. Returns `fallback` on the server. */
export function useMediaQuery(query: string, fallback = false) {
  return useSyncExternalStore(
    (cb) => {
      const mq = matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => matchMedia(query).matches,
    () => fallback,
  );
}

export const useReducedMotionPref = () => useMediaQuery("(prefers-reduced-motion: reduce)");

/** Mouse/trackpad devices. Touch phones & tablets get lighter, GPU-friendly effects. */
export const useFinePointer = () => useMediaQuery("(hover: hover) and (pointer: fine)", true);

/** True once the element has come near the viewport (mount-once lazy loading). */
export function useNearView<T extends Element>(margin = "300px") {
  const ref = useRef<T>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || near) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin, near]);
  return [ref, near] as const;
}

/** Runs `cb` every `ms` while `active`. */
export function useInterval(cb: () => void, ms: number | null) {
  const saved = useRef(cb);
  useEffect(() => {
    saved.current = cb;
  }, [cb]);
  useEffect(() => {
    if (ms === null) return;
    const id = setInterval(() => saved.current(), ms);
    return () => clearInterval(id);
  }, [ms]);
}
