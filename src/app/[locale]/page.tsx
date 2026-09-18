import { redirect } from "next/navigation";
import { locales } from "@/i18n/routing";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/**
 * The language root is not a page of its own — send it to the home page. Plain
 * next/navigation with the prefix written out, rather than the locale-aware
 * redirect: reading the request locale here would opt the whole route into
 * dynamic rendering, and the segment already tells us which language it is.
 */
export default function LocaleRootPage({ params: { locale } }: { params: { locale: string } }) {
  redirect(`/${locale}/home`);
}
