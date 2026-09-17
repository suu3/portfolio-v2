/**
 * Where the character is on the page, as a function of scroll.
 *
 * Sections mark an element with `data-char-anchor="<stop>"`. Each stop turns
 * that element's on-screen rect into a placement (feet position + standing
 * height, in px) and a pose. Between stops the character travels from one
 * placement to the next while the next anchor scrolls into view, so it reads
 * like something that lives on the page rather than a sticker on the viewport.
 */
import { MathUtils } from "three";

export const MODEL_HEIGHT = 5.5;
/** hip joint height in model units — Perch/Sit pivot on it */
export const HIPS_Y = 1.37;

export type Clip = "Idle" | "Sit" | "Perch" | "Run" | "Wave" | "Lounge";
export const CLIPS: Clip[] = ["Idle", "Sit", "Perch", "Run", "Wave", "Lounge"];

export type StopId = "hero" | "work" | "stack" | "archive" | "contact";

type Placement = { x: number; y: number; height: number };

type Stop = {
  id: StopId;
  anchor: (desk: boolean) => string;
  clip: Clip;
  /** origin (feet, or hips when `pivot` is "hips") in viewport px + standing height px */
  place: (r: DOMRect, vw: number, vh: number, desk: boolean) => Placement;
  pivot?: "feet" | "hips";
  /** the move into this stop happens while its anchor's top travels from
   *  `window[0]*vh` to `window[1]*vh` above the top of the viewport */
  window: [number, number];
  /** override for where (scrollY) the move into this stop begins */
  start?: (docTop: number, vh: number) => number;
  yaw: number;
  roll?: number;
  float?: boolean;
  ground?: boolean;
  props?: boolean;
};

const clamp = MathUtils.clamp;

const STOPS: Stop[] = [
  {
    id: "hero",
    anchor: () => "hero",
    clip: "Sit",
    // chair + character span about -0.15 .. 5.5 units; centre that block in the stage
    place: (r, vw, vh, desk) => {
      const height = desk ? clamp(vh * 0.5, 240, 520) : clamp(vh * 0.4, 200, 380);
      const u = height / MODEL_HEIGHT;
      return { x: r.left + r.width * 0.5, y: r.top + r.height * 0.5 + 2.7 * u, height };
    },
    window: [0, 0],
    yaw: -0.3,
    float: true,
    props: true,
  },
  {
    id: "work",
    anchor: (desk) => (desk ? "work" : "work-m"),
    clip: "Idle",
    place: (r, vw, vh, desk) =>
      desk
        ? { x: r.left + Math.max(vw * 0.13, 150), y: r.bottom - vh * 0.05, height: vh * 0.27 }
        : { x: r.left + r.width * 0.5, y: r.bottom - 8, height: clamp(vh * 0.26, 160, 260) },
    window: [0.85, 0.05],
    // leaving the desk starts the moment you scroll: the chair and laptop fly
    // off while the desk is still in view, then the walk to the floor begins
    start: (docTop, vh) => Math.min(docTop - 0.85 * vh, vh * 0.1),
    yaw: 0,
    ground: true,
  },
  {
    id: "stack",
    anchor: () => "stack",
    clip: "Perch",
    pivot: "hips",
    place: (r, vw, vh, desk) => ({
      x: desk ? r.right - r.width * 0.15 : r.right - 80,
      y: r.top + 2,
      height: desk ? clamp(vh * 0.26, 160, 300) : clamp(vh * 0.2, 130, 200),
    }),
    window: [1.0, 0.45],
    yaw: 0.18,
  },
  {
    id: "archive",
    anchor: () => "archive",
    clip: "Lounge",
    place: (r, vw, vh, desk) => ({
      x: r.left + r.width * (desk ? 0.14 : 0.12),
      y: r.top + 2,
      height: desk ? clamp(vh * 0.21, 150, 240) : clamp(vh * 0.17, 120, 170),
    }),
    window: [1.0, 0.4],
    yaw: 0,
    roll: -Math.PI / 2,
    float: true,
  },
  {
    id: "contact",
    anchor: () => "contact",
    clip: "Wave",
    place: (r, vw, vh, desk) =>
      desk
        ? { x: r.right + vw * 0.07, y: r.bottom - 4, height: clamp(vh * 0.36, 220, 380) }
        : { x: r.right - 70, y: r.top - 12, height: clamp(vh * 0.24, 150, 220) },
    window: [0.95, 0.45],
    yaw: -0.15,
    ground: true,
  },
];

export type TrackState = {
  /** world-space origin + uniform scale for the rig */
  x: number;
  y: number;
  scale: number;
  yaw: number;
  roll: number;
  /** per-clip blend weights before the run/idle split */
  weights: Record<Clip, number>;
  /** how much of each stop is in effect */
  hero: number;
  work: number;
  ground: number;
  float: number;
  /** hero placement in world units, for the props that live around the chair */
  heroX: number;
  heroY: number;
  heroScale: number;
  from: StopId;
  to: StopId;
  t: number;
};

