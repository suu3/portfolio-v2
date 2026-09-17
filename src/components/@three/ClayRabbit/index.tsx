"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

/* one set of geometry/material for every rabbit on the page */
const clay = new THREE.MeshStandardMaterial({ color: "#dcdcd8", roughness: 0.92, metalness: 0 });
const eyeMat = new THREE.MeshStandardMaterial({ color: "#111111", roughness: 0.35 });
const headGeo = new THREE.SphereGeometry(1, 48, 32);
const earGeo = new THREE.CapsuleGeometry(0.25, 0.95, 8, 24);
const eyeGeo = new THREE.SphereGeometry(1, 20, 14);

const noRaycast = () => null;

type Props = {
  position: [number, number, number];
  scale?: number;
  /** resting yaw / pitch / roll */
  rotation?: [number, number, number];
  speed?: number;
};

/**
 * Matte grey clay rabbit — the pixel charm blown up into a soft 3D blob.
 * Purely decorative: it never catches the pointer, it only watches it.
 */
const ClayRabbit = ({ position, scale = 1, rotation = [0, 0, 0], speed = 1.4 }: Props) => {
  const g = useRef<THREE.Group>(null);

  useFrame((state, dt) => {
    if (!g.current) return;
    const { x, y } = state.pointer;
    g.current.rotation.y = THREE.MathUtils.damp(g.current.rotation.y, rotation[1] + x * 0.45, 2.2, dt);
    g.current.rotation.x = THREE.MathUtils.damp(g.current.rotation.x, rotation[0] - y * 0.25, 2.2, dt);
  });

  return (
    <Float speed={speed} floatIntensity={0.7} rotationIntensity={0.35}>
      <group ref={g} position={position} scale={scale} rotation={rotation}>
        <mesh geometry={headGeo} material={clay} scale={[1, 0.86, 0.9]} raycast={noRaycast} />
        {[-1, 1].map((side) => (
          <mesh
            key={side}
            geometry={earGeo}
            material={clay}
            position={[side * 0.4, 1.2, -0.05]}
            rotation={[0, 0, -side * 0.2]}
            raycast={noRaycast}
          />
        ))}
        {[-1, 1].map((side) => (
          <mesh
            key={side}
            geometry={eyeGeo}
            material={eyeMat}
            position={[side * 0.33, 0.08, 0.83]}
            scale={[0.085, 0.15, 0.05]}
            raycast={noRaycast}
          />
        ))}
      </group>
    </Float>
  );
};

export default ClayRabbit;
