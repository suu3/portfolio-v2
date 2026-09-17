"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

/* shared materials — soft vinyl, same family as the character */
const fur = new THREE.MeshStandardMaterial({ color: "#f4f3ef", roughness: 0.8 });
const innerEar = new THREE.MeshStandardMaterial({ color: "#cfc9f2", roughness: 0.8 });
const hoodie = new THREE.MeshStandardMaterial({ color: "#fa662e", roughness: 0.86 });
const scarf = new THREE.MeshStandardMaterial({ color: "#f9d169", roughness: 0.7 });
const eye = new THREE.MeshStandardMaterial({ color: "#27325a", roughness: 0.35 });
const line = new THREE.MeshStandardMaterial({ color: "#6d6a73", roughness: 0.6 });

/* shared geometry, all in bunny units: feet at y ≈ -2.1, ear tips at y ≈ 2.6 */
const sphere = new THREE.SphereGeometry(1, 40, 28);
const ear = new THREE.CapsuleGeometry(0.21, 1.15, 8, 20);
const earIn = new THREE.CapsuleGeometry(0.12, 0.95, 6, 16);
const body = new THREE.CapsuleGeometry(0.62, 0.55, 10, 28);
const sleeve = new THREE.CapsuleGeometry(0.2, 0.46, 8, 16);
const leg = new THREE.CapsuleGeometry(0.2, 0.3, 8, 16);
const ring = new THREE.TorusGeometry(0.5, 0.16, 14, 40);
const drip = new THREE.CapsuleGeometry(0.08, 0.2, 6, 12);
const stroke = new THREE.CapsuleGeometry(0.018, 0.09, 4, 8);

const noRaycast = () => null;

type Props = {
  position?: [number, number, number];
  scale?: number;
  /** resting pitch / yaw / roll */
  rotation?: [number, number, number];
  speed?: number;
};

/**
 * The rabbit companion: a white bunny in the same orange hoodie and a
 * butter-yellow scarf. Built from primitives so it stays light. Decorative —
 * it never catches the pointer, only watches it.
 */
const Bunny = ({ position = [0, 0, 0], scale = 1, rotation = [0, 0, 0], speed = 1.4 }: Props) => {
  const look = useRef<THREE.Group>(null);
  const eyes = useRef<THREE.Group>(null);
  const blink = useRef({ t: -1, next: 1 + Math.random() * 3 });

  useFrame((state, dt) => {
    const g = look.current;
    if (g) {
      const { x, y } = state.pointer;
      g.rotation.y = THREE.MathUtils.damp(g.rotation.y, rotation[1] + x * 0.45, 2.2, dt);
      g.rotation.x = THREE.MathUtils.damp(g.rotation.x, rotation[0] - y * 0.25, 2.2, dt);
    }
    const b = blink.current;
    const t = state.clock.elapsedTime;
    if (b.t < 0 && t > b.next) {
      b.t = 0;
      b.next = t + 2.8 + Math.random() * 3.5;
    }
    let lid = 1;
    if (b.t >= 0) {
      b.t += dt;
      const p = b.t / 0.14;
      if (p >= 1) b.t = -1;
      else lid = 1 - Math.sin(p * Math.PI) * 0.9;
    }
    if (eyes.current) eyes.current.scale.y = lid;
  });

  return (
    <Float speed={speed} floatIntensity={0.7} rotationIntensity={0.3}>
      <group position={position} scale={scale} rotation={[0, 0, rotation[2]]}>
        <group ref={look}>
          {/* ears — tall, a little apart, the right one leaning out */}
          {[
            { x: -0.34, tilt: 0.1 },
            { x: 0.36, tilt: -0.2 },
          ].map((e) => (
            <group key={e.x} position={[e.x, 1.75, -0.05]} rotation={[-0.08, 0, e.tilt]}>
              <mesh geometry={ear} material={fur} scale={[1, 1, 0.72]} raycast={noRaycast} />
              <mesh geometry={earIn} material={innerEar} position={[0, -0.02, 0.1]} scale={[1, 1, 0.35]} raycast={noRaycast} />
            </group>
          ))}

          {/* head */}
          <mesh geometry={sphere} material={fur} position={[0, 0.62, 0]} scale={[1.02, 0.9, 0.92]} raycast={noRaycast} />

          {/* face */}
          <group ref={eyes} position={[0, 0.68, 0]}>
            {[-0.3, 0.3].map((x) => (
              <mesh key={x} geometry={sphere} material={eye} position={[x, 0, 0.865]} scale={[0.09, 0.13, 0.06]} raycast={noRaycast} />
            ))}
          </group>
          {[-1, 1].map((s) => (
            <mesh
              key={s}
              geometry={stroke}
              material={line}
              position={[s * 0.035, 0.38, 0.9]}
              rotation={[0.2, 0, s * 0.75]}
              raycast={noRaycast}
            />
          ))}
        </group>

        {/* scarf with a couple of drips */}
        <mesh geometry={ring} material={scarf} position={[0, -0.26, 0]} rotation={[Math.PI / 2 - 0.12, 0, 0]} scale={[1.05, 1, 1]} raycast={noRaycast} />
        {[
          [-0.18, -0.52, 0.52, 1],
          [0.12, -0.46, 0.55, 0.7],
        ].map(([x, y, z, s], i) => (
          <mesh key={i} geometry={drip} material={scarf} position={[x, y, z]} scale={[1, s, 1]} raycast={noRaycast} />
        ))}

        {/* hoodie */}
        <mesh geometry={body} material={hoodie} position={[0, -0.95, 0]} scale={[1.02, 1, 0.9]} raycast={noRaycast} />
        {[-1, 1].map((s) => (
          <group key={s} position={[s * 0.66, -0.78, 0.02]} rotation={[0, 0, s * 0.42]}>
            <mesh geometry={sleeve} material={hoodie} position={[0, -0.3, 0]} raycast={noRaycast} />
            <mesh geometry={sphere} material={fur} position={[0, -0.72, 0.02]} scale={0.2} raycast={noRaycast} />
          </group>
        ))}

        {/* legs + feet */}
        {[-1, 1].map((s) => (
          <group key={s} position={[s * 0.27, -1.62, 0]}>
            <mesh geometry={leg} material={fur} raycast={noRaycast} />
            <mesh geometry={sphere} material={fur} position={[0, -0.32, 0.08]} scale={[0.24, 0.15, 0.32]} raycast={noRaycast} />
          </group>
        ))}
      </group>
    </Float>
  );
};

export default Bunny;
