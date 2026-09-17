"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { css, cx } from "@/styled-system/css";
import Window from "@/components/Window";
import WarpGrid from "@/components/WarpGrid";
import PixelRabbit from "@/components/PixelRabbit";
import Barcode from "@/components/Barcode";
import { profile } from "../data";
import { INK, ORANGE, metaCls, pillCls, pillGhostCls } from "../ui";

const HeroCanvas = dynamic(() => import("@/components/@three/HeroCanvas"), { ssr: false });

/** true once we know this is a wide, fine-pointer screen (drag + floating layout) */
const useDesk = () => {
  const [desk, setDesk] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
    const on = () => setDesk(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return desk;
};

const Clock = () => {
  const [now, setNow] = useState<string>();
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Seoul",
    });
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 10_000);
    return () => window.clearInterval(id);
  }, []);
  const [hh, mm] = (now ?? "--:--").split(":");
  return (
    <span>
      {hh}
      <span className={css({ animation: "blink 1s steps(2) infinite" })}>:</span>
      {mm}
    </span>
  );
};

/* ───────── layout ───────── */

const sectionCls = css({
  position: "relative",
  overflow: "hidden",
  background: "paper",
  color: "ink",
  minHeight: { lg: "max(680px, 100svh)" },
  paddingBottom: { base: "28px", lg: 0 },
});

/** grid + 3D. absolutely fills the hero on desktop, a fixed-height stage when stacked */
const stageCls = css({
  position: { base: "relative", lg: "absolute" },
  inset: { lg: 0 },
  height: { base: "min(78svh, 640px)", lg: "auto" },
});

const layerCls = css({ position: "absolute", inset: 0, width: "100%", height: "100%" });

const windowsCls = css({
  position: { base: "relative", lg: "absolute" },
  inset: { lg: 0 },
  zIndex: 1,
  pointerEvents: { lg: "none" },
  display: "flex",
  flexDirection: "column",
  gap: "14px",
  paddingX: { base: "16px", lg: 0 },
  marginTop: { base: "-56px", lg: 0 },
  "& > *": { pointerEvents: "auto" },
});

const helloPos = css({
  position: { lg: "absolute" },
  left: { lg: "clamp(24px, 4.5vw, 88px)" },
  top: { lg: "clamp(96px, 19vh, 190px)" },
  width: { lg: "clamp(380px, 37vw, 560px)" },
});

const statusPos = css({
  position: { lg: "absolute" },
  right: { lg: "clamp(24px, 4vw, 72px)" },
  top: { lg: "clamp(110px, 17vh, 170px)" },
  width: { lg: "268px" },
});

const charmPos = css({
  display: { base: "none", lg: "flex" },
  position: "absolute",
  right: "clamp(40px, 9vw, 150px)",
  bottom: "clamp(56px, 12vh, 130px)",
  width: "164px",
});

/**
 * Window pop-in as a plain CSS animation, not framer-motion: rAF is frozen in a
 * hidden tab, so a JS-driven entrance would leave the windows at opacity 0 until
 * the tab is focused. CSS keeps its own clock.
 */
const popCls = css({ animation: "winPop .2s steps(4) both" });
const pop = (i: number) => ({ style: { animationDelay: `${1300 + i * 140}ms` } });

const Row = ({ k, children }: { k: string; children: React.ReactNode }) => (
  <div
    className={css({
      display: "grid",
      gridTemplateColumns: "72px 1fr",
      gap: "10px",
      paddingY: "7px",
      borderTop: "1px solid rgba(17,17,17,0.1)",
      _first: { borderTop: "none" },
    })}
  >
    <span className={css({ color: "muted" })}>{k}</span>
    <span>{children}</span>
  </div>
);

