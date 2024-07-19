import React from "react";
import styles from "./style.module.css";
import { height, background, mountAnim } from "../anim";
import { motion } from "framer-motion";

export default function index() {
  return (
    <motion.div className={styles.stairs} data-cursor="pointer">
      {[...Array(5)].map((_, index) => {
        return (
          <motion.div
            key={index}
            variants={height}
            {...mountAnim}
            custom={4 - index}
            className={styles.stair}
          ></motion.div>
        );
      })}
      <motion.div
        variants={background}
        {...mountAnim}
        className={styles.background}
      ></motion.div>
    </motion.div>
  );
}
