"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Icosahedron, MeshDistortMaterial, Torus } from "@react-three/drei";
import * as THREE from "three";

/**
 * A free, procedural 3D centerpiece — an organically morphing icosahedron
 * (distort material) with an orbiting wireframe ring. Reacts to the pointer.
 * No external asset / no grid.
 */
const HeroObject = ({ color = "#ff6737" }: { color?: string }) => {
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const { x, y } = state.pointer;
    if (group.current) {
      group.current.rotation.y += (x * 0.5 - group.current.rotation.y) * 0.04;
      group.current.rotation.x += (-y * 0.35 - group.current.rotation.x) * 0.04;
    }
    if (ring.current) {
      ring.current.rotation.z += 0.004;
      ring.current.rotation.x += 0.002;
    }
  });

  return (
    <group ref={group}>
      <Float speed={2} rotationIntensity={0.6} floatIntensity={1.4}>
        <Icosahedron args={[1.35, 12]}>
          <MeshDistortMaterial
            color={color}
            distort={0.38}
            speed={1.8}
            roughness={0.12}
            metalness={0.15}
          />
        </Icosahedron>
        <Torus ref={ring} args={[2.15, 0.012, 16, 120]} rotation={[Math.PI / 2.4, 0, 0]}>
          <meshBasicMaterial color={color} wireframe transparent opacity={0.5} />
        </Torus>
      </Float>
    </group>
  );
};

export default HeroObject;
