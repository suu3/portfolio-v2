"use client";

import { ReactNode, Suspense, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import HeroCharacter from "@/components/@three/HeroCharacter";

const ORANGE = "#ff6737";

/**
 * Places the object relative to the *visible* world size rather than a fixed
 * coordinate, so it can't drift off-screen on narrow viewports. On mobile it
 * moves up and shrinks to sit clear of the headline instead of behind it.
 */
const Placed = ({ children }: { children: ReactNode }) => {
  const { viewport } = useThree();
  const narrow = viewport.aspect < 1;

  const x = narrow ? viewport.width * 0.22 : viewport.width * 0.3;
  // on mobile it drops into the gap below the buttons; going above would put it
  // behind the headline and push the speech bubble off the top of the screen
  const y = narrow ? -viewport.height * 0.18 : 0.15;
  const scale = narrow
    ? Math.max(0.42, Math.min(0.62, viewport.width * 0.26))
    : Math.max(0.7, Math.min(1.05, viewport.width * 0.13));

  return (
    <group position={[x, y, 0]} scale={scale}>
      {children}
    </group>
  );
};

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
        <Placed>
          <HeroCharacter color={ORANGE} />
        </Placed>
      </Suspense>
    </Canvas>
  );
};

export default HeroCanvas;
