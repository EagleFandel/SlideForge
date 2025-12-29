import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@slideforge/protocol", "@slideforge/themes"],
};

export default nextConfig;
