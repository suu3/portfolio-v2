"use client";

import { css } from "@/styled-system/css";
import { useScroll, useMotionValueEvent, motion } from "framer-motion";
import { useState } from "react";
import { textGroupCls } from "./styles";

const BottomToTopText = ({ text }: { text: string }) => {
  const [textDisappeared, setTextDisappeared] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (textDisappeared && latest < 10) {
      setTextDisappeared(false);
    }
    if (!textDisappeared && latest >= 10) {
      setTextDisappeared(true);
    }
  });

  const animatedText = text.toUpperCase();
  return (
    <motion.div
      className={css({
        position: "relative",
        overflowY: "hidden",
        height: "100",
      })}
    >
      <motion.h1
        initial={"disappeared"}
        animate={textDisappeared ? "disappeared" : "appeared"}
        variants={bottomTitleVariant}
        className={textGroupCls}
      >
        {animatedText.split("").map((char) => {
          return <motion.span variants={bottomSpanVariant}>{char}</motion.span>;
        })}
      </motion.h1>

      <h1 className={textGroupCls}>
        {animatedText.split("").map((char) => {
          return <span>{char}</span>;
        })}
      </h1>
    </motion.div>
  );
};

export default BottomToTopText;

const bottomTitleVariant = {
  appeared: {
    transition: {
      staggerChildren: 0.1,
      staggerDirection: 1,
    },
  },
  disappeared: {
    transition: {
      staggerChildren: 0.08,
      staggerDirection: -1,
    },
  },
};

const bottomSpanVariant = {
  appeared: {
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
  disappeared: {
    y: "100%",
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};
