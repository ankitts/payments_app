"use client";

import { usePathname } from "next/navigation";

import { dashboardTitleFromPath } from "@/lib/dashboard-title";
import { useAuth } from "@/providers/auth-provider";

export function TopNavbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const title = dashboardTitleFromPath(pathname);
  const businessName = user?.business_name?.trim() || user?.email || "Merchant";
  const initial = (
    user?.business_name?.trim()?.[0] ??
    user?.email?.[0] ??
    "?"
  ).toUpperCase();

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-outline-variant bg-background/80 px-lg backdrop-blur-md">
      <div className="flex min-w-0 flex-1 items-center gap-lg">
        <h1 className="truncate font-display text-headline-md font-semibold tracking-tight text-on-surface">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-md">
        <div className="flex min-w-0 items-center gap-sm rounded-full border border-outline-variant bg-surface-container px-sm py-xs">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-outline-variant bg-surface-container-high font-mono text-xs font-semibold text-on-surface"
            title={businessName}
          >
            {initial}
          </div>
          <div className="hidden min-w-0 pr-sm sm:block">
            <p className="truncate text-body-sm font-semibold text-on-surface">
              {businessName}
            </p>
            <p className="text-[10px] font-medium uppercase tracking-wider text-on-surface-variant">
              Business
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
