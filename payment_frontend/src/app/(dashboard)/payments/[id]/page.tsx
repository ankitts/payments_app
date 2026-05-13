"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";

import { CardSurface } from "@/components/card-surface";
import { RefundModal } from "@/components/refund-modal";
import { StatusBadge } from "@/components/status-badge";
import { formatMinorCurrency, formatUtcDate } from "@/lib/format";
import { isNormalizedApiError } from "@/lib/guards";
import { queryKeys } from "@/lib/query-keys";
import { fetchLedger } from "@/services/ledger";
import { confirmPaymentIntent, fetchPaymentIntent } from "@/services/payments";
import { createRefund, fetchRefunds } from "@/services/refunds";

export default function PaymentDetailPage() {
  const params = useParams<{ id: string }>();
  const id = decodeURIComponent(params.id);
  const qc = useQueryClient();
  const [refundOpen, setRefundOpen] = useState(false);

  const paymentQ = useQuery({
    queryKey: queryKeys.paymentDetail(id),
    queryFn: () => fetchPaymentIntent(id),
  });

  const ledgerQ = useQuery({
    queryKey: queryKeys.ledger,
    queryFn: fetchLedger,
  });

  const refundsQ = useQuery({
    queryKey: queryKeys.refunds,
    queryFn: fetchRefunds,
  });

  const payment = paymentQ.data;
  const ledgerForPayment = useMemo(
    () => (ledgerQ.data ?? []).filter((e) => e.operation_id === id),
    [ledgerQ.data, id],
  );
  const refundsForPayment = useMemo(
    () =>
      (refundsQ.data ?? []).filter((r) => r.payment_intent_id === id),
    [refundsQ.data, id],
  );

  const confirmMut = useMutation({
    mutationFn: () => confirmPaymentIntent(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.paymentDetail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.payments });
      toast.success("Payment confirmed and queued for processing.");
    },
    onError: (err: unknown) => {
      const msg = isNormalizedApiError(err)
        ? err.message
        : err instanceof Error
          ? err.message
          : "Confirm failed.";
      toast.error(msg);
    },
  });

  if (paymentQ.isLoading) {
    return (
      <p className="text-sm text-on-surface-variant">Loading payment details…</p>
    );
  }

  if (paymentQ.isError || !payment) {
    return (
      <div className="space-y-3">
        <p className="text-rose-400">Payment not found or inaccessible.</p>
        <Link href="/payments" className="text-sm text-primary hover:underline">
          ← Back to payments
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/payments"
          className="text-sm text-primary hover:underline"
        >
          ← Back to payments
        </Link>
        <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-headline-md font-semibold tracking-tight text-on-surface">
              Intent
            </h2>
            <p className="mt-xs font-mono text-label-mono text-on-surface-variant break-all">
              {payment.payment_intent_id}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {payment.status === "CREATED" ? (
              <button
                type="button"
                disabled={confirmMut.isPending}
                onClick={() => confirmMut.mutate()}
                className="rounded-lg bg-primary-container text-on-primary-container px-4 py-2 text-sm font-semibold shadow-sm hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {confirmMut.isPending ? "Confirming…" : "Confirm payment"}
              </button>
            ) : null}
            {payment.status === "SUCCESS" ? (
              payment.refundable_amount > 0 ? (
                <button
                  type="button"
                  onClick={() => setRefundOpen(true)}
                  className="rounded-lg border border-outline-variant bg-surface-container-low px-4 py-2 text-sm font-semibold text-on-surface hover:bg-surface-container-high"
                >
                  Create refund
                </button>
              ) : (
                <span className="rounded-lg border border-outline-variant/60 px-4 py-2 text-sm text-on-surface-variant">
                  Fully refunded
                </span>
              )
            ) : null}
          </div>
        </div>
      </div>

      <CardSurface title="Payment information">
        <dl className="grid gap-4 md:grid-cols-2">
          <Field label="Amount" value={formatMinorCurrency(payment.amount)} />
          <Field
            label="Refundable remaining"
            value={formatMinorCurrency(payment.refundable_amount)}
          />
          <Field label="Order ID" value={payment.order_id} />
          <Field
            label="Status"
            value={<StatusBadge status={payment.status} />}
          />
          <Field
            label="Created"
            value={formatUtcDate(payment.created_at)}
          />
        </dl>
      </CardSurface>

      <CardSurface
        title="Webhook history"
        description="Delivery attempts are not persisted by the processor yet; this section will populate once backend logging ships."
      >
        <p className="text-sm text-on-surface-variant">
          No recorded outbound deliveries for this payment. When webhook attempt
          logging is available, each retry and response code will appear here.
        </p>
      </CardSurface>

      <CardSurface title="Refund history">
        {refundsForPayment.length === 0 ? (
          <p className="text-sm text-on-surface-variant">No refunds for this payment.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-outline-variant bg-surface-container/55">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-surface-container-highest/45 text-xs uppercase text-on-surface-variant">
                <tr>
                  <th className="px-3 py-2">Refund ID</th>
                  <th className="px-3 py-2">Amount</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Reason</th>
                  <th className="px-3 py-2">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/80">
                {refundsForPayment.map((r) => (
                  <tr key={r.id}>
                    <td className="px-3 py-2 font-mono text-xs">{r.id}</td>
                    <td className="px-3 py-2 tabular-nums">
                      {formatMinorCurrency(r.amount)}
                    </td>
                    <td className="px-3 py-2">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-3 py-2 text-xs text-on-surface-variant">
                      {r.reason}
                    </td>
                    <td className="px-3 py-2 text-xs text-on-surface-variant">
                      {formatUtcDate(r.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardSurface>

      <CardSurface title="Ledger impact">
        {ledgerForPayment.length === 0 ? (
          <p className="text-sm text-on-surface-variant">
            No ledger entries yet for this operation id.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-outline-variant bg-surface-container/55">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-surface-container-highest/45 text-xs uppercase text-on-surface-variant">
                <tr>
                  <th className="px-3 py-2">Entry</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">Amount</th>
                  <th className="px-3 py-2">Description</th>
                  <th className="px-3 py-2">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/80">
                {ledgerForPayment.map((e) => (
                  <tr key={e.id}>
                    <td className="px-3 py-2 font-mono text-xs">{e.id}</td>
                    <td className="px-3 py-2">{e.entry_type}</td>
                    <td className="px-3 py-2 tabular-nums">
                      {formatMinorCurrency(e.amount)}
                    </td>
                    <td className="px-3 py-2 text-xs text-on-surface-variant">
                      {e.description}
                    </td>
                    <td className="px-3 py-2 text-xs text-on-surface-variant">
                      {formatUtcDate(e.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardSurface>

      <RefundModal
        open={refundOpen}
        onClose={() => setRefundOpen(false)}
        paymentIntentId={id}
        maxRefundAmount={payment.refundable_amount}
        onSubmitRefund={async ({ amount, reason, idempotencyKey }) => {
          await createRefund({
            idempotency_key: idempotencyKey,
            payment_intent_id: id,
            amount,
            reason,
          });
          qc.invalidateQueries({ queryKey: queryKeys.refunds });
          qc.invalidateQueries({ queryKey: queryKeys.payments });
          qc.invalidateQueries({ queryKey: queryKeys.paymentDetail(id) });
          qc.invalidateQueries({ queryKey: queryKeys.ledger });
        }}
      />
    </div>
  );
}

function Field({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-on-surface-variant">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium">{value}</dd>
    </div>
  );
}
