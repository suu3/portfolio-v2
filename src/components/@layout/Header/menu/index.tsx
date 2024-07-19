import { motion } from "framer-motion";
import { opacity, slideLeft, mountAnim } from "../anim";
import styles from "./style.module.css";
import Link from "./link";
import { useState } from "react";
import { css } from "@/styled-system/css";

const menu = [
  {
    title: "Home",
    link: "/home",
  },
  {
    title: "Project",
    link: "/project",
  },
];

export default function index({ closeMenu }: { closeMenu: () => void }) {
  return (
    <motion.div
      className={styles.menu}
      variants={opacity}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      <div className={styles.header}>
        <motion.svg
          className={css({
            cursor: "pointer",
            width: "100px",
            height: "100px",
            "& path": {
              transition: "color 0.5s",
            },

            _hover: {
              "& path": {
                stroke: "colorAccentLime",
              },
            },
          })}
          variants={slideLeft}
          {...mountAnim}
          onClick={() => {
            closeMenu();
          }}
          width="68"
          height="68"
          viewBox="0 0 68 68"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1.5 1.5L67 67" stroke="white" />
          <path d="M66.5 1L0.999997 66.5" stroke="white" />
        </motion.svg>
      </div>

      <div className={styles.body}>
        {menu.map((el, index) => {
          return <Link title={el.title} href={el.link} key={index} />;
        })}
      </div>
    </motion.div>
  );
}
