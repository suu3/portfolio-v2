import { css } from "@/styled-system/css";

const mono = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

export const splashScreenCls = css({
  zIndex: 10001,
  position: "fixed",
  inset: 0,
  width: "100%",
  height: "100%",
  overflow: "hidden",
  background: "#ededeb",
  color: "#111",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  padding: { base: "16px", md: "28px" },
});

/** top + bottom HUD rails */
export const railCls = css({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "16px",
  fontFamily: mono,
  fontSize: "11px",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
});

export const centerCls = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "18px",
  flex: 1,
});

export const textCls = css({
  fontFamily: mono,
  fontSize: "11px",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
});

/** the 000 → 100 counter */
export const counterCls = css({
  fontFamily: mono,
  fontSize: { base: "44px", md: "64px" },
  fontWeight: 500,
  lineHeight: 1,
  letterSpacing: "-0.04em",
  fontVariantNumeric: "tabular-nums",
});

export const barTrackCls = css({
  width: { base: "200px", md: "260px" },
  height: "8px",
  border: "1px solid #111",
  overflow: "hidden",
});

export const barFillCls = css({
  height: "100%",
  background: "#111",
});
