import { wedding } from "@/config/wedding.config";
import { numberWord, yearsTogether } from "@/lib/datetime";
import { Cartouche } from "@/components/art/Cartouche";
import { Filigree } from "@/components/art/Filigree";
import { withIDo } from "@/components/ui/IDo";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ChapterSpread } from "./ChapterSpread";

const NUMERALS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

/**
 * "Ten Years of Us": the story as alternating chapter spreads (photos on one
 * side, words on the other). Chapters without a photo `folder` become a
 * centered closing note.
 */
export function Journey({ photosByChapter }: { photosByChapter: Record<string, string[]> }) {
  const chapters = wedding.journey.chapters.map((chapter, i) => ({
    ...chapter,
    numeral: NUMERALS[i] ?? String(i + 1),
    folder: "folder" in chapter ? chapter.folder : null,
  }));
  const withPhotos = chapters.filter((c) => c.folder);
  const wordsOnly = chapters.filter((c) => !c.folder);

  return (
    <section id="journey" aria-labelledby="journey-title" className="band band-champagne px-4 py-16 sm:py-28">
      <SectionHeading
        id="journey-title"
        title={wedding.journey.title}
        intro={
          <p>
            On our wedding day we&rsquo;ll have been together for{" "}
            <span className="font-semibold text-ink">{numberWord(yearsTogether)} years</span>. Here&rsquo;s our
            story so far, in a few chapters.
          </p>
        }
      />

      <Reveal y={24} className="mx-auto mt-8 flex justify-center sm:mt-12">
        <Cartouche shape="round" paper className="w-32 sm:w-48">
          <span className="font-display text-[2.3rem] font-semibold leading-none text-gold-deep sm:text-[3rem]">{yearsTogether}</span>
          <span className="mt-1 font-script text-[1.2rem] leading-none text-ink sm:text-[1.5rem]">years of us</span>
        </Cartouche>
      </Reveal>

      <div className="mx-auto mt-10 flex max-w-5xl flex-col gap-12 sm:mt-20 sm:gap-20 md:gap-24">
        {withPhotos.map((chapter, i) => (
          <ChapterSpread
            key={chapter.title}
            numeral={chapter.numeral}
            title={chapter.title}
            when={chapter.when}
            text={chapter.text}
            photos={chapter.folder ? (photosByChapter[chapter.folder] ?? []) : []}
            mirror={i % 2 === 1}
          />
        ))}
      </div>

      {wordsOnly.map((chapter) => (
        <Reveal key={chapter.title} className="mx-auto mt-14 max-w-xl text-center md:mt-24">
          <Filigree className="mx-auto" />
          <p className="eyebrow mt-6">Chapter {chapter.numeral}</p>
          <h3 className="mt-2 font-script text-[3rem] leading-[1.08] text-ink sm:text-[3.8rem]">{chapter.title}</h3>
          <div className="mt-3 flex items-center justify-center gap-3">
            <span aria-hidden="true" className="h-px w-7 bg-gold/60" />
            <span className="text-[0.74rem] font-semibold uppercase tracking-[0.26em] text-gold-deep">{chapter.when}</span>
            <span aria-hidden="true" className="h-px w-7 bg-gold/60" />
          </div>
          <p className="mx-auto mt-4 max-w-md text-balance text-[1.15rem] italic leading-relaxed text-ink-soft">
            {withIDo(chapter.text)}
          </p>
        </Reveal>
      ))}
    </section>
  );
}
