"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { CardSurface } from "@/components/card-surface";
import { DISPLAY_CURRENCY, parseMajorCurrencyToMinor } from "@/lib/format";
import { isNormalizedApiError } from "@/lib/guards";
import { queryKeys } from "@/lib/query-keys";
import { createPaymentIntent } from "@/services/payments";

export default function CreatePaymentPage() {
  const router = useRouter();
  const qc = useQueryClient();

  const [amount, setAmount] = useState("");
  const [orderId, setOrderId] = useState("");

  const createMut = useMutation({
    mutationFn: createPaymentIntent,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: queryKeys.payments });
      toast.success(`Payment created: ${data.payment_intent_id}`);
      router.replace(`/payments/${encodeURIComponent(data.payment_intent_id)}`);
    },
    onError: (err: unknown) => {
      const msg = isNormalizedApiError(err)
        ? err.message
        : err instanceof Error
          ? err.message
          : "Could not create payment.";
      toast.error(msg);
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const amountMinor = parseMajorCurrencyToMinor(amount);
    if (!orderId.trim()) {
      toast.error("Order ID is required.");
      return;
    }
    if (amountMinor === null) {
      toast.error("Amount must be a positive INR value with up to 2 decimals.");
      return;
    }
    const idempotencyKey =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`;

    createMut.mutate({
      idempotency_key: idempotencyKey,
      amount: amountMinor,
      currency: DISPLAY_CURRENCY,
      order_id: orderId.trim(),
    });
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <Link
          href="/payments"
          className="text-sm text-primary hover:underline"
        >
          ← Back to payments
        </Link>
        <p className="mt-3 max-w-xl text-body-md text-on-surface-variant">
          Creates a capture-ready intent scoped to your merchant account.
        </p>
      </div>

      <CardSurface title="Payment intent details">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm text-on-surface-variant">
              Amount{" "}
              <span className="text-[11px] opacity-75">
                (INR, rupees)
              </span>
            </label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/25"
              value={amount}
              onChange={(ev) => setAmount(ev.target.value)}
              placeholder="1999.00"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-on-surface-variant">
              Currency
            </label>
            <div
              className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm outline-none uppercase focus:border-primary-container focus:ring-2 focus:ring-primary-container/25"
              aria-label="Currency"
            >
              {DISPLAY_CURRENCY}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm text-on-surface-variant">
              Order ID
            </label>
            <input
              className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/25"
              value={orderId}
              onChange={(ev) => setOrderId(ev.target.value)}
              required
              placeholder="ord_12345"
            />
          </div>
          <button
            type="submit"
            disabled={createMut.isPending}
            className="w-full rounded-lg bg-primary-container text-on-primary-container py-3 text-sm font-semibold shadow-sm hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {createMut.isPending ? "Creating…" : "Create intent"}
          </button>
        </form>
      </CardSurface>
    </div>
  );
}
