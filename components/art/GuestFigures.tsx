/**
 * Original flat fashion illustrations of wedding guests for the dress code
 * (faceless, natural proportions, soft shading). Colors follow the dress-code
 * palette: butter / honey yellows and dusty blue / navy.
 */

export type LookName = "butterDress" | "blueSlip" | "butterShirt" | "blueBarong";

const VIEWBOX = "26 6 68 292";
const SHADOW = <ellipse cx="60" cy="293" rx="21" ry="3" fill="#463f52" opacity="0.1" />;

function Svg({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <svg viewBox={VIEWBOX} aria-hidden="true" focusable="false" className={className}>
      {children}
    </svg>
  );
}

/** A lady in a butter wrap midi dress with flutter sleeves, holding a clutch. */
function ButterDress({ className }: { className?: string }) {
  const skin = "#E2B79A";
  const skinShade = "#D6A98B";
  const hair = "#3A2A25";
  return (
    <Svg className={className}>
      <defs>
        <linearGradient id="gf-butter" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#F6E9BA" />
          <stop offset="0.6" stopColor="#EFDB9C" />
          <stop offset="1" stopColor="#E0C27C" />
        </linearGradient>
        <linearGradient id="gf-butter-v" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F4E5B0" />
          <stop offset="1" stopColor="#E3C67F" />
        </linearGradient>
      </defs>
      {SHADOW}
      {/* long hair, behind */}
      <path d="M46 30C44 18 52 12 61 12.5S76 19 75 31c0 13 3 25 4 39 .5 8-3 14-7 16 1-10-1-20-3-28H51c-2 8-4 18-3 28-4-2-7.5-8-7-16 1-14 4.5-26 5-40Z" fill={hair} />
      {/* legs + nude heels */}
      <path d="M44.5 232c-.5 16 1 32 3 50h4c.5-18 1.5-34 1.5-50Z" fill={skin} />
      <path d="M63 231c.5 16 2 32 3.5 50h4c.5-18 1-34 1-50Z" fill={skinShade} />
      <path d="M47 281.5h5l1 8q-3.5 2.5-8 1.5.3-3.5 2-9.5Z" fill="#C9A07C" />
      <path d="m52 284 .6 6.8" stroke="#B48A66" strokeWidth="1" />
      <path d="M66.2 280.5H71l1.5 8q-3.5 2.5-8 1.5 0-4 1.7-9.5Z" fill="#C9A07C" />
      <path d="m71 283 1.2 6.6" stroke="#B48A66" strokeWidth="1" />
      {/* arms */}
      <path d="M37.5 72c-1.5 16-2 30-1 42s2 26 3 36c-.5 6 0 12 2 16 2 0 3-4 2.5-10 0-8-.5-18-1-30 0-10 .5-22 1.5-34Z" fill={skin} />
      <path d="m76.5 72 6.5 3c1.5 12 2 24 1.5 36-.5 4-2.5 8-5.5 12l-5 7c-1.5 1.5-4 .5-3.5-1.5l6-9c2-3 2-7 2-12-.5-10-1.5-20-2.5-30Z" fill={skinShade} />
      {/* neckline skin + neck */}
      <path d="m53 58 7 24 7-24Z" fill={skin} />
      <path d="m55.5 46-.5 14q5 3 10 0l-.5-14Z" fill={skin} />
      <path d="M55.3 50q4.7 5 9.4 0v3q-4.7 4-9.4 0Z" fill="#C99C7E" />
      {/* skirt */}
      <path d="M48.5 105C45 140 41 188 38.5 234q11.5 4 23.5 1 10 3 21-2c-3-43-7-91-11.5-128Z" fill="url(#gf-butter)" />
      <path d="M52 106c5 44 13 92 18 130" fill="none" stroke="#CFAE5F" strokeOpacity="0.7" strokeWidth="0.8" />
      <path d="M57 110c-2 40-6 86-9 124m19-122c3 40 7 82 9 120" fill="none" stroke="#D7B86A" strokeOpacity="0.5" strokeWidth="0.7" />
      {/* bodice */}
      <path d="m53 59.5 7 21.5 7-21.5 9.5 4q2.5 2 2 6l-3.5 22q-1 8-3.5 14h-23q-2.5-6-3.5-14l-3.5-22q-.5-4 2-6Z" fill="url(#gf-butter-v)" />
      <path d="m53 59.5 7 21.5 7-21.5" fill="none" stroke="#D3B467" strokeWidth="0.8" />
      <path d="M60 81c4 8 8 16 11.5 24" fill="none" stroke="#D3B467" strokeOpacity="0.7" strokeWidth="0.7" />
      {/* flutter sleeves */}
      <path d="M43.5 63C38 64 35.5 70 34.5 78q2.5-1.5 4 1 2-3 4-.5 1-2 2.5-1.5V66Z" fill="#F1DFA5" />
      <path d="M76.5 63c5.5 1 8 7 9 15q-2.5-1.5-4 1-2-3-4-.5-1-2-2.5-1.5V66Z" fill="#E9D18F" />
      {/* waist tie */}
      <path d="M48 101.5h24l-.4 5.5H48.4Z" fill="#E1C27A" />
      <path d="M52.5 104c-4-4-7-2.5-5.5.8 1.2 1.6 3.5 1 5.5-.8Zm0 0c3-5 6.5-4 5.6-.4-.8 1.8-3.2 1.8-5.6.4Z" fill="#D6AD5C" />
      <path d="m52.5 104-3.5 14 2.2.6Zm0 0 1.5 15 2-.4Z" fill="#D6AD5C" />
      {/* clutch + hand */}
      <rect x="64" y="123" width="15" height="9.5" rx="2" fill="#D9BE84" />
      <path d="M64 126.5h15" stroke="#C4A56A" strokeWidth="0.7" />
      <path d="M71 126.5c1-3 4-4.5 6.5-3.5l.5 4.5-3.5 2.5Z" fill={skinShade} />
      {/* head + hair */}
      <path d="M60 16c8 0 13 6 13 15s-4 18-13 20c-9-2-13-11-13-20s5-15 13-15Z" fill={skin} />
      <path d="M47.5 33C47 21 53 15.5 61 15.5S73.5 20.5 73 31c-2-6-6-9.5-11-10-4 3-9 7-14.5 12Z" fill={hair} />
      <path d="M73 30c1.5 6 1 13-1.5 18" stroke={hair} strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </Svg>
  );
}

