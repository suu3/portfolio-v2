"use client";

import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

/* shared materials — monotone, the laptop screen carries the one blue accent */
const charcoal = new THREE.MeshStandardMaterial({ color: "#232323", roughness: 0.85 });
const steel = new THREE.MeshStandardMaterial({ color: "#9a9a96", roughness: 0.35, metalness: 0.7 });
const shell = new THREE.MeshStandardMaterial({ color: "#d9d9d5", roughness: 0.4, metalness: 0.25 });
const shellDark = new THREE.MeshStandardMaterial({ color: "#3a3a38", roughness: 0.5 });
const screen = new THREE.MeshStandardMaterial({ color: "#0d0d0d", roughness: 0.3, emissive: "#2d3cff", emissiveIntensity: 0.55 });
const carrotSkin = new THREE.MeshStandardMaterial({ color: "#ff5a1f", roughness: 0.5 });
const carrotLeaf = new THREE.MeshStandardMaterial({ color: "#6f9a4a", roughness: 0.6 });

const noRaycast = () => null;

/* the lid logo: a carrot instead of a fruit — it's a rabbit's laptop */
const carrotBody = (() => {
  const s = new THREE.Shape();
  s.moveTo(-0.08, 0.05);
  s.quadraticCurveTo(0, 0.1, 0.08, 0.05);
  s.quadraticCurveTo(0.07, -0.08, 0.012, -0.23);
  s.quadraticCurveTo(0, -0.25, -0.012, -0.23);
  s.quadraticCurveTo(-0.07, -0.08, -0.08, 0.05);
  return new THREE.ShapeGeometry(s, 12);
})();

const carrotLeafGeo = (() => {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.quadraticCurveTo(0.045, 0.07, 0, 0.15);
  s.quadraticCurveTo(-0.045, 0.07, 0, 0);
  return new THREE.ShapeGeometry(s, 8);
})();

const CarrotLogo = (props: JSX.IntrinsicElements["group"]) => (
  <group {...props}>
    <mesh geometry={carrotBody} material={carrotSkin} raycast={noRaycast} />
    {[-0.5, 0, 0.5].map((r) => (
      <mesh
        key={r}
        geometry={carrotLeafGeo}
        material={carrotLeaf}
        position={[r * 0.05, 0.065, -0.001]}
        rotation={[0, 0, -r]}
        scale={r === 0 ? 1 : 0.85}
        raycast={noRaycast}
      />
    ))}
  </group>
);

/**
 * A stubby office chair, sized to the character (model units, feet at y = 0):
 * seat top lands just under the hips at y ≈ 1.15.
 */
export const OfficeChair = () => (
  <group>
    <RoundedBox args={[2.0, 0.32, 1.5]} radius={0.12} position={[0, 0.99, -0.2]} material={charcoal} raycast={noRaycast} />
    <RoundedBox
      args={[1.8, 1.75, 0.26]}
      radius={0.12}
      position={[0, 2.0, -1.02]}
      rotation={[-0.14, 0, 0]}
      material={charcoal}
      raycast={noRaycast}
    />
    <mesh position={[0, 0.5, -0.2]} material={steel} raycast={noRaycast}>
      <cylinderGeometry args={[0.08, 0.08, 0.9, 14]} />
    </mesh>
    {[0, 1, 2, 3, 4].map((i) => (
      <group key={i} rotation={[0, (i * Math.PI * 2) / 5 + 0.3, 0]} position={[0, 0.07, -0.2]}>
        <mesh position={[0, 0, 0.6]} material={charcoal} raycast={noRaycast}>
          <boxGeometry args={[0.16, 0.1, 1.2]} />
        </mesh>
        <mesh position={[0, -0.03, 1.15]} material={steel} raycast={noRaycast}>
          <sphereGeometry args={[0.1, 12, 8]} />
        </mesh>
      </group>
    ))}
  </group>
);

/**
 * Laptop held in front of the chest, lid open toward the viewer — we see its
 * back and the logo. Placed against the Sit clip: the paws land on the
 * keyboard (y ≈ 2.2, z ≈ 0.85) and the hinge sits past them, so no hand goes
 * through the lid.
 */
export const Laptop = () => (
  <group position={[0, 2.1, 0.74]}>
    <RoundedBox args={[1.55, 0.08, 0.8]} radius={0.03} material={shell} raycast={noRaycast} />
    {/* keyboard well */}
    <mesh position={[0, 0.045, -0.04]} rotation={[-Math.PI / 2, 0, 0]} material={shellDark} raycast={noRaycast}>
      <planeGeometry args={[1.3, 0.42]} />
    </mesh>
    <group position={[0, 0.02, 0.4]} rotation={[0.42, 0, 0]}>
      <RoundedBox args={[1.55, 1.05, 0.06]} radius={0.03} position={[0, 0.52, 0]} material={shell} raycast={noRaycast} />
      {/* glowing panel faces the character */}
      <mesh position={[0, 0.52, -0.035]} rotation={[0, Math.PI, 0]} material={screen} raycast={noRaycast}>
        <planeGeometry args={[1.4, 0.9]} />
      </mesh>
      <CarrotLogo position={[0, 0.56, 0.036]} rotation={[0, 0, -Math.PI / 4]} scale={1.15} />
    </group>
  </group>
);
