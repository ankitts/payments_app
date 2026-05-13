export const DISPLAY_CURRENCY = "INR";

export function formatMinorCurrency(
  amountMinor: number,
  currency = DISPLAY_CURRENCY,
) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(amountMinor / 100);
  } catch {
    return `${(amountMinor / 100).toFixed(2)} ${currency}`;
  }
}
