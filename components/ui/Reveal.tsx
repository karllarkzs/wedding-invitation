"use client";

import { createContext, useContext, useRef } from "react";
import { motion, useInView } from "framer-motion";

/** True once the envelope has been opened (so reveals don't fire behind it). */
export const OpenedContext = createContext(true);

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "li" | "section" | "article";
};

/** Gentle fade-up the first time an element scrolls into view. */
export function Reveal({ children, className, delay = 0, y = 22, as = "div" }: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15, margin: "0px 0px -8% 0px" });
  const opened = useContext(OpenedContext);
  const Tag = motion[as];

  return (
    <Tag
      ref={ref as never}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView && opened ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  );
}
