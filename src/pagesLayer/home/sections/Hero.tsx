"use client";

import { css } from "@/styled-system/css";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import GlitchText from "@/components/GlitchText";
import Marquee from "@/components/Marquee";
import Sparkle from "@/components/Sparkle";
import { profile } from "../data";
import {
  INK,
  ORANGE,
  LIME,
  PURPLE,
  prompt,
  mono,
  metaCls,
  hudCls,
  checkerCls,
  scaleBarCls,
  brutalBtnCls,
} from "../ui";

const HeroCanvas = dynamic(() => import("@/components/@three/HeroCanvas"), {
  ssr: false,
});

const rise = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.12 * i, ease: [0.2, 0.9, 0.2, 1] as const },
  }),
};

const Hero = () => {
  return (
    <section
      className={css({
        minHeight: { base: "auto", md: "100vh" },
        display: "flex",
        flexDirection: "column",
        paddingTop: { base: "110px", md: "0" },
        position: "relative",
        overflow: "hidden",
        borderBottom: "3px solid #000",
      })}
    >
      {/* 3D space */}
      <div className={css({ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" })}>
        <HeroCanvas />
      </div>

      {/* poster decor: sparkles + HUD readouts */}
      <div className={css({ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" })}>
        <Sparkle size={62} color={ORANGE} style={{ position: "absolute", top: "16%", right: "8%" }} />
        <Sparkle size={26} color={PURPLE} style={{ position: "absolute", top: "30%", right: "20%" }} />
        <Sparkle size={34} color={LIME} style={{ position: "absolute", bottom: "26%", right: "13%" }} />
        <Sparkle size={18} color={INK} style={{ position: "absolute", top: "24%", left: "6%" }} />

        <span
          className={css({
            position: "absolute",
            top: "120px",
            right: "clamp(24px, 6vw, 120px)",
            display: { base: "none", md: "block" },
          })}
        >
          <span className={hudCls}>0000000 / PORTFOLIO / 2026</span>
        </span>

        <span
          className={css({
            position: "absolute",
            bottom: "150px",
            left: "clamp(24px, 6vw, 120px)",
            display: { base: "none", md: "block" },
          })}
        >
          <span className={hudCls}>FE—001 ✦ SEOUL / KR ✦ AVAILABLE</span>
        </span>
      </div>

      <div
        className={css({
          paddingX: { base: "24px", md: "clamp(32px, 6vw, 120px)" },
          paddingBottom: { base: "64px", md: "88px" },
          maxWidth: "1120px",
          marginX: "auto",
          marginY: "auto", // centre the copy, letting the ticker sit flush at the bottom
          width: "100%",
          position: "relative",
          zIndex: 1,
        })}
      >
        <motion.div
          custom={0}
          variants={rise}
          initial="hidden"
          animate="show"
          className={css({ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px" })}
        >
          <span
            className={css({
              fontFamily: mono,
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              background: "#000",
              color: LIME,
              padding: "6px 11px",
              border: "2px solid #000",
            })}
          >
            {profile.role}
          </span>
          <span
            className={css({
              fontFamily: mono,
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              background: ORANGE,
              color: "#000",
              padding: "6px 11px",
              border: "2px solid #000",
            })}
          >
            {profile.location}
          </span>
          <span className={css({ width: "90px" })}>
            <span className={css({ display: "block" })}>
              <span className={scaleBarCls} style={{ display: "block" }} />
            </span>
          </span>
        </motion.div>

        <motion.h1
          custom={1}
          variants={rise}
          initial="hidden"
          animate="show"
          className={css({
            fontFamily: prompt,
            fontWeight: 700,
            fontSize: { base: "clamp(38px, 11vw, 58px)", md: "clamp(62px, 7.6vw, 108px)" },
            lineHeight: 1.02,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
            color: INK,
            marginTop: "30px",
            textWrap: "balance",
          })}
        >
          안녕하세요,
          <br />
          <span className={css({ fontSize: "0.66em", letterSpacing: "-0.01em" })}>
            프론트엔드 개발자
          </span>
          <br />
          <span className={css({ display: "inline-flex", alignItems: "center", gap: "12px" })}>
            <GlitchText live className={css({ color: ORANGE, WebkitTextStroke: "2px #000" })}>
              SUU3
            </GlitchText>
            <Sparkle size={38} color={LIME} />
          </span>
        </motion.h1>

        <motion.p
          custom={2}
          variants={rise}
          initial="hidden"
          animate="show"
          className={css({
            marginTop: "30px",
            maxWidth: "620px",
            fontSize: { base: "17px", md: "20px" },
            lineHeight: 1.6,
            color: "#2a2b31",
            whiteSpace: "pre-line",
            borderLeft: "4px solid #000",
            paddingLeft: "18px",
          })}
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          custom={3}
          variants={rise}
          initial="hidden"
          animate="show"
          className={css({ display: "flex", flexWrap: "wrap", gap: "14px", marginTop: "44px" })}
        >
          <a
            href={`mailto:${profile.email}`}
            data-cursor="pointer"
            data-cursor-label="Mail ↗"
            className={brutalBtnCls}
          >
            {profile.email}
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            data-cursor="pointer"
            data-cursor-label="Open ↗"
            className={brutalBtnCls}
          >
            GitHub
          </a>
          <a
            href={profile.blog}
            target="_blank"
            rel="noreferrer"
            data-cursor="pointer"
            data-cursor-label="Open ↗"
            className={brutalBtnCls}
          >
            Blog
          </a>
        </motion.div>
      </div>

      {/* checkerboard rule + ticker band */}
      <div className={css({ position: "relative", zIndex: 1 })}>
        <div className={checkerCls} style={{ height: 14 }} />
        <div
          className={css({
            background: "#000",
            color: LIME,
            borderTop: "3px solid #000",
            paddingY: "12px",
          })}
        >
          <Marquee
            className={metaCls}
            duration={26}
            items={[
              "FRONTEND DEVELOPER",
              "SCALABLE ARCHITECTURE",
              "INTERACTIVE WEB",
              "NEXT.JS / REACT / TYPESCRIPT",
              "THREE.JS",
              "SINCE 2022",
            ]}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
