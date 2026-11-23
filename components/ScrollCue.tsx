"use client";

import { useEffect, useState } from "react";

/**
 * A small "Scroll" hint pinned to the bottom of the screen on the first view,
 * so guests on small phones (where the next section is out of sight) know
 * there's more. It appears shortly after the invitation opens and fades away
 * as soon as they start scrolling.
 */
export function ScrollCue() {
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY < 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href="#countdown"
      aria-hidden={!atTop}
      tabIndex={atTop ? 0 : -1}
      // fades in after the names have been written; leaves straight away
      style={{ transitionDelay: atTop ? "2.2s" : "0s" }}
      className={`fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-40 flex -translate-x-1/2 flex-col items-center gap-0.5 rounded-full bg-white/95 px-4 pb-1.5 pt-2 font-display text-[0.62rem] font-semibold tracking-[0.3em] text-ink shadow-[0_10px_24px_-12px_rgba(70,63,82,0.5),inset_0_0_0_1px_rgba(180,152,103,0.55)] transition-opacity duration-500 ${
        atTop ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <span className="pl-[0.3em]">SCROLL</span>
      <svg
        viewBox="0 0 16 16"
        aria-hidden="true"
        className="size-3.5 text-gold-deep motion-safe:animate-bounce"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m4 6 4 4 4-4" />
      </svg>
    </a>
  );
}
