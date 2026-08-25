import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  webpack(config) {
    // Allow importing JSON from outside the app directory (lenders/requirements.json)
    config.resolve.alias["../../../lenders/requirements.json"] = path.resolve(
      __dirname,
      "../lenders/requirements.json"
    );
    return config;
  },
};

export default nextConfig;
