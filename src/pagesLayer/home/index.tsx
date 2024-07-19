"use client";

import FullPageSection from "@/components/FullPageSection";
import { css, cx } from "@/styled-system/css";
// import starIcon from "@/assets/images/star.svg";
import gsap, { snap, toArray } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Fragment,
  useEffect,
  useRef,
  RefObject,
  FC,
  MutableRefObject,
} from "react";
import { horizontalScrollCls, horizontalScrollContainerCls } from "./styles";
import { maxWidthCls } from "@/styles/common";
import Skills from "./Skills";
import BigTextSection from "./BigTextSection";

// gsap.registerPlugin(ScrollTrigger);
// gsap.utils.toArray(".panel");

const Home: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionsRef = useRef<HTMLDivElement[] | null[]>([]);

  gsap.registerPlugin(ScrollTrigger);

  useEffect(() => {
    if (!containerRef.current || !sectionsRef.current) return;
    const ctx = gsap.context(() => {
      const horizontalSections = sectionsRef.current; //gsap.utils.toArray(".horizontal-section");

      gsap.to(horizontalSections, {
        xPercent: -100 * (horizontalSections.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          // snap: 1 / (horizontalSections.length - 1),
          end: () => "+=" + containerRef.current?.offsetWidth,
        },
        // onUpdate: () => console.log("Animation update"),
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className={css({ overflow: "hidden" })}>
      <div
        className={css({
          borderBottom: "1px solid black",
        })}
      >
        <FullPageSection
          alignCenter
          className={cx(
            maxWidthCls,
            css({
              fontSize: 36,
              fontWeight: 500,
              position: "relative",
              zIndex: 1,
            })
          )}
        >
          <BigTextSection />
        </FullPageSection>
      </div>
      <FullPageSection alignCenter className={maxWidthCls}>
        여기엔 작은 글씨로 자기소개가 들어갑니다
        <br />
        여기엔 작은 글씨로 자기소개가 들어갑니다
        <br />
        여기엔 작은 글씨로 자기소개가 들어갑니다
        <br />
        여기엔 작은 글씨로 자기소개가 들어갑니다
        <br />
      </FullPageSection>
      <div ref={containerRef} className={horizontalScrollContainerCls}>
        <FullPageSection
          alignCenter
          className={cx(
            horizontalScrollCls,
            css({
              border: "1px solid black",
              bg: "colorTheme03",
            })
          )}
          ref={(el: HTMLDivElement) => {
            if (el) sectionsRef.current[0] = el;
          }}
        >
          <Skills />
        </FullPageSection>
        <FullPageSection
          alignCenter
          className={cx(
            horizontalScrollCls,
            css({
              border: "1px solid black",
              bg: "colorNeutral02",
            })
          )}
          ref={(el: HTMLDivElement) => {
            if (el) sectionsRef.current[1] = el;
          }}
        >
          222222222222222222222222222222Skills 부분은 가로스크롤로 진행됩니다.
        </FullPageSection>
      </div>
      <FullPageSection alignCenter className={maxWidthCls}>
        기타 넣고 싶은것들
      </FullPageSection>
    </main>
  );
};

export default Home;
