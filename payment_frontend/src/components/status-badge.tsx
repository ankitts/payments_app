const styles: Record<string, string> = {
  SUCCESS:
    "bg-emerald-500/12 text-emerald-300 ring-1 ring-inset ring-emerald-400/35",
  FAILED:
    "bg-rose-500/12 text-rose-300 ring-1 ring-inset ring-rose-400/35",
  PROCESSING:
    "bg-amber-500/12 text-amber-200 ring-1 ring-inset ring-amber-400/35",
  CREATED:
    "bg-sky-500/12 text-sky-300 ring-1 ring-inset ring-sky-400/35",
  PENDING:
    "bg-sky-500/12 text-sky-300 ring-1 ring-inset ring-sky-400/35",
  CANCELLED:
    "bg-on-surface/8 text-on-surface-variant ring-1 ring-inset ring-outline-variant/60",
  REFUNDED:
    "bg-violet-500/12 text-violet-300 ring-1 ring-inset ring-violet-400/35",
};

const DEFAULT_BADGE =
  "bg-on-surface/8 text-on-surface-variant ring-1 ring-inset ring-outline-variant/50";

export function StatusBadge({ status }: { status: string }) {
  const cls = styles[status] ?? DEFAULT_BADGE;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wide ${cls}`}
    >
      {status}
    </span>
  );
}
