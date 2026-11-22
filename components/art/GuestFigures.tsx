/**
 * Original flat fashion illustrations for the dress code (faceless, natural
 * proportions, soft shading), in the wedding palette: butter / honey yellows,
 * cream, and dusty blue to navy. Drawn in code; no stock art.
 */

export type LookName =
  | "blueGown"
  | "blueSuit"
  | "butterOneShoulder"
  | "creamBarong"
  | "blueHighLow"
  | "blueShirt"
  | "butterTiered"
  | "butterShirt";

/** Short descriptions, used for screen readers. */
export const LOOK_LABEL: Record<LookName, string> = {
  blueGown: "a blue floor-length gown",
  blueSuit: "a blue suit and tie",
  butterOneShoulder: "a butter one-shoulder midi dress",
  creamBarong: "a cream barong with black trousers",
  blueHighLow: "a light blue high-low dress",
  blueShirt: "blue long sleeves with charcoal trousers",
  butterTiered: "a butter tiered midi dress",
  butterShirt: "butter long sleeves with navy trousers",
};

const VIEWBOX = "26 6 68 292";
const SHADOW = <ellipse cx="60" cy="293" rx="21" ry="3" fill="#463f52" opacity="0.1" />;

type P = { className?: string };

function Svg({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <svg viewBox={VIEWBOX} aria-hidden="true" focusable="false" className={className}>
      {children}
    </svg>
  );
}

/** A horizontal (or vertical) gradient from a list of colors. */
function Grad({ id, colors, vertical = false }: { id: string; colors: string[]; vertical?: boolean }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2={vertical ? "0" : "1"} y2={vertical ? "1" : "0"}>
      {colors.map((c, i) => (
        <stop key={c + i} offset={colors.length === 1 ? 0 : i / (colors.length - 1)} stopColor={c} />
      ))}
    </linearGradient>
  );
}

/** A soft ruffle along a hem: little arcs from x0 to x1 at height y. */
function scallop(x0: number, x1: number, y: number, step = 4) {
  let d = `M${x0} ${y}`;
  for (let x = x0; x < x1; x += step) d += `q${step / 2} 2.4 ${Math.min(step, x1 - x)} 0`;
  return d;
}

// ─── Shared lady parts ────────────────────────────────────────────────────

const LADY_HEAD = "M60 16c8 0 13 6 13 15s-4 18-13 20c-9-2-13-11-13-20s5-15 13-15Z";
const LADY_NECK = "m55.5 46-.5 14q5 3 10 0l-.5-14Z";
const LADY_NECK_SHADE = "M55.3 50q4.7 5 9.4 0v3q-4.7 4-9.4 0Z";
const LADY_SHOULDERS = "M51 57c-4 3-8.5 4-10.5 8L40 82h40l-.5-17c-2-4-6.5-5-10.5-8Z";
const LADY_ARM_NEAR =
  "M40.5 65c-3 15-3.5 33-2.5 47s2 28 3 39c-.5 6 0 12 2 15.5 2.5 0 3.5-4.5 3-10.5-.3-8-.5-20-.7-32 .2-12 .7-26 1.7-42Z";
const LADY_ARM_FAR =
  "M79.5 65c3 15 3.5 33 2.5 47s-2 28-3 39c.5 6 0 12-2 15.5-2.5 0-3.5-4.5-3-10.5.3-8 .5-20 .7-32-.2-12-.7-26-1.7-42Z";

function LongHairBack({ color }: { color: string }) {
  return (
    <path
      d="M46 30C44 18 52 12 61 12.5S76 19 75 31c0 13 3 25 4 39 .5 8-3 14-7 16 1-10-1-20-3-28H51c-2 8-4 18-3 28-4-2-7.5-8-7-16 1-14 4.5-26 5-40Z"
      fill={color}
    />
  );
}

function LongHairFront({ color, skin }: { color: string; skin: string }) {
  return (
    <>
      <path d={LADY_HEAD} fill={skin} />
      <path d="M47.5 33C47 21 53 15.5 61 15.5S73.5 20.5 73 31c-2-6-6-9.5-11-10-4 3-9 7-14.5 12Z" fill={color} />
      <path d="M73 30c1.5 6 1 13-1.5 18" stroke={color} strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </>
  );
}

