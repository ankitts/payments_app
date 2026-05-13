/**
 * External payments API root (no trailing slash), when you want the browser to
 * call FastAPI directly (must set CORS on the backend).
 *
 * If this returns null, the axios client uses same-origin
 * `{origin}/api/payments` and Next.js rewrites to PAYMENTS_API_INTERNAL_URL.
 *
 * Precedence:
 * 1. NEXT_PUBLIC_PAYMENTS_API_BASE_URL
 * 2. NEXT_PUBLIC_API_BASE_URL
 */
export function getPaymentsApiBaseUrl(): string | null {
  const raw =
    process.env.NEXT_PUBLIC_PAYMENTS_API_BASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_BASE_URL?.trim() ||
    "";
  const base = raw.replace(/\/+$/, "");
  return base || null;
}
