import type { ReactNode } from "react";

/**
 * Stitch login layout: ambient gradient orbs + centered column (`login_desktop/code.html`).
 */
export function AuthPageShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-canvas p-md font-sans text-on-surface">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-[10%] -top-[10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-tertiary/10 blur-[120px]" />
      </div>
      <div className="relative z-10 w-full max-w-[440px]">{children}</div>
      <aside className="pointer-events-none fixed bottom-[5%] right-[5%] z-0 hidden h-[320px] w-[320px] flex-col justify-end p-lg lg:flex">
        <div className="glass-panel flex h-full w-full flex-col justify-between rounded-3xl border border-outline-variant/30 bg-surface-container/30 p-lg">
          <div className="space-y-sm">
            <div className="h-2 w-10 rounded-full bg-primary/20" />
            <div className="h-2 w-24 rounded-full bg-outline-variant/40" />
          </div>
          <div className="space-y-md">
            <h3 className="font-display text-headline-md leading-tight text-on-surface">
              Fast. Secure. Universal.
            </h3>
            <p className="text-body-sm text-on-surface-variant">
              Manage INR payments and wallet activity from a single interface.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
