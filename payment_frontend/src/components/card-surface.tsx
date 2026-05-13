import type { ReactNode } from "react";

export function CardSurface({
  children,
  title,
  description,
}: {
  children: ReactNode;
  title?: string;
  description?: string;
}) {
  return (
    <section className="rounded-stitch-lg border border-outline-variant bg-surface-container-low shadow-stitch-card">
      {(title ?? description) && (
        <div className="border-b border-outline-variant/80 px-lg py-md">
          {title ? (
            <h2 className="font-display text-headline-md font-semibold text-on-surface">
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="mt-xs text-body-sm text-on-surface-variant">{description}</p>
          ) : null}
        </div>
      )}
      <div className="p-lg">{children}</div>
    </section>
  );
}
