"use client";

import type { MouseEvent } from "react";
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

  // Language roots own separate documents. Keep a native link and preserve
  // the current query/hash when the browser follows it.
  const go = (event: MouseEvent<HTMLAnchorElement>, locale: Locale) => {
    const { search, hash } = window.location;
    event.currentTarget.href = `/${locale}${pathname}${search}${hash}`;
  };

  return (
    <div className={wrapCls} role="group" aria-label={t("a11y.language")}>
      {locales.map((l) => (
        <a
          key={l}
          href={`/${l}${pathname}`}
          lang={l}
          aria-current={l === active ? "true" : undefined}
          title={localeNames[l]}
          data-cursor="pointer"
          data-cursor-label={localeNames[l]}
          className={cx(itemCls, l === active && activeCls)}
          onClick={(event) => go(event, l)}
        >
          {l}
        </a>
      ))}
    </div>
  );
};

export default LocaleSwitch;
