/** Tiny synthesized UI sounds via WebAudio — no audio files, never autoplayed. */
let ctx: AudioContext | null = null;

export type Sfx = "open" | "select" | "tick" | "success" | "error";

const presets: Record<Sfx, { f: number[]; d: number; type: OscillatorType; g: number }> = {
  open: { f: [520, 780], d: 0.12, type: "sine", g: 0.05 },
  select: { f: [660, 990], d: 0.09, type: "triangle", g: 0.045 },
  tick: { f: [1200], d: 0.03, type: "square", g: 0.015 },
  success: { f: [523, 659, 784], d: 0.1, type: "sine", g: 0.05 },
  error: { f: [220, 160], d: 0.14, type: "sawtooth", g: 0.03 },
};

export function playSfx(name: Sfx) {
  if (typeof window === "undefined") return;
  try {
    ctx ??= new AudioContext();
    const p = presets[name];
    const t0 = ctx.currentTime;
    p.f.forEach((freq, i) => {
      const osc = ctx!.createOscillator();
      const gain = ctx!.createGain();
      osc.type = p.type;
      osc.frequency.value = freq;
      const start = t0 + i * p.d * 0.8;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(p.g, start + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + p.d);
      osc.connect(gain).connect(ctx!.destination);
      osc.start(start);
      osc.stop(start + p.d + 0.02);
    });
  } catch {
    /* audio unavailable — silently ignore */
  }
}
