"use client";

import { usePathname } from "next/navigation";

import { dashboardTitleFromPath } from "@/lib/dashboard-title";
import { useAuth } from "@/providers/auth-provider";

export function TopNavbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const title = dashboardTitleFromPath(pathname);
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
        <div
          className="hidden h-6 w-px shrink-0 bg-outline-variant md:block"
          aria-hidden
        />
        <div className="hidden items-center gap-sm font-mono text-[11px] font-semibold uppercase tracking-wide text-on-surface-variant md:flex">
          <span className="material-symbols-outlined !text-[18px]">public</span>
          Live mode
        </div>
      </div>

      <div className="flex items-center gap-md">
        <div className="hidden items-center gap-sm rounded-lg border border-outline-variant bg-surface-container px-sm py-xs sm:flex">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
            Sandbox
          </span>
          <div
            className="relative h-4 w-8 rounded-full bg-surface-variant"
            aria-hidden
          >
            <span className="absolute left-1 top-1 block h-2 w-2 rounded-full bg-outline" />
          </div>
        </div>

        <div className="hidden items-center gap-xs text-on-surface-variant md:flex">
          <button
            type="button"
            className="rounded-md p-1 transition-colors hover:text-primary"
            title="Notifications"
          >
            <span className="material-symbols-outlined !text-[22px]">
              notifications
            </span>
          </button>
          <button
            type="button"
            className="rounded-md p-1 transition-colors hover:text-primary"
            title="Help"
          >
            <span className="material-symbols-outlined !text-[22px]">help</span>
          </button>
          <button
            type="button"
            className="rounded-md p-1 transition-colors hover:text-primary"
            title="Settings"
          >
            <span className="material-symbols-outlined !text-[22px]">
              settings
            </span>
          </button>
        </div>

        <div className="mx-xs hidden h-8 w-px bg-outline-variant md:block" aria-hidden />

        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-outline-variant bg-surface-container-high font-mono text-xs font-semibold text-on-surface"
          title={user?.business_name ?? user?.email ?? "Merchant"}
        >
          {initial}
        </div>

        <button
          type="button"
          className="hidden rounded-lg border border-outline-variant bg-surface-container px-md py-sm text-body-sm font-semibold text-on-surface-variant transition hover:bg-surface-container-high hover:text-on-surface md:inline-flex"
          onClick={() => {
            logout();
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}
