"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Keeps the entourage short at first: the rest opens smoothly below
 * "View the full entourage", and "Show less" folds it back.
 */
export function EntourageMore({ children, teaser }: { children: React.ReactNode; teaser: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();

  // After folding a long list, bring the section's top back into view (once
  // the fold has finished, so the page isn't changing height mid-scroll).
  const backToTop = () => {
    const section = document.getElementById("entourage");
    if (!section) return;
    const top = section.getBoundingClientRect().top + window.scrollY - 12;
    if (top < window.scrollY) window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <>
      <AnimatePresence initial={false} onExitComplete={backToTop}>
        {open && (
          <motion.div
            id={id}
            key="more"
            className="overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-10 flex flex-col items-center">
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls={id} className="btn btn-outline">
          {open ? "Show less" : "View the full entourage"}
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className={`size-3.5 transition-transform duration-500 ${open ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m4 6 4 4 4-4" />
          </svg>
        </button>
        {!open && <p className="mt-3 max-w-xs text-balance text-[0.98rem] italic text-ink-soft">{teaser}</p>}
      </div>
    </>
  );
}
