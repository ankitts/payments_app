import axios from "axios";

export type NormalizedApiError = {
  status?: number;
  message: string;
};

export function normalizeApiError(error: unknown): NormalizedApiError {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data as Record<string, unknown> | undefined;
    const detail = data?.detail;
    if (typeof detail === "string") {
      return { status, message: detail };
    }
    if (Array.isArray(detail)) {
      const parts = detail.map((entry) => {
        if (
          typeof entry === "object" &&
          entry !== null &&
          "msg" in entry &&
          typeof (entry as { msg: unknown }).msg === "string"
        ) {
          return (entry as { msg: string }).msg;
        }
        return JSON.stringify(entry);
      });
      return { status, message: parts.join("; ") || "Validation error" };
    }
    if (error.code === "ERR_NETWORK") {
      return {
        status,
        message:
          "Network error — check NEXT_PUBLIC_API_BASE_URL and that the payment API is running.",
      };
    }
    if (status === 401) {
      return {
        status,
        message:
          "Unauthorized — set NEXT_PUBLIC_MERCHANT_API_KEY (pk_test_..., sent as X-API-Key) or NEXT_PUBLIC_MERCHANT_ACCESS_TOKEN (JWT as Bearer).",
      };
    }
    return {
      status,
      message:
        typeof data?.message === "string"
          ? data.message
          : error.message || "Request failed",
    };
  }
  if (error instanceof Error) {
    return { message: error.message };
  }
  return { message: "Something went wrong" };
}
