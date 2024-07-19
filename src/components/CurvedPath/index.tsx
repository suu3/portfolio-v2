"use client";

import { css } from "@/styled-system/css";
import { useRef, useEffect } from "react";

const CurvedPath: React.FC = () => {
  const path = useRef<SVGPathElement | null>(null);
  let progress = 0;
  let x = 0.5;
  let time = Math.PI / 2;
  let reqId: number | null = null;

  useEffect(() => {
    setPath(progress);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleResize = () => {
    setPath(progress);
  };

  const setPath = (progress: number) => {
    const width = window.innerWidth;
    const controlPointX = width * x;
    const controlPointY = 250 + progress;

    if (path.current) {
      path.current.setAttribute(
        "d",
        `M0 250 Q${controlPointX} ${controlPointY}, ${width} 250`
      );
    }
  };

  const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;

  const manageMouseEnter = () => {
    if (reqId) {
      cancelAnimationFrame(reqId);
      resetAnimation();
    }
  };

  const manageMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { movementY, clientX } = e;
    const pathBound = path.current?.getBoundingClientRect();
    if (pathBound) {
      x = (clientX - pathBound.left) / pathBound.width;
      progress += movementY;
      setPath(progress);
    }
  };

  const manageMouseLeave = () => {
    animateOut();
  };

  const animateOut = () => {
    const newProgress = progress * Math.sin(time);
    progress = lerp(progress, 0, 0.025); // 이전 속도로 변경
    time += 0.2;
    setPath(newProgress);
    if (Math.abs(progress) > 0.75) {
      reqId = requestAnimationFrame(animateOut);
    } else {
      resetAnimation();
    }
  };

  const resetAnimation = () => {
    time = Math.PI / 2;
    progress = 0;
  };

  return (
    <div
      className={css({
        height: "1px",
        marginBottom: "20px",
        width: "100%",
        position: "relative",
      })}
    >
      <div
        onMouseEnter={manageMouseEnter}
        onMouseMove={manageMouseMove}
        onMouseLeave={manageMouseLeave}
        className={css({
          height: "40px",
          width: "100%",
          position: "relative",
          top: "-20px",
          zIndex: 1,
        })}
      ></div>
      <svg
        className={css({
          width: "100%",
          height: "500px",
          position: "absolute",
          top: "-250px",
        })}
      >
        <path
          className={css({
            stroke: "black",
            strokeWidth: "1px",
            fill: "none",
          })}
          ref={path}
        ></path>
      </svg>
    </div>
  );
};

export default CurvedPath;
