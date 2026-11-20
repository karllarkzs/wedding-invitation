"use client";

import Image from "next/image";
import { useCallback, useContext, useRef, useState } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { deckleRect } from "@/components/art/petals";
import { EmbossedPlaceholder } from "@/components/ui/EmbossedPlaceholder";
import { Lightbox } from "@/components/ui/Lightbox";
import { OpenedContext, Reveal } from "@/components/ui/Reveal";
import { Unveil } from "@/components/ui/Unveil";

type Props = { images: string[]; names: string; monogram: string; caption?: string };

/** How many photos the layout shows. Any extras open from "View all". */
export const GALLERY_SLOTS = 6;

/**
 * A print is a 3:4 photo with an even paper margin (6.5% of its width),
 * which makes the whole sheet 300 × 387. Its edge is softly deckled.
 */
const PRINT_W = 300;
const PRINT_H = 387;
const DECKLE = deckleRect(PRINT_W, PRINT_H, 6, 2.6);

/** Faded, warm and light: how a print looks before it "develops". */
const UNDEVELOPED = "sepia(0.85) saturate(0.35) brightness(1.3) contrast(0.78)";
/** The site's gentle photo tone, once developed. */
const DEVELOPED = "sepia(0.14) saturate(0.9) brightness(1.03) contrast(0.96)";

/**
 * Where each print sits (static class strings so Tailwind can see them).
 * Phone: the arch on top, two staggered pairs of prints that overlap a little,
 * then a last print laid in the middle.
 * Wider screens: the arch in the middle, with the prints zig-zagging down
 * both sides (three on the left, two on the right sitting between them).
 */
const PRINTS = [
  {
    place: "col-[1/8] row-[3/4] md:col-[1/2] md:row-[1/3]",
    tilt: -3,
    drift: [20, -20],
    sizes: "(min-width: 768px) 260px, 56vw",
  },
  {
    place: "col-[7/13] row-[3/4] mt-16 md:col-[3/4] md:row-[2/4] md:mt-0",
    tilt: 2.5,
    drift: [46, -38],
    sizes: "(min-width: 768px) 260px, 48vw",
  },
  {
    place: "col-[1/7] row-[4/5] -mt-3 md:col-[1/2] md:row-[3/5] md:mt-0",
    tilt: 2,
    drift: [16, -16],
    sizes: "(min-width: 768px) 260px, 48vw",
  },
  {
    place: "col-[6/13] row-[4/5] mt-7 md:col-[3/4] md:row-[4/6] md:mt-0",
    tilt: -2.5,
    drift: [40, -34],
    sizes: "(min-width: 768px) 260px, 56vw",
  },
  {
    place: "col-[3/11] row-[5/6] mt-4 md:col-[1/2] md:row-[5/7] md:mt-0",
    tilt: -1.5,
    drift: [30, -26],
    sizes: "(min-width: 768px) 260px, 64vw",
  },
] as const;

/** Prenup photos: an arched feature photo with fine-art prints around it, and a swipeable lightbox. */
export function Gallery({ images, names, monogram, caption }: Props) {
  const [index, setIndex] = useState<number | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion() ?? false;
  const count = images.length;

  const close = useCallback(() => {
    setIndex(null);
    openerRef.current?.focus();
  }, []);

  const open = useCallback((i: number, opener: HTMLElement) => {
    openerRef.current = opener;
    setIndex(i);
  }, []);

  return (
    <>
      <div className="mx-auto mt-14 grid max-w-[420px] grid-cols-12 items-start gap-y-6 md:max-w-5xl md:grid-cols-[1fr_2fr_1fr] md:gap-x-10 md:gap-y-6">
        <Feature
          src={images[0]}
          label={`Open photo 1 of ${count}`}
          reduce={reduce}
          onOpen={(e) => open(0, e.currentTarget)}
          className="col-[1/-1] row-[1/2] md:col-[2/3] md:row-[1/7] md:self-center"
        />

        {caption && (
          <Reveal className="col-[1/-1] row-[2/3] px-6 pt-2 text-center md:row-[7/8] md:pt-10">
            <p className="mx-auto max-w-sm text-balance text-[1.3rem] italic leading-snug text-ink-soft">{caption}</p>
          </Reveal>
        )}

        {PRINTS.map((p, n) => {
          const i = n + 1;
          return (
            <Print
              key={i}
              src={images[i]}
              label={`Open photo ${i + 1} of ${count}`}
              monogram={monogram}
              order={n}
              reduce={reduce}
              onOpen={(e) => open(i, e.currentTarget)}
              {...p}
            />
          );
        })}
      </div>

      {count > GALLERY_SLOTS && (
        <Reveal className="mt-12 text-center">
          <button
            type="button"
            onClick={(e) => open(0, e.currentTarget)}
            className="link-hairline font-display text-[0.78rem] font-semibold uppercase tracking-[0.2em] text-ink"
          >
            View all {count} photos
          </button>
        </Reveal>
      )}

      {count > 0 && (
        <Lightbox
          images={images.map((src, i) => ({ src, alt: `${names} prenup photo ${i + 1} of ${count}` }))}
          index={index}
          onClose={close}
          onIndexChange={setIndex}
        />
      )}
    </>
  );
}

