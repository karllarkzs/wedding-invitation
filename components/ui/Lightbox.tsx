"use client";

import Image from "next/image";
import { useCallback, useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

export type LightboxImage = { src: string; alt: string };

type Props = {
  images: LightboxImage[];
  /** Index of the open photo, or null when closed. */
  index: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

// Portals need `document`, which only exists after hydration.
const noop = () => () => {};
const onClient = () => true;
const onServer = () => false;

/** Full-screen photo viewer (original colors), with swipe, arrows and Esc. */
export function Lightbox({ images, index, onClose, onIndexChange }: Props) {
  const mounted = useSyncExternalStore(noop, onClient, onServer);
  const count = images.length;

  const step = useCallback(
    (dir: 1 | -1) => {
      if (index !== null) onIndexChange((index + dir + count) % count);
    },
    [index, count, onIndexChange],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [index, onClose, step]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {index !== null && (
        <motion.div
          key="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Photo ${index + 1} of ${count}`}
          className="fixed inset-0 z-[70] flex flex-col bg-[#2c2733]/92 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={onClose}
        >
          <div className="flex items-center justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))] text-white/85">
            <span className="text-sm tracking-[0.2em]">
              {index + 1} / {count}
            </span>
            <button
              type="button"
              autoFocus
              onClick={onClose}
              className="grid size-11 place-items-center rounded-full bg-white/10 text-2xl leading-none transition hover:bg-white/20"
              aria-label="Close photo"
            >
              ×
            </button>
          </div>

          <div className="relative flex-1" onClick={(e) => e.stopPropagation()}>
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={index}
                className="absolute inset-4 sm:inset-10"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                drag={count > 1 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.5}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) step(1);
                  else if (info.offset.x > 60) step(-1);
                }}
              >
                <Image
                  src={images[index].src}
                  alt={images[index].alt}
                  fill
                  sizes="100vw"
                  className="pointer-events-none select-none object-contain"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {count > 1 && (
            <div
              className="flex justify-center gap-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => step(-1)}
                className="btn bg-white/10 text-white hover:bg-white/20"
                aria-label="Previous photo"
              >
                ‹ Prev
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                className="btn bg-white/10 text-white hover:bg-white/20"
                aria-label="Next photo"
              >
                Next ›
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
