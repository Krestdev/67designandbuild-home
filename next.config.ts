import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

// Build workers; the Dockerfile sets NEXT_BUILD_CPUS so a server build can't use every core at once.
const buildCpus = Number(process.env.NEXT_BUILD_CPUS) || undefined;

const nextConfig: NextConfig = {
  // Self-contained server (.next/standalone) with only the node_modules files
  // it actually uses — keeps the Docker image small.
  output: "standalone",
  // The type check is the most memory-hungry build step. The Docker build skips it
  // (SKIP_TYPECHECK=true); CI (.github/workflows/deploy.yml) still runs `tsc --noEmit`.
  typescript: {
    ignoreBuildErrors: process.env.SKIP_TYPECHECK === "true",
  },
  experimental: {
    // On by default since Next 16.3: each build also writes a large Turbopack cache
    // to disk (~400 MB), costing memory and disk on the server.
    turbopackFileSystemCacheForBuild: false,
    ...(buildCpus && { cpus: buildCpus }),
  },
  // Links used to point at routes that don't exist (/actualites, /quote) —
  // keep any already-shared URLs working.
  async redirects() {
    return [
      { source: "/actualites", destination: "/blog", permanent: true },
      { source: "/actualites/:slug", destination: "/blog/:slug", permanent: true },
      { source: "/quote", destination: "/contact", permanent: true },
      // No list pages for these yet (only /service/:slug, /sector/:slug).
      { source: "/service", destination: "/", permanent: false },
      { source: "/sector", destination: "/", permanent: false },
    ];
  },
};

export default withPayload(nextConfig);