function SleekHairFront({ color, skin }: { color: string; skin: string }) {
  return (
    <>
      <path d={LADY_HEAD} fill={skin} />
      <path d="M46.5 32C46 20 52 14.5 60 14.5S74 20 73.5 32c-1.5-7-6.5-11-13.5-11s-12 4-13.5 11Z" fill={color} />
      <path d="M60 14.6v6.6" stroke="#3A3236" strokeWidth="0.7" />
    </>
  );
}

/** Legs from `top` down, with heels. `straps` colors the heel straps. */
function LadyLegs({ top, skin, skinShade, heel, straps }: { top: number; skin: string; skinShade: string; heel: string; straps: string }) {
  const len = 282 - top;
  return (
    <>
      <path d={`M46 ${top}c-.5 ${len * 0.32} .5 ${len * 0.64} 2.5 ${len}h4c.5-${len * 0.36} 1-${len * 0.68} 1.5-${len}Z`} fill={skin} />
      <path d={`M61.5 ${top}c.5 ${len * 0.32} 1.5 ${len * 0.64} 3 ${len}h4c.5-${len * 0.36} 1-${len * 0.68} 1-${len}Z`} fill={skinShade} />
      <path d="M48.3 281.5h4.4l1 8q-3.5 2.5-8 1.5.5-4 2.6-9.5Z" fill={heel} />
      <path d="M47.5 286h6m-7 3.5h7" stroke={straps} strokeWidth="1.1" />
      <path d="M64.6 281.5H69l1.5 8q-3.5 2.5-8 1.5.3-4 2.1-9.5Z" fill={heel} />
      <path d="M64 286h6m-7 3.5h7.2" stroke={straps} strokeWidth="1.1" />
    </>
  );
}

// ─── Shared gentleman parts ───────────────────────────────────────────────

const MAN_HEAD = "M60 15c8.5 0 14 6 14 15.5S70 48.5 60 50.5c-10-2-14-10.5-14-20S51.5 15 60 15Z";
const MAN_NECK = "m54.5 45-.5 17q6 3 12 0l-.5-17Z";
const MAN_NECK_SHADE = "M54.3 49q5.7 5.5 11.4 0v3.4q-5.7 4.6-11.4 0Z";
const MAN_ARM_NEAR = "M36 66c-2.5 16-3 34-2 48s2.5 26 4 38h8c-.5-12-1-24-1.5-36-.5-12 0-26 1-38Z";
const MAN_ARM_FAR_STRAIGHT = "M84 66c2.5 16 3 34 2 48s-2.5 26-4 38h-8c.5-12 1-24 1.5-36 .5-12 0-26-1-38Z";
const MAN_HAND_NEAR = "M38.5 151c-.5 7 .5 13 3 16 2.5 0 4-4 4-10v-6Z";
const MAN_HAND_FAR = "M81.5 151c.5 7-.5 13-3 16-2.5 0-4-4-4-10v-6Z";
const STRAIGHT_TROUSERS = "M45 148h30l-1 138H63.5l-3-116h-1l-3 116H46Z";
const SHOE_L = "M45.5 285H56l.5 7q-7 2-14 .5 0-4.5 3-7.5Z";
const SHOE_R = "M63.5 285H74q3 3 3.5 7.5-7.5 2-14.5.5Z";

function ManHead({ skin, hair }: { skin: string; hair: string }) {
  return (
    <>
      <path d={MAN_HEAD} fill={skin} />
      <path d="M45.8 30C45 18 52 11.5 60.5 11.8 69.5 12 75 18 74.4 29c-1.9-5.5-5.4-8-10.4-8-6 0-12 1.5-16 6Z" fill={hair} />
    </>
  );
}

// ─── Ladies ───────────────────────────────────────────────────────────────

