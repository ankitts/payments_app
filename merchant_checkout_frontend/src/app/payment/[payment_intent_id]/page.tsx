import Link from "next/link";
import { notFound } from "next/navigation";

import { CheckoutProgress } from "@/components/CheckoutProgress";
import { PaymentForm } from "@/components/PaymentForm";
import { getCourseProduct } from "@/lib/product";
import { formatMinorCurrency } from "@/lib/format";

type Props = {
  params: Promise<{ payment_intent_id: string }>;
  searchParams?: Promise<{ course?: string }>;
};

export default async function PaymentPage({ params, searchParams }: Props) {
  const { payment_intent_id: rawId } = await params;
  const query = await searchParams;
  const paymentIntentId = decodeURIComponent(rawId);
  if (!paymentIntentId) notFound();

  const course = getCourseProduct(query?.course);
  const total = formatMinorCurrency(course.amountMinor, course.currency);

  return (
    <main className="mx-auto max-w-container px-4 py-10 md:px-6 md:py-14">
      <Link
        href="/checkout"
        className="text-sm text-muted transition hover:text-primary-soft"
      >
        ← Checkout
      </Link>
      <CheckoutProgress step={2} />
      <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-[28px]">
          Payment
        </h1>
        <p className="max-w-xl font-mono text-[11px] text-muted md:text-right">
          Order reference{" "}
          <span className="break-all text-foreground/90">{paymentIntentId}</span>
        </p>
      </div>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
        Confirm your enrollment or cancel this order before payment processing begins.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-10 lg:items-start">
        <div className="lg:col-span-6">
          <PaymentForm paymentIntentId={paymentIntentId} courseId={course.id} />
        </div>
        <aside className="lg:sticky lg:top-36 lg:col-span-4">
          <div className="glass-card inner-glow overflow-hidden rounded-[20px]">
            <div className="border-b border-outline-variant/30 bg-surface-container px-5 py-4">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-muted">
                Order summary
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-mono text-[10px] font-bold uppercase text-tertiary">
                  Total
                </span>
                <span className="text-2xl font-semibold tracking-tight text-foreground">
                  {total}
                </span>
              </div>
            </div>
            <div className="space-y-4 p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-outline-variant/50 bg-surface-container text-accent">
                    <span aria-hidden>▤</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {course.name}
                    </p>
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-wide text-muted">
                      {course.eyebrow}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 text-muted">{total}</span>
              </div>
              <div className="flex justify-between text-sm text-muted">
                <span>Service tax</span>
                <span>Included</span>
              </div>
              <div className="flex justify-between text-sm text-muted">
                <span>Access</span>
                <span>Lifetime</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
