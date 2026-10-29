"use client";

import { css } from "@/styled-system/css";
import { useRef, useEffect, useCallback } from "react";

const CurvedPath: React.FC = () => {
  const path = useRef<SVGPathElement | null>(null);
  const progress = useRef(0);
  const x = useRef(0.5);
  const time = useRef(Math.PI / 2);
  const reqId = useRef<number | null>(null);

  const setPath = useCallback((offset: number) => {
    const width = window.innerWidth;
    const controlPointX = width * x.current;
    const controlPointY = 250 + offset;

    if (path.current) {
      path.current.setAttribute(
        "d",
        `M0 250 Q${controlPointX} ${controlPointY}, ${width} 250`
      );
    }
  }, []);

  useEffect(() => {
    const handleResize = () => setPath(progress.current);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (reqId.current !== null) cancelAnimationFrame(reqId.current);
    };
  }, [setPath]);

  const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;

  const manageMouseEnter = () => {
    if (reqId.current !== null) {
      cancelAnimationFrame(reqId.current);
      reqId.current = null;
      resetAnimation();
    }
  };

  const manageMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { movementY, clientX } = e;
    const pathBound = path.current?.getBoundingClientRect();
    if (pathBound) {
      x.current = (clientX - pathBound.left) / pathBound.width;
      progress.current += movementY;
      setPath(progress.current);
    }
  };

  const manageMouseLeave = () => {
    animateOut();
  };

  const animateOut = () => {
    const newProgress = progress.current * Math.sin(time.current);
    progress.current = lerp(progress.current, 0, 0.025); // 이전 속도로 변경
    time.current += 0.2;
    setPath(newProgress);
    if (Math.abs(progress.current) > 0.75) {
      reqId.current = requestAnimationFrame(animateOut);
    } else {
      resetAnimation();
    }
  };

  const resetAnimation = () => {
    time.current = Math.PI / 2;
    progress.current = 0;
    reqId.current = null;
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
