"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { CardSurface } from "@/components/card-surface";
import { usePaginatedSlice } from "@/hooks/use-paginated-slice";
import { formatMinorCurrency, formatUtcDate } from "@/lib/format";
import { queryKeys } from "@/lib/query-keys";
import { fetchLedger } from "@/services/ledger";
import type { LedgerEntry } from "@/types/api";

const ENTRY_TYPES = ["", "DEBIT", "CREDIT"] as const;

export default function LedgerPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.ledger,
    queryFn: fetchLedger,
  });

  const [entryType, setEntryType] = useState<string>("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  const filtered = useMemo(() => {
    const rows = data ?? [];
    return rows.filter((row) => matchesFilters(row, entryType, fromDate, toDate));
  }, [data, entryType, fromDate, toDate]);

  const pag = usePaginatedSlice(filtered, 14);

  const sorted = [...pag.pageItems].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  return (
    <div className="space-y-6">
      <header>
        <p className="max-w-2xl text-body-md text-on-surface-variant">
          Immutable postings attached to payment and refund operations.
        </p>
      </header>

      <CardSurface>
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-center">
          <select
            className="rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20"
            value={entryType}
            onChange={(e) => {
              pag.setPage(0);
              setEntryType(e.target.value);
            }}
          >
            {ENTRY_TYPES.map((t) => (
              <option key={t || "_all"} value={t}>
                {t ? t : "All entry types"}
              </option>
            ))}
          </select>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <label className="flex items-center gap-2 text-on-surface-variant">
              From
              <input
                type="date"
                className="rounded-lg border border-outline-variant bg-surface-container-lowest px-2 py-2 text-on-surface outline-none focus:border-primary-container"
                value={fromDate}
                onChange={(e) => {
                  pag.setPage(0);
                  setFromDate(e.target.value);
                }}
              />
            </label>
            <label className="flex items-center gap-2 text-on-surface-variant">
              To
              <input
                type="date"
                className="rounded-lg border border-outline-variant bg-surface-container-lowest px-2 py-2 text-on-surface outline-none focus:border-primary-container"
                value={toDate}
                onChange={(e) => {
                  pag.setPage(0);
                  setToDate(e.target.value);
                }}
              />
            </label>
          </div>
        </div>

        {isLoading ? (
          <p className="text-sm text-on-surface-variant">Loading ledger…</p>
        ) : isError ? (
          <p className="text-sm text-rose-400">Unable to load ledger entries.</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-on-surface-variant">No matching entries.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-outline-variant bg-surface-container/55">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-surface-container-highest/45 text-xs uppercase tracking-wide text-on-surface-variant">
                <tr>
                  <th className="px-4 py-3">Entry ID</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/80">
                {sorted.map((entry) => (
                  <tr key={entry.id}>
                    <td className="px-4 py-3 font-mono text-xs">{entry.id}</td>
                    <td className="px-4 py-3">{entry.entry_type}</td>
                    <td className="px-4 py-3 tabular-nums">
                      {formatMinorCurrency(entry.amount)}
                    </td>
                    <td className="max-w-xs truncate px-4 py-3 text-xs text-on-surface-variant">
                      {entry.description}
                    </td>
                    <td className="px-4 py-3 text-xs text-on-surface-variant">
                      {formatUtcDate(entry.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length > 0 ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-outline-variant pt-4 text-sm text-on-surface-variant">
            <span>
              Page {pag.page + 1} of {pag.pageCount}{" "}
              <span className="tabular-nums">({pag.total})</span>
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

function matchesFilters(
  row: LedgerEntry,
  entryType: string,
  fromDate: string,
  toDate: string,
) {
  if (entryType && row.entry_type !== entryType) return false;

  const ts = new Date(row.created_at).getTime();
  if (fromDate) {
    const start = new Date(`${fromDate}T00:00:00.000Z`).getTime();
    if (ts < start) return false;
  }
  if (toDate) {
    const end = new Date(`${toDate}T23:59:59.999Z`).getTime();
    if (ts > end) return false;
  }

  return true;
}