const Hero = () => {
  const ref = useRef<HTMLElement>(null);
  const desk = useDesk();

  return (
    <section ref={ref} id="top" className={sectionCls}>
      {/* 2D grid sheet (back) → windows (middle) → 3D figure (front) */}
      <div className={stageCls}>
        <WarpGrid className={cx(layerCls, css({ zIndex: 0 }))} />
        <div className={cx(layerCls, css({ zIndex: 2, pointerEvents: "none" }))}>
          <HeroCanvas eventSource={ref} />
        </div>
      </div>

      <div className={windowsCls}>
        <div {...pop(0)} className={cx(popCls, helloPos)}>
          <Window
            title="hello.txt"
            meta="UTF-8"
            draggable={desk}
            constraints={ref}
            bodyClassName={css({ padding: { base: "20px 18px 22px", md: "26px 28px 28px" } })}
          >
            <p className={cx(metaCls, css({ color: "muted" }))}>
              {profile.role} — {profile.location}
            </p>
            <h1
              className={css({
                fontFamily: "sans",
                fontWeight: 650,
                fontSize: { base: "clamp(34px, 10vw, 48px)", lg: "clamp(40px, 4.2vw, 68px)" },
                lineHeight: 1.04,
                letterSpacing: "-0.05em",
                marginTop: "16px",
              })}
            >
              안녕하세요,
              <br />
              프론트엔드 개발자
              <br />
              <span className={css({ color: "point" })}>{profile.handle}</span>입니다.
            </h1>
            <p
              className={css({
                marginTop: "18px",
                fontSize: { base: "15px", md: "16px" },
                lineHeight: 1.65,
                color: "#3b3b38",
                whiteSpace: "pre-line",
              })}
            >
              {profile.tagline}
            </p>
            <div className={css({ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "24px" })}>
              <a href={`mailto:${profile.email}`} className={pillCls} data-cursor="pointer" data-cursor-label="Mail ↗">
                메일 보내기 ↗
              </a>
              <a href="#experience" className={pillGhostCls} data-cursor="pointer" data-cursor-label="Go ↓">
                작업 보기 ↓
              </a>
            </div>
          </Window>
        </div>

        <div {...pop(1)} className={cx(popCls, statusPos)}>
          <Window
            title="status.log"
            draggable={desk}
            constraints={ref}
            bodyClassName={css({ padding: "10px 14px 12px", fontFamily: "mono", fontSize: "11.5px" })}
          >
            <Row k="ROLE">{profile.role}</Row>
            <Row k="BASE">{profile.location}</Row>
            <Row k="STACK">Next.js · TS · R3F</Row>
            <Row k="STATUS">
              <span className={css({ display: "inline-flex", alignItems: "center", gap: "7px" })}>
                <i
                  className={css({
                    display: "inline-block",
                    width: "7px",
                    height: "7px",
                    borderRadius: "999px",
                    background: "point",
                    animation: "blink 1.2s steps(2) infinite",
                  })}
                />
                available
              </span>
            </Row>
          </Window>
        </div>

        <div {...pop(2)} className={cx(popCls, charmPos)}>
          <Window
            title="charm.bmp"
            draggable={desk}
            constraints={ref}
            collapsible={false}
            bodyClassName={css({
              display: "grid",
              placeItems: "center",
              paddingY: "18px",
              backgroundImage:
                "linear-gradient(45deg, rgba(17,17,17,.06) 25%, transparent 25%, transparent 75%, rgba(17,17,17,.06) 75%), linear-gradient(45deg, rgba(17,17,17,.06) 25%, transparent 25%, transparent 75%, rgba(17,17,17,.06) 75%)",
              backgroundSize: "12px 12px",
              backgroundPosition: "0 0, 6px 6px",
            })}
          >
            <PixelRabbit size={72} color={INK} ink={ORANGE} />
          </Window>
        </div>
      </div>

      {/* HUD */}
      <div
        className={css({
          position: { base: "relative", lg: "absolute" },
          left: { lg: "clamp(24px, 4.5vw, 88px)" },
          bottom: { lg: "26px" },
          zIndex: 3,
          display: "flex",
          alignItems: { base: "center", lg: "flex-start" },
          flexDirection: { base: "row", lg: "column" },
          justifyContent: { base: "space-between", lg: "flex-start" },
          gap: "6px",
          paddingX: { base: "16px", lg: 0 },
          marginTop: { base: "22px", lg: 0 },
          fontFamily: "mono",
          fontSize: "11px",
          lineHeight: 1.45,
          letterSpacing: "0.04em",
          pointerEvents: "none",
        })}
      >
        <span>
          SEOUL <Clock />
          <br />
          frontend
          <br />
          portfolio
        </span>
        <Barcode value={profile.handle} height={18} className={css({ marginTop: { lg: "4px" } })} />
      </div>

      <a
        href="#about"
        data-cursor="pointer"
        data-cursor-label="Scroll"
        className={css({
          display: { base: "none", lg: "flex" },
          position: "absolute",
          left: "50%",
          bottom: "24px",
          transform: "translateX(-50%)",
          zIndex: 3,
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          fontFamily: "mono",
          fontSize: "10px",
          letterSpacing: "0.16em",
          color: "ink",
        })}
      >
        SCROLL
        <span
          className={css({
            width: "1px",
            height: "34px",
            background: "ink",
            transformOrigin: "top",
            animation: "drip 1.6s steps(8) infinite",
          })}
        />
      </a>
    </section>
  );
};

export default Hero;