export const emptyTrack = (): TrackState => ({
  x: 0,
  y: 0,
  scale: 1,
  yaw: 0,
  roll: 0,
  weights: { Idle: 0, Sit: 1, Perch: 0, Run: 0, Wave: 0, Lounge: 0 },
  hero: 1,
  work: 0,
  ground: 0,
  float: 1,
  heroX: 0,
  heroY: 0,
  heroScale: 1,
  from: "hero",
  to: "hero",
  t: 1,
});

const smoothstep = (t: number) => {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
};

let cache: Record<string, HTMLElement | null> = {};
let cacheAge = 0;

const anchorEl = (id: string) => {
  const hit = cache[id];
  if (hit && hit.isConnected) return hit;
  const els = document.querySelectorAll<HTMLElement>(`[data-char-anchor="${id}"]`);
  let found: HTMLElement | null = null;
  els.forEach((el) => {
    // rendered at all? (offsetParent is null for the pinned, position:fixed section)
    if (!found && el.getClientRects().length > 0) found = el;
  });
  cache[id] = found;
  return found;
};

type View = { vw: number; vh: number; worldW: number; worldH: number };

const toWorld = (px: number, py: number, v: View) => ({
  x: (px / v.vw - 0.5) * v.worldW,
  y: (0.5 - py / v.vh) * v.worldH,
});

/**
 * Reads the DOM and writes the current state into `out`. Called every frame —
 * it touches a handful of rects, nothing that forces a layout by itself.
 */
export const computeTrack = (out: TrackState, scrollY: number, v: View) => {
  if (++cacheAge > 90) {
    cache = {};
    cacheAge = 0;
  }
  const desk = v.vw >= 1024;

  const live: { stop: Stop; rect: DOMRect }[] = [];
  for (const stop of STOPS) {
    const el = anchorEl(stop.anchor(desk));
    if (el) live.push({ stop, rect: el.getBoundingClientRect() });
  }
  if (!live.length) return out;

  // which pair of stops we're between
  let i = 0;
  let t = 1;
  for (let k = 1; k < live.length; k++) {
    const { stop, rect } = live[k];
    const docTop = rect.top + scrollY;
    const a = stop.start ? stop.start(docTop, v.vh) : docTop - stop.window[0] * v.vh;
    const b = docTop - stop.window[1] * v.vh;
    if (scrollY < a) break;
    i = k;
    t = smoothstep((scrollY - a) / Math.max(1, b - a));
  }
  const from = live[Math.max(0, i - 1)];
  const to = live[i];
  if (i === 0) t = 1;

  // the long desk → floor move is two beats: stand up as the props fly off
  // (first third), then travel
  const deskExit = from.stop.id === "hero" && to.stop.id === "work";
  const tPose = deskExit ? smoothstep(t / 0.35) : t;
  const tPos = deskExit ? smoothstep((t - 0.3) / 0.7) : t;

  const placed = (s: { stop: Stop; rect: DOMRect }) => {
    const p = s.stop.place(s.rect, v.vw, v.vh, desk);
    const u = p.height / MODEL_HEIGHT;
    const y = s.stop.pivot === "hips" ? p.y + HIPS_Y * u : p.y;
    return { x: p.x, y, u };
  };
  const A = placed(from);
  const B = placed(to);

  let px = MathUtils.lerp(A.x, B.x, tPos);
  let py = MathUtils.lerp(A.y, B.y, tPos);
  const u = MathUtils.lerp(A.u, B.u, tPos);
  // leaving the desk: swing out through the left edge and walk back in
  if (deskExit && tPos > 0 && tPos < 1) {
    px -= v.vw * 0.75 * Math.sin(Math.PI * tPos);
    py -= v.vh * 0.08 * Math.sin(Math.PI * tPos);
  }

  const w = toWorld(px, py, v);
  out.x = w.x;
  out.y = w.y;
  out.scale = (u * MODEL_HEIGHT) / v.vh * v.worldH / MODEL_HEIGHT;
  out.yaw = MathUtils.lerp(from.stop.yaw, to.stop.yaw, tPos);
  out.roll = MathUtils.lerp(from.stop.roll ?? 0, to.stop.roll ?? 0, tPos);

  for (const c of CLIPS) out.weights[c] = 0;
  out.weights[from.stop.clip] += 1 - tPose;
  out.weights[to.stop.clip] += tPose;

  const mix = (pick: (s: Stop) => number, k = tPose) => pick(from.stop) * (1 - k) + pick(to.stop) * k;
  out.hero = mix((s) => (s.id === "hero" ? 1 : 0));
  out.work = mix((s) => (s.id === "work" ? 1 : 0), tPos);
  out.ground = mix((s) => (s.ground ? 1 : 0), tPos);
  out.float = mix((s) => (s.float ? 1 : 0));
  out.from = from.stop.id;
  out.to = to.stop.id;
  out.t = t;

  const heroLive = live.find((s) => s.stop.id === "hero");
  if (heroLive) {
    const H = placed(heroLive);
    const hw = toWorld(H.x, H.y, v);
    out.heroX = hw.x;
    out.heroY = hw.y;
    out.heroScale = (H.u * MODEL_HEIGHT) / v.vh * v.worldH / MODEL_HEIGHT;
  }
  return out;
};
