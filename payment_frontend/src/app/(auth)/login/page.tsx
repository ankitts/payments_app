"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AuthPageShell } from "@/components/auth-page-shell";
import { StrideLogo } from "@/components/stride-logo";
import { isNormalizedApiError } from "@/lib/guards";
import { useAuth } from "@/providers/auth-provider";

export default function LoginPage() {
  const router = useRouter();
  const { loginWithPassword, token, isReady } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isReady) return;
    if (token) router.replace("/dashboard");
  }, [token, isReady, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Email and password are required.");
      return;
    }
    setLoading(true);
    try {
      await loginWithPassword(email.trim(), password);
      toast.success("Signed in.");
      router.replace("/dashboard");
    } catch (err: unknown) {
      const msg = isNormalizedApiError(err)
        ? err.message
        : err instanceof Error
          ? err.message
          : "Login failed.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthPageShell>
      <div className="rounded-stitch-lg border border-outline-variant bg-surface-container-low p-xl shadow-stitch-card">
        <div className="mb-xl flex flex-col items-center text-center">
          <StrideLogo align="center" className="mb-md h-10 w-auto" />
          <h1 className="font-display text-headline-lg tracking-tight text-on-surface">
            Merchant login
          </h1>
          <p className="mt-sm max-w-[320px] text-body-sm text-on-surface-variant">
            Sign in to manage payments, wallets, and webhooks.
          </p>
        </div>

        <form className="space-y-lg" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="mb-xs block text-body-sm font-medium text-on-surface-variant"
            >
              Work email
            </label>
            <div className="relative">
              <span className="material-symbols-outlined pointer-events-none absolute left-md top-1/2 !text-[20px] -translate-y-1/2 text-outline">
                mail
              </span>
              <input
                id="email"
                autoComplete="email"
                type="email"
                className="input-stitch pl-[44px]"
                placeholder="you@merchant.com"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-xs block text-body-sm font-medium text-on-surface-variant"
            >
              Password
            </label>
            <div className="relative">
              <span className="material-symbols-outlined pointer-events-none absolute left-md top-1/2 !text-[20px] -translate-y-1/2 text-outline">
                lock
              </span>
              <input
                id="password"
                autoComplete="current-password"
                type="password"
                className="input-stitch pl-[44px]"
                placeholder="••••••••"
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
              />
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="flex w-full items-center justify-center gap-sm rounded-lg bg-primary-container py-md text-body-sm font-semibold text-on-primary-container shadow-sm transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
            {!loading ? (
              <span className="material-symbols-outlined !text-[20px]">arrow_forward</span>
            ) : null}
          </button>
        </form>

        <p className="mt-xl text-center text-body-sm text-on-surface-variant">
          No account yet?{" "}
          <Link href="/signup" className="font-semibold text-primary hover:underline">
            Create one
          </Link>
        </p>
        <p className="mt-md text-center text-body-sm">
          <Link href="/" className="text-on-surface-variant hover:text-primary hover:underline">
            ← Home
          </Link>
        </p>

        <div className="mt-xl flex flex-wrap items-center justify-center gap-x-lg gap-y-sm border-t border-outline-variant/40 pt-lg font-mono text-[10px] font-medium uppercase tracking-wider text-on-surface-variant">
          <span className="flex items-center gap-xs">
            <span className="material-symbols-outlined !text-[14px]">verified_user</span>
            PCI aware
          </span>
          <span className="flex items-center gap-xs">
            <span className="material-symbols-outlined !text-[14px]">lock</span>
            AES-256
          </span>
        </div>
      </div>
    </AuthPageShell>
  );
}
