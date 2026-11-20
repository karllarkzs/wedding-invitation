import { buildBranch, cornerSpray, longSprig } from "./geometry";

const SPRAYS = {
  corner: { viewBox: "0 0 200 200", branches: cornerSpray.map(buildBranch) },
  sprig: { viewBox: "0 0 200 80", branches: longSprig.map(buildBranch) },
} as const;

const TONES = {
  /** Sage-green watercolor-flat leaves. */
  sage: { leaf: "#8E9C8A", leafAlt: "#A9B6A5", stem: "#7A8876", vein: "#EEF2EB", veinOpacity: 0.55, className: "" },
  /** White-on-white: shape comes only from light & shadow (paper emboss). */
  emboss: { leaf: "#FFFDF8", leafAlt: "#FFFDF8", stem: "#FBF7EE", vein: "#E7DFCF", veinOpacity: 0.9, className: "emboss" },
  /** Pressed into the paper. */
  deboss: { leaf: "#FAF6EE", leafAlt: "#FAF6EE", stem: "#F4EEE2", vein: "#E3DACA", veinOpacity: 0.8, className: "deboss" },
} as const;

type Props = {
  spray?: keyof typeof SPRAYS;
  tone?: keyof typeof TONES;
  className?: string;
  style?: React.CSSProperties;
};

/** Original hand-built eucalyptus artwork, drawn as inline SVG. */
export function Eucalyptus({ spray = "corner", tone = "sage", className = "", style }: Props) {
  const { viewBox, branches } = SPRAYS[spray];
  const t = TONES[tone];
  return (
    <svg
      viewBox={viewBox}
      aria-hidden="true"
      focusable="false"
      className={`${t.className} ${className}`}
      style={style}
    >
      {branches.map((b, bi) => (
        <g key={bi}>
          <path d={b.stem} fill="none" stroke={t.stem} strokeWidth={b.stemWidth} strokeLinecap="round" />
          {b.twigs.map((d, i) => (
            <path key={`t${i}`} d={d} fill="none" stroke={t.stem} strokeWidth={0.8} strokeLinecap="round" />
          ))}
          {b.leaves.map((l, i) => (
            <g key={i} transform={l.transform}>
              <path d={l.petiole} fill="none" stroke={t.stem} strokeWidth={0.8} />
              <path
                d={l.body}
                fill={i % 3 === 1 ? t.leafAlt : t.leaf}
                fillOpacity={tone === "sage" ? l.shade : 1}
              />
              <path
                d={l.vein}
                fill="none"
                stroke={t.vein}
                strokeOpacity={t.veinOpacity}
                strokeWidth={0.6}
                strokeLinecap="round"
              />
            </g>
          ))}
          {b.berries.map((c, i) => (
            <circle key={`b${i}`} cx={c.cx} cy={c.cy} r={c.r} fill={tone === "sage" ? t.stem : t.leaf} />
          ))}
        </g>
      ))}
    </svg>
  );
}
