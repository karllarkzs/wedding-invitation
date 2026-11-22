import { wedding } from "@/config/wedding.config";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GiftDetails } from "./GiftDetails";

/** A short, gentle note about gifts, from `gifts` in the config. Hidden if the message is empty. */
export function Gifts() {
  const { gifts } = wedding;
  if (!gifts.message) return null;
  return (
    <section id="gifts" aria-labelledby="gifts-title" className="px-4 py-16 sm:py-20">
      <SectionHeading id="gifts-title" title={gifts.title} subtitle="with gratitude" />
      <Reveal className="mx-auto mt-8 max-w-md text-center">
        <p className="text-balance text-[1.15rem] leading-relaxed text-ink-soft">{gifts.message}</p>
        {gifts.details.qrCodes.length > 0 && (
          <GiftDetails qrCodes={gifts.details.qrCodes} accountName={gifts.details.accountName} />
        )}
      </Reveal>
    </section>
  );
}
