import { ImageResponse } from "next/og";
import { wedding } from "@/config/wedding.config";
import { coupleNames, formatDate } from "@/lib/datetime";
import { cornerSpray, spraySvg } from "@/components/art/geometry";
import { SealBadge, loadOgFonts, svgDataUri } from "@/lib/og";

export const alt = `${coupleNames} — ${formatDate(wedding.date)}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const branch = svgDataUri(spraySvg(cornerSpray));

/** The link-preview card shown on Messenger, Viber, etc. Generated at build time. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
          background: "#FFFDF8",
          fontFamily: "Cormorant",
          color: "#463F52",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "radial-gradient(ellipse at 50% 50%, rgba(255,231,176,0.75) 0%, rgba(255,244,218,0.4) 32%, rgba(255,253,248,0) 62%)",
          }}
        />
        <div style={{ position: "absolute", top: 26, left: 26, right: 26, bottom: 26, display: "flex", border: "1.5px solid rgba(180,152,103,0.7)", borderRadius: 20 }} />
        <div style={{ position: "absolute", top: 38, left: 38, right: 38, bottom: 38, display: "flex", border: "1px solid rgba(180,152,103,0.35)", borderRadius: 13 }} />

        <img src={branch} width={340} height={340} alt="" style={{ position: "absolute", left: 4, bottom: -6 }} />
        <img src={branch} width={340} height={340} alt="" style={{ position: "absolute", right: 4, top: -6, transform: "rotate(180deg)" }} />

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <SealBadge size={104} fontSize={25} />
          <div style={{ display: "flex", marginTop: 22, fontFamily: "Display", fontSize: 20, letterSpacing: 6, color: "#84693E", textTransform: "uppercase" }}>
            Together with their families
          </div>
          <div style={{ display: "flex", fontFamily: "Script", fontSize: 132, lineHeight: 1.2, marginTop: 4 }}>
            {coupleNames}
          </div>
          <div style={{ display: "flex", alignItems: "center", marginTop: 2 }}>
            <div style={{ display: "flex", width: 130, height: 1.5, background: "#B49867" }} />
            <div style={{ display: "flex", width: 11, height: 11, margin: "0 18px", background: "#B49867", transform: "rotate(45deg)" }} />
            <div style={{ display: "flex", width: 130, height: 1.5, background: "#B49867" }} />
          </div>
          <div style={{ display: "flex", marginTop: 18, fontSize: 50 }}>{formatDate(wedding.date)}</div>
          <div style={{ display: "flex", marginTop: 2, fontSize: 30, fontStyle: "italic", color: "#655E70" }}>{wedding.city}</div>
        </div>
      </div>
    ),
    { ...size, fonts: loadOgFonts() },
  );
}
