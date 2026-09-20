"use client";

import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export type ConfettiHandle = {
  /** Throw every scrap up from `origin` (local to this group). */
  fire: (opts?: { origin?: [number, number, number]; power?: number; count?: number }) => void;
};

const COUNT = 120;
/** seconds a scrap lives; it shrinks away over the last third */
const LIFE = 1.9;
/** model units per second² — the character is MODEL_HEIGHT (5.5) tall, so this
 *  lands the scraps a beat after the peak rather than hanging in the air */
const GRAVITY = -16;
/** air drag as a per-second velocity multiplier: paper, not pebbles. Any
 *  heavier and the scraps stall in a clump around the head instead of clearing
 *  the character, which is the whole point of throwing them. */
const DRAG = 0.6;

/* the site's own accents, plus the ink and paper of the windows */
const COLORS = ["#ff5a1f", "#ff6737", "#ffddca", "#2d3cff", "#bffe28", "#111111", "#f7f7f5"].map(
  (c) => new THREE.Color(c)
);

const noRaycast = () => null;

/**
 * A one-shot confetti burst, driven imperatively so a click can set it off
 * without re-rendering the scene. Every scrap is an instance of one flat box;
 * the pool is fixed, so firing again mid-flight simply re-throws them.
 */
const Confetti = forwardRef<ConfettiHandle>((_, ref) => {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const p = useMemo(
    () => ({
      pos: new Float32Array(COUNT * 3),
      vel: new Float32Array(COUNT * 3),
      rot: new Float32Array(COUNT * 3),
      spin: new Float32Array(COUNT * 3),
      size: new Float32Array(COUNT),
      life: new Float32Array(COUNT), // seconds left; <= 0 means parked
      full: new Float32Array(COUNT), // what that life started at
      alive: 0,
    }),
    []
  );

  useImperativeHandle(ref, () => ({
    fire: ({ origin = [0, 0, 0], power = 1, count = COUNT } = {}) => {
      const m = mesh.current;
      if (!m) return;
      const n = Math.min(count, COUNT);
      for (let i = 0; i < n; i++) {
        const i3 = i * 3;
        // start inside a small ball so the burst has a body, not a single point
        const r = Math.random() * 0.5;
        const a = Math.random() * Math.PI * 2;
        const z = Math.random() * 2 - 1;
        const ring = Math.sqrt(1 - z * z);
        p.pos[i3] = origin[0] + ring * Math.cos(a) * r;
        p.pos[i3 + 1] = origin[1] + ring * Math.sin(a) * r;
        p.pos[i3 + 2] = origin[2] + z * r;

        // upward-biased cone, widest across the screen so the burst reads from
        // the front; a touch of z so it is plainly a volume and not a decal
        const dir = new THREE.Vector3(
          (Math.random() - 0.5) * 2.2,
          Math.random() * 1.1 + 0.3,
          (Math.random() - 0.5) * 1.1
        ).normalize();
        const speed = (7 + Math.random() * 6) * power;
        p.vel[i3] = dir.x * speed;
        p.vel[i3 + 1] = dir.y * speed;
        p.vel[i3 + 2] = dir.z * speed;

        p.rot[i3] = Math.random() * Math.PI * 2;
        p.rot[i3 + 1] = Math.random() * Math.PI * 2;
        p.rot[i3 + 2] = Math.random() * Math.PI * 2;
        p.spin[i3] = (Math.random() - 0.5) * 14;
        p.spin[i3 + 1] = (Math.random() - 0.5) * 14;
        p.spin[i3 + 2] = (Math.random() - 0.5) * 14;

        p.size[i] = 0.7 + Math.random() * 0.8;
        p.full[i] = LIFE * (0.7 + Math.random() * 0.45);
        p.life[i] = p.full[i];
        m.setColorAt(i, COLORS[(Math.random() * COLORS.length) | 0]);
      }
      // parked scraps keep their zero scale from the frame loop below
      for (let i = n; i < COUNT; i++) p.life[i] = 0;
      if (m.instanceColor) m.instanceColor.needsUpdate = true;
      p.alive = n;
      m.visible = true;
    },
  }));

  useFrame((_, dt) => {
    const m = mesh.current;
    if (!m || !p.alive) return;
    const step = Math.min(dt, 1 / 30); // a backgrounded tab must not teleport them
    const drag = Math.pow(DRAG, step);

    let alive = 0;
    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      if (p.life[i] <= 0) {
        dummy.scale.setScalar(0);
        dummy.position.set(0, 0, 0);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        m.setMatrixAt(i, dummy.matrix);
        continue;
      }
      alive++;
      p.life[i] -= step;

      p.vel[i3] *= drag;
      p.vel[i3 + 1] = (p.vel[i3 + 1] + GRAVITY * step) * drag;
      p.vel[i3 + 2] *= drag;
      p.pos[i3] += p.vel[i3] * step;
      p.pos[i3 + 1] += p.vel[i3 + 1] * step;
      p.pos[i3 + 2] += p.vel[i3 + 2] * step;
      p.rot[i3] += p.spin[i3] * step;
      p.rot[i3 + 1] += p.spin[i3 + 1] * step;
      p.rot[i3 + 2] += p.spin[i3 + 2] * step;

      // pop in over the first 80ms, shrink away over the last third of the
      // life — measured against this scrap's own life, which is not LIFE
      const t = p.life[i];
      const grow = THREE.MathUtils.clamp((p.full[i] - t) / 0.08, 0, 1);
      const fade = THREE.MathUtils.clamp(t / (p.full[i] * 0.33), 0, 1);
      dummy.position.set(p.pos[i3], p.pos[i3 + 1], p.pos[i3 + 2]);
      dummy.rotation.set(p.rot[i3], p.rot[i3 + 1], p.rot[i3 + 2]);
      dummy.scale.setScalar(p.size[i] * grow * fade);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
    p.alive = alive;
    if (!alive) m.visible = false;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, COUNT]} visible={false} raycast={noRaycast} frustumCulled={false}>
      {/* flat scraps of paper, not confetti balls */}
      <boxGeometry args={[0.3, 0.42, 0.04]} />
      <meshStandardMaterial roughness={0.42} metalness={0.05} side={THREE.DoubleSide} />
    </instancedMesh>
  );
});

Confetti.displayName = "Confetti";

export default Confetti;
