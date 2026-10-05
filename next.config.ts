import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // A stray package-lock.json lives in the home directory; pin the workspace root.
  turbopack: { root: path.resolve(__dirname) },
  poweredByHeader: false,
};

export default nextConfig;
