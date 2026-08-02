"use client";

import { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import HeroCharacter from "@/components/@three/HeroCharacter";

const ORANGE = "#ff6737";

const HeroCanvas = () => {
  // R3F measures its container on mount; when loaded via dynamic import the
  // container can lay out a frame later, so nudge a few resizes until settled.
  useEffect(() => {
    const nudge = () => window.dispatchEvent(new Event("resize"));
    const timers = [0, 120, 350, 700].map((ms) => window.setTimeout(nudge, ms));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      // re-enabled inside a pointer-events:none wrapper so the character is clickable
      style={{ width: "100%", height: "100%", pointerEvents: "auto" }}
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={1.75} />
        <pointLight position={[6, 6, 8]} intensity={0.5} />
        <directionalLight position={[-5, 3, 5]} intensity={0.3} color="#ffddca" />
        <Sparkles count={36} size={3} scale={[12, 8, 6]} color={ORANGE} speed={0.35} opacity={0.7} />
        <group position={[2.5, 0.15, 0]} scale={1.05}>
          <HeroCharacter color={ORANGE} />
        </group>
      </Suspense>
    </Canvas>
  );
};

export default HeroCanvas;
