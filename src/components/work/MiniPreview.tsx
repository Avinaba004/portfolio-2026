"use client";

/** Tiny looping SVG previews — one per project, each hinting at what the system does. */
export function MiniPreview({ slug, color }: { slug: string; color: string }) {
  const common = { viewBox: "0 0 160 90", className: "h-full w-full", "aria-hidden": true } as const;
  switch (slug) {
    case "odys":
      return (
        <svg {...common}>
          {Array.from({ length: 88 }).map((_, i) => {
            const x = 18 + (i % 11) * 11.5;
            const y = 10 + Math.floor(i / 11) * 9.5;
            return (
              <circle key={i} cx={x} cy={y} r="2" fill={color}>
                <animate attributeName="opacity" values="0.15;1;0.15" dur="2.4s" begin={`${(i * 0.137) % 2.4}s`} repeatCount="indefinite" />
              </circle>
            );
          })}
        </svg>
      );
    case "gulp":
      return (
        <svg {...common} fontFamily="monospace" fontSize="8">
          <rect x="6" y="10" width="62" height="14" rx="4" fill="none" stroke="var(--ink)" strokeOpacity=".3" />
          <text x="11" y="20" fill="var(--muted)">https://…</text>
          <path d="M72 17 H86" stroke={color} strokeWidth="1.5" className="flow-line" />
          <text x="90" y="20" fill={color} fontWeight="bold">
            {"{ json }"}
          </text>
          {[0, 1, 2].map((i) => (
            <rect key={i} x="30" y={40 + i * 14} width="100" height="9" rx="3" fill={color} opacity=".18">
              <animate attributeName="width" values="0;100;100" dur="3s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
            </rect>
          ))}
        </svg>
      );
    case "egle":
      return (
        <svg {...common}>
          <rect x="44" y="6" width="72" height="80" rx="5" fill="white" stroke="var(--ink)" strokeOpacity=".2" />
          {[16, 26, 36, 46, 56, 66].map((y, i) => (
            <rect key={y} x="52" y={y} width={i % 2 ? 40 : 56} height="4" rx="2" fill={i === 1 || i === 4 ? color : "var(--ink)"} opacity={i === 1 || i === 4 ? 0.7 : 0.12} />
          ))}
          <rect x="44" y="6" width="72" height="3" fill={color}>
            <animate attributeName="y" values="6;83;6" dur="3s" repeatCount="indefinite" />
          </rect>
        </svg>
      );
    case "mopbb":
      return (
        <svg {...common}>
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={22 + i * 24} y="20" width="14" height="60" rx="3" fill={color} opacity=".85">
              <animate attributeName="height" values={`10;${30 + ((i * 17) % 30)};10`} dur="2.6s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
              <animate attributeName="y" values={`70;${50 - ((i * 17) % 30)};70`} dur="2.6s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
            </rect>
          ))}
          <line x1="14" y1="80" x2="146" y2="80" stroke="var(--ink)" strokeOpacity=".2" />
        </svg>
      );
    case "lurie":
      return (
        <svg {...common}>
          <path d="M0 50 H40 L48 30 L56 70 L64 20 L72 60 L78 50 H160" fill="none" stroke={color} strokeWidth="2" strokeDasharray="220" strokeDashoffset="220">
            <animate attributeName="stroke-dashoffset" values="220;0;-220" dur="2.2s" repeatCount="indefinite" />
          </path>
          <text x="118" y="24" fontFamily="monospace" fontSize="9" fill={color}>
            72 BPM
          </text>
        </svg>
      );
    case "medicaid":
      return (
        <svg {...common} fontFamily="monospace" fontSize="7.5">
          {["RULE 01", "RULE 02", "RULE 03", "RULE 04"].map((r, i) => (
            <g key={r}>
              <rect x="20" y={8 + i * 19} width="80" height="14" rx="4" fill="none" stroke="var(--ink)" strokeOpacity=".2" />
              <text x="27" y={18 + i * 19} fill="var(--ink-2)">
                {r}
              </text>
              <circle cx="120" cy={15 + i * 19} r="5" fill={color} opacity="0">
                <animate attributeName="opacity" values="0;0;1;1" keyTimes="0;0.2;0.3;1" dur="3s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
              </circle>
            </g>
          ))}
        </svg>
      );
    case "asana":
      return (
        <svg {...common}>
          {[0, 1, 2, 3, 4].map((i) => (
            <circle key={i} cx={16 + i * 32} cy="45" r="7" fill="white" stroke="var(--ink)" strokeOpacity=".25" />
          ))}
          <line x1="23" y1="45" x2="137" y2="45" stroke="var(--ink)" strokeOpacity=".15" />
          <circle r="5" cy="45" fill={color}>
            <animate attributeName="cx" values="16;144" dur="1.8s" repeatCount="indefinite" />
          </circle>
        </svg>
      );
    case "ai-assistant":
      return (
        <svg {...common}>
          <path d="M80 12 L108 22 V46 C108 62 96 74 80 80 C64 74 52 62 52 46 V22 Z" fill={color} opacity=".12" stroke={color} strokeWidth="1.5" />
          <path d="M70 46 L77 53 L92 37" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          <circle r="3" cy="46" fill="var(--signal)">
            <animate attributeName="cx" values="6;48;48" keyTimes="0;0.6;1" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;1;0" keyTimes="0;0.6;0.7" dur="2s" repeatCount="indefinite" />
          </circle>
        </svg>
      );
    default:
      return null;
  }
}
