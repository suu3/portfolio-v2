"use client";

import { css } from "@/styled-system/css";
import Reveal from "@/components/Reveal";
import GlitchText from "@/components/GlitchText";
import Marquee from "@/components/Marquee";
import { profile } from "../data";
import { INK, ORANGE, LIME, prompt, mono, metaCls, brutalBtnDarkCls } from "../ui";

const Footer = () => {
  return (
    <footer id="contact">
      <div
        className={css({
          background: LIME,
          color: "#000",
          borderY: "3px solid #000",
          paddingY: "12px",
        })}
      >
        <Marquee
          className={metaCls}
          duration={18}
          items={["GET IN TOUCH", "OPEN TO WORK", "함께 이야기해요", profile.email.toUpperCase()]}
        />
      </div>

      <div
        className={css({
          background: "#000",
          color: "#fff",
          paddingX: { base: "24px", md: "clamp(32px, 6vw, 120px)" },
          paddingTop: { base: "72px", md: "110px" },
          paddingBottom: "44px",
        })}
      >
        <div className={css({ maxWidth: "1120px", marginX: "auto" })}>
          <Reveal>
            <span
              className={css({
                fontFamily: mono,
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                background: ORANGE,
                color: "#000",
                padding: "5px 10px",
                border: "2px solid #000",
              })}
            >
              Contact / 05
            </span>
            <h2
              className={css({
                fontFamily: prompt,
                fontWeight: 700,
                fontSize: { base: "clamp(42px, 13vw, 64px)", md: "clamp(70px, 9vw, 118px)" },
                lineHeight: 0.9,
                letterSpacing: "-0.04em",
                textTransform: "uppercase",
                marginTop: "22px",
              })}
            >
              함께
              <br />
              <GlitchText className={css({ color: LIME })}>이야기해요</GlitchText>
            </h2>
          </Reveal>

          <Reveal delay={0.08}>
            <a
              href={`mailto:${profile.email}`}
              data-cursor="pointer"
              data-cursor-label="Mail ↗"
              className={css({
                display: "inline-block",
                marginTop: "38px",
                fontFamily: mono,
                fontSize: { base: "18px", md: "30px" },
                fontWeight: 700,
                letterSpacing: "0.02em",
                color: "#fff",
                borderBottom: `4px solid ${ORANGE}`,
                paddingBottom: "6px",
                transition: "color .1s steps(1), border-color .1s steps(1)",
                _hover: { color: LIME, borderColor: LIME },
              })}
            >
              {profile.email}
            </a>
          </Reveal>

          <Reveal delay={0.14}>
            <div className={css({ display: "flex", flexWrap: "wrap", gap: "16px", marginTop: "46px" })}>
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
                  data-cursor-label="Open ↗"
                  className={brutalBtnDarkCls}
                >
                  {l.label} ↗
                </a>
              ))}
            </div>
          </Reveal>

          <div
            className={css({
              marginTop: "76px",
              paddingTop: "22px",
              borderTop: "2px solid rgba(255,255,255,0.2)",
              display: "flex",
              flexDirection: { base: "column", md: "row" },
              justifyContent: "space-between",
              gap: "8px",
              fontFamily: mono,
              fontSize: "11px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#8a8b93",
            })}
          >
            <span>
              © {new Date().getFullYear()} {profile.name} ({profile.handle})
            </span>
            <span>Next.js · PandaCSS · Three.js · Framer Motion</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
