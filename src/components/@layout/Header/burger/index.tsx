"use client";

import { css } from "@/styled-system/css";

export default function Burger({ openMenu }: { openMenu: () => void }) {
  return (
    <button
      type="button"
      aria-label="메뉴 열기"
      data-cursor="pointer"
      data-cursor-label="Menu"
      onClick={openMenu}
      className={css({
        position: "fixed",
        top: { base: "18px", md: "26px" },
        right: { base: "18px", md: "26px" },
        // stays under the menu overlay (z 3) while still above page content,
        // since the header itself owns a z-999 stacking context
        zIndex: 1,

        display: "inline-flex",
        alignItems: "center",
        gap: "12px",
        padding: { base: "11px 16px", md: "13px 20px" },

        background: "#fff",
        color: "#000",
        border: "3px solid #000",
        borderRadius: "999px",
        boxShadow: "5px 5px 0 0 #000",

        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
        fontSize: { base: "11px", md: "12px" },
        fontWeight: 700,
        letterSpacing: "0.2em",
        textTransform: "uppercase",

        transition:
          "transform .12s cubic-bezier(.2,.9,.2,1), box-shadow .12s cubic-bezier(.2,.9,.2,1), background .1s steps(1)",

        _hover: {
          background: "#bffe28",
          transform: "translate(5px, 5px)",
          boxShadow: "0 0 0 0 #000",
          "& .bar-top": { width: "20px" },
          "& .bar-mid": { width: "12px" },
          "& .bar-bot": { width: "20px" },
        },
        _active: { background: "#ff00ff", color: "#fff" },
      })}
    >
      <span
        className={css({
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "4px",
        })}
      >
        {(["bar-top", "bar-mid", "bar-bot"] as const).map((c, i) => (
          <span
            key={c}
            className={`${c} ${css({
              display: "block",
              height: "2.5px",
              background: "currentColor",
              borderRadius: "2px",
              transition: "width .18s cubic-bezier(.2,.9,.2,1)",
            })}`}
            style={{ width: i === 1 ? 20 : 12 }}
          />
        ))}
      </span>
      Menu
    </button>
  );
}
