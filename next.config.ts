import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Add production-safe domains only
    domains: ["elite-back-end.vercel.app", "example.com"],

    // Define remote image patterns allowed in <Image />
    remotePatterns: [
      {
        protocol: "https",
        hostname: "elite-back-end.vercel.app",
        pathname: "/uploads/images/**",
      },
      {
        protocol: "https",
        hostname: "example.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
