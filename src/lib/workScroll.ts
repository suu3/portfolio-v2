/**
 * Live state of the pinned horizontal Work section, written by its ScrollTrigger
 * and read every frame by the 3D character (which runs while the cards slide).
 */
export const workScroll = {
  active: false,
  /** 0..1 through the horizontal scroll */
  progress: 0,
};
