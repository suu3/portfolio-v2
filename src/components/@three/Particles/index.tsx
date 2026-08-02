import { useRef } from "react";
import * as THREE from "three";

const particlesCount = 100;

const Particles = () => {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = new Float32Array(particlesCount * 3);
  for (let i = 0; i < particlesCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }

  return (
    <points ref={pointsRef}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={particlesCount}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        attach="material"
        size={0.1}
        color="black"
        sizeAttenuation
        transparent
        opacity={0.7}
        // emissive="white"
        // emissiveIntensity={1}
      />
    </points>
  );
};

export default Particles;
