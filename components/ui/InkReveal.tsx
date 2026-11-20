"use client";

import { useContext, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { OpenedContext } from "./Reveal";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
};

/**
 * Reveals text left-to-right, like ink being written — after the opening, when in view.
 *
 * The in-view check watches the outer, unclipped span: browsers treat an element
 * hidden by its own clip-path as "not visible", so observing the clipped span
 * itself would never fire.
 */
export function InkReveal({ children, className = "", delay = 0, duration = 1.5 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const opened = useContext(OpenedContext);
  const show = inView && opened;
  return (
    <span ref={ref} className={`inline-block ${className}`}>
      <motion.span
        className="inline-block"
        // a little padding so script swashes aren't clipped
        style={{ paddingInline: "0.12em", marginInline: "-0.12em" }}
        initial={{ clipPath: "inset(-20% 100% -20% 0%)", opacity: 0.2 }}
        animate={show ? { clipPath: "inset(-20% -5% -20% 0%)", opacity: 1 } : undefined}
        transition={{ delay, duration, ease: [0.45, 0, 0.25, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}
