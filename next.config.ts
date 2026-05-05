import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d18rvixp3z5iwh.cloudfront.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
