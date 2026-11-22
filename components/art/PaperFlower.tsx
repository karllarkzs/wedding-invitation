import { FLOWER_RINGS, flowerRings } from "./petals";

const RINGS = flowerRings();
const LAST = RINGS.length - 1;
/** The flower's drawing box (viewBox -280 -280 560 560). */
const VIEW = 560;

export type FlowerStage = "bloom" | "scatter";

/**
 * How far each ring reaches from the centre (longest petal tip, plus room for
 * its shadow), so each ring's layer is only as big as it needs to be.
 */
const REACH = FLOWER_RINGS.map((r) => Math.ceil(r.r0 + r.L * 1.07 * r.sy + 16));

/**
 * A large ivory paper flower that blooms open and scatters away. Original artwork.
 *
 * Built for phones: each ring of petals is drawn once into its own layer, and
 * the bloom/scatter are CSS transform + opacity animations (see `.pf-ring` in
 * globals.css), which the browser runs on the graphics chip. No SVG filters:
 * the soft shadows are faded copies of the petals, drawn once.
 */
export function PaperFlower({ stage, className = "" }: { stage: FlowerStage; className?: string }) {
  return (
    <div aria-hidden="true" data-stage={stage} className={`paper-flower relative aspect-square ${className}`}>
      {RINGS.map((ring, i) => {
        const R = REACH[i];
        const size = ((2 * R) / VIEW) * 100;
        const vars = {
          "--o": LAST - i, // outer rings open last
          "--i": i,
          "--bud": 0.32 + (i / LAST) * 0.2,
          "--burst": 1.45 + (LAST - i) * 0.08,
          "--spin": `${22 - i * 3}deg`,
        } as React.CSSProperties;
        return (
          <div
            key={i}
            className="pf-ring absolute"
            style={{ width: `${size}%`, height: `${size}%`, left: `${50 - size / 2}%`, top: `${50 - size / 2}%`, ...vars }}
          >
            <svg viewBox={`${-R} ${-R} ${2 * R} ${2 * R}`} focusable="false" className="block h-full w-full overflow-visible">
              {/* soft shadow under the ring: two faded copies, slightly lower */}
              <g fill="#5E4A2C">
                {ring.map((p, j) => (
                  <g key={j} transform={`translate(0 5) ${p.transform}`}>
                    <path d={p.d} fillOpacity="0.08" />
                  </g>
                ))}
                {ring.map((p, j) => (
                  <g key={j} transform={`translate(0 11) ${p.transform} scale(1.03)`}>
                    <path d={p.d} fillOpacity="0.05" />
                  </g>
                ))}
              </g>
              {ring.map((p, j) => (
                <g key={j} transform={p.transform}>
                  <path d={p.d} fill="url(#pf-light)" />
                  <path d={p.d} fill="url(#pf-side)" />
                  <path d={p.veins} fill="none" stroke="#B9A07A" strokeOpacity="0.13" strokeWidth="0.7" />
                  <path d={p.d} fill="none" stroke="#FFFFFF" strokeOpacity="0.55" strokeWidth="1.1" />
                  <path d={p.d} fill="none" stroke="#A88E66" strokeOpacity="0.16" strokeWidth="0.6" />
                </g>
              ))}
            </svg>
          </div>
        );
      })}
    </div>
  );
}