/** Principal sponsor: a blue floor-length wrap gown with flutter sleeves, holding a clutch. */
function BlueGown({ className }: P) {
  const skin = "#E2B79A";
  const skinShade = "#D6A98B";
  const hair = "#3A2A25";
  return (
    <Svg className={className}>
      <defs>
        <Grad id="gf-gown" colors={["#7D9CC5", "#5F80AE", "#4A6B9B"]} />
        <Grad id="gf-gown-v" colors={["#7393BE", "#58799F"]} vertical />
      </defs>
      {SHADOW}
      <LongHairBack color={hair} />
      {/* arms */}
      <path d="M37.5 72c-1.5 16-2 30-1 42s2 26 3 36c-.5 6 0 12 2 16 2 0 3-4 2.5-10 0-8-.5-18-1-30 0-10 .5-22 1.5-34Z" fill={skin} />
      <path d="m76.5 72 6.5 3c1.5 12 2 24 1.5 36-.5 4-2.5 8-5.5 12l-5 7c-1.5 1.5-4 .5-3.5-1.5l6-9c2-3 2-7 2-12-.5-10-1.5-20-2.5-30Z" fill={skinShade} />
      <path d="m53 58 7 24 7-24Z" fill={skin} />
      <path d={LADY_NECK} fill={skin} />
      <path d={LADY_NECK_SHADE} fill="#C99C7E" />
      {/* floor-length skirt */}
      <path d="M48.5 105C44 146 38.5 210 34 287q13 4.5 26 2 13 2.5 26.5-2C82 210 76 146 71.5 105Z" fill="url(#gf-gown)" />
      <path d="M53 108c4 50 9 110 12 178M58 110c-3 50-8 110-12 176M66 110c4 56 9 116 12 174" fill="none" stroke="#45648F" strokeOpacity="0.45" strokeWidth="0.7" />
      <path d="M55 112c-2 50-5 112-8 172" fill="none" stroke="#B9CBE0" strokeOpacity="0.4" strokeWidth="1.6" strokeLinecap="round" />
      {/* wrap bodice + flutter sleeves */}
      <path d="m53 59.5 7 21.5 7-21.5 9.5 4q2.5 2 2 6l-3.5 22q-1 8-3.5 14h-23q-2.5-6-3.5-14l-3.5-22q-.5-4 2-6Z" fill="url(#gf-gown-v)" />
      <path d="m53 59.5 7 21.5 7-21.5" fill="none" stroke="#4A6B9B" strokeWidth="0.8" />
      <path d="M43.5 63C38 64 35.5 70 34.5 78q2.5-1.5 4 1 2-3 4-.5 1-2 2.5-1.5V66Z" fill="#86A3CA" />
      <path d="M76.5 63c5.5 1 8 7 9 15q-2.5-1.5-4 1-2-3-4-.5-1-2-2.5-1.5V66Z" fill="#6C8BB6" />
      <path d="M48 101.5h24l-.4 5.5H48.4Z" fill="#4E6F9E" />
      {/* silver clutch + hand */}
      <rect x="64" y="123" width="15" height="9.5" rx="2" fill="#D6DFEA" />
      <path d="M64 126.5h15" stroke="#AFC0D3" strokeWidth="0.7" />
      <path d="M71 126.5c1-3 4-4.5 6.5-3.5l.5 4.5-3.5 2.5Z" fill={skinShade} />
      <LongHairFront color={hair} skin={skin} />
    </Svg>
  );
}

/** Principal sponsor: a butter one-shoulder midi dress with a bow on the shoulder. */
function ButterOneShoulder({ className }: P) {
  const skin = "#DCAE8C";
  const skinShade = "#CF9F7E";
  const hair = "#2B201E";
  return (
    <Svg className={className}>
      <defs>
        <Grad id="gf-os" colors={["#F7E8A6", "#F1DB86", "#E4C56B"]} />
        <Grad id="gf-os-v" colors={["#F6E6A2", "#EBD27C"]} vertical />
      </defs>
      {SHADOW}
      <circle cx="67.5" cy="47" r="6.5" fill={hair} />
      <LadyLegs top={232} skin={skin} skinShade={skinShade} heel={skin} straps="#D3AE85" />
      <path d={LADY_SHOULDERS} fill={skin} />
      <path d={LADY_NECK} fill={skin} />
      <path d={LADY_NECK_SHADE} fill="#B98A6A" />
      <path d={LADY_ARM_NEAR} fill={skin} />
      <path d={LADY_ARM_FAR} fill={skinShade} />
      {/* skirt */}
      <path d="M47.5 104C44 140 40.5 190 38 234q11.5 4.5 22.5 1.5 11 3 22-1.5C80 190 76.5 140 72.5 104Z" fill="url(#gf-os)" />
      <path d="M52 108c-2 40-5 84-7 124M60 108v126M68 108c2 40 5 84 7 124" fill="none" stroke="#D2B25A" strokeOpacity="0.5" strokeWidth="0.7" />
      {/* one-shoulder bodice: covers the right shoulder, slants down to the left */}
      <path d="M77.5 64Q76 58.5 69 58l-4 1.5-22.5 20Q42 92 47.5 106h25Q77 92 77.5 64Z" fill="url(#gf-os-v)" />
      <path d="M65 59.5 42.5 79.5" stroke="#D6B860" strokeWidth="0.9" />
      <path d="M47.5 104.5h25" stroke="#D3B25A" strokeWidth="0.9" />
      {/* bow */}
      <path d="M71 61c-4.5-4.5-9-2.5-7.5 1.5 1.4 2.2 4.6 1.6 7.5-1.5Zm0 0c3.5-5.5 8-4.5 7-.5-.9 2-3.9 2.2-7 .5Z" fill="#E8CC72" />
      <path d="m71 61-3 11 2 .5Zm0 0 2.5 10.5 2-.6Z" fill="#DDBD5C" />
      <circle cx="71" cy="61" r="1.4" fill="#D8B654" />
      <SleekHairFront color={hair} skin={skin} />
    </Svg>
  );
}

