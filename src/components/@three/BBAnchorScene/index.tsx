import {
  BBAnchor,
  useHelper,
  OrbitControls,
  Icosahedron,
} from "@react-three/drei";
import React, { ComponentProps } from "react";
import * as THREE from "three";
import { BoxHelper } from "three";

function BBAnchorScene({
  drawBoundingBox,
  children,
  ...props
}: ComponentProps<typeof BBAnchor> & {
  drawBoundingBox: boolean;
  children?: React.ReactNode;
}) {
  const ref = React.useRef<THREE.Object3D>(null);

  useHelper(drawBoundingBox && ref, BoxHelper, "cyan");

  return (
    <>
      <OrbitControls autoRotate />
      <Icosahedron ref={ref}>
        <meshBasicMaterial color="hotpink" wireframe />
        <BBAnchor {...props}>{children}</BBAnchor>
      </Icosahedron>
    </>
  );
}

export default BBAnchorScene;
