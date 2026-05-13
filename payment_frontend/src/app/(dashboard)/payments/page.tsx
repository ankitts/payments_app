"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useMemo, useState } from "react";

import { CardSurface } from "@/components/card-surface";
import { StatusBadge } from "@/components/status-badge";
import { usePaginatedSlice } from "@/hooks/use-paginated-slice";
import { formatMinorCurrency, formatUtcDate } from "@/lib/format";
import { queryKeys } from "@/lib/query-keys";
import { fetchPaymentIntents } from "@/services/payments";
import type { PaymentIntent } from "@/types/api";

const STATUSES = ["", "CREATED", "PROCESSING", "SUCCESS", "FAILED", "CANCELLED", "REFUNDED"] as const;

export default function PaymentsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.payments,
    queryFn: fetchPaymentIntents,
  });

  const [status, setStatus] = useState<string>("");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const list = data ?? [];
    const q = search.trim().toLowerCase();
    return list.filter((p) => {
      if (status && p.status !== status) return false;
      if (q) {
        const idMatch = p.payment_intent_id.toLowerCase().includes(q);
        const orderMatch = p.order_id.toLowerCase().includes(q);
        if (!idMatch && !orderMatch) return false;
      }
      return true;
    });
  }, [data, status, search]);

  const pag = usePaginatedSlice(filtered, 12);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="max-w-2xl text-body-md text-on-surface-variant">
            Inspect intents, confirm capture, then drill into webhook and ledger impacts.
          </p>
        </div>
        <Link
          href="/payments/create"
          className="inline-flex shrink-0 items-center justify-center rounded-lg bg-primary-container text-on-primary-container px-4 py-2.5 text-sm font-semibold shadow-sm hover:brightness-110"
        >
          Create payment
        </Link>
      </div>

      <CardSurface>
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-center">
          <input
            className="lg:min-w-64 flex-1 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20"
            placeholder="Search payment or order ID…"
            value={search}
            onChange={(e) => {
              pag.setPage(0);
              setSearch(e.target.value);
            }}
          />
          <select
            className="rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20"
            value={status}
            onChange={(e) => {
              pag.setPage(0);
              setStatus(e.target.value);
            }}
          >
            {STATUSES.map((s) => (
              <option key={s || "_all"} value={s}>
                {s ? s : "All statuses"}
              </option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <p className="text-sm text-on-surface-variant">Loading payments…</p>
        ) : isError ? (
          <p className="text-sm text-rose-400">Unable to load payments.</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-on-surface-variant">
            No payments match your filters yet.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-outline-variant bg-surface-container/55">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-surface-container-highest/45 text-xs uppercase tracking-wide text-on-surface-variant">
                <tr>
                  <th className="px-4 py-3 font-medium">Payment ID</th>
                  <th className="px-4 py-3 font-medium">Order ID</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Refundable</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/80">
                {pag.pageItems.map((p) => (
                  <PaymentsRow key={p.payment_intent_id} intent={p} />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length > 0 ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-outline-variant pt-4 text-sm text-on-surface-variant">
            <span>
              Page {pag.page + 1} of {pag.pageCount}{" "}
              <span className="tabular-nums">({pag.total} total)</span>
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={!pag.hasPrev}
                onClick={() => pag.setPage((p) => Math.max(p - 1, 0))}
                className="rounded-lg border border-outline-variant px-3 py-1.5 text-xs font-semibold uppercase tracking-wide hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={!pag.hasNext}
                onClick={() => pag.setPage((p) => p + 1)}
                className="rounded-lg border border-outline-variant px-3 py-1.5 text-xs font-semibold uppercase tracking-wide hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        ) : null}
      </CardSurface>
    </div>
  );
}

function PaymentsRow({ intent }: { intent: PaymentIntent }) {
  return (
    <tr className="transition hover:bg-surface-container-high/50">
      <td className="px-4 py-3 font-mono text-xs">
        <Link
          href={`/payments/${encodeURIComponent(intent.payment_intent_id)}`}
          className="text-primary hover:underline"
        >
          {intent.payment_intent_id}
        </Link>
      </td>
      <td className="px-4 py-3 text-xs text-on-surface-variant">{intent.order_id}</td>
      <td className="px-4 py-3 tabular-nums">
        <Link href={`/payments/${encodeURIComponent(intent.payment_intent_id)}`}>
          {formatMinorCurrency(intent.amount)}
        </Link>
      </td>
      <td className="px-4 py-3 tabular-nums text-on-surface-variant">
        {formatMinorCurrency(intent.refundable_amount)}
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={intent.status} />
      </td>
      <td className="px-4 py-3 text-xs text-on-surface-variant">
        {formatUtcDate(intent.created_at)}
      </td>
    </tr>
  );
}
