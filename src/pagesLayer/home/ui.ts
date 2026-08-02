import { css } from "@/styled-system/css";

export const INK = "#000000";
export const CREAM = "#f3efec";
export const PAPER = "#fbfbfb";
export const ORANGE = "#ff6737";
export const ORANGE2 = "#fc8755";
export const PEACH = "#ffddca";

/* brutalist accents (already in the project's panda tokens) */
export const LIME = "#bffe28";
export const MAGENTA = "#ff00ff";
export const CYAN = "#00ffff";
export const PURPLE = "#8806ce";

export const prompt = "Prompt, 'NEXON Lv1 Gothic OTF', sans-serif";
export const mono = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

/** riso-style halftone dots — lay over blocks for print texture */
export const halftoneCls = css({
  backgroundImage: "radial-gradient(#000 1px, transparent 1.3px)",
  backgroundSize: "6px 6px",
});

/** checkerboard strip, used as a hard divider */
export const checkerCls = css({
  backgroundImage:
    "linear-gradient(45deg,#000 25%,transparent 25%,transparent 75%,#000 75%),linear-gradient(45deg,#000 25%,transparent 25%,transparent 75%,#000 75%)",
  backgroundSize: "14px 14px",
  backgroundPosition: "0 0, 7px 7px",
});

/** HUD readout block — dense filler metadata like the reference posters */
export const hudCls = css({
  fontFamily: mono,
  fontSize: "9.5px",
  fontWeight: 700,
  letterSpacing: "0.24em",
  textTransform: "uppercase",
  opacity: 0.55,
  whiteSpace: "nowrap",
});

/** measurement scale bar (decorative, like a poster's tick ruler) */
export const scaleBarCls = css({
  height: "10px",
  backgroundImage:
    "repeating-linear-gradient(to right,#000 0 1.5px,transparent 1.5px 9px)",
});

/** monospace metadata tag — file labels, indices, section numbers */
export const metaCls = css({
  fontFamily: mono,
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "0.2em",
  textTransform: "uppercase",
});

/** rotated sticker label with a hard border */
export const stickerCls = css({
  display: "inline-block",
  fontFamily: mono,
  fontSize: "10px",
  fontWeight: 700,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  padding: "5px 10px",
  background: "#bffe28",
  color: "#000",
  border: "2px solid #000",
  borderRadius: "999px",
  transform: "rotate(-2.5deg)",
});

/**
 * The neo-brutalist press: element sits on a hard offset shadow, then slams
 * down into it on hover. Snappy easing, no soft fades.
 */
export const brutalBtnCls = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "10px",
  fontFamily: mono,
  fontWeight: 700,
  fontSize: "13px",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  padding: "14px 24px",
  background: "#fff",
  color: "#000",
  border: "3px solid #000",
  borderRadius: "999px",
  boxShadow: "6px 6px 0 0 #000",
  transition:
    "transform .12s cubic-bezier(.2,.9,.2,1), box-shadow .12s cubic-bezier(.2,.9,.2,1), background .1s steps(1)",
  _hover: {
    background: "#bffe28",
    transform: "translate(6px, 6px)",
    boxShadow: "0 0 0 0 #000",
  },
  _active: { background: "#ff00ff", color: "#fff" },
});

/** same press, tuned for dark backgrounds */
export const brutalBtnDarkCls = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "10px",
  fontFamily: mono,
  fontWeight: 700,
  fontSize: "13px",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  padding: "14px 24px",
  background: "#000",
  color: "#fff",
  border: "3px solid #fff",
  borderRadius: "999px",
  boxShadow: "6px 6px 0 0 #bffe28",
  transition:
    "transform .12s cubic-bezier(.2,.9,.2,1), box-shadow .12s cubic-bezier(.2,.9,.2,1), background .1s steps(1), color .1s steps(1)",
  _hover: {
    background: "#bffe28",
    color: "#000",
    borderColor: "#000",
    transform: "translate(6px, 6px)",
    boxShadow: "0 0 0 0 #bffe28",
  },
  _active: { background: "#ff00ff", color: "#fff" },
});

