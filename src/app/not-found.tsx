import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="relative grid min-h-screen place-items-center px-6">
      <div className="bp-grid mask-fade absolute inset-0 opacity-60" aria-hidden />
      <div className="relative text-center">
        <div className="font-mono text-xs tracking-widest text-signal">ERROR 404 · ROUTE NOT IN SYSTEM MAP</div>
        <h1 className="mt-4 font-display text-[clamp(4rem,16vw,12rem)] leading-none font-extrabold tracking-tighter">404</h1>
        <p className="mt-4 text-ink-2">This node doesn&apos;t exist. Yet.</p>
        <Link href="/" className="mt-8 inline-block rounded-xl bg-ink px-5 py-3 text-sm font-medium text-white">
          ← Return to system
        </Link>
      </div>
    </main>
  );
}
