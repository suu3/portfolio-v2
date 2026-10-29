import { useRef, useState } from "react";
import * as THREE from "three";

const particlesCount = 100;

const Particles = () => {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions] = useState(() => {
    const values = new Float32Array(particlesCount * 3);
    for (let i = 0; i < values.length; i++) {
      values[i] = (Math.random() - 0.5) * 10;
    }
    return values;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
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
