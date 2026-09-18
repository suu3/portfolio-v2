"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

/**
 * GPU backdrop for the hero, two looks from one shader:
 *
 * - "grid": graph paper that only shows through a few soft, drifting round
 *   patches. The pointer is a loupe — the paper appears and bulges under it,
 *   lines turning signal-blue; a fast scroll makes horizontal bands jump
 *   sideways in snapped steps (a glitch, not a cloth wave).
 * - "halftone": square dots sized by slowly flowing fbm noise, same loupe.
 *
 * Colours are written straight out as sRGB (no colorspace chunk), so they match
 * the CSS tokens exactly.
 */
const HalftoneMaterial = shaderMaterial(
  {
    uTime: 0,
    uRes: new THREE.Vector2(1, 1),
    uMouse: new THREE.Vector2(-9999, -9999),
    uMouseOn: 0,
    uVel: 0,
    uCell: 14,
    uMode: 0,
    uInk: new THREE.Color(0.067, 0.067, 0.067),
    uLens: new THREE.Color(0.176, 0.235, 1.0),
  },
  /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `,
  /* glsl */ `
    uniform float uTime;
    uniform vec2 uRes;
    uniform vec2 uMouse;
    uniform float uMouseOn;
    uniform float uVel;
    uniform float uCell;
    uniform float uMode;
    uniform vec3 uInk;
    uniform vec3 uLens;
    varying vec2 vUv;

    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
    }
    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      for (int i = 0; i < 4; i++) {
        v += a * noise(p);
        p = p * 2.03 + 11.7;
        a *= 0.5;
      }
      return v;
    }

    void main() {
      // css px, top-left origin (same space as the pointer)
      vec2 px = vec2(vUv.x, 1.0 - vUv.y) * uRes;

      // loupe: sample closer to the pointer, so everything around it swells
      vec2 d = px - uMouse;
      float lens = exp(-dot(d, d) / (2.0 * 115.0 * 115.0)) * uMouseOn;
      vec2 q = px - d * lens * 0.42;
      float blue = smoothstep(0.12, 0.55, lens);
      vec3 col = mix(uInk, uLens, blue);

      if (uMode < 0.5) {
        // glitch: some horizontal bands jump sideways while scrolling fast
        float band = floor(px.y / 38.0);
        float tick = floor(uTime * 12.0);
        float pick = step(0.6, hash(vec2(band * 1.7, tick + 3.0)));
        float amt = smoothstep(3.0, 22.0, abs(uVel));
        q.x += (hash(vec2(band, tick)) - 0.5) * 2.0 * 34.0 * amt * pick;

        // one weight of line — no major/minor split (that read as a sudoku board)
        vec2 dg = abs(fract(q / uCell + 0.5) - 0.5) * uCell;
        float line = 1.0 - smoothstep(0.1, 1.0, min(dg.x, dg.y));

        // the paper only shows through a few soft, slowly drifting patches
        float spots = 0.0;
        for (int i = 0; i < 7; i++) {
          float fi = float(i);
          vec2 c = vec2(hash(vec2(fi, 1.3)), hash(vec2(fi, 7.1))) * uRes;
          c += vec2(sin(uTime * 0.08 + fi * 1.7), cos(uTime * 0.06 + fi * 2.3)) * 70.0;
          float r = mix(150.0, 320.0, hash(vec2(fi, 4.2)));
          float k = length(px - c) / r;
          spots = max(spots, (1.0 - smoothstep(0.0, 1.0, k)) * mix(0.55, 1.0, hash(vec2(fi, 9.9))));
        }
        float show = max(spots, smoothstep(0.02, 0.35, lens));

        float alpha = line * show * mix(0.22, 0.9, blue);
        gl_FragColor = vec4(col, alpha);
        return;
      }

      // halftone
      q.y += sin(q.x * 0.018 - uTime * 6.0) * uVel * 0.7;
      vec2 id = floor(q / uCell);
      vec2 f = fract(q / uCell) - 0.5;
      vec2 p = id * 0.085;
      float warp = fbm(p * 0.8 - vec2(uTime * 0.035, uTime * 0.02));
      float n = fbm(p + vec2(uTime * 0.05, -uTime * 0.03) + warp * 1.4);
      float v = smoothstep(0.38, 0.78, n);
      v = max(v, smoothstep(0.05, 0.6, lens) * 0.85);
      float half_ = 0.5 * mix(0.1, 0.72, v);
      vec2 e = abs(f) - half_;
      float aa = 1.0 / uCell;
      float box = 1.0 - smoothstep(-aa * 0.5, aa * 0.5, max(e.x, e.y));
      float alpha = box * mix(mix(0.12, 0.3, v), 0.95, blue);
      gl_FragColor = vec4(col, alpha);
    }
  `
);

extend({ HalftoneMaterial });

type HalftoneMaterialImpl = THREE.ShaderMaterial & {
  uTime: number;
  uRes: THREE.Vector2;
  uMouse: THREE.Vector2;
  uMouseOn: number;
  uVel: number;
  uCell: number;
  uMode: number;
};

declare module "@react-three/fiber" {
  interface ThreeElements {
    halftoneMaterial: import("@react-three/fiber").Object3DNode<HalftoneMaterialImpl, typeof HalftoneMaterial>;
  }
}

type Variant = "grid" | "halftone";

const Field = ({ host, variant }: { host: HTMLElement; variant: Variant }) => {
  const mat = useRef<HalftoneMaterialImpl>(null);
  const { size } = useThree();
  const reduce = useMemo(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);
  const s = useRef({ mx: -9999, my: -9999, tx: -9999, ty: -9999, on: 0, tOn: 0, seen: false, last: window.scrollY, vel: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const st = s.current;
      st.tx = x;
      st.ty = y;
      st.tOn = x >= 0 && y >= 0 && x <= r.width && y <= r.height && e.pointerType === "mouse" ? 1 : 0;
      if (!st.seen) {
        st.mx = x;
        st.my = y;
        st.seen = true;
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [host]);

  useFrame((_, dt) => {
    const m = mat.current;
    if (!m) return;
    const st = s.current;
    const sy = window.scrollY;
    st.vel += (THREE.MathUtils.clamp(sy - st.last, -48, 48) - st.vel) * 0.12;
    st.last = sy;
    const k = 1 - Math.exp(-dt * 10);
    st.mx += (st.tx - st.mx) * k;
    st.my += (st.ty - st.my) * k;
    st.on += (st.tOn - st.on) * (1 - Math.exp(-dt * 5));

    if (!reduce) m.uTime += dt;
    m.uRes.set(size.width, size.height);
    m.uMouse.set(st.mx, st.my);
    m.uMouseOn = st.on;
    m.uVel = reduce ? 0 : st.vel;
    m.uMode = variant === "grid" ? 0 : 1;
    // grid cells match the 48px drafting grid on the light sections (ui.ts paperGridCls)
    m.uCell = variant === "grid" ? 48 : size.width < 768 ? 12 : 14;
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <halftoneMaterial ref={mat} transparent depthWrite={false} depthTest={false} />
    </mesh>
  );
};

const ShaderBackdrop = ({ className, variant = "grid" }: { className?: string; variant?: Variant }) => {
  const wrap = useRef<HTMLDivElement>(null);
  const [host, setHost] = useState<HTMLElement>();
  const [onScreen, setOnScreen] = useState(true);
  const [touch, setTouch] = useState(false);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    setHost(el);
    setTouch(window.matchMedia("(pointer: coarse)").matches);
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting));
    io.observe(el);
    // R3F measures before creating the renderer; wake it in tabs that load hidden
    const nudge = () => window.dispatchEvent(new Event("resize"));
    const timers = [0, 150, 400].map((ms) => window.setTimeout(nudge, ms));
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div ref={wrap} className={className} style={{ pointerEvents: "none" }} aria-hidden>
      {host && (
        <Canvas
          flat
          // Thin grid lines alias badly below the display's own resolution and
          // this one has no multisampling to fall back on — so the display's
          // resolution it is, except on a phone, where the full-bleed canvas at
          // 2x would cost more fill than the character does.
          dpr={touch ? [1, 1.5] : [1, 2]}
          frameloop={onScreen ? "always" : "never"}
          gl={{ antialias: false, alpha: true }}
          style={{ position: "absolute", inset: 0 }}
        >
          <Field host={host} variant={variant} />
        </Canvas>
      )}
    </div>
  );
};

export default ShaderBackdrop;
