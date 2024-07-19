import { css } from "@/styled-system/css";

export const textGroupCls = css({
  color: "colorTheme02",
  margin: 0,
  display: "flex",

  "&.shown": {
    position: "absolute",
    top: 0,
  },

  "&.hidden": {
    visibility: "hidden",
    opacity: 0,
  },

  "& > span": {
    fontSize: 80,
    fontWeight: 500,
    fontFamily: "Prompt",
  },
});
