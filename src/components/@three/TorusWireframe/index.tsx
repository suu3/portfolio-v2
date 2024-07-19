"use client";

import React, { useRef, ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { BBAnchor, Html, Icosahedron } from "@react-three/drei";

interface TorusWireframeProps {
  children?: ReactNode;
  drawBoundingBox?: boolean;
  secondChildren?: ReactNode;
}

const TorusWireframe: React.FC<TorusWireframeProps> = ({
  children,
  drawBoundingBox = true,
  secondChildren,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <mesh ref={meshRef} position={[1.5, 0.5, 0]}>
      <Icosahedron ref={ref} scale={1}>
        <meshBasicMaterial wireframe color="hotpink" />
        <BBAnchor anchor={[1, -1, 1]}>{children}</BBAnchor>
        <BBAnchor anchor={[-1, 1, -1]}>{secondChildren}</BBAnchor>
      </Icosahedron>
    </mesh>
  );
};

export default TorusWireframe;

interface HtmlCompProps {
  children: ReactNode;
}

export const HtmlComp: React.FC<HtmlCompProps> = ({ children }) => {
  return (
    <Html
      style={{
        color: "white",
        whiteSpace: "nowrap",
      }}
      center
    >
      {children}
    </Html>
  );
};
