import axios, { type InternalAxiosRequestConfig } from "axios";

import { getPaymentsApiBaseUrl } from "./payments-api-base-url";
import { normalizeApiError } from "./errors";

export const api = axios.create({
  headers: { "Content-Type": "application/json" },
});

/**
 * Merchant auth (matches payment_app `get_current_merchant`):
 * - `NEXT_PUBLIC_MERCHANT_API_KEY` → `X-API-Key: pk_test_...` (preferred when set)
 * - else `NEXT_PUBLIC_MERCHANT_ACCESS_TOKEN` → `Authorization: Bearer <jwt>`
 *
 * API keys may also be sent as `Authorization: Bearer pk_test_...` on the
 * backend; we use `X-API-Key` here so it never collides with JWT Bearer.
 */
function applyMerchantAuth(config: InternalAxiosRequestConfig) {
  const apiKey = process.env.NEXT_PUBLIC_MERCHANT_API_KEY?.trim();
  const jwt = process.env.NEXT_PUBLIC_MERCHANT_ACCESS_TOKEN?.trim();

  const h = config.headers as Record<string, string | undefined>;
  delete h["X-API-Key"];
  delete h.Authorization;

  if (apiKey) {
    h["X-API-Key"] = apiKey;
  } else if (jwt) {
    h.Authorization = `Bearer ${jwt}`;
  }
}

/**
 * Resolves base URL per request:
 * - If NEXT_PUBLIC_PAYMENTS_API_BASE_URL (or API_BASE_URL) is set → call that host directly.
 * - Otherwise → same-origin `/api/payments` so requests hit this Next server and are
 *   rewritten to PAYMENTS_API_INTERNAL_URL (see next.config.ts). Avoids empty baseURL
 *   (which would send `/v1/...` to port 3001 as a page route).
 */
api.interceptors.request.use((config) => {
  const configured = getPaymentsApiBaseUrl();
  if (configured) {
    config.baseURL = configured;
  } else if (typeof window !== "undefined") {
    config.baseURL = `${window.location.origin}/api/payments`;
  } else {
    config.baseURL =
      process.env.PAYMENTS_API_INTERNAL_URL?.replace(/\/+$/, "") ||
      "http://127.0.0.1:8000";
  }

  applyMerchantAuth(config);
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject(normalizeApiError(error)),
);
