import { wedding } from "@/config/wedding.config";
import { coupleNames, formatShortDate } from "@/lib/datetime";
import { Filigree } from "@/components/art/Filigree";
import { LoosePetal } from "@/components/art/LoosePetal";
import { WaxSeal } from "@/components/art/WaxSeal";
import { WaveDivider } from "@/components/art/Ornaments";
import { InkReveal } from "@/components/ui/InkReveal";
import { Reveal } from "@/components/ui/Reveal";

export function Footer() {
  return (
    <footer className="band band-champagne relative overflow-hidden px-4 pb-20 pt-10 text-center">
      <WaveDivider />

      <Reveal y={-20} delay={0.2} className="pointer-events-none absolute -left-8 top-24 w-24 sm:left-[8%] sm:w-32">
        <LoosePetal className="h-auto w-full" style={{ rotate: "118deg" }} />
      </Reveal>
      <Reveal y={-20} delay={0.35} className="pointer-events-none absolute -right-6 bottom-28 w-20 sm:right-[10%] sm:w-28">
        <LoosePetal className="h-auto w-full" style={{ rotate: "-62deg" }} />
      </Reveal>

      <div className="relative mx-auto mt-12 max-w-md">
        <p className="font-script text-[4rem] leading-none text-ink sm:text-[4.8rem]">
          <InkReveal duration={1.6}>Thank you</InkReveal>
        </p>
        <Reveal delay={0.4}>
          <p className="mx-auto mt-5 max-w-xs text-balance text-[1.2rem] italic leading-relaxed text-ink-soft">
            Your presence will make our celebration all the more meaningful. We can&rsquo;t wait to share it with you.
          </p>
          <Filigree className="mx-auto mt-6" />
        </Reveal>

        <Reveal delay={0.2} className="mt-8 flex flex-col items-center">
          <WaxSeal className="size-20 drop-shadow-[0_8px_10px_rgba(74,24,33,0.3)]" title={`${coupleNames} monogram`} />
          <p className="mt-5 font-script text-[2.9rem] leading-none text-ink">{coupleNames}</p>
          <p className="mt-4 font-display text-[0.95rem] font-semibold tracking-[0.34em] text-gold-deep">
            {formatShortDate(wedding.date)}
          </p>
          <p className="mt-6 text-[1.05rem] italic text-ink-soft">Ten years of us, and forever to go.</p>
        </Reveal>
      </div>
    </footer>
  );
}
