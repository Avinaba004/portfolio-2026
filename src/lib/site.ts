/** Canonical site URL: set NEXT_PUBLIC_SITE_URL for a custom domain; falls back to Vercel's production URL. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");
