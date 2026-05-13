export type RegisterMerchantResponse = {
  success: boolean;
  message: string;
  merchant_id: string;
  business_name: string;
  email: string;
  api_key: string;
  created_at: string;
};

export type LoginMerchantResponse = {
  success: boolean;
  message: string;
  access_token: string;
  token_type?: string;
};

export type MerchantProfile = {
  merchant_id: string;
  business_name: string;
  email: string;
  webhook_url: string | null;
  webhook_secret: string | null;
  api_key: string;
};

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

export type LedgerEntry = {
  id: string;
  merchant_id: string;
  operation_id: string;
  entry_type: string;
  amount: number;
  currency: string;
  description: string;
  created_at: string;
};

export type Wallet = {
  id: string;
  merchant_id: string;
  available_balance: number;
  pending_balance: number;
  currency: string;
  created_at: string;
  updated_at: string;
};

export type Refund = {
  id: string;
  merchant_id: string;
  payment_intent_id: string;
  amount: number;
  currency: string;
  status: string;
  reason: string;
  created_at: string;
  updated_at: string;
};

export type CreateRefundBody = {
  idempotency_key: string;
  payment_intent_id: string;
  amount: number;
  reason: string;
};

export type CreateRefundResponse = {
  refund_id: string;
  status: string;
};
