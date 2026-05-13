import Link from "next/link";

import { CheckoutForm } from "@/components/CheckoutForm";
import { CheckoutProgress } from "@/components/CheckoutProgress";
import { getCourseProduct } from "@/lib/product";
import { formatMinorCurrency } from "@/lib/format";

type Props = {
  searchParams?: Promise<{ course?: string }>;
};

export default async function CheckoutPage({ searchParams }: Props) {
  const params = await searchParams;
  const course = getCourseProduct(params?.course);
  const total = formatMinorCurrency(course.amountMinor, course.currency);

  return (
    <main className="mx-auto max-w-container px-4 py-10 md:px-6 md:py-14">
      <Link
        href="/"
        className="text-sm text-muted transition hover:text-primary-soft"
      >
        ← Back
      </Link>
      <CheckoutProgress step={1} />
      <div className="mt-2 grid gap-10 lg:grid-cols-[1fr_400px] lg:items-start">
        <CheckoutForm course={course} />
        <aside className="lg:sticky lg:top-36">
          <div className="glass-card inner-glow space-y-4 rounded-[20px] p-6">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-xl font-medium tracking-tight text-foreground">
                Order summary
              </h2>
              <span className="shrink-0 rounded-full border border-primary-soft/20 bg-primary-soft/10 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide text-primary-soft">
                {course.eyebrow}
              </span>
            </div>
            <div className="space-y-3 border-y border-outline-variant/30 py-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-foreground">{course.name}</p>
                  <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wide text-muted">
                    Lifetime access
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-semibold tracking-tight text-foreground">
                    {total}
                  </p>
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted">
                    {course.currency}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2 font-mono text-[13px] text-muted">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{total}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes (included)</span>
                <span>{formatMinorCurrency(0, course.currency)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