type FeatureProps = {
  src?: string;
  label: string;
  reduce: boolean;
  onOpen: (e: React.MouseEvent<HTMLElement>) => void;
  className: string;
};

/** The first photo, in a tall arched window (taller still on wide screens). It unveils, then slowly zooms out and drifts as you scroll. */
function Feature({ src, label, reduce, onOpen, className }: FeatureProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.16, 1.03]);

  return (
    <Reveal y={36} className={className}>
      <div
        ref={ref}
        className="paper-card arch relative mx-auto max-w-[380px] p-2.5 [--arch-foot:22px] [--arch-rise:38%] sm:p-3 md:max-w-none md:[--arch-rise:34%]"
      >
        <div className="arch relative aspect-[3/4] overflow-hidden bg-ivory [--arch-foot:14px] [--arch-rise:37.5%] md:aspect-[2/3] md:[--arch-rise:33.3%]">
          {src ? (
            <button type="button" onClick={onOpen} aria-label={label} className="group absolute inset-0 block">
              <Unveil delay={0.15}>
                <motion.div className="absolute inset-x-0 -inset-y-[8%]" style={reduce ? undefined : { y, scale }}>
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 460px, 92vw"
                    className="photo-tone object-cover"
                  />
                </motion.div>
                <span aria-hidden="true" className="photo-tone-glow" />
              </Unveil>
              <span
                aria-hidden="true"
                className="arch pointer-events-none absolute inset-2.5 border border-white/70 [--arch-foot:8px] [--arch-rise:37%] md:[--arch-rise:33%]"
              />
            </button>
          ) : (
            <EmbossedPlaceholder
              label="Prenup photos coming soon"
              script="Prenup"
              sublabel="Photos coming soon"
              className="absolute inset-0"
            />
          )}
        </div>
      </div>
    </Reveal>
  );
}

type PrintProps = {
  src?: string;
  label: string;
  monogram: string;
  order: number;
  reduce: boolean;
  onOpen: (e: React.MouseEvent<HTMLElement>) => void;
  place: string;
  tilt: number;
  drift: readonly [number, number];
  sizes: string;
};

/**
 * A fine-art print with a deckled paper edge. It is laid down on the page,
 * "develops" from faded sepia into colour, and drifts at its own pace as you scroll.
 */
function Print({ src, label, monogram, order, reduce, onOpen, place, tilt, drift, sizes }: PrintProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [...drift]);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const opened = useContext(OpenedContext);
  const show = inView && opened;

  return (
    <motion.div ref={ref} className={`relative ${place}`} style={reduce ? undefined : { y }}>
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: -40, scale: 1.1, rotate: tilt * 3.5 }}
        animate={show ? { opacity: 1, y: 0, scale: 1, rotate: tilt } : undefined}
        transition={{ type: "spring", stiffness: 120, damping: 17, delay: 0.1 + (order % 2) * 0.18 }}
      >
        {/* the paper sheet, with a soft deckled edge */}
        <svg
          aria-hidden="true"
          viewBox={`0 0 ${PRINT_W} ${PRINT_H}`}
          preserveAspectRatio="none"
          className="print-paper absolute inset-0 h-full w-full"
        >
          <path d={DECKLE} fill="#fffcf5" />
        </svg>
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-[3.2%] inset-y-[2.5%] border border-gold/25" />

        {src ? (
          <button
            type="button"
            onClick={onOpen}
            aria-label={label}
            className="group relative block w-full p-[6.5%] transition-[translate] duration-500 hover:-translate-y-1"
          >
            <span className="relative block aspect-[3/4] overflow-hidden bg-ivory">
              <motion.span
                className="absolute inset-0 block"
                initial={{ filter: UNDEVELOPED }}
                animate={show ? { filter: DEVELOPED } : undefined}
                transition={{ duration: 2.6, delay: 0.45 + (order % 2) * 0.18, ease: [0.33, 0, 0.2, 1] }}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes={sizes}
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                />
              </motion.span>
              <span aria-hidden="true" className="photo-tone-glow" />
            </span>
          </button>
        ) : (
          <div role="img" aria-label="Prenup photo coming soon" className="relative p-[6.5%]">
            <div className="deboss-well grid aspect-[3/4] place-items-center">
              <div className="text-center">
                <p className="emboss-text font-script text-[2.6rem] leading-none sm:text-[3.2rem]">{monogram}</p>
                <p className="mt-3 font-display text-[0.58rem] font-semibold uppercase tracking-[0.26em] text-[#968767]">
                  Coming soon
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
