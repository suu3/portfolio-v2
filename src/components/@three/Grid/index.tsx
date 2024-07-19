import React from "react";

const gridConfig = {
  cellSize: { value: 0.6, min: 0, max: 10, step: 0.1 },
  cellThickness: { value: 1, min: 0, max: 5, step: 0.1 },
  cellColor: "#6f6f6f",
  sectionSize: { value: 1.3, min: 0, max: 10, step: 0.1 },
  sectionThickness: { value: 1.5, min: 0, max: 5, step: 0.1 },
  sectionColor: "#6f6f6f",
  fadeDistance: { value: 25, min: 0, max: 100, step: 1 },
  fadeStrength: { value: 1, min: 0, max: 1, step: 0.1 },
  followCamera: false,
  infiniteGrid: true,
};
const Grid = () => {
  return (
    <group
      position={[0, -0.01, 0]}
      rotation={[Math.PI / 1.5, Math.PI / -2.0, Math.PI / 2]}
    >
      <gridHelper args={[10.5, 10.5]} {...gridConfig} />
    </group>
  );
};

export default Grid;
