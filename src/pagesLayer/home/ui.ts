import { css } from "@/styled-system/css";

/* ─────────────────────────────────────────────────────────────
 * Monotone + two point colours.
 *   ORANGE — the character's hoodie. The one thing that should pop.
 *   BLUE   — electric grid blue, only for "live" feedback (cursor
 *            lens on the grid, focus, selection, progress).
 * Everything else is paper, ink and the greys in between.
 * ──────────────────────────────────────────────────────────── */

export const PAPER = "#ededeb";
export const SURFACE = "#f7f7f5";
export const INK = "#111111";
export const MUTED = "#6e6e6a";
export const HAIR = "rgba(17,17,17,0.14)";

export const DARK = "#0d0d0d";
export const DARK_SURFACE = "#151515";
export const DARK_LINE = "#2c2c2c";
export const DARK_MUTED = "#8c8c88";

export const ORANGE = "#ff5a1f";
export const BLUE = "#2d3cff";

export const sans =
  "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif";
export const mono = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

/** snap easing — windows pop, they don't drift */
export const SNAP = "cubic-bezier(.2,.9,.2,1)";

/* ───────── type ───────── */

/** tiny uppercase monospace — file names, indices, HUD readouts */
export const metaCls = css({
  fontFamily: "mono",
  fontSize: "11px",
  fontWeight: 500,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
});

/** `01 — ABOUT` style section label */
export const eyebrowCls = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "10px",
  fontFamily: "mono",
  fontSize: "11px",
  fontWeight: 500,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "currentColor",
  _before: {
    content: '""',
    width: "7px",
    height: "7px",
    borderRadius: "999px",
    background: "point",
  },
});

export const sectionTitleCls = css({
  fontFamily: "sans",
  fontWeight: 650,
  fontSize: { base: "38px", md: "clamp(52px, 6vw, 88px)" },
  lineHeight: 1.02,
  letterSpacing: "-0.045em",
  marginTop: "18px",
  textWrap: "balance",
});

/* ───────── layout ───────── */

export const sectionCls = css({
  width: "100%",
  paddingX: { base: "16px", md: "clamp(28px, 5vw, 88px)" },
  paddingY: { base: "88px", md: "140px" },
  position: "relative",
});

export const innerCls = css({
  maxWidth: "1180px",
  marginX: "auto",
  width: "100%",
});

/** faint drafting grid behind light sections */
export const paperGridCls = css({
  backgroundImage:
    "linear-gradient(rgba(17,17,17,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(17,17,17,0.055) 1px, transparent 1px)",
  backgroundSize: "48px 48px",
  backgroundPosition: "-1px -1px",
});

/* ───────── controls ───────── */

/** black pill — primary link (1:09's "Twitter ↗") */
export const pillCls = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  fontFamily: "mono",
  fontSize: "11.5px",
  fontWeight: 500,
  letterSpacing: "0.04em",
  lineHeight: 1,
  padding: "10px 16px",
  borderRadius: "999px",
  // a darkLine rim keeps the black pill readable when it floats over the dark sections
  border: `1px solid token(colors.darkLine)`,
  background: "ink",
  color: "#fff",
  whiteSpace: "nowrap",
  transition: `background .12s steps(2), color .12s steps(2), border-color .12s steps(2)`,
  _hover: { background: "point", borderColor: "point", color: "ink" },
  _focusVisible: { outline: `2px solid token(colors.signal)`, outlineOffset: "3px" },
});

/** outline pill — secondary */
export const pillGhostCls = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  fontFamily: "mono",
  fontSize: "11.5px",
  fontWeight: 500,
  letterSpacing: "0.04em",
  lineHeight: 1,
  padding: "10px 16px",
  borderRadius: "999px",
  border: `1px solid token(colors.ink)`,
  background: "transparent",
  color: "ink",
  whiteSpace: "nowrap",
  transition: `background .12s steps(2), color .12s steps(2)`,
  _hover: { background: "ink", color: "#fff" },
  _focusVisible: { outline: `2px solid token(colors.signal)`, outlineOffset: "3px" },
});

/** same outline pill on dark grounds */
export const pillDarkCls = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  fontFamily: "mono",
  fontSize: "12px",
  fontWeight: 500,
  letterSpacing: "0.04em",
  lineHeight: 1,
  padding: "12px 18px",
  borderRadius: "999px",
  border: "1px solid rgba(255,255,255,0.4)",
  background: "transparent",
  color: "#fff",
  whiteSpace: "nowrap",
  transition: `background .12s steps(2), color .12s steps(2), border-color .12s steps(2)`,
  _hover: { background: "#fff", color: "ink", borderColor: "#fff" },
  _focusVisible: { outline: `2px solid token(colors.signal)`, outlineOffset: "3px" },
});

/** stack chip */
export const chipCls = css({
  display: "inline-block",
  fontFamily: "mono",
  fontSize: "11px",
  fontWeight: 500,
  letterSpacing: "0.02em",
  lineHeight: 1,
  padding: "7px 11px",
  border: `1px solid token(colors.hair)`,
  borderRadius: "999px",
  color: "ink",
  whiteSpace: "nowrap",
});

export const chipDarkCls = css({
  display: "inline-block",
  fontFamily: "mono",
  fontSize: "11px",
  fontWeight: 500,
  letterSpacing: "0.02em",
  lineHeight: 1,
  padding: "7px 11px",
  border: `1px solid token(colors.darkLine)`,
  borderRadius: "999px",
  color: "#d6d6d2",
  whiteSpace: "nowrap",
});

/** underlined text link that snaps to the point colour */
export const textLinkCls = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  fontFamily: "mono",
  fontSize: "12px",
  letterSpacing: "0.04em",
  color: "currentColor",
  borderBottom: "1px solid currentColor",
  paddingBottom: "3px",
  transition: "color .1s steps(2), gap .16s " + SNAP,
  _hover: { color: "point", gap: "12px" },
});
