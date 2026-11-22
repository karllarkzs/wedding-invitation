import { wedding } from "@/config/wedding.config";
import { formatLongDate, formatTime } from "@/lib/datetime";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProgramTimeline } from "./ProgramTimeline";

export function Program() {
  const items = wedding.program.map((item) => ({ ...item, time: formatTime(item.time) }));
  return (
    <section id="program" aria-labelledby="program-title" className="px-4 py-16 sm:py-28">
      <SectionHeading id="program-title" title="Order of the Day" subtitle={formatLongDate(wedding.date)} />
      <ProgramTimeline items={items} />
    </section>
  );
}
