"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { CardSurface } from "@/components/card-surface";
import { isNormalizedApiError } from "@/lib/guards";
import { queryKeys } from "@/lib/query-keys";
import { createPaymentIntent } from "@/services/payments";

export default function CreatePaymentPage() {
  const router = useRouter();
  const qc = useQueryClient();

  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
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

    const n = Number(amount);
    if (!orderId.trim()) {
      toast.error("Order ID is required.");
      return;
    }
    if (!n || !Number.isInteger(n)) {
      toast.error("Amount must be a positive integer (minor currency units).");
      return;
    }
    const idempotencyKey =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`;

    createMut.mutate({
      idempotency_key: idempotencyKey,
      amount: n,
      currency: currency.trim().toUpperCase() || "USD",
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
                (integer, e.g. minor units like cents/paise)
              </span>
            </label>
            <input
              type="number"
              min={1}
              step={1}
              className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/25"
              value={amount}
              onChange={(ev) => setAmount(ev.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-on-surface-variant">
              Currency{" "}
              <span className="text-[11px] uppercase opacity-75">ISO 4217</span>
            </label>
            <input
              className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm outline-none uppercase focus:border-primary-container focus:ring-2 focus:ring-primary-container/25"
              placeholder="USD"
              maxLength={3}
              value={currency}
              onChange={(ev) => setCurrency(ev.target.value.toUpperCase())}
              required
            />
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
