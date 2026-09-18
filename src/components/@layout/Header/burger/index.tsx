"use client";

import { css } from "@/styled-system/css";
import { useTranslations } from "next-intl";

/** menu opener — only on the stacked (< lg) layout, the pill nav covers desktop */
export default function Burger({ openMenu }: { openMenu: () => void }) {
  const t = useTranslations();
  return (
    <button
      type="button"
      aria-label={t("a11y.openMenu")}
      data-cursor="pointer"
      data-cursor-label="Menu"
      onClick={openMenu}
      className={css({
        display: { base: "inline-flex", lg: "none" },
        alignItems: "center",
        gap: "10px",
        height: "38px",
        padding: "0 14px",
        background: "#f7f7f5",
        color: "#111",
        border: "1px solid #111",
        borderRadius: "999px",
        fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
        fontSize: "11px",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        transition: "background .1s steps(2), color .1s steps(2)",
        _hover: { background: "#111", color: "#fff" },
        _focusVisible: { outline: "2px solid #2d3cff", outlineOffset: "3px" },
      })}
    >
      <span className={css({ display: "flex", flexDirection: "column", gap: "3px" })}>
        <i className={css({ display: "block", width: "14px", height: "1px", background: "currentColor" })} />
        <i className={css({ display: "block", width: "14px", height: "1px", background: "currentColor" })} />
        <i className={css({ display: "block", width: "8px", height: "1px", background: "#ff5a1f" })} />
      </span>
      Menu
    </button>
  );
}
