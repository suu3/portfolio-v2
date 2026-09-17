"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { Html, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { sfx } from "@/lib/sfx";
import styles from "./bubble.module.css";

/**
 * Baked from `mycharactor_rabbit_theme_v2.blend` (arms posed down, socks turned
 * into real geometry, Draco-compressed). Two nodes: `Body` and `Head`, with the
 * head's origin at the neck so it can look around on its own.
 */
export const MODEL_URL = "/models/character.glb";
const DRACO = "/draco/";
/** model height in its own units (feet at y = 0) */
export const MODEL_HEIGHT = 5.5;

useGLTF.preload(MODEL_URL, DRACO);

/** Click-to-advance easter egg. Reads like a machine slowly losing patience. */
const LINES = [
  "", // first line depends on the device, see below
  "status: online",
  "input received",
  "input received ×2",
  "scanning for easter egg...",
  "result: 0 found",
  "retry? y/n",
  "> y",
  "result: still 0 found",
  "session logged. thanks.",
];

const hint = (label: string | null) =>
  window.dispatchEvent(new CustomEvent("cursor:hint", { detail: label }));

const damp = THREE.MathUtils.damp;

const HeroCharacter = ({ touch = false }: { touch?: boolean }) => {
  const { scene } = useGLTF(MODEL_URL, DRACO);
  const root = useRef<THREE.Group>(null);
  const hop = useRef<THREE.Group>(null);
  const head = useMemo(() => scene.getObjectByName("Head") ?? null, [scene]);

  const [line, setLine] = useState(0);
  const [pop, setPop] = useState(false);

  const s = useRef({ hopT: -1, lastScroll: 0, vel: 0 });

  useLayoutEffect(() => {
    s.current.lastScroll = window.scrollY;
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.envMapIntensity = 0.85;
    });
  }, [scene]);

  const poke = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    // the canvas sits above the windows without catching events; don't double up on a real link
    const target = e.nativeEvent.target as HTMLElement | null;
    if (target?.closest?.("a, button")) return;
    s.current.hopT = 0;
    setLine((n) => {
      const next = (n + 1) % LINES.length;
      sfx.step(next);
      return next;
    });
    setPop(true);
    window.setTimeout(() => setPop(false), 160);
  };

  useFrame((state, dt) => {
    const g = root.current;
    const j = hop.current;
    if (!g || !j) return;
    const st = s.current;
    const t = state.clock.elapsedTime;
    const { x, y } = state.pointer;

    // scroll velocity (px / frame, smoothed) — the whole figure leans into it
    const sy = window.scrollY;
    st.vel += (THREE.MathUtils.clamp(sy - st.lastScroll, -80, 80) - st.vel) * 0.1;
    st.lastScroll = sy;

    g.rotation.y = damp(g.rotation.y, -0.22 + x * 0.22, 3, dt);
    g.rotation.z = damp(g.rotation.z, THREE.MathUtils.clamp(-st.vel * 0.006, -0.14, 0.14), 6, dt);

    if (head) {
      head.rotation.y = damp(head.rotation.y, x * 0.5, 6, dt);
      head.rotation.x = damp(head.rotation.x, -y * 0.2 + 0.03 + Math.sin(t * 1.3) * 0.015, 6, dt);
      head.rotation.z = damp(head.rotation.z, -x * 0.07, 4, dt);
    }

    // idle breathing + click hop with squash & stretch
    let lift = 0;
    let sq = 1 + Math.sin(t * 2.2) * 0.006;
    if (st.hopT >= 0) {
      st.hopT += dt;
      const p = st.hopT / 0.46;
      if (p >= 1) st.hopT = -1;
      else {
        lift = Math.sin(p * Math.PI) * 0.9;
        sq *= p < 0.12 ? 1 - p * 0.9 : 1 + Math.sin(p * Math.PI) * 0.05;
      }
    }
    j.position.y = lift;
    j.scale.set(1 / Math.sqrt(sq), sq, 1 / Math.sqrt(sq));
  });

  return (
    <group ref={root}>
      <group ref={hop}>
        <primitive
          object={scene}
          onClick={poke}
          onPointerOver={(e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            hint("Poke");
          }}
          onPointerOut={() => hint(null)}
        />
      </group>

      <Html center position={[0, MODEL_HEIGHT + 0.75, 0]} zIndexRange={[40, 30]} style={{ pointerEvents: "none" }}>
        <div className={`${styles.bubble} ${pop ? styles.pop : ""}`}>
          {line === 0 ? (touch ? "hi. tap me" : "hi. drag the windows around ↖") : LINES[line]}
        </div>
      </Html>
    </group>
  );
};

export default HeroCharacter;
