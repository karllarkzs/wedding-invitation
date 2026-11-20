import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { sealSvg } from "@/components/art/geometry";
import { monogramText } from "./datetime";

const FONTS_DIR = join(process.cwd(), "assets/fonts");

/**
 * Static font files for next/og (it can't use next/font). Bundled locally so
 * builds never hit the network; read synchronously so images prerender at build.
 */
export function loadOgFonts() {
  const read = (file: string) => readFileSync(join(FONTS_DIR, file));
  const script = read("GreatVibes-Regular.ttf");
  const display = read("Cinzel-SemiBold.ttf");
  const cormorant = read("CormorantGaramond-Medium.ttf");
  const cormorantItalic = read("CormorantGaramond-MediumItalic.ttf");
  return [
    { name: "Script", data: script, weight: 400 as const, style: "normal" as const },
    { name: "Display", data: display, weight: 600 as const, style: "normal" as const },
    { name: "Cormorant", data: cormorant, weight: 500 as const, style: "normal" as const },
    { name: "Cormorant", data: cormorantItalic, weight: 500 as const, style: "italic" as const },
  ];
}

export const svgDataUri = (svg: string) => `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

/** Wax seal with the monogram, as an ImageResponse element. */
export function SealBadge({ size, fontSize }: { size: number; fontSize: number }) {
  return (
    <div style={{ width: size, height: size, display: "flex", position: "relative", alignItems: "center", justifyContent: "center" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={svgDataUri(sealSvg())} width={size} height={size} style={{ position: "absolute", top: 0, left: 0 }} alt="" />
      <div style={{ display: "flex", whiteSpace: "nowrap", fontFamily: "Script", fontSize, color: "#E7BAC3", marginTop: fontSize * 0.12 }}>
        {monogramText}
      </div>
    </div>
  );
}
