"use client";

import type { ReactNode } from "react";

import { DashboardSidebar } from "./dashboard-sidebar";
import { TopNavbar } from "./top-navbar";

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas font-sans text-on-surface">
      <DashboardSidebar />
      <div className="flex min-h-screen flex-col pl-64">
        <TopNavbar />
        <main className="mx-auto w-full max-w-[1600px] flex-1 space-y-lg p-lg">
          {children}
        </main>
      </div>
    </div>
  );
}
