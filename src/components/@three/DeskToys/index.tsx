"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

const noRaycast = () => null;

/* ─────────────── </> ─────────────── */

const glyphInk = new THREE.MeshStandardMaterial({ color: "#151515", roughness: 0.28, metalness: 0.15 });
const stroke = new THREE.CapsuleGeometry(0.13, 0.78, 8, 20);

/** one straight stroke of the glyph, from (x0, y0) to (x1, y1) */
const Stroke = ({ from, to }: { from: [number, number]; to: [number, number] }) => {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const len = Math.hypot(dx, dy);
  return (
    <mesh
      geometry={stroke}
      material={glyphInk}
      position={[(from[0] + to[0]) / 2, (from[1] + to[1]) / 2, 0]}
      rotation={[0, 0, Math.atan2(dy, dx) - Math.PI / 2]}
      scale={[1, len / 1.04, 1]}
      raycast={noRaycast}
    />
  );
};

/** A chunky `</>` built from capsule strokes, slowly turning and watching the pointer. */
export const CodeGlyph = ({ speed = 1.3 }: { speed?: number }) => {
  const g = useRef<THREE.Group>(null);
  useFrame((state, dt) => {
    if (!g.current) return;
    const { x, y } = state.pointer;
    g.current.rotation.y = THREE.MathUtils.damp(g.current.rotation.y, 0.35 + x * 0.5 + Math.sin(state.clock.elapsedTime * 0.6) * 0.15, 2.5, dt);
    g.current.rotation.x = THREE.MathUtils.damp(g.current.rotation.x, -y * 0.25, 2.5, dt);
  });
  return (
    <Float speed={speed} floatIntensity={0.7} rotationIntensity={0.25}>
      <group ref={g} rotation={[0, 0, -0.12]}>
        {/* < */}
        <Stroke from={[-0.9, 0.55]} to={[-1.55, 0]} />
        <Stroke from={[-1.55, 0]} to={[-0.9, -0.55]} />
        {/* / */}
        <Stroke from={[-0.28, -0.8]} to={[0.28, 0.8]} />
        {/* > */}
        <Stroke from={[0.9, 0.55]} to={[1.55, 0]} />
        <Stroke from={[1.55, 0]} to={[0.9, -0.55]} />
      </group>
    </Float>
  );
};

/* ─────────────── star ─────────────── */

/* rounded tips: each point is a curve through the tip, not a corner */
const starShape = (() => {
  const shape = new THREE.Shape();
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? 1 : 0.6;
    const a = Math.PI / 2 + (i * Math.PI) / 5;
    pts.push(new THREE.Vector2(Math.cos(a) * r, Math.sin(a) * r));
  }
  const lerp = (a: THREE.Vector2, b: THREE.Vector2, t: number) => a.clone().lerp(b, t);
  for (let i = 0; i < 10; i += 2) {
    const tip = pts[i];
    const prev = pts[(i + 9) % 10];
    const next = pts[i + 1];
    const inA = lerp(prev, tip, 0.55);
    const outB = lerp(tip, next, 0.45);
    if (i === 0) shape.moveTo(inA.x, inA.y);
    else shape.lineTo(inA.x, inA.y);
    shape.quadraticCurveTo(tip.x, tip.y, outB.x, outB.y);
    // soften the inner corner too
    const nextTip = pts[(i + 2) % 10];
    const c0 = lerp(next, tip, 0.18);
    const c1 = lerp(next, nextTip, 0.18);
    shape.lineTo(c0.x, c0.y);
    shape.quadraticCurveTo(next.x, next.y, c1.x, c1.y);
  }
  shape.closePath();
  return shape;
})();

const starGeo = (() => {
  const g = new THREE.ExtrudeGeometry(starShape, {
    depth: 0.28,
    bevelEnabled: true,
    bevelThickness: 0.22,
    bevelSize: 0.16,
    bevelSegments: 8,
    curveSegments: 10,
  });
  g.center();
  g.computeVertexNormals();
  return g;
})();

const starGold = new THREE.MeshStandardMaterial({ color: "#f9d169", roughness: 0.32, metalness: 0.1 });

