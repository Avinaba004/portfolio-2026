"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/* ------------------------------------------------------------------
   AG-01 — a clay-style system unit that floats among the systems
   Avinaba builds: database, cloud, auth key, AI core, documents.
   Pure primitives: no models, no textures to download.
------------------------------------------------------------------- */

const CREAM = "#f7f4ee";
const INK = "#16161a";
const SIGNAL = "#ff4d17";
const COBALT = "#2f4bff";
const MINT = "#0e9f6e";
const VIOLET = "#7a5cff";
const AMBER = "#f2a900";

type Shared = {
  pointerRef: React.RefObject<{ x: number; y: number }>;
  exciteRef: React.RefObject<number>;
  reduced: boolean;
};

function Clay({ color, rough = 0.85, metal = 0, emissive, ei = 0 }: { color: string; rough?: number; metal?: number; emissive?: string; ei?: number }) {
  return <meshStandardMaterial color={color} roughness={rough} metalness={metal} emissive={emissive ?? "#000"} emissiveIntensity={ei} />;
}

function Robot({ pointerRef, exciteRef, reduced }: Shared) {
  const root = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const eyeL = useRef<THREE.Mesh>(null);
  const eyeR = useRef<THREE.Mesh>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const tip = useRef<THREE.Mesh>(null);
  const screen = useRef<THREE.MeshStandardMaterial>(null);
  const spin = useRef(0);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const p = pointerRef.current!;
    const ex = exciteRef.current!;
    if (!root.current || !head.current) return;

    // Float + lean towards cursor (spring-like damping)
    const floatY = reduced ? 0 : Math.sin(t * 1.4) * 0.08;
    root.current.position.y = THREE.MathUtils.damp(root.current.position.y, floatY + ex * 0.4, 6, dt);
    root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, p.x * 0.45 + spin.current, 4, dt);
    root.current.rotation.z = THREE.MathUtils.damp(root.current.rotation.z, -p.x * 0.08, 4, dt);

    // Celebration spin
    if (ex > 0.5) spin.current += dt * 9;
    else spin.current = THREE.MathUtils.damp(spin.current, Math.round(spin.current / (Math.PI * 2)) * Math.PI * 2, 5, dt);
    exciteRef.current = Math.max(0, ex - dt * 0.9);

    // Head tracks cursor
    head.current.rotation.y = THREE.MathUtils.damp(head.current.rotation.y, p.x * 0.6, 8, dt);
    head.current.rotation.x = THREE.MathUtils.damp(head.current.rotation.x, -p.y * 0.35, 8, dt);

    // Blink
    const blink = reduced ? 1 : Math.abs(Math.sin(t * 0.9)) > 0.985 ? 0.1 : 1;
    eyeL.current!.scale.y = THREE.MathUtils.damp(eyeL.current!.scale.y, blink, 30, dt);
    eyeR.current!.scale.y = eyeL.current!.scale.y;

    // Wave the right arm periodically, left arm sways
    const wave = reduced ? 0 : Math.max(0, Math.sin(t * 0.7)) ** 6;
    armR.current!.rotation.z = THREE.MathUtils.damp(armR.current!.rotation.z, 0.35 + wave * 2.0 + ex * 2.2, 6, dt);
    armR.current!.rotation.x = Math.sin(t * 9) * wave * 0.35;
    armL.current!.rotation.z = -0.35 - Math.sin(t * 1.4) * 0.08 - ex * 2.2;

    // Antenna tip pulse + chest screen scanline
    const s = 1 + Math.sin(t * 4) * 0.12;
    tip.current!.scale.setScalar(s);
    if (screen.current) screen.current.emissiveIntensity = 0.7 + Math.sin(t * 3) * 0.25;
  });

  return (
    <group ref={root}>
      {/* Body */}
      <mesh position={[0, -0.15, 0]}>
        <capsuleGeometry args={[0.62, 0.55, 12, 32]} />
        <Clay color={CREAM} />
      </mesh>
      {/* Chest panel */}
      <mesh position={[0, -0.05, 0.58]} rotation={[-0.08, 0, 0]}>
        <boxGeometry args={[0.62, 0.38, 0.08]} />
        <Clay color={INK} rough={0.4} />
      </mesh>
      <mesh position={[0, -0.05, 0.63]} rotation={[-0.08, 0, 0]}>
        <planeGeometry args={[0.52, 0.28]} />
        <meshStandardMaterial ref={screen} color={SIGNAL} emissive={SIGNAL} emissiveIntensity={0.8} roughness={0.5} />
      </mesh>
      {/* Belt ring */}
      <mesh position={[0, -0.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.6, 0.05, 12, 48]} />
        <Clay color={SIGNAL} rough={0.6} />
      </mesh>
      {/* Thruster glow */}
      <mesh position={[0, -1.05, 0]}>
        <coneGeometry args={[0.22, 0.3, 24]} />
        <Clay color={INK} rough={0.5} />
      </mesh>
      <mesh position={[0, -1.25, 0]}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshBasicMaterial color={SIGNAL} transparent opacity={0.85} />
      </mesh>

      {/* Arms */}
      <group ref={armL} position={[-0.68, 0.1, 0]}>
        <mesh position={[-0.05, -0.32, 0]}>
          <capsuleGeometry args={[0.13, 0.42, 8, 16]} />
          <Clay color={CREAM} />
        </mesh>
        <mesh position={[-0.05, -0.68, 0]}>
          <sphereGeometry args={[0.16, 20, 20]} />
          <Clay color={COBALT} rough={0.6} />
        </mesh>
      </group>
      <group ref={armR} position={[0.68, 0.1, 0]}>
        <mesh position={[0.05, -0.32, 0]}>
          <capsuleGeometry args={[0.13, 0.42, 8, 16]} />
          <Clay color={CREAM} />
        </mesh>
        <mesh position={[0.05, -0.68, 0]}>
          <sphereGeometry args={[0.16, 20, 20]} />
          <Clay color={COBALT} rough={0.6} />
        </mesh>
      </group>

      {/* Head */}
      <group ref={head} position={[0, 0.98, 0]}>
        <mesh scale={[1.18, 0.92, 1]}>
          <sphereGeometry args={[0.62, 40, 40]} />
          <Clay color={CREAM} />
        </mesh>
        {/* Visor */}
        <mesh position={[0, 0.02, 0.26]} scale={[0.95, 0.6, 0.62]}>
          <sphereGeometry args={[0.62, 40, 40]} />
          <meshStandardMaterial color={INK} roughness={0.18} metalness={0.3} />
        </mesh>
        {/* Eyes */}
        <mesh ref={eyeL} position={[-0.2, 0.04, 0.64]}>
          <capsuleGeometry args={[0.055, 0.1, 6, 12]} />
          <meshBasicMaterial color="#7ff3ff" />
        </mesh>
        <mesh ref={eyeR} position={[0.2, 0.04, 0.64]}>
          <capsuleGeometry args={[0.055, 0.1, 6, 12]} />
          <meshBasicMaterial color="#7ff3ff" />
        </mesh>
        {/* Ear pods */}
        <mesh position={[-0.74, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.15, 0.15, 0.12, 24]} />
          <Clay color={SIGNAL} rough={0.6} />
        </mesh>
        <mesh position={[0.74, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.15, 0.15, 0.12, 24]} />
          <Clay color={SIGNAL} rough={0.6} />
        </mesh>
        {/* Antenna */}
        <mesh position={[0, 0.66, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.32, 8]} />
          <Clay color={INK} />
        </mesh>
        <mesh ref={tip} position={[0, 0.86, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color={SIGNAL} />
        </mesh>
      </group>
    </group>
  );
}

/* ---------- Orbiting system objects ---------- */

function Database() {
  return (
    <group>
      {[0, 0.2, 0.4].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.16, 32]} />
          <Clay color={COBALT} rough={0.55} />
        </mesh>
      ))}
      <mesh position={[0, 0.49, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.26, 32]} />
        <Clay color="#6c80ff" rough={0.5} />
      </mesh>
    </group>
  );
}

