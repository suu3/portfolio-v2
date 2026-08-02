"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { css } from "@/styled-system/css";
import { company, projects } from "../data";
import ScrambleText from "@/components/ScrambleText";
import { INK, ORANGE, PEACH, PAPER, LIME, prompt, mono, chipCls } from "../ui";

gsap.registerPlugin(ScrollTrigger);

const Experience = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;
    if (!window.matchMedia("(min-width: 768px)").matches) return; // vertical on mobile

    const ctx = gsap.context(() => {
      const distance = () => track.scrollWidth - window.innerWidth;
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => "+=" + distance(),
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className={css({
        position: "relative",
        background: INK,
        color: "#fff",
        overflow: "hidden",
        paddingY: { base: "72px", md: "0" },
        minHeight: { md: "100vh" },
        display: { md: "flex" },
        alignItems: { md: "center" },
      })}
    >
      <div
        ref={trackRef}
        className={css({
          display: "flex",
          flexDirection: { base: "column", md: "row" },
          alignItems: { md: "center" },
          gap: { base: "20px", md: "28px" },
          paddingX: { base: "24px", md: "clamp(32px, 6vw, 120px)" },
          width: { md: "max-content" },
          willChange: "transform",
        })}
      >
        {/* intro panel */}
        <div
          className={css({
            flexShrink: 0,
            width: { base: "100%", md: "440px" },
          })}
        >
          <span className={css({ ...eyebrowStyle })}>Experience / 02</span>
          <h2
            className={css({
              fontFamily: prompt,
              fontWeight: 700,
              fontSize: { base: "40px", md: "68px" },
              lineHeight: 0.95,
              letterSpacing: "-0.035em",
              textTransform: "uppercase",
              marginTop: "16px",
            })}
          >
            <ScrambleText text="일한 것들" />
          </h2>
          <div
            className={css({
              marginTop: "28px",
              borderTop: "1px solid rgba(255,255,255,0.16)",
              paddingTop: "22px",
            })}
          >
            <h3 className={css({ fontFamily: prompt, fontSize: "22px", fontWeight: 700 })}>{company.name}</h3>
            <p className={css({ marginTop: "6px", color: ORANGE, fontSize: "14px", fontWeight: 600 })}>
              {company.role} · {company.period}
            </p>
            <p className={css({ marginTop: "14px", fontSize: "15px", lineHeight: 1.7, color: "#c3c4cc" })}>
              {company.intro}
            </p>
          </div>
          <p
            className={css({
              marginTop: "28px",
              fontFamily: prompt,
              fontSize: "12px",
              letterSpacing: "0.18em",
              color: "#7d7e86",
              display: { base: "none", md: "block" },
            })}
          >
            SCROLL → 옆으로 넘겨보세요
          </p>
        </div>

        {/* project panels */}
        {projects.map((p, i) => {
          const shown = p.highlights.slice(0, 3);
          const rest = p.highlights.length - shown.length;
          return (
            <article
              key={p.title}
              className={css({
                flexShrink: 0,
                width: { base: "100%", md: "560px" },
                background: PAPER,
                color: INK,
                border: "3px solid #000",
                borderRadius: "22px",
                boxShadow: `10px 10px 0 0 ${ORANGE}`,
                padding: { base: "26px", md: "38px" },
                display: "flex",
                flexDirection: "column",
                transition:
                  "transform .14s cubic-bezier(.2,.9,.2,1), box-shadow .14s cubic-bezier(.2,.9,.2,1)",
                _hover: {
                  transform: "translate(10px, 10px)",
                  boxShadow: "0 0 0 0 #000",
                },
              })}
            >
              <div className={css({ display: "flex", alignItems: "baseline", gap: "12px" })}>
                <span className={css({ fontFamily: prompt, fontWeight: 700, fontSize: "40px", color: PEACH, WebkitTextStroke: `1px ${INK}` })}>
                  0{i + 1}
                </span>
                <span className={css({ fontFamily: prompt, fontSize: "13px", color: "#6b6c74", marginLeft: "auto" })}>
                  {p.period} · {p.team}
                </span>
              </div>

              <h3
                className={css({
                  fontFamily: prompt,
                  fontSize: { base: "22px", md: "28px" },
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                  marginTop: "10px",
                })}
              >
                {p.title}
              </h3>
              <p className={css({ marginTop: "12px", fontSize: "15px", lineHeight: 1.6, color: "#54555d" })}>
                {p.summary}
              </p>

              <ul className={css({ marginTop: "20px", display: "flex", flexDirection: "column", gap: "11px" })}>
                {shown.map((h, idx) => (
                  <li
                    key={idx}
                    className={css({
                      position: "relative",
                      paddingLeft: "24px",
                      fontSize: "14px",
                      lineHeight: 1.6,
                      color: "#3a3b43",
                      _before: { content: '"→"', position: "absolute", left: 0, color: ORANGE, fontWeight: 700 },
                    })}
                  >
                    {h}
                  </li>
                ))}
              </ul>

              <div className={css({ marginTop: "auto", paddingTop: "22px" })}>
                <div className={css({ display: "flex", flexWrap: "wrap", gap: "7px" })}>
                  {p.stack.slice(0, 6).map((s) => (
                    <span key={s} className={chipCls}>
                      {s}
                    </span>
                  ))}
                  {p.stack.length > 6 && (
                    <span className={css({ fontFamily: prompt, fontSize: "12px", color: "#8a8b93", alignSelf: "center" })}>
                      +{p.stack.length - 6}
                    </span>
                  )}
                </div>
                <Link
                  href="/project"
                  data-cursor="pointer"
                  data-cursor-label="View ↗"
                  className={css({
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    marginTop: "20px",
                    fontFamily: prompt,
                    fontWeight: 600,
                    fontSize: "14px",
                    color: INK,
                    borderBottom: `2px solid ${ORANGE}`,
                    paddingBottom: "3px",
                    transition: "gap .2s ease",
                    _hover: { gap: "12px" },
                  })}
                >
                  자세히 보기{rest > 0 ? ` (+${rest})` : ""} →
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

const eyebrowStyle = {
  display: "inline-block",
  fontFamily: mono,
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "0.2em",
  textTransform: "uppercase" as const,
  background: LIME,
  color: "#000",
  border: "2px solid #000",
  padding: "5px 10px",
};

export default Experience;
