import { motion } from "framer-motion";
import { opacity, slideLeft, mountAnim } from "../anim";
import styles from "./style.module.css";
import MenuLink from "./link";
import Sparkle from "@/components/Sparkle";
import { css } from "@/styled-system/css";
import { profile } from "@/pagesLayer/home/data";

const mono = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

/** anchors are absolute so they also work from /project */
const menu = [
  { title: "Home", link: "/home" },
  { title: "About", link: "/home#about" },
  { title: "Work", link: "/home#experience" },
  { title: "Skills", link: "/home#skills" },
  { title: "Projects", link: "/project" },
  { title: "Contact", link: "/home#contact" },
];

const railCls = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "16px",
  paddingX: { base: "20px", md: "clamp(24px, 5vw, 80px)" },
  paddingY: { base: "20px", md: "28px" },
  fontFamily: mono,
  fontSize: { base: "9.5px", md: "11px" },
  fontWeight: 700,
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  color: "#bffe28",
});

export default function Menu({ closeMenu }: { closeMenu: () => void }) {
  return (
    <motion.div
      className={styles.menu}
      variants={opacity}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      {/* top rail — identity + close */}
      <motion.div variants={slideLeft} {...mountAnim} className={railCls}>
        <span className={css({ display: "inline-flex", alignItems: "center", gap: "10px" })}>
          <Sparkle size={14} color="#bffe28" />
          {profile.name} / FE—001
        </span>

        <button
          type="button"
          aria-label="메뉴 닫기"
          onClick={closeMenu}
          data-cursor="pointer"
          data-cursor-label="Close"
          className={css({
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "11px 18px",
            background: "#000",
            color: "#fff",
            border: "3px solid #fff",
            borderRadius: "999px",
            boxShadow: "5px 5px 0 0 #bffe28",
            fontFamily: mono,
            fontSize: { base: "10px", md: "11px" },
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            transition:
              "transform .12s cubic-bezier(.2,.9,.2,1), box-shadow .12s cubic-bezier(.2,.9,.2,1), background .1s steps(1), color .1s steps(1)",
            _hover: {
              background: "#bffe28",
              color: "#000",
              borderColor: "#000",
              transform: "translate(5px, 5px)",
              boxShadow: "0 0 0 0 #bffe28",
            },
          })}
        >
          Close ✕
        </button>
      </motion.div>

      {/* links */}
      <nav
        className={css({
          borderBottom: "2px solid rgba(255,255,255,0.22)",
        })}
      >
        {menu.map((el, i) => (
          <MenuLink
            key={el.link}
            index={i + 1}
            title={el.title}
            href={el.link}
            onNavigate={closeMenu}
          />
        ))}
      </nav>

      {/* bottom rail — contact */}
      <motion.div variants={slideLeft} {...mountAnim} className={railCls}>
        <a
          href={`mailto:${profile.email}`}
          data-cursor="pointer"
          data-cursor-label="Mail ↗"
          className={css({ _hover: { color: "#fff" } })}
        >
          {profile.email}
        </a>
        <span className={css({ display: "inline-flex", gap: "18px" })}>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            data-cursor="pointer"
            data-cursor-label="Open ↗"
            className={css({ _hover: { color: "#fff" } })}
          >
            GitHub ↗
          </a>
          <a
            href={profile.blog}
            target="_blank"
            rel="noreferrer"
            data-cursor="pointer"
            data-cursor-label="Open ↗"
            className={css({ _hover: { color: "#fff" } })}
          >
            Blog ↗
          </a>
        </span>
      </motion.div>
    </motion.div>
  );
}
