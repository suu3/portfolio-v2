"use client";

import { useLayoutEffect } from "react";
import { Float, useGLTF } from "@react-three/drei";
import * as THREE from "three";

/**
 * The rabbit doll from room-of-memory, dressed as the orange rabbit companion
 * (white fur, apricot hoodie with the hood down, lavender inner ears) with its
 * arms resting at its sides. Baked by scripts/bunny/export-bunny.py. Sitting,
 * feet at y = 0, faces +z, ~3.2 tall.
 */
const URL = "/models/bunny.glb";
const DRACO = "/draco/";
const HEIGHT = 3.17;

useGLTF.preload(URL, DRACO);

const noRaycast = () => null;

type Props = {
  /** resting pitch / yaw / roll — the doll keeps facing this way */
  rotation?: [number, number, number];
  speed?: number;
};

/**
 * Decorative: it neither catches nor follows the pointer — it sits next to the
 * character and looks at them. Centred on its own middle so it floats evenly.
 */
const Bunny = ({ rotation = [0, 0, 0], speed = 1.2 }: Props) => {
  const { scene } = useGLTF(URL, DRACO);

  useLayoutEffect(() => {
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.raycast = noRaycast;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.roughness = 0.78; // plush, not plastic
      mat.envMapIntensity = 0.7;
    });
  }, [scene]);

  return (
    <Float speed={speed} floatIntensity={0.5} rotationIntensity={0.12}>
      <group rotation={rotation}>
        <primitive object={scene} position={[0, -HEIGHT / 2, 0]} />
      </group>
    </Float>
  );
};

export default Bunny;
