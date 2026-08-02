/**
 * The entrance mini-game, kept as plain state + two functions (`update`, `draw`)
 * with no React and no DOM beyond the 2D context it is handed.
 *
 * Everything is authored in a fixed 640×360 virtual viewport and letterboxed by
 * the caller, so layout never depends on the real window size.
 */

export const VW = 640;
export const VH = 360;

const GROUND_Y = 286;
const GRAVITY = 2200;
const JUMP_V = 760;
const RUN = 268;
const COYOTE = 0.09; // grace period after walking off a ledge

const WORLD_END = 2120;
const DOOR_X = 1930;
const DOOR_W = 96;

/** how far the camera can travel — the backdrop is sized from this so it never repeats */
const SCROLL_MAX = WORLD_END - VW;
const BG_PARALLAX = 0.12;

const CREAM = "#f3efec";
const INK = "#000000";
/* ground, colour-matched to the platforms in the backdrop art */
const SOIL = "#280449";
const SOIL_EDGE = "#898733";
const SOIL_EDGE_HI = "#a9a83c";
const ORANGE = "#ff6737";
const LIME = "#bffe28";
/** backdrop only — deliberately dim so the skyline never competes with the level */
const PURPLE = "#3c0a5b";

/* sprite sheets, both derived from the assets in public/images */
const WALK_FRAMES = 4;
const WALK_FW = 99;
const WALK_FH = 159;
const STAR_CELL = 200; // 3×3 grid of 200px cells

/** Loaded lazily — every sprite has a drawn fallback so the level is always playable. */
export type Assets = {
  walk: CanvasImageSource | null;
  stars: CanvasImageSource | null;
  crate: CanvasImageSource | null;
  /** parallax backdrop; tiled horizontally, replaces the drawn sun + skyline */
  bg: (CanvasImageSource & { width: number; height: number }) | null;
};

type Box = { x: number; y: number; w: number; h: number };

export type Input = {
  left: boolean;
  right: boolean;
  /** consumed by the update tick, not held */
  jump: boolean;
};

export type Status = "play" | "clear" | "done";

export type Game = {
  status: Status;
  t: number;
  /** seconds since the player last touched a control — drives the idle hint */
  idle: number;
  clearT: number;
  cam: number;
  p: {
    x: number;
    y: number;
    w: number;
    h: number;
    vx: number;
    vy: number;
    face: 1 | -1;
    grounded: boolean;
    coyote: number;
    walk: number;
  };
  pits: [number, number][];
  crates: Box[];
  /** `cell` indexes the 3×3 star sheet */
  gems: { x: number; y: number; cell: number; taken: boolean }[];
  /** short-lived pickup burst */
  sparks: { x: number; y: number; vx: number; vy: number; t: number; cell: number }[];
  signs: { x: number; text: string }[];
  got: number;
  falls: number;
  /** one-shot events for the caller to turn into sound */
  events: ("jump" | "gem" | "fall" | "clear")[];
};

export const createGame = (): Game => ({
  status: "play",
  t: 0,
  idle: 0,
  clearT: 0,
  cam: 0,
  p: {
    x: 70,
    y: GROUND_Y - 50,
    w: 30,
    h: 50,
    vx: 0,
    vy: 0,
    face: 1,
    grounded: true,
    coyote: 0,
    walk: 0,
  },
  pits: [
    [700, 800],
    [1245, 1355],
  ],
  // Every crate is a square or a stack of squares so the crate sprite tiles
  // into it without ever being stretched out of proportion.
  crates: [
    { x: 380, y: GROUND_Y - 46, w: 46, h: 46 },
    { x: 980, y: GROUND_Y - 54, w: 54, h: 54 },
    { x: 1520, y: GROUND_Y - 44, w: 44, h: 44 },
    { x: 1576, y: GROUND_Y - 88, w: 44, h: 88 },
  ],
  gems: [
    { x: 420, y: GROUND_Y - 118, cell: 6, taken: false },
    { x: 752, y: GROUND_Y - 96, cell: 1, taken: false },
    { x: 1300, y: GROUND_Y - 104, cell: 0, taken: false },
    { x: 1600, y: GROUND_Y - 152, cell: 8, taken: false },
  ],
  sparks: [],
  signs: [
    { x: 190, text: "→  또는  D  로 이동" },
    { x: 620, text: "SPACE  점프" },
    { x: 1700, text: "문까지  가면  입장" },
  ],
  got: 0,
  falls: 0,
  events: [],
});

