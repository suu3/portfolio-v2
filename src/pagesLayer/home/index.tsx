"use client";

import BottomToTopText from "@/components/BottomToTopText";
import FullPageSection from "@/components/FullPageSection";
import { css, cx } from "@/styled-system/css";
import { flex } from "@/styled-system/patterns";
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
        onUpdate: () => console.log("Animation update"),
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className={css({ overflow: "hidden" })}>
      <FullPageSection alignCenter className={maxWidthCls}>
        안녕하세요, 프론트엔드 개발자 <BottomToTopText text={"suu3"} />
        입니다.
      </FullPageSection>
      <FullPageSection alignCenter className={maxWidthCls}>
        여기엔 작은 글씨로 자기소개가 들어갑니다
      </FullPageSection>
      <div ref={containerRef} className={horizontalScrollContainerCls}>
        <FullPageSection
          alignCenter
          className={cx(
            horizontalScrollCls,
            css({
              bg: "colorTheme03",
            })
          )}
          ref={(el: HTMLDivElement) => {
            if (el) sectionsRef.current[0] = el;
          }}
        >
          111111111111111111111111111111Skills 부분은 가로스크롤로 진행됩니다.
        </FullPageSection>
        <FullPageSection
          alignCenter
          className={cx(
            horizontalScrollCls,
            css({
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
