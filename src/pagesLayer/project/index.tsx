"use client";

import Link from "next/link";
import { css } from "@/styled-system/css";
import Reveal from "@/components/Reveal";
import { company, projects } from "@/pagesLayer/home/data";
import { GeoSyncDiagram, ProductConfigDiagram } from "@/components/Diagram";
import { INK, ORANGE, PEACH, PAPER, CREAM, prompt, chipCls, brutalBtnCls, eyebrowCls } from "@/pagesLayer/home/ui";

const DIAGRAMS = [
  {
    title: "지역 상태 동기화 — Adapter + Coordinator",
    caption:
      "지도·필터·URL·API가 서로 다른 상태 모델을 쓰던 문제를, 변환을 맡는 Adapter와 동기화를 조율하는 Coordinator로 분리해 해결했습니다. 상태 변경의 출처를 추적해 반복 갱신과 query 덮어쓰기를 막습니다.",
    render: () => <GeoSyncDiagram />,
  },
  {
    title: "제품 확장 — config 외부화 + Strategy/DI",
    caption:
      "제품이 늘 때마다 공통 컴포넌트에 조건문이 쌓이던 구조를, 제품별 차이를 config와 전략 객체로 외부화해 바꿨습니다. 신규 제품은 공통 엔진을 수정하지 않고 spec 추가만으로 지원됩니다.",
    render: () => <ProductConfigDiagram />,
  },
];

