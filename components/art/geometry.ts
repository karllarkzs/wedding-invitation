/**
 * Original botanical + wax-seal geometry, generated from simple curves.
 * Pure functions with no React, shared by the site components and the OG image.
 * Everything is deterministic, so the server and client render identical SVG.
 */

type Pt = { x: number; y: number };
type Curve = [Pt, Pt, Pt, Pt];

const r2 = (n: number) => Math.round(n * 100) / 100;
const DEG = 180 / Math.PI;

function bezier([a, b, c, d]: Curve, t: number): Pt {
  const mt = 1 - t;
  const k0 = mt * mt * mt;
  const k1 = 3 * mt * mt * t;
  const k2 = 3 * mt * t * t;
  const k3 = t * t * t;
  return {
    x: k0 * a.x + k1 * b.x + k2 * c.x + k3 * d.x,
    y: k0 * a.y + k1 * b.y + k2 * c.y + k3 * d.y,
  };
}

function bezierAngle([a, b, c, d]: Curve, t: number): number {
  const mt = 1 - t;
  const dx = 3 * mt * mt * (b.x - a.x) + 6 * mt * t * (c.x - b.x) + 3 * t * t * (d.x - c.x);
  const dy = 3 * mt * mt * (b.y - a.y) + 6 * mt * t * (c.y - b.y) + 3 * t * t * (d.y - c.y);
  return Math.atan2(dy, dx) * DEG;
}

export type LeafShape = "round" | "willow";

export type BranchSpec = {
  curve: Curve;
  leaves: number;
  shape: LeafShape;
  arrangement: "alternate" | "opposite";
  /** Leaf length at the base of the stem (in viewBox units). */
  size: number;
  /** Portion of the stem that carries leaves. */
  from?: number;
  to?: number;
  stemWidth?: number;
  /** Positions (0–1) along the stem for small seed-pod clusters. */
  berries?: number[];
  /** Flip which side the first leaf grows on. */
  flip?: boolean;
};

export type BuiltLeaf = { body: string; vein: string; petiole: string; transform: string; shade: number };
export type BuiltBranch = {
  stem: string;
  stemWidth: number;
  leaves: BuiltLeaf[];
  berries: { cx: number; cy: number; r: number }[];
  twigs: string[];
};

/** A leaf drawn along +x from the origin: short petiole, then the blade. */
function leafPaths(shape: LeafShape, length: number) {
  const L = length;
  if (shape === "round") {
    // Silver-dollar eucalyptus: almost circular, softly pointed tip.
    const p = L * 0.1;
    return {
      body: `M${r2(p)} 0C${r2(p + L * 0.02)} ${r2(-L * 0.62)} ${r2(p + L * 0.95)} ${r2(-L * 0.6)} ${r2(p + L)} 0C${r2(p + L * 0.95)} ${r2(L * 0.6)} ${r2(p + L * 0.02)} ${r2(L * 0.62)} ${r2(p)} 0Z`,
      vein: `M${r2(p + L * 0.08)} 0L${r2(p + L * 0.7)} 0`,
      petiole: `M0 0L${r2(p + 0.5)} 0`,
    };
  }
  // Willow / gunnii leaf: long and slender with a gentle curve.
  const p = L * 0.06;
  return {
    body: `M${r2(p)} 0C${r2(p + L * 0.2)} ${r2(-L * 0.25)} ${r2(p + L * 0.68)} ${r2(-L * 0.19)} ${r2(p + L)} ${r2(-L * 0.04)}C${r2(p + L * 0.7)} ${r2(L * 0.12)} ${r2(p + L * 0.22)} ${r2(L * 0.2)} ${r2(p)} 0Z`,
    vein: `M${r2(p + L * 0.06)} 0Q${r2(p + L * 0.45)} ${r2(-L * 0.02)} ${r2(p + L * 0.84)} ${r2(-L * 0.035)}`,
    petiole: `M0 0L${r2(p + 0.5)} 0`,
  };
}

const SHADES = [0.92, 0.78, 1, 0.85, 0.7, 0.95, 0.82, 0.88];
const JITTER = [4, -6, 7, -3, 0, -8, 5, -2, 6, -5];

