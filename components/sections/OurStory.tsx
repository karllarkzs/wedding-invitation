import { wedding } from "@/config/wedding.config";
import { coupleNames, yearsTogether, monogramText } from "@/lib/datetime";
import { CARTOUCHE, Cartouche } from "@/components/art/Cartouche";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ScratchPortrait } from "@/components/ui/ScratchPortrait";
import { SmartImage } from "@/components/ui/SmartImage";

/** How far the sculpted frame reaches beyond the oval (for spacing). */
const FRAME_TOP = ((CARTOUCHE.cy - CARTOUCHE.ry) / (CARTOUCHE.ry * 2)) * 100;

export function OurStory({ photoAvailable }: { photoAvailable: boolean }) {
  const { story, couple } = wedding;

  return (
    <section id="story" aria-labelledby="story-title" className="px-4 py-16 sm:py-28">
      <SectionHeading id="story-title" title={story.title} subtitle="how it all began" />

      <div className="mx-auto mt-16 grid max-w-4xl items-center gap-14 md:grid-cols-[340px_1fr] md:gap-16">
        <Reveal y={30} className="relative mx-auto w-[min(54vw,240px)]" >
          <div style={{ paddingTop: `${FRAME_TOP * 0.8}%` }}>
            {photoAvailable ? (
              <ScratchPortrait src={story.photo} alt={coupleNames} focus={story.photoFocus} monogram={monogramText} />
            ) : (
              <div className="relative">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[50%]">
                  <SmartImage
                    src={story.photo}
                    alt={coupleNames}
                    available={false}
                    sizes="240px"
                    placeholderLabel={couple.monogram}
                    placeholderScript={monogramText}
                    placeholderSublabel={`${yearsTogether} years & counting`}
                    placeholderClassName="rounded-[50%]"
                  />
                </div>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute"
                  style={{
                    left: `${(-(CARTOUCHE.cx - CARTOUCHE.rx) / (CARTOUCHE.rx * 2)) * 100}%`,
                    top: `${-FRAME_TOP}%`,
                    width: `${(CARTOUCHE.w / (CARTOUCHE.rx * 2)) * 100}%`,
                    height: `${(CARTOUCHE.h / (CARTOUCHE.ry * 2)) * 100}%`,
                  }}
                >
                  <Cartouche className="h-full w-full" />
                </div>
              </div>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.15} className="mx-auto max-w-lg text-center md:mx-0 md:text-left">
          {story.paragraphs.map((p, i) => (
            <p
              key={i}
              className={`text-[1.24rem] leading-relaxed text-ink-soft ${
                i > 0
                  ? "mt-5"
                  : "md:first-letter:float-left md:first-letter:mr-2 md:first-letter:font-script md:first-letter:text-[3.8rem] md:first-letter:leading-[0.85] md:first-letter:text-gold-deep"
              }`}
            >
              {p}
            </p>
          ))}
          <p className="mt-7 font-script text-[2.7rem] leading-none text-ink">{coupleNames}</p>
        </Reveal>
      </div>
    </section>
  );
}
