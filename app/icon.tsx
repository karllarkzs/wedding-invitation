import { ImageResponse } from "next/og";
import { SealBadge, loadOgFonts } from "@/lib/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Browser-tab icon: the wax seal. */
export default function Icon() {
  return new ImageResponse(<SealBadge size={64} fontSize={16} />, { ...size, fonts: loadOgFonts() });
}
