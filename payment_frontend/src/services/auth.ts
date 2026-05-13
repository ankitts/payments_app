import { api } from "@/lib/api-client";
import type {
  LoginMerchantResponse,
  MerchantProfile,
  RegisterMerchantResponse,
} from "@/types/api";

export async function registerMerchant(body: {
  business_name: string;
  email: string;
  password: string;
}): Promise<RegisterMerchantResponse> {
  const { data } = await api.post<RegisterMerchantResponse>(
    "/v1/auth/register",
    body,
  );
  return data;
}

export async function loginMerchant(
  email: string,
  password: string,
): Promise<LoginMerchantResponse> {
  const { data } = await api.post<LoginMerchantResponse>("/v1/auth/login", {
    email,
    password,
  });
  return data;
}

export async function fetchMerchantProfile(): Promise<MerchantProfile> {
  const { data } = await api.get<MerchantProfile>("/v1/auth/me");
  return data;
}
