export function formatUtcDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export const DISPLAY_CURRENCY = "INR";

export function formatMinorCurrency(
  amountMinor: number,
  currency = DISPLAY_CURRENCY,
): string {
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

export function parseMajorCurrencyToMinor(value: string): number | null {
  const trimmed = value.trim();
  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) return null;

  const [major, minor = ""] = trimmed.split(".");
  const amountMinor = Number(major) * 100 + Number(minor.padEnd(2, "0"));

  return Number.isSafeInteger(amountMinor) && amountMinor > 0
    ? amountMinor
    : null;
}
