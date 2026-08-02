import React, { ReactNode, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FadeInText = ({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) => {
  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current) {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 90%", // 시작 위치
            end: "bottom 30%", // 종료 위치
            toggleActions: "play reverse play reverse", // 반복 트리거 설정
          },
        }
      );
    }
  }, []);

  return (
    <div
      style={{ display: "flex", alignItems: "center" }} // 스타일을 사용하여 flex 정렬
      ref={textRef}
    >
      {children}
    </div>
  );
};

export default FadeInText;
