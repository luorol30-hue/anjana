import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow LAN IP to load JS/HMR dev resources — required for mobile testing on local network
  allowedDevOrigins: ["192.168.1.34"],
};

export default nextConfig;
