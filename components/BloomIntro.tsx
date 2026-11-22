"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LoosePetal } from "@/components/art/LoosePetal";
import { PaperFlower } from "@/components/art/PaperFlower";
import { WaxSeal } from "@/components/art/WaxSeal";
import { deckleRect } from "@/components/art/petals";

const CARD_W = 250;
const CARD_H = 350;
const DECKLE = deckleRect(CARD_W, CARD_H, 5, 2.4);

/** Loose petals resting around the flower, drifting in as it blooms. */
const SCATTER = [
  { left: "-6%", top: "6%", size: 92, rot: 132, d: 0.9 },
  { right: "-5%", top: "15%", size: 70, rot: -38, d: 1.1 },
  { left: "4%", bottom: "22%", size: 58, rot: 64, d: 1.3 },
  { right: "-3%", bottom: "12%", size: 96, rot: 214, d: 1.0 },
  { left: "-4%", bottom: "-2%", size: 74, rot: -150, d: 1.4 },
];

/** CSS custom properties for the opening animations in globals.css. */
const v = (vars: Record<string, string | number>) => vars as React.CSSProperties;

type Props = {
  partnerOne: string;
  partnerTwo: string;
  shortDate: string;
  /** Called inside the tap itself, so background music is allowed to start. */
  onOpenStart: () => void;
  onOpened: () => void;
};

/**
 * Opening: an ivory paper flower blooms, revealing a deckle-edged
 * "Save the Date" card. Tap the wax seal (or "Open invitation") and the
 * petals sweep outward to reveal the invitation.
 *
 * Every movement here is a CSS transform/opacity animation (`.intro-*` and
 * `.pf-ring` in globals.css), so phones run it on the graphics chip and it
 * stays smooth while the rest of the page is still loading.
 */
