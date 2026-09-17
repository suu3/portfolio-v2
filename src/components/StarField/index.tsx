"use client";

import { useEffect, useRef } from "react";
import { workScroll } from "@/lib/workScroll";

type Props = { className?: string };

type Star = {
  x: number;
  y: number;
  r: number;
  depth: number;
  alpha: number;
  speed: number;
  phase: number;
  color: string;
  flare: boolean;
};

/* three depth layers: far stars are tiny, dim and barely move */
const LAYERS = [
  { share: 0.55, depth: 0.12, r: 0.6, alpha: 0.28 },
  { share: 0.32, depth: 0.3, r: 0.9, alpha: 0.45 },
  { share: 0.13, depth: 0.6, r: 1.25, alpha: 0.7 },
];

/** a star per this many px² — sparse on purpose, the Work copy sits on top */
const DENSITY = 5200;
/** how much wider than the section the field is, so parallax never runs out */
const SPAN = 2.2;

const pick = (seed: number) => {
  // tiny deterministic PRNG — the sky shouldn't reshuffle on every resize
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
};

/**
 * Dim twinkling star field for the dark Work room. Plain canvas 2D. Stars
 * drift sideways slower than the cards while the section scrolls horizontally
 * (reads `workScroll.progress`), and stay out of the floor strip at the bottom.
 */
const StarField = ({ className }: Props) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let stars: Star[] = [];
    let raf = 0;
    let visible = false;
    const t0 = performance.now();

    const build = () => {
      const rand = pick(7);
      const count = Math.round((w * SPAN * h) / DENSITY);
      stars = [];
      for (let i = 0; i < count; i++) {
        const roll = rand();
        const layer = roll < LAYERS[0].share ? LAYERS[0] : roll < LAYERS[0].share + LAYERS[1].share ? LAYERS[1] : LAYERS[2];
        const tint = rand();
        stars.push({
          x: rand() * w * SPAN,
          // keep the floor strip (bottom ~26%) clear on the pinned desktop layout
          y: rand() * h * (w >= 768 ? 0.74 : 1),
          r: layer.r * (0.75 + rand() * 0.5),
          depth: layer.depth,
          alpha: layer.alpha * (0.7 + rand() * 0.3),
          speed: 0.6 + rand() * 1.8,
          phase: rand() * Math.PI * 2,
          color: tint < 0.07 ? "140,150,255" : tint < 0.1 ? "255,120,70" : "237,237,235",
          flare: layer === LAYERS[2] && rand() < 0.22,
        });
      }
    };

    const draw = (t: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const travel = w * 1.1 * workScroll.progress;

      for (const s of stars) {
        let x = s.x - travel * s.depth;
        x = ((x % (w * SPAN)) + w * SPAN) % (w * SPAN);
        if (x > w + 8) continue;
        const tw = reduce ? 1 : 0.55 + 0.45 * Math.sin(t * s.speed + s.phase);
        const a = s.alpha * tw;
        ctx.fillStyle = `rgba(${s.color},${a.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        if (s.flare && tw > 0.75) {
          const len = s.r * 5 * tw;
          ctx.strokeStyle = `rgba(${s.color},${(a * 0.6).toFixed(3)})`;
          ctx.lineWidth = 0.75;
          ctx.beginPath();
          ctx.moveTo(x - len, s.y);
          ctx.lineTo(x + len, s.y);
          ctx.moveTo(x, s.y - len);
          ctx.lineTo(x, s.y + len);
          ctx.stroke();
        }
      }
    };

    const frame = (now: number) => {
      raf = 0;
      draw((now - t0) / 1000);
      if (visible && !reduce) raf = requestAnimationFrame(frame);
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = r.width;
      h = r.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      build();
      draw((performance.now() - t0) / 1000);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(frame);
    });
    io.observe(canvas);

    // reduced motion still follows the horizontal scroll, just without twinkling
    const onScroll = () => reduce && visible && draw(0);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden />;
};

export default StarField;
