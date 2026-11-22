import { wedding } from "@/config/wedding.config";
import { GuestFigure, LOOK_LABEL } from "@/components/art/GuestFigures";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function DressCode() {
  const { dressCode } = wedding;
  return (
    <section id="attire" aria-labelledby="attire-title" className="band band-candle px-4 py-16 sm:py-28">
      <SectionHeading id="attire-title" title="Dress Code" subtitle="what to wear" />

      <Reveal className="mx-auto mt-10 max-w-lg text-center">
        <p className="font-display text-[1.5rem] font-semibold tracking-[0.24em] text-ink">{dressCode.title.toUpperCase()}</p>
        <p className="mt-4 text-balance text-ink-soft">{dressCode.description}</p>
      </Reveal>

      {/* wedding colors: one row of circles, a small gap between the yellows and the blues */}
      <Reveal delay={0.08} className="mx-auto mt-9 flex justify-center gap-6 sm:gap-9">
        {dressCode.palette.map((family, fi) => (
          <ul key={family.label} aria-label={family.label} className="flex gap-2.5 sm:gap-4">
            {family.colors.map((c, ci) => (
              <Reveal as="li" key={c.hex} delay={0.1 + fi * 0.3 + ci * 0.1} y={14}>
                <span
                  title={c.name}
                  className="block size-11 rounded-full shadow-[0_10px_18px_-10px_rgba(70,63,82,0.6),inset_0_2px_3px_rgba(255,255,255,0.45),inset_0_-3px_6px_rgba(40,35,50,0.14)] ring-1 ring-white ring-offset-2 ring-offset-gold/35 sm:size-14"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="sr-only">{c.name}</span>
              </Reveal>
            ))}
          </ul>
        ))}
      </Reveal>

      {/* outfit ideas, each with what to wear: principal sponsors | guests */}
      <div className="mx-auto mt-12 grid max-w-5xl gap-12 sm:mt-16 sm:gap-16 md:grid-cols-2 md:gap-8">
        {dressCode.lineups.map((group, gi) => (
          <Reveal key={group.label} delay={0.08 + gi * 0.1}>
            <p className="text-center font-script text-[2.3rem] leading-none text-ink">{group.label}</p>
            <div
              role="img"
              aria-label={`Outfit ideas for ${group.label.toLowerCase()}: ${group.looks.map((look) => LOOK_LABEL[look]).join(", ")}.`}
              className="relative mx-auto mt-6 flex items-end justify-center gap-2 sm:gap-5"
            >
              <div
                aria-hidden="true"
                className="absolute inset-x-[4%] bottom-0 top-[20%] rounded-[50%] bg-[radial-gradient(closest-side,rgba(255,238,194,0.6),transparent)]"
              />
              {group.looks.map((look, i) => (
                <Reveal key={look} delay={0.15 + i * 0.15} y={24} className="relative">
                  <GuestFigure look={look} className="h-[215px] w-auto sm:h-[320px]" />
                </Reveal>
              ))}
            </div>
            <dl className="mt-7 space-y-1.5 text-center">
              {group.attire.map((a) => (
                <div key={a.label} className="text-balance">
                  <dt className="eyebrow inline">{a.label}</dt>
                  <dd className="ml-2.5 inline text-[1.15rem] text-ink">{a.text}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        ))}
      </div>

      {dressCode.note && (
        <Reveal delay={0.2} className="mx-auto mt-10 max-w-md text-center">
          <p className="italic text-ink-soft">{dressCode.note}</p>
        </Reveal>
      )}
    </section>
  );
}