export function BloomIntro({ partnerOne, partnerTwo, shortDate, onOpenStart, onOpened }: Props) {
  const reduceMotion = useReducedMotion();
  const [leaving, setLeaving] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const timer = useRef(0);

  useEffect(() => {
    dialogRef.current?.focus({ preventScroll: true });
    return () => window.clearTimeout(timer.current);
  }, []);

  const open = () => {
    if (leaving) return;
    onOpenStart();
    if (reduceMotion) {
      onOpened();
      return;
    }
    setLeaving(true);
    timer.current = window.setTimeout(onOpened, 950);
  };

  // Card contents appear one after another once the flower has opened.
  const line = (i: number) => v({ "--delay": `${1.55 + i * 0.16}s` });

  return (
    <motion.div
      ref={dialogRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="intro-names"
      data-leaving={leaving || undefined}
      className="intro-overlay fixed inset-0 z-[60] overflow-hidden bg-[#F3ECE1] outline-none"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_44%,#FFFCF6_0%,#F5EEE3_48%,#E9DDCA_100%)]"
      />

      {SCATTER.map(({ size, rot, d, ...pos }, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="intro-petal pointer-events-none absolute"
          style={{ ...pos, width: size, height: size, ...v({ "--rot": `${rot}deg`, "--delay": `${d}s` }) }}
        >
          <LoosePetal className="h-full w-full" />
        </div>
      ))}

      <div className="absolute inset-0 flex items-center justify-center pb-16">
        <div className="relative aspect-[5/7] w-[min(62vw,290px)] [--card:min(62vw,290px)]">
          {/* the flower, centred behind the card, slowly breathing once open */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 w-[calc(var(--card)*2.35)] -translate-x-1/2 -translate-y-1/2">
            <div className={leaving || reduceMotion ? "" : "animate-[flower-breathe_14s_ease-in-out_2.6s_infinite_alternate]"}>
              <PaperFlower stage={leaving ? "scatter" : "bloom"} className="w-full" />
            </div>
          </div>

          {/* deckle-edged save-the-date card */}
          <div
            className="intro-rise intro-leave absolute inset-0"
            style={v({
              "--delay": "1.15s",
              "--dur": "1.2s",
              "--from-y": "26px",
              "--from-scale": 0.92,
              "--leave-y": "-18px",
              "--leave-scale": 1.08,
            })}
          >
            <svg
              viewBox={`-6 -6 ${CARD_W + 12} ${CARD_H + 12}`}
              preserveAspectRatio="none"
              aria-hidden="true"
              className="absolute inset-0 h-full w-full overflow-visible drop-shadow-[0_14px_22px_rgba(94,74,44,0.28)]"
            >
              <defs>
                <linearGradient id="intro-paper" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#FDFAF4" />
                  <stop offset="1" stopColor="#F2EADC" />
                </linearGradient>
              </defs>
              <path d={DECKLE} fill="url(#intro-paper)" />
              <path d={DECKLE} fill="none" stroke="#E2D5BE" strokeWidth="0.8" />
              <rect x="13" y="13" width={CARD_W - 26} height={CARD_H - 26} fill="none" stroke="#C7B188" strokeOpacity="0.7" strokeWidth="0.7" />
              <rect x="17" y="17" width={CARD_W - 34} height={CARD_H - 34} fill="none" stroke="#C7B188" strokeOpacity="0.35" strokeWidth="0.5" />
            </svg>

            <div className="relative flex h-full flex-col items-center justify-center px-[12%] pb-[14%] text-center">
              <p
                className="intro-rise font-display text-[clamp(1.05rem,5.2vw,1.45rem)] font-semibold leading-[1.25] tracking-[0.2em] text-[#8C7550] [text-shadow:0_1px_0_rgba(255,255,255,0.9),0_-1px_0_rgba(120,95,55,0.18)]"
                style={line(0)}
              >
                SAVE
                <br />
                THE DATE
              </p>
              <svg viewBox="0 0 60 12" aria-hidden="true" className="intro-rise mt-3 h-3 w-14" style={line(1)}>
                <path d="M2 6h18M40 6h18" stroke="#B49867" strokeWidth="0.8" />
                <path d="M30 1.5 34.5 6 30 10.5 25.5 6Z" fill="#B49867" />
                <path d="M25.5 6c-2.4-2.6-4.8-2.2-5.6 0 .8 2.2 3.2 2.6 5.6 0Zm9 0c2.4-2.6 4.8-2.2 5.6 0-.8 2.2-3.2 2.6-5.6 0Z" fill="#B49867" fillOpacity="0.7" />
              </svg>
              <p className="intro-rise mt-3 font-script text-[clamp(1.35rem,6.4vw,1.75rem)] leading-none text-[#8C7550]" style={line(2)}>
                We&rsquo;re getting married
              </p>
              <p
                id="intro-names"
                className="intro-rise mt-4 font-script text-[clamp(1.9rem,9vw,2.6rem)] leading-[1.05] text-ink"
                style={line(3)}
              >
                {partnerOne} <span className="text-gold-deep">&amp;</span> {partnerTwo}
              </p>
              <div className="intro-rise mt-4 flex items-center gap-2" style={line(4)}>
                <span aria-hidden="true" className="h-px w-6 bg-gold/60" />
                <span className="font-display text-[clamp(0.78rem,3.6vw,0.95rem)] font-semibold tracking-[0.22em] text-ink-soft">
                  {shortDate}
                </span>
                <span aria-hidden="true" className="h-px w-6 bg-gold/60" />
              </div>
            </div>

            {/* wax seal: tap to open */}
            <div className="intro-seal absolute bottom-0 left-1/2 w-[27%] -translate-x-1/2 translate-y-[38%]">
              {!leaving && (
                <span
                  aria-hidden="true"
                  className="absolute inset-[-12%] animate-ping rounded-full bg-wax/10 [animation-duration:2.6s] motion-reduce:hidden"
                />
              )}
              <button
                type="button"
                onClick={open}
                aria-label="Open the invitation"
                className="relative block w-full cursor-pointer rounded-full drop-shadow-[0_8px_10px_rgba(74,24,33,0.35)] transition-transform duration-300 hover:scale-105 active:scale-95"
              >
                <WaxSeal className="block h-auto w-full" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* open button */}
      <div
        className="intro-rise intro-leave absolute inset-x-0 bottom-[max(1.6rem,env(safe-area-inset-bottom))] flex justify-center"
        style={v({ "--delay": "2.7s", "--from-y": "12px" })}
      >
        <button
          type="button"
          onClick={open}
          className="group flex items-center gap-2.5 rounded-full bg-white/90 px-7 py-3 font-display text-[0.8rem] font-semibold tracking-[0.22em] text-ink shadow-[0_12px_28px_-14px_rgba(94,74,44,0.55),inset_0_0_0_1px_rgba(180,152,103,0.55)] transition hover:bg-white"
        >
          OPEN INVITATION
          <svg viewBox="0 0 16 16" aria-hidden="true" className="size-3.5 text-gold-deep motion-safe:animate-bounce" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="m4 6 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}
