import { NextResponse } from "next/server";

/**
 * Live aircraft over an eastern-India region from the OpenSky Network.
 * Bounding box kept under 25 sq° so each anonymous request costs 1 credit,
 * and responses are CDN-cached to stay well inside rate limits.
 */
const BBOX = { lamin: 21, lomin: 85.5, lamax: 25.5, lomax: 91 };

export type Flight = {
  id: string;
  callsign: string;
  country: string;
  lon: number;
  lat: number;
  altitude: number | null; // metres
  velocity: number | null; // m/s
  heading: number | null; // degrees
  onGround: boolean;
};

export async function GET() {
  const url = `https://opensky-network.org/api/states/all?lamin=${BBOX.lamin}&lomin=${BBOX.lomin}&lamax=${BBOX.lamax}&lomax=${BBOX.lomax}`;
  try {
    const res = await fetch(url, { next: { revalidate: 90 }, signal: AbortSignal.timeout(6000) });
    if (!res.ok) throw new Error(`OpenSky ${res.status}`);
    const data = (await res.json()) as { time: number; states: unknown[][] | null };
    const flights: Flight[] = (data.states ?? [])
      .filter((s) => typeof s[5] === "number" && typeof s[6] === "number")
      .map((s) => ({
        id: String(s[0]),
        callsign: String(s[1] ?? "").trim() || String(s[0]).toUpperCase(),
        country: String(s[2] ?? ""),
        lon: s[5] as number,
        lat: s[6] as number,
        altitude: (s[13] as number | null) ?? (s[7] as number | null),
        velocity: s[9] as number | null,
        heading: s[10] as number | null,
        onGround: Boolean(s[8]),
      }));
    return NextResponse.json(
      { live: true, time: data.time, bbox: BBOX, flights },
      { headers: { "Cache-Control": "public, s-maxage=90, stale-while-revalidate=300" } },
    );
  } catch (e) {
    return NextResponse.json(
      { live: false, error: e instanceof Error ? e.message : "unavailable", bbox: BBOX, flights: [] },
      { headers: { "Cache-Control": "public, s-maxage=60" } },
    );
  }
}
