"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sparkle from "@/components/Sparkle";
import {
  splashScreenCls,
  railCls,
  centerCls,
  textCls,
  counterCls,
  barTrackCls,
  barFillCls,
} from "./styles";
import useScrollLock from "@/hooks/useScrollLock";
import { profile } from "@/pagesLayer/home/data";

const DURATION = 1100; // ms — short on purpose; this gates the whole site

export default function SplashScreen() {
  // `mounted` is hard presence; `show` drives the exit animation. They're
  // separate so the overlay can always be torn down even if the animation can't run.
  const [mounted, setMounted] = useState(true);
  const [show, setShow] = useState(true);
  const [count, setCount] = useState(0);
  const unlockScroll = useScrollLock();

  useEffect(() => {
    const teardown = () => {
      setShow(false);
      setMounted(false);
      unlockScroll();
    };

    // While the document is hidden the browser freezes rAF — which drives both
    // the counter *and* framer-motion's exit animation. That would strand this
    // full-screen overlay with the scroll locked, so don't play it at all.
    if (document.hidden) {
      teardown();
      return;
    }

    window.scrollTo(0, 0);

    const start = Date.now();
    const timers: number[] = [];
    let raf = 0;
    let done = false;

    const finish = () => {
      if (done) return;
      done = true;
      cancelAnimationFrame(raf);
      setCount(100);
      setShow(false);
      unlockScroll();
    };

    const tick = () => {
      if (done) return;
      const p = Math.min((Date.now() - start) / DURATION, 1);
      setCount(Math.round(p * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else finish();
    };
    raf = requestAnimationFrame(tick);

    // fires even when rAF is throttled
    timers.push(window.setTimeout(finish, DURATION + 150));
    // last resort: if the exit animation never completes, remove it outright
    timers.push(window.setTimeout(teardown, DURATION + 1400));

    const onVisibility = () => {
      if (document.hidden) teardown();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      done = true;
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      document.removeEventListener("visibilitychange", onVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence onExitComplete={() => setMounted(false)}>
      {show && (
        <motion.div
          key="splash"
          className={splashScreenCls}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.5, ease: [0.7, 0, 0.3, 1] }}
        >
          <div className={railCls}>
            <span>{profile.name} / FE—001</span>
            <span>PORTFOLIO ✦ 2026</span>
          </div>

          <div className={centerCls}>
            <Sparkle size={40} color="#bffe28" />
            <h1 className={textCls}>
              Frontend
              <br />
              Portfolio
            </h1>
            <span className={counterCls}>{String(count).padStart(3, "0")}</span>
            <div className={barTrackCls}>
              <div className={barFillCls} style={{ width: `${count}%` }} />
            </div>
          </div>

          <div className={railCls}>
            <span>Loading</span>
            <span>0000000</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
