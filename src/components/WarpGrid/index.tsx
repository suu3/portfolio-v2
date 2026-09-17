"use client";

import { useEffect, useRef } from "react";

type Props = {
  className?: string;
  /** base line colour */
  color?: string;
  /** colour of the lens that follows the pointer */
  lens?: string;
};

const COLS = 26;
const ROWS = 16;
const SEG_U = 44;
const SEG_V = 30;

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

/**
 * A flat 2D grid sheet that behaves like cloth: slow waves, a magnifying bulge
 * under the pointer, and a ripple that runs through it when you scroll fast.
 *
 * Plain canvas 2D on purpose — the grid is the "paper" half of the hero, the
 * 3D character stands in front of it.
 */
const WarpGrid = ({ className, color = "rgba(17,17,17,0.24)", lens = "#2d3cff" }: Props) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let visible = true;
    const t0 = performance.now();

    const mouse = { x: 0, y: 0, tx: 0, ty: 0, on: 0, tOn: 0, seen: false };
    let lastScroll = window.scrollY;
    let vel = 0;

    const pt = { x: 0, y: 0 };

    /** grid (u, v) in 0..1 → screen px, with every distortion applied */
    const project = (u: number, v: number, t: number) => {
      const narrow = w < 1024;
      const x0 = w * (narrow ? 0.03 : 0.22);
      const x1 = w * (narrow ? 0.97 : 0.95);
      const y0 = h * (narrow ? 0.12 : 0.14);
      const y1 = h * (narrow ? 0.94 : 0.86);
      const cx = (x0 + x1) / 2;
      const cy = (y0 + y1) / 2;

      const cu = u * 2 - 1;
      const cv = v * 2 - 1;

      // depth of the sheet: slow cloth waves + a ripple while scrolling
      const z =
        Math.sin(cu * 2.1 + t * 0.45) * 0.5 +
        Math.cos(cv * 2.7 - t * 0.33) * 0.38 +
        Math.sin((cu - cv) * 3.3 + t * 0.7) * 0.14;

      // pillow bulge toward the viewer — edges curve, centre swells
      const r2 = cu * cu + cv * cv;
      const s = 1 + z * 0.05 + (0.1 - r2 * 0.05);

      let x = cx + ((x1 - x0) / 2) * cu * s;
      let y = cy + ((y1 - y0) / 2) * cv * s + z * h * 0.012;

      // scroll-velocity wave travelling across the sheet
      y += Math.sin(cu * 5 - t * 6) * vel * 0.9;
      x += Math.cos(cv * 4 + t * 5) * vel * 0.35;

      // magnifier under the pointer
      if (mouse.on > 0.001) {
        const dx = x - mouse.x;
        const dy = y - mouse.y;
        const d2 = dx * dx + dy * dy;
        const f = Math.exp(-d2 / (2 * 120 * 120)) * 0.42 * mouse.on;
        x += dx * f;
        y += dy * f;
      }

      pt.x = x;
      pt.y = y;
      return pt;
    };

    const strokeSheet = (t: number) => {
      ctx.beginPath();
      for (let r = 0; r <= ROWS; r++) {
        const v = r / ROWS;
        for (let i = 0; i <= SEG_U; i++) {
          const p = project(i / SEG_U, v, t);
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
      }
      for (let c = 0; c <= COLS; c++) {
        const u = c / COLS;
        for (let i = 0; i <= SEG_V; i++) {
          const p = project(u, i / SEG_V, t);
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
      }
      ctx.stroke();
    };

    const draw = (t: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      ctx.lineWidth = 1;
      ctx.strokeStyle = color;
      strokeSheet(t);

      // the same lines, re-inked in the point colour inside the lens
      if (mouse.on > 0.02) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 150 * mouse.on, 0, Math.PI * 2);
        ctx.clip();
        ctx.lineWidth = 1.25;
        ctx.strokeStyle = lens;
        strokeSheet(t);
        ctx.restore();
      }
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      draw((performance.now() - t0) / 1000);
    };

    const frame = (now: number) => {
      raf = 0;
      const t = (now - t0) / 1000;

      const sy = window.scrollY;
      vel += (clamp(sy - lastScroll, -48, 48) - vel) * 0.12;
      lastScroll = sy;

      mouse.x += (mouse.tx - mouse.x) * 0.16;
      mouse.y += (mouse.ty - mouse.y) * 0.16;
      mouse.on += (mouse.tOn - mouse.on) * 0.08;

      draw(t);
      if (visible) raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (!raf && visible && !reduce) raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const inside = x >= 0 && y >= 0 && x <= r.width && y <= r.height;
      mouse.tx = x;
      mouse.ty = y;
      mouse.tOn = inside && e.pointerType === "mouse" ? 1 : 0;
      if (!mouse.seen) {
        mouse.x = x;
        mouse.y = y;
        mouse.seen = true;
      }
      if (reduce) {
        mouse.x = x;
        mouse.y = y;
        mouse.on = mouse.tOn;
        draw(0);
      }
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    io.observe(canvas);

    window.addEventListener("pointermove", onMove, { passive: true });
    start();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [color, lens]);

  return <canvas ref={ref} className={className} aria-hidden />;
};

export default WarpGrid;