/** A gentleman in butter long sleeves (open collar) and navy trousers, hand in pocket. */
function ButterShirt({ className }: { className?: string }) {
  const skin = "#C99A76";
  return (
    <Svg className={className}>
      <defs>
        <linearGradient id="gf-shirt" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#F5E8B8" />
          <stop offset="1" stopColor="#E6D08E" />
        </linearGradient>
        <linearGradient id="gf-navy-1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#26375C" />
          <stop offset="1" stopColor="#1B2846" />
        </linearGradient>
      </defs>
      {SHADOW}
      {/* far arm, bent into the pocket */}
      <path d="M84 66c2.5 14 3.5 30 3 44 0 8-2 16-5 23l-5 8-5.5-3.5 4.5-8.5c2-5 3-10 3-17 0-12-1-24-2.5-34Z" fill="#E2CA84" />
      {/* trousers + shoes */}
      <path d="M44.5 131h31l.5 19c.5 40-1 90-2.5 136h-10L61 172l-1-12-1 12-2.5 114h-10c-1.5-46-3-96-2.5-136Z" fill="url(#gf-navy-1)" />
      <path d="m52.5 136-.5 148M68 136l1 148" stroke="#34487A" strokeWidth="0.6" opacity="0.8" />
      <path d="m71.5 133.5 5.5 12.5" stroke="#34487A" strokeWidth="0.8" />
      <path d="M46 285h10.5l.5 7q-7 2-14 .5 0-4.5 3-7.5Z" fill="#6B4A33" />
      <path d="M63.5 285H74q3 3 3.5 7.5-7.5 2-14.5.5Z" fill="#6B4A33" />
      {/* near arm + hand */}
      <path d="M36 66c-2.5 16-3 34-2 48s2.5 26 4 38h8c-.5-12-1-24-1.5-36-.5-12 0-26 1-38Z" fill="#EEDDA4" />
      <path d="M37.6 146.5h8.2" stroke="#D9BF77" strokeWidth="1" />
      <path d="M38.5 151c-.5 7 .5 13 3 16 2.5 0 4-4 4-10v-6Z" fill={skin} />
      {/* open collar skin + neck */}
      <path d="m53.5 57 6.5 19 6.5-19Z" fill={skin} />
      <path d="m54.5 45-.5 17q6 3 12 0l-.5-17Z" fill={skin} />
      <path d="M54.3 49q5.7 5.5 11.4 0v3.4q-5.7 4.6-11.4 0Z" fill="#B0805F" />
      {/* shirt */}
      <path
        d="M53.5 58 38.5 63.5Q35 65 35 70l3 30q2 18 6.5 30h31q4.5-12 6.5-30l3-30q0-5-3.5-6.5L66.5 58 60 74Z"
        fill="url(#gf-shirt)"
        stroke="#D2B66C"
        strokeOpacity="0.7"
        strokeWidth="0.6"
      />
      <path d="M60 75v52" stroke="#D9BF77" strokeWidth="0.8" />
      <g fill="#C9A75A">
        {[86, 98, 110, 122].map((y) => (
          <circle key={y} cx="60" cy={y} r="0.9" />
        ))}
      </g>
      <path d="M46 80q-1 22 2 44m26-44q1 22-2 44" fill="none" stroke="#DCC27E" strokeOpacity="0.55" strokeWidth="0.7" />
      <path d="m53.5 57.5-4.5 5 7.5 8L60 74Z" fill="#F7EDC6" stroke="#D9BF77" strokeWidth="0.6" strokeLinejoin="round" />
      <path d="m66.5 57.5 4.5 5-7.5 8L60 74Z" fill="#F0E2AE" stroke="#D9BF77" strokeWidth="0.6" strokeLinejoin="round" />
      {/* belt */}
      <path d="M44.5 126h31v6h-31Z" fill="#7A5636" />
      <rect x="57.5" y="126.4" width="5" height="5.2" rx="0.8" fill="none" stroke="#C9A75A" strokeWidth="1" />
      {/* head + hair */}
      <path d="M60 15c8.5 0 14 6 14 15.5S70 48.5 60 50.5c-10-2-14-10.5-14-20S51.5 15 60 15Z" fill={skin} />
      <path d="M45.8 30C45 18 52 11.5 60.5 11.8 69.5 12 75 18 74.4 29c-1.9-5.5-5.4-8-10.4-8-6 0-12 1.5-16 6Z" fill="#231C20" />
    </Svg>
  );
}

