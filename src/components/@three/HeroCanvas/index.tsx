"use client";

import { MutableRefObject, RefObject, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import HeroCharacter, { MODEL_HEIGHT } from "@/components/@three/HeroCharacter";
import ClayRabbit from "@/components/@three/ClayRabbit";

/** soft flat drop shadow — a 2D smudge under a 3D figure, on purpose */
const shadowTexture = () => {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, "rgba(0,0,0,0.42)");
  grd.addColorStop(0.55, "rgba(0,0,0,0.16)");
  grd.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
};

/**
 * Lays the scene out against the *visible* world size so nothing drifts off
 * screen: on desktop the figure stands right of centre with the windows around
 * it, on the stacked mobile layout it's centred and smaller.
 */
const Stage = () => {
  const { viewport, size } = useThree();
  const tex = useMemo(shadowTexture, []);
  const wide = size.width >= 1024;

  const vh = viewport.height;
  const vw = viewport.width;
  const figure = (wide ? 0.66 : 0.6) * vh;
  const scale = figure / MODEL_HEIGHT;
  const floor = -vh / 2 + vh * (wide ? 0.1 : 0.13);
  const x = wide ? vw * 0.1 : 0;

  return (
    <>
      <group position={[x, floor, 0]} scale={scale}>
        <HeroCharacter touch={!wide} />
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[3.4, 2.2, 1]} renderOrder={-1}>
          <planeGeometry />
          <meshBasicMaterial map={tex} transparent depthWrite={false} />
        </mesh>
      </group>

      {wide ? (
        <>
          <ClayRabbit position={[vw * 0.24, vh * 0.33, 1.2]} scale={vh * 0.05} rotation={[0.1, 0.5, 0.18]} speed={1.2} />
          <ClayRabbit position={[vw * 0.42, -vh * 0.07, -0.5]} scale={vh * 0.08} rotation={[0.05, -0.6, -0.12]} speed={1} />
          <ClayRabbit position={[-vw * 0.1, -vh * 0.3, 1.5]} scale={vh * 0.045} rotation={[-0.2, 0.3, 0.3]} speed={1.7} />
        </>
      ) : (
        <>
          <ClayRabbit position={[-vw * 0.33, vh * 0.06, 1]} scale={vh * 0.05} rotation={[0.1, 0.5, 0.18]} speed={1.2} />
          <ClayRabbit position={[vw * 0.34, -vh * 0.22, 0.5]} scale={vh * 0.045} rotation={[0.05, -0.6, -0.12]} speed={1.5} />
        </>
      )}
    </>
  );
};

const HeroCanvas = ({ eventSource }: { eventSource: RefObject<HTMLElement> }) => {
  const wrap = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(true);

  // stop rendering once the hero has scrolled away
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // R3F measures its container on mount; when loaded via dynamic import the
  // container can lay out a frame later, so nudge a few resizes until settled.
  useEffect(() => {
    const nudge = () => window.dispatchEvent(new Event("resize"));
    const timers = [0, 120, 350, 700].map((ms) => window.setTimeout(nudge, ms));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div ref={wrap} style={{ position: "absolute", inset: 0 }}>
      <Canvas
        eventSource={eventSource as MutableRefObject<HTMLElement>}
        eventPrefix="client"
        frameloop={onScreen ? "always" : "never"}
        camera={{ position: [0, 0.4, 16], fov: 28 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.NeutralToneMapping;
          gl.toneMappingExposure = 1.02;
        }}
        style={{ position: "absolute", inset: 0 }}
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[4, 7, 8]} intensity={1.5} />
        <directionalLight position={[-6, 3, -5]} intensity={0.7} color="#e6e8ff" />
        <Environment resolution={128} frames={1}>
          <Lightformer form="rect" intensity={1.6} position={[0, 4, 6]} scale={[12, 6, 1]} />
          <Lightformer form="rect" intensity={0.8} position={[-7, 0, 2]} rotation-y={Math.PI / 2} scale={[8, 8, 1]} />
          <Lightformer form="rect" intensity={0.5} position={[7, -2, 1]} rotation-y={-Math.PI / 2} scale={[8, 8, 1]} />
        </Environment>
        <Suspense fallback={null}>
          <Stage />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default HeroCanvas;
