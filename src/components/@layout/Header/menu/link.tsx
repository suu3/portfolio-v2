import Link from "next/link";
import { motion } from "framer-motion";
import { css } from "@/styled-system/css";
import { rotateX, mountAnim } from "../anim";

const mono = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

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
        data-cursor-label="Go ↗"
        className={css({
          display: "flex",
          alignItems: "center",
          gap: { base: "14px", md: "26px" },
          borderTop: "2px solid rgba(255,255,255,0.22)",
          paddingY: { base: "13px", md: "16px" },
          paddingX: { base: "20px", md: "clamp(24px, 5vw, 80px)" },
          color: "#fff",
          transition:
            "background .1s steps(1), color .1s steps(1), padding-left .18s cubic-bezier(.2,.9,.2,1)",
          _hover: {
            background: "#bffe28",
            color: "#000",
            paddingLeft: { base: "32px", md: "clamp(40px, 6vw, 110px)" },
          },
        })}
      >
        <span
          className={css({
            fontFamily: mono,
            fontSize: { base: "11px", md: "13px" },
            fontWeight: 700,
            letterSpacing: "0.2em",
            opacity: 0.75,
          })}
        >
          {String(index).padStart(2, "0")}
        </span>
        <span
          className={css({
            fontFamily: "Prompt, sans-serif",
            fontWeight: 700,
            fontSize: { base: "30px", md: "clamp(40px, 6vw, 68px)" },
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            textTransform: "uppercase",
          })}
        >
          {title}
        </span>
        <span
          className={css({
            marginLeft: "auto",
            fontSize: { base: "18px", md: "26px" },
          })}
        >
          ↗
        </span>
      </Link>
    </motion.div>
  );
}