/** hard-edged card that shifts into its shadow on hover */
export const brutalCardCls = css({
  background: "#fbfbfb",
  border: "3px solid #000",
  borderRadius: "18px",
  boxShadow: "8px 8px 0 0 #000",
  transition:
    "transform .14s cubic-bezier(.2,.9,.2,1), box-shadow .14s cubic-bezier(.2,.9,.2,1)",
  _hover: {
    transform: "translate(8px, 8px)",
    boxShadow: "0 0 0 0 #000",
  },
});

/** section outer padding */
export const sectionCls = css({
  width: "100%",
  paddingX: { base: "24px", md: "clamp(32px, 6vw, 120px)" },
  paddingY: { base: "72px", md: "120px" },
  position: "relative",
});

export const innerCls = css({
  maxWidth: "1120px",
  marginX: "auto",
  width: "100%",
});

/** eyebrow label above a section title */
export const eyebrowCls = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  fontFamily: mono,
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: "#000",
  background: "#ff6737",
  border: "2px solid #000",
  borderRadius: "999px",
  padding: "6px 12px",
});

export const sectionTitleCls = css({
  fontFamily: prompt,
  fontWeight: 700,
  fontSize: { base: "40px", md: "72px" },
  lineHeight: 0.95,
  letterSpacing: "-0.035em",
  textTransform: "uppercase",
  color: INK,
  marginTop: "18px",
});

export const cardCls = css({
  background: PAPER,
  border: `2px solid ${INK}`,
  borderRadius: "16px",
  boxShadow: `6px 6px 0 0 ${INK}`,
});

export const chipCls = css({
  display: "inline-block",
  fontFamily: mono,
  fontSize: "11.5px",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  lineHeight: 1,
  padding: "7px 12px",
  border: "2px solid #000",
  borderRadius: "999px",
  background: "#fff",
  color: "#000",
  whiteSpace: "nowrap",
  transition: "background .1s steps(1), color .1s steps(1), transform .1s steps(1)",
  _hover: {
    background: "#000",
    color: "#bffe28",
    transform: "translate(-2px, -2px)",
  },
});

/** pill button whose color sweeps up to fill on hover (light backgrounds) */
export const fillLinkCls = css({
  position: "relative",
  overflow: "hidden",
  isolation: "isolate",
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  fontFamily: prompt,
  fontWeight: 600,
  fontSize: "15px",
  padding: "13px 24px",
  borderRadius: "999px",
  border: `2px solid ${INK}`,
  color: INK,
  background: "transparent",
  transition: "color .35s ease",
  _before: {
    content: '""',
    position: "absolute",
    inset: 0,
    zIndex: -1,
    background: ORANGE,
    transform: "translateY(101%)",
    transition: "transform .4s cubic-bezier(0.22,1,0.36,1)",
  },
  _hover: { color: "#fff" },
  "&:hover::before": { transform: "translateY(0)" },
});

/** same sweep-fill button tuned for the dark footer/skills backgrounds */
export const fillLinkDarkCls = css({
  position: "relative",
  overflow: "hidden",
  isolation: "isolate",
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  fontFamily: prompt,
  fontWeight: 500,
  fontSize: "15px",
  padding: "12px 22px",
  borderRadius: "999px",
  border: "1.5px solid rgba(255,255,255,0.35)",
  color: "#fff",
  background: "transparent",
  transition: "color .35s ease, border-color .35s ease",
  _before: {
    content: '""',
    position: "absolute",
    inset: 0,
    zIndex: -1,
    background: ORANGE,
    transform: "translateY(101%)",
    transition: "transform .4s cubic-bezier(0.22,1,0.36,1)",
  },
  _hover: { color: INK, borderColor: ORANGE },
  "&:hover::before": { transform: "translateY(0)" },
});
