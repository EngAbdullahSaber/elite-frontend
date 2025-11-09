import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["elite-back-end.vercel.app", "example.com"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8081",
        pathname: "/uploads/images/**",
      },
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
