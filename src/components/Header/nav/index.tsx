import React, { useState } from "react";
import styles from "./styles.module.css";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { menuSlide } from "../anim";
import Link from "./Link";
import Curve from "./Curve";
import { css } from "@/styles/css";

const navItems = [
  {
    title: "Home",
    href: "/home",
  },
  {
    title: "Project",
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
            <p>Navigation</p>
          </div>
          {navItems.map((data, index) => {
            return (
              <Link
                className={css({
                  "& a": {
                    textDecoration: "none",
                    color: "white",
                    fontWeight: 300,
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
