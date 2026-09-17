"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { css, cx } from "@/styled-system/css";
import { company, projects } from "../data";
import ScrambleText from "@/components/ScrambleText";
import Window from "@/components/Window";
import StarField from "@/components/StarField";
import { workScroll } from "@/lib/workScroll";
import { chipDarkCls, eyebrowCls, metaCls, sectionTitleCls, textLinkCls } from "../ui";

gsap.registerPlugin(ScrollTrigger);

/** perspective floor grid — the dark "room" the projects sit in */
const floorCls = css({
  position: "absolute",
  left: "-50%",
  right: "-50%",
  bottom: 0,
  height: "95%",
  transform: "perspective(520px) rotateX(68deg)",
  transformOrigin: "50% 100%",
  backgroundImage: `linear-gradient(token(colors.signal) 1px, transparent 1px), linear-gradient(90deg, token(colors.signal) 1px, transparent 1px)`,
  backgroundSize: "64px 64px",
  opacity: 0.7,
  maskImage: "linear-gradient(to top, #000 0%, #000 18%, transparent 62%)",
  pointerEvents: "none",
});

const Experience = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const floorRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

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
          onToggle: (self) => {
            workScroll.active = self.isActive;
          },
          onUpdate: (self) => {
            // the floor rolls under you, the bar fills, and the character runs (see Character)
            workScroll.progress = self.progress;
            if (floorRef.current) floorRef.current.style.backgroundPosition = `${-self.progress * 640}px 0`;
            if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`;
          },
        },
      });
    }, section);

    return () => {
      ctx.revert();
      workScroll.active = false;
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      data-char-anchor="work"
      className={css({
        position: "relative",
        background: "dark",
        color: "#ededeb",
        overflow: "hidden",
        paddingY: { base: "64px", md: "0" },
        // the bottom strip is the floor the character runs along; content sits above it
        paddingBottom: { md: "26vh" },
        minHeight: { md: "100vh" },
        display: { md: "flex" },
        alignItems: { md: "center" },
      })}
    >
      {/* stacked layout: a stage for the character above the intro */}
      <div data-char-anchor="work-m" className={css({ display: { base: "block", md: "none" }, height: "32vh" })} aria-hidden />

      <StarField className={css({ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" })} />
      <div ref={floorRef} className={floorCls} aria-hidden />

      <div
        ref={trackRef}
        className={css({
          position: "relative",
          display: "flex",
          flexDirection: { base: "column", md: "row" },
          alignItems: { md: "center" },
          gap: { base: "14px", md: "24px" },
          paddingX: { base: "16px", md: "clamp(28px, 5vw, 88px)" },
          width: { md: "max-content" },
          willChange: "transform",
        })}
      >
        {/* intro panel */}
        <div className={css({ flexShrink: 0, width: { base: "100%", md: "440px" }, marginBottom: { base: "26px", md: 0 } })}>
          <span className={eyebrowCls}>02 — Work</span>
          <h2 className={sectionTitleCls}>
            <ScrambleText text="일한 것들" />
          </h2>
          <div className={css({ marginTop: "30px", borderTop: `1px solid token(colors.darkLine)`, paddingTop: "22px" })}>
            <h3 className={css({ fontSize: "22px", fontWeight: 650, letterSpacing: "-0.03em" })}>{company.name}</h3>
            <p className={cx(metaCls, css({ marginTop: "8px", color: "point" }))}>
              {company.role} · {company.period}
            </p>
            <p className={css({ marginTop: "14px", fontSize: "15px", lineHeight: 1.75, color: "#b9b9b5" })}>
              {company.intro}
            </p>
          </div>
          <p
            className={cx(
              metaCls,
              css({ marginTop: "30px", color: "darkMuted", display: { base: "none", md: "block" } })
            )}
          >
            scroll → {String(projects.length).padStart(2, "0")} files
          </p>
        </div>

        {/* project windows */}
        {projects.map((p, i) => {
          const shown = p.highlights.slice(0, 3);
          const rest = p.highlights.length - shown.length;
          return (
            <Window
              key={p.title}
              title={`project_${String(i + 1).padStart(2, "0")}.tsx`}
              meta={p.period}
              tone="dark"
              collapsible={false}
              className={css({
                flexShrink: 0,
                width: { base: "100%", md: "520px" },
                minHeight: { md: "480px" },
                transition: "border-color .1s steps(2)",
                _hover: { borderColor: "#6a6a66" },
              })}
              bodyClassName={css({
                display: "flex",
                flexDirection: "column",
                flex: 1,
                padding: { base: "22px 20px 24px", md: "26px 30px 28px" },
              })}
            >
              <div className={css({ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "12px" })}>
                <span className={css({ fontFamily: "mono", fontSize: "44px", lineHeight: 1, letterSpacing: "-0.06em", color: "point" })}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={cx(metaCls, css({ color: "darkMuted" }))}>{p.team}</span>
              </div>

              <h3 className={css({ fontSize: { base: "22px", md: "27px" }, fontWeight: 650, letterSpacing: "-0.035em", marginTop: "22px" })}>
                {p.title}
              </h3>
              <p className={css({ marginTop: "10px", fontSize: "15px", lineHeight: 1.7, color: "#a9a9a5" })}>{p.summary}</p>

              <ul className={css({ marginTop: "22px", display: "flex", flexDirection: "column" })}>
                {shown.map((h, idx) => (
                  <li
                    key={idx}
                    className={css({
                      display: "grid",
                      gridTemplateColumns: "28px 1fr",
                      paddingY: "10px",
                      borderTop: `1px solid token(colors.darkLine)`,
                      fontSize: "14px",
                      lineHeight: 1.65,
                      color: "#d6d6d2",
                    })}
                  >
                    <span className={css({ fontFamily: "mono", fontSize: "11px", color: "darkMuted", paddingTop: "3px" })}>
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    {h}
                  </li>
                ))}
              </ul>

              <div className={css({ marginTop: "auto", paddingTop: "22px" })}>
                <div className={css({ display: "flex", flexWrap: "wrap", gap: "6px" })}>
                  {p.stack.slice(0, 6).map((s) => (
                    <span key={s} className={chipDarkCls}>
                      {s}
                    </span>
                  ))}
                  {p.stack.length > 6 && (
                    <span className={cx(metaCls, css({ color: "darkMuted", alignSelf: "center" }))}>+{p.stack.length - 6}</span>
                  )}
                </div>
                <Link
                  href="/project"
                  data-cursor="pointer"
                  data-cursor-label="View ↗"
                  className={cx(textLinkCls, css({ marginTop: "22px" }))}
                >
                  자세히 보기{rest > 0 ? ` (+${rest})` : ""} →
                </Link>
              </div>
            </Window>
          );
        })}
      </div>

      {/* progress rail */}
      <div
        className={css({
          display: { base: "none", md: "block" },
          position: "absolute",
          left: "clamp(28px, 5vw, 88px)",
          right: "clamp(28px, 5vw, 88px)",
          bottom: "32px",
          height: "1px",
          background: "darkLine",
        })}
      >
        <div ref={barRef} className={css({ height: "100%", background: "point", transformOrigin: "left", transform: "scaleX(0)" })} />
      </div>
    </section>
  );
};

export default Experience;
