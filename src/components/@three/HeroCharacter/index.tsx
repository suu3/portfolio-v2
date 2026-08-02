"use client";

import { Suspense, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Html, Outlines, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { sfx } from "@/lib/sfx";
import styles from "./bubble.module.css";

/**
 * Drop your own model in at `public/models/character.glb` and point
 * MODEL_URL at it — the placeholder below is swapped out automatically.
 */
export const MODEL_URL: string | null = null;

/** Click-to-advance easter egg. Reads like a machine slowly losing patience. */
const LINES = [
  "STATUS: ONLINE",
  "INPUT RECEIVED",
  "INPUT RECEIVED ×2",
  "SCANNING FOR EASTER EGG...",
  "RESULT: 0 FOUND",
  "RETRY? Y/N",
  "> Y",
  "RESULT: STILL 0 FOUND",
  "SESSION LOGGED. THANKS.",
];

/**
 * Stand-in until a real model is dropped in: one chunky faceted solid with a
 * glowing outline. Deliberately abstract — a half-finished mannequin reads worse
 * than an honest shape.
 */
const Placeholder = ({ color }: { color: string }) => (
  <mesh>
    <icosahedronGeometry args={[0.98, 0]} />
    <meshStandardMaterial color={color} flatShading roughness={0.8} metalness={0.05} />
    <Outlines thickness={0.06} color="#bffe28" transparent opacity={1} />
  </mesh>
);

const Model = ({ url }: { url: string }) => {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
};

const HeroCharacter = ({ color = "#ff6737" }: { color?: string }) => {
  const group = useRef<THREE.Group>(null);
  const [line, setLine] = useState(0);
  const [found, setFound] = useState(false); // hide the hint once discovered
  const [pop, setPop] = useState(false);

  const advance = () => {
    setFound(true);
    setLine((n) => {
      const next = (n + 1) % LINES.length;
      sfx.step(next);
      return next;
    });
    setPop(true);
    window.setTimeout(() => setPop(false), 180);
  };

  useFrame((state) => {
    if (!group.current) return;
    const { x, y } = state.pointer;
    group.current.rotation.y += (x * 0.6 - group.current.rotation.y) * 0.06;
    group.current.rotation.x += (-y * 0.25 - group.current.rotation.x) * 0.06;
  });

  return (
    <Float speed={1.8} rotationIntensity={0.25} floatIntensity={0.9}>
      {/* speech bubble — one line, changes only on click */}
      <Html
        center
        distanceFactor={7}
        position={[0, 1.5, 0]}
        zIndexRange={[10, 0]}
        style={{ pointerEvents: "none" }}
      >
        <div className={`${styles.bubble} ${pop ? styles.pop : ""}`}>
          {LINES[line]}
          <span className={styles.tail} />
        </div>
      </Html>

      <group
        ref={group}
        onClick={(e) => {
          e.stopPropagation();
          advance();
        }}
      >
        <Suspense fallback={<Placeholder color={color} />}>
          {MODEL_URL ? <Model url={MODEL_URL} /> : <Placeholder color={color} />}
        </Suspense>
      </group>

      {/* faint hint — fades away for good after the first click */}
      <Html
        center
        distanceFactor={9}
        position={[0, -1.45, 0]}
        zIndexRange={[10, 0]}
        style={{ pointerEvents: "auto" }}
      >
        <button
          type="button"
          onClick={advance}
          data-cursor="pointer"
          data-cursor-label="Click"
          aria-label="캐릭터에게 말 걸기"
          className={`${styles.hint} ${found ? styles.hintGone : ""}`}
        >
          click me
        </button>
      </Html>
    </Float>
  );
};

export default HeroCharacter;
