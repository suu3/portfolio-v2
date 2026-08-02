"use client";

import { css } from "@/styled-system/css";
import Reveal from "@/components/Reveal";
import ScrambleText from "@/components/ScrambleText";
import Marquee from "@/components/Marquee";
import { skills } from "../data";
import Sparkle from "@/components/Sparkle";
import { INK, ORANGE, LIME, PURPLE, prompt, mono, metaCls, hudCls, sectionCls, innerCls } from "../ui";

const Skills = () => {
  return (
    <section id="skills" className={css({ position: "relative" })}>
      {/* divider ticker */}
      <div
        className={css({
          background: ORANGE,
          color: "#000",
          borderY: "3px solid #000",
          paddingY: "10px",
        })}
      >
        <Marquee
          className={metaCls}
          duration={20}
          reverse
          separator="/"
          items={["SKILLS", "TOOLS", "STACK", "SKILLS", "TOOLS", "STACK"]}
        />
      </div>

      <div className={sectionCls}>
        <div className={innerCls}>
          <div
            className={css({
              position: "relative",
              background: "#000",
              border: "3px solid #000",
              borderRadius: "26px",
              boxShadow: `10px 10px 0 0 ${PURPLE}`,
              padding: { base: "34px 24px", md: "64px" },
              color: "#fff",
              overflow: "hidden",
            })}
          >
            <Sparkle
              size={70}
              color={LIME}
              style={{ position: "absolute", top: 26, right: 28, opacity: 0.9 }}
            />
            <Sparkle
              size={26}
              color={ORANGE}
              style={{ position: "absolute", top: 96, right: 96 }}
            />
            <span
              className={css({
                position: "absolute",
                bottom: "22px",
                right: "28px",
                color: LIME,
                display: { base: "none", md: "block" },
              })}
            >
              <span className={hudCls}>0000000 ✦ STACK / IDX</span>
            </span>
            <Reveal>
              <span
                className={css({
                  fontFamily: mono,
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  background: LIME,
                  color: "#000",
                  padding: "5px 10px",
                  border: "2px solid #000",
                })}
              >
                Skills / 03
              </span>
              <h2
                className={css({
                  fontFamily: prompt,
                  fontWeight: 700,
                  fontSize: { base: "40px", md: "64px" },
                  lineHeight: 0.95,
                  letterSpacing: "-0.035em",
                  textTransform: "uppercase",
                  marginTop: "18px",
                })}
              >
                <ScrambleText text="쓰는 도구들" />
              </h2>
            </Reveal>

            {skills.map((s, gi) => (
              <Reveal key={s.group} delay={0.06 + gi * 0.05}>
                <div className={css({ marginTop: gi === 0 ? "44px" : "38px" })}>
                  <p
                    className={css({
                      fontFamily: mono,
                      fontSize: "11px",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      fontWeight: 700,
                      color: LIME,
                      borderBottom: "2px solid rgba(255,255,255,0.25)",
                      paddingBottom: "10px",
                      marginBottom: "18px",
                    })}
                  >
                    [{gi === 0 ? "PRIMARY" : "EXPERIENCED"}] {s.items.length}
                  </p>
                  <div className={css({ display: "flex", flexWrap: "wrap", gap: "12px" })}>
                    {s.items.map((item) => (
                      <span
                        key={item}
                        className={css({
                          fontFamily: mono,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          fontSize: gi === 0 ? { base: "14px", md: "17px" } : { base: "12px", md: "13px" },
                          padding: gi === 0 ? "12px 18px" : "9px 13px",
                          border: "2px solid #fff",
                          borderRadius: "999px",
                          background: gi === 0 ? LIME : "transparent",
                          color: gi === 0 ? "#000" : "#fff",
                          boxShadow: gi === 0 ? "5px 5px 0 0 #fff" : "none",
                          transition:
                            "transform .1s steps(1), box-shadow .1s steps(1), background .1s steps(1), color .1s steps(1)",
                          _hover: {
                            background: gi === 0 ? "#fff" : LIME,
                            color: "#000",
                            transform: gi === 0 ? "translate(5px, 5px)" : "translate(-3px, -3px)",
                            boxShadow: gi === 0 ? "0 0 0 0 #fff" : `4px 4px 0 0 ${ORANGE}`,
                          },
                        })}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
