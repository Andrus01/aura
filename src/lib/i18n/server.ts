import "server-only";
import { cookies } from "next/headers";
import {
  LANG_COOKIE,
  defaultLocale,
  getDictionary,
  isLocale,
  type Locale,
  type Dictionary,
} from "./dictionaries";

/** Current locale from the cookie (server components). */
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LANG_COOKIE)?.value;
  return isLocale(value) ? value : defaultLocale;
}

/** Locale + its dictionary in one call. */
export async function getI18n(): Promise<{ locale: Locale; dict: Dictionary }> {
  const locale = await getLocale();
  return { locale, dict: getDictionary(locale) };
}
