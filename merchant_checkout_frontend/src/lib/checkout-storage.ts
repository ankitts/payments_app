const CANCELLED_KEY = (paymentIntentId: string) =>
  `checkout_cancelled_${paymentIntentId}`;

export function setCheckoutCancelled(paymentIntentId: string) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(CANCELLED_KEY(paymentIntentId), "1");
}

export function peekCheckoutCancelled(paymentIntentId: string): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(CANCELLED_KEY(paymentIntentId)) === "1";
}

export function clearCheckoutCancelled(paymentIntentId: string) {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(CANCELLED_KEY(paymentIntentId));
}

const CUSTOMER_KEY = "checkout_customer";

export type CheckoutCustomer = { fullName: string; email: string };

export function saveCheckoutCustomer(c: CheckoutCustomer) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(CUSTOMER_KEY, JSON.stringify(c));
}

export function readCheckoutCustomer(): CheckoutCustomer | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(CUSTOMER_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as CheckoutCustomer;
    if (
      typeof parsed.fullName === "string" &&
      typeof parsed.email === "string"
    ) {
      return parsed;
    }
  } catch {
    /* ignore */
  }
  return null;
}
