"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { DashboardShell } from "@/components/dashboard-shell";
import { useAuth } from "@/providers/auth-provider";

export default function DashboardRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, isReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isReady) return;
    if (!token) router.replace("/login");
  }, [isReady, token, router]);

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-container-lowest text-on-surface-variant">
        Loading…
      </div>
    );
  }

  if (!token) {
    return null;
  }

  return <DashboardShell>{children}</DashboardShell>;
}
