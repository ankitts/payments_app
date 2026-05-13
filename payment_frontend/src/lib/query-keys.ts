export const queryKeys = {
  me: ["me"] as const,
  wallet: ["wallet"] as const,
  payments: ["payments"] as const,
  paymentDetail: (id: string) => ["payments", id] as const,
  ledger: ["ledger"] as const,
  refunds: ["refunds"] as const,
};
