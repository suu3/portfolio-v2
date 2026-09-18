import { motion } from "framer-motion";
import { opacity, slideLeft, mountAnim } from "../anim";
import styles from "./style.module.css";
import MenuLink from "./link";
import PixelRabbit from "@/components/PixelRabbit";
import { css } from "@/styled-system/css";
import { profile } from "@/pagesLayer/home/data";
import { useTranslations } from "next-intl";

const mono = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

/** anchors are absolute so they also work from /project */
const menu = [
  { title: "Index", link: "/home#top" },
  { title: "About", link: "/home#about" },
  { title: "Work", link: "/home#experience" },
  { title: "Stack", link: "/home#skills" },
  { title: "Archive", link: "/home#beyond" },
  { title: "Projects", link: "/project" },
  { title: "Contact", link: "/home#contact" },
];

const railCls = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "16px",
  padding: "12px 16px",
  fontFamily: mono,
  fontSize: "11px",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "#ededeb",
});

export default function Menu({ closeMenu }: { closeMenu: () => void }) {
  const t = useTranslations();
  return (
    <motion.div className={styles.menu} variants={opacity} initial="initial" animate="enter" exit="exit">
      <motion.div variants={slideLeft} {...mountAnim} className={railCls}>
        <span className={css({ display: "inline-flex", alignItems: "center", gap: "10px" })}>
          <PixelRabbit size={18} color="#ededeb" ink="#ff5a1f" />
          {profile.handle}
        </span>

        <button
          type="button"
          aria-label={t("a11y.closeMenu")}
          onClick={closeMenu}
          data-cursor="pointer"
          data-cursor-label="Close"
          className={css({
            height: "38px",
            padding: "0 14px",
            color: "#ededeb",
            border: "1px solid rgba(255,255,255,0.45)",
            borderRadius: "999px",
            fontFamily: mono,
            fontSize: "11px",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            transition: "background .1s steps(2), color .1s steps(2)",
            _hover: { background: "#ededeb", color: "#111" },
          })}
        >
          Close ✕
        </button>
      </motion.div>

      <nav className={css({ borderBottom: "1px solid #2c2c2c" })}>
        {menu.map((el, i) => (
          <MenuLink key={el.link} index={i + 1} title={el.title} href={el.link} onNavigate={closeMenu} />
        ))}
      </nav>

      <motion.div variants={slideLeft} {...mountAnim} className={railCls}>
        <a href={`mailto:${profile.email}`} data-cursor="pointer" data-cursor-label={t("actions.mail")}>
          {profile.email}
        </a>
        <span className={css({ display: "inline-flex", gap: "16px" })}>
          <a href={profile.github} target="_blank" rel="noreferrer" data-cursor="pointer" data-cursor-label={t("actions.open")}>
            GitHub ↗
          </a>
          <a href={profile.blog} target="_blank" rel="noreferrer" data-cursor="pointer" data-cursor-label={t("actions.open")}>
            Blog ↗
          </a>
        </span>
      </motion.div>
    </motion.div>
  );
}
