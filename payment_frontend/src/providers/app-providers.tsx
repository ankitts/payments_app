"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { Toaster } from "sonner";

import { AuthProvider } from "./auth-provider";

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
        <Toaster
          richColors
          position="top-right"
          theme="dark"
          toastOptions={{
            classNames: {
              toast:
                "border border-outline-variant bg-surface-container-high text-on-surface shadow-stitch-card",
              title: "text-on-surface font-semibold",
              description: "text-on-surface-variant text-body-sm",
              actionButton:
                "bg-primary-container text-on-primary-container font-semibold",
              cancelButton:
                "border border-outline-variant bg-surface-container text-on-surface-variant",
              closeButton:
                "text-on-surface-variant hover:text-on-surface bg-transparent border-0",
            },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}
