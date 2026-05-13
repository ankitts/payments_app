"use client";

import { useState } from "react";
import { toast } from "sonner";

import {
  DISPLAY_CURRENCY,
  formatMinorCurrency,
  parseMajorCurrencyToMinor,
} from "@/lib/format";
import { isNormalizedApiError } from "@/lib/guards";

type Props = {
  open: boolean;
  onClose: () => void;
  paymentIntentId: string;
  maxRefundAmount: number;
  onSubmitRefund: (args: {
    amount: number;
    reason: string;
    idempotencyKey: string;
  }) => Promise<void>;
};

export function RefundModal({
  open,
  onClose,
  paymentIntentId,
  maxRefundAmount,
  onSubmitRefund,
}: Props) {
  const [amountStr, setAmountStr] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amountMinor = parseMajorCurrencyToMinor(amountStr);
    if (amountMinor === null) {
      toast.error("Refund amount must be a positive INR value with up to 2 decimals.");
      return;
    }
    if (amountMinor > maxRefundAmount) {
      toast.error(
        `Amount exceeds refundable balance (${formatMinorCurrency(maxRefundAmount)}).`,
      );
      return;
    }
    if (!reason.trim()) {
      toast.error("Reason is required.");
      return;
    }

    const idempotencyKey =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`;

    setLoading(true);
    try {
      await onSubmitRefund({
        amount: amountMinor,
        reason: reason.trim(),
        idempotencyKey,
      });
      toast.success("Refund initiated.");
      setAmountStr("");
      setReason("");
      onClose();
    } catch (err: unknown) {
      const msg = isNormalizedApiError(err)
        ? err.message
        : err instanceof Error
          ? err.message
          : "Refund failed.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-[2px]">
      <div
        role="dialog"
        aria-modal
        aria-labelledby="refund-title"
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl border border-outline-variant bg-surface-container-low p-6 shadow-xl"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 id="refund-title" className="text-lg font-semibold">
              Create refund
            </h2>
            <p className="mt-1 text-xs text-on-surface-variant">
              Payment {paymentIntentId} · refundable up to{" "}
              <span className="font-semibold tabular-nums">
                {formatMinorCurrency(maxRefundAmount)}
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-md p-1 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-on-surface-variant">
              Refund amount ({DISPLAY_CURRENCY}, rupees)
            </label>
            <input
              inputMode="decimal"
              className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/30"
              value={amountStr}
              onChange={(ev) => setAmountStr(ev.target.value)}
              placeholder="100.00"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-on-surface-variant">
              Reason
            </label>
            <textarea
              rows={3}
              className="w-full resize-none rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/30"
              value={reason}
              onChange={(ev) => setReason(ev.target.value)}
              placeholder="Reason for issuing this refund"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="rounded-lg border border-outline-variant px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-container-high"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-primary-container text-on-primary-container px-4 py-2 text-sm font-semibold shadow-sm hover:brightness-110 disabled:opacity-60"
            >
              {loading ? "Submitting…" : "Create refund"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
