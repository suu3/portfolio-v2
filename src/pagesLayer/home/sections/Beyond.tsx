"use client";

import { css } from "@/styled-system/css";
import Reveal from "@/components/Reveal";
import ScrambleText from "@/components/ScrambleText";
import { sideProjects, certs, languages, awards, education } from "../data";
import { INK, ORANGE, PAPER, PEACH, prompt, sectionCls, innerCls, eyebrowCls, sectionTitleCls } from "../ui";

const Beyond = () => {
  return (
    <section id="beyond" className={sectionCls}>
      <div className={innerCls}>
        <Reveal>
          <span className={eyebrowCls}>Beyond / 04</span>
          <h2 className={sectionTitleCls}>
            <ScrambleText text="그 밖의 것들" />
          </h2>
        </Reveal>

        {/* side projects */}
        <div
          className={css({
            marginTop: "48px",
            display: "grid",
            gridTemplateColumns: { base: "1fr", md: "repeat(3, 1fr)" },
            gap: "20px",
          })}
        >
          {sideProjects.map((sp, i) => (
            <Reveal key={sp.title} delay={i * 0.08}>
              <article
                className={css({
                  height: "100%",
                  background: PEACH,
                  border: "3px solid #000",
                  borderRadius: "20px",
                  boxShadow: "8px 8px 0 0 #000",
                  padding: "26px",
                  transition:
                    "transform .14s cubic-bezier(.2,.9,.2,1), box-shadow .14s cubic-bezier(.2,.9,.2,1)",
                  _hover: {
                    transform: "translate(8px, 8px)",
                    boxShadow: "0 0 0 0 #000",
                  },
                })}
              >
                <span className={css({ fontFamily: prompt, fontWeight: 700, color: ORANGE, fontSize: "15px" })}>
                  {sp.year}
                </span>
                <h3 className={css({ fontFamily: prompt, fontSize: "18px", fontWeight: 700, color: INK, marginTop: "10px" })}>
                  {sp.title}
                </h3>
                <p className={css({ marginTop: "10px", fontSize: "14px", lineHeight: 1.65, color: "#54453d" })}>
                  {sp.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        {/* three-column: OSS / awards / education */}
        <div
          className={css({
            marginTop: "20px",
            display: "grid",
            gridTemplateColumns: { base: "1fr", md: "repeat(2, 1fr)" },
            gap: "20px",
          })}
        >
          <Reveal>
            <Panel title="Certificate">
              {certs.map((c) => (
                <Row key={c.title} left={c.title} right={c.year} sub={c.sub} />
              ))}
            </Panel>
          </Reveal>
          <Reveal delay={0.06}>
            <Panel title="Language">
              {languages.map((l) => (
                <Row key={l.title} left={l.title} right={l.year} sub={l.sub} />
              ))}
            </Panel>
          </Reveal>
          <Reveal delay={0.12}>
            <Panel title="Awards">
              {awards.map((a) => (
                <Row key={a.title} left={a.title} right={a.year} />
              ))}
            </Panel>
          </Reveal>
          <Reveal delay={0.18}>
            <Panel title="Education">
              <Row left={education.school} right={education.period} sub={education.detail} />
            </Panel>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

const Panel = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div
    className={css({
      height: "100%",
      background: PAPER,
      border: "3px solid #000",
      borderRadius: "20px",
      boxShadow: "8px 8px 0 0 #000",
      padding: "26px",
    })}
  >
    <h3
      className={css({
        fontFamily: prompt,
        fontSize: "13px",
        fontWeight: 600,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: ORANGE,
        marginBottom: "18px",
      })}
    >
      {title}
    </h3>
    <div className={css({ display: "flex", flexDirection: "column", gap: "16px" })}>{children}</div>
  </div>
);

const Row = ({ left, right, sub }: { left: string; right: string; sub?: string }) => (
  <div className={css({ borderTop: `1px solid #e6e2dd`, paddingTop: "14px", _first: { borderTop: "none", paddingTop: 0 } })}>
    <div className={css({ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "baseline" })}>
      <span className={css({ fontSize: "14.5px", fontWeight: 600, color: INK, lineHeight: 1.4 })}>{left}</span>
      <span className={css({ fontFamily: prompt, fontSize: "12.5px", color: "#8a8b93", whiteSpace: "nowrap" })}>{right}</span>
    </div>
    {sub && <p className={css({ marginTop: "6px", fontSize: "13px", lineHeight: 1.55, color: "#6b6c74" })}>{sub}</p>}
  </div>
);

export default Beyond;
