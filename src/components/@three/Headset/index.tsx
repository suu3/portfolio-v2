"use client";

import * as THREE from "three";

/*
 * Built in the Head bone's space: origin at the neck, +y up, +z toward the
 * face, x across. From the GLB: eyes sit at y ≈ 0.65, z ≈ 0.93; the ears stick
 * out at x ≈ ±1.43 around y ≈ 0.67; the top of the hair is at y ≈ 2.26.
 */

const shell = new THREE.MeshStandardMaterial({ color: "#f4f3ef", roughness: 0.45 });
const cushion = new THREE.MeshStandardMaterial({ color: "#2a2a2c", roughness: 0.9 });
const accent = new THREE.MeshStandardMaterial({ color: "#fa662e", roughness: 0.5 });
const dark = new THREE.MeshStandardMaterial({ color: "#1b1b1d", roughness: 0.6 });

const EAR_X = 1.44;
const EAR_Y = 0.7;
const BAND_CY = 0.9;

/* headband: an arc over the hair from one cup to the other */
const bandGeo = new THREE.TorusGeometry(EAR_X - 0.06, 0.085, 14, 64, Math.PI);
const bandPadGeo = new THREE.TorusGeometry(EAR_X - 0.14, 0.06, 12, 48, Math.PI * 0.62);
const cupGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.22, 40);
const capGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.05, 32);
const padGeo = new THREE.TorusGeometry(0.3, 0.1, 14, 40);
const yokeGeo = new THREE.CapsuleGeometry(0.05, 0.42, 6, 12);

/* mic boom: from the left cup, curving round toward the mouth */
const boomCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-EAR_X - 0.08, EAR_Y - 0.12, 0.12),
  new THREE.Vector3(-1.38, 0.28, 0.62),
  new THREE.Vector3(-0.95, 0.12, 1.02),
  new THREE.Vector3(-0.48, 0.2, 1.12),
]);
const boomGeo = new THREE.TubeGeometry(boomCurve, 40, 0.04, 10, false);
const micGeo = new THREE.CapsuleGeometry(0.075, 0.14, 8, 16);

const noRaycast = () => null;

/**
 * Over-ear headset for the character — white shell, charcoal cushions, an
 * orange cap on each cup and a boom mic. Parent it to the Head bone so it
 * turns with the look-at.
 */
const Headset = () => (
  <group>
    {/* band, centred over the hair, a hair's breadth behind the crown */}
    <group position={[0, BAND_CY, -0.12]}>
      <mesh geometry={bandGeo} material={shell} raycast={noRaycast} />
      <mesh geometry={bandPadGeo} material={cushion} position={[0, 0, 0]} rotation={[0, 0, Math.PI * 0.19]} raycast={noRaycast} />
    </group>

    {[-1, 1].map((side) => (
      <group key={side} position={[side * EAR_X, EAR_Y, -0.02]}>
        {/* yoke joining band to cup */}
        <mesh geometry={yokeGeo} material={shell} position={[side * 0.02, 0.36, -0.1]} raycast={noRaycast} />
        {/* cup faces sideways: cylinder axis along x */}
        <group rotation={[0, 0, Math.PI / 2]}>
          <mesh geometry={cupGeo} material={shell} raycast={noRaycast} />
          <mesh geometry={capGeo} material={accent} position={[0, -side * 0.125, 0]} raycast={noRaycast} />
        </group>
        <mesh geometry={padGeo} material={cushion} position={[-side * 0.12, 0, 0]} rotation={[0, Math.PI / 2, 0]} raycast={noRaycast} />
      </group>
    ))}

    <mesh geometry={boomGeo} material={dark} raycast={noRaycast} />
    <mesh geometry={micGeo} material={dark} position={[-0.44, 0.2, 1.13]} rotation={[0, 0, Math.PI / 2]} raycast={noRaycast} />
  </group>
);

export default Headset;
