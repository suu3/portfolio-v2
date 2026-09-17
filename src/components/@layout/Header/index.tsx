"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, LayoutGroup } from "framer-motion";
import { css, cx } from "@/styled-system/css";
import PixelRabbit from "@/components/PixelRabbit";
import { profile } from "@/pagesLayer/home/data";
import { ORANGE, pillCls } from "@/pagesLayer/home/ui";
import Burger from "./burger";
import Stairs from "./stairs";
import Menu from "./menu";

export const NAV = [
  { id: "top", label: "Index" },
  { id: "about", label: "About" },
  { id: "experience", label: "Work" },
  { id: "skills", label: "Stack" },
  { id: "beyond", label: "Archive" },
  { id: "contact", label: "Contact" },
];

/** which section is under the middle of the viewport */
const useActiveSection = (enabled: boolean) => {
  const [active, setActive] = useState("top");
  useEffect(() => {
    if (!enabled) return;
    const els = NAV.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [enabled]);
  return active;
};

const barCls = css({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  padding: { base: "12px 16px", md: "18px clamp(24px, 4.5vw, 88px)" },
  pointerEvents: "none",
  "& > *": { pointerEvents: "auto" },
});

const logoCls = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "10px",
  height: "38px",
  paddingRight: "12px",
  border: `1px solid token(colors.ink)`,
  background: "surface",
  color: "ink",
  fontFamily: "mono",
  fontSize: "11px",
  letterSpacing: "0.04em",
  transition: "background .1s steps(2), color .1s steps(2)",
  "& .mark": {
    display: "grid",
    placeItems: "center",
    width: "36px",
    height: "36px",
    borderRight: `1px solid token(colors.ink)`,
  },
  _hover: { background: "ink", color: "#fff", "& .mark": { borderColor: "#fff" } },
});

const navCls = css({
  position: "absolute",
  left: "50%",
  transform: "translateX(-50%)",
  display: { base: "none", lg: "flex" },
  gap: "2px",
  padding: "3px",
  border: `1px solid token(colors.ink)`,
  borderRadius: "999px",
  background: "surface",
});

const itemCls = css({
  position: "relative",
  fontFamily: "mono",
  fontSize: "11px",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  lineHeight: 1,
  padding: "9px 13px",
  borderRadius: "999px",
  transition: "background .1s steps(2), color .1s steps(2)",
});

const itemOffCls = css({
  color: "ink",
  _hover: { background: "rgba(17,17,17,0.08)" },
});

const itemOnCls = css({
  backgroundColor: "ink",
  color: "#fff",
  _after: {
    content: '""',
    position: "absolute",
    top: "6px",
    right: "6px",
    width: "4px",
    height: "4px",
    borderRadius: "999px",
    background: "point",
  },
});

export default function Header() {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const pathname = usePathname();
  const onHome = pathname === "/home" || pathname === "/";
  const active = useActiveSection(onHome);
  const href = (id: string) => (onHome ? `#${id}` : `/home#${id}`);

  return (
    <header className={css({ position: "relative", zIndex: 999 })}>
      <div className={barCls}>
        <Link href={href("top")} className={logoCls} data-cursor="pointer" data-cursor-label="Home">
          <span className="mark">
            <PixelRabbit size={20} color="currentColor" ink={ORANGE} />
          </span>
          {profile.handle}
        </Link>

        <nav className={navCls} aria-label="섹션">
          {NAV.map((n) => (
            <Link
              key={n.id}
              href={href(n.id)}
              aria-current={onHome && active === n.id ? "true" : undefined}
              className={cx(itemCls, onHome && active === n.id ? itemOnCls : itemOffCls)}
              data-cursor="pointer"
              data-cursor-label="Go"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className={css({ display: "flex", gap: "6px", alignItems: "center" })}>
          <span className={css({ display: { base: "none", md: "flex" }, gap: "6px" })}>
            <a href={profile.github} target="_blank" rel="noreferrer" className={pillCls} data-cursor="pointer" data-cursor-label="Open ↗">
              GitHub ↗
            </a>
            <a href={profile.blog} target="_blank" rel="noreferrer" className={pillCls} data-cursor="pointer" data-cursor-label="Open ↗">
              Blog ↗
            </a>
          </span>
          <Burger openMenu={() => setMenuIsOpen(true)} />
        </div>
      </div>

      <LayoutGroup>
        <AnimatePresence mode="wait">
          {menuIsOpen && (
            <>
              <Stairs key="stairs" />
              <Menu closeMenu={() => setMenuIsOpen(false)} />
            </>
          )}
        </AnimatePresence>
      </LayoutGroup>
    </header>
  );
}
