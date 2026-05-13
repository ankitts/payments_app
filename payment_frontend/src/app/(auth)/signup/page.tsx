"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AuthPageShell } from "@/components/auth-page-shell";
import { StrideLogo } from "@/components/stride-logo";
import { isNormalizedApiError } from "@/lib/guards";
import { useAuth } from "@/providers/auth-provider";
import { registerMerchant } from "@/services/auth";

export default function SignupPage() {
  const router = useRouter();
  const { loginWithPassword, token, isReady } = useAuth();
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isReady) return;
    if (token) router.replace("/dashboard");
  }, [token, isReady, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!businessName.trim() || !email.trim() || !password) {
      toast.error("All fields are required.");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      toast.error("Use at least 8 characters for your password.");
      return;
    }

    setLoading(true);
    try {
      const reg = await registerMerchant({
        business_name: businessName.trim(),
        email: email.trim(),
        password,
      });
      toast.success(reg.message || "Account created.");
      await loginWithPassword(email.trim(), password);
      toast.success("Signed in.");
      router.replace("/dashboard");
    } catch (err: unknown) {
      const msg = isNormalizedApiError(err)
        ? err.message
        : err instanceof Error
          ? err.message
          : "Registration failed.";
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
            Create merchant account
          </h1>
          <p className="mt-sm max-w-[340px] text-body-sm text-on-surface-variant">
            You’ll receive an API key on success; copy it anytime under API Keys.
          </p>
        </div>

        <form className="space-y-lg" onSubmit={handleSubmit}>
          <div>
            <label className="mb-xs block text-body-sm font-medium text-on-surface-variant">
              Business name
            </label>
            <div className="relative">
              <span className="material-symbols-outlined pointer-events-none absolute left-md top-1/2 !text-[20px] -translate-y-1/2 text-outline">
                apartment
              </span>
              <input
                autoComplete="organization"
                className="input-stitch pl-[44px]"
                placeholder="Acme Pty Ltd"
                value={businessName}
                onChange={(ev) => setBusinessName(ev.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label className="mb-xs block text-body-sm font-medium text-on-surface-variant">
              Work email
            </label>
            <div className="relative">
              <span className="material-symbols-outlined pointer-events-none absolute left-md top-1/2 !text-[20px] -translate-y-1/2 text-outline">
                mail
              </span>
              <input
                type="email"
                autoComplete="email"
                className="input-stitch pl-[44px]"
                placeholder="you@merchant.com"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label className="mb-xs block text-body-sm font-medium text-on-surface-variant">
              Password
            </label>
            <div className="relative">
              <span className="material-symbols-outlined pointer-events-none absolute left-md top-1/2 !text-[20px] -translate-y-1/2 text-outline">
                lock
              </span>
              <input
                type="password"
                autoComplete="new-password"
                className="input-stitch pl-[44px]"
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label className="mb-xs block text-body-sm font-medium text-on-surface-variant">
              Confirm password
            </label>
            <div className="relative">
              <span className="material-symbols-outlined pointer-events-none absolute left-md top-1/2 !text-[20px] -translate-y-1/2 text-outline">
                lock_reset
              </span>
              <input
                type="password"
                autoComplete="new-password"
                className="input-stitch pl-[44px]"
                value={confirm}
                onChange={(ev) => setConfirm(ev.target.value)}
                required
              />
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="flex w-full items-center justify-center gap-sm rounded-lg bg-primary-container py-md text-body-sm font-semibold text-on-primary-container shadow-sm transition hover:brightness-110 active:scale-[0.99] disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Create account"}
            {!loading ? (
              <span className="material-symbols-outlined !text-[20px]">arrow_forward</span>
            ) : null}
          </button>
        </form>

        <div className="my-lg flex items-center gap-md">
          <span className="h-px flex-1 bg-outline-variant" />
          <span className="flex items-center gap-xs whitespace-nowrap font-mono text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
            <span className="material-symbols-outlined !text-[16px]">shield_lock</span>
            Secure access
          </span>
          <span className="h-px flex-1 bg-outline-variant" />
        </div>

        <p className="text-center text-body-sm text-on-surface-variant">
          Already registered?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign in
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
