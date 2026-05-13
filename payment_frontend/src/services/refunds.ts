import { api } from "@/lib/api-client";
import type {
  CreateRefundBody,
  CreateRefundResponse,
  Refund,
} from "@/types/api";

export async function fetchRefunds(): Promise<Refund[]> {
  const { data } = await api.get<Refund[]>("/v1/refunds");
  return data;
}

export async function createRefund(
  body: CreateRefundBody,
): Promise<CreateRefundResponse> {
  const { data } = await api.post<CreateRefundResponse>(
    "/v1/refunds/create",
    body,
  );
  return data;
}
