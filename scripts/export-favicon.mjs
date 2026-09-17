// Reuse the site's pixel rabbit for both modern SVG and legacy ICO favicons.
// Run: node scripts/export-favicon.mjs
import { readFileSync, writeFileSync } from "node:fs";

const source = readFileSync(new URL("../src/components/PixelRabbit/index.tsx", import.meta.url), "utf8");
const grid = source.match(/const PIXELS = \[([\s\S]*?)\];/)?.[1];
if (!grid) throw new Error("PixelRabbit bitmap not found");
const rows = [...grid.matchAll(/"([.XB]+)"/g)].map((match) => match[1]);
if (rows.length !== 8 || rows.some((row) => row.length !== 6)) {
  throw new Error("Expected the logo's 6 × 8 rabbit bitmap");
}

const paper = [237, 237, 235];
const ink = [17, 17, 17];
const orange = [255, 90, 31];

function bitmap(size) {
  const cell = Math.floor(size / 8);
  const left = (size - 6 * cell) / 2;
  const pixels = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const symbol = rows[Math.floor(y / cell)]?.[Math.floor((x - left) / cell)];
      const [r, g, b] = symbol === "X" ? ink : symbol === "B" ? orange : paper;
      const offset = ((size - 1 - y) * size + x) * 4; // ICO DIBs are bottom-up BGRA.
      pixels.set([b, g, r, 255], offset);
    }
  }
  const mask = Buffer.alloc(Math.ceil(size / 32) * 4 * size);
  const header = Buffer.alloc(40);
  header.writeUInt32LE(40, 0);
  header.writeInt32LE(size, 4);
  header.writeInt32LE(size * 2, 8); // Includes the AND mask's height.
  header.writeUInt16LE(1, 12);
  header.writeUInt16LE(32, 14);
  header.writeUInt32LE(pixels.length + mask.length, 20);
  return Buffer.concat([header, pixels, mask]);
}

const sizes = [16, 32, 48];
const images = sizes.map(bitmap);
const directory = Buffer.alloc(6 + sizes.length * 16);
directory.writeUInt16LE(1, 2);
directory.writeUInt16LE(sizes.length, 4);
let offset = directory.length;
sizes.forEach((size, index) => {
  const entry = 6 + index * 16;
  directory[entry] = directory[entry + 1] = size;
  directory.writeUInt16LE(1, entry + 4);
  directory.writeUInt16LE(32, entry + 6);
  directory.writeUInt32LE(images[index].length, entry + 8);
  directory.writeUInt32LE(offset, entry + 12);
  offset += images[index].length;
});
writeFileSync(new URL("../src/app/favicon.ico", import.meta.url), Buffer.concat([directory, ...images]));

const rects = rows.flatMap((row, y) => [...row].flatMap((pixel, x) => pixel === "." ? [] : [
  `  <rect x="${x + 1}" y="${y}" width="1" height="1" fill="${pixel === "B" ? "#ff5a1f" : "#111111"}"/>`,
]));
writeFileSync(new URL("../src/app/icon.svg", import.meta.url), [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8" shape-rendering="crispEdges">',
  '  <rect width="8" height="8" fill="#ededeb"/>',
  ...rects,
  '</svg>',
  '',
].join("\n"));
console.log("Generated rabbit favicon.ico (16/32/48px) and icon.svg");
