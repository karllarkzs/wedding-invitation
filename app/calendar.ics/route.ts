import { wedding } from "@/config/wedding.config";
import { buildIcs } from "@/lib/calendar";

const filename = `${wedding.couple.partnerOne}-and-${wedding.couple.partnerTwo}-wedding.ics`
  .toLowerCase()
  .replace(/[^a-z0-9.-]+/g, "-");

/** "Add to calendar" file for Apple Calendar / Outlook. Prerendered at build. */
export function GET() {
  return new Response(buildIcs(), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
