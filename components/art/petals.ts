/**
 * Original paper-petal geometry (no images). Deterministic, so the server and
 * the browser always draw identical artwork.
 */

const r2 = (n: number) => Math.round(n * 100) / 100;
const rnd = (i: number) => {
  const v = Math.sin(i * 91.3458) * 47453.5453;
  return v - Math.floor(v);
};

/** A broad petal pointing up from the origin, with a softly ruffled top edge. */
export function petalPath(L: number, W: number, k: number) {
  const j = (o: number, s = 0.05) => (rnd(k + o) - 0.5) * 2 * s;
  const P = (x: number, y: number) => `${r2(x * W)} ${r2(-y * L)}`;
  return (
    `M0 0C${P(-0.3, 0.08)} ${P(-0.58 + j(1), 0.4)} ${P(-0.52, 0.72 + j(2))}` +
    `Q${P(-0.48, 0.93 + j(3))} ${P(-0.31, 0.97 + j(4, 0.03))}` +
    `Q${P(-0.17, 1.01 + j(5, 0.02))} ${P(-0.08, 0.95 + j(6, 0.02))}` +
    `Q${P(0, 0.9 + j(7, 0.02))} ${P(0.09, 0.96 + j(8, 0.02))}` +
    `Q${P(0.21, 1.02 + j(9, 0.02))} ${P(0.33, 0.96 + j(10, 0.03))}` +
    `Q${P(0.49, 0.92 + j(11))} ${P(0.53, 0.72 + j(12))}` +
    `C${P(0.58 + j(13), 0.4)} ${P(0.3, 0.08)} 0 0Z`
  );
}

/** Fine veins fanning out from the base. */
export function petalVeins(L: number, W: number) {
  return [-0.22, -0.11, 0, 0.11, 0.22]
    .map((t) => `M0 ${r2(-L * 0.04)}Q${r2(t * W * 0.6)} ${r2(-L * 0.45)} ${r2(t * W * 1.2)} ${r2(-L * 0.8)}`)
    .join("");
}

export type Ring = { n: number; L: number; W: number; r0: number; sy: number; rot: number };

/** Rings of petals, outermost first (viewBox -280 -280 560 560). */
export const FLOWER_RINGS: Ring[] = [
  { n: 11, L: 210, W: 170, r0: 52, sy: 1, rot: 0 },
  { n: 10, L: 178, W: 150, r0: 44, sy: 0.93, rot: 16 },
  { n: 9, L: 146, W: 128, r0: 34, sy: 0.86, rot: 6 },
  { n: 8, L: 112, W: 104, r0: 24, sy: 0.8, rot: 24 },
  { n: 6, L: 78, W: 78, r0: 14, sy: 0.72, rot: 10 },
  { n: 5, L: 48, W: 52, r0: 6, sy: 0.66, rot: 40 },
];

export type PlacedPetal = { transform: string; d: string; veins: string };

export function flowerRings(rings: Ring[] = FLOWER_RINGS): PlacedPetal[][] {
  let k = 0;
  return rings.map((ring) =>
    Array.from({ length: ring.n }, (_, i) => {
      k += 17;
      const theta = ring.rot + (360 / ring.n) * i + (rnd(k + 11) - 0.5) * 8;
      const L = ring.L * (0.93 + rnd(k + 5) * 0.14);
      const W = ring.W * (0.93 + rnd(k + 9) * 0.14);
      return {
        transform: `rotate(${r2(theta)}) translate(0 ${-ring.r0}) scale(1 ${ring.sy})`,
        d: petalPath(L, W, k),
        veins: petalVeins(L, W),
      };
    }),
  );
}

/** A single loose petal (viewBox -60 -112 120 120), for scattered decorations. */
export const LOOSE_PETAL = { d: petalPath(104, 92, 7), veins: petalVeins(104, 92) };

/** Rectangle with a torn, deckled paper edge. */
export function deckleRect(w: number, h: number, step = 5, amp = 2.4) {
  const jitter = (i: number) => rnd(i * 3 + 1) * amp;
  const pts: [number, number][] = [];
  let i = 0;
  for (let x = 0; x <= w; x += step) pts.push([x, jitter(i++)]);
  for (let y = step; y <= h; y += step) pts.push([w - jitter(i++), y]);
  for (let x = w - step; x >= 0; x -= step) pts.push([x, h - jitter(i++)]);
  for (let y = h - step; y > 0; y -= step) pts.push([jitter(i++), y]);
  return `M${pts.map(([x, y]) => `${r2(x)} ${r2(y)}`).join("L")}Z`;
}