const Project = () => {
  return (
    <main className={css({ background: CREAM, minHeight: "100vh", overflowX: "hidden" })}>
      {/* header */}
      <header
        className={css({
          paddingX: { base: "24px", md: "clamp(32px, 6vw, 120px)" },
          paddingTop: { base: "110px", md: "140px" },
          paddingBottom: { base: "48px", md: "72px" },
          maxWidth: "1120px",
          marginX: "auto",
        })}
      >
        <Reveal>
          <Link
            href="/home"
            data-cursor="pointer"
            className={css({
              fontFamily: prompt,
              fontSize: "14px",
              fontWeight: 600,
              color: "#6b6c74",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              transition: "gap .2s ease, color .2s ease",
              _hover: { gap: "12px", color: ORANGE },
            })}
          >
            ← Home
          </Link>
          <h1
            className={css({
              fontFamily: prompt,
              fontWeight: 700,
              fontSize: { base: "clamp(40px, 12vw, 64px)", md: "clamp(64px, 8vw, 100px)" },
              lineHeight: 1,
              letterSpacing: "-0.03em",
              color: INK,
              marginTop: "24px",
            })}
          >
            Projects<span className={css({ color: ORANGE })}>.</span>
          </h1>
          <p className={css({ marginTop: "20px", maxWidth: "640px", fontSize: "17px", lineHeight: 1.6, color: "#54555d" })}>
            {company.name} · {company.role}에서 진행한 주요 프로젝트의 상세 내역입니다.
          </p>
        </Reveal>
      </header>

      {/* full project list */}
      <div
        className={css({
          paddingX: { base: "24px", md: "clamp(32px, 6vw, 120px)" },
          paddingBottom: "120px",
          maxWidth: "1120px",
          marginX: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        })}
      >
        {projects.map((p, i) => (
          <Reveal key={p.title} delay={0.04 * i}>
            <article
              className={css({
                background: PAPER,
                border: "3px solid #000",
                borderRadius: "22px",
                boxShadow: "10px 10px 0 0 #000",
                padding: { base: "28px", md: "44px" },
              })}
            >
              <div className={css({ display: "flex", alignItems: "baseline", gap: "16px", flexWrap: "wrap" })}>
                <span
                  className={css({
                    fontFamily: prompt,
                    fontWeight: 700,
                    fontSize: { base: "36px", md: "52px" },
                    color: PEACH,
                    WebkitTextStroke: `1.5px ${INK}`,
                    lineHeight: 1,
                  })}
                >
                  0{i + 1}
                </span>
                <div>
                  <h2
                    className={css({
                      fontFamily: prompt,
                      fontSize: { base: "24px", md: "34px" },
                      fontWeight: 700,
                      letterSpacing: "-0.01em",
                      color: INK,
                    })}
                  >
                    {p.title}
                  </h2>
                  <p className={css({ fontFamily: prompt, fontSize: "14px", color: "#6b6c74", marginTop: "4px" })}>
                    {p.period} · {p.team}
                  </p>
                </div>
              </div>

              <p className={css({ marginTop: "20px", fontSize: "16px", lineHeight: 1.65, color: "#4a4b53", fontWeight: 500 })}>
                {p.summary}
              </p>

              <ul
                className={css({
                  marginTop: "24px",
                  display: "grid",
                  gridTemplateColumns: { base: "1fr", md: "1fr 1fr" },
                  gap: "14px 32px",
                })}
              >
                {p.highlights.map((h, idx) => (
                  <li
                    key={idx}
                    className={css({
                      position: "relative",
                      paddingLeft: "26px",
                      fontSize: "15px",
                      lineHeight: 1.65,
                      color: "#3a3b43",
                      _before: { content: '"→"', position: "absolute", left: 0, top: 0, color: ORANGE, fontWeight: 700 },
                    })}
                  >
                    {h}
                  </li>
                ))}
              </ul>

              <div className={css({ marginTop: "28px", display: "flex", flexWrap: "wrap", gap: "8px" })}>
                {p.stack.map((s) => (
                  <span key={s} className={chipCls}>
                    {s}
                  </span>
                ))}
              </div>
            </article>
          </Reveal>
        ))}

        {/* architecture — shown as diagrams rather than product screenshots */}
        <Reveal>
          <div className={css({ marginTop: "56px" })}>
            <span className={eyebrowCls}>Architecture</span>
            <h2
              className={css({
                fontFamily: prompt,
                fontWeight: 700,
                fontSize: { base: "34px", md: "56px" },
                lineHeight: 0.95,
                letterSpacing: "-0.035em",
                textTransform: "uppercase",
                color: INK,
                marginTop: "16px",
              })}
            >
              구조 설계
            </h2>
            <p className={css({ marginTop: "16px", maxWidth: "640px", fontSize: "16px", lineHeight: 1.65, color: "#4a4b53" })}>
              제품 화면 대신 설계 의도가 드러나는 구조도로 정리했습니다.
            </p>
          </div>
        </Reveal>

        {DIAGRAMS.map((d, i) => (
          <Reveal key={d.title} delay={0.05 * i}>
            <figure
              className={css({
                background: PAPER,
                border: "3px solid #000",
                borderRadius: "22px",
                boxShadow: "10px 10px 0 0 #000",
                padding: { base: "24px", md: "38px" },
              })}
            >
              <figcaption>
                <h3
                  className={css({
                    fontFamily: prompt,
                    fontSize: { base: "20px", md: "26px" },
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                    color: INK,
                  })}
                >
                  {d.title}
                </h3>
                <p className={css({ marginTop: "8px", fontSize: "15px", lineHeight: 1.6, color: "#54555d" })}>
                  {d.caption}
                </p>
              </figcaption>

              {/* keeps the diagram legible on narrow screens instead of squashing it */}
              <div className={css({ marginTop: "26px", overflowX: "auto" })}>
                <div className={css({ minWidth: "680px" })}>{d.render()}</div>
              </div>
            </figure>
          </Reveal>
        ))}

        <Reveal>
          <div className={css({ textAlign: "center", marginTop: "32px" })}>
            <Link
              href="/home"
              data-cursor="pointer"
              data-cursor-label="Back"
              className={brutalBtnCls}
            >
              ← 홈으로 돌아가기
            </Link>
          </div>
        </Reveal>
      </div>
    </main>
  );
};

export default Project;
