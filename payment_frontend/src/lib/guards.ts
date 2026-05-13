import type { NormalizedApiError } from "./errors";

export function isNormalizedApiError(error: unknown): error is NormalizedApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as NormalizedApiError).message === "string"
  );
}
