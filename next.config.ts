import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_live_Y2xlcmsuY2xlcmsuY29tJA==",
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY || "sk_test_1234567890",
    NEXT_PUBLIC_SERVER_PRECONFIGURED: "true",
    NEXT_PUBLIC_SERVER_URL: "http://localhost:8585",
    NEXT_PUBLIC_SERVER_KEY: "test",
  },
};

export default nextConfig;
