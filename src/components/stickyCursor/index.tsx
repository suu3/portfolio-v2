"use client";
import { useEffect, useState, useRef, MutableRefObject } from "react";
import styles from "./style.module.css";
import {
  motion,
  useMotionValue,
  useSpring,
  transform,
  animate,
} from "framer-motion";

export default function Index({
  stickyElements,
  hoverStates,
  setHoverStates,
}: {
  stickyElements: MutableRefObject<null[]>;
  hoverStates: boolean[];
  setHoverStates: React.Dispatch<React.SetStateAction<boolean[]>>;
}) {
  const cursor = useRef(null);
  const cursorSize = hoverStates.includes(true) ? 60 : 15;

  const mouse = {
    x: useMotionValue(0),
    y: useMotionValue(0),
  };

  const scale = {
    x: useMotionValue(1),
    y: useMotionValue(1),
  };

  const smoothOptions = { damping: 20, stiffness: 300, mass: 0.5 };
  const smoothMouse = {
    x: useSpring(mouse.x, smoothOptions),
    y: useSpring(mouse.y, smoothOptions),
  };

  const rotate = (distance) => {
    const angle = Math.atan2(distance.y, distance.x);
    animate(cursor.current, { rotate: `${angle}rad` }, { duration: 0 });
  };

  const manageMouseMove = (e) => {
    const { clientX, clientY } = e;

    stickyElements.current.forEach((element, index) => {
      if (!element) return;
      const { left, top, height, width } = element.getBoundingClientRect();

      const center = { x: left + width / 2, y: top + height / 2 };

      if (hoverStates[index]) {
        const distance = { x: clientX - center.x, y: clientY - center.y };

        rotate(distance);

        const absDistance = Math.max(
          Math.abs(distance.x),
          Math.abs(distance.y)
        );
        const newScaleX = transform(absDistance, [0, height / 2], [1, 1.3]);
        const newScaleY = transform(absDistance, [0, width / 2], [1, 0.8]);
        scale.x.set(newScaleX);
        scale.y.set(newScaleY);

        mouse.x.set(center.x - cursorSize / 2 + distance.x * 0.1);
        mouse.y.set(center.y - cursorSize / 2 + distance.y * 0.1);
      } else {
        mouse.x.set(clientX - cursorSize / 2);
        mouse.y.set(clientY - cursorSize / 2);
      }
    });
  };

  const manageMouseOver = (index) => () => {
    setHoverStates(hoverStates.map((state, i) => (i === index ? true : state)));
  };

  const manageMouseLeave = (index) => () => {
    setHoverStates(
      hoverStates.map((state, i) => (i === index ? false : state))
    );
    animate(
      cursor.current,
      { scaleX: 1, scaleY: 1 },
      { duration: 0.1 },
      { type: "spring" }
    );
  };

  useEffect(() => {
    stickyElements.current.forEach((element, index) => {
      if (!element) return;
      element.addEventListener("mouseenter", manageMouseOver(index));
      element.addEventListener("mouseleave", manageMouseLeave(index));
    });

    window.addEventListener("mousemove", manageMouseMove);
    return () => {
      stickyElements.current.forEach((element, index) => {
        if (!element) return;
        element.removeEventListener("mouseenter", manageMouseOver(index));
        element.removeEventListener("mouseleave", manageMouseLeave(index));
      });

      window.removeEventListener("mousemove", manageMouseMove);
    };
  }, [hoverStates]);

  const template = ({ rotate, scaleX, scaleY }) => {
    return `rotate(${rotate}) scaleX(${scaleX}) scaleY(${scaleY})`;
  };

  return (
    <div className={styles.cursorContainer}>
      <motion.div
        transformTemplate={template}
        style={{
          left: smoothMouse.x,
          top: smoothMouse.y,
          scaleX: scale.x,
          scaleY: scale.y,
        }}
        animate={{
          width: cursorSize,
          height: cursorSize,
        }}
        className={styles.cursor}
        ref={cursor}
      ></motion.div>
    </div>
  );
}
