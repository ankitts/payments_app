/** Page title for the dashboard shell top bar (matches Stitch header labels). */
export function dashboardTitleFromPath(pathname: string): string {
  if (pathname.startsWith("/payments/create")) return "Create payment";
  if (pathname.startsWith("/payments/") && pathname !== "/payments")
    return "Payment detail";
  if (pathname === "/payments") return "Payments";
  if (pathname === "/wallet") return "Wallet";
  if (pathname === "/ledger") return "Ledger";
  if (pathname === "/refunds") return "Refunds";
  if (pathname === "/webhooks") return "Webhooks";
  if (pathname === "/api-keys") return "API Keys";
  if (pathname === "/dashboard") return "Dashboard";
  return "Merchant";
}
