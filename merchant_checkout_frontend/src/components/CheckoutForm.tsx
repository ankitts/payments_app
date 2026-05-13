"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import { saveCheckoutCustomer } from "@/lib/checkout-storage";
import type { CourseProduct } from "@/lib/product";
import type { NormalizedApiError } from "@/lib/errors";
import { createPaymentIntent } from "@/services/payments";

function formatOrderId(course: CourseProduct) {
  return `${course.id.toUpperCase()}_${Date.now().toString(36).toUpperCase()}`;
}

type Props = {
  course: CourseProduct;
};

export function CheckoutForm({ course }: Props) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      toast.error("Please enter your name and email.");
      return;
    }
    setLoading(true);
    try {
      const idempotencyKey = `checkout_${crypto.randomUUID()}`;
      const body = {
        amount: course.amountMinor,
        currency: course.currency,
        order_id: formatOrderId(course),
        idempotency_key: idempotencyKey,
      };
      const intent = await createPaymentIntent(body);
      saveCheckoutCustomer({ fullName: fullName.trim(), email: email.trim() });
      router.push(
        `/payment/${encodeURIComponent(intent.payment_intent_id)}?course=${course.id}`,
      );
    } catch (err) {
      const { message } = err as NormalizedApiError;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-[32px] md:leading-tight md:tracking-[-0.03em]">
          Checkout
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">
          Enter your details and continue to secure payment confirmation.
        </p>
      </header>
      <form
        onSubmit={onSubmit}
        className="glass-card inner-glow space-y-5 rounded-[20px] p-6 md:p-8"
      >
        <div>
          <label className="mb-2 block font-mono text-[11px] font-semibold uppercase tracking-widest text-muted">
            Full name
          </label>
          <input
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface-elevated px-4 py-3.5 text-[17px] text-foreground outline-none transition placeholder:text-outline-variant/50 focus:border-accent focus:ring-4 focus:ring-accent/10"
            placeholder="John Doe"
            autoComplete="name"
            disabled={loading}
          />
        </div>
        <div>
          <label className="mb-2 block font-mono text-[11px] font-semibold uppercase tracking-widest text-muted">
            Email address
          </label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface-elevated px-4 py-3.5 text-[17px] text-foreground outline-none transition placeholder:text-outline-variant/50 focus:border-accent focus:ring-4 focus:ring-accent/10"
            placeholder="you@company.com"
            autoComplete="email"
            disabled={loading}
          />
        </div>
        <div className="flex items-center gap-2 border-t border-outline-variant/30 pt-5 text-muted opacity-80">
          <span className="text-lg" aria-hidden>
            🔒
          </span>
          <span className="font-mono text-[12px] leading-snug">
            Your enrollment details are used only to create this order.
          </span>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent text-sm font-semibold text-white shadow-cta-glow transition hover:brightness-110 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50"
        >
          {loading ? (
            <>
              <LoadingSpinner className="size-4 border-white/30 border-t-white" />
              Creating payment intent…
            </>
          ) : (
            <>
              Continue to payment
              <span aria-hidden>→</span>
            </>
          )}
        </button>
      </form>
    </section>
  );
}
