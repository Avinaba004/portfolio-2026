"use client";

export function PrintButton() {
  return (
    <button onClick={() => window.print()} className="rounded-xl border border-line bg-card px-4 py-2 text-sm font-medium hover:bg-paper-2">
      Print
    </button>
  );
}