function Cloud() {
  return (
    <group>
      {[
        [0, 0, 0, 0.26],
        [0.26, -0.05, 0, 0.2],
        [-0.26, -0.06, 0, 0.19],
        [0.1, 0.14, 0, 0.18],
      ].map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[r, 24, 24]} />
          <Clay color="#ffffff" rough={0.95} />
        </mesh>
      ))}
    </group>
  );
}

function AuthKey() {
  return (
    <group rotation={[0, 0, 0.6]}>
      <mesh>
        <torusGeometry args={[0.16, 0.06, 12, 32]} />
        <Clay color={AMBER} rough={0.4} metal={0.2} />
      </mesh>
      <mesh position={[0.36, 0, 0]}>
        <boxGeometry args={[0.42, 0.08, 0.08]} />
        <Clay color={AMBER} rough={0.4} metal={0.2} />
      </mesh>
      <mesh position={[0.5, -0.08, 0]}>
        <boxGeometry args={[0.07, 0.14, 0.08]} />
        <Clay color={AMBER} rough={0.4} metal={0.2} />
      </mesh>
    </group>
  );
}

function AICore() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.8;
  });
  return (
    <group>
      <mesh ref={ref}>
        <octahedronGeometry args={[0.24, 0]} />
        <Clay color={VIOLET} rough={0.35} emissive={VIOLET} ei={0.25} />
      </mesh>
      <mesh rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[0.36, 0.015, 8, 64]} />
        <meshBasicMaterial color={VIOLET} />
      </mesh>
    </group>
  );
}