/** A chubby, round-tipped star (the GitHub kind), turning slowly and tilting toward the pointer. */
export const Star = ({ speed = 1.5 }: { speed?: number }) => {
  const g = useRef<THREE.Group>(null);
  useFrame((state, dt) => {
    if (!g.current) return;
    const { x, y } = state.pointer;
    const t = state.clock.elapsedTime;
    g.current.rotation.y = THREE.MathUtils.damp(g.current.rotation.y, -0.3 + x * 0.5 + Math.sin(t * 0.7) * 0.35, 2.5, dt);
    g.current.rotation.x = THREE.MathUtils.damp(g.current.rotation.x, -y * 0.25, 2.5, dt);
  });
  return (
    <Float speed={speed} floatIntensity={0.8} rotationIntensity={0.3}>
      <group ref={g} rotation={[0, -0.3, 0.2]}>
        <mesh geometry={starGeo} material={starGold} raycast={noRaycast} />
      </group>
    </Float>
  );
};

/* ─────────────── keyboard ─────────────── */

const KEY = 0.26;
const GAP = 0.05;
const ROWS = [12, 11, 11, 10];
const keyGeo = new RoundedBoxGeometry(KEY, 0.14, KEY, 2, 0.04);
const keyWhite = new THREE.MeshStandardMaterial({ color: "#f4f3ef", roughness: 0.6 });
const keyBase = new THREE.MeshStandardMaterial({ color: "#cfcfcb", roughness: 0.55 });
const keyBlue = new THREE.MeshStandardMaterial({ color: "#2d3cff", roughness: 0.45 });
const keyOrange = new THREE.MeshStandardMaterial({ color: "#fa662e", roughness: 0.55 });

/** key centres on the top plate, row by row (x, z) */
const KEY_SLOTS = (() => {
  const out: [number, number][] = [];
  const pitch = KEY + GAP;
  ROWS.forEach((n, r) => {
    for (let c = 0; c < n; c++) {
      out.push([-((ROWS[0] - 1) * pitch) / 2 + r * 0.09 + c * pitch, -(ROWS.length * pitch) / 2 + r * pitch]);
    }
  });
  return out;
})();

/**
 * A little 60% keyboard, tipped toward the viewer, typing to itself: one key
 * at a time dips, in hard steps. Esc is orange, Enter is signal blue.
 */
export const Keyboard = ({ speed = 1.3 }: { speed?: number }) => {
  const keys = useRef<THREE.InstancedMesh | null>(null);
  const g = useRef<THREE.Group>(null);
  const m = useMemo(() => new THREE.Matrix4(), []);
  const last = useRef({ key: -1, tick: -1 });

  useFrame((state, dt) => {
    const tick = Math.floor(state.clock.elapsedTime * 7);
    const inst = keys.current;
    if (inst && tick !== last.current.tick) {
      const prev = last.current.key;
      if (prev >= 0) inst.setMatrixAt(prev, m.makeTranslation(KEY_SLOTS[prev][0], 0.2, KEY_SLOTS[prev][1]));
      const next = Math.floor(Math.abs(Math.sin(tick * 12.9898) * 43758.5453)) % KEY_SLOTS.length;
      inst.setMatrixAt(next, m.makeTranslation(KEY_SLOTS[next][0], 0.12, KEY_SLOTS[next][1]));
      inst.instanceMatrix.needsUpdate = true;
      last.current = { key: next, tick };
    }
    if (g.current) {
      const { x, y } = state.pointer;
      g.current.rotation.y = THREE.MathUtils.damp(g.current.rotation.y, -0.25 + x * 0.35, 2.5, dt);
      g.current.rotation.x = THREE.MathUtils.damp(g.current.rotation.x, 0.75 - y * 0.2, 2.5, dt);
    }
  });

  const lastSlot = KEY_SLOTS[KEY_SLOTS.length - 1];
  return (
    <Float speed={speed} floatIntensity={0.6} rotationIntensity={0.2}>
      <group ref={g} rotation={[0.75, -0.25, 0.08]}>
        <RoundedBox args={[3.55, 0.22, 1.35]} radius={0.08} material={keyBase} raycast={noRaycast} />
        <instancedMesh
          ref={(el) => {
            if (el && el !== keys.current) {
              KEY_SLOTS.forEach(([x, z], i) => el.setMatrixAt(i, m.makeTranslation(x, 0.2, z)));
              el.instanceMatrix.needsUpdate = true;
            }
            keys.current = el;
          }}
          args={[keyGeo, keyWhite, KEY_SLOTS.length]}
          raycast={noRaycast}
        />
        {/* accents over the first slot (esc) and a wide enter on the last row */}
        <mesh geometry={keyGeo} material={keyOrange} position={[KEY_SLOTS[0][0], 0.21, KEY_SLOTS[0][1]]} raycast={noRaycast} />
        <mesh
          geometry={keyGeo}
          material={keyBlue}
          position={[lastSlot[0] + 0.16, 0.21, lastSlot[1]]}
          scale={[1.9, 1.02, 1.02]}
          raycast={noRaycast}
        />
        {/* space bar */}
        <RoundedBox args={[1.6, 0.14, KEY]} radius={0.04} position={[0.1, 0.2, 0.62]} material={keyWhite} raycast={noRaycast} />
      </group>
    </Float>
  );
};

