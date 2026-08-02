"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "!<>-_\\/[]{}=+*^?#%$&@01";

type Props = {
  text: string;
  className?: string;
  /** frames each character stays scrambled before locking in */
  speed?: number;
};

/**
 * Terminal-style decode: characters land one by one when the text
 * scrolls into view. Width stays stable (every slot always has a glyph).
 */
const ScrambleText = ({ text, className, speed = 1.6 }: Props) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [out, setOut] = useState(text);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let played = false;

    const run = () => {
      const queue = text.split("").map((ch, i) => ({
        ch,
        end: Math.floor(i * speed) + 10 + Math.floor(Math.random() * 14),
      }));
      let frame = 0;

      const tick = () => {
        let s = "";
        let done = 0;
        for (const q of queue) {
          if (q.ch === " ") {
            s += " ";
            done++;
          } else if (frame >= q.end) {
            s += q.ch;
            done++;
          } else {
            s += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          }
        }
        setOut(s);
        if (done === queue.length) return;
        frame++;
        raf = requestAnimationFrame(tick);
      };
      tick();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !played) {
          played = true;
          run();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [text, speed]);

  return (
    <span ref={ref} className={className}>
      {out}
    </span>
  );
};

export default ScrambleText;
