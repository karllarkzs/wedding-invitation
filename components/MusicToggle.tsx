"use client";

import { motion } from "framer-motion";

type Props = { playing: boolean; onToggle: () => void };

/** Small floating mute / unmute button. */
export function MusicToggle({ playing, onToggle }: Props) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      aria-pressed={playing}
      aria-label={playing ? "Pause background music" : "Play background music"}
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 grid size-12 place-items-center rounded-full bg-white/85 text-gold-deep shadow-[0_10px_24px_-12px_rgba(70,63,82,0.5),inset_0_0_0_1px_rgba(180,152,103,0.55)] backdrop-blur transition-colors hover:bg-candle-soft"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 0.6 }}
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 9.5h3.2L12 5.5v13l-4.8-4H4Z" fill="currentColor" fillOpacity="0.12" />
        {playing ? (
          <>
            <path d="M15.4 9.2a4 4 0 0 1 0 5.6" />
            <path d="M17.8 6.8a7.4 7.4 0 0 1 0 10.4" />
          </>
        ) : (
          <path d="m16 9.5 5 5m0-5-5 5" />
        )}
      </svg>
    </motion.button>
  );
}
