import { css } from "@/styled-system/css";
import { flex } from "@/styled-system/patterns";

export const horizontalScrollCls = flex({
  width: "100vw",
  whiteSpace: "nowrap",
  position: "relative",
});

export const horizontalScrollContainerCls = css({
  width: "200vw",
  position: "relative",

  flexWrap: "no-wrap",
  overflowX: "scroll",
  display: "flex",
});
