"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { MetricBentoCard } from "@/components/metric-bento-card";
import { StatusBadge } from "@/components/status-badge";
import { formatMinorCurrency, formatUtcDate } from "@/lib/format";
import { queryKeys } from "@/lib/query-keys";
import { fetchPaymentIntents } from "@/services/payments";
import { fetchRefunds } from "@/services/refunds";
import { fetchWallet } from "@/services/wallet";

export default function DashboardPage() {
  const walletQ = useQuery({
    queryKey: queryKeys.wallet,
    queryFn: fetchWallet,
  });
  const payQ = useQuery({
    queryKey: queryKeys.payments,
    queryFn: fetchPaymentIntents,
  });
  const refQ = useQuery({
    queryKey: queryKeys.refunds,
    queryFn: fetchRefunds,
  });

  const payments = useMemo(() => payQ.data ?? [], [payQ.data]);
  const refunds = useMemo(() => refQ.data ?? [], [refQ.data]);
  const payMetrics = paymentMetrics(payments);
  const refMetrics = {
    total: refunds.length,
    success: refunds.filter((r) => r.status === "SUCCESS").length,
  };

  const recentPayments = useMemo(() => {
    return [...payments]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .slice(0, 5);
  }, [payments]);

  const wallet = walletQ.data;

  return (
    <div className="space-y-lg">
      <p className="max-w-2xl text-body-md text-on-surface-variant">
        Snapshot of balances, payout rail activity, and recent outcomes.
      </p>

      <div className="grid grid-cols-1 gap-lg md:grid-cols-3">
        <MetricBentoCard
          eyebrow="Wallet"
          headline={wallet ? formatMinorCurrency(wallet.available_balance) : "—"}
          icon={
            <span className="material-symbols-outlined !text-[26px]">
              account_balance_wallet
            </span>
          }
          iconWrapClassName="bg-primary/10 text-primary"
        >
          <div className="flex items-center justify-between border-t border-outline-variant/30 pt-md">
            <span className="text-body-sm text-on-surface-variant">
              Pending settlements
            </span>
            <span className="font-mono text-sm text-primary tabular-nums">
              {wallet ? formatMinorCurrency(wallet.pending_balance) : "—"}
            </span>
          </div>
          {walletQ.isError ? (
            <p className="mt-md text-xs text-error">Could not load wallet.</p>
          ) : null}
        </MetricBentoCard>

        <MetricBentoCard
          eyebrow="Payments"
          headline={String(payMetrics.total)}
          icon={
            <span className="material-symbols-outlined !text-[26px]">payments</span>
          }
          iconWrapClassName="bg-tertiary/10 text-tertiary"
        >
          <div className="grid grid-cols-3 gap-md border-t border-outline-variant/30 pt-md">
            <div className="flex flex-col gap-xs">
              <span className="text-[10px] font-bold uppercase text-on-surface-variant">
                Success
              </span>
              <span className="font-mono text-sm tabular-nums text-emerald-400">
                {payMetrics.success}
              </span>
            </div>
            <div className="flex flex-col gap-xs">
              <span className="text-[10px] font-bold uppercase text-on-surface-variant">
                Failed
              </span>
              <span className="font-mono text-sm tabular-nums text-error">
                {payMetrics.failed}
              </span>
            </div>
            <div className="flex flex-col gap-xs">
              <span className="text-[10px] font-bold uppercase text-on-surface-variant">
                Processing
              </span>
              <span className="font-mono text-sm tabular-nums text-primary">
                {payMetrics.processing}
              </span>
            </div>
          </div>
          {payQ.isError ? (
            <p className="mt-md text-xs text-error">
              Could not load payment metrics.
            </p>
          ) : null}
        </MetricBentoCard>

        <MetricBentoCard
          eyebrow="Refunds"
          headline={String(refMetrics.total)}
          icon={
            <span className="material-symbols-outlined !text-[26px]">
              history_toggle_off
            </span>
          }
          iconWrapClassName="bg-error/10 text-error"
        >
          <div className="flex items-center justify-between border-t border-outline-variant/30 pt-md">
            <span className="text-body-sm text-on-surface-variant">
              Successful refunds
            </span>
            <span className="font-mono text-sm tabular-nums text-emerald-400">
              {refMetrics.success}
            </span>
          </div>
          {refQ.isError ? (
            <p className="mt-md text-xs text-error">
              Could not load refund metrics.
            </p>
          ) : null}
        </MetricBentoCard>
      </div>

      <div className="grid grid-cols-1 gap-lg lg:grid-cols-12">
        <div className="flex min-h-[320px] flex-col rounded-xl border border-outline-variant bg-surface-container-low p-lg shadow-stitch-card lg:col-span-8 lg:min-h-[400px]">
          <div className="mb-lg flex flex-wrap items-center justify-between gap-md">
            <div>
              <h2 className="font-display text-headline-md text-on-surface">
                Volume over time
              </h2>
              <p className="text-body-sm text-on-surface-variant">
                Daily transaction volume across all channels
              </p>
            </div>
            <div className="flex gap-xs">
              <button
                type="button"
                className="rounded-lg border border-outline-variant bg-surface-container-high px-md py-xs text-body-sm font-semibold text-on-surface"
              >
                7D
              </button>
              <button
                type="button"
                className="rounded-lg px-md py-xs text-body-sm font-semibold text-on-surface-variant transition hover:bg-surface-container-high"
              >
                30D
              </button>
            </div>
          </div>
          <div className="relative flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-outline-variant">
            <div className="pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-b from-primary/5 to-transparent" />
            <div className="relative z-10 text-center">
              <span className="material-symbols-outlined mb-md block text-4xl text-outline-variant">
                insights
              </span>
              <p className="text-body-md text-on-surface-variant">
                Chart data will appear here when analytics are wired.
              </p>
              <button
                type="button"
                className="mt-md rounded-lg bg-primary px-lg py-sm font-semibold text-on-primary shadow-sm transition hover:brightness-110 active:scale-[0.98]"
              >
                Configure view
              </button>
            </div>
            <svg
              className="pointer-events-none absolute bottom-0 left-0 h-32 w-full opacity-10"
              viewBox="0 0 800 100"
              aria-hidden
            >
              <path
                d="M0,80 Q100,20 200,60 T400,30 T600,70 T800,10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-primary"
              />
            </svg>
          </div>
        </div>

        <div className="flex min-h-[320px] flex-col rounded-xl border border-outline-variant bg-surface-container-low p-lg shadow-stitch-card lg:col-span-4 lg:min-h-[400px]">
          <div className="mb-lg">
            <h2 className="font-display text-headline-md text-on-surface">
              Payment methods
            </h2>
            <p className="text-body-sm text-on-surface-variant">
              Distribution by source
            </p>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center space-y-md rounded-lg border border-dashed border-outline-variant p-xl">
            <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-4 border-outline-variant/30">
              <div className="h-24 w-24 animate-pulse rounded-full border-4 border-primary border-t-transparent" />
              <span className="material-symbols-outlined absolute text-on-surface-variant">
                pie_chart
              </span>
            </div>
            <div className="w-full space-y-sm">
              <div className="flex items-center justify-between rounded border border-outline-variant/20 bg-surface-container px-md py-xs">
                <span className="flex items-center gap-xs text-body-sm text-on-surface-variant">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  Cards
                </span>
                <span className="font-mono text-label-mono text-on-surface-variant">
                  —%
                </span>
              </div>
              <div className="flex items-center justify-between rounded border border-outline-variant/20 bg-surface-container px-md py-xs opacity-60">
                <span className="flex items-center gap-xs text-body-sm text-on-surface-variant">
                  <span className="h-2 w-2 rounded-full bg-tertiary" />
                  Bank transfer
                </span>
                <span className="font-mono text-label-mono text-on-surface-variant">
                  —%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="rounded-xl border border-outline-variant bg-surface-container-low p-lg shadow-stitch-card">
        <div className="mb-lg flex flex-wrap items-center justify-between gap-md">
          <h2 className="font-display text-headline-md text-on-surface">
            Recent transactions
          </h2>
          <Link
            href="/payments"
            className="flex items-center gap-xs text-body-sm font-semibold text-primary hover:underline"
          >
            View all
            <span className="material-symbols-outlined !text-lg">arrow_forward</span>
          </Link>
        </div>
        <div className="space-y-sm">
          {payQ.isLoading ? (
            <>
              <div className="h-12 w-full animate-pulse rounded-lg border border-outline-variant/10 bg-surface-container-high/50" />
              <div className="h-12 w-full animate-pulse rounded-lg border border-outline-variant/10 bg-surface-container-high/30" />
            </>
          ) : recentPayments.length === 0 ? (
            <div className="flex h-12 items-center justify-between rounded-lg border border-outline-variant/10 bg-surface-container-high/10 px-lg">
              <p className="text-body-sm italic text-on-surface-variant">
                No recent transactions to display
              </p>
            </div>
          ) : (
            recentPayments.map((p) => (
              <Link
                key={p.payment_intent_id}
                href={`/payments/${encodeURIComponent(p.payment_intent_id)}`}
                className="flex h-12 items-center justify-between rounded-lg border border-outline-variant/10 bg-surface-container-high/20 px-lg transition hover:bg-surface-container-high/40"
              >
                <div className="flex min-w-0 items-center gap-md">
                  <span className="material-symbols-outlined text-on-surface-variant">
                    payments
                  </span>
                  <span className="truncate font-mono text-xs text-on-surface">
                    {p.payment_intent_id}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-md">
                  <StatusBadge status={p.status} />
                  <span className="font-mono text-xs text-on-surface-variant">
                    {formatUtcDate(p.created_at)}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function paymentMetrics(payments: { status: string }[]) {
  return {
    total: payments.length,
    success: payments.filter((p) => p.status === "SUCCESS").length,
    failed: payments.filter((p) => p.status === "FAILED").length,
    processing: payments.filter((p) => p.status === "PROCESSING").length,
  };
}
