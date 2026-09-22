/**
 * Shared motion vocabulary — the Penner easing set.
 *
 * These are the same curves as the --ease-* custom properties in index.css and
 * the Tailwind easing utilities, so a CSS transition and a Framer Motion
 * animation on the same element move identically. In className strings use the
 * utility (ease-out-quart); in Framer transitions import EASE from here.
 *
 * Choosing one:
 *   out-*    decelerates into place — entrances, anything arriving
 *   in-*     accelerates away — exits, anything being dismissed
 *   in-out-* symmetrical — state that moves both ways, like a rotation
 *
 * Within a family, the later names are more extreme: quad is gentle, expo is
 * dramatic. Prefer quad/cubic for small moves and quart upwards for large ones.
 */
type Cubic = [number, number, number, number];

export const EASE = {
  inQuad: [0.55, 0.085, 0.68, 0.53],
  inCubic: [0.55, 0.055, 0.675, 0.19],
  inQuart: [0.895, 0.03, 0.685, 0.22],
  inQuint: [0.755, 0.05, 0.855, 0.06],
  inExpo: [0.95, 0.05, 0.795, 0.035],
  inCirc: [0.6, 0.04, 0.98, 0.335],

  outQuad: [0.25, 0.46, 0.45, 0.94],
  outCubic: [0.215, 0.61, 0.355, 1],
  outQuart: [0.165, 0.84, 0.44, 1],
  outQuint: [0.23, 1, 0.32, 1],
  outExpo: [0.19, 1, 0.22, 1],
  outCirc: [0.075, 0.82, 0.165, 1],

  inOutQuad: [0.455, 0.03, 0.515, 0.955],
  inOutCubic: [0.645, 0.045, 0.355, 1],
  inOutQuart: [0.77, 0, 0.175, 1],
  inOutQuint: [0.86, 0, 0.07, 1],
  inOutExpo: [1, 0, 0, 1],
  inOutCirc: [0.785, 0.135, 0.15, 0.86],
} satisfies Record<string, Cubic>;

export const DURATION = {
  /** Hover and colour changes — fast enough to read as feedback. */
  fast: 0.15,
  /** The default for most state changes. */
  base: 0.3,
  /** Entrances, and anything moving a long distance. */
  slow: 0.45,
} as const;

/** Delay between siblings in a staggered list reveal. */
export const STAGGER = 0.06;
