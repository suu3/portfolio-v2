import BottomToTopText from "@/components/BottomToTopText";
import { Canvas } from "@react-three/fiber";
import Grid from "@/components/@three/Grid";
import TorusWireframe, { HtmlComp } from "@/components/@three/TorusWireframe";
import { Sparkles } from "@react-three/drei";
import FadeInText from "@/components/FadeInText";
import { flex } from "@/styled-system/patterns";
import { cx } from "@/styled-system/css";
import { maxWidthCls } from "@/styles/common";

const BigTextSection = () => {
  return (
    <>
      <Canvas
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "200%",
        }}
      >
        <Sparkles size={2} color={"black"} scale={[10, 10, 10]}></Sparkles>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Grid />
        {/* <Particles /> */}
        <TorusWireframe
          secondChildren={
            <HtmlComp>
              <svg
                style={{
                  transform: "scale(2)",
                }}
              >
                <path
                  xmlns="http://www.w3.org/2000/svg"
                  d="m40.898 44.5 1.25 27.324 1.25-27.324 12.375 11.273-11.301-12.375 27.352-1.2266-27.352-1.25 11.301-12.375-12.375 11.273-1.25-27.324-1.25 27.324-12.375-11.273 11.301 12.375-27.324 1.25 27.324 1.2266-11.301 12.375zm29.102 27.523 0.72656 15.477 0.69922-15.477 7 6.375-6.3984-7 15.477-0.69922-15.477-0.69922 6.3984-7-7 6.375-0.69922-15.449-0.72656 15.449-7-6.375 6.3984 7-15.477 0.69922 15.477 0.69922-6.3984 7z"
                  fillRule="evenodd"
                />
              </svg>
            </HtmlComp>
          }
        >
          <HtmlComp>
            <svg>
              <path
                xmlns="http://www.w3.org/2000/svg"
                d="m50.5 78.625c-0.023438 0.25-0.25 0.42578-0.5 0.42578s-0.47656-0.19922-0.5-0.44922c-0.35156-2.1758-0.625-4.375-0.89844-6.625-1.8242-15.199-3.7734-31.375-35.602-33.25l-0.023438-0.023437c-0.27344 0-0.5-0.25-0.47656-0.52344 0.023438-0.27344 0.25-0.47656 0.5-0.47656 16.602 0 25.426-2.0234 30.25-5.0742 4.6992-3.0234 5.5742-7.1016 6.25-11.25 0.023438-0.22656 0.19922-0.39844 0.42578-0.42578 0.27344-0.050781 0.52344 0.14844 0.57422 0.42578 0.67578 4.1484 1.5508 8.2266 6.25 11.25 4.8242 3.0508 13.648 5.0742 30.25 5.0742 0.25 0 0.47656 0.19922 0.5 0.47656 0.023438 0.27344-0.19922 0.52344-0.47656 0.52344-31.852 1.8984-33.801 18.074-35.625 33.273-0.27344 2.25-0.55078 4.4492-0.89844 6.6484zm-1-7.625v-14.375c0-5.125-1.75-9.9492-6.25-12.824-3.6484-2.3242-9.6016-4.0508-19.5-4.75 22 4.5508 24.125 18.523 25.75 31.949zm1-14.375v14.375c1.625-13.426 3.75-27.398 25.75-31.949-9.8984 0.69922-15.852 2.4258-19.5 4.75-4.5 2.875-6.25 7.6992-6.25 12.824z"
              />
            </svg>
          </HtmlComp>
        </TorusWireframe>
      </Canvas>
      <h1
        className={cx(
          maxWidthCls,
          flex({
            direction: "column",
            // alignq: "center",
          })
        )}
      >
        <FadeInText>안녕하세요</FadeInText>
        <FadeInText>
          프론트엔드 개발자 <BottomToTopText text={"suu3"} />
          입니다.
        </FadeInText>
      </h1>
    </>
  );
};

export default BigTextSection;
