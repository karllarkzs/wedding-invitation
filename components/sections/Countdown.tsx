"use client";

import { useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Cartouche } from "@/components/art/Cartouche";
import { withIDo } from "@/components/ui/IDo";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Props = {
  /** Ceremony start as an ISO timestamp. */
  target: string;
  googleCalendarUrl: string;
  dateLabel: string;
};

// A once-per-second clock that is `null` on the server (no hydration mismatch).
function subscribe(onTick: () => void) {
  const id = window.setInterval(onTick, 1000);
  return () => window.clearInterval(id);
}
const nowInSeconds = () => Math.floor(Date.now() / 1000);
const serverNow = () => null;

/** A number that rolls softly when it changes. */
function Rolling({
  value,
  className = "",
}: {
  value: string;
  className?: string;
}) {
  return (
    <span
      className={`relative inline-block overflow-hidden align-bottom ${className}`}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          className="block"
          initial={{ y: "-70%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "70%", opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function Countdown({ target, googleCalendarUrl, dateLabel }: Props) {
  const now = useSyncExternalStore(subscribe, nowInSeconds, serverNow);
  const targetSec = Math.floor(new Date(target).getTime() / 1000);
  const remaining = now === null ? null : Math.max(0, targetSec - now);
  const married = remaining === 0;

  const units = [
    {
      label: "Days",
      value: remaining === null ? null : Math.floor(remaining / 86400),
    },
    {
      label: "Hours",
      value: remaining === null ? null : Math.floor((remaining % 86400) / 3600),
    },
    {
      label: "Minutes",
      value: remaining === null ? null : Math.floor((remaining % 3600) / 60),
    },
  ];
  const seconds = remaining === null ? null : remaining % 60;

  return (
    <section
      id="countdown"
      aria-labelledby="countdown-title"
      className="band band-candle px-4 pb-20 pt-16 sm:pb-28 sm:pt-24"
    >
      {married ? (
        <SectionHeading
          id="countdown-title"
          eyebrow={dateLabel}
          title="We're married!"
          subtitle="Thank you for celebrating with us."
        />
      ) : (
        <SectionHeading
          id="countdown-title"
          title="Countdown"
          subtitle={withIDo("until we say I do")}
        />
      )}

      {!married && (
        <>
          <div
            role="timer"
            aria-label={
              remaining === null
                ? "Countdown to the ceremony"
                : `${units[0].value} days, ${units[1].value} hours and ${units[2].value} minutes until the ceremony`
            }
            className="mx-auto mt-10 flex max-w-md justify-center gap-3 sm:gap-6"
          >
            {units.map((u, i) => (
              <Reveal
                key={u.label}
                delay={0.1 + i * 0.14}
                y={26}
                className="w-[30%] max-w-[8.5rem]"
              >
                <Cartouche paper className="w-full">
                  <span
                    className="font-display text-[clamp(1.6rem,7.6vw,2.4rem)] font-semibold leading-none text-gold-deep"
                    aria-hidden="true"
                  >
                    <Rolling
                      value={
                        u.value === null
                          ? "—"
                          : String(u.value).padStart(2, "0")
                      }
                    />
                  </span>
                  <span className="mt-1 font-display text-[clamp(0.52rem,2.3vw,0.66rem)] font-semibold tracking-[0.18em] text-ink-soft">
                    {u.label.toUpperCase()}
                  </span>
                </Cartouche>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.5} className="mt-6 text-center">
            <p
              className="text-[1.15rem] italic text-ink-soft"
              aria-hidden="true"
            >
              and{" "}
              <span className="font-display not-italic font-semibold text-gold-deep">
                <Rolling
                  value={
                    seconds === null ? "—" : String(seconds).padStart(2, "0")
                  }
                />
              </span>{" "}
              seconds
            </p>
          </Reveal>

          <Reveal delay={0.6} className="mt-10 text-center">
            <p className="eyebrow">Add to your calendar</p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
              <a
                className="btn btn-outline px-5 font-display tracking-[0.16em]"
                href={googleCalendarUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Google
                <span className="sr-only">Calendar (opens in a new tab)</span>
              </a>
              <a
                className="btn btn-outline px-5 font-display tracking-[0.16em]"
                href="/calendar.ics"
                download
              >
                Apple · Outlook
              </a>
            </div>
          </Reveal>
        </>
      )}
    </section>
  );
}
