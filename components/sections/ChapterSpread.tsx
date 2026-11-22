"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { withIDo } from "@/components/ui/IDo";
import { Lightbox } from "@/components/ui/Lightbox";
import { Reveal } from "@/components/ui/Reveal";

type Props = {
  numeral: string;
  title: string;
  when: string;
  text: string;
  photos: string[];
  /** Photos on the right (and words on the left) on wider screens. */
  mirror?: boolean;
};

/**
 * Scrapbook print positions (static class strings so Tailwind can see them).
 * a = main portrait print, b = small square, c = landscape — overlapping, gently tilted.
 */
const PRINTS = {
  normal: {
    a: "left-[4%] top-[3%] w-[64%] -rotate-[2.5deg] z-[1]",
    b: "right-[2%] top-[6%] w-[40%] rotate-[4deg] z-[2]",
    c: "right-[8%] bottom-[2%] w-[44%] -rotate-[3deg] z-[3]",
    cWide: "right-[4%] bottom-[3%] w-[52%] rotate-[3deg] z-[3]",
  },
  mirror: {
    a: "right-[4%] top-[3%] w-[64%] rotate-[2.5deg] z-[1]",
    b: "left-[2%] top-[6%] w-[40%] -rotate-[4deg] z-[2]",
    c: "left-[8%] bottom-[2%] w-[44%] rotate-[3deg] z-[3]",
    cWide: "left-[4%] bottom-[3%] w-[52%] -rotate-[3deg] z-[3]",
  },
  single: "left-[18%] top-[3%] w-[64%] -rotate-[2deg] z-[1]",
} as const;

const PRINT_FRAME =
  "absolute rounded-[3px] bg-[#fffcf5] p-1.5 shadow-[0_18px_32px_-18px_rgba(70,63,82,0.5),0_2px_6px_rgba(70,63,82,0.08),inset_0_0_0_1px_rgba(180,152,103,0.18)] sm:p-2";

export function ChapterSpread({ numeral, title, when, text, photos, mirror = false }: Props) {
  const [index, setIndex] = useState<number | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const count = photos.length;
  const pos = mirror ? PRINTS.mirror : PRINTS.normal;

  const close = useCallback(() => {
    setIndex(null);
    openerRef.current?.focus();
  }, []);

  // Which prints to show, with their position, shape and photo index.
  const prints =
    count >= 3
      ? [
          { cls: pos.a, shape: "aspect-[4/5]", i: 0, sizes: "(min-width: 768px) 290px, 60vw" },
          { cls: pos.b, shape: "aspect-square", i: 1, sizes: "(min-width: 768px) 180px, 36vw" },
          { cls: pos.c, shape: "aspect-[4/3]", i: 2, sizes: "(min-width: 768px) 200px, 40vw" },
        ]
      : count === 2
        ? [
            { cls: pos.a, shape: "aspect-[4/5]", i: 0, sizes: "(min-width: 768px) 290px, 60vw" },
            { cls: pos.cWide, shape: "aspect-[4/3]", i: 1, sizes: "(min-width: 768px) 230px, 46vw" },
          ]
        : count === 1
          ? [{ cls: PRINTS.single, shape: "aspect-[4/5]", i: 0, sizes: "(min-width: 768px) 290px, 60vw" }]
          : [];

  return (
    <article className="grid items-center gap-5 sm:gap-8 md:grid-cols-2 md:gap-14">
      {/* Photos */}
      <Reveal className={mirror ? "md:order-2" : ""}>
        <div className="relative mx-auto aspect-[10/9] w-full max-w-[300px] sm:max-w-[330px] md:max-w-[440px]">
          {prints.length === 0 ? (
            <div aria-hidden="true" className={`${PRINT_FRAME} ${PRINTS.single}`}>
              <div className="deboss-well grid aspect-[4/5] place-items-center rounded-[2px]">
                <span className="emboss-text text-[3.2rem] font-semibold tracking-[0.06em] sm:text-[4rem]">{numeral}</span>
              </div>
            </div>
          ) : (
            prints.map((p, order) => {
              const more = count > 3 && p.i === 2 ? count - 3 : 0;
              return (
                // each print is "laid down" on the page: drops in, settles at its tilt
                <motion.button
                  key={p.i}
                  initial={{ opacity: 0, y: -46, scale: 1.12, rotate: order % 2 ? 9 : -9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ type: "spring", stiffness: 130, damping: 17, delay: 0.15 + order * 0.22 }}
                  type="button"
                  onClick={(e) => {
                    openerRef.current = e.currentTarget;
                    setIndex(p.i);
                  }}
                  aria-label={`View photo ${p.i + 1} of ${count} from ${title}`}
                  className={`group ${PRINT_FRAME} ${p.cls} transition-[translate,box-shadow] duration-500 hover:-translate-y-1`}
                >
                  <span className={`relative block w-full overflow-hidden rounded-[2px] bg-ivory ${p.shape}`}>
                    <Image src={photos[p.i]} alt="" fill sizes={p.sizes} className="photo-tone object-cover object-[50%_35%]" />
                    <span aria-hidden="true" className="photo-tone-glow" />
                    {more > 0 && (
                      <span
                        aria-hidden="true"
                        className="absolute bottom-1.5 right-1.5 rounded-full bg-[#463f52]/75 px-2.5 py-0.5 text-[0.8rem] font-semibold text-white backdrop-blur-sm"
                      >
                        +{more}
                      </span>
                    )}
                  </span>
                </motion.button>
              );
            })
          )}
        </div>
      </Reveal>

      {/* Words */}
      <Reveal
        delay={0.1}
        className={`text-center ${mirror ? "md:order-1 md:text-right" : "md:text-left"}`}
      >
        <p className="eyebrow">Chapter {numeral}</p>
        <h3 className="mt-2 text-balance font-script text-[2.4rem] leading-[1.08] text-ink sm:text-[3.3rem]">{title}</h3>
        <div
          className={`mt-3 flex items-center justify-center gap-3 ${mirror ? "md:justify-end" : "md:justify-start"}`}
        >
          <span aria-hidden="true" className="h-px w-7 bg-gold/60" />
          <span className="text-[0.74rem] font-semibold uppercase tracking-[0.26em] text-gold-deep">{when}</span>
          <span aria-hidden="true" className="h-px w-7 bg-gold/60" />
        </div>
        <p
          className={`mx-auto mt-4 max-w-md text-[1.12rem] leading-relaxed text-ink-soft ${mirror ? "md:ml-auto md:mr-0" : "md:ml-0"}`}
        >
          {withIDo(text)}
        </p>
        {count > 0 && (
          <button
            type="button"
            onClick={(e) => {
              openerRef.current = e.currentTarget;
              setIndex(0);
            }}
            className="link-hairline mt-5 text-[0.78rem] font-semibold uppercase tracking-[0.2em] text-ink"
          >
            View {count === 1 ? "the photo" : `all ${count} photos`}
          </button>
        )}
      </Reveal>

      {count > 0 && (
        <Lightbox
          images={photos.map((src, i) => ({ src, alt: `${title} (photo ${i + 1} of ${count})` }))}
          index={index}
          onClose={close}
          onIndexChange={setIndex}
        />
      )}
    </article>
  );
}
