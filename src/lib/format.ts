/**
 * Money formatting for the demos. Odoo reports currency by name (USD, EUR);
 * Intl handles the symbol and grouping so the demos never hand-build "$".
 */
export function formatMoney(amount: number, currency: string, options?: { compact?: boolean }) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: options?.compact ? 0 : 2,
      minimumFractionDigits: options?.compact ? 0 : 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

export function formatInteger(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
}
