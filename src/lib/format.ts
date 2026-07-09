/** Format euro cents as Estonian-style currency, e.g. 12900 -> "129,00 €". */
export function formatPrice(cents: number, currency = "EUR"): string {
  return new Intl.NumberFormat("et-EE", {
    style: "currency",
    currency,
  }).format(cents / 100);
}

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