/** Guest: a light blue one-shoulder high-low dress with a flutter cape sleeve. */
function BlueHighLow({ className }: P) {
  const skin = "#E3B394";
  const skinShade = "#D5A585";
  const hair = "#3D2A22";
  return (
    <Svg className={className}>
      <defs>
        <Grad id="gf-hl-back" colors={["#9DB7D4", "#88A5C6"]} />
        <Grad id="gf-hl" colors={["#C9DBEE", "#B3CAE3", "#A3BDDA"]} />
        <Grad id="gf-hl-v" colors={["#C6D8EC", "#A9C2DE"]} vertical />
      </defs>
      {SHADOW}
      <LongHairBack color={hair} />
      {/* the long back of the skirt, behind the legs */}
      <path d="M47 104C42 150 36.5 215 33 272q27 8 54 0C84 215 78 150 73 104Z" fill="url(#gf-hl-back)" />
      <path d="M42 200c-1.5 25-3 48-4 70M78 200c1.5 25 2.5 48 3.5 70" fill="none" stroke="#7E9CBE" strokeOpacity="0.6" strokeWidth="0.7" />
      <LadyLegs top={198} skin={skin} skinShade={skinShade} heel={skin} straps="#C3CBD6" />
      <path d={LADY_SHOULDERS} fill={skin} />
      <path d={LADY_NECK} fill={skin} />
      <path d={LADY_NECK_SHADE} fill="#C3937A" />
      <path d={LADY_ARM_NEAR} fill={skin} />
      <path d={LADY_ARM_FAR} fill={skinShade} />
      {/* the shorter front of the skirt, with a draped edge */}
      <path d="M47.5 104C45 136 42.5 168 41 204q9.5 5 19 3.5 9.5 1.5 19-3.5C77.5 168 75 136 72.5 104Z" fill="url(#gf-hl)" />
      <path d="M72 106c-4 30-14 64-28 98" fill="none" stroke="#8EABCB" strokeWidth="1" />
      <path d="M71 108c-4 30-13 62-26 94" fill="none" stroke="#E3ECF6" strokeOpacity="0.7" strokeWidth="1.4" strokeLinecap="round" />
      {/* one-shoulder bodice: covers the left shoulder */}
      <path d="M42.5 64Q44 58.5 51 58l4 1.5 22.5 20Q78 92 72.5 106h-25Q43 92 42.5 64Z" fill="url(#gf-hl-v)" />
      <path d="m55 59.5 22.5 20" stroke="#93AFCE" strokeWidth="0.9" />
      {/* flutter cape sleeve */}
      <path d="M44 60c-6 1.5-9 8-10 17q2.6-1.6 4.2 1 2-3.2 4.2-.6 1.2-2.2 2.8-1.6l1-14Z" fill="#B7CCE4" />
      <path d="M38 64c-1.5 4-2.6 8-3 12m6-11.5c-1 4-1.5 8-1.4 12.5" stroke="#97B2D1" strokeWidth="0.6" fill="none" />
      <path d="M47.5 104h25l-.3 3.4H47.8Z" fill="#9AB5D3" />
      <LongHairFront color={hair} skin={skin} />
    </Svg>
  );
}

