"use client";

import { css, cx } from "@/styled-system/css";
import Reveal from "@/components/Reveal";
import ScrambleText from "@/components/ScrambleText";
import Window from "@/components/Window";
import { sideProjects, certs, languages, awards, education, oss } from "../data";
import { eyebrowCls, innerCls, metaCls, paperGridCls, sectionCls, sectionTitleCls } from "../ui";
import { useTranslations } from "next-intl";

type Entry = { name: string; kind: string; date: string; note?: string };

const archive: Entry[] = [
  ...certs.map((c) => ({ name: c.title, kind: "Certificate", date: c.year, note: c.sub })),
  ...languages.map((l) => ({ name: l.title, kind: "Language", date: l.year, note: l.sub })),
  ...awards.map((a) => ({ name: a.title, kind: "Award", date: a.year })),
  ...oss.map((o) => ({ name: o.org, kind: "Open source", date: o.year, note: o.desc })),
  { name: education.school, kind: "Education", date: education.period, note: education.detail },
];

const colsCls = css({
  gridTemplateColumns: { base: "1fr auto", md: "minmax(0, 2.2fr) 130px 110px minmax(0, 1.6fr)" },
  gap: { base: "4px 12px", md: "18px" },
  alignItems: "baseline",
  paddingX: { base: "14px", md: "18px" },
});

const Beyond = () => {
  const t = useTranslations();
  return (
    <section id="beyond" className={cx(sectionCls, paperGridCls, css({ backgroundColor: "paper", color: "ink" }))}>
      <div className={innerCls}>
        <Reveal>
          <span className={eyebrowCls}>04 — Archive</span>
          <h2 className={sectionTitleCls}>
            <ScrambleText text={t("sections.beyond")} />
          </h2>
        </Reveal>

        {/* side projects — the character sits on the top edge of this row, right end */}
        <div
          data-char-anchor="archive"
          className={css({
            marginTop: { base: "40px", md: "60px" },
            display: "grid",
            gridTemplateColumns: { base: "1fr", md: "repeat(3, 1fr)" },
            gap: { base: "14px", md: "18px" },
          })}
        >
          {sideProjects.map((sp, i) => (
            <Reveal key={sp.title} delay={i * 0.08} className={css({ height: "100%" })}>
              <Window
                title={`side_${String(i + 1).padStart(2, "0")}/`}
                meta={sp.year}
                collapsible={false}
                className={css({ height: "100%" })}
                bodyClassName={css({ padding: "22px 22px 26px" })}
              >
                <h3 className={css({ fontSize: "18px", fontWeight: 650, letterSpacing: "-0.03em" })}>{sp.title}</h3>
                <p className={css({ marginTop: "10px", fontSize: "14px", lineHeight: 1.7, color: "#3b3b38" })}>{sp.body}</p>
              </Window>
            </Reveal>
          ))}
        </div>

        {/* finder list view */}
        <Reveal delay={0.08}>
          <Window
            title="archive/"
            meta={`${archive.length} items`}
            className={css({ marginTop: { base: "14px", md: "18px" } })}
          >
            <div
              className={cx(
                colsCls,
                metaCls,
                css({
                  display: { base: "none", md: "grid" },
                  paddingY: "9px",
                  color: "muted",
                  borderBottom: `1px solid token(colors.hair)`,
                })
              )}
            >
              <span>Name</span>
              <span>Kind</span>
              <span>Date</span>
              <span>Note</span>
            </div>
            <ul>
              {archive.map((e, i) => (
                <li
                  key={`${e.kind}-${e.name}-${i}`}
                  className={cx(
                    colsCls,
                    css({
                      display: "grid",
                      paddingY: "11px",
                      borderTop: `1px solid token(colors.hair)`,
                      _first: { borderTop: "none" },
                      fontSize: "14px",
                      transition: "background .08s steps(2), color .08s steps(2)",
                      _hover: { background: "ink", color: "#fff", "& .dim": { color: "#a9a9a5" }, "& .dot": { background: "point" } },
                    })
                  )}
                >
                  <span className={css({ display: "flex", alignItems: "center", gap: "10px", fontWeight: 550, minWidth: 0 })}>
                    <i className={cx("dot", css({ flexShrink: 0, width: "6px", height: "6px", background: "ink", borderRadius: "999px" }))} />
                    {e.name}
                  </span>
                  <span className={cx("dim", css({ fontFamily: "mono", fontSize: "11.5px", color: "muted", display: { base: "none", md: "block" } }))}>
                    {e.kind}
                  </span>
                  <span className={cx("dim", css({ fontFamily: "mono", fontSize: "11.5px", color: "muted", whiteSpace: "nowrap" }))}>
                    {e.date}
                  </span>
                  <span
                    className={cx(
                      "dim",
                      css({
                        gridColumn: { base: "1 / -1", md: "auto" },
                        fontSize: "13px",
                        color: "muted",
                        paddingLeft: { base: "16px", md: 0 },
                      })
                    )}
                  >
                    <span className={css({ display: { md: "none" }, fontFamily: "mono", fontSize: "11px" })}>{e.kind} · </span>
                    {e.note ?? "—"}
                  </span>
                </li>
              ))}
            </ul>
          </Window>
        </Reveal>
      </div>
    </section>
  );
};

export default Beyond;
