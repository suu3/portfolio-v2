"use client";

import Link from "next/link";
import { css, cx } from "@/styled-system/css";
import Reveal from "@/components/Reveal";
import Window from "@/components/Window";
import { company, projects } from "@/pagesLayer/home/data";
import { GeoSyncDiagram, ProductConfigDiagram } from "@/components/Diagram";
import {
  chipCls,
  eyebrowCls,
  metaCls,
  paperGridCls,
  pillGhostCls,
  sectionTitleCls,
} from "@/pagesLayer/home/ui";

const DIAGRAMS = [
  {
    file: "geo-sync.svg",
    title: "지역 상태 동기화 — Adapter + Coordinator",
    caption:
      "지도·필터·URL·API가 서로 다른 상태 모델을 쓰던 문제를, 변환을 맡는 Adapter와 동기화를 조율하는 Coordinator로 분리해 해결했습니다. 상태 변경의 출처를 추적해 반복 갱신과 query 덮어쓰기를 막습니다.",
    render: () => <GeoSyncDiagram />,
  },
  {
    file: "product-config.svg",
    title: "제품 확장 — config 외부화 + Strategy/DI",
    caption:
      "제품이 늘 때마다 공통 컴포넌트에 조건문이 쌓이던 구조를, 제품별 차이를 config와 전략 객체로 외부화해 바꿨습니다. 신규 제품은 공통 엔진을 수정하지 않고 spec 추가만으로 지원됩니다.",
    render: () => <ProductConfigDiagram />,
  },
];

const padX = { base: "16px", md: "clamp(28px, 5vw, 88px)" };

const Project = () => {
  return (
    <main className={cx(paperGridCls, css({ backgroundColor: "paper", color: "ink", minHeight: "100vh", overflowX: "hidden" }))}>
      <header
        className={css({
          paddingX: padX,
          paddingTop: { base: "112px", md: "150px" },
          paddingBottom: { base: "44px", md: "64px" },
          maxWidth: "1180px",
          boxSizing: "content-box",
          marginX: "auto",
        })}
      >
        <Reveal>
          <span className={eyebrowCls}>Projects — {String(projects.length).padStart(2, "0")} files</span>
          <h1 className={sectionTitleCls}>
            Projects<span className={css({ color: "point" })}>.</span>
          </h1>
          <p className={css({ marginTop: "18px", maxWidth: "620px", fontSize: "16px", lineHeight: 1.7, color: "#3b3b38" })}>
            {company.name} · {company.role}에서 진행한 주요 프로젝트의 상세 내역입니다.
          </p>
        </Reveal>
      </header>

      <div
        className={css({
          paddingX: padX,
          paddingBottom: "120px",
          maxWidth: "1180px",
          boxSizing: "content-box",
          marginX: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        })}
      >
        {projects.map((p, i) => (
          <Reveal key={p.title} delay={0.04 * i}>
            <Window
              title={`project_${String(i + 1).padStart(2, "0")}.tsx`}
              meta={p.period}
              bodyClassName={css({ padding: { base: "24px 18px 26px", md: "36px 40px 40px" } })}
            >
              <div className={css({ display: "flex", alignItems: "flex-start", gap: { base: "16px", md: "28px" }, flexWrap: "wrap" })}>
                <span className={css({ fontFamily: "mono", fontSize: { base: "40px", md: "56px" }, lineHeight: 0.9, letterSpacing: "-0.06em", color: "point" })}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2 className={css({ fontSize: { base: "24px", md: "34px" }, fontWeight: 650, letterSpacing: "-0.04em", lineHeight: 1.15 })}>
                    {p.title}
                  </h2>
                  <p className={cx(metaCls, css({ color: "muted", marginTop: "8px" }))}>
                    {p.period} · {p.team}
                  </p>
                </div>
              </div>

              <p className={css({ marginTop: "22px", fontSize: "16px", lineHeight: 1.7, color: "#2b2b29", fontWeight: 500 })}>{p.summary}</p>

              <ul
                className={css({
                  marginTop: "22px",
                  display: "grid",
                  gridTemplateColumns: { base: "1fr", md: "1fr 1fr" },
                  columnGap: "32px",
                })}
              >
                {p.highlights.map((h, idx) => (
                  <li
                    key={idx}
                    className={css({
                      display: "grid",
                      gridTemplateColumns: "30px 1fr",
                      paddingY: "11px",
                      borderTop: `1px solid token(colors.hair)`,
                      fontSize: "15px",
                      lineHeight: 1.65,
                      color: "#2b2b29",
                    })}
                  >
                    <span className={css({ fontFamily: "mono", fontSize: "11px", color: "muted", paddingTop: "4px" })}>
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    {h}
                  </li>
                ))}
              </ul>

              <div className={css({ marginTop: "24px", display: "flex", flexWrap: "wrap", gap: "6px" })}>
                {p.stack.map((s) => (
                  <span key={s} className={chipCls}>
                    {s}
                  </span>
                ))}
              </div>
            </Window>
          </Reveal>
        ))}

        {/* architecture — shown as diagrams rather than product screenshots */}
        <Reveal>
          <div className={css({ marginTop: "72px" })}>
            <span className={eyebrowCls}>Architecture</span>
            <h2 className={sectionTitleCls}>구조 설계</h2>
            <p className={css({ marginTop: "16px", maxWidth: "620px", fontSize: "16px", lineHeight: 1.7, color: "#3b3b38" })}>
              제품 화면 대신 설계 의도가 드러나는 구조도로 정리했습니다.
            </p>
          </div>
        </Reveal>

        {DIAGRAMS.map((d, i) => (
          <Reveal key={d.title} delay={0.05 * i}>
            <Window title={d.file} meta="figure" bodyClassName={css({ padding: { base: "22px 18px", md: "32px 36px" } })}>
              <figure>
                <figcaption>
                  <h3 className={css({ fontSize: { base: "20px", md: "25px" }, fontWeight: 650, letterSpacing: "-0.03em" })}>{d.title}</h3>
                  <p className={css({ marginTop: "8px", fontSize: "15px", lineHeight: 1.7, color: "#3b3b38" })}>{d.caption}</p>
                </figcaption>

                {/* keeps the diagram legible on narrow screens instead of squashing it */}
                <div className={css({ marginTop: "26px", overflowX: "auto" })}>
                  <div className={css({ minWidth: "680px" })}>{d.render()}</div>
                </div>
              </figure>
            </Window>
          </Reveal>
        ))}

        <Reveal>
          <div className={css({ textAlign: "center", marginTop: "40px" })}>
            <Link href="/home" data-cursor="pointer" data-cursor-label="Back" className={pillGhostCls}>
              ← 홈으로 돌아가기
            </Link>
          </div>
        </Reveal>
      </div>
    </main>
  );
};

export default Project;
