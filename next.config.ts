import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    // The work screenshots change only when we republish them, so let the
    // browser keep an optimized variant for a month instead of
    // revalidating all six on every visit.
    minimumCacheTTL: 2678400,
  },
};

export default nextConfig;
