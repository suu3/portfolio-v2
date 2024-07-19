import BottomToTopText from "@/components/BottomToTopText";
import { Canvas, useFrame } from "@react-three/fiber";
import Grid from "@/components/@three/Grid";
import TorusWireframe, { HtmlComp } from "@/components/@three/TorusWireframe";
import { Sparkles } from "@react-three/drei";
import { useRef } from "react";
import BBAnchorScene from "@/components/@three/BBAnchorScene";
import Particles from "@/components/@three/Particles";

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
        <TorusWireframe />

        {/* <BBAnchorScene anchor={[1, 1, 1]} drawBoundingBox={true}>
          <HtmlComp />
        </BBAnchorScene> */}
      </Canvas>
      안녕하세요, 프론트엔드 개발자 <BottomToTopText text={"suu3"} />
      입니다.
    </>
  );
};

export default BigTextSection;
