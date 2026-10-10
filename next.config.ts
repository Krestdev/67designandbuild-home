import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
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
