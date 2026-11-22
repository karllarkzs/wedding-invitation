/**
 * Shared SVG gradients and filters, rendered once in the layout so every
 * petal and ornate frame can reference them (instead of repeating defs).
 * Hidden with zero size — not display:none, which would break references.
 */
export function SvgDefs() {
  return (
    <svg aria-hidden="true" focusable="false" width="0" height="0" style={{ position: "absolute", width: 0, height: 0 }}>
      <defs>
        {/* paper petals */}
        <linearGradient id="pf-light" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#C9B28E" />
          <stop offset="0.28" stopColor="#E7DAC4" />
          <stop offset="0.62" stopColor="#F8F2E7" />
          <stop offset="1" stopColor="#FFFEFB" />
        </linearGradient>
        <linearGradient id="pf-side" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#B9A07A" stopOpacity="0.22" />
          <stop offset="0.32" stopColor="#B9A07A" stopOpacity="0" />
          <stop offset="0.7" stopColor="#B9A07A" stopOpacity="0" />
          <stop offset="1" stopColor="#B9A07A" stopOpacity="0.16" />
        </linearGradient>

        {/* sculpted (plaster) ornaments */}
        <linearGradient id="ct-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFEFA" />
          <stop offset="0.55" stopColor="#F6EEDF" />
          <stop offset="1" stopColor="#E4D3B6" />
        </linearGradient>
        <filter id="ct-emboss" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="-0.35" dy="-0.35" stdDeviation="0.15" floodColor="#FFFFFF" floodOpacity="1" />
          <feDropShadow dx="0.5" dy="0.8" stdDeviation="0.55" floodColor="#6E5634" floodOpacity="0.45" />
        </filter>
        <filter id="ct-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2.2" stdDeviation="2.4" floodColor="#5E4A2C" floodOpacity="0.2" />
        </filter>

        {/* gold foil for line ornaments */}
        <linearGradient id="gold-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#B49867" stopOpacity="0" />
          <stop offset="0.2" stopColor="#B49867" />
          <stop offset="0.5" stopColor="#D8C08F" />
          <stop offset="0.8" stopColor="#B49867" />
          <stop offset="1" stopColor="#B49867" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
