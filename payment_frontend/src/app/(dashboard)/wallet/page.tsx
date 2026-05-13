"use client";

import { useQuery } from "@tanstack/react-query";
import { CardSurface } from "@/components/card-surface";
import { formatMinorCurrency, formatUtcDate } from "@/lib/format";
import { queryKeys } from "@/lib/query-keys";
import { fetchLedger } from "@/services/ledger";
import { fetchWallet } from "@/services/wallet";

export default function WalletPage() {
  const walletQ = useQuery({
    queryKey: queryKeys.wallet,
    queryFn: fetchWallet,
  });
  const ledgerQ = useQuery({
    queryKey: queryKeys.ledger,
    queryFn: fetchLedger,
  });

  const recent = [...(ledgerQ.data ?? [])]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 8);

  return (
    <div className="space-y-8">
      <header>
        <p className="max-w-2xl text-body-md text-on-surface-variant">
          Balances reconcile with settlement activity in the ledger rail.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <CardSurface title="Balances">
          {walletQ.isLoading ? (
            <p className="text-sm text-on-surface-variant">Loading…</p>
          ) : walletQ.isError ? (
            <p className="text-sm text-rose-400">Unable to load wallet.</p>
          ) : walletQ.data ? (
            <dl className="space-y-4">
              <div>
                <dt className="text-xs uppercase tracking-wide text-on-surface-variant">
                  Available
                </dt>
                <dd className="mt-1 text-3xl font-semibold tabular-nums">
                  {formatMinorCurrency(walletQ.data.available_balance)}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-on-surface-variant">
                  Pending
                </dt>
                <dd className="mt-1 text-xl font-medium tabular-nums text-on-surface-variant">
                  {formatMinorCurrency(walletQ.data.pending_balance)}
                </dd>
              </div>
            </dl>
          ) : null}
        </CardSurface>
        <CardSurface
          title="Recent ledger activity"
          description="Latest entries impacting your balance."
        >
          {ledgerQ.isLoading ? (
            <p className="text-sm text-on-surface-variant">Loading…</p>
          ) : recent.length === 0 ? (
            <p className="text-sm text-on-surface-variant">
              No ledger movements yet. Complete a payment to see traces.
            </p>
          ) : (
            <ul className="space-y-3">
              {recent.map((e) => (
                <li
                  key={e.id}
                  className="flex items-start justify-between gap-3 rounded-lg border border-outline-variant bg-surface-container-high/50 px-3 py-2 text-sm"
                >
                  <div className="space-y-1">
                    <p className="text-xs text-on-surface-variant">
                      {formatUtcDate(e.created_at)}
                    </p>
                    <p className="text-xs text-on-surface">{e.description}</p>
                    <span className="text-[11px] font-mono text-on-surface-variant">
                      op {e.operation_id}
                    </span>
                  </div>
                  <div className="text-right text-xs">
                    <span className="tabular-nums font-semibold">
                      {e.entry_type === "CREDIT" ? "+" : "-"}
                      {formatMinorCurrency(e.amount)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardSurface>
      </div>
    </div>
  );
}
