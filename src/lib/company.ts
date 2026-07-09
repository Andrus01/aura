/**
 * Company / legal details shown across the site and legal pages.
 *
 * Müüja on AQULA PESU OÜ (äriregistri andmed, kontrollitud 2026-07-09).
 * NB: kinnita, et info@auraood.ee postkast on olemas — muidu kasuta
 * registris olevat e-posti. Lase juristil tekstid üle vaadata.
 */
export const company = {
  legalName: "AQULA PESU OÜ",
  brand: "Aura & Ood",
  regNr: "12338106",
  isVatPayer: false,
  vatNote: "Ettevõte ei ole käibemaksukohustuslane.",
  address: "Heina tn 29a-5, 10412 Tallinn, Harju maakond, Eesti",
  email: "info@auraood.ee",
  supportEmail: "info@auraood.ee",
  phone: "+372 5743 0872",
  domain: "auraood.ee",
  // Viimati uuendatud — kuupäev kuvatakse juriidilistel lehtedel
  legalUpdated: "9. juuli 2026",
} as const;

/** Pikk taganemisõiguse periood päevades (EL kaugmüük). */
export const RETURN_DAYS = 14;

/** Placeholder values for {tokens} used in legal-page copy. */
export const legalVars: Record<string, string> = {
  legalName: company.legalName,
  brand: company.brand,
  regNr: company.regNr,
  address: company.address,
  email: company.email,
  phone: company.phone,
  vatNote: company.vatNote,
  returnDays: String(RETURN_DAYS),
};
