/** Shipping fees in euro cents. Edit here to change delivery pricing. */
export const SHIPPING = {
  pickup: 390, // pakiautomaat — €3.90
  store: 0, // tulen ise järele — tasuta
} as const;

export type DeliveryMethod = keyof typeof SHIPPING;

/** Shipping cost (cents) for a delivery method; unknown methods are free. */
export function shippingCentsFor(method: string): number {
  return (SHIPPING as Record<string, number>)[method] ?? 0;
}
