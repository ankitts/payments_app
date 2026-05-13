"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useMemo, useState } from "react";

import { CardSurface } from "@/components/card-surface";
import { StatusBadge } from "@/components/status-badge";
import { usePaginatedSlice } from "@/hooks/use-paginated-slice";
import { formatUtcDate } from "@/lib/format";
import { queryKeys } from "@/lib/query-keys";
import { fetchRefunds } from "@/services/refunds";

const REFUND_STATUSES = ["", "PENDING", "PROCESSING", "SUCCESS", "FAILED"] as const;

export default function RefundsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.refunds,
    queryFn: fetchRefunds,
  });

  const [status, setStatus] = useState<string>("");
  const [paymentFilter, setPaymentFilter] = useState("");

  const filtered = useMemo(() => {
    const list = data ?? [];
    const q = paymentFilter.trim().toLowerCase();
    return list.filter((r) => {
      if (status && r.status !== status) return false;
      if (q && !r.payment_intent_id.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [data, status, paymentFilter]);

  const pag = usePaginatedSlice(filtered, 12);

  return (
    <div className="space-y-6">
      <header>
        <p className="max-w-2xl text-body-md text-on-surface-variant">
          Track reversals and reconcile them with original payment intents.
        </p>
      </header>

      <CardSurface>
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
          <input
            placeholder="Filter by payment ID…"
            className="flex-1 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/25"
            value={paymentFilter}
            onChange={(e) => {
              pag.setPage(0);
              setPaymentFilter(e.target.value);
            }}
          />
          <select
            className="rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/25"
            value={status}
            onChange={(e) => {
              pag.setPage(0);
              setStatus(e.target.value);
            }}
          >
            {REFUND_STATUSES.map((s) => (
              <option key={s || "_all"} value={s}>
                {s ? s : "All statuses"}
              </option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <p className="text-sm text-on-surface-variant">Loading refunds…</p>
        ) : isError ? (
          <p className="text-sm text-rose-400">Unable to load refunds.</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-on-surface-variant">No refunds found.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-outline-variant bg-surface-container/55">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-surface-container-highest/45 text-xs uppercase text-on-surface-variant">
                <tr>
                  <th className="px-4 py-3">Refund ID</th>
                  <th className="px-4 py-3">Payment ID</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Reason</th>
                  <th className="px-4 py-3">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/80">
                {pag.pageItems.map((r) => (
                  <tr key={r.id} className="hover:bg-surface-container-high/50">
                    <td className="px-4 py-3 font-mono text-xs">{r.id}</td>
                    <td className="px-4 py-3 font-mono text-xs">
                      <Link
                        className="text-primary hover:underline"
                        href={`/payments/${encodeURIComponent(r.payment_intent_id)}`}
                      >
                        {r.payment_intent_id}
                      </Link>
                    </td>
                    <td className="px-4 py-3 tabular-nums">
                      {r.amount.toLocaleString()} {r.currency}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="max-w-xs truncate px-4 py-3 text-xs text-on-surface-variant">
                      {r.reason}
                    </td>
                    <td className="px-4 py-3 text-xs text-on-surface-variant">
                      {formatUtcDate(r.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length > 0 ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-outline-variant pt-4 text-sm text-on-surface-variant">
            <span className="tabular-nums">
              Page {pag.page + 1} of {pag.pageCount} · {pag.total} refunds
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={!pag.hasPrev}
                onClick={() => pag.setPage((p) => Math.max(p - 1, 0))}
                className="rounded-lg border border-outline-variant px-3 py-1 text-xs font-semibold uppercase tracking-wide hover:bg-surface-container-high disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={!pag.hasNext}
                onClick={() => pag.setPage((p) => p + 1)}
                className="rounded-lg border border-outline-variant px-3 py-1 text-xs font-semibold uppercase tracking-wide hover:bg-surface-container-high disabled:opacity-40"
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
