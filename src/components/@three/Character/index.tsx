"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ThreeEvent, createPortal, useFrame, useThree } from "@react-three/fiber";
import { Html, useAnimations, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { sfx } from "@/lib/sfx";
import { workScroll } from "@/lib/workScroll";
import Bunny from "@/components/@three/Bunny";
import Headset from "@/components/@three/Headset";
import { CodeGlyph, Keyboard, Rocket, Star } from "@/components/@three/DeskToys";
import { Laptop, OfficeChair } from "@/components/@three/Props";
import { CLIPS, MODEL_HEIGHT, TrackState, computeTrack, emptyTrack } from "./track";
import styles from "./bubble.module.css";

/**
 * Baked + rigged from `mycharactor_rabbit_theme_v2.blend` by
 * scripts/export-character.py: one skinned mesh, 13 bones, six clips.
 */
export const MODEL_URL = "/models/character.glb?v=soft-20260918-5";
const DRACO = "/draco/";

useGLTF.preload(MODEL_URL, DRACO);

/** Click-to-advance easter egg. Reads like a machine slowly losing patience. */
const LINES = [
  "", // first line depends on the device, see below
  "status: online",
  "input received",
  "input received ×2",
  "scanning for easter egg...",
  "result: 0 found",
  "retry? y/n",
  "> y",
  "result: still 0 found",
  "session logged. thanks.",
];

const hint = (label: string | null) =>
  window.dispatchEvent(new CustomEvent("cursor:hint", { detail: label }));

/** radius of the capsule the pointer is picked against — see the mesh below */
const HIT_RADIUS = 1.5;

const damp = THREE.MathUtils.damp;
const clamp = THREE.MathUtils.clamp;

/** soft flat drop shadow — a 2D smudge under a 3D figure, on purpose */
const shadowTexture = () => {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, "rgba(0,0,0,0.42)");
  grd.addColorStop(0.55, "rgba(0,0,0,0.16)");
  grd.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
};

/* the desk-mates fly off in different directions when the desk is left behind.
   Positions are in character model units around the hero placement. */
const DESK = [
  // the rabbit doll sits low at the character's left and looks at them
  { kind: "bunny", at: [-2.7, 1.2, 0.9], size: 0.82, speed: 1.1, fly: [-6, -3, 2] },
  { kind: "code", at: [-2.5, 4.9, 0.4], size: 0.62, speed: 1.3, fly: [-6, 5, 1] },
  { kind: "star", at: [2.7, 3.9, -0.4], size: 0.62, speed: 1.5, fly: [7, 4, -1] },
  { kind: "keys", at: [3.1, 2.0, 0.6], size: 0.5, speed: 1.2, fly: [7, -4, 2] },
] as const;

