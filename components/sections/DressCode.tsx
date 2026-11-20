import { wedding } from "@/config/wedding.config";
import { GuestFigure } from "@/components/art/GuestFigures";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function DressCode() {
  const { dressCode } = wedding;
  const { her, him } = dressCode.looks;
  const groups = [
    { label: "For her", ...her },
    { label: "For him", ...him },
  ];
  // Alternate her / him across the lineup.
  const lineup = her.items.flatMap((item, i) => (him.items[i] ? [item, him.items[i]] : [item]));
  return (
    <section id="attire" aria-labelledby="attire-title" className="band band-candle px-4 py-20 sm:py-28">
      <SectionHeading id="attire-title" title="Dress Code" subtitle="what to wear" />

      <Reveal className="mx-auto mt-10 max-w-lg text-center">
        <p className="font-display text-[1.5rem] font-semibold tracking-[0.24em] text-ink">{dressCode.title.toUpperCase()}</p>
        <p className="mt-4 text-balance text-ink-soft">{dressCode.description}</p>
      </Reveal>

      <Reveal delay={0.08} className="mx-auto mt-12 max-w-3xl">
        {/* Guest lineup: her, him, her, him */}
        <div
          role="img"
          aria-label={`Outfit ideas: ${lineup.map((item) => item.name).join(", ")}.`}
          className="relative mx-auto flex items-end justify-center gap-3 sm:gap-11"
        >
          <div
            aria-hidden="true"
            className="absolute inset-x-[6%] bottom-0 top-[20%] rounded-[50%] bg-[radial-gradient(closest-side,rgba(255,238,194,0.6),transparent)]"
          />
          {lineup.map((item, i) => (
            <Reveal key={item.look} delay={0.15 + i * 0.18} y={24} className="relative">
              <GuestFigure look={item.look} className="h-[270px] w-auto sm:h-[390px]" />
            </Reveal>
          ))}
        </div>

        <div className="mt-9 grid gap-7 text-center sm:grid-cols-2 sm:gap-6">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="font-script text-[2.3rem] leading-none text-ink">{group.label}</p>
              <p className="mt-2 italic text-ink-soft">{group.hint}</p>
              <p className="mx-auto mt-1.5 max-w-xs text-balance text-[0.92rem] font-semibold leading-snug text-ink">
                {group.items.map((item) => item.name).join(" · ")}
              </p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.12} className="mx-auto mt-12 max-w-2xl">
        <div className="grid gap-9 sm:grid-cols-2 sm:gap-0">
          {dressCode.palette.map((family, fi) => (
            <div
              key={family.label}
              className={`text-center sm:px-6 ${fi > 0 ? "sm:border-l sm:border-gold/35" : ""}`}
            >
              <p className="eyebrow">{family.label}</p>
              <ul className="mt-5 flex justify-center gap-5" aria-label={family.label}>
                {family.colors.map((c, ci) => (
                  <Reveal as="li" key={c.hex} delay={0.1 + fi * 0.3 + ci * 0.1} y={14} className="flex w-[4.5rem] flex-col items-center gap-2.5">
                    <span
                      className="size-14 rounded-full shadow-[0_10px_18px_-10px_rgba(70,63,82,0.6),inset_0_2px_3px_rgba(255,255,255,0.45),inset_0_-3px_6px_rgba(40,35,50,0.14)] ring-1 ring-white ring-offset-2 ring-offset-gold/35"
                      style={{ backgroundColor: c.hex }}
                      aria-hidden="true"
                    />
                    <span className="text-[0.95rem] font-semibold leading-tight text-ink-soft">{c.name}</span>
                  </Reveal>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Reveal>

      {dressCode.note && (
        <Reveal delay={0.2} className="mx-auto mt-10 max-w-md text-center">
          <p className="italic text-ink-soft">{dressCode.note}</p>
        </Reveal>
      )}
    </section>
  );
}
