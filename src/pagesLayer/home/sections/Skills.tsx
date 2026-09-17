"use client";

import { css, cx } from "@/styled-system/css";
import Reveal from "@/components/Reveal";
import ScrambleText from "@/components/ScrambleText";
import Marquee from "@/components/Marquee";
import Window from "@/components/Window";
import { skills } from "../data";
import { eyebrowCls, innerCls, metaCls, sectionCls, sectionTitleCls } from "../ui";

const promptCls = css({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "baseline",
  gap: "0 10px",
  fontFamily: "mono",
  fontSize: { base: "12px", md: "13px" },
  color: "#ededeb",
  "& .sig": { color: "point" },
  "& .dim": { color: "darkMuted" },
});

const Skills = () => {
  return (
    <section id="skills" className={css({ position: "relative", background: "paper", color: "ink" })}>
      {/* divider ticker */}
      <div className={css({ borderY: `1px solid token(colors.ink)`, paddingY: "10px" })}>
        <Marquee
          className={metaCls}
          duration={28}
          reverse
          separator="/"
          items={["stack", "tools", "things i reach for", "stack", "tools", "things i reach for"]}
        />
      </div>

      <div className={sectionCls}>
        <div className={innerCls}>
          <Reveal>
            <div
              className={css({
                display: "flex",
                flexDirection: { base: "column", md: "row" },
                justifyContent: "space-between",
                alignItems: { md: "flex-end" },
                gap: "18px",
              })}
            >
              <div>
                <span className={eyebrowCls}>03 — Stack</span>
                <h2 className={sectionTitleCls}>
                  <ScrambleText text="쓰는 도구들" />
                </h2>
              </div>
              <p className={cx(metaCls, css({ color: "muted" }))}>
                {skills.reduce((n, s) => n + s.items.length, 0)} packages
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.06} className={css({ marginTop: { base: "40px", md: "60px" } })}>
            <Window
              title="~/stack — zsh"
              meta="80×24"
              tone="dark"
              data-char-anchor="stack"
              bodyClassName={css({ padding: { base: "22px 18px 26px", md: "34px 36px 38px" } })}
            >
              {skills.map((s, gi) => (
                <div key={s.group} className={css({ marginTop: gi === 0 ? 0 : "34px" })}>
                  <p className={promptCls}>
                    <span className="sig">→</span>
                    <span>stack</span>
                    <span className="dim">--{gi === 0 ? "primary" : "experienced"}</span>
                    <span className="dim"># {s.group}</span>
                  </p>
                  <div
                    className={css({
                      display: "flex",
                      flexWrap: "wrap",
                      gap: gi === 0 ? "8px" : "6px",
                      marginTop: "16px",
                    })}
                  >
                    {s.items.map((item) => (
                      <span
                        key={item}
                        className={css({
                          fontFamily: "mono",
                          fontSize: gi === 0 ? { base: "14px", md: "17px" } : "12px",
                          lineHeight: 1,
                          letterSpacing: "0.01em",
                          padding: gi === 0 ? { base: "11px 15px", md: "13px 18px" } : "8px 11px",
                          borderRadius: "999px",
                          border: gi === 0 ? "1px solid #ededeb" : `1px solid token(colors.darkLine)`,
                          background: gi === 0 ? "#ededeb" : "transparent",
                          color: gi === 0 ? "ink" : "#cfcfcb",
                          transition: "background .1s steps(2), color .1s steps(2), border-color .1s steps(2)",
                          _hover: { background: "point", borderColor: "point", color: "ink" },
                        })}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}

              <p className={cx(promptCls, css({ marginTop: "34px" }))}>
                <span className="sig">→</span>
                <span
                  className={css({
                    display: "inline-block",
                    width: "8px",
                    height: "15px",
                    background: "#ededeb",
                    animation: "blink 1s steps(2) infinite",
                    alignSelf: "center",
                  })}
                />
              </p>
            </Window>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Skills;
