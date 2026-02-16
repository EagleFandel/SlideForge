import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@slideforge/protocol", "@slideforge/themes"],
  webpack: (config, { isServer }) => {
    // WebLLM 是可选依赖，构建时忽略
    config.resolve.fallback = {
      ...config.resolve.fallback,
      '@mlc-ai/web-llm': false,
    };
    return config;
  },
};

export default nextConfig;
