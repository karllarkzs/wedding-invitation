"use client";

import { motion } from "framer-motion";

type Props = {
  id?: string;
  children: React.ReactNode;
  className?: string;
  as?: "h2" | "h3";
};

/** Gold capital title; a soft light sweeps across it once when it comes into view. */
export function ShimmerTitle({ id, children, className = "", as = "h2" }: Props) {
  const Tag = as === "h3" ? motion.h3 : motion.h2;
  return (
    <Tag
      id={id}
      className={`title-display ${className}`}
      initial={{ backgroundPosition: "130% 0" }}
      whileInView={{ backgroundPosition: "-30% 0" }}
      viewport={{ once: true, amount: 0.9 }}
      transition={{ duration: 2.4, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
    >
      {children}
    </Tag>
  );
}
