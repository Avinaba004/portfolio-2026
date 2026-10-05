"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Flight } from "@/app/api/flights/route";
import { useApp } from "@/components/system/AppProvider";

const TILE = 256;
const CENTER = { lat: 23.25, lon: 88.25 };

const project = (lat: number, lon: number, z: number) => {
  const s = TILE * 2 ** z;
  const x = ((lon + 180) / 360) * s;
  const r = (lat * Math.PI) / 180;
  const y = ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * s;
  return { x, y };
};

/** Clearly-labelled simulated traffic for when the live feed is unavailable. */
function simulate(): Flight[] {
  return Array.from({ length: 14 }, (_, i) => {
    const a = (i * 137.5 * Math.PI) / 180;
    return {
      id: `sim${i}`,
      callsign: `SIM-${String(i + 1).padStart(2, "0")}`,
      country: "Simulation",
      lat: CENTER.lat + Math.sin(a) * (0.6 + (i % 5) * 0.4),
      lon: CENTER.lon + Math.cos(a) * (0.8 + (i % 4) * 0.5),
      altitude: 3000 + ((i * 1777) % 9000),
      velocity: 180 + ((i * 23) % 70),
      heading: (i * 53) % 360,
      onGround: false,
    };
  });
}

type Live = { mode: "loading" | "live" | "sim"; flights: Flight[]; time?: number };

