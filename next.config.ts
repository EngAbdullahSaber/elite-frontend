import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Allow image optimization from these hosts
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
    // Optional: helps avoid domain mismatch errors on Vercel
    unoptimized: false,
  },
};

export default nextConfig;
