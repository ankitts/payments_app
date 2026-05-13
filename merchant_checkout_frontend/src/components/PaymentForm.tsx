"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import {
  clearCheckoutCancelled,
  setCheckoutCancelled,
} from "@/lib/checkout-storage";
import type { NormalizedApiError } from "@/lib/errors";
import { confirmPaymentIntent } from "@/services/payments";

type Props = {
  paymentIntentId: string;
  courseId: string;
};

export function PaymentForm({ paymentIntentId, courseId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const statusHref = `/status/${encodeURIComponent(paymentIntentId)}?course=${courseId}`;

  async function confirmPayment() {
    clearCheckoutCancelled(paymentIntentId);
    setLoading(true);
    try {
      await confirmPaymentIntent(paymentIntentId);
      router.push(statusHref);
    } catch (err) {
      const { message } = err as NormalizedApiError;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  function cancelPayment() {
    setCheckoutCancelled(paymentIntentId);
    router.push(statusHref);
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium tracking-tight text-foreground md:text-2xl">
        Review and confirm
      </h2>
      <p className="text-sm leading-relaxed text-muted">
        Choose confirm to complete your enrollment, or cancel if you do not want
        to continue with this order.
      </p>

      <div className="glass-card inner-glow space-y-6 rounded-[20px] p-6 md:p-8">
        <div className="rounded-xl border border-outline-variant/50 bg-surface-container px-4 py-4">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-muted">
            Payment confirmation
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Your payment will be submitted for processing immediately after you
            confirm.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            disabled={loading}
            onClick={confirmPayment}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-accent text-base font-semibold text-white shadow-cta-glow transition hover:brightness-110 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50"
          >
            {loading ? (
              <>
                <LoadingSpinner className="size-4 border-white/30 border-t-white" />
                Confirming…
              </>
            ) : (
              "Confirm payment"
            )}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={cancelPayment}
            className="flex h-14 w-full items-center justify-center rounded-xl border border-border px-6 text-base font-semibold text-foreground transition hover:bg-surface disabled:opacity-50"
          >
            Cancel order
          </button>
        </div>
      </div>
    </div>
  );
}
