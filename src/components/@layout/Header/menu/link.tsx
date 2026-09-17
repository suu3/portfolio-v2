import Link from "next/link";
import { motion } from "framer-motion";
import { css } from "@/styled-system/css";
import { rotateX, mountAnim } from "../anim";

const mono = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

export default function MenuLink({
  index,
  title,
  href,
  onNavigate,
}: {
  index: number;
  title: string;
  href: string;
  onNavigate: () => void;
}) {
  return (
    <motion.div variants={rotateX} {...mountAnim} custom={index}>
      <Link
        href={href}
        onClick={onNavigate}
        data-cursor="pointer"
        data-cursor-label="Go"
        className={css({
          display: "flex",
          alignItems: "baseline",
          gap: "16px",
          borderTop: "1px solid #2c2c2c",
          paddingY: "12px",
          paddingX: "16px",
          color: "#ededeb",
          transition: "background .1s steps(2), color .1s steps(2)",
          _hover: { background: "#ff5a1f", color: "#111" },
        })}
      >
        <span className={css({ fontFamily: mono, fontSize: "11px", opacity: 0.6 })}>
          {String(index).padStart(2, "0")}
        </span>
        <span
          className={css({
            fontWeight: 600,
            fontSize: "clamp(30px, 9vw, 56px)",
            lineHeight: 1.05,
            letterSpacing: "-0.04em",
          })}
        >
          {title}
        </span>
        <span className={css({ marginLeft: "auto", fontFamily: mono, fontSize: "14px" })}>↗</span>
      </Link>
    </motion.div>
  );
}
