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
    domains: [
      "elite-back-end.vercel.app",
      "example.com",
      "localhost", // ✅ add this
      "127.0.0.1", // ✅ add this too (for safety)
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "elite-back-end.vercel.app",
        pathname: "/uploads/images/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8081", // ✅ must be separated from hostname
        pathname: "/uploads/images/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8081",
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
