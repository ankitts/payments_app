export type PaymentIntent = {
  payment_intent_id: string;
  status: string;
  amount: number;
  refundable_amount: number;
  currency: string;
  order_id: string;
  created_at: string;
};

export type CreatePaymentIntentBody = {
  idempotency_key: string;
  amount: number;
  currency: string;
  order_id: string;
};