/** A lady in a dusty blue satin slip midi dress, holding a gold clutch. */
function BlueSlip({ className }: { className?: string }) {
  const skin = "#A87554";
  const skinShade = "#9A6A4B";
  const hair = "#1F1A1C";
  return (
    <Svg className={className}>
      <defs>
        <linearGradient id="gf-dusty" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#A6BBCF" />
          <stop offset="0.35" stopColor="#C7D5E2" />
          <stop offset="0.65" stopColor="#AFC2D5" />
          <stop offset="1" stopColor="#93AAC1" />
        </linearGradient>
      </defs>
      {SHADOW}
      <circle cx="67.5" cy="48" r="6.5" fill={hair} />
      {/* legs + strappy gold heels */}
      <path d="M46 232c-.5 16 .5 32 2.5 50h4c.5-18 1-34 1.5-50Z" fill={skin} />
      <path d="M61.5 232c.5 16 1.5 32 3 50h4c.5-18 1-34 1-50Z" fill={skinShade} />
      <path d="M48.3 281.5h4.4l1 8q-3.5 2.5-8 1.5.5-4 2.6-9.5Z" fill={skin} />
      <path d="M47.5 286h6m-7 3.5h7" stroke="#C9A75A" strokeWidth="1.1" />
      <path d="m53.2 284 .5 6.6" stroke="#B48F4E" strokeWidth="1" />
      <path d="M64.6 281.5H69l1.5 8q-3.5 2.5-8 1.5.3-4 2.1-9.5Z" fill={skinShade} />
      <path d="M64 286h6m-7 3.5h7.2" stroke="#C9A75A" strokeWidth="1.1" />
      <path d="m69.6 284 1 6.6" stroke="#B48F4E" strokeWidth="1" />
      {/* shoulders, neck */}
      <path d="M51 57c-4 3-8.5 4-10.5 8L40 82h40l-.5-17c-2-4-6.5-5-10.5-8Z" fill={skin} />
      <path d="m55.5 46-.5 14q5 3 10 0l-.5-14Z" fill={skin} />
      <path d="M55.3 50q4.7 5 9.4 0v3q-4.7 4-9.4 0Z" fill="#8C5E41" />
      {/* arms */}
      <path d="M40.5 65c-3 15-3.5 33-2.5 47s2 28 3 39c-.5 6 0 12 2 15.5 2.5 0 3.5-4.5 3-10.5-.3-8-.5-20-.7-32 .2-12 .7-26 1.7-42Z" fill={skin} />
      <path d="M79.5 65c3 15 3.5 33 2.5 47s-2 28-3 39c.5 6 0 12-2 15.5-2.5 0-3.5-4.5-3-10.5.3-8 .5-20 .7-32-.2-12-.7-26-1.7-42Z" fill={skinShade} />
      {/* dress */}
      <path d="M47 80q13 9 26 0c1.5 10 1 20-1 28 1.5 7 4 17 5.5 27 2.5 35 4.5 70 5.5 101q-11 5-23 3-12 2-23-3c1-31 3-66 5.5-101 1.5-10 4-20 5.5-27-2-8-2.5-18-1-28Z" fill="url(#gf-dusty)" />
      <path d="m50.5 61-1 20m20-20 1 20" stroke="#8FA6BD" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M50 83q10 9 20 0m-17 3.5q7 7.5 14 0" fill="none" stroke="#7F97B0" strokeOpacity="0.6" strokeWidth="0.7" />
      <path d="M54 112c-2 36-4 80-6 124" fill="none" stroke="#E4ECF3" strokeOpacity="0.55" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M66 112c2 38 5 80 7 124" fill="none" stroke="#7F97B0" strokeOpacity="0.45" strokeWidth="0.7" />
      {/* gold clutch */}
      <rect x="72.5" y="157" width="11" height="8" rx="1.6" fill="#C9A75A" />
      <path d="M75 157c.5-2.5 3.5-3 5-1l.5 3-4 .5Z" fill={skinShade} />
      {/* head + sleek hair */}
      <path d="M60 16c8 0 13 6 13 15s-4 18-13 20c-9-2-13-11-13-20s5-15 13-15Z" fill={skin} />
      <path d="M46.5 32C46 20 52 14.5 60 14.5S74 20 73.5 32c-1.5-7-6.5-11-13.5-11s-12 4-13.5 11Z" fill={hair} />
      <path d="M60 14.6v6.6" stroke="#3A3236" strokeWidth="0.7" />
    </Svg>
  );
}

