import { getRequestConfig } from "next-intl/server";
import { routing, type Locale } from "./routing";

type Messages = { [key: string]: string | Messages };

/**
 * Anything a translation file leaves out falls through to Korean, so a
 * half-filled en.json renders a half-translated page rather than a broken one.
 * Empty strings count as missing too: it is what an untranslated slot looks
 * like while someone is working through the file.
 */
const withFallback = (base: Messages, over: Messages): Messages => {
  const out: Messages = { ...base };
  for (const [k, v] of Object.entries(over)) {
    if (v === "" || v == null) continue;
    const b = out[k];
    out[k] = typeof v === "object" && typeof b === "object" ? withFallback(b, v) : v;
  }
  return out;
};

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = (routing.locales as readonly string[]).includes(requested ?? "")
    ? (requested as Locale)
    : routing.defaultLocale;

  const ko = (await import("../../messages/ko.json")).default as Messages;
  const messages =
    locale === "ko" ? ko : withFallback(ko, (await import(`../../messages/${locale}.json`)).default);

  return { locale, messages };
});
