/**
 * Tiny Web Audio blip engine for UI feedback.
 *
 * Deliberately not a library: these are 40–120ms oscillator envelopes, so a
 * pattern sequencer (or any dependency) would be far more weight than the job needs.
 * The AudioContext is created lazily on the first user gesture, since browsers
 * refuse to start one otherwise.
 */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let enabled = false;

const ensureContext = () => {
  if (ctx) return ctx;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  ctx = new Ctor();
  master = ctx.createGain();
  master.gain.value = 0.9;
  master.connect(ctx.destination);
  return ctx;
};

export const isSfxEnabled = () => enabled;

/** Must be called from a user gesture. */
export const enableSfx = async () => {
  const c = ensureContext();
  if (!c) return false;
  if (c.state === "suspended") await c.resume();
  enabled = true;
  return true;
};

export const disableSfx = () => {
  enabled = false;
};

type BlipOpts = {
  freq: number;
  /** seconds */
  dur?: number;
  gain?: number;
  type?: OscillatorType;
  /** glide to this frequency over the note */
  to?: number;
};

const blip = ({ freq, dur = 0.06, gain = 0.05, type = "triangle", to }: BlipOpts) => {
  if (!enabled || !ctx || !master) return;
  const t = ctx.currentTime;

  const osc = ctx.createOscillator();
  const env = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t + dur);

  // short attack, exponential decay — a click, not a beep
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(gain, t + 0.008);
  env.gain.exponentialRampToValueAtTime(0.0001, t + dur);

  osc.connect(env);
  env.connect(master);
  osc.start(t);
  osc.stop(t + dur + 0.02);
};

/** slight detune so repeated interactions don't sound mechanical */
const wobble = (base: number) => base * (1 + (Math.random() - 0.5) * 0.03);

export const sfx = {
  hover: () => blip({ freq: wobble(1180), dur: 0.035, gain: 0.022, type: "triangle" }),
  click: () => blip({ freq: wobble(660), to: 990, dur: 0.09, gain: 0.06, type: "square" }),
  open: () => blip({ freq: wobble(420), to: 840, dur: 0.13, gain: 0.05, type: "sawtooth" }),
  close: () => blip({ freq: wobble(840), to: 380, dur: 0.13, gain: 0.05, type: "sawtooth" }),
  /** character easter egg — steps up the scale as lines advance */
  step: (n: number) => blip({ freq: 523.25 * Math.pow(2, (n % 8) / 12), dur: 0.1, gain: 0.05, type: "square" }),
};
