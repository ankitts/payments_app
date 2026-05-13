"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/providers/auth-provider";

const NAV: { href: string; label: string; icon: string }[] = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/payments", label: "Payments", icon: "payments" },
  { href: "/wallet", label: "Wallet", icon: "account_balance_wallet" },
  { href: "/ledger", label: "Ledger", icon: "menu_book" },
  { href: "/refunds", label: "Refunds", icon: "history_toggle_off" },
  { href: "/webhooks", label: "Webhooks", icon: "webhook" },
  { href: "/api-keys", label: "API Keys", icon: "vpn_key" },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-outline-variant bg-surface-container py-lg px-md">
      <div className="mb-xl flex items-center gap-md px-md">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-container">
          <span className="material-symbols-outlined text-on-primary-container !text-[22px]">
            payments
          </span>
        </div>
        <div className="min-w-0">
          <p className="font-display text-headline-md font-semibold tracking-tight text-on-surface">
            Merchant
          </p>
          <p className="text-[11px] font-medium uppercase tracking-wider text-on-surface-variant">
            Payments
          </p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-xs">
        {NAV.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-md rounded-lg px-md py-sm text-body-sm font-medium transition-all ${
                active
                  ? "bg-secondary-container font-semibold text-on-secondary-container"
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined !text-[20px]">
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-outline-variant pt-md">
        <button
          type="button"
          className="flex w-full items-center gap-md rounded-lg px-md py-sm text-left text-body-sm font-medium text-on-surface-variant transition-all hover:bg-surface-container-high hover:text-on-surface"
          onClick={() => {
            logout();
            window.location.href = "/login";
          }}
        >
          <span className="material-symbols-outlined !text-[20px]">logout</span>
          Logout
        </button>
      </div>
    </aside>
  );
}