function Doc() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[0.34, 0.44, 0.04]} />
        <Clay color="#ffffff" rough={0.9} />
      </mesh>
      {[0.12, 0.04, -0.04, -0.12].map((y, i) => (
        <mesh key={y} position={[-0.02 + (i === 3 ? -0.04 : 0), y, 0.025]}>
          <boxGeometry args={[i === 3 ? 0.14 : 0.22, 0.03, 0.01]} />
          <Clay color={i === 0 ? MINT : "#c9c6bf"} rough={0.9} />
        </mesh>
      ))}
    </group>
  );
}

const ORBIT: { C: () => React.JSX.Element; r: number; speed: number; phase: number; y: number; tilt: number }[] = [
  { C: Database, r: 2.1, speed: 0.22, phase: 0, y: -0.5, tilt: 0.2 },
  { C: Cloud, r: 2.3, speed: 0.22, phase: 1.3, y: 1.3, tilt: 0.1 },
  { C: AuthKey, r: 2.0, speed: 0.22, phase: 2.6, y: 0.3, tilt: -0.1 },
  { C: AICore, r: 2.2, speed: 0.22, phase: 3.9, y: 1.0, tilt: 0.15 },
  { C: Doc, r: 2.15, speed: 0.22, phase: 5.1, y: -0.2, tilt: -0.2 },
];

function Orbiters({ reduced, exciteRef }: { reduced: boolean; exciteRef: React.RefObject<number> }) {
  const refs = useRef<(THREE.Group | null)[]>([]);
  const packets = useRef<(THREE.Mesh | null)[]>([]);
  useFrame((state) => {
    const t = reduced ? 0.6 : state.clock.elapsedTime;
    const boost = 1 + exciteRef.current! * 3;
    ORBIT.forEach((o, i) => {
      const g = refs.current[i];
      if (!g) return;
      const a = o.phase + t * o.speed * boost;
      g.position.set(Math.cos(a) * o.r, o.y + Math.sin(t * 1.2 + i) * 0.1, Math.sin(a) * o.r * 0.55);
      g.rotation.y = -a + Math.PI / 2;
      g.rotation.z = o.tilt + Math.sin(t + i) * 0.1;
      // data packet travelling from object → robot core
      const pk = packets.current[i];
      if (pk) {
        const k = (t * 0.45 + i / ORBIT.length) % 1;
        pk.position.lerpVectors(g.position, new THREE.Vector3(0, 0, 0), k);
        pk.scale.setScalar(Math.sin(k * Math.PI) * 0.9 + 0.1);
      }
    });
  });
  return (
    <>
      {ORBIT.map((o, i) => (
        <group key={i} ref={(el) => void (refs.current[i] = el)}>
          <o.C />
        </group>
      ))}
      {ORBIT.map((_, i) => (
        <mesh key={`p${i}`} ref={(el) => void (packets.current[i] = el)}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshBasicMaterial color={[SIGNAL, COBALT, AMBER, VIOLET, MINT][i]} />
        </mesh>
      ))}
    </>
  );
}

