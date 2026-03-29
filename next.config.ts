import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_test_Y2xlcmsuY2xlcmsuY29tJA==",
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY || "",
    NEXT_PUBLIC_SERVER_PRECONFIGURED: "true",
    NEXT_PUBLIC_SERVER_URL: "http://localhost:8585",
    NEXT_PUBLIC_SERVER_KEY: "test",
    NEXT_PUBLIC_CLERK_TELEMETRY_DISABLED: "true",
  },
};

export default nextConfig;