/** Guest: a butter tiered midi dress with puff sleeves and a sweetheart neckline. */
function ButterTiered({ className }: P) {
  const skin = "#EFC9AB";
  const skinShade = "#E3BB9C";
  const hair = "#4A2E22";
  const tiers: [string, string, [number, number, number]][] = [
    // [shape, fill, scallop: x0, x1, y]
    ["M42 189C40 205 38.5 221 37.5 237q22.5 5 45 0c-1-16-2.5-32-4.5-48Z", "url(#gf-tier-3)", [37.5, 82.5, 237]],
    ["M45 147C43.5 162 42.5 176 41.5 192q18.5 4 37 0c-1-16-2-30-3.5-45Z", "url(#gf-tier-2)", [41.5, 78.5, 192]],
    ["M48 105C47 120 46 134 45 150q15 4 30 0c-1-16-2-30-3-45Z", "url(#gf-tier-1)", [45, 75, 150]],
  ];
  return (
    <Svg className={className}>
      <defs>
        <Grad id="gf-tier-1" colors={["#FBF1D2", "#F1DFAA"]} />
        <Grad id="gf-tier-2" colors={["#FAEFCC", "#EEDBA2"]} />
        <Grad id="gf-tier-3" colors={["#F9EDC7", "#ECD79A"]} />
        <Grad id="gf-tier-v" colors={["#FBF1D3", "#F0DDA6"]} vertical />
      </defs>
      {SHADOW}
      <LongHairBack color={hair} />
      <LadyLegs top={234} skin={skin} skinShade={skinShade} heel={skin} straps="#D7B58F" />
      <path d={LADY_SHOULDERS} fill={skin} />
      <path d={LADY_NECK} fill={skin} />
      <path d={LADY_NECK_SHADE} fill="#D2A88A" />
      <path d={LADY_ARM_NEAR} fill={skin} />
      <path d={LADY_ARM_FAR} fill={skinShade} />
      {tiers.map(([d, fill, [x0, x1, y]]) => (
        <g key={y}>
          <path d={d} fill={fill} />
          <path d={scallop(x0, x1, y - 0.6)} fill="none" stroke="#DCC184" strokeWidth="0.8" />
        </g>
      ))}
      <path d="M53 110c-1 12-2 26-3 38m10-38v40m7-40c1 12 2 26 3 38M49 152c-1.5 12-3 26-4 38m15-38v40m11-40c1.5 12 3 26 4 38" fill="none" stroke="#DCC184" strokeOpacity="0.45" strokeWidth="0.6" />
      {/* sweetheart bodice */}
      <path d="M46.5 72q6.5-5.5 13.5.5 7-6 13.5-.5l-.5 12q-1 12-3 21.5h-20q-2-9.5-3-21.5Z" fill="url(#gf-tier-v)" />
      <path d="M46.5 72q6.5-5.5 13.5.5 7-6 13.5-.5" fill="none" stroke="#DCC184" strokeWidth="0.8" />
      <path d="M60 73v32" stroke="#DCC184" strokeOpacity="0.6" strokeWidth="0.6" />
      {/* puff sleeves */}
      <ellipse cx="42" cy="68" rx="6.8" ry="7.2" fill="#F8ECC6" />
      <ellipse cx="78" cy="68" rx="6.8" ry="7.2" fill="#EEDBA2" />
      <path d="M38 64.5q1.5 4 1 9m4-10q1.5 5 .5 10.5M82 64.5q-1.5 4-1 9m-4-10q-1.5 5-.5 10.5" stroke="#DCC184" strokeWidth="0.6" fill="none" />
      <path d="M36.2 73.5q5.8 2.6 11.4 0M72.4 73.5q5.8 2.6 11.4 0" stroke="#D7BA78" strokeWidth="1.1" fill="none" />
      <LongHairFront color={hair} skin={skin} />
    </Svg>
  );
}

// ─── Gentlemen ────────────────────────────────────────────────────────────

type ShirtColors = {
  id: string;
  shirt: [string, string];
  sleeveNear: string;
  sleeveFar: string;
  collar: [string, string];
  stroke: string;
  buttons: string;
  trousers: [string, string];
  crease: string;
  belt: string;
  shoes: string;
  skin: string;
  hair: string;
};

