"use client";

import { css, cx } from "@/styled-system/css";
import Reveal from "@/components/Reveal";
import ScrambleText from "@/components/ScrambleText";
import Window from "@/components/Window";
import { about } from "../data";
import { eyebrowCls, innerCls, metaCls, paperGridCls, sectionCls, sectionTitleCls } from "../ui";
import { useTranslations } from "next-intl";

const About = () => {
  const t = useTranslations();
  return (
    <section id="about" className={cx(sectionCls, paperGridCls, css({ backgroundColor: "paper", color: "ink" }))}>
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
              <span className={eyebrowCls}>01 — About</span>
              <h2 className={sectionTitleCls}>
                <ScrambleText text={t("sections.about")} />
              </h2>
            </div>
            <p className={cx(metaCls, css({ color: "muted", whiteSpace: "nowrap" }))}>
              README.md · {String(about.length).padStart(2, "0")} items
            </p>
          </div>
        </Reveal>

        <div
          className={css({
            marginTop: { base: "40px", md: "64px" },
            display: "grid",
            gridTemplateColumns: { base: "1fr", md: "repeat(3, 1fr)" },
            gap: { base: "14px", md: "18px" },
            alignItems: "start",
          })}
        >
          {about.map((item, i) => (
            <Reveal key={item.no} delay={i * 0.08}>
              <Window
                title={`principle_${item.no}.md`}
                meta={`${item.body.length} ch`}
                className={css({
                  // stagger the row slightly, like windows left open on a desk
                  marginTop: { md: i === 1 ? "36px" : i === 2 ? "12px" : 0 },
                  transition: "transform .14s steps(3)",
                  _hover: { transform: "translateY(-4px)" },
                })}
                bodyClassName={css({ padding: { base: "22px 20px 24px", md: "26px 24px 30px" } })}
              >
                <span
                  className={css({
                    display: "block",
                    fontFamily: "mono",
                    fontSize: "48px",
                    lineHeight: 1,
                    letterSpacing: "-0.06em",
                    color: i === 0 ? "point" : "ink",
                  })}
                >
                  {item.no}
                </span>
                <h3
                  className={css({
                    fontSize: "21px",
                    fontWeight: 650,
                    letterSpacing: "-0.03em",
                    marginTop: "26px",
                  })}
                >
                  {item.title}
                </h3>
                <p className={css({ marginTop: "12px", fontSize: "14.5px", lineHeight: 1.75, color: "#3b3b38" })}>
                  {item.body}
                </p>
              </Window>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
