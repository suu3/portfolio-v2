import styles from "./styles.module.css";
import Link from "next/link";
import { motion } from "framer-motion";
import { slide, scale } from "../../anim";
import { cx } from "@/styles/css";

export default function Index({
  data,
  isActive,
  setSelectedIndicator,
  className,
}) {
  const { title, href, index } = data;

  return (
    <motion.div
      className={cx(styles.link, className)}
      onMouseEnter={() => {
        setSelectedIndicator(href);
      }}
      custom={index}
      variants={slide}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      <motion.div
        variants={scale}
        animate={isActive ? "open" : "closed"}
        className={styles.indicator}
      ></motion.div>
      <Link href={href}>{title}</Link>
    </motion.div>
  );
}