/** A gentleman in long sleeves rolled to the forearm, wearing a watch, one hand in his pocket. */
function ShirtMan({ className, c }: P & { c: ShirtColors }) {
  return (
    <Svg className={className}>
      <defs>
        <Grad id={`${c.id}-shirt`} colors={c.shirt} />
        <Grad id={`${c.id}-trousers`} colors={c.trousers} />
      </defs>
      {SHADOW}
      {/* far arm: forearm bent into the pocket, sleeve rolled */}
      <path d="M84 66c2.5 14 3.5 30 3 44 0 8-2 16-5 23l-5 8-5.5-3.5 4.5-8.5c2-5 3-10 3-17 0-12-1-24-2.5-34Z" fill={c.skin} />
      <path d="M84 66c2.5 14 3.5 30 3 44l-.2 4H79v-2c0-12-1-24-2.5-34Z" fill={c.sleeveFar} />
      <path d="M78.8 109.5h8.3v4.4h-8.1Z" fill={c.collar[1]} />
      {/* trousers + shoes */}
      <path d="M44.5 131h31l.5 19c.5 40-1 90-2.5 136h-10L61 172l-1-12-1 12-2.5 114h-10c-1.5-46-3-96-2.5-136Z" fill={`url(#${c.id}-trousers)`} />
      <path d="m52.5 136-.5 148M68 136l1 148" stroke={c.crease} strokeWidth="0.6" opacity="0.8" />
      <path d="m71.5 133.5 5.5 12.5" stroke={c.crease} strokeWidth="0.8" />
      <path d="M46 285h10.5l.5 7q-7 2-14 .5 0-4.5 3-7.5Z" fill={c.shoes} />
      <path d="M63.5 285H74q3 3 3.5 7.5-7.5 2-14.5.5Z" fill={c.shoes} />
      {/* near arm: rolled sleeve, forearm, watch */}
      <path d={MAN_ARM_NEAR} fill={c.skin} />
      <path d="M36 66c-2.5 16-3 34-2 48l.3 4h10.3l-.1-2c-.5-12 0-26 1-38Z" fill={c.sleeveNear} />
      <path d="M34.2 113.8h10.5v4.4H34.5Z" fill={c.collar[0]} />
      <path d="M37.7 144.5h8.2v3.2h-8Z" fill="#2F2A33" />
      <circle cx="41.8" cy="146.1" r="1.4" fill="#C9C3B8" />
      <path d={MAN_HAND_NEAR} fill={c.skin} />
      {/* open collar skin + neck */}
      <path d="m53.5 57 6.5 19 6.5-19Z" fill={c.skin} />
      <path d={MAN_NECK} fill={c.skin} />
      <path d={MAN_NECK_SHADE} fill="#00000022" />
      {/* shirt */}
      <path
        d="M53.5 58 38.5 63.5Q35 65 35 70l3 30q2 18 6.5 30h31q4.5-12 6.5-30l3-30q0-5-3.5-6.5L66.5 58 60 74Z"
        fill={`url(#${c.id}-shirt)`}
        stroke={c.stroke}
        strokeOpacity="0.7"
        strokeWidth="0.6"
      />
      <path d="M60 75v52" stroke={c.stroke} strokeOpacity="0.8" strokeWidth="0.8" />
      <g fill={c.buttons}>
        {[86, 98, 110, 122].map((y) => (
          <circle key={y} cx="60" cy={y} r="0.9" />
        ))}
      </g>
      <path d="M46 80q-1 22 2 44m26-44q1 22-2 44" fill="none" stroke={c.stroke} strokeOpacity="0.45" strokeWidth="0.7" />
      <path d="m53.5 57.5-4.5 5 7.5 8L60 74Z" fill={c.collar[0]} stroke={c.stroke} strokeWidth="0.6" strokeLinejoin="round" />
      <path d="m66.5 57.5 4.5 5-7.5 8L60 74Z" fill={c.collar[1]} stroke={c.stroke} strokeWidth="0.6" strokeLinejoin="round" />
      {/* belt */}
      <path d="M44.5 126h31v6h-31Z" fill={c.belt} />
      <rect x="57.5" y="126.4" width="5" height="5.2" rx="0.8" fill="none" stroke="#C9A75A" strokeWidth="1" />
      <ManHead skin={c.skin} hair={c.hair} />
    </Svg>
  );
}

