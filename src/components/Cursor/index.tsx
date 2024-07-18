"use client";

import React, { useEffect, useRef } from "react";
import styles from "./cursor.module.css";

const Cursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorBorderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorBorder = cursorBorderRef.current;
    if (!cursor || !cursorBorder) return;

    const cursorPos = { x: 0, y: 0 };
    const cursorBorderPos = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      cursorPos.x = e.clientX;
      cursorPos.y = e.clientY;

      cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };

    document.addEventListener("mousemove", handleMouseMove);

    const loop = () => {
      const easing = 8;
      cursorBorderPos.x += (cursorPos.x - cursorBorderPos.x) / easing;
      cursorBorderPos.y += (cursorPos.y - cursorBorderPos.y) / easing;

      cursorBorder.style.transform = `translate(${cursorBorderPos.x}px, ${cursorBorderPos.y}px)`;
      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);

    const items = document.querySelectorAll<HTMLElement>("[data-cursor]");
    items.forEach((item) => {
      item.addEventListener("mouseover", () => {
        if (item.dataset.cursor === "pointer") {
          cursorBorder.style.backgroundColor = "rgba(255, 255, 255, .6)";
          cursorBorder.style.setProperty("--size", "30px");
        }
        if (item.dataset.cursor === "pointer2") {
          cursorBorder.style.backgroundColor = "white";
          cursorBorder.style.mixBlendMode = "difference";
          cursorBorder.style.setProperty("--size", "80px");
        }
      });
      item.addEventListener("mouseout", () => {
        cursorBorder.style.backgroundColor = "unset";
        cursorBorder.style.mixBlendMode = "unset";
        cursorBorder.style.setProperty("--size", "50px");
      });
    });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      <div id="cursor" ref={cursorRef} className={styles.cursor}></div>
      <div
        id="cursor-border"
        ref={cursorBorderRef}
        className={styles.cursorBorder}
      />
    </>
  );
};

export default Cursor;
