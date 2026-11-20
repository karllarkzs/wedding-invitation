"use client";

import { useId } from "react";
import { monogramText } from "@/lib/datetime";
import { sealOutline } from "./geometry";

const OUTLINE = sealOutline();

type Props = { className?: string; monogram?: string; title?: string };

/** Deep wine-red wax seal with a pressed monogram. Original artwork. */
export function WaxSeal({ className = "", monogram = monogramText, title }: Props) {
  const id = useId().replace(/:/g, "");
  const wax = `wax-${id}`;
  const well = `well-${id}`;
  const soft = `soft-${id}`;
  const textProps = {
    x: 60,
    y: 69,
    textAnchor: "middle" as const,
    fontSize: 25,
    style: { fontFamily: "var(--font-script-face), cursive" },
  };

  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <defs>
        <radialGradient id={wax} cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#A64A5A" />
          <stop offset="0.45" stopColor="#7B2E3B" />
          <stop offset="1" stopColor="#4C1821" />
        </radialGradient>
        <radialGradient id={well} cx="60%" cy="64%" r="70%">
          <stop offset="0" stopColor="#8A3545" />
          <stop offset="1" stopColor="#682430" />
        </radialGradient>
        <filter id={soft} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
      </defs>

      {/* puddled wax */}
      <path d={OUTLINE} fill={`url(#${wax})`} />
      <path d={OUTLINE} fill="none" stroke="#FFD9DE" strokeOpacity="0.16" strokeWidth="1.2" transform="translate(-0.7 -0.7)" />
      <path d={OUTLINE} fill="none" stroke="#2E0C12" strokeOpacity="0.25" strokeWidth="1" transform="translate(0.8 1)" />

      {/* stamped well — shadow on the upper-left lip, light on the lower-right */}
      <circle cx="60" cy="60" r="37.5" fill={`url(#${well})`} />
      <circle cx="59.3" cy="59.2" r="37.5" fill="none" stroke="#35101A" strokeOpacity="0.55" strokeWidth="1.8" />
      <circle cx="60.9" cy="61" r="37" fill="none" stroke="#FFC9D1" strokeOpacity="0.22" strokeWidth="1.1" />
      <circle
        cx="60"
        cy="60"
        r="32"
        fill="none"
        stroke="#FFD6DC"
        strokeOpacity="0.32"
        strokeWidth="1.3"
        strokeDasharray="0.1 3.4"
        strokeLinecap="round"
      />

      {/* monogram, debossed */}
      <text {...textProps} fill="#3A0F17" fillOpacity="0.65" transform="translate(-0.7 -0.9)">
        {monogram}
      </text>
      <text {...textProps} fill="#FFD3DA" fillOpacity="0.28" transform="translate(0.7 0.9)">
        {monogram}
      </text>
      <text {...textProps} fill="#94394A">
        {monogram}
      </text>

      {/* glossy highlight */}
      <ellipse
        cx="40"
        cy="33"
        rx="15"
        ry="7.5"
        fill="#FFFFFF"
        opacity="0.16"
        filter={`url(#${soft})`}
        transform="rotate(-32 40 33)"
      />
    </svg>
  );
}
