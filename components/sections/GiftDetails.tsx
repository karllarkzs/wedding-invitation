"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

type Qr = { label: string; image: string };

/**
 * A quiet "View gift details" link under the note on gifts. It opens the
 * QR codes (one at a time: GCash / BPI / Security Bank), each with a button
 * to save the image, since guests on a phone can't scan their own screen.
 */
export function GiftDetails({ qrCodes, accountName }: { qrCodes: readonly Qr[]; accountName: string }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  const qr = qrCodes[active];

  // arrow keys move between the tabs, as in any tab list
  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (i + step + qrCodes.length) % qrCodes.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className="mt-7 flex flex-col items-center">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={id}
        className="link-hairline inline-flex cursor-pointer items-center gap-2 font-display text-[0.74rem] font-semibold uppercase tracking-[0.22em] text-gold-deep"
      >
        {open ? "Hide gift details" : "View gift details"}
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className={`size-3 transition-transform duration-500 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m4 6 4 4 4-4" />
        </svg>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            key="details"
            className="w-full overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <div className="mx-auto max-w-xs pb-2 pt-7">
              {/* which bank or e-wallet */}
              <div
                role="tablist"
                aria-label="Send a gift with"
                className="flex rounded-full bg-white/80 p-1 shadow-[inset_0_0_0_1px_rgba(180,152,103,0.45)]"
              >
                {qrCodes.map((q, i) => (
                  <button
                    key={q.label}
                    ref={(el) => {
                      tabs.current[i] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`${id}-tab-${i}`}
                    aria-selected={i === active}
                    aria-controls={`${id}-panel`}
                    tabIndex={i === active ? 0 : -1}
                    onClick={() => setActive(i)}
                    onKeyDown={(e) => onTabKey(e, i)}
                    className={`flex-1 cursor-pointer rounded-full px-2 py-2 text-[0.95rem] font-semibold leading-tight transition-colors duration-300 ${
                      i === active ? "bg-ink text-white shadow-[0_6px_14px_-8px_rgba(70,63,82,0.8)]" : "text-ink-soft hover:text-ink"
                    }`}
                  >
                    {q.label}
                  </button>
                ))}
              </div>

              {/* the QR card */}
              <div
                role="tabpanel"
                id={`${id}-panel`}
                aria-labelledby={`${id}-tab-${active}`}
                className="mt-5 rounded-[1.6rem] bg-white px-6 pb-6 pt-5 text-center shadow-[0_18px_40px_-24px_rgba(70,63,82,0.55),inset_0_0_0_1px_rgba(180,152,103,0.35)]"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={qr.label}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="eyebrow">{qr.label}</p>
                    <Image
                      src={qr.image}
                      alt={`${qr.label} QR code for ${accountName}`}
                      width={480}
                      height={480}
                      unoptimized
                      className="mx-auto mt-3 aspect-square w-full max-w-[15rem]"
                    />
                    <p className="mt-2 text-[1.3rem] font-semibold tracking-[0.02em] text-ink">{accountName}</p>
                    <a
                      href={qr.image}
                      download={`${accountName}-${qr.label.replace(/\s+/g, "")}-QR.png`}
                      className="btn btn-outline mt-5"
                    >
                      Save QR image
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 16 16"
                        className="size-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M8 2.5v8m-3.5-3.5L8 10.5 11.5 7M3 13.5h10" />
                      </svg>
                    </a>
                  </motion.div>
                </AnimatePresence>
              </div>

              <p className="mx-auto mt-4 max-w-[17rem] text-balance text-[0.98rem] italic leading-snug text-ink-soft">
                On your phone? Save the image, then upload it under &ldquo;Scan QR&rdquo; in any bank or e-wallet app.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
