"use client";

import { toast } from "sonner";

import { CardSurface } from "@/components/card-surface";
import { useAuth } from "@/providers/auth-provider";

export default function ApiKeysPage() {
  const { user } = useAuth();

  async function copyKey() {
    if (!user?.api_key) return;
    await navigator.clipboard.writeText(user.api_key);
    toast.success("API key copied.");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <p className="max-w-2xl text-body-md text-on-surface-variant">
          Programmatic credentials for integrating your backend with the Payments API (
          regenerate flow can be layered on later ).
        </p>
      </header>

      <CardSurface title="Current key">
        <div className="flex flex-wrap items-center gap-2">
          <code className="flex-1 min-w-[260px] break-all rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-3 font-mono text-sm text-primary">
            {user?.api_key ?? "Loading…"}
          </code>
          <button
            type="button"
            onClick={() => copyKey()}
            disabled={!user?.api_key}
            className="rounded-lg border border-outline-variant px-4 py-2 text-sm font-semibold text-on-surface-variant hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-40"
          >
            Copy API key
          </button>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-on-surface-variant">
          Treat this credential like production infrastructure access. Prefer environment variables over
          storing it directly in dashboards or client-side bundles beyond this console.
        </p>
      </CardSurface>

      <CardSurface title="Regenerate API key">
        <p className="text-sm text-on-surface-variant">
          Optional MVP item — rotating keys requires backend support beyond simple GET profile. Ping the
          platform team once you&apos;re ready to automate rotation.
        </p>
      </CardSurface>
    </div>
  );
}
