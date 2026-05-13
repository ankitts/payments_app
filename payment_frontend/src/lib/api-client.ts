import axios from "axios";

import { normalizeApiError } from "./errors";

const baseURL =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/+$/, "")
    : process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config;
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      typeof window !== "undefined"
    ) {
      localStorage.removeItem("access_token");
      const path = window.location.pathname;
      if (!path.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(normalizeApiError(error));
  },
);
