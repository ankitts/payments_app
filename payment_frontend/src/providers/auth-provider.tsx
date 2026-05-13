"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";

import { fetchMerchantProfile, loginMerchant } from "@/services/auth";
import type { MerchantProfile } from "@/types/api";

const TOKEN_KEY = "access_token";

type AuthCtx = {
  token: string | null;
  isReady: boolean;
  user: MerchantProfile | null;
  logout: () => void;
  loginWithPassword: (email: string, password: string) => Promise<void>;
  reloadProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<MerchantProfile | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored =
      typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
    setTokenState(stored);
    setIsReady(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setTokenState(null);
    setUser(null);
    queryClient.clear();
  }, [queryClient]);

  useEffect(() => {
    if (!isReady) return;

    if (!token) {
      setUser(null);
      return;
    }

    let cancelled = false;
    fetchMerchantProfile()
      .then((profile) => {
        if (!cancelled) setUser(profile);
      })
      .catch(() => {
        if (!cancelled) {
          logout();
        }
      });
    return () => {
      cancelled = true;
    };
  }, [isReady, token, logout]);

  const loginWithPassword = useCallback(
    async (email: string, password: string) => {
      const res = await loginMerchant(email, password);
      if (!res.success || !res.access_token) {
        throw new Error(res.message || "Login failed");
      }
      localStorage.setItem(TOKEN_KEY, res.access_token);
      setTokenState(res.access_token);
      queryClient.invalidateQueries();
    },
    [queryClient],
  );

  const reloadProfile = useCallback(async () => {
    if (!token) return;
    const profile = await fetchMerchantProfile();
    setUser(profile);
  }, [token]);

  const value = useMemo(
    (): AuthCtx => ({
      token,
      isReady,
      user,
      logout,
      loginWithPassword,
      reloadProfile,
    }),
    [
      token,
      isReady,
      user,
      logout,
      loginWithPassword,
      reloadProfile,
    ],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
