import { ImageResponse } from "next/og";
import { SealBadge, loadOgFonts } from "@/lib/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home-screen icon: the wax seal on ivory. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#FBF6EA" }}>
        <SealBadge size={150} fontSize={36} />
      </div>
    ),
    { ...size, fonts: loadOgFonts() },
  );
}
