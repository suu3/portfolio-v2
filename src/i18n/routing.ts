import { defineRouting } from "next-intl/routing";
import { createSharedPathnamesNavigation } from "next-intl/navigation";

/**
 * Korean is what the site is written in, so it is the fallback for anything a
 * translation has not covered yet — see ./request.ts.
 */
export const locales = ["ko", "en", "ja"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ko";

/** what the language switcher shows, in each language's own script */
export const localeNames: Record<Locale, string> = {
  ko: "한국어",
  en: "English",
  ja: "日本語",
};

/** for <html lang> — BCP 47, which is not always the same as our locale key */
export const htmlLang: Record<Locale, string> = {
  ko: "ko-KR",
  en: "en",
  ja: "ja-JP",
};

export const routing = defineRouting({
  locales,
  defaultLocale,
  // every language carries its prefix, Korean included: /ko/home, /en/home,
  // /ja/home. One shape for all three, and each has its own indexable URL.
  localePrefix: "always",
});

/** Locale-aware Link/router. Import these instead of next/link and
 *  next/navigation anywhere that points at a page of this site. */
export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation(routing);
