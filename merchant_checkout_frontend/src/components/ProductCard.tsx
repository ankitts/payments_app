import Link from "next/link";

import { formatMinorCurrency } from "@/lib/format";
import { COURSE_PRODUCTS, type CourseProduct } from "@/lib/product";

function CheckRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 text-foreground">
      <span className="mt-0.5 text-primary-soft" aria-hidden>
        <svg
          className="size-5 shrink-0"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      </span>
      <span className="text-[15px] leading-relaxed">{children}</span>
    </div>
  );
}

export function ProductCard() {
  const combo = COURSE_PRODUCTS.find((course) => course.isCombo);

  return (
    <div className="glass-card inner-glow p-8 md:p-10">
      <div className="relative z-[2] grid gap-10 lg:grid-cols-10 lg:items-start">
        <div className="lg:col-span-5">
          <div className="inline-flex items-center rounded-full border border-primary-soft/20 bg-primary-soft/10 px-3 py-1.5">
            <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-primary-soft">
              Course catalog
            </span>
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-foreground md:text-5xl md:leading-[1.1]">
            Choose the tech stack you want to master
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed tracking-[-0.01em] text-muted">
            Focus on one track or unlock the full catalog with the discounted
            combo.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            {[
              "Short, practical lessons",
              "Project-based curriculum",
              "Lifetime access",
            ].map((f) => (
              <CheckRow key={f}>
                <span className="text-foreground">{f}</span>
              </CheckRow>
            ))}
          </div>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-8">
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-outline-variant">
                Combo price
              </p>
              <p className="mt-1 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                {combo ? formatMinorCurrency(combo.amountMinor, combo.currency) : null}
              </p>
            </div>
            <Link
              href={`/checkout?course=${combo?.id ?? "complete-combo"}`}
              className="inline-flex h-14 shrink-0 items-center justify-center rounded-xl bg-accent px-10 text-lg font-semibold text-white shadow-cta-glow transition hover:brightness-110 active:scale-[0.98] sm:min-w-[200px]"
            >
              Enroll in combo
            </Link>
          </div>
        </div>

        <div className="relative flex justify-center lg:col-span-5">
          <div className="glass-card inner-glow flex w-full flex-col gap-4 rounded-[20px] p-6 md:p-8">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-outline-variant">
              Available tracks
            </p>
            <div className="grid gap-3">
              {COURSE_PRODUCTS.map((course) => (
                <CourseTile key={course.id} course={course} />
              ))}
            </div>
            <div className="border-t border-outline-variant/30 pt-4">
              <div className="mb-2 flex justify-between font-mono text-[10px] uppercase tracking-wide text-outline-variant">
                <span>Combo discount</span>
                <span className="text-primary-soft">70% of combined price</span>
              </div>
              <div className="h-1 w-full overflow-hidden rounded-full bg-surface-container-highest">
                <div className="h-full w-[70%] rounded-full bg-gradient-to-r from-primary-soft to-accent" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="relative z-[2] mt-12 grid gap-4 md:grid-cols-3 md:gap-6">
        {[
          {
            title: "Structured learning",
            body: "Step-by-step tracks from fundamentals to production-style deployments.",
          },
          {
            title: "Project based",
            body: "APIs, ML workflows, and cloud-shaped assignments you can show in interviews.",
          },
          {
            title: "Lifetime access",
            body: "One purchase unlocks the full course bundle and future lesson updates.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="glass-card inner-glow rounded-xl p-5 md:p-6"
          >
            <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary-soft/10 text-primary-soft">
              <span className="text-lg" aria-hidden>
                ✦
              </span>
            </div>
            <h3 className="text-lg font-semibold tracking-tight text-foreground">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

function CourseTile({ course }: { course: CourseProduct }) {
  return (
    <div
      className="module-tile rounded-xl border-l-4 p-4"
      style={{ borderLeftColor: course.accent }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-mono text-xs" style={{ color: course.accent }}>
              {course.eyebrow}
            </p>
            {course.isCombo ? (
              <span className="rounded-full border border-primary-soft/20 bg-primary-soft/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-primary-soft">
                30% off
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-lg font-medium text-foreground">{course.name}</p>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            {course.description}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-semibold text-foreground">
            {formatMinorCurrency(course.amountMinor, course.currency)}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
            one-time
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {course.features.map((feature) => (
          <span
            key={feature}
            className="rounded-full border border-outline-variant/50 px-2.5 py-1 text-[11px] text-muted"
          >
            {feature}
          </span>
        ))}
      </div>
      <Link
        href={`/checkout?course=${course.id}`}
        className="mt-4 inline-flex h-10 items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-white shadow-cta-glow transition hover:brightness-110 active:scale-[0.98]"
      >
        Enroll
      </Link>
    </div>
  );
}
