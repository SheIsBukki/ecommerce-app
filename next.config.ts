import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // domains: ["cdn.sanity.io"], // This is deprecated but will use it if the remotePatterns one doesn't work
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io", port: "" },
    ],
  },
};

export default nextConfig;