const overlaps = (a: Box, b: Box) =>
  a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

const inPit = (g: Game, cx: number) =>
  g.pits.some(([a, b]) => cx > a && cx < b);

export const update = (g: Game, dtRaw: number, input: Input) => {
  // A backgrounded tab hands back one enormous frame; clamp so nobody tunnels
  // through the floor while the site was in another window.
  const dt = Math.min(dtRaw, 1 / 30);
  g.t += dt;
  g.events.length = 0;

  if (g.status === "clear") {
    g.clearT += dt;
    // walk the last few pixels into the doorway, then hand off
    const target = DOOR_X + DOOR_W / 2 - g.p.w / 2;
    g.p.x += Math.sign(target - g.p.x) * Math.min(Math.abs(target - g.p.x), RUN * dt);
    g.p.walk += dt * 12;
    if (g.clearT > 0.75) g.status = "done";
    return;
  }
  if (g.status === "done") return;

  const p = g.p;

  if (input.left || input.right || input.jump) g.idle = 0;
  else g.idle += dt;

  // ── horizontal
  const dir = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  p.vx = dir * RUN;
  if (dir !== 0) {
    p.face = dir as 1 | -1;
    if (p.grounded) p.walk += dt * 9; // ≈2 cycles/sec through the 4 frames
  }
  p.x += p.vx * dt;
  if (p.x < 8) p.x = 8;
  for (const c of g.crates) {
    if (!overlaps(p, c)) continue;
    p.x = p.vx > 0 ? c.x - p.w : c.x + c.w;
    p.vx = 0;
  }

  // ── vertical
  if (p.grounded) p.coyote = COYOTE;
  else p.coyote = Math.max(0, p.coyote - dt);

  if (input.jump && p.coyote > 0) {
    p.vy = -JUMP_V;
    p.grounded = false;
    p.coyote = 0;
    g.events.push("jump");
  }

  p.vy += GRAVITY * dt;
  p.y += p.vy * dt;
  p.grounded = false;

  for (const c of g.crates) {
    if (!overlaps(p, c)) continue;
    if (p.vy > 0) {
      p.y = c.y - p.h;
      p.grounded = true;
    } else {
      p.y = c.y + c.h;
    }
    p.vy = 0;
  }

  const cx = p.x + p.w / 2;
  if (!inPit(g, cx) && p.vy >= 0 && p.y + p.h >= GROUND_Y) {
    p.y = GROUND_Y - p.h;
    p.vy = 0;
    p.grounded = true;
  }

  // There is no death and no restart: a missed jump puts you straight back on
  // the ledge you fell from, still holding all your progress.
  if (p.y > VH + 60) {
    const pit = g.pits.find(([a, b]) => cx > a && cx < b);
    p.x = pit ? pit[0] - p.w - 6 : 70;
    p.y = GROUND_Y - p.h;
    p.vy = 0;
    p.grounded = true;
    g.falls += 1;
    g.events.push("fall");
  }

  // ── pickups
  for (const gem of g.gems) {
    if (gem.taken) continue;
    if (Math.abs(gem.x - cx) < 22 && Math.abs(gem.y - (p.y + p.h / 2)) < 30) {
      gem.taken = true;
      g.got += 1;
      g.events.push("gem");
      for (let i = 0; i < 5; i++) {
        g.sparks.push({
          x: gem.x,
          y: gem.y,
          vx: (Math.random() - 0.5) * 190,
          vy: -60 - Math.random() * 130,
          t: 0,
          cell: (gem.cell + i * 3) % 9,
        });
      }
    }
  }

  for (let i = g.sparks.length - 1; i >= 0; i--) {
    const s = g.sparks[i];
    s.t += dt;
    s.x += s.vx * dt;
    s.y += s.vy * dt;
    s.vy += 620 * dt;
    if (s.t > 0.55) g.sparks.splice(i, 1);
  }

  // ── door
  if (p.x + p.w > DOOR_X + 18) {
    g.status = "clear";
    g.clearT = 0;
    g.events.push("clear");
  }

  g.cam = Math.max(0, Math.min(cx - VW * 0.38, WORLD_END - VW));
};

