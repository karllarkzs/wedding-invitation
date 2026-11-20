"use client";

import { motion } from "framer-motion";

const DRAW = { duration: 1.6, ease: [0.65, 0, 0.35, 1] } as const;

/** Gold filigree divider that draws itself the first time it scrolls into view. Original artwork. */
export function Filigree({ className = "" }: { className?: string }) {
  const line = {
    initial: { pathLength: 0, opacity: 0 },
    whileInView: { pathLength: 1, opacity: 1 },
    viewport: { once: true, amount: 0.8 },
  };
  return (
    <svg viewBox="0 0 220 24" aria-hidden="true" focusable="false" className={`h-6 w-[13.5rem] ${className}`}>
      <g fill="none" stroke="#B49867" strokeWidth="0.9" strokeLinecap="round">
        <motion.path d="M6 12H80" {...line} transition={DRAW} />
        <motion.path d="M214 12H140" {...line} transition={DRAW} />
        <motion.path d="M80 12c6 0 9-6 15-4.5 4.6 1.2 4 7.6-.6 7.6-3.2 0-3.6-3.4-1.2-3.8" {...line} transition={{ ...DRAW, delay: 0.5 }} />
        <motion.path d="M140 12c-6 0-9-6-15-4.5-4.6 1.2-4 7.6.6 7.6 3.2 0 3.6-3.4 1.2-3.8" {...line} transition={{ ...DRAW, delay: 0.5 }} />
      </g>
      <motion.g
        initial={{ opacity: 0, scale: 0.6 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
        fill="#B49867"
      >
        <path d="M110 5.5 116.5 12 110 18.5 103.5 12Z" />
        <path d="M103.5 12c-3.6-3.8-7.4-3.4-8.6 0 1.2 3.4 5 3.8 8.6 0Z" fillOpacity="0.7" />
        <path d="M116.5 12c3.6-3.8 7.4-3.4 8.6 0-1.2 3.4-5 3.8-8.6 0Z" fillOpacity="0.7" />
        <circle cx="110" cy="12" r="1.6" fill="#FFFDF8" />
      </motion.g>
    </svg>
  );
}
