"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/**
 * Unveils its content (usually a photo) from the bottom up while it settles
 * from a gentle zoom — the first time it scrolls into view.
 * Fills its (relative) parent.
 *
 * The in-view check watches the outer, unclipped box: an element hidden by its
 * own clip-path never counts as visible, so it can't observe itself.
 */
export function Unveil({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  return (
    <div ref={ref} className={`absolute inset-0 ${className}`}>
      <motion.div
        className="absolute inset-0"
        initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
        animate={inView ? { clipPath: "inset(0% 0% 0% 0%)" } : undefined}
        transition={{ delay, duration: 1.3, ease: [0.76, 0, 0.24, 1] }}
      >
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.14 }}
          animate={inView ? { scale: 1 } : undefined}
          transition={{ delay, duration: 2, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}