/** A gentleman in a dusty blue embroidered barong over navy trousers. */
function BlueBarong({ className }: { className?: string }) {
  const skin = "#DDB08C";
  const skinShade = "#CFA07D";
  const left = [70, 79, 88, 97, 106, 115, 124, 133];
  const right = [74.5, 83.5, 92.5, 101.5, 110.5, 119.5, 128.5];
  const hem = [44, 48.5, 53, 57.5, 62.5, 67, 71.5, 76];
  return (
    <Svg className={className}>
      <defs>
        <linearGradient id="gf-barong" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#BACBDB" />
          <stop offset="1" stopColor="#9FB5CA" />
        </linearGradient>
        <linearGradient id="gf-navy-2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#26375C" />
          <stop offset="1" stopColor="#1B2846" />
        </linearGradient>
      </defs>
      {SHADOW}
      {/* trousers + shoes */}
      <path d="M45 148h30l-1 138H63.5l-3-116h-1l-3 116H46Z" fill="url(#gf-navy-2)" />
      <path d="m52 152-.5 132M68 152l.5 132" stroke="#34487A" strokeWidth="0.6" opacity="0.8" />
      <path d="M45.5 285H56l.5 7q-7 2-14 .5 0-4.5 3-7.5Z" fill="#2A2230" />
      <path d="M63.5 285H74q3 3 3.5 7.5-7.5 2-14.5.5Z" fill="#2A2230" />
      {/* sleeves + hands */}
      <path d="M36 66c-2.5 16-3 34-2 48s2.5 26 4 38h8c-.5-12-1-24-1.5-36-.5-12 0-26 1-38Z" fill="#B7C9DA" />
      <path d="M84 66c2.5 16 3 34 2 48s-2.5 26-4 38h-8c.5-12 1-24 1.5-36 .5-12 0-26-1-38Z" fill="#9CB2C7" />
      <path d="M37.6 146.5h8.2m36.6 0h-8.2" stroke="#EEF3F8" strokeWidth="1" />
      <path d="M38.5 151c-.5 7 .5 13 3 16 2.5 0 4-4 4-10v-6Z" fill={skin} />
      <path d="M81.5 151c.5 7-.5 13-3 16-2.5 0-4-4-4-10v-6Z" fill={skinShade} />
      {/* neck */}
      <path d="m54.5 45-.5 17q6 3 12 0l-.5-17Z" fill={skin} />
      <path d="M54.3 49q5.7 5.5 11.4 0v3.4q-5.7 4.6-11.4 0Z" fill="#C3936F" />
      {/* barong, worn untucked */}
      <path
        d="M53.5 58 38.5 63.5Q35 65 35 70l3.5 50q1 18 2 32 19.5 2.5 39 0 1-14 2-32l3.5-50q0-5-3.5-6.5L66.5 58q-6.5 3-13 0Z"
        fill="url(#gf-barong)"
        stroke="#8FA6BD"
        strokeOpacity="0.8"
        strokeWidth="0.6"
      />
      <path d="M60 61v26" stroke="#8FA6BD" strokeWidth="0.7" />
      <path d="m41 142 1.8 10m36.2-10-1.8 10" stroke="#8FA6BD" strokeWidth="0.7" />
      <g fill="#F4F7FA" fillOpacity="0.9">
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
        stroke="#F4F7FA"
        strokeOpacity="0.45"
        strokeWidth="0.5"
        strokeDasharray="1 1.5"
      />
      <path d="m53.5 57.5 2.5 7 4-3.5 4 3.5 2.5-7q-6.5 3-13 0Z" fill="#C9D7E4" stroke="#8FA6BD" strokeWidth="0.6" strokeLinejoin="round" />
      {/* head + hair */}
      <path d="M60 15c8.5 0 14 6 14 15.5S70 48.5 60 50.5c-10-2-14-10.5-14-20S51.5 15 60 15Z" fill={skin} />
      <path d="M45.8 29.5C45.5 18 52.5 11.8 61 12c8.5.3 14 6.3 13.4 17-2-6-7-9.6-13.6-9.4-6.2.2-11.5 3.6-15 9.9Z" fill="#4A3428" />
      <path d="M50 22c3-4 8-6 13-5.5" stroke="#5C4434" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </Svg>
  );
}

const FIGURES: Record<LookName, (p: { className?: string }) => React.ReactNode> = {
  butterDress: ButterDress,
  butterShirt: ButterShirt,
  blueSlip: BlueSlip,
  blueBarong: BlueBarong,
};

export function GuestFigure({ look, className }: { look: LookName; className?: string }) {
  const Figure = FIGURES[look];
  return <Figure className={className} />;
}