/* ─────────────── rocket ─────────────── */

const hull = new THREE.MeshStandardMaterial({ color: "#f4f3ef", roughness: 0.4 });
const trim = new THREE.MeshStandardMaterial({ color: "#f4a57f", roughness: 0.55 });
const glass = new THREE.MeshStandardMaterial({ color: "#2d3cff", roughness: 0.15, metalness: 0.2 });
const flameMat = new THREE.MeshBasicMaterial({ color: "#ff8a3d", transparent: true, opacity: 0.9 });

const bodyGeo = new THREE.LatheGeometry(
  [
    new THREE.Vector2(0.0, -1.0),
    new THREE.Vector2(0.34, -0.96),
    new THREE.Vector2(0.46, -0.55),
    new THREE.Vector2(0.47, 0.0),
    new THREE.Vector2(0.4, 0.5),
    new THREE.Vector2(0.22, 0.95),
    new THREE.Vector2(0.0, 1.22),
  ],
  36
);
const windowGeo = new THREE.SphereGeometry(0.2, 20, 14);
const rimGeo = new THREE.TorusGeometry(0.22, 0.04, 10, 28);
const finGeo = (() => {
  const s = new THREE.Shape();
  s.moveTo(0, 0.35);
  s.quadraticCurveTo(0.2, 0.1, 0.45, -0.25);
  s.lineTo(0.45, -0.42);
  s.lineTo(0, -0.2);
  s.closePath();
  return new THREE.ExtrudeGeometry(s, { depth: 0.07, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 3 });
})();
const flameGeo = new THREE.ConeGeometry(0.22, 0.7, 20);

/** A chubby toy rocket, nose along +y. The flame flickers in steps. */
export const Rocket = () => {
  const flame = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!flame.current) return;
    const k = Math.floor(state.clock.elapsedTime * 16) % 3;
    flame.current.scale.set(1, [1, 0.72, 0.88][k], 1);
  });
  return (
    <group>
      <mesh geometry={bodyGeo} material={hull} raycast={noRaycast} />
      <mesh geometry={windowGeo} material={glass} position={[0, 0.3, 0.4]} scale={[1, 1, 0.5]} raycast={noRaycast} />
      <mesh geometry={rimGeo} material={trim} position={[0, 0.3, 0.37]} raycast={noRaycast} />
      {[0, 1, 2].map((i) => (
        <group key={i} rotation={[0, (i * Math.PI * 2) / 3, 0]}>
          <mesh geometry={finGeo} material={trim} position={[0.34, -0.55, -0.035]} raycast={noRaycast} />
        </group>
      ))}
      <mesh ref={flame} geometry={flameGeo} material={flameMat} position={[0, -1.3, 0]} rotation={[Math.PI, 0, 0]} raycast={noRaycast} />
    </group>
  );
};
