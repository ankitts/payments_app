import Link from "next/link";

import { ProductCard } from "@/components/ProductCard";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-container px-4 py-10 md:px-6 md:py-14">
      <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-primary-soft">
            DevStack Academy
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground md:text-3xl md:tracking-tight">
            Build real software skills across web, ML, and cloud
          </h1>
        </div>
        <p className="max-w-md text-[15px] leading-relaxed text-muted">
          Enroll once and get lifetime access to guided tracks, project briefs,
          and practical engineering lessons you can keep coming back to.
        </p>
      </header>
      <ProductCard />
      <p className="mt-3 text-center text-sm">
        <Link
          href="/checkout"
          className="text-primary-soft underline-offset-4 transition hover:underline"
        >
          Skip to checkout
        </Link>
      </p>
    </main>
  );
}
