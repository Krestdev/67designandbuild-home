import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  // Article links used to point at /actualites, which has no route — keep
  // any already-shared URLs working.
  async redirects() {
    return [
      { source: "/actualites", destination: "/blog", permanent: true },
      { source: "/actualites/:slug", destination: "/blog/:slug", permanent: true },
    ];
  },
};

export default withPayload(nextConfig);
