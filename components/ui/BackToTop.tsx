"use client";

/**
 * "Back to top" at the very end of the page. Scrolls up (smoothly, unless
 * the guest prefers reduced motion — see `scroll-behavior` in globals.css)
 * and moves keyboard focus to the couple's names at the top.
 */
export function BackToTop({ className = "" }: { className?: string }) {
  const toTop = () => {
    window.scrollTo({ top: 0 });
    document.getElementById("hero-names")?.focus({ preventScroll: true });
  };

  return (
    <button
      type="button"
      onClick={toTop}
      className={`group mx-auto flex cursor-pointer flex-col items-center gap-2.5 text-gold-deep ${className}`}
    >
      <span className="grid size-12 place-items-center rounded-full bg-white/90 shadow-[0_10px_24px_-12px_rgba(94,74,44,0.5),inset_0_0_0_1px_rgba(180,152,103,0.55)] transition duration-300 group-hover:-translate-y-1 group-hover:bg-white group-active:scale-95">
        <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="m4 10 4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="font-display text-[0.72rem] font-semibold tracking-[0.26em]">BACK TO TOP</span>
    </button>
  );
}
