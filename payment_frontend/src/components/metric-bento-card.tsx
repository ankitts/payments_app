import type { ReactNode } from "react";

type Props = {
  eyebrow: string;
  headline: string;
  icon: ReactNode;
  iconWrapClassName?: string;
  children: ReactNode;
};

/**
 * Bento-style KPI tile from Stitch (`dashboard_desktop`): tonal card, mono label, display figure, icon tile.
 */
export function MetricBentoCard({
  eyebrow,
  headline,
  icon,
  iconWrapClassName = "bg-primary/10 text-primary",
  children,
}: Props) {
  return (
    <div className="group rounded-xl border border-outline-variant bg-surface-container-low p-lg shadow-stitch-card transition-colors hover:border-primary">
      <div className="mb-xl flex items-start justify-between gap-md">
        <div className="min-w-0">
          <p className="mb-xs font-mono text-[11px] font-medium uppercase tracking-wider text-on-surface-variant">
            {eyebrow}
          </p>
          <h3 className="font-display text-headline-lg tracking-tighter text-on-surface tabular-nums md:text-display-lg">
            {headline}
          </h3>
        </div>
        <div
          className={`flex shrink-0 items-center justify-center rounded-lg p-sm ${iconWrapClassName}`}
        >
          {icon}
        </div>
      </div>
      {children}
    </div>
  );
}
