"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const TorusWireframe = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <mesh ref={meshRef} scale={2} position={[2, 0, 0]}>
      {/* icosahedronGeometry를 사용할 때 인자 필요 없음 */}
      <icosahedronGeometry />
      {/* torusGeometry를 사용하고자 할 때 올바른 인자를 제공 */}
      {/* <torusGeometry args={[1, 0.4, 16, 100]} /> */}

      <meshBasicMaterial wireframe color="gray" />
    </mesh>
  );
};

export default TorusWireframe;
