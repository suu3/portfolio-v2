import BottomToTopText from "@/components/BottomToTopText";
import { Canvas } from "@react-three/fiber";
import Grid from "@/components/@three/Grid";
import TorusWireframe from "@/components/@three/TorusWireframe";

const BigTextSection = () => {
  return (
    <>
      <Canvas
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Grid />
        <TorusWireframe />
      </Canvas>
      안녕하세요, 프론트엔드 개발자 <BottomToTopText text={"suu3"} />
      입니다.{" "}
    </>
  );
};

export default BigTextSection;
