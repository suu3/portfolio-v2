import { readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
// decode the meshopt GLB with three (from this repo) and write one OBJ per part + info.json
const NM = new URL("../../node_modules/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const THREE = await import(pathToFileURL(NM + "three/build/three.module.js").href);
const { GLTFLoader } = await import(pathToFileURL(NM + "three/examples/jsm/loaders/GLTFLoader.js").href);
const { MeshoptDecoder } = await import(pathToFileURL(NM + "three/examples/jsm/libs/meshopt_decoder.module.js").href);
const { OBJExporter } = await import(pathToFileURL(NM + "three/examples/jsm/exporters/OBJExporter.js").href);

const file = process.argv[2];
const out = process.argv[3];
const buf = readFileSync(file);
const loader = new GLTFLoader();
loader.setMeshoptDecoder(MeshoptDecoder);
await MeshoptDecoder.ready;
const gltf = await new Promise((res, rej) => loader.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength), "", res, rej));
gltf.scene.updateMatrixWorld(true);
const info = [];
gltf.scene.traverse((o) => {
  if (!o.isMesh) return;
  // quantized (normalized int) attributes clamp to [-1,1] if transformed in place
  const src = o.geometry;
  const g = new THREE.BufferGeometry();
  const pos = src.attributes.position;
  const arr = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) { arr[i * 3] = pos.getX(i); arr[i * 3 + 1] = pos.getY(i); arr[i * 3 + 2] = pos.getZ(i); }
  g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
  if (src.index) g.setIndex(src.index.clone());
  g.applyMatrix4(o.matrixWorld);
  g.computeVertexNormals();
  g.computeBoundingBox();
  const b = g.boundingBox;
  const m = o.material;
  info.push({ name: o.name, verts: g.attributes.position.count, min: b.min.toArray().map((v) => +v.toFixed(3)), max: b.max.toArray().map((v) => +v.toFixed(3)),
    color: m.color ? "#" + m.color.getHexString() : null, rough: m.roughness, metal: m.metalness, mat: m.name });
  const mesh = new THREE.Mesh(g, new THREE.MeshBasicMaterial());
  const obj = new OBJExporter().parse(mesh);
  writeFileSync(`${out}/${o.name.replace(/[^\w.-]/g, "_")}.obj`, obj);
});
writeFileSync(`${out}/info.json`, JSON.stringify(info, null, 2));
console.log(JSON.stringify(info, null, 1));
