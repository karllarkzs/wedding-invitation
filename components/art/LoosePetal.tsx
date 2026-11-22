import { LOOSE_PETAL } from "./petals";

/**
 * A single ivory paper petal (uses the shared gradients from <SvgDefs />).
 * Its soft shadow is two faded copies of the petal rather than a blur filter,
 * which keeps it cheap to draw and move on phones.
 */
export function LoosePetal({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="-60 -112 120 120" aria-hidden="true" focusable="false" className={`overflow-visible ${className}`} style={style}>
      <path d={LOOSE_PETAL.d} transform="translate(0 4)" fill="#5E4A2C" fillOpacity="0.09" />
      <path d={LOOSE_PETAL.d} transform="translate(0 8) scale(1.03)" fill="#5E4A2C" fillOpacity="0.05" />
      <path d={LOOSE_PETAL.d} fill="url(#pf-light)" />
      <path d={LOOSE_PETAL.d} fill="url(#pf-side)" />
      <path d={LOOSE_PETAL.veins} fill="none" stroke="#B9A07A" strokeOpacity="0.14" strokeWidth="0.8" />
      <path d={LOOSE_PETAL.d} fill="none" stroke="#FFFFFF" strokeOpacity="0.6" strokeWidth="1.2" />
      <path d={LOOSE_PETAL.d} fill="none" stroke="#A88E66" strokeOpacity="0.18" strokeWidth="0.7" />
    </svg>
  );
}

/**
 * A few petals resting at the edges of the screen, swaying gently.
 * Fixed behind the content, like petals scattered around a printed invitation.
 */
const FIELD: { side: "left" | "right"; x: string; top: string; size: number; rot: number; dur: number; delay: number }[] = [
  { side: "left", x: "-34px", top: "9%", size: 96, rot: 38, dur: 13, delay: -2 },
  { side: "right", x: "-30px", top: "24%", size: 78, rot: -132, dur: 11, delay: -6 },
  { side: "left", x: "-26px", top: "47%", size: 64, rot: 118, dur: 14, delay: -4 },
  { side: "right", x: "-38px", top: "63%", size: 104, rot: 206, dur: 12, delay: -8 },
  { side: "left", x: "-22px", top: "84%", size: 72, rot: -24, dur: 15, delay: -1 },
  { side: "right", x: "-18px", top: "93%", size: 58, rot: 152, dur: 10, delay: -5 },
];

export function PetalField() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-[1] overflow-hidden">
      {FIELD.map((p, i) => (
        <div
          key={i}
          className="petal-sway absolute"
          style={{
            [p.side]: p.x,
            top: p.top,
            width: p.size,
            height: p.size,
            rotate: `${p.rot}deg`,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
          }}
        >
          <LoosePetal className="h-full w-full" />
        </div>
      ))}
    </div>
  );
}
