import { wedding } from "@/config/wedding.config";
import { dateParts, formatDate, formatTime, monogramText } from "@/lib/datetime";
import { Eucalyptus } from "@/components/art/Eucalyptus";
import { Filigree } from "@/components/art/Filigree";
import { LoosePetal } from "@/components/art/LoosePetal";
import { InkReveal } from "@/components/ui/InkReveal";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Paper petals arranged around the invitation card — kept to the corners
 * (outside the arch, below the last line) so they never sit on the text.
 */
const PETALS = [
  { cls: "-left-9 -bottom-5 w-24 sm:-left-16 sm:-bottom-2 sm:w-36", rot: 146, d: 0.5 },
  { cls: "-left-1 -bottom-11 w-16 sm:w-24", rot: 212, d: 0.65 },
  { cls: "left-16 -bottom-12 w-12 sm:left-24 sm:w-20", rot: 176, d: 0.8 },
  { cls: "-right-8 -top-3 w-24 sm:-right-14 sm:w-32", rot: -40, d: 0.6 },
  { cls: "right-3 top-16 w-12 sm:right-6 sm:top-20 sm:w-16", rot: 18, d: 0.75 },
];

export function Hero() {
  const d = dateParts(wedding.date);
  const { partnerOne, partnerTwo } = wedding.couple;

  return (
    <section id="invitation" aria-labelledby="hero-names" className="relative px-4 pb-16 pt-12 sm:pb-24 sm:pt-20">
      <div
        aria-hidden="true"
        className="candle-glow left-1/2 top-[38%] size-[min(150vw,900px)] -translate-x-1/2 -translate-y-1/2"
      />

      <div className="relative mx-auto max-w-[440px]">
        {PETALS.map((p, i) => (
          <Reveal key={i} delay={p.d} y={-26} className={`pointer-events-none absolute z-[2] ${p.cls}`}>
            <LoosePetal className="h-auto w-full" style={{ rotate: `${p.rot}deg` }} />
          </Reveal>
        ))}

        <Reveal y={30}>
          <div className="paper-card arch relative overflow-hidden px-7 pb-14 pt-24 text-center [--arch-rise:170px] sm:px-12 sm:pt-28 sm:[--arch-rise:220px]">
            <div className="hairline-inset arch [--arch-foot:20px] [--arch-rise:162px] sm:[--arch-rise:212px]" />

            {/* embossed eucalyptus in the corners */}
            <Eucalyptus spray="corner" tone="emboss" className="absolute -bottom-2 -left-3 w-[44%]" />
            <Eucalyptus
              spray="corner"
              tone="emboss"
              className="absolute -bottom-2 -right-3 w-[44%]"
              style={{ transform: "scaleX(-1)" }}
            />
            <Eucalyptus
              spray="corner"
              tone="emboss"
              className="absolute left-[3%] top-[8.5%] w-[25%] opacity-90"
              style={{ transform: "scaleY(-1) rotate(-14deg)" }}
            />
            <Eucalyptus
              spray="corner"
              tone="emboss"
              className="absolute right-[3%] top-[8.5%] w-[25%] opacity-90"
              style={{ transform: "scale(-1, -1) rotate(-14deg)" }}
            />

            <div className="relative">
              <p className="font-script text-[2.1rem] leading-none text-gold-deep">{monogramText}</p>
              <p className="eyebrow mt-6">{wedding.hero.openingLine}</p>

              {/* focusable so "Back to top" can bring keyboard focus here */}
              <h1 id="hero-names" tabIndex={-1} className="mt-4 font-script leading-[1] text-ink outline-none">
                <span className="block text-[4.6rem] sm:text-[5.4rem]">
                  <InkReveal delay={0.35}>{partnerOne}</InkReveal>
                </span>
                <span className="gold-foil block py-0.5 text-[2.8rem] sm:text-[3.4rem]" aria-hidden="true">
                  <InkReveal delay={1.05} duration={0.6}>
                    &amp;
                  </InkReveal>
                </span>
                <span className="sr-only">and</span>
                <span className="block text-[4.6rem] sm:text-[5.4rem]">
                  <InkReveal delay={1.35}>{partnerTwo}</InkReveal>
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-[18rem] text-balance text-[1.25rem] italic leading-snug text-ink-soft">
                {wedding.hero.invitationLine}
              </p>

              {/* Tuesday | 5 | January 2027 */}
              <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-stretch gap-4 text-ink">
                <div className="flex flex-col justify-center border-y border-gold/55 py-2">
                  <span className="font-display text-[0.74rem] font-semibold tracking-[0.2em]">{d.weekday.toUpperCase()}</span>
                </div>
                <div className="px-1 font-display text-[3.4rem] font-semibold leading-none text-gold-deep sm:text-[4rem]">
                  {d.day}
                </div>
                <div className="flex flex-col justify-center border-y border-gold/55 py-2 font-display text-[0.74rem] font-semibold leading-relaxed tracking-[0.2em]">
                  <span>{d.month.toUpperCase()}</span>
                  <span>{d.year}</span>
                </div>
              </div>

              <p className="mt-7 text-balance font-display text-[0.8rem] font-semibold leading-relaxed tracking-[0.14em] text-ink">
                {wedding.ceremony.name.toUpperCase()}
              </p>
              <p className="mt-1 text-[1.1rem] text-ink-soft">
                {wedding.city} · {formatTime(wedding.ceremony.time)}
              </p>

              <Filigree className="mx-auto mt-6" />

              <a
                href="#rsvp"
                className="link-hairline mt-4 inline-block text-balance font-display text-[0.78rem] font-semibold leading-relaxed tracking-[0.14em] text-wax"
              >
                KINDLY REPLY BY {formatDate(wedding.rsvpDeadline).toUpperCase()}
              </a>

              <p className="mt-6 font-script text-[2.1rem] leading-none text-sage-deep">{wedding.hero.tagline}</p>
            </div>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.9} className="mt-10 flex justify-center">
        <a
          href="#countdown"
          className="group flex flex-col items-center gap-2 font-display text-[0.68rem] font-semibold tracking-[0.3em] text-ink-soft"
        >
          SCROLL
          <span
            aria-hidden="true"
            className="h-10 w-px bg-gradient-to-b from-gold to-transparent transition-transform group-hover:translate-y-1"
          />
        </a>
      </Reveal>
    </section>
  );
}
