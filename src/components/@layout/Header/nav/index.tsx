import React, { useState } from "react";
import styles from "./styles.module.css";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { menuSlide } from "../anim";
import Link from "./Link";
import Curve from "./Curve";
import { css } from "@/styled-system/css";

const navItems = [
  {
    title: "HOME",
    href: "/home",
  },
  {
    title: "PROJECT",
    href: "/project",
  },
];

function Nav() {
  const pathname = usePathname();
  const [selectedIndicator, setSelectedIndicator] = useState(pathname);

  return (
    <motion.div
      variants={menuSlide}
      initial="initial"
      animate="enter"
      exit="exit"
      className={styles.menu}
    >
      <div className={styles.body}>
        <div
          onMouseLeave={() => {
            setSelectedIndicator(pathname);
          }}
          className={styles.nav}
        >
          <div className={styles.header}>
            <p>Content</p>
          </div>
          {navItems.map((data, index) => {
            return (
              <Link
                className={css({
                  "& a": {
                    textDecoration: "none",
                    color: "white",
                    fontWeight: 500,
                    stroke: "#000",
                    // '-webkit-text-stroke': '2px black'
                  },
                })}
                key={index}
                data={{ ...data, index }}
                isActive={selectedIndicator == data.href}
                setSelectedIndicator={setSelectedIndicator}
              ></Link>
            );
          })}
        </div>
      </div>
      <Curve />
    </motion.div>
  );
}

export default Nav;
