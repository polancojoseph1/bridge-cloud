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
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
