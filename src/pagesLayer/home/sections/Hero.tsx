"use client";

import { useEffect, useState } from "react";
import { css, cx } from "@/styled-system/css";
import Window from "@/components/Window";
import WarpGrid from "@/components/WarpGrid";
import { profile } from "../data";
import { metaCls, pillCls, pillGhostCls } from "../ui";

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

/** `Ln` follows the scroll, one "line" per 24px — the page is the file */
const useLine = () => {
  const [ln, setLn] = useState(1);
  useEffect(() => {
    let raf = 0;
    const on = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setLn(Math.floor(window.scrollY / 24) + 1);
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", on);
    };
  }, []);
  return ln;
};

const barItemCls = css({ display: "inline-flex", alignItems: "center", gap: "7px", whiteSpace: "nowrap" });
const barWideCls = css({ display: { base: "none", md: "inline-flex" }, alignItems: "center", whiteSpace: "nowrap" });

const StatusBar = () => {
  const ln = useLine();
  return (
    <div
      className={css({
        position: { base: "relative", lg: "absolute" },
        left: 0,
        right: 0,
        bottom: { lg: 0 },
        zIndex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "18px",
        height: "30px",
        marginTop: { base: "22px", lg: 0 },
        paddingX: { base: "16px", lg: "clamp(24px, 4.5vw, 88px)" },
        borderTop: "1px solid token(colors.ink)",
        background: "surface",
        fontFamily: "mono",
        fontSize: "11px",
        letterSpacing: "0.02em",
        color: "ink",
      })}
    >
      <span className={css({ display: "flex", alignItems: "center", gap: "18px", minWidth: 0 })}>
        <span className={barItemCls}>
          <i className={css({ display: "inline-block", width: "7px", height: "7px", borderRadius: "999px", background: "point" })} />
          main
        </span>
        <span className={barWideCls}>~/{profile.handle}/index.tsx</span>
      </span>
      <span className={css({ display: "flex", alignItems: "center", gap: "18px" })}>
        <span className={barWideCls}>Ln {ln}, Col 1</span>
        <span className={barWideCls}>UTF-8</span>
        <span className={barWideCls}>TSX</span>
        <span className={barItemCls}>
          SEOUL <Clock />
        </span>
        <a
          href="#about"
          data-cursor="pointer"
          data-cursor-label="Go ↓"
          className={css({
            display: { base: "none", lg: "inline-flex" },
            alignItems: "center",
            gap: "6px",
            paddingX: "8px",
            height: "20px",
            background: "ink",
            color: "#fff",
            transition: "background .1s steps(2), color .1s steps(2)",
            _hover: { background: "point", color: "ink" },
          })}
        >
          scroll ↓
        </a>
      </span>
    </div>
  );
};

/* ───────── layout ───────── */

const sectionCls = css({
  position: "relative",
  overflow: "hidden",
  background: "paper",
  color: "ink",
  minHeight: { lg: "max(680px, 100svh)" },
  display: { lg: "flex" },
  flexDirection: { lg: "column" },
});

/** the warp grid sits behind the whole hero but fades out under the copy */
const gridCls = css({
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  zIndex: 0,
  maskImage: {
    base: "linear-gradient(to bottom, transparent 0, transparent 34%, #000 52%)",
    lg: "linear-gradient(90deg, transparent 22%, #000 58%)",
  },
});

const innerCls = css({
  position: "relative",
  zIndex: 1,
  flex: { lg: 1 },
  display: { base: "flex", lg: "grid" },
  flexDirection: "column",
  gridTemplateColumns: { lg: "minmax(0, 1fr) clamp(360px, 36vw, 560px)" },
  alignItems: { lg: "center" },
  gap: { lg: "clamp(24px, 3vw, 56px)" },
  paddingX: { base: "16px", lg: "clamp(24px, 4.5vw, 88px)" },
  paddingTop: { base: "108px", lg: "110px" },
  paddingBottom: { base: "0", lg: "96px" },
});

const copyCls = css({
  maxWidth: { lg: "760px" },
});

/** where the character sits — an empty stage the fixed canvas draws into */
const stageCls = css({
  position: "relative",
  height: { base: "min(58svh, 460px)", lg: "min(78svh, 720px)" },
  width: "100%",
});

const Row = ({ k, children }: { k: string; children: React.ReactNode }) => (
  <div
    className={css({
      display: "grid",
      gridTemplateColumns: "60px 1fr",
      gap: "10px",
      paddingY: "6px",
      borderTop: "1px solid rgba(17,17,17,0.1)",
      _first: { borderTop: "none" },
    })}
  >
    <span className={css({ color: "muted" })}>{k}</span>
    <span>{children}</span>
  </div>
);

const Hero = () => {
  return (
    <section id="top" className={sectionCls}>
      <WarpGrid className={gridCls} />

      <div className={innerCls}>
        <div className={copyCls}>
          <p className={cx(metaCls, css({ color: "muted" }))}>
            {profile.role} — {profile.location}
          </p>
          <h1
            data-cursor-lens
            className={css({
              fontFamily: "sans",
              fontWeight: 650,
              fontSize: { base: "clamp(40px, 11.5vw, 60px)", lg: "clamp(56px, 6.2vw, 108px)" },
              lineHeight: 1.0,
              letterSpacing: "-0.055em",
              marginTop: "20px",
              textWrap: "balance",
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
              marginTop: { base: "20px", lg: "28px" },
              maxWidth: "520px",
              fontSize: { base: "16px", lg: "19px" },
              lineHeight: 1.65,
              color: "#3b3b38",
              whiteSpace: "pre-line",
            })}
          >
            {profile.tagline}
          </p>
          <div className={css({ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: { base: "24px", lg: "34px" } })}>
            <a href={`mailto:${profile.email}`} className={pillCls} data-cursor="pointer" data-cursor-label="Mail ↗">
              메일 보내기 ↗
            </a>
            <a href="#experience" className={pillGhostCls} data-cursor="pointer" data-cursor-label="Go ↓">
              작업 보기 ↓
            </a>
          </div>
        </div>

        <div data-char-anchor="hero" className={stageCls} aria-hidden />
      </div>

      {/* status readout — bottom-right on desktop, under the stage when stacked */}
      <div
        className={css({
          position: { base: "relative", lg: "absolute" },
          right: { lg: "clamp(24px, 4vw, 72px)" },
          bottom: { lg: "54px" },
          zIndex: 1,
          width: { base: "auto", lg: "236px" },
          marginX: { base: "16px", lg: 0 },
        })}
      >
        <Window title="status.log" bodyClassName={css({ padding: "8px 12px 10px", fontFamily: "mono", fontSize: "11px" })}>
          <Row k="ROLE">{profile.role}</Row>
          <Row k="BASE">{profile.location}</Row>
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

      {/* editor-style status bar */}
      <StatusBar />
    </section>
  );
};

export default Hero;
