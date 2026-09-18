"use client";

import { Link } from "@/i18n/routing";
import { css, cx } from "@/styled-system/css";
import Reveal from "@/components/Reveal";
import Window from "@/components/Window";
import { company, projects } from "@/pagesLayer/home/data";
import { GeoSyncDiagram, ProductConfigDiagram } from "@/components/Diagram";
import { useTranslations } from "next-intl";
import {
  chipCls,
  eyebrowCls,
  metaCls,
  paperGridCls,
  pillGhostCls,
  sectionTitleCls,
} from "@/pagesLayer/home/ui";

/** The case studies. Titles and captions come from the message file, so this
 *  takes the translator rather than reading it at module scope. */
const diagrams = (t: (key: string) => string) => [
  {
    file: "geo-sync.svg",
    title: t("project.case1Title"),
    caption: t("project.case1Body"),
    render: () => <GeoSyncDiagram />,
  },
  {
    file: "product-config.svg",
    title: t("project.case2Title"),
    caption: t("project.case2Body"),
    render: () => <ProductConfigDiagram />,
  },
];

const padX = { base: "16px", md: "clamp(28px, 5vw, 88px)" };

const Project = () => {
  const t = useTranslations();
  const DIAGRAMS = diagrams(t);
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
            <Link href="/home" data-cursor="pointer" data-cursor-label={t("actions.back")} className={pillGhostCls}>
              ← 홈으로 돌아가기
            </Link>
          </div>
        </Reveal>
      </div>
    </main>
  );
};

export default Project;
