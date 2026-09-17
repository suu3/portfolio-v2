"use client";

import { CSSProperties, ReactNode, RefObject, useState } from "react";
import { motion, useDragControls } from "framer-motion";
import { css, cx } from "@/styled-system/css";

/** shared across every window so the last one touched is always on top */
let topZ = 20;

type Props = {
  /** file name in the title bar — `hello.txt` */
  title: string;
  /** right-aligned title bar readout */
  meta?: ReactNode;
  tone?: "light" | "dark";
  /** drag by the title bar (desktop only — pass false on touch layouts) */
  draggable?: boolean;
  constraints?: RefObject<Element>;
  collapsible?: boolean;
  className?: string;
  bodyClassName?: string;
  style?: CSSProperties;
  children: ReactNode;
};

/* light + dark are complete class sets — atomic classes can't reliably override each other */
const windowCls = css({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "ink",
  backgroundColor: "surface",
  color: "ink",
});

const windowDarkCls = css({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "darkLine",
  backgroundColor: "darkSurface",
  color: "#ededeb",
});

const barCls = css({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  height: "30px",
  flexShrink: 0,
  paddingLeft: "10px",
  paddingRight: "4px",
  borderBottomWidth: "1px",
  borderBottomStyle: "solid",
  fontFamily: "mono",
  fontSize: "11px",
  letterSpacing: "0.02em",
  userSelect: "none",
});

const barLightCls = css({ borderBottomColor: "ink" });
const barDarkCls = css({ borderBottomColor: "darkLine" });

const grabCls = css({ touchAction: "none", _active: { cursor: "grabbing" } });

const titleCls = css({
  flex: 1,
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

const metaCls = css({ opacity: 0.55, whiteSpace: "nowrap" });

const ctrlCls = css({
  display: "grid",
  placeItems: "center",
  width: "22px",
  height: "22px",
  fontFamily: "mono",
  fontSize: "13px",
  lineHeight: 1,
  color: "currentColor",
  transition: "background .1s steps(2), color .1s steps(2)",
  _hover: { background: "currentColor", "& > span": { filter: "invert(1)" } },
  _focusVisible: { outline: "2px solid #2d3cff", outlineOffset: "-2px" },
});

/**
 * A flat OS-style window: a file name, a hairline frame, nothing else.
 * The flatness is deliberate — it's the 2D half of the 2D/3D collision.
 */
const Window = ({
  title,
  meta,
  tone = "light",
  draggable = false,
  constraints,
  collapsible = true,
  className,
  bodyClassName,
  style,
  children,
}: Props) => {
  const controls = useDragControls();
  const [collapsed, setCollapsed] = useState(false);
  const [z, setZ] = useState<number>();

  return (
    <motion.section
      aria-label={title}
      drag={draggable}
      dragControls={controls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0.06}
      dragConstraints={constraints}
      onPointerDown={draggable ? () => setZ(++topZ) : undefined}
      style={{ ...style, ...(z ? { zIndex: z } : null) }}
      className={cx(tone === "dark" ? windowDarkCls : windowCls, className)}
    >
      <header
        className={cx(barCls, tone === "dark" ? barDarkCls : barLightCls, draggable && grabCls)}
        onPointerDown={draggable ? (e) => controls.start(e) : undefined}
        data-cursor={draggable ? "pointer" : undefined}
        data-cursor-label={draggable ? "Drag" : undefined}
      >
        <span className={titleCls}>{title}</span>
        {meta && <span className={metaCls}>{meta}</span>}
        {collapsible && (
          <button
            type="button"
            className={ctrlCls}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => setCollapsed((c) => !c)}
            aria-expanded={!collapsed}
            aria-label={collapsed ? `${title} 펼치기` : `${title} 접기`}
            data-cursor="pointer"
            data-cursor-label={collapsed ? "Open" : "Fold"}
          >
            <span>{collapsed ? "+" : "–"}</span>
          </button>
        )}
      </header>
      {!collapsed && <div className={bodyClassName}>{children}</div>}
    </motion.section>
  );
};

export default Window;
