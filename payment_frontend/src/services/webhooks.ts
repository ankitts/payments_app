import { api } from "@/lib/api-client";
import type { MerchantProfile } from "@/types/api";

export async function patchWebhook(body: {
  webhook_url?: string | null;
  regenerate_webhook_secret?: boolean;
}): Promise<MerchantProfile> {
  const { data } = await api.patch<MerchantProfile>("/v1/auth/webhook", body);
  return data;
}
