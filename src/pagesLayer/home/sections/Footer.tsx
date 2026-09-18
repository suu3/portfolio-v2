"use client";

import { css, cx } from "@/styled-system/css";
import Reveal from "@/components/Reveal";
import Marquee from "@/components/Marquee";
import PixelRabbit from "@/components/PixelRabbit";
import { profile } from "../data";
import { ORANGE, eyebrowCls, metaCls, pillDarkCls } from "../ui";
import { useTranslations } from "next-intl";

const Footer = () => {
  const t = useTranslations();
  return (
    <footer id="contact" className={css({ background: "dark", color: "#ededeb" })}>
      <div className={css({ borderBottom: `1px solid token(colors.darkLine)`, paddingY: "11px", color: "#ededeb" })}>
        <Marquee
          className={metaCls}
          duration={22}
          separator="●"
          items={["get in touch", t("sections.contact"), profile.email, "open to talk"]}
        />
      </div>

      <div
        className={css({
          paddingX: { base: "16px", md: "clamp(28px, 5vw, 88px)" },
          paddingTop: { base: "88px", md: "140px" },
          paddingBottom: "28px",
        })}
      >
        <div className={css({ maxWidth: "1180px", marginX: "auto" })}>
          <Reveal>
            <span className={eyebrowCls}>05 — Contact</span>
            <h2
              data-char-anchor="contact"
              className={css({
                width: "fit-content", // the anchor rect hugs the words, not the row
                fontWeight: 650,
                fontSize: { base: "clamp(48px, 15vw, 72px)", md: "clamp(84px, 10vw, 150px)" },
                lineHeight: 0.95,
                letterSpacing: "-0.06em",
                marginTop: "22px",
              })}
            >
              함께
              <br />
              이야기해요<span className={css({ color: "point" })}>.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.08}>
            <a
              href={`mailto:${profile.email}`}
              data-cursor="pointer"
              data-cursor-label={t("actions.mail")}
              className={css({
                display: "inline-block",
                marginTop: "44px",
                fontFamily: "mono",
                fontSize: { base: "18px", md: "30px" },
                letterSpacing: "-0.02em",
                borderBottom: "1px solid currentColor",
                paddingBottom: "6px",
                transition: "color .1s steps(2)",
                _hover: { color: "point" },
              })}
            >
              {profile.email}
            </a>
          </Reveal>

          <Reveal delay={0.14}>
            <div className={css({ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "36px" })}>
              {[
                { label: "GitHub", href: profile.github },
                { label: "Blog", href: profile.blog },
                { label: "Email", href: `mailto:${profile.email}` },
              ].map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target={l.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  data-cursor="pointer"
                  data-cursor-label={t("actions.open")}
                  className={pillDarkCls}
                >
                  {l.label} ↗
                </a>
              ))}
            </div>
          </Reveal>

          <div
            className={cx(
              metaCls,
              css({
                marginTop: { base: "88px", md: "140px" },
                paddingTop: "18px",
                borderTop: `1px solid token(colors.darkLine)`,
                display: "flex",
                flexDirection: { base: "column", md: "row" },
                justifyContent: "space-between",
                alignItems: { md: "center" },
                gap: "12px",
                color: "darkMuted",
              })
            )}
          >
            <span className={css({ display: "inline-flex", alignItems: "center", gap: "10px" })}>
              <PixelRabbit size={16} color="#ededeb" ink={ORANGE} />© {new Date().getFullYear()} {profile.name} ({profile.handle})
            </span>
            <span>Next.js · PandaCSS · Three.js · Blender</span>
            <a
              href="#top"
              data-cursor="pointer"
              data-cursor-label={t("actions.top")}
              className={css({ fontFamily: "mono", color: "#ededeb", _hover: { color: "point" } })}
            >
              back to top ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
