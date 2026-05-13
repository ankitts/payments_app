export function LoadingSpinner({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block size-5 rounded-full border-2 border-muted/40 border-t-accent animate-spin ${className}`}
      aria-hidden
    />
  );
}
