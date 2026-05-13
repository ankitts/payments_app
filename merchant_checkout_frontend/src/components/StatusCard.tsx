"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import {
  clearCheckoutCancelled,
  peekCheckoutCancelled,
} from "@/lib/checkout-storage";
import { formatMinorCurrency } from "@/lib/format";
import type { NormalizedApiError } from "@/lib/errors";
import { fetchPaymentIntent } from "@/services/payments";
import type { PaymentIntent } from "@/types/api";

const POLL_MS = 2500;
const TERMINAL = new Set(["SUCCESS", "FAILED", "CANCELLED"]);

type Props = {
  paymentIntentId: string;
  courseId: string;
};

export function StatusCard({ paymentIntentId, courseId }: Props) {
  const [intent, setIntent] = useState<PaymentIntent | null>(null);
  const [cancelledByCustomer, setCancelledByCustomer] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [polling, setPolling] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await fetchPaymentIntent(paymentIntentId);
      setIntent(data);
      setLoadError(null);
      return data;
    } catch (err) {
      const { message } = err as NormalizedApiError;
      setLoadError(message);
      toast.error(message);
      return null;
    }
  }, [paymentIntentId]);

  useEffect(() => {
    if (peekCheckoutCancelled(paymentIntentId)) {
      setCancelledByCustomer(true);
      setPolling(false);
      void load();
      return;
    }

    let cancelled = false;

    async function tick() {
      const data = await load();
      if (cancelled || !data) return;
      if (TERMINAL.has(data.status)) {
        setPolling(false);
        clearInterval(intervalId);
      }
    }

    const intervalId = setInterval(() => {
      void tick();
    }, POLL_MS);

    void tick();

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [paymentIntentId, load]);

  const status = cancelledByCustomer ? "CANCELLED" : intent?.status ?? "—";
  const isProcessing = !cancelledByCustomer && intent?.status === "PROCESSING";
  const isCreated = !cancelledByCustomer && intent?.status === "CREATED";
  const isSuccess = !cancelledByCustomer && intent?.status === "SUCCESS";
  const isFailed = !cancelledByCustomer && intent?.status === "FAILED";
  const isCancelled = cancelledByCustomer || intent?.status === "CANCELLED";
  const isAwaitingAction = isCreated;

  return (
    <div className="glass-card inner-glow p-6 md:p-10">
      {loadError && !intent ? (
        <div className="text-center">
          <p className="text-danger">{loadError}</p>
          <button
            type="button"
            onClick={() => void load()}
            className="mt-6 inline-flex h-11 items-center justify-center rounded-xl border border-border px-6 text-sm font-medium text-foreground transition hover:bg-surface"
          >
            Try again
          </button>
        </div>
      ) : !intent ? (
        <div className="flex flex-col items-center gap-4 py-12">
          <LoadingSpinner className="size-8" />
          <p className="text-sm text-muted">Loading payment…</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center text-center">
            {isProcessing ? (
              <>
                <LoadingSpinner className="size-10" />
                <h2 className="mt-6 text-xl font-semibold">
                  Processing your payment…
                </h2>
                <p className="mt-2 max-w-sm text-sm text-muted">
                  This can take a few seconds. This page refreshes the status
                  automatically.
                </p>
              </>
            ) : null}

            {isAwaitingAction ? (
              <>
                <div className="flex size-14 items-center justify-center rounded-full border border-border text-lg text-muted">
                  ◷
                </div>
                <h2 className="mt-6 text-xl font-semibold">
                  Awaiting confirmation
                </h2>
                <p className="mt-2 max-w-sm text-sm text-muted">
                  This payment has not been confirmed yet. Go back to payment to
                  confirm or cancel the order.
                </p>
              </>
            ) : null}

            {isSuccess ? (
              <>
                <div className="flex size-14 items-center justify-center rounded-full border border-accent/20 bg-accent/10 text-2xl text-success shadow-glow">
                  ✓
                </div>
                <h2 className="mt-6 text-xl font-semibold">Payment successful</h2>
                <p className="mt-2 text-sm text-muted">
                  Your enrollment is recorded. Check your email for course access
                  details.
                </p>
              </>
            ) : null}

            {isFailed ? (
              <>
                <div className="flex size-14 items-center justify-center rounded-full bg-danger/15 text-2xl text-danger">
                  !
                </div>
                <h2 className="mt-6 text-xl font-semibold">Payment failed</h2>
                <p className="mt-2 max-w-sm text-sm text-muted">
                  The payment could not be completed. You can retry the order
                  from the payment screen.
                </p>
              </>
            ) : null}

            {isCancelled ? (
              <>
                <div className="flex size-14 items-center justify-center rounded-full bg-danger/15 text-2xl text-danger">
                  ×
                </div>
                <h2 className="mt-6 text-xl font-semibold">Payment cancelled</h2>
                <p className="mt-2 max-w-sm text-sm text-muted">
                  Your order was cancelled before payment processing. You can
                  return to checkout whenever you are ready.
                </p>
              </>
            ) : null}
          </div>

          {intent ? (
            <dl className="mx-auto mt-10 max-w-md space-y-3 rounded-xl border border-outline-variant/40 bg-surface-container px-5 py-4 text-left text-sm">
              <div className="flex justify-between gap-4">
                <dt className="font-mono text-[10px] font-semibold uppercase tracking-widest text-muted">
                  Status
                </dt>
                <dd className="font-mono text-xs uppercase tracking-wide">
                  {status}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="font-mono text-[10px] font-semibold uppercase tracking-widest text-muted">
                  Payment ID
                </dt>
                <dd className="max-w-[200px] truncate font-mono text-xs">
                  {intent.payment_intent_id}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="font-mono text-[10px] font-semibold uppercase tracking-widest text-muted">
                  Amount
                </dt>
                <dd className="font-medium">
                  {formatMinorCurrency(intent.amount)}
                </dd>
              </div>
            </dl>
          ) : null}

          {polling &&
          intent &&
          !TERMINAL.has(intent.status) &&
          intent.status !== "CREATED" ? (
            <p className="mt-6 text-center text-xs text-muted">
              Polling every {POLL_MS / 1000}s…
            </p>
          ) : null}

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {isSuccess ? (
              <Link
                href="/"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-accent px-6 text-sm font-semibold text-white shadow-cta-glow transition hover:brightness-110"
              >
                Back to course
              </Link>
            ) : null}
            {isFailed ? (
              <Link
                href={`/payment/${encodeURIComponent(paymentIntentId)}?course=${courseId}`}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-border px-6 text-sm font-semibold text-foreground transition hover:bg-surface"
              >
                Retry payment
              </Link>
            ) : null}
            {isCancelled ? (
              <Link
                href={`/checkout?course=${courseId}`}
                onClick={() => clearCheckoutCancelled(paymentIntentId)}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-accent px-6 text-sm font-semibold text-white shadow-cta-glow transition hover:brightness-110"
              >
                Return to checkout
              </Link>
            ) : null}
            {isAwaitingAction ? (
              <Link
                href={`/payment/${encodeURIComponent(paymentIntentId)}?course=${courseId}`}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-accent px-6 text-sm font-semibold text-white shadow-cta-glow transition hover:brightness-110"
              >
                Go to payment
              </Link>
            ) : null}
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center rounded-xl px-6 text-sm font-medium text-muted transition hover:text-foreground"
            >
              Back to product
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
