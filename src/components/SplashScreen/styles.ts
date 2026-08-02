import { css } from "@/styled-system/css";

const mono = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

export const splashScreenCls = css({
  zIndex: 10001,
  position: "fixed",
  inset: 0,
  width: "100%",
  height: "100%",
  overflow: "hidden",
  background: "#000",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  padding: { base: "22px", md: "34px" },
});

/** top + bottom HUD rails */
export const railCls = css({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "16px",
  fontFamily: mono,
  fontSize: { base: "9.5px", md: "11px" },
  fontWeight: 700,
  letterSpacing: "0.24em",
  textTransform: "uppercase",
  color: "#bffe28",
});

export const centerCls = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "16px",
  flex: 1,
});

export const textCls = css({
  fontFamily: "Prompt, sans-serif",
  fontSize: { base: "clamp(38px, 13vw, 58px)", md: "clamp(60px, 8vw, 112px)" },
  fontWeight: 700,
  lineHeight: 0.94,
  letterSpacing: "-0.035em",
  textTransform: "uppercase",
  color: "#fff",
  textAlign: "center",
});

/** the 000 → 100 counter */
export const counterCls = css({
  fontFamily: mono,
  fontSize: { base: "50px", md: "84px" },
  fontWeight: 700,
  lineHeight: 1,
  letterSpacing: "-0.02em",
  color: "#ff6737",
});

export const barTrackCls = css({
  width: { base: "180px", md: "280px" },
  height: "10px",
  border: "2px solid #bffe28",
  borderRadius: "999px",
  overflow: "hidden",
});

export const barFillCls = css({
  height: "100%",
  background: "#bffe28",
});
