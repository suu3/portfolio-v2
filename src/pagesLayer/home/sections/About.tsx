"use client";

import { css, cx } from "@/styled-system/css";
import Reveal from "@/components/Reveal";
import ScrambleText from "@/components/ScrambleText";
import Sparkle from "@/components/Sparkle";
import { about } from "../data";
import { INK, ORANGE, LIME, MAGENTA, prompt, mono, sectionCls, innerCls, eyebrowCls, sectionTitleCls, halftoneCls } from "../ui";

/* each card slams into a differently-coloured shadow */
const accents = [ORANGE, LIME, MAGENTA];

const About = () => {
  return (
    <section id="about" className={sectionCls}>
      <div className={innerCls}>
        <Reveal>
          <span className={eyebrowCls}>About / 01</span>
          <h2 className={sectionTitleCls}>
            <ScrambleText text="팀과 함께 성장하는 개발자" />
          </h2>
        </Reveal>

        <div
          className={css({
            marginTop: "56px",
            display: "grid",
            gridTemplateColumns: { base: "1fr", md: "repeat(3, 1fr)" },
            gap: "24px",
          })}
        >
          {about.map((item, i) => (
            <Reveal key={item.no} delay={i * 0.08}>
              <article
                style={{ ["--acc" as string]: accents[i % accents.length] }}
                className={css({
                  height: "100%",
                  background: "#fbfbfb",
                  border: "3px solid #000",
                  borderRadius: "20px",
                  boxShadow: "8px 8px 0 0 #000",
                  padding: { base: "26px", md: "30px" },
                  position: "relative",
                  overflow: "hidden",
                  transition:
                    "transform .14s cubic-bezier(.2,.9,.2,1), box-shadow .14s cubic-bezier(.2,.9,.2,1), background .1s steps(1)",
                  _hover: {
                    transform: "translate(8px, 8px)",
                    boxShadow: "0 0 0 0 #000",
                    background: "var(--acc)",
                  },
                })}
              >
                {/* halftone corner patch — riso print texture */}
                <span
                  className={cx(
                    halftoneCls,
                    css({
                      position: "absolute",
                      top: "-14px",
                      right: "-14px",
                      width: "104px",
                      height: "104px",
                      opacity: 0.16,
                      pointerEvents: "none",
                    })
                  )}
                />

                <div
                  className={css({
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: "2px solid #000",
                    paddingBottom: "12px",
                    position: "relative",
                  })}
                >
                  <span
                    className={css({
                      fontFamily: prompt,
                      fontSize: "46px",
                      fontWeight: 700,
                      lineHeight: 1,
                      color: "transparent",
                      WebkitTextStroke: "2px #000",
                    })}
                  >
                    {item.no}
                  </span>
                  <span className={css({ display: "inline-flex", alignItems: "center", gap: "7px" })}>
                    <Sparkle size={15} color="#000" />
                    <span
                      className={css({
                        fontFamily: mono,
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "#000",
                      })}
                    >
                      FIG.{item.no}
                    </span>
                  </span>
                </div>

                <h3
                  className={css({
                    fontFamily: prompt,
                    fontSize: "20px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "-0.01em",
                    color: INK,
                    marginTop: "18px",
                  })}
                >
                  {item.title}
                </h3>
                <p
                  className={css({
                    marginTop: "12px",
                    fontSize: "14.5px",
                    lineHeight: 1.7,
                    color: "#2a2b31",
                  })}
                >
                  {item.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
