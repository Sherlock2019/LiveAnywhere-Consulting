import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  // Set by start.sh so the dev server can be opened via the EC2 public IP.
  allowedDevOrigins: process.env.PUBLIC_HOST ? [process.env.PUBLIC_HOST] : undefined,
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