export function buildBranch(spec: BranchSpec): BuiltBranch {
  const { curve, leaves: count, shape, arrangement, size } = spec;
  const from = spec.from ?? 0.12;
  const to = spec.to ?? 0.9;
  const [a, b, c, d] = curve;
  const stem = `M${r2(a.x)} ${r2(a.y)}C${r2(b.x)} ${r2(b.y)} ${r2(c.x)} ${r2(c.y)} ${r2(d.x)} ${r2(d.y)}`;

  const leaves: BuiltLeaf[] = [];
  const spread = shape === "round" ? 56 : 36;

  for (let i = 0; i < count; i++) {
    const t = count === 1 ? from : from + ((to - from) * i) / (count - 1);
    const pt = bezier(curve, t);
    const tangent = bezierAngle(curve, t);
    const scale = 1 - 0.42 * t;
    const length = size * scale;
    const angle = spread - 18 * t;
    const sides =
      arrangement === "opposite" ? [-1, 1] : [(i % 2 === 0) !== !!spec.flip ? -1 : 1];
    for (const side of sides) {
      const { body, vein, petiole } = leafPaths(shape, length);
      const jitter = JITTER[(i * 3 + (side > 0 ? 1 : 0)) % JITTER.length];
      leaves.push({
        body,
        vein,
        petiole,
        transform: `translate(${r2(pt.x)} ${r2(pt.y)}) rotate(${r2(tangent + side * angle + jitter)})`,
        shade: SHADES[(i * 2 + (side > 0 ? 1 : 0)) % SHADES.length],
      });
    }
  }

  // Terminal leaf at the tip, pointing along the stem.
  const tipAngle = bezierAngle(curve, 1);
  const tip = leafPaths(shape, size * (shape === "round" ? 0.42 : 0.5));
  leaves.push({
    body: tip.body,
    vein: tip.vein,
    petiole: tip.petiole,
    transform: `translate(${r2(d.x)} ${r2(d.y)}) rotate(${r2(tipAngle)})`,
    shade: 0.8,
  });

  // Seed-pod clusters: three tiny buds on short twigs.
  const berries: BuiltBranch["berries"] = [];
  const twigs: string[] = [];
  for (const [k, t] of (spec.berries ?? []).entries()) {
    const pt = bezier(curve, t);
    const tangent = bezierAngle(curve, t) / DEG;
    const side = k % 2 === 0 ? 1 : -1;
    const nx = -Math.sin(tangent) * side;
    const ny = Math.cos(tangent) * side;
    const base = { x: pt.x + nx * 7, y: pt.y + ny * 7 };
    twigs.push(`M${r2(pt.x)} ${r2(pt.y)}L${r2(base.x)} ${r2(base.y)}`);
    for (const [j, off] of [-1, 0, 1].entries()) {
      const tx = Math.cos(tangent);
      const ty = Math.sin(tangent);
      const cx = base.x + tx * off * 4.2 + nx * (j === 1 ? 4.5 : 2.6);
      const cy = base.y + ty * off * 4.2 + ny * (j === 1 ? 4.5 : 2.6);
      twigs.push(`M${r2(base.x)} ${r2(base.y)}L${r2(cx)} ${r2(cy)}`);
      berries.push({ cx: r2(cx), cy: r2(cy), r: j === 1 ? 2.3 : 1.9 });
    }
  }

  return { stem, stemWidth: spec.stemWidth ?? 1.3, leaves, berries, twigs };
}

const P = (x: number, y: number): Pt => ({ x, y });

/**
 * Corner spray (viewBox 0 0 200 200): grows from the bottom-left corner
 * toward the top-right, with a slender side stem and a small upright sprig.
 */
export const cornerSpray: BranchSpec[] = [
  {
    curve: [P(6, 196), P(34, 150), P(96, 146), P(168, 64)],
    leaves: 12,
    shape: "round",
    arrangement: "alternate",
    size: 25,
    from: 0.1,
    to: 0.94,
    stemWidth: 1.5,
    berries: [0.46],
  },
  {
    curve: [P(44, 166), P(78, 172), P(122, 186), P(188, 176)],
    leaves: 9,
    shape: "willow",
    arrangement: "alternate",
    size: 30,
    from: 0.12,
    to: 0.92,
    stemWidth: 1,
    flip: true,
  },
  {
    curve: [P(20, 180), P(10, 140), P(22, 96), P(54, 50)],
    leaves: 7,
    shape: "round",
    arrangement: "opposite",
    size: 15,
    from: 0.2,
    to: 0.9,
    stemWidth: 1,
  },
];

