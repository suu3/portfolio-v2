"use client";

import React, { useEffect, useRef } from "react";
import styles from "./cursor.module.css";

/**
 * Hairline cursor — a small ring that inverts what's under it
 * (mix-blend-mode: difference) and snaps to wrap any [data-cursor] target,
 * showing its [data-cursor-label] as a monospace tag.
 *
 * Things that aren't DOM (the 3D character) can't carry [data-cursor], so they
 * dispatch `cursor:hint` with a label (or null) instead.
 */
const Cursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const box = boxRef.current;
    const label = labelRef.current;
    if (!dot || !box || !label) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { x: mouse.x, y: mouse.y };
    let stuck: HTMLElement | null = null;

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    };

    const PAD = 7; // half-gap between the target and the wrapping box

    /** match the target's corner radius, kept concentric with the padding */
    const radiusOf = (el: HTMLElement) => {
      const raw = parseFloat(getComputedStyle(el).borderRadius) || 0;
      if (raw >= 100) return "999px"; // already a pill
      return `${raw + PAD}px`;
    };

    let hint: string | null = null;

    const release = () => {
      const size = hint ? "64px" : "26px";
      box.style.width = size;
      box.style.height = size;
      box.style.borderRadius = "999px";
      box.dataset.stuck = "false";
      label.textContent = hint ?? "";
      dot.style.opacity = hint ? "0" : "1";
    };

    const onHint = (e: Event) => {
      hint = (e as CustomEvent<string | null>).detail ?? null;
      if (!stuck) release();
    };

    const grab = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      box.style.width = `${r.width + PAD * 2}px`;
      box.style.height = `${r.height + PAD * 2}px`;
      box.style.borderRadius = radiusOf(el);
      box.dataset.stuck = "true";
      label.textContent = el.dataset.cursorLabel ?? "";
      dot.style.opacity = "0";
    };

    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest<HTMLElement>("[data-cursor]");
      if (target && target !== stuck) {
        stuck = target;
        grab(target);
      } else if (!target && stuck) {
        stuck = null;
        release();
      }
    };

    release();
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    window.addEventListener("cursor:hint", onHint);

    let raf = 0;
    const loop = () => {
      let tx = mouse.x;
      let ty = mouse.y;

      if (stuck && document.contains(stuck)) {
        const r = stuck.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        // magnetic: locks onto the target, drifts slightly toward the pointer
        tx = cx + (mouse.x - cx) * 0.12;
        ty = cy + (mouse.y - cy) * 0.12;
        box.style.width = `${r.width + PAD * 2}px`;
        box.style.height = `${r.height + PAD * 2}px`;
      } else if (stuck) {
        stuck = null;
        release();
      }

      const ease = stuck ? 3 : 5;
      pos.x += (tx - pos.x) / ease;
      pos.y += (ty - pos.y) / ease;
      box.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      window.removeEventListener("cursor:hint", onHint);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div id="cursor" ref={dotRef} className={styles.dot} />
      <div id="cursor-border" ref={boxRef} className={styles.box} data-stuck="false">
        <span ref={labelRef} className={styles.label} />
      </div>
    </>
  );
};

export default Cursor;