export default function SkyWatch() {
  const { sfx } = useApp();
  const wrap = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 800, h: 460 });
  const [zoom, setZoom] = useState(7);
  const [center, setCenter] = useState(CENTER);
  const [data, setData] = useState<Live>({ mode: "loading", flights: [] });
  const [sel, setSel] = useState<string | null>(null);
  const positions = useRef(new Map<string, { lat: number; lon: number }>());
  // Render-safe snapshot of the mutable positions (refreshed ~30fps).
  const [snap, setSnap] = useState(() => new Map<string, { lat: number; lon: number }>());
  const drag = useRef<{ x: number; y: number; c: typeof CENTER } | null>(null);

  const [onScreen, setOnScreen] = useState(false);

  // Resize + visibility observers (animation only runs while the map is on screen)
  useEffect(() => {
    const el = wrap.current!;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting));
    ro.observe(el);
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  const load = useCallback(async () => {
    try {
      const r = await fetch("/api/flights");
      const j = (await r.json()) as { live: boolean; flights: Flight[]; time?: number };
      const airborne = j.flights.filter((f) => !f.onGround);
      if (j.live && airborne.length) {
        positions.current = new Map(airborne.map((f) => [f.id, { lat: f.lat, lon: f.lon }]));
        setSnap(new Map(positions.current));
        setData({ mode: "live", flights: airborne, time: j.time });
        return;
      }
      throw new Error("empty");
    } catch {
      if (positions.current.size) return;
      const sim = simulate();
      positions.current = new Map(sim.map((f) => [f.id, { lat: f.lat, lon: f.lon }]));
      setSnap(new Map(positions.current));
      setData({ mode: "sim", flights: sim });
    }
  }, []);

  useEffect(() => {
    queueMicrotask(load);
    const id = setInterval(load, 60_000);
    return () => clearInterval(id);
  }, [load]);

  // Dead-reckoning: advance each aircraft along its heading at its velocity → smooth motion between polls.
  useEffect(() => {
    if (!onScreen || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    const speedUp = data.mode === "sim" ? 20 : 1;
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      data.flights.forEach((f) => {
        const p = positions.current.get(f.id);
        if (!p || f.velocity == null || f.heading == null) return;
        const dist = f.velocity * dt * speedUp; // metres
        const h = (f.heading * Math.PI) / 180;
        p.lat += (dist * Math.cos(h)) / 111_320;
        p.lon += (dist * Math.sin(h)) / (111_320 * Math.cos((p.lat * Math.PI) / 180));
        if (data.mode === "sim") {
          if (p.lat > 25.8) p.lat = 20.8;
          if (p.lat < 20.7) p.lat = 25.7;
          if (p.lon > 91.3) p.lon = 85.2;
          if (p.lon < 85.1) p.lon = 91.2;
        }
      });
      acc += dt;
      if (acc > 1 / 30) {
        acc = 0;
        setSnap(new Map(Array.from(positions.current, ([k, v]) => [k, { ...v }])));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [data, onScreen]);

  const c = project(center.lat, center.lon, zoom);
  const origin = { x: c.x - size.w / 2, y: c.y - size.h / 2 };

  const tiles = useMemo(() => {
    const out: { x: number; y: number; key: string }[] = [];
    const x0 = Math.floor(origin.x / TILE);
    const y0 = Math.floor(origin.y / TILE);
    const x1 = Math.floor((origin.x + size.w) / TILE);
    const y1 = Math.floor((origin.y + size.h) / TILE);
    for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) out.push({ x, y, key: `${zoom}/${x}/${y}` });
    return out;
  }, [origin.x, origin.y, size.w, size.h, zoom]);

  const toScreen = (lat: number, lon: number) => {
    const p = project(lat, lon, zoom);
    return { x: p.x - origin.x, y: p.y - origin.y };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, c: center };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const s = TILE * 2 ** zoom;
    const dLon = ((drag.current.x - e.clientX) / s) * 360;
    const p0 = project(drag.current.c.lat, drag.current.c.lon, zoom);
    const yNew = p0.y + (drag.current.y - e.clientY);
    const n = Math.PI - (2 * Math.PI * yNew) / s;
    const lat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
    setCenter({ lat, lon: drag.current.c.lon + dLon });
  };
  const onPointerUp = () => (drag.current = null);

  const selected = data.flights.find((f) => f.id === sel);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
      <div
        ref={wrap}
        className="relative h-[420px] cursor-grab touch-none overflow-hidden rounded-[22px] border border-line bg-[#eef0f2] active:cursor-grabbing sm:h-[480px]"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        role="application"
        aria-label="Interactive live flight map over eastern India. Drag to pan; use zoom buttons; select aircraft from the list."
      >
        {tiles.map((t) => {
          const n = 2 ** zoom;
          const wx = ((t.x % n) + n) % n;
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={t.key}
              src={`https://tile.openstreetmap.org/${zoom}/${wx}/${t.y}.png`}
              alt=""
              draggable={false}
              className="pointer-events-none absolute select-none [filter:grayscale(1)_contrast(0.92)_brightness(1.06)]"
              style={{ left: t.x * TILE - origin.x, top: t.y * TILE - origin.y, width: TILE, height: TILE }}
            />
          );
        })}
        <div className="pointer-events-none absolute inset-0 bg-paper/25 mix-blend-multiply" aria-hidden />

        {data.flights.map((f) => {
          const p = snap.get(f.id);
          if (!p) return null;
          const s = toScreen(p.lat, p.lon);
          if (s.x < -20 || s.y < -20 || s.x > size.w + 20 || s.y > size.h + 20) return null;
          const on = sel === f.id;
          return (
            <button
              key={f.id}
              onClick={() => {
                setSel(f.id);
                sfx("select");
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 p-1.5"
              style={{ left: s.x, top: s.y }}
              aria-label={`Aircraft ${f.callsign}`}
            >
              <svg viewBox="0 0 24 24" className={`h-5 w-5 drop-shadow transition-transform ${on ? "scale-150" : ""}`} style={{ transform: `rotate(${f.heading ?? 0}deg)` }} aria-hidden>
                <path d="M12 2l1.6 6.5L21 13v2l-7.4-2.2L13 19l2.5 1.8V22L12 21l-3.5 1v-1.2L11 19l-.6-6.2L3 15v-2l7.4-4.5z" fill={on ? "var(--signal)" : "var(--ink)"} />
              </svg>
              {on && <span className="absolute top-full left-1/2 -translate-x-1/2 rounded bg-signal px-1.5 py-0.5 font-mono text-[9px] whitespace-nowrap text-white">{f.callsign}</span>}
            </button>
          );
        })}

        {/* HUD */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
          <span className={`chip !bg-card/95 ${data.mode === "live" ? "!text-mint" : data.mode === "sim" ? "!text-signal" : ""}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${data.mode === "live" ? "bg-mint pulse-dot" : data.mode === "sim" ? "bg-signal" : "bg-muted"}`} />
            {data.mode === "live" ? "LIVE · OPENSKY NETWORK" : data.mode === "sim" ? "SIMULATED · LIVE FEED UNAVAILABLE" : "CONNECTING…"}
          </span>
          <span className="chip !bg-card/95">{data.flights.length} AIRCRAFT · EAST INDIA</span>
        </div>
        <div className="absolute top-3 right-3 flex flex-col overflow-hidden rounded-xl border border-line bg-card shadow-[var(--shadow-sm)]">
          <button onClick={() => setZoom((z) => Math.min(10, z + 1))} className="h-9 w-9 text-lg hover:bg-paper-2" aria-label="Zoom in">
            +
          </button>
          <button onClick={() => setZoom((z) => Math.max(5, z - 1))} className="h-9 w-9 border-t border-line text-lg hover:bg-paper-2" aria-label="Zoom out">
            −
          </button>
          <button onClick={() => setCenter(CENTER)} className="h-9 w-9 border-t border-line font-mono text-[10px] hover:bg-paper-2" aria-label="Recenter map">
            ◎
          </button>
        </div>
        <div className="absolute right-2 bottom-1.5 rounded bg-card/80 px-1.5 font-mono text-[9px] text-muted">© OpenStreetMap contributors</div>
      </div>

      {/* Detail / list */}
      <div className="panel-flat flex max-h-[480px] flex-col overflow-hidden !rounded-[22px]">
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div key={selected.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="border-b border-line p-5">
              <div className="flex items-center justify-between">
                <span className="label">AIRCRAFT</span>
                <button onClick={() => setSel(null)} className="font-mono text-[10px] text-muted hover:text-ink" aria-label="Clear selection">
                  ✕
                </button>
              </div>
              <div className="mt-1 font-display text-2xl font-bold">{selected.callsign}</div>
              <dl className="mt-4 grid grid-cols-2 gap-3 font-mono text-[11px]">
                {[
                  ["CALLSIGN", selected.callsign],
                  ["ORIGIN", selected.country || "—"],
                  ["ALTITUDE", selected.altitude != null ? `${Math.round(selected.altitude * 3.281).toLocaleString()} ft` : "—"],
                  ["VELOCITY", selected.velocity != null ? `${Math.round(selected.velocity * 1.944)} kt` : "—"],
                  ["HEADING", selected.heading != null ? `${Math.round(selected.heading)}°` : "—"],
                  ["ICAO24", selected.id.startsWith("sim") ? "—" : selected.id],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-muted">{k}</dt>
                    <dd className="mt-0.5 font-semibold text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          ) : (
            <motion.div key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="border-b border-line p-5">
              <span className="label">SELECT AN AIRCRAFT</span>
              <p className="mt-2 text-sm text-muted">Click a plane on the map or pick one below.</p>
            </motion.div>
          )}
        </AnimatePresence>
        <ul className="thin-scroll flex-1 overflow-y-auto p-2" aria-label="Aircraft list">
          {data.flights.slice(0, 40).map((f) => (
            <li key={f.id}>
              <button
                onClick={() => {
                  setSel(f.id);
                  const p = positions.current.get(f.id);
                  if (p) setCenter({ lat: p.lat, lon: p.lon });
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left font-mono text-[11px] ${sel === f.id ? "bg-ink text-white" : "hover:bg-paper-2"}`}
              >
                <span>{f.callsign}</span>
                <span className={sel === f.id ? "text-white/60" : "text-muted"}>{f.altitude != null ? `${Math.round(f.altitude * 3.281 / 100)} FL` : "—"}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
