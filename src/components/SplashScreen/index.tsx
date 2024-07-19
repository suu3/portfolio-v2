"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { splashScreenCls, textCls } from "./styles";
import useScrollLock from "@/hooks/useScrollLock";

const texts = ["My", "Front-end", "Portfolio"];
const TEXT_INTERVAL = 500;

export default function SplashScreen() {
  const [currentText, setCurrentText] = useState(texts[0]);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const unlockScroll = useScrollLock();

  useEffect(() => {
    // 스크롤을 상단에 고정
    window.scrollTo(0, 0);

    let textIndex = 0;
    const interval = setInterval(() => {
      textIndex = (textIndex + 1) % texts.length;
      setCurrentText(texts[textIndex]);

      if (texts[textIndex] === texts[texts.length - 1]) {
        clearInterval(interval);
      }
    }, TEXT_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleAnimationComplete = () => {
    setIsAnimationComplete(true);
    unlockScroll(); // 스크롤 잠금 해제
  };

  if (isAnimationComplete) {
    return null; // 컴포넌트 언마운트
  }

  return (
    <motion.div
      initial={{
        clipPath:
          "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 25%, 75% 25%, 75% 75%, 25% 75%, 25% 50%, 50% 50%, 25% 50%, 25% 75%, 75% 75%, 75% 25%, 0% 25%)",
      }}
      animate={{
        clipPath: [
          "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 25%, 75% 25%, 75% 75%, 25% 75%, 25% 50%, 50% 50%, 25% 50%, 25% 75%, 75% 75%, 75% 25%, 0% 25%)",
          "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 25%, 75% 25%, 75% 50%, 50% 50%, 50% 50%, 50% 50%, 25% 50%, 25% 75%, 75% 75%, 75% 25%, 0% 25%)",
          "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 25%, 75% 25%, 75% 50%, 50% 50%, 50% 50%, 50% 50%, 25% 50%, 25% 75%, 75% 75%, 75% 25%, 0% 25%)",
          "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 25%, 25% 25%, 25% 50%, 25% 50%, 25% 50%, 25% 50%, 25% 50%, 25% 75%, 75% 75%, 75% 25%, 0% 25%)",
          "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 25%, 25% 25%, 25% 50%, 25% 50%, 25% 50%, 25% 50%, 25% 50%, 25% 75%, 75% 75%, 75% 25%, 0% 25%)",
          "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 75%, 25% 75%, 25% 75%, 25% 75%, 25% 75%, 25% 75%, 25% 75%, 25% 75%, 75% 75%, 75% 25%, 0% 25%)",
          "polygon(0% 0%, 100% 0%, 100% 100%, 75% 100%, 75% 75%, 75% 75%, 75% 75%, 75% 75%, 75% 75%, 75% 75%, 75% 75%, 75% 75%, 75% 75%, 75% 25%, 0% 25%)",
          "polygon(0% 0%, 100% 0%, 100% 25%, 75% 25%, 75% 25%, 75% 25%, 75% 25%, 75% 25%, 75% 25%, 75% 25%, 75% 25%, 75% 25%, 75% 25%, 75% 25%, 0% 25%)",
          "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 25%, 0% 25%, 0% 25%, 0% 25%, 0% 25%, 0% 25%, 0% 25%)",
        ],
        transition: {
          duration: 1.5,
          delay: (texts.length * TEXT_INTERVAL) / 1000,
        },
      }}
      onAnimationComplete={handleAnimationComplete}
      className={splashScreenCls}
    >
      <span className={textCls}>{currentText.toUpperCase()}</span>
    </motion.div>
  );
}