/* ────────────────────────────── drawing ────────────────────────────── */

const box = (
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  fill: string,
  stroke = INK,
  lw = 3,
) => {
  c.fillStyle = fill;
  c.fillRect(x, y, w, h);
  if (lw > 0) {
    c.lineWidth = lw;
    c.strokeStyle = stroke;
    c.strokeRect(x + lw / 2, y + lw / 2, w - lw, h - lw);
  }
};

const label = (
  c: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  color: string,
  size = 11,
  align: CanvasTextAlign = "center",
) => {
  c.font = `700 ${size}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
  c.textAlign = align;
  c.textBaseline = "middle";
  c.fillStyle = color;
  c.fillText(text, x, y);
};

/** one cell of the 3×3 star sheet, drawn centred on (x, y) */
const star = (
  c: CanvasRenderingContext2D,
  sheet: CanvasImageSource,
  cell: number,
  x: number,
  y: number,
  size: number,
  rot = 0,
) => {
  c.save();
  c.translate(x, y);
  if (rot) c.rotate(rot);
  c.drawImage(
    sheet,
    (cell % 3) * STAR_CELL,
    Math.floor(cell / 3) * STAR_CELL,
    STAR_CELL,
    STAR_CELL,
    -size / 2,
    -size / 2,
    size,
    size,
  );
  c.restore();
};

export const draw = (
  c: CanvasRenderingContext2D,
  g: Game,
  assets: Assets = { walk: null, stars: null, crate: null, bg: null },
) => {
  c.fillStyle = INK;
  c.fillRect(0, 0, VW, VH);

  /* ── parallax backdrop */
  const far = -g.cam * 0.3;
  if (assets.bg) {
    // Sized to cover the whole camera sweep in one piece — tiling it would
    // repeat the moon, which reads as a mistake rather than as a pattern.
    const s = Math.max(
      VH / assets.bg.height,
      (VW + SCROLL_MAX * BG_PARALLAX + 4) / assets.bg.width,
    );
    const smooth = c.imageSmoothingEnabled;
    c.imageSmoothingEnabled = false;
    c.drawImage(
      assets.bg,
      -g.cam * BG_PARALLAX,
      0,
      assets.bg.width * s,
      assets.bg.height * s,
    );
    c.imageSmoothingEnabled = smooth;
    // push the artwork back a step; without this its platforms sit at the same
    // visual depth as the real ground and the pits stop reading as holes
    c.fillStyle = "rgba(4,0,10,0.42)";
    c.fillRect(0, 0, VW, VH);
  } else {
    c.save();
    c.translate(far, 0);
    c.fillStyle = ORANGE;
    c.beginPath();
    c.arc(300, 92, 52, 0, Math.PI * 2);
    c.fill();
    for (let i = 0; i < 12; i++) {
      const bx = 40 + i * 190;
      const bh = 54 + ((i * 43) % 62);
      c.fillStyle = PURPLE;
      c.fillRect(bx, GROUND_Y - bh, 104, bh);
      c.fillStyle = "rgba(191,254,40,0.5)";
      c.fillRect(bx, GROUND_Y - bh, 104, 2);
    }
    c.restore();
  }

  // dashed guide from the poster language — only over the flat drawn backdrop,
  // where it reads as HUD instead of scribbling across the artwork
  if (!assets.bg) {
    c.strokeStyle = "rgba(243,239,236,0.28)";
    c.lineWidth = 2;
    c.setLineDash([8, 8]);
    c.beginPath();
    c.moveTo(0, GROUND_Y - 120);
    c.lineTo(VW, GROUND_Y - 120);
    c.stroke();
    c.setLineDash([]);
  }

  c.save();
  c.translate(-g.cam, 0);

  /* ── ground slabs, split around the pits */
  const edges = [0, ...g.pits.flat(), WORLD_END];
  for (let i = 0; i < edges.length; i += 2) {
    const x0 = edges[i];
    const x1 = edges[i + 1];
    box(c, x0, GROUND_Y, x1 - x0, VH - GROUND_Y + 20, SOIL, INK, 0);
    // lit top edge — the same trick the backdrop platforms use, and the thing
    // that makes a ledge (and therefore a pit) readable at a glance
    c.fillStyle = SOIL_EDGE;
    c.fillRect(x0, GROUND_Y, x1 - x0, 5);
    c.fillStyle = SOIL_EDGE_HI;
    c.fillRect(x0, GROUND_Y, x1 - x0, 2);
    c.fillStyle = "rgba(255,255,255,0.055)";
    for (let dx = x0 + 5; dx < x1 - 3; dx += 8) {
      for (let dy = GROUND_Y + 14; dy < VH; dy += 8) c.fillRect(dx, dy, 1.5, 1.5);
    }
  }

  /* ── signs */
  for (const s of g.signs) {
    // measure rather than estimate — the labels are Korean, so per-char widths lie
    c.font = `700 11px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
    const w = Math.ceil(c.measureText(s.text).width) + 22;
    box(c, s.x - 3, GROUND_Y - 36, 6, 36, INK, INK, 0);
    box(c, s.x - w / 2, GROUND_Y - 64, w, 28, LIME);
    label(c, s.text, s.x, GROUND_Y - 49, INK, 11);
  }

  /* ── crates */
  for (const cr of g.crates) {
    if (assets.crate) {
      // tile the square sprite bottom-up; a tall crate is just a stack of them
      const smooth = c.imageSmoothingEnabled;
      c.imageSmoothingEnabled = false;
      c.save();
      c.beginPath();
      c.rect(cr.x, cr.y, cr.w, cr.h);
      c.clip();
      for (let y = cr.y + cr.h - cr.w; y > cr.y - cr.w; y -= cr.w) {
        c.drawImage(assets.crate, cr.x, y, cr.w, cr.w);
      }
      c.restore();
      c.imageSmoothingEnabled = smooth;
    } else {
      box(c, cr.x, cr.y, cr.w, cr.h, ORANGE);
      c.strokeStyle = INK;
      c.lineWidth = 2;
      c.beginPath();
      c.moveTo(cr.x + 4, cr.y + 4);
      c.lineTo(cr.x + cr.w - 4, cr.y + cr.h - 4);
      c.moveTo(cr.x + cr.w - 4, cr.y + 4);
      c.lineTo(cr.x + 4, cr.y + cr.h - 4);
      c.stroke();
    }
  }

  /* ── gems */
  for (const gem of g.gems) {
    if (gem.taken) continue;
    const bob = Math.sin(g.t * 3 + gem.x) * 4;
    if (assets.stars) {
      star(c, assets.stars, gem.cell, gem.x, gem.y + bob, 30, g.t * 1.1);
    } else {
      c.save();
      c.translate(gem.x, gem.y + bob);
      c.rotate(Math.PI / 4);
      box(c, -9, -9, 18, 18, LIME);
      c.restore();
    }
  }

  /* ── pickup burst */
  if (assets.stars) {
    for (const s of g.sparks) {
      c.globalAlpha = Math.max(0, 1 - s.t / 0.55);
      star(c, assets.stars, s.cell, s.x, s.y, 16, s.t * 7);
    }
    c.globalAlpha = 1;
  }

  /* ── door */
  const doorY = GROUND_Y - 128;
  box(c, DOOR_X - 12, doorY - 16, DOOR_W + 24, 16, LIME);
  box(c, DOOR_X, doorY, DOOR_W, 128, g.status === "play" ? "#141414" : LIME, LIME);
  for (let i = 0; i < 5; i++) {
    c.fillStyle = `rgba(191,254,40,${0.06 + i * 0.03})`;
    c.fillRect(DOOR_X + 8, doorY + 10 + i * 22, DOOR_W - 16, 12);
  }
  label(c, "ENTER", DOOR_X + DOOR_W / 2, doorY - 30, LIME, 13);
  if (assets.stars) {
    for (let i = 0; i < 3; i++) {
      const sx = DOOR_X + 14 + i * 34;
      star(c, assets.stars, [1, 8, 0][i], sx, doorY - 54 + Math.sin(g.t * 2 + i) * 5, 20, g.t * (0.6 + i * 0.3));
    }
  }

  /* ── character */
  const p = g.p;
  const step = p.grounded ? Math.sin(p.walk) : 0;
  const airborne = !p.grounded;
  c.save();
  c.translate(p.x + p.w / 2, p.y);
  c.scale(p.face, 1);

  if (assets.walk) {
    // Pixel art: nearest-neighbour on the way down, so the sprite keeps its
    // hard edges instead of turning to mush.
    const smooth = c.imageSmoothingEnabled;
    c.imageSmoothingEnabled = false;
    // the source art faces the other way, so mirror it on top of the facing flip
    c.scale(-1, 1);
    // stand still on frame 0; the cycle only advances while actually walking
    const frame = airborne ? 2 : p.vx !== 0 ? Math.floor(p.walk) % WALK_FRAMES : 0;
    const dh = p.h + 8;
    const dw = (dh * WALK_FW) / WALK_FH;
    c.drawImage(
      assets.walk,
      frame * WALK_FW,
      0,
      WALK_FW,
      WALK_FH,
      -dw / 2,
      p.h - dh,
      dw,
      dh,
    );
    c.imageSmoothingEnabled = smooth;
  } else {
    // Fallback figure — if the sprite sheet ever fails to load the level still
    // has to be playable, so nothing here depends on the image.
    const lift = airborne ? -4 : 0;
    box(c, -12, p.h - 13 + lift, 9, 13 - Math.max(0, step) * 5, ORANGE, INK, 0);
    box(c, 3, p.h - 13 + lift, 9, 13 - Math.max(0, -step) * 5, ORANGE, INK, 0);
    box(c, -p.w / 2, 0, p.w, p.h - 11, CREAM);
    box(c, -p.w / 2 + 6, 11, p.w - 14, 10, LIME, INK, 2);
    c.fillStyle = ORANGE;
    c.beginPath();
    c.moveTo(-p.w / 2 + 2, 25);
    c.lineTo(-p.w / 2 - 15 - Math.abs(p.vx) * 0.03, 29 + step * 3);
    c.lineTo(-p.w / 2 + 2, 34);
    c.closePath();
    c.fill();
  }
  c.restore();

  /* ── idle nudge */
  if (g.idle > 2.4 && g.status === "play") {
    const a = 0.55 + Math.sin(g.t * 6) * 0.45;
    c.globalAlpha = a;
    label(c, "▶", p.x + p.w + 22, p.y + 16, LIME, 16);
    c.globalAlpha = 1;
  }

  c.restore();

  /* ── HUD rail — kept on the left so it never collides with the skip button,
     which floats over the top-right corner in DOM */
  label(c, "ENTRANCE / 01", 16, 20, LIME, 10, "left");
  c.font = `700 10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
  const railW = c.measureText("ENTRANCE / 01").width;
  label(
    c,
    `GEM ${g.got}/${g.gems.length}`,
    16 + railW + 14,
    20,
    g.got === g.gems.length ? LIME : CREAM,
    10,
    "left",
  );

  // progress toward the door — kept up on the black rail, not over the cream ground
  const prog = Math.max(0, Math.min(1, (p.x - 70) / (DOOR_X - 70)));
  c.strokeStyle = LIME;
  c.lineWidth = 2;
  c.strokeRect(17, 33, VW - 34, 7);
  c.fillStyle = LIME;
  c.fillRect(19, 35, (VW - 38) * prog, 3);

  /* ── clear flash */
  if (g.status !== "play") {
    c.fillStyle = `rgba(191,254,40,${Math.min(1, g.clearT / 0.75) * 0.9})`;
    c.fillRect(0, 0, VW, VH);
  }
};