/* ---------- Soft contact shadow (canvas texture, no extra deps) ---------- */

function ContactShadow() {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, "rgba(17,17,20,0.35)");
    grd.addColorStop(1, "rgba(17,17,20,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, []);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.75, 0]}>
      <planeGeometry args={[3.2, 3.2]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} />
    </mesh>
  );
}

function Rig({ pointerRef }: { pointerRef: React.RefObject<{ x: number; y: number }> }) {
  useFrame((state, dt) => {
    const p = pointerRef.current!;
    // Pull the camera back on narrow canvases so the orbiting systems never clip.
    const aspect = state.size.width / Math.max(1, state.size.height);
    const z = Math.max(7, 7.6 / aspect);
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, z, 4, dt);
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, p.x * 0.6, 3, dt);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, 0.5 + p.y * 0.3, 3, dt);
    state.camera.lookAt(0, 0.2, 0);
  });
  return null;
}

/** Drives a "demand" frameloop at a fixed rate (used for the 30fps touch-device mode). */
function FrameDriver({ fps }: { fps: number }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    let raf = 0;
    let last = 0;
    const step = 1000 / fps;
    const loop = (t: number) => {
      if (t - last >= step - 1) {
        last = t;
        invalidate();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [fps, invalidate]);
  return null;
}

export default function RobotScene({ celebrate = 0, onPoke }: { celebrate?: number; onPoke?: () => void }) {
  const wrap = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const excite = useRef(0);
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(false);
  // Phones/tablets: render fewer pixels and at 30fps so the hero stays smooth.
  const [lite] = useState(() => typeof window !== "undefined" && (matchMedia("(hover: none), (pointer: coarse)").matches || innerWidth < 1024));

  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / innerHeight) * 2 - 1);
    };
    addEventListener("pointermove", onMove, { passive: true });
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.01 });
    if (wrap.current) io.observe(wrap.current);
    return () => {
      mq.removeEventListener("change", sync);
      removeEventListener("pointermove", onMove);
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    if (celebrate) excite.current = 1.6;
  }, [celebrate]);

  // Entrance: a single full turn once the unit has loaded.
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => (excite.current = 0.9), 700);
    return () => clearTimeout(t);
  }, []);

  return (
    <div ref={wrap} className="h-full w-full">
      <Canvas
        dpr={lite ? [1, 1.25] : [1, 1.75]}
        frameloop={visible ? (reduced || lite ? "demand" : "always") : "never"}
        camera={{ position: [0, 0.5, 7], fov: 38 }}
        gl={{ antialias: true, alpha: true, powerPreference: lite ? "default" : "high-performance" }}
        aria-hidden
      >
        <hemisphereLight args={["#ffffff", "#d9d3c7", 1.1]} />
        <directionalLight position={[3, 5, 4]} intensity={1.6} color="#fff6ea" />
        <directionalLight position={[-4, 2, -2]} intensity={0.5} color="#c8d2ff" />
        <pointLight position={[0, -1.2, 1]} intensity={1.2} color={SIGNAL} distance={3} />
        <group
          position={[0, 0.15, 0]}
          onClick={() => {
            excite.current = 1.6;
            onPoke?.();
          }}
          onPointerOver={() => (document.body.style.cursor = "pointer")}
          onPointerOut={() => (document.body.style.cursor = "")}
        >
          <Robot pointerRef={pointer} exciteRef={excite} reduced={reduced} />
        </group>
        <Orbiters reduced={reduced} exciteRef={excite} />
        <ContactShadow />
        <Rig pointerRef={pointer} />
        {lite && visible && !reduced && <FrameDriver fps={30} />}
      </Canvas>
    </div>
  );
}
