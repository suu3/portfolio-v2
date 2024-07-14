"use client";

import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import Nav from "./nav";
import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { css, cx } from "@/styles/css";

export default function Header() {
  const [isActive, setIsActive] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (isActive) setIsActive(false);
  }, [pathname]);

  return (
    <>
      <div className={styles.main}>
        <div className={styles.header}>
          <div
            onClick={() => {
              setIsActive(!isActive);
            }}
            data-cursor="pointer"
            className={cx(
              styles.button,
              css({
                bg: "colorTheme01",
                borderColor: "colorBgSurface",
                borderWidth: 1,
              })
            )}
          >
            <div
              className={`${styles.burger} ${isActive ? styles.burgerActive : ""}`}
            />
          </div>
        </div>
      </div>
      <AnimatePresence mode="wait">{isActive && <Nav />}</AnimatePresence>
    </>
  );
}
