"use client";

import { motion, type Variants } from "framer-motion";
import { flowerRings } from "./petals";

const RINGS = flowerRings();
const LAST = RINGS.length - 1;

export type FlowerStage = "bud" | "bloom" | "scatter";

const ringVariants: Variants = {
  bud: (i: number) => ({ scale: 0.32 + (i / LAST) * 0.2, rotate: -26, opacity: 0 }),
  // inner rings open first, outer rings unfold after
  bloom: (i: number) => ({
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: { delay: 0.1 + (LAST - i) * 0.13, duration: 1.9, ease: [0.16, 1, 0.3, 1] },
  }),
  // on opening: petals sweep outward and fade
  scatter: (i: number) => ({
    scale: 1.45 + (LAST - i) * 0.08,
    rotate: 22 - i * 3,
    opacity: 0,
    transition: { delay: i * 0.05, duration: 1.05, ease: [0.4, 0, 0.2, 1] },
  }),
};

/** A large ivory paper flower that can bloom open and scatter away. Original artwork. */
export function PaperFlower({ stage, className = "" }: { stage: FlowerStage; className?: string }) {
  return (
    <svg viewBox="-280 -280 560 560" aria-hidden="true" focusable="false" className={`overflow-visible ${className}`}>
      {RINGS.map((ring, i) => (
        <motion.g
          key={i}
          custom={i}
          variants={ringVariants}
          initial="bud"
          animate={stage}
          // each ring is symmetric around the centre, so its own bounding-box
          // centre is the flower's centre: rotate/scale around that
          style={{ transformBox: "fill-box", originX: 0.5, originY: 0.5 }}
          filter="url(#pf-shadow)"
        >
          {ring.map((p, j) => (
            <g key={j} transform={p.transform}>
              <path d={p.d} fill="url(#pf-light)" />
              <path d={p.d} fill="url(#pf-side)" />
              <path d={p.veins} fill="none" stroke="#B9A07A" strokeOpacity="0.13" strokeWidth="0.7" />
              <path d={p.d} fill="none" stroke="#FFFFFF" strokeOpacity="0.55" strokeWidth="1.1" />
              <path d={p.d} fill="none" stroke="#A88E66" strokeOpacity="0.16" strokeWidth="0.6" />
            </g>
          ))}
        </motion.g>
      ))}
    </svg>
  );
}
