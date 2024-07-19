import { css, cx } from "@/styled-system/css";
import { flex } from "@/styled-system/patterns";

const absolute = css({
  zIndex: 1000,
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
});

export const splashScreenCls = cx(
  absolute,
  flex({
    background: "orange",
    align: "center",
    justify: " center",
  })
);

export const textCls = css({
  fontSize: "100px",
  fontWeight: 700,
  color: "white",
  fontFamily: "Prompt",
});