/** Principal sponsor: a cream embroidered barong over black trousers. */
function CreamBarong({ className }: P) {
  const skin = "#C8936F";
  const skinShade = "#BA8664";
  const left = [70, 79, 88, 97, 106, 115, 124, 133];
  const right = [74.5, 83.5, 92.5, 101.5, 110.5, 119.5, 128.5];
  const hem = [44, 48.5, 53, 57.5, 62.5, 67, 71.5, 76];
  return (
    <Svg className={className}>
      <defs>
        <Grad id="gf-cbarong" colors={["#F5EEE0", "#E6D9C0"]} />
        <Grad id="gf-black" colors={["#2A2730", "#18161C"]} />
      </defs>
      {SHADOW}
      <path d={STRAIGHT_TROUSERS} fill="url(#gf-black)" />
      <path d="m52 152-.5 132M68 152l.5 132" stroke="#3E3A46" strokeWidth="0.6" opacity="0.8" />
      <path d={SHOE_L} fill="#141216" />
      <path d={SHOE_R} fill="#141216" />
      {/* sheer sleeves + hands */}
      <path d={MAN_ARM_NEAR} fill="#F0E7D6" />
      <path d={MAN_ARM_FAR_STRAIGHT} fill="#E2D5BA" />
      <path d="M37.6 146.5h8.2m36.6 0h-8.2" stroke="#FFFCF5" strokeWidth="1" />
      <path d={MAN_HAND_NEAR} fill={skin} />
      <path d={MAN_HAND_FAR} fill={skinShade} />
      <path d={MAN_NECK} fill={skin} />
      <path d={MAN_NECK_SHADE} fill="#A8775A" />
      {/* barong, worn untucked */}
      <path
        d="M53.5 58 38.5 63.5Q35 65 35 70l3.5 50q1 18 2 32 19.5 2.5 39 0 1-14 2-32l3.5-50q0-5-3.5-6.5L66.5 58q-6.5 3-13 0Z"
        fill="url(#gf-cbarong)"
        stroke="#CDBB99"
        strokeOpacity="0.9"
        strokeWidth="0.6"
      />
      <path d="M60 61v26" stroke="#CDBB99" strokeWidth="0.7" />
      <path d="m41 142 1.8 10m36.2-10-1.8 10" stroke="#CDBB99" strokeWidth="0.7" />
      {/* tone-on-tone embroidery */}
      <g fill="#C9B28A" fillOpacity="0.75">
        {left.map((y) => (
          <path key={`l${y}`} d={`m55 ${y} 1.6-2 1.6 2-1.6 2Z`} />
        ))}
        {right.map((y) => (
          <path key={`r${y}`} d={`m61.8 ${y} 1.6-2 1.6 2-1.6 2Z`} />
        ))}
        {hem.map((x) => (
          <circle key={`h${x}`} cx={x} cy="149" r="0.8" />
        ))}
      </g>
      <path
        d="M51.5 64c-1.5 26-2 54-1.5 84m20-84c1.5 26 2 54 1.5 84"
        fill="none"
        stroke="#C9B28A"
        strokeOpacity="0.6"
        strokeWidth="0.5"
        strokeDasharray="1 1.5"
      />
      <path d="m53.5 57.5 2.5 7 4-3.5 4 3.5 2.5-7q-6.5 3-13 0Z" fill="#F8F2E7" stroke="#CDBB99" strokeWidth="0.6" strokeLinejoin="round" />
      <path d={MAN_HEAD} fill={skin} />
      <path d="M45.8 29.5C45.5 18 52.5 11.8 61 12c8.5.3 14 6.3 13.4 17-2-6-7-9.6-13.6-9.4-6.2.2-11.5 3.6-15 9.9Z" fill="#2A211D" />
    </Svg>
  );
}

