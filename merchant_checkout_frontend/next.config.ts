import type { NextConfig } from "next";

/**
 * Where Next.js proxies `/api/payments/*` (server-side rewrite).
 * Browser calls stay on the checkout origin (e.g. :3001); Next forwards to FastAPI.
 */
const PAYMENTS_API_INTERNAL_URL = (
  process.env.PAYMENTS_API_INTERNAL_URL ?? "http://127.0.0.1:8000"
).replace(/\/+$/, "");

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/payments/:path*",
        destination: `${PAYMENTS_API_INTERNAL_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
