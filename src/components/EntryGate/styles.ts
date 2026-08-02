import { css } from "@/styled-system/css";

const mono = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

export const gateCls = css({
  zIndex: 10002,
  position: "fixed",
  inset: 0,
  width: "100%",
  height: "100%",
  overflow: "hidden",
  background: "#000",
  touchAction: "none",
  userSelect: "none",
});

export const canvasCls = css({
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  display: "block",
  imageRendering: "pixelated",
});

export const skipCls = css({
  position: "absolute",
  top: { base: "16px", md: "24px" },
  right: { base: "16px", md: "24px" },
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  fontFamily: mono,
  fontWeight: 700,
  fontSize: { base: "11px", md: "12px" },
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  padding: { base: "10px 16px", md: "12px 20px" },
  background: "#000",
  color: "#fff",
  border: "3px solid #fff",
  borderRadius: "999px",
  boxShadow: "5px 5px 0 0 #bffe28",
  transition:
    "transform .12s cubic-bezier(.2,.9,.2,1), box-shadow .12s cubic-bezier(.2,.9,.2,1), background .1s steps(1), color .1s steps(1)",
  _hover: {
    background: "#bffe28",
    color: "#000",
    borderColor: "#000",
    transform: "translate(5px, 5px)",
    boxShadow: "0 0 0 0 #bffe28",
  },
  _active: { background: "#ff00ff", color: "#fff" },
});

export const hintCls = css({
  position: "absolute",
  left: "50%",
  // clears the touch d-pad when there is one; on a pointer device the game can
  // fill the window down to the bottom edge, so stay out of its way
  bottom: "14px",
  "@media (hover: none), (pointer: coarse)": { bottom: "104px" },
  transform: "translateX(-50%)",
  whiteSpace: "nowrap",
  fontFamily: mono,
  fontWeight: 700,
  fontSize: { base: "9.5px", md: "11px" },
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  color: "rgba(243,239,236,0.5)",
});

/** touch d-pad — desktop pointers never see it */
export const padCls = css({
  position: "absolute",
  left: 0,
  right: 0,
  bottom: "20px",
  display: "flex",
  justifyContent: "space-between",
  paddingX: "20px",
  gap: "12px",
  "@media (hover: hover) and (pointer: fine)": { display: "none" },
});

export const padGroupCls = css({ display: "flex", gap: "12px" });

export const padBtnCls = css({
  width: "68px",
  height: "68px",
  display: "grid",
  placeItems: "center",
  fontFamily: mono,
  fontSize: "22px",
  fontWeight: 700,
  color: "#000",
  background: "#f3efec",
  border: "3px solid #000",
  borderRadius: "999px",
  boxShadow: "0 0 0 3px #bffe28",
  touchAction: "none",
  _active: { background: "#bffe28" },
});

export const padJumpCls = css({
  width: "88px",
  height: "68px",
  display: "grid",
  placeItems: "center",
  fontFamily: mono,
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "0.14em",
  color: "#000",
  background: "#ff6737",
  border: "3px solid #000",
  borderRadius: "999px",
  boxShadow: "0 0 0 3px #bffe28",
  touchAction: "none",
  _active: { background: "#bffe28" },
});
