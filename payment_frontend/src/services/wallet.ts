import { api } from "@/lib/api-client";
import type { Wallet } from "@/types/api";

export async function fetchWallet(): Promise<Wallet> {
  const { data } = await api.get<Wallet>("/v1/wallet");
  return data;
}
