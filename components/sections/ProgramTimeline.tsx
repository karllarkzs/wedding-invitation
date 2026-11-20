"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import type { ProgramIcon as IconName } from "@/config/wedding.config";
import { Cartouche } from "@/components/art/Cartouche";
import { ProgramIcon } from "@/components/art/ProgramIcons";

type Item = { time: string; title: string; detail?: string; icon: IconName };

/**
 * The order of the day: sculpted medallions on the left, a gold line that
 * draws itself as you scroll, and each moment gliding in.
 */
export function ProgramTimeline({ items }: { items: Item[] }) {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 78%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: 0.6 });

  return (
    <ol ref={listRef} className="relative mx-auto mt-12 max-w-md">
      {/* faint track + the drawn gold line */}
      <span aria-hidden="true" className="absolute bottom-8 left-[95px] top-8 w-px bg-gold/15 sm:left-[107px]" />
      <motion.span
        aria-hidden="true"
        className="absolute bottom-8 left-[95px] top-8 w-px origin-top bg-gradient-to-b from-gold via-gold to-gold/50 sm:left-[107px]"
        style={{ scaleY }}
      />
      {items.map((item) => (
        <motion.li
          key={`${item.time}-${item.title}`}
          className="relative grid grid-cols-[68px_30px_minmax(0,1fr)] items-center gap-x-3 py-3 sm:grid-cols-[80px_30px_minmax(0,1fr)]"
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true, amount: 0.6 }}
        >
          <motion.div
            variants={{ hidden: { opacity: 0, scale: 0.7, rotate: -12 }, shown: { opacity: 1, scale: 1, rotate: 0 } }}
            transition={{ type: "spring", stiffness: 170, damping: 15 }}
          >
            <Cartouche shape="round" paper className="w-full">
              <ProgramIcon name={item.icon} className="size-[42%] text-gold-deep" />
            </Cartouche>
          </motion.div>

          <motion.span
            aria-hidden="true"
            className="relative z-[1] mx-auto block size-3 rounded-full border border-gold bg-paper shadow-[0_0_0_4px_rgb(255_253_248/0.9)]"
            variants={{ hidden: { scale: 0 }, shown: { scale: 1 } }}
            transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 14 }}
          />

          <motion.div
            variants={{ hidden: { opacity: 0, x: 26 }, shown: { opacity: 1, x: 0 } }}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-display text-[0.8rem] font-semibold tracking-[0.12em] text-gold-deep">{item.time}</p>
            <p className="text-[1.35rem] font-semibold leading-snug text-ink">{item.title}</p>
            {item.detail && <p className="text-[1.02rem] leading-snug text-ink-soft">{item.detail}</p>}
          </motion.div>
        </motion.li>
      ))}
    </ol>
  );
}
