import Link from "next/link";

type Props = {
  children: React.ReactNode;
};

export function AppChrome({ children }: Props) {
  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
        <div className="hero-glow" />
      </div>
      <header className="sticky top-0 z-20 border-b border-outline-variant/80 bg-surface/90 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-container items-center justify-between px-4 md:px-6">
          <Link
            href="/"
            className="text-[15px] font-semibold tracking-tight text-foreground transition hover:text-primary-soft"
          >
            DevStack<span className="text-muted"> · </span>Academy
          </Link>
          <Link
            href="/checkout"
            className="rounded-full border border-primary-soft/30 px-3 py-1.5 text-xs font-semibold text-primary-soft transition hover:bg-primary-soft/10"
          >
            Enroll now
          </Link>
        </div>
      </header>
      <div className="relative">{children}</div>
    </div>
  );
}
