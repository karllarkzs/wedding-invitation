import { wedding } from "@/config/wedding.config";
import { formatDate } from "@/lib/datetime";
import { Eucalyptus } from "@/components/art/Eucalyptus";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RsvpForm } from "./RsvpForm";

export function Rsvp() {
  return (
    <section id="rsvp" aria-labelledby="rsvp-title" className="relative px-4 py-20 sm:py-28">
      <div
        aria-hidden="true"
        className="candle-glow left-1/2 top-1/2 size-[min(140vw,860px)] -translate-x-1/2 -translate-y-1/2"
      />
      <SectionHeading
        id="rsvp-title"
        title="RSVP"
        subtitle="Will you join us?"
        intro={<p>It would mean the world to have you with us. Please let us know by {formatDate(wedding.rsvpDeadline)}.</p>}
      />

      <Reveal className="relative mx-auto mt-10 max-w-lg">
        <div className="paper-card relative overflow-hidden px-6 py-9 sm:px-10 sm:py-11">
          <div className="hairline-inset rounded-[20px]" />
          <Eucalyptus
            spray="corner"
            tone="emboss"
            className="pointer-events-none absolute -right-4 -top-4 w-36"
            style={{ transform: "rotate(180deg)" }}
          />
          <div className="relative">
            <RsvpForm
              weddingDate={formatDate(wedding.date)}
              contact={`Just message ${wedding.couple.partnerOne} or ${wedding.couple.partnerTwo}.`}
            />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
