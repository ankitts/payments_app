import { api } from "@/lib/api-client";
import type { CreatePaymentIntentBody, PaymentIntent } from "@/types/api";

/**
 * Paths are relative (no leading `/`) so they append correctly when baseURL is
 * `http://localhost:3001/api/payments` (proxy) or `http://localhost:8000`.
 */
export async function createPaymentIntent(
  body: CreatePaymentIntentBody,
): Promise<PaymentIntent> {
  const { data } = await api.post<PaymentIntent>("v1/payment-intents", body);
  return data;
}

export async function fetchPaymentIntent(
  paymentIntentId: string,
): Promise<PaymentIntent> {
  const { data } = await api.get<PaymentIntent>(
    `v1/payment-intents/${encodeURIComponent(paymentIntentId)}`,
  );
  return data;
}

export async function confirmPaymentIntent(
  paymentIntentId: string,
): Promise<PaymentIntent> {
  const { data } = await api.post<PaymentIntent>(
    `v1/payment-intents/${encodeURIComponent(paymentIntentId)}/confirm`,
  );
  return data;
}
