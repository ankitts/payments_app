"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/providers/auth-provider";

export default function HomePage() {
  const router = useRouter();
  const { token, isReady } = useAuth();

  useEffect(() => {
    if (!isReady) return;
    router.replace(token ? "/dashboard" : "/login");
  }, [isReady, token, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-container-lowest text-on-surface-variant">
      <p className="text-sm">Loading…</p>
    </div>
  );
}
