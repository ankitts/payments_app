import { api } from "@/lib/api-client";
import type {
  CreatePaymentIntentBody,
  PaymentIntent,
} from "@/types/api";

export async function fetchPaymentIntents(): Promise<PaymentIntent[]> {
  const { data } = await api.get<PaymentIntent[]>("/v1/payment-intents");
  return data;
}

export async function fetchPaymentIntent(
  paymentIntentId: string,
): Promise<PaymentIntent> {
  const { data } = await api.get<PaymentIntent>(
    `/v1/payment-intents/${encodeURIComponent(paymentIntentId)}`,
  );
  return data;
}

export async function createPaymentIntent(
  body: CreatePaymentIntentBody,
): Promise<PaymentIntent> {
  const { data } = await api.post<PaymentIntent>("/v1/payment-intents", body);
  return data;
}

export async function confirmPaymentIntent(
  paymentIntentId: string,
): Promise<PaymentIntent> {
  const { data } = await api.post<PaymentIntent>(
    `/v1/payment-intents/${encodeURIComponent(paymentIntentId)}/confirm`,
  );
  return data;
}
