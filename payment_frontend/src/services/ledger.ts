import { api } from "@/lib/api-client";
import type { LedgerEntry } from "@/types/api";

export async function fetchLedger(): Promise<LedgerEntry[]> {
  const { data } = await api.get<LedgerEntry[]>("/v1/ledger");
  return data;
}
