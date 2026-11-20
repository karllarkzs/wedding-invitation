"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { PAUSE_MUSIC, RESUME_MUSIC } from "@/lib/music-events";
import { Reveal } from "@/components/ui/Reveal";

type Props = {
  title: string;
  /** YouTube / Vimeo embed URL (preferred when set). */
  embedSrc: string | null;
  /** A video file in /public. */
  file: string | null;
  poster: string | null;
  vertical: boolean;
  monogram: string;
};

/**
 * The prenup teaser in a cinema-style frame. The cover drifts slowly with a
 * glowing play button; the actual player only loads when a guest taps it
 * (keeping the page light), and the background song pauses while it plays.
 */
export function Teaser({ title, embedSrc, file, poster, vertical, monogram }: Props) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const available = Boolean(embedSrc || file);

  const play = () => {
    window.dispatchEvent(new Event(PAUSE_MUSIC));
    setPlaying(true);
    // Start the file inside the tap itself, so phones allow it to play with sound.
    if (!embedSrc) videoRef.current?.play().catch(() => {});
  };

  return (
    <div className="mx-auto mt-20 max-w-3xl sm:mt-28">
      <Reveal className="text-center">
        <p className="eyebrow">A little film</p>
        <h3 className="mt-2 font-script text-[2.9rem] leading-[1.08] text-ink sm:text-[3.5rem]">{title}</h3>
      </Reveal>

      <Reveal y={30} delay={0.1} className="mt-8">
        <div className={`paper-card mx-auto rounded-[24px] p-2.5 sm:p-3 ${vertical ? "max-w-[340px]" : ""}`}>
          <div
            className={`relative overflow-hidden rounded-[16px] bg-[#211c26] ${vertical ? "aspect-[9/16]" : "aspect-video"}`}
          >
            {embedSrc && playing && (
              <iframe
                src={embedSrc}
                title={title}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            )}
            {!embedSrc && file && (
              <video
                ref={videoRef}
                src={file}
                poster={poster ?? undefined}
                controls={playing}
                playsInline
                preload="none"
                onEnded={() => window.dispatchEvent(new Event(RESUME_MUSIC))}
                className="absolute inset-0 h-full w-full bg-black object-contain"
              />
            )}

            {!playing &&
              (available ? (
                <button type="button" onClick={play} aria-label={`Play ${title}`} className="group absolute inset-0 block">
                  <Cover poster={poster} />
                  {/* bottom-left, like a film title card, so faces in the cover stay visible */}
                  <span className="absolute bottom-6 left-6 flex items-center gap-3 sm:bottom-12 sm:left-12 sm:gap-5">
                    <span className="relative grid size-12 shrink-0 place-items-center sm:size-[72px]">
                      <span aria-hidden="true" className="teaser-halo absolute inset-0 rounded-full border border-white/80" />
                      <span
                        aria-hidden="true"
                        className="teaser-halo absolute inset-0 rounded-full border border-white/60 [animation-delay:1.3s]"
                      />
                      <span className="grid size-full place-items-center rounded-full bg-white/90 shadow-[0_12px_30px_-8px_rgb(0_0_0/0.55),inset_0_0_0_1px_rgb(180_152_103/0.6)] backdrop-blur transition-transform duration-500 group-hover:scale-105">
                        <svg aria-hidden="true" viewBox="0 0 24 24" className="ml-0.5 size-5 text-gold-deep sm:ml-1 sm:size-7" fill="currentColor">
                          <path d="M7 4.6v14.8a.8.8 0 0 0 1.22.68l11.6-7.4a.8.8 0 0 0 0-1.36L8.22 3.92A.8.8 0 0 0 7 4.6Z" />
                        </svg>
                      </span>
                    </span>
                    <span className="text-left font-display text-[0.62rem] font-semibold leading-relaxed tracking-[0.26em] text-white [text-shadow:0_1px_10px_rgb(0_0_0/0.6)] sm:text-[0.76rem] sm:tracking-[0.28em]">
                      PLAY THE
                      <br />
                      TEASER
                    </span>
                  </span>
                </button>
              ) : (
                <div role="img" aria-label={`${title}: coming soon`} className="absolute inset-0">
                  <Cover poster={poster} muted />
                  <span className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <span className="font-script text-[3.2rem] leading-none [text-shadow:0_2px_14px_rgb(0_0_0/0.45)] sm:text-[4rem]">
                      {monogram}
                    </span>
                    <span className="mt-4 font-display text-[0.72rem] font-semibold tracking-[0.3em] [text-shadow:0_1px_10px_rgb(0_0_0/0.55)]">
                      COMING SOON
                    </span>
                  </span>
                </div>
              ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

/** Poster with a soft vignette and viewfinder corner marks. */
function Cover({ poster, muted = false }: { poster: string | null; muted?: boolean }) {
  return (
    <>
      {poster ? (
        <span className="absolute inset-0 overflow-hidden">
          <Image
            src={poster}
            alt=""
            fill
            sizes="(min-width: 768px) 740px, 94vw"
            className={`teaser-drift object-cover ${muted ? "blur-[3px] grayscale-[0.35]" : ""}`}
          />
        </span>
      ) : (
        <span className="absolute inset-0 bg-gradient-to-br from-[#4a4052] to-[#1d1a22]" />
      )}
      <span
        aria-hidden="true"
        className={`absolute inset-0 ${muted ? "bg-[rgb(28_22_32/0.45)]" : "bg-[radial-gradient(ellipse_at_60%_35%,rgb(24_18_28/0.05),rgb(24_18_28/0.5))]"}`}
      />
      {!muted && (
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[rgb(24_18_28/0.6)] to-transparent"
        />
      )}
      {/* viewfinder corners */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-3.5 sm:inset-5">
        <span className="absolute left-0 top-0 size-5 border-l border-t border-white/75 sm:size-7" />
        <span className="absolute right-0 top-0 size-5 border-r border-t border-white/75 sm:size-7" />
        <span className="absolute bottom-0 left-0 size-5 border-b border-l border-white/75 sm:size-7" />
        <span className="absolute bottom-0 right-0 size-5 border-b border-r border-white/75 sm:size-7" />
      </span>
    </>
  );
}