const Character = ({ touch }: { touch: boolean }) => {
  const { scene, animations, nodes } = useGLTF(MODEL_URL, DRACO);
  const { size, viewport } = useThree();

  const root = useRef<THREE.Group>(null); // page position + scale
  const rig = useRef<THREE.Group>(null); // yaw / roll / hop
  const props = useRef<THREE.Group>(null);
  const chair = useRef<THREE.Group>(null);
  const laptop = useRef<THREE.Group>(null);
  const shadow = useRef<THREE.Mesh>(null);
  const deskRefs = useRef<(THREE.Group | null)[]>([]);
  const rocket = useRef<THREE.Group>(null);
  const headset = useRef<THREE.Group>(null);

  const { actions } = useAnimations(animations, rig);
  const head = useMemo(() => nodes.Head as THREE.Object3D | undefined, [nodes]);
  const eyes = useMemo(() => [nodes.EyeL, nodes.EyeR].filter(Boolean) as THREE.Object3D[], [nodes]);
  const shadowTex = useMemo(shadowTexture, []);

  const [line, setLine] = useState(0);
  const [pop, setPop] = useState(false);

  const s = useRef({
    track: emptyTrack(),
    hopT: -1,
    blinkT: -1,
    nextBlink: 1.5,
    doubleBlink: false,
    lastScroll: 0,
    vel: 0,
    run: 0,
    runDir: 1,
    lastProgress: 0,
    yaw: 0,
    roll: 0,
  });

  useLayoutEffect(() => {
    s.current.lastScroll = window.scrollY;
    scene.traverse((o) => {
      const mesh = o as THREE.SkinnedMesh;
      if (!mesh.isMesh) return;
      mesh.frustumCulled = false; // bones move it further than its rest bounds
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.envMapIntensity = 0.85;
    });
  }, [scene]);

  // every clip plays all the time; the track decides how much of each shows
  useEffect(() => {
    for (const c of CLIPS) {
      const a = actions[c];
      if (!a) continue;
      a.reset().play();
      a.setEffectiveWeight(c === "Sit" ? 1 : 0);
    }
  }, [actions]);

  const poke = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    // the canvas never catches events itself; don't double up on a real link underneath
    const target = e.nativeEvent.target as HTMLElement | null;
    if (target?.closest?.("a, button")) return;
    s.current.hopT = 0;
    setLine((n) => {
      const next = (n + 1) % LINES.length;
      sfx.step(next);
      return next;
    });
    setPop(true);
    window.setTimeout(() => setPop(false), 160);
  };

  const enter = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    hint("Poke");
  };
  const leave = () => hint(null);

  useFrame((state, dt) => {
    const g = root.current;
    const r = rig.current;
    if (!g || !r) return;
    const st = s.current;
    const tr: TrackState = st.track;
    const t = state.clock.elapsedTime;
    const { x: px, y: py } = state.pointer;

    computeTrack(tr, window.scrollY, {
      vw: size.width,
      vh: size.height,
      worldW: viewport.width,
      worldH: viewport.height,
    });

    // scroll velocity (px / frame, smoothed) — the whole figure leans into it
    const sy = window.scrollY;
    st.vel += (clamp(sy - st.lastScroll, -80, 80) - st.vel) * 0.1;
    st.lastScroll = sy;

    // running = the horizontal section is actually moving under us
    const dp = workScroll.progress - st.lastProgress;
    st.lastProgress = workScroll.progress;
    const speed = Math.abs(dp) / Math.max(dt, 1e-3); // progress per second
    if (Math.abs(dp) > 1e-5) st.runDir = Math.sign(dp);
    const runTarget = workScroll.active ? clamp(speed * 3.2, 0, 1) : 0;
    st.run = damp(st.run, runTarget, runTarget > st.run ? 12 : 4, dt);
    const run = st.run * tr.work;

    // page position + size
    g.position.set(tr.x, tr.y, 0);
    g.scale.setScalar(tr.scale);

    // facing: the stop's yaw, a nudge toward the pointer, and the run direction
    const yawTarget = tr.yaw + px * 0.12 * (1 - run) + st.runDir * 1.3 * run;
    st.yaw = damp(st.yaw, yawTarget, 5, dt);
    st.roll = damp(st.roll, tr.roll, 6, dt);
    r.rotation.set(0, st.yaw, st.roll);
    r.rotation.x = clamp(-st.vel * 0.004, -0.1, 0.1) * (1 - tr.float);

    // clips: Idle splits into Idle/Run by how fast the cards are moving
    const w = tr.weights;
    const idle = w.Idle * (1 - run);
    const runW = w.Idle * run;
    for (const c of CLIPS) {
      const a = actions[c];
      if (!a) continue;
      const target = c === "Idle" ? idle : c === "Run" ? runW : w[c];
      a.setEffectiveWeight(damp(a.getEffectiveWeight(), target, 10, dt));
    }
    const runAction = actions.Run;
    if (runAction) runAction.timeScale = 0.7 + 1.3 * st.run;

    // blink: squash the eye bones shut for ~130ms every few seconds, now and
    // then twice in a row. Runs after the mixer, which rewrites their rest scale.
    if (st.blinkT < 0 && t >= st.nextBlink) {
      st.blinkT = 0;
      st.doubleBlink = Math.random() < 0.22;
      st.nextBlink = t + 2.5 + Math.random() * 3.5;
    }
    let lid = 1;
    if (st.blinkT >= 0) {
      st.blinkT += dt;
      const p = st.blinkT / 0.13;
      if (p >= 1) {
        st.blinkT = -1;
        if (st.doubleBlink) {
          st.doubleBlink = false;
          st.nextBlink = t + 0.09;
        }
      } else {
        lid = 1 - Math.sin(p * Math.PI) * 0.92;
      }
    }
    for (const e of eyes) e.scale.y = lid;

    // The idle float, and the head's share of it. The head used to nod on a sine
    // of its own — 1.3 rad/s against the float's 1.4. Close enough to look like
    // one motion, far enough apart that the two drifted a full cycle every ~60s,
    // so with the pointer sitting still (the look-at settled, nothing else
    // moving) the head bobbed on and on out of step with the body. Worse at the
    // stops that don't float: there it nodded away on its own with nothing to
    // nod along with. One wave for both now, the head a beat behind the body the
    // way a head trails the rest of you, and only where there is a float to lag.
    const floatWave = Math.sin(t * 1.4);
    const headLag = Math.sin(t * 1.4 - 0.7) * 0.015 * tr.float;

    // the head follows the pointer; less so while sprinting sideways
    if (head) {
      const k = 1 - run * 0.8;
      head.rotation.y = damp(head.rotation.y, px * 0.5 * k, 6, dt);
      head.rotation.x = damp(head.rotation.x, (-py * 0.2 + 0.03 + headLag) * k, 6, dt);
      head.rotation.z = damp(head.rotation.z, -px * 0.07 * k, 4, dt);
    }

    // float + hop with squash & stretch
    let lift = floatWave * 0.12 * tr.float;
    let sq = 1;
    if (st.hopT >= 0) {
      st.hopT += dt;
      const p = st.hopT / 0.46;
      if (p >= 1) st.hopT = -1;
      else {
        lift += Math.sin(p * Math.PI) * 0.9;
        sq *= p < 0.12 ? 1 - p * 0.9 : 1 + Math.sin(p * Math.PI) * 0.05;
      }
    }
    r.position.y = lift;
    r.scale.set(1 / Math.sqrt(sq), sq, 1 / Math.sqrt(sq));

    // desk props: sit with the character, fly off as the desk is left behind
    const gone = 1 - tr.hero;
    if (props.current) props.current.visible = tr.hero > 0.01;
    if (chair.current) {
      chair.current.position.set(-3 * gone, 2.6 * gone, 0.8 * gone);
      chair.current.rotation.set(0.4 * gone, 0, 1.8 * gone);
      chair.current.scale.setScalar(1 - gone);
    }
    if (laptop.current) {
      laptop.current.position.set(2.6 * gone, 3.4 * gone, 0.4 * gone);
      laptop.current.rotation.set(-0.6 * gone, 0, -2.2 * gone);
      laptop.current.scale.setScalar(1 - gone);
    }
    // on narrow screens the desk is centred with little room either side: pull
    // the toys in toward the character and shrink them a touch
    const spread = size.width < 1024 ? 0.6 : 1;
    const shrink = size.width < 1024 ? 0.78 : 1;
    deskRefs.current.forEach((rb, i) => {
      if (!rb) return;
      const d = DESK[i];
      rb.visible = tr.hero > 0.01;
      rb.position.set(
        tr.heroX + (d.at[0] * spread + d.fly[0] * gone) * tr.heroScale,
        tr.heroY + (d.at[1] + d.fly[1] * gone) * tr.heroScale,
        d.at[2] * tr.heroScale
      );
      rb.scale.setScalar(tr.heroScale * d.size * shrink * (1 - gone));
      rb.rotation.z = gone * 3;
    });

    if (headset.current) {
      const hs = headset.current;
      hs.visible = tr.hero > 0.01;
      // head-bone space: pops up off the head and spins away to the upper right
      hs.position.set(3.2 * gone, 4.5 * gone, 1.2 * gone);
      hs.rotation.set(-0.8 * gone, 0.6 * gone, -2.6 * gone);
      hs.scale.setScalar(1 - gone);
    }

    // Work: a toy rocket crosses the gap between the cards and the floor, pushed
    // along by the horizontal scroll. Only while pinned — on the stacked layout
    // there is no empty strip and it would fly over the card copy.
    if (rocket.current) {
      const R = rocket.current;
      R.visible = tr.work > 0.02 && workScroll.active;
      if (R.visible) {
        const W = viewport.width;
        const H = viewport.height;
        const p = workScroll.progress;
        R.position.set((-0.62 + p * 1.24) * W, (0.5 - 0.69) * H + Math.sin(t * 2.2) * H * 0.012, 1);
        R.scale.setScalar(H * 0.028 * tr.work);
        R.rotation.set(0.2, 0.35, -Math.PI / 2 + Math.sin(t * 3) * 0.06);
      }
    }

    if (shadow.current) {
      const m = shadow.current.material as THREE.MeshBasicMaterial;
      m.opacity = tr.ground;
      shadow.current.visible = tr.ground > 0.01;
    }
  });

  return (
    <>
      <group ref={root}>
        <group ref={rig}>
          <primitive object={scene} />
          {/* The pointer is picked against this capsule, not the figure itself.
              R3F raycasts every interactive object on every pointermove over the
              page, and a skinned raycast re-skins each vertex it walks: with the
              handlers on the model's 122k triangles one move cost ~40ms whenever
              the cursor sat over the character, starving the frame loop — the
              head's look-at stuttered along with it. A coarse stand-in also keeps
              the hover hint steady as the silhouette shifts under a still cursor. */}
          <mesh visible={false} position={[0, MODEL_HEIGHT / 2, 0]} onClick={poke} onPointerOver={enter} onPointerOut={leave}>
            <capsuleGeometry args={[HIT_RADIUS, MODEL_HEIGHT - HIT_RADIUS * 2, 4, 8]} />
          </mesh>
          {/* headset rides on the head bone (turns with the look-at) and, like the
              other desk things, comes off and flies away when the desk is left */}
          {head &&
            createPortal(
              <group ref={headset}>
                <Headset />
              </group>,
              head
            )}
          <group ref={props}>
            <group ref={chair}>
              <OfficeChair />
            </group>
            <group ref={laptop}>
              <Laptop />
            </group>
          </group>

          <Html center position={[0, MODEL_HEIGHT + 0.75, 0]} zIndexRange={[40, 30]} style={{ pointerEvents: "none" }}>
            <div className={`${styles.bubble} ${pop ? styles.pop : ""}`}>
              {line === 0 ? (touch ? "hi. tap me" : "hi. poke me") : LINES[line]}
            </div>
          </Html>
        </group>

        <mesh ref={shadow} position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[3.4, 2.2, 1]} renderOrder={-1}>
          <planeGeometry />
          <meshBasicMaterial map={shadowTex} transparent depthWrite={false} />
        </mesh>
      </group>

      {DESK.map((d, i) => (
        <group
          key={d.kind}
          ref={(el) => {
            deskRefs.current[i] = el;
          }}
        >
          {d.kind === "bunny" ? (
            <Bunny rotation={[0.05, 0.5, 0]} speed={d.speed} />
          ) : d.kind === "code" ? (
            <CodeGlyph speed={d.speed} />
          ) : d.kind === "keys" ? (
            <Keyboard speed={d.speed} />
          ) : (
            <Star speed={d.speed} />
          )}
        </group>
      ))}

      <group ref={rocket} visible={false}>
        <Rocket />
      </group>
    </>
  );
};

export default Character;