/** A single long stem (viewBox 0 0 200 80), used for dividers and sprigs. */
export const longSprig: BranchSpec[] = [
  {
    curve: [P(6, 60), P(60, 30), P(130, 52), P(194, 22)],
    leaves: 9,
    shape: "round",
    arrangement: "alternate",
    size: 20,
    from: 0.08,
    to: 0.92,
    stemWidth: 1.1,
    berries: [0.36, 0.7],
  },
];

/* ── Wax seal ─────────────────────────────────────────────────────────────── */

/** Irregular, puddled wax outline (viewBox 0 0 120 120). */
export function sealOutline(cx = 60, cy = 60, radius = 53, points = 96): string {
  const pts: Pt[] = [];
  for (let i = 0; i < points; i++) {
    const th = (i / points) * Math.PI * 2;
    const r =
      radius +
      2.1 * Math.sin(5 * th + 0.4) +
      1.4 * Math.sin(9 * th + 1.3) +
      0.9 * Math.sin(14 * th + 2.2) +
      0.6 * Math.sin(23 * th + 0.7);
    pts.push(P(cx + r * Math.cos(th), cy + r * Math.sin(th)));
  }
  // Catmull-Rom → cubic Bézier for a smooth closed outline.
  const n = pts.length;
  let d = `M${r2(pts[0].x)} ${r2(pts[0].y)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1 = P(p1.x + (p2.x - p0.x) / 6, p1.y + (p2.y - p0.y) / 6);
    const c2 = P(p2.x - (p3.x - p1.x) / 6, p2.y - (p3.y - p1.y) / 6);
    d += `C${r2(c1.x)} ${r2(c1.y)} ${r2(c2.x)} ${r2(c2.y)} ${r2(p2.x)} ${r2(p2.y)}`;
  }
  return `${d}Z`;
}

/** Standalone SVG markup for a spray (used by the OG image renderer). */
export function spraySvg(
  specs: BranchSpec[],
  { viewBox = "0 0 200 200", leaf = "#8E9C8A", leafLight = "#A9B6A5", stem = "#7A8876", vein = "#E9EEE6" } = {},
) {
  const parts = specs.map(buildBranch).map((b) => {
    const leaves = b.leaves
      .map(
        (l, i) =>
          `<g transform="${l.transform}"><path d="${l.petiole}" stroke="${stem}" stroke-width="0.8" fill="none"/><path d="${l.body}" fill="${i % 3 === 1 ? leafLight : leaf}" fill-opacity="${l.shade}"/><path d="${l.vein}" stroke="${vein}" stroke-opacity="0.55" stroke-width="0.6" fill="none" stroke-linecap="round"/></g>`,
      )
      .join("");
    const twigs = b.twigs.map((t) => `<path d="${t}" stroke="${stem}" stroke-width="0.8" fill="none"/>`).join("");
    const berries = b.berries.map((c) => `<circle cx="${c.cx}" cy="${c.cy}" r="${c.r}" fill="${stem}"/>`).join("");
    return `<path d="${b.stem}" stroke="${stem}" stroke-width="${b.stemWidth}" fill="none" stroke-linecap="round"/>${twigs}${leaves}${berries}`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${parts.join("")}</svg>`;
}

/** Standalone wax-seal SVG (no text — the monogram is overlaid by the renderer). */
export function sealSvg() {
  const outline = sealOutline();
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><radialGradient id="w" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="#A64A5A"/><stop offset="0.45" stop-color="#7B2E3B"/><stop offset="1" stop-color="#4C1821"/></radialGradient><radialGradient id="p" cx="60%" cy="64%" r="70%"><stop offset="0" stop-color="#8A3545"/><stop offset="1" stop-color="#682430"/></radialGradient></defs><path d="${outline}" fill="url(#w)"/><path d="${outline}" fill="none" stroke="#FFD9DE" stroke-opacity="0.16" stroke-width="1.2" transform="translate(-0.7 -0.7)"/><circle cx="60" cy="60" r="37.5" fill="url(#p)"/><circle cx="59.3" cy="59.2" r="37.5" fill="none" stroke="#35101A" stroke-opacity="0.55" stroke-width="1.8"/><circle cx="60.9" cy="61" r="37" fill="none" stroke="#FFC9D1" stroke-opacity="0.22" stroke-width="1.1"/><circle cx="60" cy="60" r="32" fill="none" stroke="#FFD6DC" stroke-opacity="0.32" stroke-width="1.3" stroke-dasharray="0.1 3.4" stroke-linecap="round"/><ellipse cx="40" cy="33" rx="15" ry="7.5" fill="#FFFFFF" opacity="0.12" transform="rotate(-32 40 33)"/></svg>`;
}
