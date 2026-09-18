"use client";

import { useLocale, useTranslations } from "next-intl";
import { css, cx } from "@/styled-system/css";
import { locales, localeNames, usePathname, type Locale } from "@/i18n/routing";

/**
 * Three short codes rather than a dropdown: there are only three languages and
 * the header already reads as a row of small monospace pills. Switching keeps
 * you on the page you are on — usePathname here is the locale-aware one, so it
 * hands back the path without its language prefix.
 */
const wrapCls = css({
  display: "inline-flex",
  alignItems: "center",
  height: "38px",
  border: "1px solid token(colors.ink)",
  background: "surface",
  borderRadius: "999px",
  overflow: "hidden",
  fontFamily: "mono",
  fontSize: "11px",
  letterSpacing: "0.04em",
});

const itemCls = css({
  padding: "0 10px",
  height: "100%",
  display: "inline-flex",
  alignItems: "center",
  color: "muted",
  textTransform: "uppercase",
  cursor: "pointer",
  transition: "background 0.12s, color 0.12s",
  _hover: { color: "ink" },
});

const activeCls = css({
  background: "ink",
  color: "surface",
  _hover: { color: "surface" },
});

const LocaleSwitch = () => {
  const t = useTranslations();
  const active = useLocale() as Locale;
  const pathname = usePathname();

  /**
   * A full navigation rather than a client-side one. Changing the language
   * changes the [locale] segment, which swaps the root layout and the <html>
   * element under React; doing that in place threw a removeChild on every
   * switch. A language change is a new document anyway — lang, metadata and the
   * font subset all belong to it — and nothing is lost, because the splash and
   * the 3D stage remount either way.
   */
  const go = (l: Locale) => {
    const { search, hash } = window.location;
    window.location.assign(`/${l}${pathname}${search}${hash}`);
  };

  return (
    <div className={wrapCls} role="group" aria-label={t("a11y.language")}>
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          aria-current={l === active ? "true" : undefined}
          title={localeNames[l]}
          data-cursor="pointer"
          data-cursor-label={localeNames[l]}
          className={cx(itemCls, l === active && activeCls)}
          onClick={() => go(l)}
        >
          {l}
        </button>
      ))}
    </div>
  );
};

export default LocaleSwitch;
