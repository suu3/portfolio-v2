"use client";

import { Suspense, useEffect, useState } from "react";

import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import Character from "@/components/@three/Character";

/**
 * One full-viewport canvas behind the header and above the page. The character
 * in it walks between sections as you scroll (see Character/track.ts).
 *
 * The canvas ignores the pointer so the page stays clickable; R3F listens on
 * the document body instead, which is why the character still notices you.
 * Loaded client-only (see MainLayout) — the GLTF/Draco loaders have no
 * business running during SSR.
 */
const CharacterStage = () => {
  const [touch, setTouch] = useState(false);
  const [source, setSource] = useState<HTMLElement>();

  useEffect(() => {
    setSource(document.body);
    const mq = window.matchMedia("(pointer: coarse)");
    const on = () => setTouch(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // R3F only builds its renderer once it has measured the container. In a tab
  // that loads hidden (background tab, the desktop app's preview pane) that
  // measurement can stay at 0 until a resize/visibility event, so nudge it.
  useEffect(() => {
    const nudge = () => window.dispatchEvent(new Event("resize"));
    const timers = [0, 150, 400, 900].map((ms) => window.setTimeout(nudge, ms));
    const onVis = () => !document.hidden && nudge();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      timers.forEach(clearTimeout);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  if (!source) return null;

  return (
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: 5, pointerEvents: "none" }} aria-hidden>
        <Canvas
          eventSource={source}
          eventPrefix="client"
          camera={{ position: [0, 0, 16], fov: 28 }}
          // A phone renders this full-screen: at dpr 1.5 with MSAA that is 0.74M
          // pixels of skinned PBR every frame, on top of the star field and the
          // page itself. Drop to one device pixel and no multisampling there —
          // the character is small on a phone and the edges hold up.
          dpr={touch ? 1 : [1, 1.5]}
          gl={{ antialias: !touch, alpha: true }}
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
            <Character touch={touch} />
          </Suspense>
        </Canvas>
      </div>
    </>
  );
};

export default CharacterStage;
