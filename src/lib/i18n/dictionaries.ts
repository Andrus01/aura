import { et, type Dictionary } from "./et";
import { en } from "./en";
import { ru } from "./ru";

export type { Dictionary };

export const locales = ["et", "en", "ru"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "et";
export const LANG_COOKIE = "aura_lang";

const dicts: Record<Locale, Dictionary> = { et, en, ru };

export function getDictionary(locale: Locale): Dictionary {
  return dicts[locale] ?? et;
}

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

export const localeNames: Record<Locale, string> = {
  et: "Eesti",
  en: "English",
  ru: "Русский",
};