/** Principal sponsor: a blue suit, white shirt and navy tie. */
function BlueSuit({ className }: P) {
  const skin = "#D4A583";
  const skinShade = "#C6977A";
  return (
    <Svg className={className}>
      <defs>
        <Grad id="gf-suit" colors={["#4E70A8", "#34548A"]} />
      </defs>
      {SHADOW}
      <path d={STRAIGHT_TROUSERS} fill="url(#gf-suit)" />
      <path d="m52 152-.5 132M68 152l.5 132" stroke="#6283BA" strokeWidth="0.6" opacity="0.7" />
      <path d={SHOE_L} fill="#18151B" />
      <path d={SHOE_R} fill="#18151B" />
      {/* sleeves, shirt cuffs, hands */}
      <path d={MAN_ARM_NEAR} fill="#4A6CA4" />
      <path d={MAN_ARM_FAR_STRAIGHT} fill="#3A5A91" />
      <path d="M38.2 147.6h7.6m36 0h-7.6" stroke="#F4F6F9" strokeWidth="2" />
      <path d={MAN_HAND_NEAR} fill={skin} />
      <path d={MAN_HAND_FAR} fill={skinShade} />
      <path d={MAN_NECK} fill={skin} />
      <path d={MAN_NECK_SHADE} fill="#B48766" />
      {/* jacket */}
      <path d="M53.5 58 38.5 63.5Q35 65 35 70l3 34q2 24 4.5 46h35q2.5-22 4.5-46l3-34q0-5-3.5-6.5L66.5 58Z" fill="url(#gf-suit)" />
      {/* shirt + tie in the V */}
      <path d="M53.5 57.5 60 96l6.5-38.5q-6.5 3-13 0Z" fill="#F4F6F9" />
      <path d="M58.3 61.5h3.4l-.7 3.2 2 21.5-3 4-3-4 2-21.5Z" fill="#1F2E4F" />
      <path d="m53.5 57.5 3 6 3.5-2.5 3.5 2.5 3-6q-6.5 3-13 0Z" fill="#FFFFFF" stroke="#D8DEE6" strokeWidth="0.5" />
      {/* lapels */}
      <path d="M53.5 58 47.5 65.5l5 3-3.5 2.5 9.5 25L60 96Z" fill="#3B5C93" stroke="#2E4A7C" strokeWidth="0.5" strokeLinejoin="round" />
      <path d="m66.5 58 6 7.5-5 3 3.5 2.5-9.5 25L60 96Z" fill="#2F4D82" stroke="#2E4A7C" strokeWidth="0.5" strokeLinejoin="round" />
      {/* buttons, pockets, pocket square */}
      <circle cx="60.6" cy="104" r="1.1" fill="#1F2E4F" />
      <circle cx="60.6" cy="116" r="1.1" fill="#1F2E4F" />
      <path d="M43 121.5h9.5M67.5 121.5H77" stroke="#2A4677" strokeWidth="0.9" />
      <path d="M68.5 80.5h7l-.4 2.4h-6.4Z" fill="#E8EDF3" />
      <path d="M60 96v54" stroke="#2A4677" strokeWidth="0.6" />
      <ManHead skin={skin} hair="#231C20" />
    </Svg>
  );
}

const BLUE_SHIRT: ShirtColors = {
  id: "gf-bshirt",
  shirt: ["#88A8D1", "#6A8CBC"],
  sleeveNear: "#86A6CF",
  sleeveFar: "#6788B8",
  collar: ["#A5BFDE", "#90ACD3"],
  stroke: "#5E7FAD",
  buttons: "#F2F5F9",
  trousers: ["#555A64", "#3D414A"],
  crease: "#6C717D",
  belt: "#2B2630",
  shoes: "#6B4A33",
  skin: "#E0B08E",
  hair: "#1F1A1C",
};

const BUTTER_SHIRT: ShirtColors = {
  id: "gf-yshirt",
  shirt: ["#F5E8B8", "#E6D08E"],
  sleeveNear: "#EEDDA4",
  sleeveFar: "#E2CA84",
  collar: ["#F7EDC6", "#F0E2AE"],
  stroke: "#D2B66C",
  buttons: "#C9A75A",
  trousers: ["#26375C", "#1B2846"],
  crease: "#34487A",
  belt: "#7A5636",
  shoes: "#6B4A33",
  skin: "#C99A76",
  hair: "#231C20",
};

const FIGURES: Record<LookName, (p: P) => React.ReactNode> = {
  blueGown: BlueGown,
  blueSuit: BlueSuit,
  butterOneShoulder: ButterOneShoulder,
  creamBarong: CreamBarong,
  blueHighLow: BlueHighLow,
  blueShirt: (p) => <ShirtMan {...p} c={BLUE_SHIRT} />,
  butterTiered: ButterTiered,
  butterShirt: (p) => <ShirtMan {...p} c={BUTTER_SHIRT} />,
};

export function GuestFigure({ look, className }: { look: LookName; className?: string }) {
  const Figure = FIGURES[look];
  return <Figure className={className} />;
}
