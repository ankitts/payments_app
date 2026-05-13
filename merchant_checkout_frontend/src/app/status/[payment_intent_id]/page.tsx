import Link from "next/link";
import { notFound } from "next/navigation";

import { CheckoutProgress } from "@/components/CheckoutProgress";
import { StatusCard } from "@/components/StatusCard";
import { getCourseProduct } from "@/lib/product";

type Props = {
  params: Promise<{ payment_intent_id: string }>;
  searchParams?: Promise<{ course?: string }>;
};

export default async function StatusPage({ params, searchParams }: Props) {
  const { payment_intent_id: rawId } = await params;
  const query = await searchParams;
  const paymentIntentId = decodeURIComponent(rawId);
  if (!paymentIntentId) notFound();
  const course = getCourseProduct(query?.course);

  return (
    <main className="mx-auto max-w-container px-4 py-10 md:px-6 md:py-14">
      <Link
        href="/"
        className="text-sm text-muted transition hover:text-primary-soft"
      >
        ← Home
      </Link>
      <CheckoutProgress step={3} />
      <h1 className="mt-6 text-2xl font-semibold tracking-tight text-foreground md:text-[32px] md:leading-tight md:tracking-[-0.03em]">
        Enrollment status
      </h1>
      <p className="mt-2 text-[15px] text-muted">
        We will update this page as soon as your {course.name} payment reaches a final status.
      </p>
      <div className="mt-10">
        <StatusCard paymentIntentId={paymentIntentId} courseId={course.id} />
      </div>
    </main>
  );
}
