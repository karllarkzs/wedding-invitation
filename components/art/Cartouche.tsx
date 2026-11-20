/**
 * An ornate, sculpted frame (cartouche): beaded oval band, an acanthus crest,
 * leafy side sprays and corner sprigs — ivory "plaster" with soft relief.
 * Original artwork. Uses the shared defs from <SvgDefs />.
 *
 * Geometry (viewBox 0 0 100 128): the opening is an ellipse centred at
 * (50, 66) with rx 35 / ry 43.75 (a 4:5 oval). Exported so a photo can be
 * placed exactly inside it.
 */

export const CARTOUCHE = { w: 100, h: 128, cx: 50, cy: 66, rx: 35, ry: 43.75 } as const;

const r2 = (n: number) => Math.round(n * 100) / 100;
const ell = (cx: number, cy: number, rx: number, ry: number) =>
  `M${r2(cx - rx)} ${cy}a${r2(rx)} ${r2(ry)} 0 1 0 ${r2(rx * 2)} 0a${r2(rx)} ${r2(ry)} 0 1 0 ${r2(-rx * 2)} 0Z`;
/** Pointed leaf along +y from the origin. */
const leaf = (len: number, w: number) =>
  `M0 0C${r2(w)} ${r2(len * 0.3)} ${r2(w * 0.7)} ${r2(len * 0.75)} 0 ${len}C${r2(-w * 0.7)} ${r2(len * 0.75)} ${r2(-w)} ${r2(len * 0.3)} 0 0Z`;

function build(round: boolean) {
  const { cx, cy } = CARTOUCHE;
  const rx = round ? 36 : CARTOUCHE.rx;
  const ry = round ? 36 : CARTOUCHE.ry;
  const band = 6;
  const ox = rx + band;
  const oy = ry + band * (round ? 1 : 1.15);

  const beads: { x: number; y: number }[] = [];
  for (let a = 0; a < 360; a += round ? 12 : 9) {
    const t = (a * Math.PI) / 180;
    beads.push({ x: r2(cx + (rx + band / 2) * Math.cos(t)), y: r2(cy + (ry + (oy - ry) / 2) * Math.sin(t)) });
  }
  const crest = [-70, -40, -14, 14, 40, 70].map((a, i) => ({
    t: `translate(${cx} ${r2(cy - oy + 1)}) rotate(${180 + a})`,
    d: leaf(i === 2 || i === 3 ? 15 : 12.5, 4.4),
  }));
  const foot = [-50, -18, 18, 50].map((a, i) => ({
    t: `translate(${cx} ${r2(cy + oy - 1)}) rotate(${a})`,
    d: leaf(i === 1 || i === 2 ? 11 : 9, 3.6),
  }));
  // acanthus sprays on each side, pointing outward
  const sides = [-1, 1].flatMap((side) =>
    [-38, 0, 38].map((a, i) => ({
      t: `translate(${r2(cx + side * (ox - 1))} ${cy}) rotate(${side * -90 + side * a})`,
      d: leaf(i === 1 ? 11 : 8.5, i === 1 ? 4 : 3.2),
    })),
  );
  const sprigs = [45, 135, 225, 315].map((a) => {
    const t = (a * Math.PI) / 180;
    return {
      t: `translate(${r2(cx + (ox + 1.2) * Math.cos(t))} ${r2(cy + (oy + 1.2) * Math.sin(t))}) rotate(${(a + 90) % 360})`,
    };
  });
  return { cx, cy, rx, ry, ox, oy, beads, crest, foot, sides, sprigs };
}

const OVAL = build(false);
const ROUND = build(true);

type Props = {
  className?: string;
  /** "oval" (4:5) or "round" medallion. */
  shape?: "oval" | "round";
  /** Fill the opening with soft paper (for numbers/icons). Leave clear for photos. */
  paper?: boolean;
  children?: React.ReactNode;
};

export function Cartouche({ className = "", shape = "oval", paper = false, children }: Props) {
  const g = shape === "round" ? ROUND : OVAL;
  const viewBox = shape === "round" ? "0 18 100 96" : "0 0 100 128";
  return (
    <div className={`relative ${className}`}>
      <svg viewBox={viewBox} aria-hidden="true" focusable="false" className="block h-full w-full overflow-visible">
        {paper && <path d={ell(g.cx, g.cy, g.rx, g.ry)} fill="#FFFDF8" fillOpacity="0.92" />}
        <g filter="url(#ct-soft)">
          <g filter="url(#ct-emboss)" fill="url(#ct-fill)">
            <path d={`${ell(g.cx, g.cy, g.ox, g.oy)}${ell(g.cx, g.cy, g.rx, g.ry)}`} fillRule="evenodd" />
            {g.crest.map((c, i) => (
              <path key={`c${i}`} transform={c.t} d={c.d} />
            ))}
            <circle cx={g.cx} cy={r2(g.cy - g.oy - 1)} r="2.6" />
            {g.foot.map((c, i) => (
              <path key={`f${i}`} transform={c.t} d={c.d} />
            ))}
            <circle cx={g.cx} cy={r2(g.cy + g.oy + 1)} r="2.2" />
            {g.sides.map((c, i) => (
              <path key={`s${i}`} transform={c.t} d={c.d} />
            ))}
            {g.sprigs.map((s, i) => (
              <g key={`p${i}`} transform={s.t}>
                <path transform="rotate(-35)" d={leaf(6.5, 2.4)} />
                <path transform="rotate(35)" d={leaf(6.5, 2.4)} />
                <circle r="1.4" />
              </g>
            ))}
          </g>
        </g>
        <g fill="#FFFDF8" filter="url(#ct-emboss)">
          {g.beads.map((b, i) => (
            <circle key={i} cx={b.x} cy={b.y} r="0.95" />
          ))}
        </g>
        <path d={ell(g.cx, g.cy, g.rx + 0.4, g.ry + 0.4)} fill="none" stroke="#C9B48A" strokeWidth="0.5" strokeOpacity="0.9" />
        <path d={ell(g.cx, g.cy, g.ox - 0.4, g.oy - 0.4)} fill="none" stroke="#C9B48A" strokeWidth="0.4" strokeOpacity="0.6" />
      </svg>
      {children && (
        <div
          className="absolute flex flex-col items-center justify-center text-center"
          style={
            shape === "round"
              ? { left: "14%", right: "14%", top: "14%", bottom: "14%" }
              : { left: "15%", right: "15%", top: "17.4%", bottom: "14.4%" }
          }
        >
          {children}
        </div>
      )}
    </div>
  );
}
