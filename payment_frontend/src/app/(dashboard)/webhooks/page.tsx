"use client";

import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { CardSurface } from "@/components/card-surface";
import { isNormalizedApiError } from "@/lib/guards";
import { patchWebhook } from "@/services/webhooks";
import { useAuth } from "@/providers/auth-provider";

export default function WebhooksPage() {
  const { user, reloadProfile } = useAuth();
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(user?.webhook_url ?? "");
  }, [user?.webhook_url]);

  const patchMut = useMutation({
    mutationFn: patchWebhook,
    onSuccess: async () => {
      toast.success("Webhook settings updated.");
      await reloadProfile();
    },
    onError: (err: unknown) => {
      const msg = isNormalizedApiError(err)
        ? err.message
        : err instanceof Error
          ? err.message
          : "Unable to save webhook.";
      toast.error(msg);
    },
  });

  function submitUrl(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) {
      toast.error("Enter a valid HTTPS URL.");
      return;
    }
    patchMut.mutate({
      webhook_url: url.trim(),
      regenerate_webhook_secret: false,
    });
  }

  function regenerate() {
    patchMut.mutate({ regenerate_webhook_secret: true });
  }

  async function copySecret() {
    if (!user?.webhook_secret) {
      toast.message("Generate a secret first.", {
        description: "Use regenerate to create signing material.",
      });
      return;
    }
    await navigator.clipboard.writeText(user.webhook_secret);
    toast.success("Webhook secret copied.");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <p className="max-w-2xl text-body-md text-on-surface-variant">
          Configure where we POST signed payment lifecycle notifications.
        </p>
      </header>

      <CardSurface title="Endpoint">
        <form className="space-y-3" onSubmit={submitUrl}>
          <label className="block text-sm text-on-surface-variant">Webhook URL</label>
          <input
            type="url"
            required
            className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/30"
            placeholder="https://api.merchant.com/webhooks/payments"
            value={url}
            onChange={(ev) => setUrl(ev.target.value)}
          />
          <button
            disabled={patchMut.isPending}
            type="submit"
            className="rounded-lg bg-primary-container text-on-primary-container px-4 py-2 text-sm font-semibold shadow-sm hover:brightness-110 disabled:opacity-60"
          >
            {patchMut.isPending ? "Saving…" : "Update URL"}
          </button>
        </form>
      </CardSurface>

      <CardSurface title="Webhook secret">
        <p className="mb-4 text-sm text-on-surface-variant">
          Used by the processor to compute HMAC signatures on outbound payloads. Keep it private —
          rotating invalidates signatures only after you&apos;ve updated integrations.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <code className="flex-1 min-w-[200px] overflow-x-auto rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 font-mono text-xs text-on-surface-variant">
            {user?.webhook_secret
              ? maskSecret(user.webhook_secret)
              : "No secret configured"}
          </code>
          <button
            type="button"
            onClick={() => copySecret()}
            className="rounded-lg border border-outline-variant px-3 py-2 text-xs font-semibold uppercase tracking-wide text-on-surface-variant hover:bg-surface-container-high"
          >
            Copy
          </button>
          <button
            type="button"
            disabled={patchMut.isPending}
            onClick={() => regenerate()}
            className="rounded-lg border border-amber-500/40 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-amber-300 hover:bg-amber-500/10 disabled:opacity-60"
          >
            Regenerate
          </button>
        </div>
      </CardSurface>
    </div>
  );
}

function maskSecret(secret: string) {
  if (secret.length <= 10) return "••••••••";
  return `${secret.slice(0, 6)}…${secret.slice(-4)}`;
}
