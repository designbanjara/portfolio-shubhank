/**
 * Shared motion vocabulary.
 *
 * The curves mirror the --ease-* custom properties in index.css, so CSS
 * transitions and Framer Motion animations move on the same easing. Import
 * from here instead of repeating cubic-bezier arrays in each component; in
 * className strings, use the matching Tailwind utility (ease-smooth,
 * ease-spring) rather than an inline transitionTimingFunction.
 */
type Cubic = [number, number, number, number];

export const EASE: Record<'smooth' | 'spring' | 'out', Cubic> = {
  /** Default. Symmetrical, for anything that both arrives and leaves. */
  smooth: [0.44, 0, 0.56, 1],
  /** Slight overshoot, for elements that should feel physical. */
  spring: [0.34, 1.56, 0.64, 1],
  /** Decelerating. For entrances, which should settle rather than stop. */
  out: [0, 0, 0.2, 1],
};

export const DURATION = {
  /** Hover and colour changes — fast enough to feel like feedback. */
  fast: 0.15,
  /** The default for most state changes. */
  base: 0.3,
  /** Entrances, and anything moving a long distance. */
  slow: 0.45,
} as const;

/** Delay between siblings in a staggered list reveal. */
export const STAGGER = 0.06;
